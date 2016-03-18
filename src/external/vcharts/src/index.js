let libs = require('./libs');

let templates = {
  axis: require('../templates/axis.json'),
  bar: require('../templates/bar.json'),
  box: require('../templates/box.json'),
  bullet: require('../templates/bullet.json'),
  gantt: require('../templates/gantt.json'),
  histogram: require('../templates/histogram.json'),
  scatter: require('../templates/scatter.json'),
  vega: require('../templates/vega.json'),
  xy: require('../templates/xy.json'),
  xymatrix: require('../templates/xymatrix.json')
};

let d3 = libs.d3;
let vg = libs.vg;

let getNestedRec = function (spec, parts) {
  if (spec === undefined || parts.length === 0) {
    return spec;
  }
  return getNestedRec(spec[parts[0]], parts.slice(1));
};

let getNested = function (spec, name) {
  return getNestedRec(spec, name.split('.'));
};

let setNestedRec = function (spec, parts, value) {
  if (parts.length === 1) {
    spec[parts[0]] = value;
    return;
  }
  if (spec[parts[0]] === undefined) {
    spec[parts[0]] = {};
  }
  setNestedRec(spec[parts[0]], parts.slice(1), value);
};

let setNested = function (spec, name, value) {
  setNestedRec(spec, name.split('.'), value);
};

let templateFunctions = {
  defaults: function (args, options, scope) {
    for (let index = 0; index < args[0].length; index += 1) {
      let value = getNested(scope, args[0][index][0]);
      if (value === undefined) {
        value = getNested(options, args[0][index][0]);
      }
      if (value === undefined) {
        value = transform(args[0][index][1], options, scope);
        setNested(scope, args[0][index][0], value);
      }
    }
    return transform(args[1], options, scope);
  },

  let: function (args, options, scope) {
    for (let index = 0; index < args[0].length; index += 1) {
      let value = transform(args[0][index][1], options, scope);
      setNested(scope, args[0][index][0], value);
    }
    return transform(args[1], options, scope);
  },

  get: function (args, options, scope) {
    let value = getNested(scope, args[0]);
    if (value === undefined) {
      value = getNested(options, args[0]);
    }
    if (value === undefined) {
      value = transform(args[1], options, scope);
    }
    if (value === undefined) {
      value = null;
    }
    return value;
  },

  map: function (args, options, scope) {
    let transformed = [];
    let elements = transform(args[0], options, scope);

    for (let elementIndex = 0; elementIndex < elements.length; elementIndex += 1) {
      scope[args[1]] = elements[elementIndex];
      for (let itemIndex = 2; itemIndex < args.length; itemIndex += 1) {
        let element = transform(args[itemIndex], options, scope);
        if (element !== null) {
          transformed.push(element);
        }
      }
    }
    return transformed;
  },

  if: function (args, options, scope) {
    let condition = transform(args[0], options, scope);
    if (condition) {
      return transform(args[1], options, scope);
    }
    return transform(args[2], options, scope);
  },

  eq: function (args, options, scope) {
    let a = transform(args[0], options, scope);
    let b = transform(args[1], options, scope);
    return (a === b);
  },

  and: function (args, options, scope) {
    let arr = transform(args, options, scope);
    for (let i = 0; i < arr.length; i += 1) {
      if (!arr[i]) {
        return false;
      }
    }
    return true;
  },

  or: function (args, options, scope) {
    let arr = transform(args, options, scope);
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i]) {
        return true;
      }
    }
    return false;
  },

  join: function (args, options, scope) {
    let result = '';
    let sep = transform(args[0], options, scope);
    let arr = transform(args[1], options, scope);
    for (let i = 0; i < arr.length; i += 1) {
      if (i > 0) {
        result += sep;
      }
      result += arr[i];
    }
    return result;
  },

  merge: function (args, options, scope) {
    let merged = transform(args[0], options, scope);
    for (let i = 1; i < args.length; i += 1) {
      merged = merge(merged, transform(args[i], options, scope));
    }
    return merged;
  },

  apply: function (args, options, scope) {
    let templateName = transform(args[0], options, scope);
    let templateOptions = transform(args[1], options, scope);
    return transform(templates[templateName], templateOptions);
  },

  colorScale: function (args, options, scope) {
    let params = transform(args[0], options, scope);
    let name = params.name || 'color';
    if (!Array.isArray(params.values) ||
      params.values.length < 1 ||
      params.values[0][params.field] === undefined ||
      typeof params.values[0][params.field] === 'string') {
      return {
        name: name,
        type: 'ordinal',
        domain: {data: params.data, field: name},
        range: 'category10'
      };
    }
    return {
      name: name,
      type: 'linear',
      zero: false,
      domain: {data: params.data, field: name},
      range: ['#dfd', 'green']
    };
  },

  isStringField: function (args, options, scope) {
    let values = transform(args[0], options, scope);
    let field = transform(args[1], options, scope);

    if (!Array.isArray(values) ||
      values.length < 1 ||
      values[0][field] === undefined ||
      typeof values[0][field] === 'string') {
      return true;
    }
    return false;
  },

  orient: function (args, options, scope) {
    let dir = transform(args[0], options, scope);
    let obj = transform(args[1], options, scope);
    let transformed = {};
    let mapping = {
      x: 'y',
      x2: 'y2',
      xc: 'yc',
      y: 'x',
      y2: 'x2',
      yc: 'xc',
      width: 'height',
      height: 'width'
    };
    if (dir === 'horizontal') {
      return obj;
    }
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (mapping[key]) {
          transformed[mapping[key]] = obj[key];
        } else {
          transformed[key] = obj[key];
        }
      }
    }
    return transformed;
  }
};

let transform = function (spec, options, scope) {
  options = options || {};
  scope = scope || {};

  if (Array.isArray(spec)) {
    if (spec.length > 0 && (typeof spec[0] === 'string') && spec[0].slice(0, 1) === '@') {
      return templateFunctions[spec[0].slice(1)](spec.slice(1), options, scope);
    }
    let transformed = [];
    for (let index = 0; index < spec.length; index += 1) {
      transformed.push(transform(spec[index], options, scope));
    }
    return transformed;
  }
  if (spec === null) {
    return spec;
  }
  if (typeof spec === 'object') {
    let transformed = {};
    for (let key in spec) {
      if (spec.hasOwnProperty(key)) {
        transformed[key] = transform(spec[key], options, scope);
      }
    }
    return transformed;
  }
  return spec;
};

let isObjectLiteral = function (object) {
  return object && object.constructor && object.constructor.name === 'Object';
};

let isArrayLiteral = function (object) {
  return object && object.constructor && object.constructor.name === 'Array';
};

let extend = function (defaults, options) {
  if (options === undefined) {
    return defaults;
  }
  if (isObjectLiteral(defaults)) {
    let extended = {};
    for (let prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = extend(defaults[prop], options[prop]);
      }
    }
    for (let prop in options) {
      if (!Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  }
  if (isArrayLiteral(defaults)) {
    let extended = [];
    for (let index = 0; index < defaults.length; index += 1) {
      extended.push(extend(defaults[index], options[index]));
    }
    if (isArrayLiteral(options)) {
      for (let index = defaults.length; index < options.length; index += 1) {
        extended.push(options[index]);
      }
    }
    return extended;
  }
  return options;
};

let merge = function (defaults, options) {
  if (options === undefined || options === null) {
    return defaults;
  }
  if (defaults === undefined || defaults === null) {
    return options;
  }
  if (isObjectLiteral(defaults)) {
    let extended = {};
    for (let prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = merge(defaults[prop], options[prop]);
      }
    }
    for (let prop in options) {
      if (!Object.prototype.hasOwnProperty.call(extended, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  }
  if (isArrayLiteral(defaults)) {
    let extended = [];
    for (let index = 0; index < defaults.length; index += 1) {
      extended.push(defaults[index]);
    }
    if (isArrayLiteral(options)) {
      for (let index = 0; index < options.length; index += 1) {
        extended.push(options[index]);
      }
    }
    return extended;
  }
  return defaults;
};

let chart = function (type, initialOptions, done) {
  let that = {};

  that.options = {};
  that.template = templates[type];

  that.update = function (newOptions) {
    that.options = extend(that.options, newOptions);

    // Transform pass 1 to get the padding
    let spec = transform(that.template, that.options);

    // Use padding and element size to set size, unless
    // size explicitly specified or element size is zero.
    let el = d3.select(that.options.el)[0][0];
    let sizeOptions = {};

    let style = window.getComputedStyle(el, null);
    let elWidth = window.parseInt(style.getPropertyValue('width'));
    let elHeight = window.parseInt(style.getPropertyValue('height'));

    if (elWidth !== 0 && elHeight !== 0) {
      if (that.options.width === undefined) {
        sizeOptions.width = elWidth;
        if (spec.padding) {
          sizeOptions.width -= spec.padding.left + spec.padding.right;
        }
      }
      if (that.options.height === undefined) {
        sizeOptions.height = elHeight;
        if (spec.padding) {
          sizeOptions.height -= spec.padding.top + spec.padding.bottom;
        }
      }
    }
    let curOptions = extend(that.options, sizeOptions);

    // Options that go directly to Vega runtime
    let vegaOptions = {
      el: curOptions.el,
      renderer: curOptions.renderer
    };

    // Transform pass 2 to get the final visualization
    that.spec = transform(that.template, curOptions);

    console.log(that.spec);

    vg.parse.spec(that.spec, function (chartObj) {
      let chart = chartObj(vegaOptions);
      let printSignal = (name, val) => console.log(name + ': ' + val);
      for (let i = 0; i < that.spec.signals.length; i += 1) {
        chart.onSignal(that.spec.signals[i].name, printSignal);
      }
      chart.update();
      if (done) {
        done(chart);
      }
    });
  };

  that.update(initialOptions);

  return that;
};

module.exports = {
  transform: transform,
  chart: chart,
  templates: templates
};
