(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory();
	else
		root["candela"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _core = __webpack_require__(1);
	
	var _core2 = _interopRequireDefault(_core);
	
	var _components = __webpack_require__(5);
	
	var _components2 = _interopRequireDefault(_components);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  core: _core2.default,
	  components: _components2.default
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _VisualizationComponent = __webpack_require__(2);
	
	var _VisualizationComponent2 = _interopRequireDefault(_VisualizationComponent);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  VisualizationComponent: _VisualizationComponent2.default
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _telegraphEvents = __webpack_require__(3);
	
	var _telegraphEvents2 = _interopRequireDefault(_telegraphEvents);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var VisualizationComponent = function () {
	  function VisualizationComponent(el) {
	    _classCallCheck(this, VisualizationComponent);
	
	    if (!el) {
	      throw new Error('"el" is a required argument');
	    }
	
	    this.el = el;
	
	    (0, _telegraphEvents2.default)(this);
	  }
	
	  _createClass(VisualizationComponent, [{
	    key: 'render',
	    value: function render() {
	      throw new Error('"refresh() is pure abstract"');
	    }
	  }]);
	
	  return VisualizationComponent;
	}();

	exports.default = VisualizationComponent;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var tg = global.telegraph;
	
	__webpack_require__(4);
	module.exports = telegraph;
	
	if (tg)
		global.telegraph = tg;
	else
		delete global.telegraph;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Converts the passed object, or a new object, into an event emitter
	 * @param {object} obj The object to convert
	 * @returns {object} The passed object for chaining
	 */
	telegraph = function (obj) {
	    'use strict';
	
	    obj = obj || {};
	
	    // we store the list of handlers as a local variable inside the scope so
	    // that we don't have to add random properties to the object we are
	    // wrapping. (prefixing variables in the object with an underscore or two is
	    // an ugly solution)
	    var handlers = {};
	
	    /**
	     * Add a listener
	     * @param {string} eventName The name of the event
	     * @param {function} handler The handler function for the event
	     * @param {boolean} front Handler is inserted at the front of the call chain when true
	     * @returns {object} This object for chaining
	     */
	    obj.on = function (eventName, handler, front) {
	        // either use the existing array or create a new one for this event
	        (handlers[eventName] = handlers[eventName] || [])
	            // add the handler to the array
	            [front ? 'unshift' : 'push'](handler);
	
	        return obj;
	    };
	
	    /**
	     * Add a listener that will only be called once
	     * @param {string} eventName The name of the event
	     * @param {function} handler The handler function for the event
	     * @param {boolean} front Handler is inserted at the front of the call chain when true
	     * @returns {object} This object for chaining
	     */
	    obj.once = function (eventName, handler, front) {
	        // create a wrapper listener, that will remove itself after it is called
	        function wrappedHandler() {
	            // remove ourself, and then call the real handler with the args
	            // passed to this wrapper
	            handler.apply(obj.off(eventName, wrappedHandler), arguments);
	        }
	
	        // in order to allow that these wrapped handlers can be removed by
	        // removing the original function, we save a reference to the original
	        // function
	        wrappedHandler.h = handler;
	
	        // call the regular add listener function with our new wrapper
	        return obj.on(eventName, wrappedHandler, front);
	    };
	
	    /**
	     * Remove a listener. Remove all listeners for eventName if handler is
	     * omitted. Remove all listeners for all event names if eventName is also
	     * omitted.
	     * @param {string} eventName The name of the event
	     * @param {function} handler The handler function for the event
	     * @returns {object} This object for chaining
	     */
	    obj.off = function (eventName, handler) {
	        // if no eventName, clear all event handlers for all events
	        if (eventName === undefined) {
	            handlers = {};
	            return obj;
	        } // if
	
	        // loop through all handlers for this eventName to see if the handler
	        // passed in was any of them so we can remove it
	        //		if no handler, clear all handlers for the event instead
	        var list = handler ? handlers[eventName] || [] : [];
	        for (var i = 0; i < list.length; i++) {
	            // either this item is the handler passed in, or this item is a
	            // wrapper for the handler passed in.  See the 'once' function
	            if (list[i] === handler || list[i].h === handler)
	                list.splice(i--, 1);
	        } // for( i )
	
	        // cleanup if no events for the eventName
	        if (!list.length) {
	            // remove the array for this eventname (if it doesn't exist then
	            // this isn't really hurting anything)
	            delete handlers[eventName];
	        } // if
	
	        return obj;
	    };
	
	    /**
	     * Dispatches the named event, calling all registered handler functions. If
	     * any handler returns false, the event subsequent handlers are not called
	     * and false is returned; Otherwise, all handlers are called and true is
	     * returned.
	     * @param {string} eventName The name of the event to dispatch
	     * @returns {boolean} False if any handler returns false, true otherwise.
	     */
	    obj.emit = function (eventName) {
	        // loop through all handlers for this event name and call them all
	        //		arguments is "array-like", so call slice() from list instead
	        //		handlers can return false to cancel event
	        //      copy list in case on()/off() are called during emit
	        var list = handlers[eventName] && handlers[eventName].slice() || [];
	        var args = list.slice.call(arguments, 1);
	        for (var i = 0; i < list.length; ++i) {
	            if (list[i].apply(obj, args) === false)
	                return false;
	        } // for( i )
	
	        return true;
	    };
	
	    return obj;
	}; // telegraph( )


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Scatter = __webpack_require__(6);
	
	var _Scatter2 = _interopRequireDefault(_Scatter);
	
	var _ScatterMatrix = __webpack_require__(177);
	
	var _ScatterMatrix2 = _interopRequireDefault(_ScatterMatrix);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  Scatter: _Scatter2.default,
	  ScatterMatrix: _ScatterMatrix2.default
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _src = __webpack_require__(7);
	
	var _src2 = _interopRequireDefault(_src);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Scatter = function () {
	  _createClass(Scatter, null, [{
	    key: 'options',
	    get: function get() {
	      return [{ name: 'data', type: 'table' }, { name: 'x', type: 'string' }, { name: 'y', type: 'string' }, { name: 'color', type: 'string' }];
	    }
	  }]);
	
	  function Scatter(el, options) {
	    _classCallCheck(this, Scatter);
	
	    var chart = _src2.default.chart('xy', {
	      el: el,
	      series: [{
	        name: 'values',
	        values: options.data,
	        x: options.x,
	        y: options.y
	      }],
	      xAxis: {
	        title: options.x
	      },
	      yAxis: {
	        title: options.y
	      },
	      legend: false
	    });
	    window.onresize = function () {
	      return chart.update();
	    };
	  }
	
	  return Scatter;
	}();

	exports.default = Scatter;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var libs = __webpack_require__(8);
	
	var templates = {
	  axis: __webpack_require__(168),
	  bar: __webpack_require__(169),
	  box: __webpack_require__(170),
	  bullet: __webpack_require__(171),
	  gantt: __webpack_require__(172),
	  histogram: __webpack_require__(173),
	  vega: __webpack_require__(174),
	  xy: __webpack_require__(175),
	  xymatrix: __webpack_require__(176)
	};
	
	var d3 = libs.d3;
	var vg = libs.vg;
	
	var getNestedRec = function getNestedRec(spec, parts) {
	  if (spec === undefined || parts.length === 0) {
	    return spec;
	  }
	  return getNestedRec(spec[parts[0]], parts.slice(1));
	};
	
	var getNested = function getNested(spec, name) {
	  return getNestedRec(spec, name.split('.'));
	};
	
	var setNestedRec = function setNestedRec(spec, parts, value) {
	  if (parts.length === 1) {
	    spec[parts[0]] = value;
	    return;
	  }
	  if (spec[parts[0]] === undefined) {
	    spec[parts[0]] = {};
	  }
	  setNestedRec(spec[parts[0]], parts.slice(1), value);
	};
	
	var setNested = function setNested(spec, name, value) {
	  setNestedRec(spec, name.split('.'), value);
	};
	
	var templateFunctions = {
	  defaults: function defaults(args, options, scope) {
	    var index, value;
	    for (index = 0; index < args[0].length; index += 1) {
	      value = getNested(scope, args[0][index][0]);
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
	
	  let: function _let(args, options, scope) {
	    var index, value;
	    for (index = 0; index < args[0].length; index += 1) {
	      value = transform(args[0][index][1], options, scope);
	      setNested(scope, args[0][index][0], value);
	    }
	    return transform(args[1], options, scope);
	  },
	
	  get: function get(args, options, scope) {
	    var value;
	    value = getNested(scope, args[0]);
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
	
	  map: function map(args, options, scope) {
	    var transformed = [],
	        elements = transform(args[0], options, scope),
	        elementIndex,
	        itemIndex,
	        element;
	
	    for (elementIndex = 0; elementIndex < elements.length; elementIndex += 1) {
	      scope[args[1]] = elements[elementIndex];
	      for (itemIndex = 2; itemIndex < args.length; itemIndex += 1) {
	        element = transform(args[itemIndex], options, scope);
	        if (element !== null) {
	          transformed.push(element);
	        }
	      }
	    }
	    return transformed;
	  },
	
	  if: function _if(args, options, scope) {
	    var condition = transform(args[0], options, scope);
	    if (condition) {
	      return transform(args[1], options, scope);
	    }
	    return transform(args[2], options, scope);
	  },
	
	  eq: function eq(args, options, scope) {
	    var a = transform(args[0], options, scope),
	        b = transform(args[1], options, scope);
	    return a === b;
	  },
	
	  join: function join(args, options, scope) {
	    var i,
	        join,
	        arr,
	        result = "";
	    var sep = transform(args[0], options, scope);
	    arr = transform(args[1], options, scope);
	    for (i = 0; i < arr.length; i += 1) {
	      if (i > 0) {
	        result += sep;
	      }
	      result += arr[i];
	    }
	    return result;
	  },
	
	  merge: function merge(args, options, scope) {
	    var i,
	        merged = transform(args[0], options, scope);
	    for (i = 1; i < args.length; i += 1) {
	      merged = _merge(merged, transform(args[i], options, scope));
	    }
	    return merged;
	  },
	
	  apply: function apply(args, options, scope) {
	    var templateName = transform(args[0], options, scope),
	        templateOptions = transform(args[1], options, scope);
	    return transform(templates[templateName], templateOptions);
	  },
	
	  orient: function orient(args, options, scope) {
	    var dir = transform(args[0], options, scope),
	        obj = transform(args[1], options, scope),
	        key,
	        transformed = {},
	        mapping = {
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
	    for (key in obj) {
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
	
	var transform = function transform(spec, options, scope) {
	  var transformed, index, key;
	
	  options = options || {};
	  scope = scope || {};
	
	  if (Array.isArray(spec)) {
	    if (spec.length > 0 && typeof spec[0] === 'string' && spec[0].slice(0, 1) === '@') {
	      return templateFunctions[spec[0].slice(1)](spec.slice(1), options, scope);
	    }
	    transformed = [];
	    for (index = 0; index < spec.length; index += 1) {
	      transformed.push(transform(spec[index], options, scope));
	    }
	    return transformed;
	  }
	  if (spec === null) {
	    return spec;
	  }
	  if ((typeof spec === 'undefined' ? 'undefined' : _typeof(spec)) === 'object') {
	    transformed = {};
	    for (key in spec) {
	      if (spec.hasOwnProperty(key)) {
	        transformed[key] = transform(spec[key], options, scope);
	      }
	    }
	    return transformed;
	  }
	  return spec;
	};
	
	var isObjectLiteral = function isObjectLiteral(object) {
	  return object && object.constructor && object.constructor.name === 'Object';
	};
	
	var isArrayLiteral = function isArrayLiteral(object) {
	  return object && object.constructor && object.constructor.name === 'Array';
	};
	
	var extend = function extend(defaults, options) {
	  var extended, prop, index;
	  if (options === undefined) {
	    return defaults;
	  }
	  if (isObjectLiteral(defaults)) {
	    extended = {};
	    for (prop in defaults) {
	      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
	        extended[prop] = extend(defaults[prop], options[prop]);
	      }
	    }
	    for (prop in options) {
	      if (!Object.prototype.hasOwnProperty.call(defaults, prop)) {
	        extended[prop] = options[prop];
	      }
	    }
	    return extended;
	  }
	  if (isArrayLiteral(defaults)) {
	    extended = [];
	    for (index = 0; index < defaults.length; index += 1) {
	      extended.push(extend(defaults[index], options[index]));
	    }
	    if (isArrayLiteral(options)) {
	      for (index = defaults.length; index < options.length; index += 1) {
	        extended.push(options[index]);
	      }
	    }
	    return extended;
	  }
	  return options;
	};
	
	var _merge = function _merge(defaults, options) {
	  var extended, prop, index;
	  if (options === undefined || options === null) {
	    return defaults;
	  }
	  if (defaults === undefined || defaults === null) {
	    return options;
	  }
	  if (isObjectLiteral(defaults)) {
	    extended = {};
	    for (prop in defaults) {
	      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
	        extended[prop] = _merge(defaults[prop], options[prop]);
	      }
	    }
	    for (prop in options) {
	      if (!Object.prototype.hasOwnProperty.call(extended, prop)) {
	        extended[prop] = options[prop];
	      }
	    }
	    return extended;
	  }
	  if (isArrayLiteral(defaults)) {
	    extended = [];
	    for (index = 0; index < defaults.length; index += 1) {
	      extended.push(defaults[index]);
	    }
	    if (isArrayLiteral(options)) {
	      for (index = 0; index < options.length; index += 1) {
	        extended.push(options[index]);
	      }
	    }
	    return extended;
	  }
	  return defaults;
	};
	
	var chart = function chart(type, initialOptions, done) {
	  var that = {};
	
	  that.options = {};
	  that.template = templates[type];
	
	  that.update = function (newOptions) {
	    var vegaOptions, spec, sizeOptions, curOptions, el;
	
	    that.options = extend(that.options, newOptions);
	
	    // Transform pass 1 to get the padding
	    spec = transform(that.template, that.options);
	
	    // Use padding and element size to set size, unless
	    // size explicitly specified or element size is zero.
	    el = d3.select(that.options.el)[0][0];
	    sizeOptions = {};
	    if (el.offsetWidth !== 0 && el.offsetHeight !== 0) {
	      if (that.options.width === undefined) {
	        sizeOptions.width = el.offsetWidth;
	        if (spec.padding) {
	          sizeOptions.width -= spec.padding.left + spec.padding.right;
	        }
	      }
	      if (that.options.height === undefined) {
	        sizeOptions.height = el.offsetHeight;
	        if (spec.padding) {
	          sizeOptions.height -= spec.padding.top + spec.padding.bottom;
	        }
	      }
	    }
	    curOptions = extend(that.options, sizeOptions);
	
	    // Options that go directly to Vega runtime
	    vegaOptions = {
	      el: curOptions.el,
	      renderer: curOptions.renderer
	    };
	
	    // Transform pass 2 to get the final visualization
	    that.spec = transform(that.template, curOptions);
	
	    vg.parse.spec(that.spec, function (chartObj) {
	      var chart = chartObj(vegaOptions);
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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(vg) {"use strict";
	
	module.exports = {
	  d3: d3,
	  vg: vg
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  version: '__VERSION__',
	  dataflow: __webpack_require__(10),
	  parse: __webpack_require__(58),
	  scene: {
	    Bounder: __webpack_require__(159),
	    Builder: __webpack_require__(157),
	    Encoder: __webpack_require__(158),
	    GroupBuilder: __webpack_require__(156),
	    visit: __webpack_require__(161)
	  },
	  transforms: __webpack_require__(109),
	  Transform: __webpack_require__(111),
	  BatchTransform: __webpack_require__(115),
	  Parameter: __webpack_require__(112),
	  schema: __webpack_require__(167),
	  config: __webpack_require__(162),
	  util: __webpack_require__(64),
	  logging: __webpack_require__(14),
	  debug: __webpack_require__(14).debug
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  ChangeSet:    __webpack_require__(11),
	  Collector:    __webpack_require__(13),
	  DataSource:   __webpack_require__(17),
	  Dependencies: __webpack_require__(12),
	  Graph:        __webpack_require__(55),
	  Node:         __webpack_require__(16),
	  Signal:       __webpack_require__(57),
	  Tuple:        __webpack_require__(15),
	  debug:        __webpack_require__(14).debug
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var DEPS = __webpack_require__(12).ALL;
	
	function create(cs, reflow) {
	  var out = {};
	  copy(cs, out);
	
	  out.add = [];
	  out.mod = [];
	  out.rem = [];
	
	  out.reflow = reflow;
	
	  return out;
	}
	
	function copy(a, b) {
	  b.stamp = a ? a.stamp : 0;
	  b.sort  = a ? a.sort  : null;
	  b.facet = a ? a.facet : null;
	  b.trans = a ? a.trans : null;
	  b.dirty = a ? a.dirty : [];
	  b.request = a ? a.request : null;
	  for (var d, i=0, n=DEPS.length; i<n; ++i) {
	    b[d=DEPS[i]] = a ? a[d] : {};
	  }
	}
	
	module.exports = {
	  create: create,
	  copy: copy
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	var deps = module.exports = {
	  ALL: ['data', 'fields', 'scales', 'signals']
	};
	deps.ALL.forEach(function(k) { deps[k.toUpperCase()] = k; });


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var log = __webpack_require__(14),
	    Tuple = __webpack_require__(15),
	    Base = __webpack_require__(16).prototype,
	    ChangeSet = __webpack_require__(11);
	
	function Collector(graph) {
	  Base.init.call(this, graph);
	  this._data = [];
	  this.router(true).collector(true);
	}
	
	var prototype = (Collector.prototype = Object.create(Base));
	prototype.constructor = Collector;
	
	prototype.data = function() {
	  return this._data;
	};
	
	prototype.evaluate = function(input) {
	  log.debug(input, ["collecting"]);
	
	  // Create a new output changeset to prevent pollution when the Graph
	  // merges reflow and regular changesets.
	  var output = ChangeSet.create(input);
	
	  if (input.rem.length) {
	    this._data = Tuple.idFilter(this._data, input.rem);
	    output.rem = input.rem.slice(0);
	  }
	
	  if (input.add.length) {
	    this._data = this._data.concat(input.add);
	    output.add = input.add.slice(0);
	  }
	
	  if (input.mod.length) {
	    output.mod = input.mod.slice(0);
	  }
	
	  if (input.sort) {
	    this._data.sort(input.sort);
	  }
	
	  if (input.reflow) {
	    output.mod = output.mod.concat(
	      Tuple.idFilter(this._data, output.add, output.mod, output.rem));
	    output.reflow = false;
	  }
	
	  return output;
	};
	
	module.exports = Collector;

/***/ },
/* 14 */
/***/ function(module, exports) {

	var ts = Date.now();
	
	function write(msg) {
	  console.log('[Vega Log]', msg);
	}
	
	function error(msg) {
	  console.error('[Vega Err]', msg);
	}
	
	function debug(input, args) {
	  if (!debug.enable) return;
	  var log = Function.prototype.bind.call(console.log, console);
	  var state = {
	    prevTime:  Date.now() - ts,
	    stamp: input.stamp
	  };
	
	  if (input.add) {
	    state.add = input.add.length;
	    state.mod = input.mod.length;
	    state.rem = input.rem.length;
	    state.reflow = !!input.reflow;
	  }
	
	  log.apply(console, (args.push(JSON.stringify(state)), args));
	  ts = Date.now();
	}
	
	module.exports = {
	  log:   write,
	  error: error,
	  debug: (debug.enable = false, debug)
	};


/***/ },
/* 15 */
/***/ function(module, exports) {

	var tupleID = 0;
	
	function ingest(datum) {
	  datum = (datum === Object(datum)) ? datum : {data: datum};
	  datum._id = ++tupleID;
	  if (datum._prev) datum._prev = null;
	  return datum;
	}
	
	function idMap(a, ids) {
	  ids = ids || {};
	  for (var i=0, n=a.length; i<n; ++i) {
	    ids[a[i]._id] = 1;
	  }
	  return ids;
	}
	
	function copy(t, c) {
	  c = c || {};
	  for (var k in t) {
	    if (k !== '_prev' && k !== '_id') c[k] = t[k];
	  }
	  return c;
	}
	
	module.exports = {
	  ingest: ingest,
	  idMap: idMap,
	
	  derive: function(d) {
	    return ingest(copy(d));
	  },
	
	  rederive: function(d, t) {
	    return copy(d, t);
	  },
	
	  set: function(t, k, v) {
	    return t[k] === v ? 0 : (t[k] = v, 1);
	  },
	
	  prev: function(t) {
	    return t._prev || t;
	  },
	
	  prev_init: function(t) {
	    if (!t._prev) { t._prev = {_id: t._id}; }
	  },
	
	  prev_update: function(t) {
	    var p = t._prev, k, v;
	    if (p) for (k in t) {
	      if (k !== '_prev' && k !== '_id') {
	        p[k] = ((v=t[k]) instanceof Object && v._prev) ? v._prev : v;
	      }
	    }
	  },
	
	  reset: function() { tupleID = 0; },
	
	  idFilter: function(data) {
	    var ids = {};
	    for (var i=arguments.length; --i>0;) {
	      idMap(arguments[i], ids);
	    }
	    return data.filter(function(x) { return !ids[x._id]; });
	  }
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var DEPS = __webpack_require__(12).ALL,
	    nodeID = 0;
	
	function Node(graph) {
	  if (graph) this.init(graph);
	}
	
	var Flags = Node.Flags = {
	  Router:     0x01, // Responsible for propagating tuples, cannot be skipped.
	  Collector:  0x02, // Holds a materialized dataset, pulse node to reflow.
	  Produces:   0x04, // Produces new tuples. 
	  Mutates:    0x08, // Sets properties of incoming tuples.
	  Reflows:    0x10, // Forwards a reflow pulse.
	  Batch:      0x20  // Performs batch data processing, needs collector.
	};
	
	var prototype = Node.prototype;
	
	prototype.init = function(graph) {
	  this._id = ++nodeID;
	  this._graph = graph;
	  this._rank  = graph.rank(); // Topological sort by rank
	  this._qrank = null; // Rank when enqueued for propagation
	  this._stamp = 0;    // Last stamp seen
	
	  this._listeners = [];
	  this._listeners._ids = {}; // To prevent duplicate listeners
	
	  // Initialize dependencies.
	  this._deps = {};
	  for (var i=0, n=DEPS.length; i<n; ++i) {
	    this._deps[DEPS[i]] = [];
	  }
	
	  // Initialize status flags.
	  this._flags = 0;
	
	  return this;
	};
	
	prototype.rank = function() {
	  return this._rank;
	};
	
	prototype.rerank = function() {
	  var g = this._graph, 
	      q = [this],
	      cur;
	
	  while (q.length) {
	    cur = q.shift();
	    cur._rank = g.rank();
	    q.unshift.apply(q, cur.listeners());
	  }
	
	  return this;
	};
	
	prototype.qrank = function(/* set */) {
	  if (!arguments.length) return this._qrank;
	  return (this._qrank = this._rank, this);
	};
	
	prototype.last = function(stamp) { 
	  if (!arguments.length) return this._stamp;
	  return (this._stamp = stamp, this);
	};
	
	// -- status flags ---
	
	prototype._setf = function(v, b) {
	  if (b) { this._flags |= v; } else { this._flags &= ~v; }
	  return this;
	};
	
	prototype.router = function(state) {
	  if (!arguments.length) return (this._flags & Flags.Router);
	  return this._setf(Flags.Router, state);
	};
	
	prototype.collector = function(state) {
	  if (!arguments.length) return (this._flags & Flags.Collector);
	  return this._setf(Flags.Collector, state);
	};
	
	prototype.produces = function(state) {
	  if (!arguments.length) return (this._flags & Flags.Produces);
	  return this._setf(Flags.Produces, state);
	};
	
	prototype.mutates = function(state) {
	  if (!arguments.length) return (this._flags & Flags.Mutates);
	  return this._setf(Flags.Mutates, state);
	};
	
	prototype.reflows = function(state) {
	  if (!arguments.length) return (this._flags & Flags.Reflows);
	  return this._setf(Flags.Reflows, state);
	};
	
	prototype.batch = function(state) {
	  if (!arguments.length) return (this._flags & Flags.Batch);
	  return this._setf(Flags.Batch, state);
	};
	
	prototype.dependency = function(type, deps) {
	  var d = this._deps[type],
	      n = d._names || (d._names = {});  // To prevent dupe deps
	
	  // Get dependencies of the given type
	  if (arguments.length === 1) {
	    return d;
	  }
	
	  if (deps === null) {
	    // Clear dependencies of the given type
	    d.splice(0, d.length);
	    d._names = {};
	  } else if (!Array.isArray(deps)) {
	    // Separate this case to avoid cost of array creation
	    if (n[deps]) return this;
	    d.push(deps);
	    n[deps] = 1;
	  } else {
	    for (var i=0, len=deps.length, dep; i<len; ++i) {
	      dep = deps[i];
	      if (n[dep]) continue;
	      d.push(dep);
	      n[dep] = 1;
	    }
	  }
	
	  return this;
	};
	
	prototype.listeners = function() {
	  return this._listeners;
	};
	
	prototype.addListener = function(l) {
	  if (!(l instanceof Node)) {
	    throw Error('Listener is not a Node');
	  }
	  if (this._listeners._ids[l._id]) return this;
	
	  this._listeners.push(l);
	  this._listeners._ids[l._id] = 1;
	  if (this._rank > l._rank) {
	    l.rerank();
	  }
	
	  return this;
	};
	
	prototype.removeListener = function(l) {
	  if (!this._listeners._ids[l._id]) return false;
	  
	  var idx = this._listeners.indexOf(l),
	      b = idx >= 0;
	
	  if (b) {
	    this._listeners.splice(idx, 1);
	    this._listeners._ids[l._id] = null;
	  }
	  return b;
	};
	
	prototype.disconnect = function() {
	  this._listeners = [];
	  this._listeners._ids = {};
	};
	
	// Evaluate this dataflow node for the current pulse.
	// Subclasses should override to perform custom processing.
	prototype.evaluate = function(pulse) {
	  return pulse;
	};
	
	// Should this node be re-evaluated for the current pulse?
	// Searches pulse to see if any dependencies have updated.
	prototype.reevaluate = function(pulse) {
	  var prop, dep, i, n, j, m;
	
	  for (i=0, n=DEPS.length; i<n; ++i) {
	    prop = DEPS[i];
	    dep = this._deps[prop];
	    for (j=0, m=dep.length; j<m; ++j) {
	      if (pulse[prop][dep[j]]) return true;
	    }
	  }
	
	  return false;
	};
	
	Node.reset = function() { nodeID = 0; };
	
	module.exports = Node;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    ChangeSet = __webpack_require__(11),
	    Collector = __webpack_require__(13),
	    Tuple = __webpack_require__(15),
	    Node = __webpack_require__(16); // jshint ignore:line
	
	function DataSource(graph, name, facet) {
	  this._graph = graph;
	  this._name = name;
	  this._data = [];
	  this._source = null;
	  this._facet  = facet;
	  this._input  = ChangeSet.create();
	  this._output = null; // Output changeset
	  this._indexes = {};
	  this._indexFields = [];
	
	  this._inputNode  = null;
	  this._outputNode = null;
	  this._pipeline  = null; // Pipeline of transformations.
	  this._collector = null; // Collector to materialize output of pipeline.
	  this._mutates = false;  // Does any pipeline operator mutate tuples?
	}
	
	var prototype = DataSource.prototype;
	
	prototype.name = function(name) {
	  if (!arguments.length) return this._name;
	  return (this._name = name, this);
	};
	
	prototype.source = function(src) {
	  if (!arguments.length) return this._source;
	  return (this._source = this._graph.data(src));
	};
	
	prototype.insert = function(tuples) {
	  this._input.add = this._input.add.concat(tuples.map(Tuple.ingest));
	  return this;
	};
	
	prototype.remove = function(where) {
	  var remove = this._data.filter(where);
	  this._input.rem = this._input.rem.concat(remove);
	  return this;
	};
	
	prototype.update = function(where, field, func) {
	  var mod = this._input.mod,
	      ids = Tuple.idMap(mod);
	
	  this._input.fields[field] = 1;
	
	  this._data.filter(where).forEach(function(x) {
	    var prev = x[field],
	        next = func(x);
	    if (prev !== next) {
	      Tuple.set(x, field, next);
	      if (ids[x._id] !== 1) {
	        mod.push(x);
	        ids[x._id] = 1;
	      }
	    }
	  });
	
	  return this;
	};
	
	prototype.values = function(data) {
	  if (!arguments.length) return this._collector.data();
	
	  // Replace backing data
	  this._input.rem = this._data.slice();
	  if (data) { this.insert(data); }
	  return this;
	};
	
	prototype.mutates = function(m) {
	  if (!arguments.length) return this._mutates;
	  this._mutates = this._mutates || m;
	  return this;
	};
	
	prototype.last = function() {
	  return this._output;
	};
	
	prototype.fire = function(input) {
	  if (input) this._input = input;
	  this._graph.propagate(this._input, this._pipeline[0]);
	  return this;
	};
	
	prototype.pipeline = function(pipeline) {
	  if (!arguments.length) return this._pipeline;
	
	  var graph = this._graph,
	      status;
	
	  pipeline.unshift(this._inputNode = DataSourceInput(this));
	  status = graph.preprocess(pipeline);
	
	  if (status.router) {
	    pipeline.push(status.collector = new Collector(graph));
	  }
	
	  pipeline.push(this._outputNode = DataSourceOutput(this));
	  this._collector = status.collector;
	  this._mutates = !!status.mutates;
	  graph.connect(this._pipeline = pipeline);
	
	  return this;
	};
	
	prototype.synchronize = function() {
	  this._graph.synchronize(this._pipeline);
	  return this;
	};
	
	prototype.getIndex = function(field) {
	  var data = this.values(),
	      indexes = this._indexes,
	      fields  = this._indexFields,
	      f = dl.$(field),
	      index, i, len, value;
	
	  if (!indexes[field]) {
	    indexes[field] = index = {};
	    fields.push(field);
	    for (i=0, len=data.length; i<len; ++i) {
	      value = f(data[i]);
	      index[value] = (index[value] || 0) + 1;
	      Tuple.prev_init(data[i]);
	    }
	  }
	  return indexes[field];
	};
	
	prototype.listener = function() {
	  return DataSourceListener(this).addListener(this._inputNode);
	};
	
	prototype.addListener = function(l) {
	  if (l instanceof DataSource) {
	    this._collector.addListener(l.listener());
	  } else {
	    this._outputNode.addListener(l);
	  }
	  return this;
	};
	
	prototype.removeListener = function(l) {
	  this._outputNode.removeListener(l);
	};
	
	prototype.listeners = function(ds) {
	  return (ds ? this._collector : this._outputNode).listeners();
	};
	
	// Input node applies the datasource's delta, and propagates it to
	// the rest of the pipeline. It receives touches to reflow data.
	function DataSourceInput(ds) {
	  var input = new Node(ds._graph)
	    .router(true)
	    .collector(true);
	
	  input.data = function() {
	    return ds._data;
	  };
	
	  input.evaluate = function(input) {
	    log.debug(input, ['input', ds._name]);
	
	    var delta = ds._input,
	        out = ChangeSet.create(input), f;
	
	    // Delta might contain fields updated through API
	    for (f in delta.fields) {
	      out.fields[f] = 1;
	    }
	
	    // update data
	    if (delta.rem.length) {
	      ds._data = Tuple.idFilter(ds._data, delta.rem);
	    }
	
	    if (delta.add.length) {
	      ds._data = ds._data.concat(delta.add);
	    }
	
	    if (delta.sort) {
	      ds._data.sort(delta.sort);
	    }
	
	    // if reflowing, add any other tuples not currently in changeset
	    if (input.reflow) {
	      delta.mod = delta.mod.concat(
	        Tuple.idFilter(ds._data, delta.add, delta.mod, delta.rem));
	    }
	
	    // reset change list
	    ds._input = ChangeSet.create();
	
	    out.add = delta.add;
	    out.mod = delta.mod;
	    out.rem = delta.rem;
	    out.facet = ds._facet;
	    return out;
	  };
	
	  return input;
	}
	
	// Output node captures the last changeset seen by this datasource
	// (needed for joins and builds) and materializes any nested data.
	// If this datasource is faceted, materializes the values in the facet.
	function DataSourceOutput(ds) {
	  var output = new Node(ds._graph)
	    .router(true)
	    .reflows(true)
	    .collector(true);
	
	  function updateIndices(pulse) {
	    var fields = ds._indexFields,
	        i, j, f, key, index, value;
	
	    for (i=0; i<fields.length; ++i) {
	      key = fields[i];
	      index = ds._indexes[key];
	      f = dl.$(key);
	
	      for (j=0; j<pulse.add.length; ++j) {
	        value = f(pulse.add[j]);
	        Tuple.prev_init(pulse.add[j]);
	        index[value] = (index[value] || 0) + 1;
	      }
	      for (j=0; j<pulse.rem.length; ++j) {
	        value = f(pulse.rem[j]);
	        index[value] = (index[value] || 0) - 1;
	      }
	      for (j=0; j<pulse.mod.length; ++j) {
	        value = f(pulse.mod[j]._prev);
	        index[value] = (index[value] || 0) - 1;
	        value = f(pulse.mod[j]);
	        index[value] = (index[value] || 0) + 1;
	      }
	    }
	  }
	
	  output.data = function() {
	    return ds._collector ? ds._collector.data() : ds._data;
	  };
	
	  output.evaluate = function(input) {
	    log.debug(input, ['output', ds._name]);
	
	    updateIndices(input);
	    var out = ChangeSet.create(input, true);
	
	    if (ds._facet) {
	      ds._facet.values = ds.values();
	      input.facet = null;
	    }
	
	    ds._output = input;
	    out.data[ds._name] = 1;
	    return out;
	  };
	
	  return output;
	}
	
	function DataSourceListener(ds) {
	  var l = new Node(ds._graph).router(true);
	
	  l.evaluate = function(input) {
	    // Tuple derivation carries a cost. So only derive if the pipeline has
	    // operators that mutate, and thus would override the source data.
	    if (ds.mutates()) {
	      var map = ds._srcMap || (ds._srcMap = {}), // to propagate tuples correctly
	          output = ChangeSet.create(input);
	
	      output.add = input.add.map(function(t) {
	        return (map[t._id] = Tuple.derive(t));
	      });
	
	      output.mod = input.mod.map(function(t) {
	        return Tuple.rederive(t, map[t._id]);
	      });
	
	      output.rem = input.rem.map(function(t) {
	        var o = map[t._id];
	        return (map[t._id] = null, o);
	      });
	
	      return (ds._input = output);
	    } else {
	      return (ds._input = input);
	    }
	  };
	
	  return l;
	}
	
	module.exports = DataSource;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	
	var dl = {
	  version:    '__VERSION__',
	  load:       __webpack_require__(24),
	  read:       __webpack_require__(29),
	  type:       __webpack_require__(30),
	  Aggregator: __webpack_require__(42),
	  groupby:    __webpack_require__(47),
	  bins:       __webpack_require__(48),
	  $bin:       __webpack_require__(50).$bin,
	  histogram:  __webpack_require__(50).histogram,
	  format:     __webpack_require__(38),
	  template:   __webpack_require__(51),
	  time:       __webpack_require__(49)
	};
	
	util.extend(dl, util);
	util.extend(dl, __webpack_require__(52));
	util.extend(dl, __webpack_require__(45));
	util.extend(dl, __webpack_require__(44));
	util.extend(dl, __webpack_require__(53));
	util.extend(dl.format, __webpack_require__(54));
	
	// backwards-compatible, deprecated API
	// will remove in the future
	dl.print = {
	  table:   dl.format.table,
	  summary: dl.format.summary
	};
	
	module.exports = dl;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {var u = module.exports;
	
	// utility functions
	
	var FNAME = '__name__';
	
	u.namedfunc = function(name, f) { return (f[FNAME] = name, f); };
	
	u.name = function(f) { return f==null ? null : f[FNAME]; };
	
	u.identity = function(x) { return x; };
	
	u.true = u.namedfunc('true', function() { return true; });
	
	u.false = u.namedfunc('false', function() { return false; });
	
	u.duplicate = function(obj) {
	  return JSON.parse(JSON.stringify(obj));
	};
	
	u.equal = function(a, b) {
	  return JSON.stringify(a) === JSON.stringify(b);
	};
	
	u.extend = function(obj) {
	  for (var x, name, i=1, len=arguments.length; i<len; ++i) {
	    x = arguments[i];
	    for (name in x) { obj[name] = x[name]; }
	  }
	  return obj;
	};
	
	u.length = function(x) {
	  return x != null && x.length != null ? x.length : null;
	};
	
	u.keys = function(x) {
	  var keys = [], k;
	  for (k in x) keys.push(k);
	  return keys;
	};
	
	u.vals = function(x) {
	  var vals = [], k;
	  for (k in x) vals.push(x[k]);
	  return vals;
	};
	
	u.toMap = function(list, f) {
	  return (f = u.$(f)) ?
	    list.reduce(function(obj, x) { return (obj[f(x)] = 1, obj); }, {}) :
	    list.reduce(function(obj, x) { return (obj[x] = 1, obj); }, {});
	};
	
	u.keystr = function(values) {
	  // use to ensure consistent key generation across modules
	  var n = values.length;
	  if (!n) return '';
	  for (var s=String(values[0]), i=1; i<n; ++i) {
	    s += '|' + String(values[i]);
	  }
	  return s;
	};
	
	// type checking functions
	
	var toString = Object.prototype.toString;
	
	u.isObject = function(obj) {
	  return obj === Object(obj);
	};
	
	u.isFunction = function(obj) {
	  return toString.call(obj) === '[object Function]';
	};
	
	u.isString = function(obj) {
	  return typeof value === 'string' || toString.call(obj) === '[object String]';
	};
	
	u.isArray = Array.isArray || function(obj) {
	  return toString.call(obj) === '[object Array]';
	};
	
	u.isNumber = function(obj) {
	  return typeof obj === 'number' || toString.call(obj) === '[object Number]';
	};
	
	u.isBoolean = function(obj) {
	  return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	};
	
	u.isDate = function(obj) {
	  return toString.call(obj) === '[object Date]';
	};
	
	u.isValid = function(obj) {
	  return obj != null && obj === obj;
	};
	
	u.isBuffer = (typeof Buffer === 'function' && Buffer.isBuffer) || u.false;
	
	// type coercion functions
	
	u.number = function(s) {
	  return s == null || s === '' ? null : +s;
	};
	
	u.boolean = function(s) {
	  return s == null || s === '' ? null : s==='false' ? false : !!s;
	};
	
	// parse a date with optional d3.time-format format
	u.date = function(s, format) {
	  var d = format ? format : Date;
	  return s == null || s === '' ? null : d.parse(s);
	};
	
	u.array = function(x) {
	  return x != null ? (u.isArray(x) ? x : [x]) : [];
	};
	
	u.str = function(x) {
	  return u.isArray(x) ? '[' + x.map(u.str) + ']'
	    : u.isObject(x) ? JSON.stringify(x)
	    : u.isString(x) ? ('\''+util_escape_str(x)+'\'') : x;
	};
	
	var escape_str_re = /(^|[^\\])'/g;
	
	function util_escape_str(x) {
	  return x.replace(escape_str_re, '$1\\\'');
	}
	
	// data access functions
	
	var field_re = /\[(.*?)\]|[^.\[]+/g;
	
	u.field = function(f) {
	  return String(f).match(field_re).map(function(d) {
	    return d[0] !== '[' ? d :
	      d[1] !== "'" && d[1] !== '"' ? d.slice(1, -1) :
	      d.slice(2, -2).replace(/\\(["'])/g, '$1');
	  });
	};
	
	u.accessor = function(f) {
	  var s;
	  return f==null || u.isFunction(f) ? f :
	    u.namedfunc(f, (s = u.field(f)).length > 1 ?
	      function(x) { return s.reduce(function(x,f) { return x[f]; }, x); } :
	      function(x) { return x[f]; }
	    );
	};
	
	// short-cut for accessor
	u.$ = u.accessor;
	
	u.mutator = function(f) {
	  var s;
	  return u.isString(f) && (s=u.field(f)).length > 1 ?
	    function(x, v) {
	      for (var i=0; i<s.length-1; ++i) x = x[s[i]];
	      x[s[i]] = v;
	    } :
	    function(x, v) { x[f] = v; };
	};
	
	
	u.$func = function(name, op) {
	  return function(f) {
	    f = u.$(f) || u.identity;
	    var n = name + (u.name(f) ? '_'+u.name(f) : '');
	    return u.namedfunc(n, function(d) { return op(f(d)); });
	  };
	};
	
	u.$valid  = u.$func('valid', u.isValid);
	u.$length = u.$func('length', u.length);
	
	u.$in = function(f, values) {
	  f = u.$(f);
	  var map = u.isArray(values) ? u.toMap(values) : values;
	  return function(d) { return !!map[f(d)]; };
	};
	
	// comparison / sorting functions
	
	u.comparator = function(sort) {
	  var sign = [];
	  if (sort === undefined) sort = [];
	  sort = u.array(sort).map(function(f) {
	    var s = 1;
	    if      (f[0] === '-') { s = -1; f = f.slice(1); }
	    else if (f[0] === '+') { s = +1; f = f.slice(1); }
	    sign.push(s);
	    return u.accessor(f);
	  });
	  return function(a,b) {
	    var i, n, f, x, y;
	    for (i=0, n=sort.length; i<n; ++i) {
	      f = sort[i]; x = f(a); y = f(b);
	      if (x < y) return -1 * sign[i];
	      if (x > y) return sign[i];
	    }
	    return 0;
	  };
	};
	
	u.cmp = function(a, b) {
	  if (a < b) {
	    return -1;
	  } else if (a > b) {
	    return 1;
	  } else if (a >= b) {
	    return 0;
	  } else if (a === null) {
	    return -1;
	  } else if (b === null) {
	    return 1;
	  }
	  return NaN;
	};
	
	u.numcmp = function(a, b) { return a - b; };
	
	u.stablesort = function(array, sortBy, keyFn) {
	  var indices = array.reduce(function(idx, v, i) {
	    return (idx[keyFn(v)] = i, idx);
	  }, {});
	
	  array.sort(function(a, b) {
	    var sa = sortBy(a),
	        sb = sortBy(b);
	    return sa < sb ? -1 : sa > sb ? 1
	         : (indices[keyFn(a)] - indices[keyFn(b)]);
	  });
	
	  return array;
	};
	
	
	// string functions
	
	u.pad = function(s, length, pos, padchar) {
	  padchar = padchar || " ";
	  var d = length - s.length;
	  if (d <= 0) return s;
	  switch (pos) {
	    case 'left':
	      return strrep(d, padchar) + s;
	    case 'middle':
	    case 'center':
	      return strrep(Math.floor(d/2), padchar) +
	         s + strrep(Math.ceil(d/2), padchar);
	    default:
	      return s + strrep(d, padchar);
	  }
	};
	
	function strrep(n, str) {
	  var s = "", i;
	  for (i=0; i<n; ++i) s += str;
	  return s;
	}
	
	u.truncate = function(s, length, pos, word, ellipsis) {
	  var len = s.length;
	  if (len <= length) return s;
	  ellipsis = ellipsis !== undefined ? String(ellipsis) : '\u2026';
	  var l = Math.max(0, length - ellipsis.length);
	
	  switch (pos) {
	    case 'left':
	      return ellipsis + (word ? truncateOnWord(s,l,1) : s.slice(len-l));
	    case 'middle':
	    case 'center':
	      var l1 = Math.ceil(l/2), l2 = Math.floor(l/2);
	      return (word ? truncateOnWord(s,l1) : s.slice(0,l1)) +
	        ellipsis + (word ? truncateOnWord(s,l2,1) : s.slice(len-l2));
	    default:
	      return (word ? truncateOnWord(s,l) : s.slice(0,l)) + ellipsis;
	  }
	};
	
	function truncateOnWord(s, len, rev) {
	  var cnt = 0, tok = s.split(truncate_word_re);
	  if (rev) {
	    s = (tok = tok.reverse())
	      .filter(function(w) { cnt += w.length; return cnt <= len; })
	      .reverse();
	  } else {
	    s = tok.filter(function(w) { cnt += w.length; return cnt <= len; });
	  }
	  return s.length ? s.join('').trim() : tok[0].slice(0, len);
	}
	
	var truncate_word_re = /([\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF])/;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer, global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(21)
	var ieee754 = __webpack_require__(22)
	var isArray = __webpack_require__(23)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	function typedArraySupport () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    this.length = 0
	    this.parent = undefined
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	} else {
	  // pre-set for values that may exist in the future
	  Buffer.prototype.length = undefined
	  Buffer.prototype.parent = undefined
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20).Buffer, (function() { return this; }())))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 22 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 23 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	
	// Matches absolute URLs with optional protocol
	//   https://...    file://...    //...
	var protocol_re = /^([A-Za-z]+:)?\/\//;
	
	// Special treatment in node.js for the file: protocol
	var fileProtocol = 'file://';
	
	// Validate and cleanup URL to ensure that it is allowed to be accessed
	// Returns cleaned up URL, or false if access is not allowed
	function sanitizeUrl(opt) {
	  var url = opt.url;
	  if (!url && opt.file) { return fileProtocol + opt.file; }
	
	  // In case this is a relative url (has no host), prepend opt.baseURL
	  if (opt.baseURL && !protocol_re.test(url)) {
	    if (!startsWith(url, '/') && opt.baseURL[opt.baseURL.length-1] !== '/') {
	      url = '/' + url; // Ensure that there is a slash between the baseURL (e.g. hostname) and url
	    }
	    url = opt.baseURL + url;
	  }
	  // relative protocol, starts with '//'
	  if (!load.useXHR && startsWith(url, '//')) {
	    url = (opt.defaultProtocol || 'http') + ':' + url;
	  }
	  // If opt.domainWhiteList is set, only allows url, whose hostname
	  // * Is the same as the origin (window.location.hostname)
	  // * Equals one of the values in the whitelist
	  // * Is a proper subdomain of one of the values in the whitelist
	  if (opt.domainWhiteList) {
	    var domain, origin;
	    if (load.useXHR) {
	      var a = document.createElement('a');
	      a.href = url;
	      // From http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
	      // IE doesn't populate all link properties when setting .href with a relative URL,
	      // however .href will return an absolute URL which then can be used on itself
	      // to populate these additional fields.
	      if (a.host === '') {
	        a.href = a.href;
	      }
	      domain = a.hostname.toLowerCase();
	      origin = window.location.hostname;
	    } else {
	      // relative protocol is broken: https://github.com/defunctzombie/node-url/issues/5
	      var parts = __webpack_require__(25).parse(url);
	      domain = parts.hostname;
	      origin = null;
	    }
	
	    if (origin !== domain) {
	      var whiteListed = opt.domainWhiteList.some(function(d) {
	        var idx = domain.length - d.length;
	        return d === domain ||
	          (idx > 1 && domain[idx-1] === '.' && domain.lastIndexOf(d) === idx);
	      });
	      if (!whiteListed) {
	        throw 'URL is not whitelisted: ' + url;
	      }
	    }
	  }
	  return url;
	}
	
	function load(opt, callback) {
	  return load.loader(opt, callback);
	}
	
	function loader(opt, callback) {
	  var error = callback || function(e) { throw e; }, url;
	
	  try {
	    url = load.sanitizeUrl(opt); // enable override
	  } catch (err) {
	    error(err);
	    return;
	  }
	
	  if (!url) {
	    error('Invalid URL: ' + opt.url);
	  } else if (load.useXHR) {
	    // on client, use xhr
	    return load.xhr(url, opt, callback);
	  } else if (startsWith(url, fileProtocol)) {
	    // on server, if url starts with 'file://', strip it and load from file
	    return load.file(url.slice(fileProtocol.length), opt, callback);
	  } else if (url.indexOf('://') < 0) { // TODO better protocol check?
	    // on server, if no protocol assume file
	    return load.file(url, opt, callback);
	  } else {
	    // for regular URLs on server
	    return load.http(url, opt, callback);
	  }
	}
	
	function xhrHasResponse(request) {
	  var type = request.responseType;
	  return type && type !== 'text' ?
	    request.response : // null on error
	    request.responseText; // '' on error
	}
	
	function xhr(url, opt, callback) {
	  var async = !!callback;
	  var request = new XMLHttpRequest();
	  // If IE does not support CORS, use XDomainRequest (copied from d3.xhr)
	  if (typeof XDomainRequest !== 'undefined' &&
	      !('withCredentials' in request) &&
	      /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
	
	  function respond() {
	    var status = request.status;
	    if (!status && xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
	      callback(null, request.responseText);
	    } else {
	      callback(request, null);
	    }
	  }
	
	  if (async) {
	    if ('onload' in request) {
	      request.onload = request.onerror = respond;
	    } else {
	      request.onreadystatechange = function() {
	        if (request.readyState > 3) respond();
	      };
	    }
	  }
	
	  request.open('GET', url, async);
	  /* istanbul ignore else */
	  if (request.setRequestHeader) {
	    var headers = util.extend({}, load.headers, opt.headers);
	    for (var name in headers) {
	      request.setRequestHeader(name, headers[name]);
	    }
	  }
	  request.send();
	
	  if (!async && xhrHasResponse(request)) {
	    return request.responseText;
	  }
	}
	
	function file(filename, opt, callback) {
	  var fs = __webpack_require__(26);
	  if (!callback) {
	    return fs.readFileSync(filename, 'utf8');
	  }
	  fs.readFile(filename, callback);
	}
	
	function http(url, opt, callback) {
	  var headers = util.extend({}, load.headers, opt.headers);
	
	  if (!callback) {
	    return __webpack_require__(27)('GET', url, {headers: headers}).getBody();
	  }
	
	  var options = {url: url, encoding: null, gzip: true, headers: headers};
	  __webpack_require__(28)(options, function(error, response, body) {
	    if (!error && response.statusCode === 200) {
	      callback(null, body);
	    } else {
	      error = error ||
	        'Load failed with response code ' + response.statusCode + '.';
	      callback(error, null);
	    }
	  });
	}
	
	function startsWith(string, searchString) {
	  return string == null ? false : string.lastIndexOf(searchString, 0) === 0;
	}
	
	// Allow these functions to be overriden by the user of the library
	load.loader = loader;
	load.sanitizeUrl = sanitizeUrl;
	load.xhr = xhr;
	load.file = file;
	load.http = http;
	
	// Default settings
	load.useXHR = (typeof XMLHttpRequest !== 'undefined');
	load.headers = {};
	
	module.exports = load;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 26 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 27 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 28 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	  type = __webpack_require__(30),
	  formats = __webpack_require__(31),
	  timeF = __webpack_require__(38).time;
	
	function read(data, format) {
	  var type = (format && format.type) || 'json';
	  data = formats[type](data, format);
	  if (format && format.parse) parse(data, format.parse);
	  return data;
	}
	
	function parse(data, types) {
	  var cols, parsers, d, i, j, clen, len = data.length;
	
	  types = (types==='auto') ? type.inferAll(data) : util.duplicate(types);
	  cols = util.keys(types);
	  parsers = cols.map(function(c) {
	    var t = types[c];
	    if (t && t.indexOf('date:') === 0) {
	      var parts = t.split(':', 2),
	          pattern = parts[1];
	      if ((pattern[0] === '\'' && pattern[pattern.length-1] === '\'') ||
	          (pattern[0] === '"'  && pattern[pattern.length-1] === '"')) {
	        pattern = pattern.slice(1, -1);
	      } else {
	        throw Error('Format pattern must be quoted: ' + pattern);
	      }
	      pattern = timeF(pattern);
	      return function(v) { return pattern.parse(v); };
	    }
	    if (!type.parsers[t]) {
	      throw Error('Illegal format pattern: ' + c + ':' + t);
	    }
	    return type.parsers[t];
	  });
	
	  for (i=0, clen=cols.length; i<len; ++i) {
	    d = data[i];
	    for (j=0; j<clen; ++j) {
	      d[cols[j]] = parsers[j](d[cols[j]]);
	    }
	  }
	  type.annotation(data, types);
	}
	
	read.formats = formats;
	module.exports = read;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	
	var TYPES = '__types__';
	
	var PARSERS = {
	  boolean: util.boolean,
	  integer: util.number,
	  number:  util.number,
	  date:    util.date,
	  string:  function(x) { return x==='' ? null : x; }
	};
	
	var TESTS = {
	  boolean: function(x) { return x==='true' || x==='false' || util.isBoolean(x); },
	  integer: function(x) { return TESTS.number(x) && (x=+x) === ~~x; },
	  number: function(x) { return !isNaN(+x) && !util.isDate(x); },
	  date: function(x) { return !isNaN(Date.parse(x)); }
	};
	
	function annotation(data, types) {
	  if (!types) return data && data[TYPES] || null;
	  data[TYPES] = types;
	}
	
	function type(values, f) {
	  values = util.array(values);
	  f = util.$(f);
	  var v, i, n;
	
	  // if data array has type annotations, use them
	  if (values[TYPES]) {
	    v = f(values[TYPES]);
	    if (util.isString(v)) return v;
	  }
	
	  for (i=0, n=values.length; !util.isValid(v) && i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	  }
	
	  return util.isDate(v) ? 'date' :
	    util.isNumber(v)    ? 'number' :
	    util.isBoolean(v)   ? 'boolean' :
	    util.isString(v)    ? 'string' : null;
	}
	
	function typeAll(data, fields) {
	  if (!data.length) return;
	  fields = fields || util.keys(data[0]);
	  return fields.reduce(function(types, f) {
	    return (types[f] = type(data, f), types);
	  }, {});
	}
	
	function infer(values, f) {
	  values = util.array(values);
	  f = util.$(f);
	  var i, j, v;
	
	  // types to test for, in precedence order
	  var types = ['boolean', 'integer', 'number', 'date'];
	
	  for (i=0; i<values.length; ++i) {
	    // get next value to test
	    v = f ? f(values[i]) : values[i];
	    // test value against remaining types
	    for (j=0; j<types.length; ++j) {
	      if (util.isValid(v) && !TESTS[types[j]](v)) {
	        types.splice(j, 1);
	        j -= 1;
	      }
	    }
	    // if no types left, return 'string'
	    if (types.length === 0) return 'string';
	  }
	
	  return types[0];
	}
	
	function inferAll(data, fields) {
	  fields = fields || util.keys(data[0]);
	  return fields.reduce(function(types, f) {
	    types[f] = infer(data, f);
	    return types;
	  }, {});
	}
	
	type.annotation = annotation;
	type.all = typeAll;
	type.infer = infer;
	type.inferAll = inferAll;
	type.parsers = PARSERS;
	module.exports = type;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var dsv = __webpack_require__(32);
	
	module.exports = {
	  json: __webpack_require__(34),
	  topojson: __webpack_require__(35),
	  treejson: __webpack_require__(37),
	  dsv: dsv,
	  csv: dsv.delimiter(','),
	  tsv: dsv.delimiter('\t')
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	var d3_dsv = __webpack_require__(33);
	
	function dsv(data, format) {
	  if (data) {
	    var h = format.header;
	    data = (h ? h.join(format.delimiter) + '\n' : '') + data;
	  }
	  return d3_dsv.dsv(format.delimiter).parse(data);
	}
	
	dsv.delimiter = function(delim) {
	  var fmt = {delimiter: delim};
	  return function(data, format) {
	    return dsv(data, format ? util.extend(format, fmt) : fmt);
	  };
	};
	
	module.exports = dsv;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3_dsv = {})));
	}(this, function (exports) { 'use strict';
	
	  function dsv(delimiter) {
	    return new Dsv(delimiter);
	  }
	
	  function objectConverter(columns) {
	    return new Function("d", "return {" + columns.map(function(name, i) {
	      return JSON.stringify(name) + ": d[" + i + "]";
	    }).join(",") + "}");
	  }
	
	  function customConverter(columns, f) {
	    var object = objectConverter(columns);
	    return function(row, i) {
	      return f(object(row), i, columns);
	    };
	  }
	
	  // Compute unique columns in order of discovery.
	  function inferColumns(rows) {
	    var columnSet = Object.create(null),
	        columns = [];
	
	    rows.forEach(function(row) {
	      for (var column in row) {
	        if (!(column in columnSet)) {
	          columns.push(columnSet[column] = column);
	        }
	      }
	    });
	
	    return columns;
	  }
	
	  function Dsv(delimiter) {
	    var reFormat = new RegExp("[\"" + delimiter + "\n]"),
	        delimiterCode = delimiter.charCodeAt(0);
	
	    this.parse = function(text, f) {
	      var convert, columns, rows = this.parseRows(text, function(row, i) {
	        if (convert) return convert(row, i - 1);
	        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
	      });
	      rows.columns = columns;
	      return rows;
	    };
	
	    this.parseRows = function(text, f) {
	      var EOL = {}, // sentinel value for end-of-line
	          EOF = {}, // sentinel value for end-of-file
	          rows = [], // output rows
	          N = text.length,
	          I = 0, // current character index
	          n = 0, // the current line number
	          t, // the current token
	          eol; // is the current token followed by EOL?
	
	      function token() {
	        if (I >= N) return EOF; // special case: end of file
	        if (eol) return eol = false, EOL; // special case: end of line
	
	        // special case: quotes
	        var j = I, c;
	        if (text.charCodeAt(j) === 34) {
	          var i = j;
	          while (i++ < N) {
	            if (text.charCodeAt(i) === 34) {
	              if (text.charCodeAt(i + 1) !== 34) break;
	              ++i;
	            }
	          }
	          I = i + 2;
	          c = text.charCodeAt(i + 1);
	          if (c === 13) {
	            eol = true;
	            if (text.charCodeAt(i + 2) === 10) ++I;
	          } else if (c === 10) {
	            eol = true;
	          }
	          return text.slice(j + 1, i).replace(/""/g, "\"");
	        }
	
	        // common case: find next delimiter or newline
	        while (I < N) {
	          var k = 1;
	          c = text.charCodeAt(I++);
	          if (c === 10) eol = true; // \n
	          else if (c === 13) { eol = true; if (text.charCodeAt(I) === 10) ++I, ++k; } // \r|\r\n
	          else if (c !== delimiterCode) continue;
	          return text.slice(j, I - k);
	        }
	
	        // special case: last token before EOF
	        return text.slice(j);
	      }
	
	      while ((t = token()) !== EOF) {
	        var a = [];
	        while (t !== EOL && t !== EOF) {
	          a.push(t);
	          t = token();
	        }
	        if (f && (a = f(a, n++)) == null) continue;
	        rows.push(a);
	      }
	
	      return rows;
	    }
	
	    this.format = function(rows, columns) {
	      if (columns == null) columns = inferColumns(rows);
	      return [columns.map(formatValue).join(delimiter)].concat(rows.map(function(row) {
	        return columns.map(function(column) {
	          return formatValue(row[column]);
	        }).join(delimiter);
	      })).join("\n");
	    };
	
	    this.formatRows = function(rows) {
	      return rows.map(formatRow).join("\n");
	    };
	
	    function formatRow(row) {
	      return row.map(formatValue).join(delimiter);
	    }
	
	    function formatValue(text) {
	      return reFormat.test(text) ? "\"" + text.replace(/\"/g, "\"\"") + "\"" : text;
	    }
	  }
	
	  dsv.prototype = Dsv.prototype;
	
	  var csv = dsv(",");
	  var tsv = dsv("\t");
	
	  var version = "0.1.14";
	
	  exports.version = version;
	  exports.dsv = dsv;
	  exports.csv = csv;
	  exports.tsv = tsv;
	
	}));

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	
	module.exports = function(data, format) {
	  var d = util.isObject(data) && !util.isBuffer(data) ?
	    data : JSON.parse(data);
	  if (format && format.property) {
	    d = util.accessor(format.property)(d);
	  }
	  return d;
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	var json = __webpack_require__(34);
	
	var reader = function(data, format) {
	  var topojson = reader.topojson;
	  if (topojson == null) { throw Error('TopoJSON library not loaded.'); }
	
	  var t = json(data, format), obj;
	
	  if (format && format.feature) {
	    if ((obj = t.objects[format.feature])) {
	      return topojson.feature(t, obj).features;
	    } else {
	      throw Error('Invalid TopoJSON object: ' + format.feature);
	    }
	  } else if (format && format.mesh) {
	    if ((obj = t.objects[format.mesh])) {
	      return [topojson.mesh(t, t.objects[format.mesh])];
	    } else {
	      throw Error('Invalid TopoJSON object: ' + format.mesh);
	    }
	  } else {
	    throw Error('Missing TopoJSON feature or mesh parameter.');
	  }
	};
	
	reader.topojson = __webpack_require__(36);
	module.exports = reader;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.topojson = {})));
	}(this, function (exports) { 'use strict';
	
	  function noop() {}
	
	  function absolute(transform) {
	    if (!transform) return noop;
	    var x0,
	        y0,
	        kx = transform.scale[0],
	        ky = transform.scale[1],
	        dx = transform.translate[0],
	        dy = transform.translate[1];
	    return function(point, i) {
	      if (!i) x0 = y0 = 0;
	      point[0] = (x0 += point[0]) * kx + dx;
	      point[1] = (y0 += point[1]) * ky + dy;
	    };
	  }
	
	  function relative(transform) {
	    if (!transform) return noop;
	    var x0,
	        y0,
	        kx = transform.scale[0],
	        ky = transform.scale[1],
	        dx = transform.translate[0],
	        dy = transform.translate[1];
	    return function(point, i) {
	      if (!i) x0 = y0 = 0;
	      var x1 = (point[0] - dx) / kx | 0,
	          y1 = (point[1] - dy) / ky | 0;
	      point[0] = x1 - x0;
	      point[1] = y1 - y0;
	      x0 = x1;
	      y0 = y1;
	    };
	  }
	
	  function reverse(array, n) {
	    var t, j = array.length, i = j - n;
	    while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
	  }
	
	  function bisect(a, x) {
	    var lo = 0, hi = a.length;
	    while (lo < hi) {
	      var mid = lo + hi >>> 1;
	      if (a[mid] < x) lo = mid + 1;
	      else hi = mid;
	    }
	    return lo;
	  }
	
	  function feature(topology, o) {
	    return o.type === "GeometryCollection" ? {
	      type: "FeatureCollection",
	      features: o.geometries.map(function(o) { return feature$1(topology, o); })
	    } : feature$1(topology, o);
	  }
	
	  function feature$1(topology, o) {
	    var f = {
	      type: "Feature",
	      id: o.id,
	      properties: o.properties || {},
	      geometry: object(topology, o)
	    };
	    if (o.id == null) delete f.id;
	    return f;
	  }
	
	  function object(topology, o) {
	    var absolute$$ = absolute(topology.transform),
	        arcs = topology.arcs;
	
	    function arc(i, points) {
	      if (points.length) points.pop();
	      for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length, p; k < n; ++k) {
	        points.push(p = a[k].slice());
	        absolute$$(p, k);
	      }
	      if (i < 0) reverse(points, n);
	    }
	
	    function point(p) {
	      p = p.slice();
	      absolute$$(p, 0);
	      return p;
	    }
	
	    function line(arcs) {
	      var points = [];
	      for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
	      if (points.length < 2) points.push(points[0].slice());
	      return points;
	    }
	
	    function ring(arcs) {
	      var points = line(arcs);
	      while (points.length < 4) points.push(points[0].slice());
	      return points;
	    }
	
	    function polygon(arcs) {
	      return arcs.map(ring);
	    }
	
	    function geometry(o) {
	      var t = o.type;
	      return t === "GeometryCollection" ? {type: t, geometries: o.geometries.map(geometry)}
	          : t in geometryType ? {type: t, coordinates: geometryType[t](o)}
	          : null;
	    }
	
	    var geometryType = {
	      Point: function(o) { return point(o.coordinates); },
	      MultiPoint: function(o) { return o.coordinates.map(point); },
	      LineString: function(o) { return line(o.arcs); },
	      MultiLineString: function(o) { return o.arcs.map(line); },
	      Polygon: function(o) { return polygon(o.arcs); },
	      MultiPolygon: function(o) { return o.arcs.map(polygon); }
	    };
	
	    return geometry(o);
	  }
	
	  function stitchArcs(topology, arcs) {
	    var stitchedArcs = {},
	        fragmentByStart = {},
	        fragmentByEnd = {},
	        fragments = [],
	        emptyIndex = -1;
	
	    // Stitch empty arcs first, since they may be subsumed by other arcs.
	    arcs.forEach(function(i, j) {
	      var arc = topology.arcs[i < 0 ? ~i : i], t;
	      if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
	        t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
	      }
	    });
	
	    arcs.forEach(function(i) {
	      var e = ends(i),
	          start = e[0],
	          end = e[1],
	          f, g;
	
	      if (f = fragmentByEnd[start]) {
	        delete fragmentByEnd[f.end];
	        f.push(i);
	        f.end = end;
	        if (g = fragmentByStart[end]) {
	          delete fragmentByStart[g.start];
	          var fg = g === f ? f : f.concat(g);
	          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
	        } else {
	          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
	        }
	      } else if (f = fragmentByStart[end]) {
	        delete fragmentByStart[f.start];
	        f.unshift(i);
	        f.start = start;
	        if (g = fragmentByEnd[start]) {
	          delete fragmentByEnd[g.end];
	          var gf = g === f ? f : g.concat(f);
	          fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
	        } else {
	          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
	        }
	      } else {
	        f = [i];
	        fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
	      }
	    });
	
	    function ends(i) {
	      var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
	      if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
	      else p1 = arc[arc.length - 1];
	      return i < 0 ? [p1, p0] : [p0, p1];
	    }
	
	    function flush(fragmentByEnd, fragmentByStart) {
	      for (var k in fragmentByEnd) {
	        var f = fragmentByEnd[k];
	        delete fragmentByStart[f.start];
	        delete f.start;
	        delete f.end;
	        f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
	        fragments.push(f);
	      }
	    }
	
	    flush(fragmentByEnd, fragmentByStart);
	    flush(fragmentByStart, fragmentByEnd);
	    arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });
	
	    return fragments;
	  }
	
	  function mesh(topology) {
	    return object(topology, meshArcs.apply(this, arguments));
	  }
	
	  function meshArcs(topology, o, filter) {
	    var arcs = [];
	
	    function arc(i) {
	      var j = i < 0 ? ~i : i;
	      (geomsByArc[j] || (geomsByArc[j] = [])).push({i: i, g: geom});
	    }
	
	    function line(arcs) {
	      arcs.forEach(arc);
	    }
	
	    function polygon(arcs) {
	      arcs.forEach(line);
	    }
	
	    function geometry(o) {
	      if (o.type === "GeometryCollection") o.geometries.forEach(geometry);
	      else if (o.type in geometryType) geom = o, geometryType[o.type](o.arcs);
	    }
	
	    if (arguments.length > 1) {
	      var geomsByArc = [],
	          geom;
	
	      var geometryType = {
	        LineString: line,
	        MultiLineString: polygon,
	        Polygon: polygon,
	        MultiPolygon: function(arcs) { arcs.forEach(polygon); }
	      };
	
	      geometry(o);
	
	      geomsByArc.forEach(arguments.length < 3
	          ? function(geoms) { arcs.push(geoms[0].i); }
	          : function(geoms) { if (filter(geoms[0].g, geoms[geoms.length - 1].g)) arcs.push(geoms[0].i); });
	    } else {
	      for (var i = 0, n = topology.arcs.length; i < n; ++i) arcs.push(i);
	    }
	
	    return {type: "MultiLineString", arcs: stitchArcs(topology, arcs)};
	  }
	
	  function triangle(triangle) {
	    var a = triangle[0], b = triangle[1], c = triangle[2];
	    return Math.abs((a[0] - c[0]) * (b[1] - a[1]) - (a[0] - b[0]) * (c[1] - a[1]));
	  }
	
	  function ring(ring) {
	    var i = -1,
	        n = ring.length,
	        a,
	        b = ring[n - 1],
	        area = 0;
	
	    while (++i < n) {
	      a = b;
	      b = ring[i];
	      area += a[0] * b[1] - a[1] * b[0];
	    }
	
	    return area / 2;
	  }
	
	  function merge(topology) {
	    return object(topology, mergeArcs.apply(this, arguments));
	  }
	
	  function mergeArcs(topology, objects) {
	    var polygonsByArc = {},
	        polygons = [],
	        components = [];
	
	    objects.forEach(function(o) {
	      if (o.type === "Polygon") register(o.arcs);
	      else if (o.type === "MultiPolygon") o.arcs.forEach(register);
	    });
	
	    function register(polygon) {
	      polygon.forEach(function(ring$$) {
	        ring$$.forEach(function(arc) {
	          (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
	        });
	      });
	      polygons.push(polygon);
	    }
	
	    function exterior(ring$$) {
	      return ring(object(topology, {type: "Polygon", arcs: [ring$$]}).coordinates[0]) > 0; // TODO allow spherical?
	    }
	
	    polygons.forEach(function(polygon) {
	      if (!polygon._) {
	        var component = [],
	            neighbors = [polygon];
	        polygon._ = 1;
	        components.push(component);
	        while (polygon = neighbors.pop()) {
	          component.push(polygon);
	          polygon.forEach(function(ring$$) {
	            ring$$.forEach(function(arc) {
	              polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
	                if (!polygon._) {
	                  polygon._ = 1;
	                  neighbors.push(polygon);
	                }
	              });
	            });
	          });
	        }
	      }
	    });
	
	    polygons.forEach(function(polygon) {
	      delete polygon._;
	    });
	
	    return {
	      type: "MultiPolygon",
	      arcs: components.map(function(polygons) {
	        var arcs = [], n;
	
	        // Extract the exterior (unique) arcs.
	        polygons.forEach(function(polygon) {
	          polygon.forEach(function(ring$$) {
	            ring$$.forEach(function(arc) {
	              if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
	                arcs.push(arc);
	              }
	            });
	          });
	        });
	
	        // Stitch the arcs into one or more rings.
	        arcs = stitchArcs(topology, arcs);
	
	        // If more than one ring is returned,
	        // at most one of these rings can be the exterior;
	        // this exterior ring has the same winding order
	        // as any exterior ring in the original polygons.
	        if ((n = arcs.length) > 1) {
	          var sgn = exterior(polygons[0][0]);
	          for (var i = 0, t; i < n; ++i) {
	            if (sgn === exterior(arcs[i])) {
	              t = arcs[0], arcs[0] = arcs[i], arcs[i] = t;
	              break;
	            }
	          }
	        }
	
	        return arcs;
	      })
	    };
	  }
	
	  function neighbors(objects) {
	    var indexesByArc = {}, // arc index -> array of object indexes
	        neighbors = objects.map(function() { return []; });
	
	    function line(arcs, i) {
	      arcs.forEach(function(a) {
	        if (a < 0) a = ~a;
	        var o = indexesByArc[a];
	        if (o) o.push(i);
	        else indexesByArc[a] = [i];
	      });
	    }
	
	    function polygon(arcs, i) {
	      arcs.forEach(function(arc) { line(arc, i); });
	    }
	
	    function geometry(o, i) {
	      if (o.type === "GeometryCollection") o.geometries.forEach(function(o) { geometry(o, i); });
	      else if (o.type in geometryType) geometryType[o.type](o.arcs, i);
	    }
	
	    var geometryType = {
	      LineString: line,
	      MultiLineString: polygon,
	      Polygon: polygon,
	      MultiPolygon: function(arcs, i) { arcs.forEach(function(arc) { polygon(arc, i); }); }
	    };
	
	    objects.forEach(geometry);
	
	    for (var i in indexesByArc) {
	      for (var indexes = indexesByArc[i], m = indexes.length, j = 0; j < m; ++j) {
	        for (var k = j + 1; k < m; ++k) {
	          var ij = indexes[j], ik = indexes[k], n;
	          if ((n = neighbors[ij])[i = bisect(n, ik)] !== ik) n.splice(i, 0, ik);
	          if ((n = neighbors[ik])[i = bisect(n, ij)] !== ij) n.splice(i, 0, ij);
	        }
	      }
	    }
	
	    return neighbors;
	  }
	
	  function compareArea(a, b) {
	    return a[1][2] - b[1][2];
	  }
	
	  function minAreaHeap() {
	    var heap = {},
	        array = [],
	        size = 0;
	
	    heap.push = function(object) {
	      up(array[object._ = size] = object, size++);
	      return size;
	    };
	
	    heap.pop = function() {
	      if (size <= 0) return;
	      var removed = array[0], object;
	      if (--size > 0) object = array[size], down(array[object._ = 0] = object, 0);
	      return removed;
	    };
	
	    heap.remove = function(removed) {
	      var i = removed._, object;
	      if (array[i] !== removed) return; // invalid request
	      if (i !== --size) object = array[size], (compareArea(object, removed) < 0 ? up : down)(array[object._ = i] = object, i);
	      return i;
	    };
	
	    function up(object, i) {
	      while (i > 0) {
	        var j = ((i + 1) >> 1) - 1,
	            parent = array[j];
	        if (compareArea(object, parent) >= 0) break;
	        array[parent._ = i] = parent;
	        array[object._ = i = j] = object;
	      }
	    }
	
	    function down(object, i) {
	      while (true) {
	        var r = (i + 1) << 1,
	            l = r - 1,
	            j = i,
	            child = array[j];
	        if (l < size && compareArea(array[l], child) < 0) child = array[j = l];
	        if (r < size && compareArea(array[r], child) < 0) child = array[j = r];
	        if (j === i) break;
	        array[child._ = i] = child;
	        array[object._ = i = j] = object;
	      }
	    }
	
	    return heap;
	  }
	
	  function presimplify(topology, triangleArea) {
	    var absolute$$ = absolute(topology.transform),
	        relative$$ = relative(topology.transform),
	        heap = minAreaHeap();
	
	    if (!triangleArea) triangleArea = triangle;
	
	    topology.arcs.forEach(function(arc) {
	      var triangles = [],
	          maxArea = 0,
	          triangle,
	          i,
	          n,
	          p;
	
	      // To store each point’s effective area, we create a new array rather than
	      // extending the passed-in point to workaround a Chrome/V8 bug (getting
	      // stuck in smi mode). For midpoints, the initial effective area of
	      // Infinity will be computed in the next step.
	      for (i = 0, n = arc.length; i < n; ++i) {
	        p = arc[i];
	        absolute$$(arc[i] = [p[0], p[1], Infinity], i);
	      }
	
	      for (i = 1, n = arc.length - 1; i < n; ++i) {
	        triangle = arc.slice(i - 1, i + 2);
	        triangle[1][2] = triangleArea(triangle);
	        triangles.push(triangle);
	        heap.push(triangle);
	      }
	
	      for (i = 0, n = triangles.length; i < n; ++i) {
	        triangle = triangles[i];
	        triangle.previous = triangles[i - 1];
	        triangle.next = triangles[i + 1];
	      }
	
	      while (triangle = heap.pop()) {
	        var previous = triangle.previous,
	            next = triangle.next;
	
	        // If the area of the current point is less than that of the previous point
	        // to be eliminated, use the latter's area instead. This ensures that the
	        // current point cannot be eliminated without eliminating previously-
	        // eliminated points.
	        if (triangle[1][2] < maxArea) triangle[1][2] = maxArea;
	        else maxArea = triangle[1][2];
	
	        if (previous) {
	          previous.next = next;
	          previous[2] = triangle[2];
	          update(previous);
	        }
	
	        if (next) {
	          next.previous = previous;
	          next[0] = triangle[0];
	          update(next);
	        }
	      }
	
	      arc.forEach(relative$$);
	    });
	
	    function update(triangle) {
	      heap.remove(triangle);
	      triangle[1][2] = triangleArea(triangle);
	      heap.push(triangle);
	    }
	
	    return topology;
	  }
	
	  var version = "1.6.24";
	
	  exports.version = version;
	  exports.mesh = mesh;
	  exports.meshArcs = meshArcs;
	  exports.merge = merge;
	  exports.mergeArcs = mergeArcs;
	  exports.feature = feature;
	  exports.neighbors = neighbors;
	  exports.presimplify = presimplify;
	
	}));

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var json = __webpack_require__(34);
	
	module.exports = function(tree, format) {
	  return toTable(json(tree, format), format);
	};
	
	function toTable(root, fields) {
	  var childrenField = fields && fields.children || 'children',
	      parentField = fields && fields.parent || 'parent',
	      table = [];
	
	  function visit(node, parent) {
	    node[parentField] = parent;
	    table.push(node);
	    var children = node[childrenField];
	    if (children) {
	      for (var i=0; i<children.length; ++i) {
	        visit(children[i], node);
	      }
	    }
	  }
	
	  visit(root, null);
	  return (table.root = root, table);
	}


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    d3_time = __webpack_require__(39),
	    d3_timeF = __webpack_require__(40),
	    d3_numberF = __webpack_require__(41),
	    numberF = d3_numberF, // defaults to EN-US
	    timeF = d3_timeF,     // defaults to EN-US
	    tmpDate = new Date(2000, 0, 1),
	    monthFull, monthAbbr, dayFull, dayAbbr;
	
	
	module.exports = {
	  // Update number formatter to use provided locale configuration.
	  // For more see https://github.com/d3/d3-format
	  numberLocale: numberLocale,
	  number:       function(f) { return numberF.format(f); },
	  numberPrefix: function(f, v) { return numberF.formatPrefix(f, v); },
	
	  // Update time formatter to use provided locale configuration.
	  // For more see https://github.com/d3/d3-time-format
	  timeLocale:   timeLocale,
	  time:         function(f) { return timeF.format(f); },
	  utc:          function(f) { return timeF.utcFormat(f); },
	
	  // Set number and time locale simultaneously.
	  locale:       function(l) { numberLocale(l); timeLocale(l); },
	
	  // automatic formatting functions
	  auto: {
	    number:   autoNumberFormat,
	    linear:   linearNumberFormat,
	    time:     function() { return timeAutoFormat(); },
	    utc:      function() { return utcAutoFormat(); }
	  },
	
	  month: monthFormat, // format month name from integer code
	  day:   dayFormat    // format week day name from integer code
	};
	
	// -- Locales ----
	
	// transform 'en-US' style locale string to match d3-format v0.4+ convention
	function localeRef(l) {
	  return l.length > 4 && 'locale' + (
	    l[0].toUpperCase() + l[1].toLowerCase() +
	    l[3].toUpperCase() + l[4].toLowerCase()
	  );
	}
	
	function numberLocale(l) {
	  var f = util.isString(l) ? d3_numberF[localeRef(l)] : d3_numberF.locale(l);
	  if (f == null) throw Error('Unrecognized locale: ' + l);
	  numberF = f;
	}
	
	function timeLocale(l) {
	  var f = util.isString(l) ? d3_timeF[localeRef(l)] : d3_timeF.locale(l);
	  if (f == null) throw Error('Unrecognized locale: ' + l);
	  timeF = f;
	  monthFull = monthAbbr = dayFull = dayAbbr = null;
	}
	
	// -- Number Formatting ----
	
	var e10 = Math.sqrt(50),
	    e5 = Math.sqrt(10),
	    e2 = Math.sqrt(2);
	
	function linearRange(domain, count) {
	  if (!domain.length) domain = [0];
	  if (count == null) count = 10;
	
	  var start = domain[0],
	      stop = domain[domain.length - 1];
	
	  if (stop < start) { error = stop; stop = start; start = error; }
	
	  var span = (stop - start) || (count = 1, start || stop || 1),
	      step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
	      error = span / count / step;
	
	  // Filter ticks to get closer to the desired count.
	  if (error >= e10) step *= 10;
	  else if (error >= e5) step *= 5;
	  else if (error >= e2) step *= 2;
	
	  // Round start and stop values to step interval.
	  return [
	    Math.ceil(start / step) * step,
	    Math.floor(stop / step) * step + step / 2, // inclusive
	    step
	  ];
	}
	
	function trimZero(f, decimal) {
	  return function(x) {
	    var s = f(x),
	        n = s.indexOf(decimal);
	    if (n < 0) return s;
	
	    var idx = rightmostDigit(s, n),
	        end = idx < s.length ? s.slice(idx) : '';
	
	    while (--idx > n) {
	      if (s[idx] !== '0') { ++idx; break; }
	    }
	    return s.slice(0, idx) + end;
	  };
	}
	
	function rightmostDigit(s, n) {
	  var i = s.lastIndexOf('e'), c;
	  if (i > 0) return i;
	  for (i=s.length; --i > n;) {
	    c = s.charCodeAt(i);
	    if (c >= 48 && c <= 57) return i+1; // is digit
	  }
	}
	
	function autoNumberFormat(f) {
	  var decimal = numberF.format('.1f')(1)[1]; // get decimal char
	  if (f == null) f = ',';
	  f = d3_numberF.formatSpecifier(f);
	  if (f.precision == null) f.precision = 12;
	  switch (f.type) {
	    case '%': f.precision -= 2; break;
	    case 'e': f.precision -= 1; break;
	  }
	  return trimZero(numberF.format(f), decimal);
	}
	
	function linearNumberFormat(domain, count, f) {
	  var range = linearRange(domain, count);
	
	  if (f == null) f = ',f';
	
	  switch (f = d3_numberF.formatSpecifier(f), f.type) {
	    case 's': {
	      var value = Math.max(Math.abs(range[0]), Math.abs(range[1]));
	      if (f.precision == null) f.precision = d3_numberF.precisionPrefix(range[2], value);
	      return numberF.formatPrefix(f, value);
	    }
	    case '':
	    case 'e':
	    case 'g':
	    case 'p':
	    case 'r': {
	      if (f.precision == null) f.precision = d3_numberF.precisionRound(range[2], Math.max(Math.abs(range[0]), Math.abs(range[1]))) - (f.type === 'e');
	      break;
	    }
	    case 'f':
	    case '%': {
	      if (f.precision == null) f.precision = d3_numberF.precisionFixed(range[2]) - 2 * (f.type === '%');
	      break;
	    }
	  }
	  return numberF.format(f);
	}
	
	// -- Datetime Formatting ----
	
	function timeAutoFormat() {
	  var f = timeF.format,
	      formatMillisecond = f('.%L'),
	      formatSecond = f(':%S'),
	      formatMinute = f('%I:%M'),
	      formatHour = f('%I %p'),
	      formatDay = f('%a %d'),
	      formatWeek = f('%b %d'),
	      formatMonth = f('%B'),
	      formatYear = f('%Y');
	
	  return function(date) {
	    var d = +date;
	    return (d3_time.second(date) < d ? formatMillisecond
	        : d3_time.minute(date) < d ? formatSecond
	        : d3_time.hour(date) < d ? formatMinute
	        : d3_time.day(date) < d ? formatHour
	        : d3_time.month(date) < d ?
	          (d3_time.week(date) < d ? formatDay : formatWeek)
	        : d3_time.year(date) < d ? formatMonth
	        : formatYear)(date);
	  };
	}
	
	function utcAutoFormat() {
	  var f = timeF.utcFormat,
	      formatMillisecond = f('.%L'),
	      formatSecond = f(':%S'),
	      formatMinute = f('%I:%M'),
	      formatHour = f('%I %p'),
	      formatDay = f('%a %d'),
	      formatWeek = f('%b %d'),
	      formatMonth = f('%B'),
	      formatYear = f('%Y');
	
	  return function(date) {
	    var d = +date;
	    return (d3_time.utcSecond(date) < d ? formatMillisecond
	        : d3_time.utcMinute(date) < d ? formatSecond
	        : d3_time.utcHour(date) < d ? formatMinute
	        : d3_time.utcDay(date) < d ? formatHour
	        : d3_time.utcMonth(date) < d ?
	          (d3_time.utcWeek(date) < d ? formatDay : formatWeek)
	        : d3_time.utcYear(date) < d ? formatMonth
	        : formatYear)(date);
	  };
	}
	
	function monthFormat(month, abbreviate) {
	  var f = abbreviate ?
	    (monthAbbr || (monthAbbr = timeF.format('%b'))) :
	    (monthFull || (monthFull = timeF.format('%B')));
	  return (tmpDate.setMonth(month), f(tmpDate));
	}
	
	function dayFormat(day, abbreviate) {
	  var f = abbreviate ?
	    (dayAbbr || (dayAbbr = timeF.format('%a'))) :
	    (dayFull || (dayFull = timeF.format('%A')));
	  return (tmpDate.setMonth(0), tmpDate.setDate(2 + day), f(tmpDate));
	}

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define('d3-time', ['exports'], factory) :
	  factory((global.d3_time = {}));
	}(this, function (exports) { 'use strict';
	
	  var t0 = new Date;
	  var t1 = new Date;
	  function newInterval(floori, offseti, count, field) {
	
	    function interval(date) {
	      return floori(date = new Date(+date)), date;
	    }
	
	    interval.floor = interval;
	
	    interval.round = function(date) {
	      var d0 = new Date(+date),
	          d1 = new Date(date - 1);
	      floori(d0), floori(d1), offseti(d1, 1);
	      return date - d0 < d1 - date ? d0 : d1;
	    };
	
	    interval.ceil = function(date) {
	      return floori(date = new Date(date - 1)), offseti(date, 1), date;
	    };
	
	    interval.offset = function(date, step) {
	      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	    };
	
	    interval.range = function(start, stop, step) {
	      var range = [];
	      start = new Date(start - 1);
	      stop = new Date(+stop);
	      step = step == null ? 1 : Math.floor(step);
	      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	      offseti(start, 1), floori(start);
	      if (start < stop) range.push(new Date(+start));
	      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
	      return range;
	    };
	
	    interval.filter = function(test) {
	      return newInterval(function(date) {
	        while (floori(date), !test(date)) date.setTime(date - 1);
	      }, function(date, step) {
	        while (--step >= 0) while (offseti(date, 1), !test(date));
	      });
	    };
	
	    if (count) {
	      interval.count = function(start, end) {
	        t0.setTime(+start), t1.setTime(+end);
	        floori(t0), floori(t1);
	        return Math.floor(count(t0, t1));
	      };
	
	      interval.every = function(step) {
	        step = Math.floor(step);
	        return !isFinite(step) || !(step > 0) ? null
	            : !(step > 1) ? interval
	            : interval.filter(field
	                ? function(d) { return field(d) % step === 0; }
	                : function(d) { return interval.count(0, d) % step === 0; });
	      };
	    }
	
	    return interval;
	  };
	
	  var millisecond = newInterval(function() {
	    // noop
	  }, function(date, step) {
	    date.setTime(+date + step);
	  }, function(start, end) {
	    return end - start;
	  });
	
	  // An optimized implementation for this simple case.
	  millisecond.every = function(k) {
	    k = Math.floor(k);
	    if (!isFinite(k) || !(k > 0)) return null;
	    if (!(k > 1)) return millisecond;
	    return newInterval(function(date) {
	      date.setTime(Math.floor(date / k) * k);
	    }, function(date, step) {
	      date.setTime(+date + step * k);
	    }, function(start, end) {
	      return (end - start) / k;
	    });
	  };
	
	  var second = newInterval(function(date) {
	    date.setMilliseconds(0);
	  }, function(date, step) {
	    date.setTime(+date + step * 1e3);
	  }, function(start, end) {
	    return (end - start) / 1e3;
	  }, function(date) {
	    return date.getSeconds();
	  });
	
	  var minute = newInterval(function(date) {
	    date.setSeconds(0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 6e4);
	  }, function(start, end) {
	    return (end - start) / 6e4;
	  }, function(date) {
	    return date.getMinutes();
	  });
	
	  var hour = newInterval(function(date) {
	    date.setMinutes(0, 0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 36e5);
	  }, function(start, end) {
	    return (end - start) / 36e5;
	  }, function(date) {
	    return date.getHours();
	  });
	
	  var day = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
	  }, function(date) {
	    return date.getDate() - 1;
	  });
	
	  function weekday(i) {
	    return newInterval(function(date) {
	      date.setHours(0, 0, 0, 0);
	      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    }, function(date, step) {
	      date.setDate(date.getDate() + step * 7);
	    }, function(start, end) {
	      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
	    });
	  }
	
	  var sunday = weekday(0);
	  var monday = weekday(1);
	  var tuesday = weekday(2);
	  var wednesday = weekday(3);
	  var thursday = weekday(4);
	  var friday = weekday(5);
	  var saturday = weekday(6);
	
	  var month = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	    date.setDate(1);
	  }, function(date, step) {
	    date.setMonth(date.getMonth() + step);
	  }, function(start, end) {
	    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	  }, function(date) {
	    return date.getMonth();
	  });
	
	  var year = newInterval(function(date) {
	    date.setHours(0, 0, 0, 0);
	    date.setMonth(0, 1);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step);
	  }, function(start, end) {
	    return end.getFullYear() - start.getFullYear();
	  }, function(date) {
	    return date.getFullYear();
	  });
	
	  var utcSecond = newInterval(function(date) {
	    date.setUTCMilliseconds(0);
	  }, function(date, step) {
	    date.setTime(+date + step * 1e3);
	  }, function(start, end) {
	    return (end - start) / 1e3;
	  }, function(date) {
	    return date.getUTCSeconds();
	  });
	
	  var utcMinute = newInterval(function(date) {
	    date.setUTCSeconds(0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 6e4);
	  }, function(start, end) {
	    return (end - start) / 6e4;
	  }, function(date) {
	    return date.getUTCMinutes();
	  });
	
	  var utcHour = newInterval(function(date) {
	    date.setUTCMinutes(0, 0, 0);
	  }, function(date, step) {
	    date.setTime(+date + step * 36e5);
	  }, function(start, end) {
	    return (end - start) / 36e5;
	  }, function(date) {
	    return date.getUTCHours();
	  });
	
	  var utcDay = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step);
	  }, function(start, end) {
	    return (end - start) / 864e5;
	  }, function(date) {
	    return date.getUTCDate() - 1;
	  });
	
	  function utcWeekday(i) {
	    return newInterval(function(date) {
	      date.setUTCHours(0, 0, 0, 0);
	      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    }, function(date, step) {
	      date.setUTCDate(date.getUTCDate() + step * 7);
	    }, function(start, end) {
	      return (end - start) / 6048e5;
	    });
	  }
	
	  var utcSunday = utcWeekday(0);
	  var utcMonday = utcWeekday(1);
	  var utcTuesday = utcWeekday(2);
	  var utcWednesday = utcWeekday(3);
	  var utcThursday = utcWeekday(4);
	  var utcFriday = utcWeekday(5);
	  var utcSaturday = utcWeekday(6);
	
	  var utcMonth = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	    date.setUTCDate(1);
	  }, function(date, step) {
	    date.setUTCMonth(date.getUTCMonth() + step);
	  }, function(start, end) {
	    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	  }, function(date) {
	    return date.getUTCMonth();
	  });
	
	  var utcYear = newInterval(function(date) {
	    date.setUTCHours(0, 0, 0, 0);
	    date.setUTCMonth(0, 1);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step);
	  }, function(start, end) {
	    return end.getUTCFullYear() - start.getUTCFullYear();
	  }, function(date) {
	    return date.getUTCFullYear();
	  });
	
	  var milliseconds = millisecond.range;
	  var seconds = second.range;
	  var minutes = minute.range;
	  var hours = hour.range;
	  var days = day.range;
	  var sundays = sunday.range;
	  var mondays = monday.range;
	  var tuesdays = tuesday.range;
	  var wednesdays = wednesday.range;
	  var thursdays = thursday.range;
	  var fridays = friday.range;
	  var saturdays = saturday.range;
	  var weeks = sunday.range;
	  var months = month.range;
	  var years = year.range;
	
	  var utcMillisecond = millisecond;
	  var utcMilliseconds = milliseconds;
	  var utcSeconds = utcSecond.range;
	  var utcMinutes = utcMinute.range;
	  var utcHours = utcHour.range;
	  var utcDays = utcDay.range;
	  var utcSundays = utcSunday.range;
	  var utcMondays = utcMonday.range;
	  var utcTuesdays = utcTuesday.range;
	  var utcWednesdays = utcWednesday.range;
	  var utcThursdays = utcThursday.range;
	  var utcFridays = utcFriday.range;
	  var utcSaturdays = utcSaturday.range;
	  var utcWeeks = utcSunday.range;
	  var utcMonths = utcMonth.range;
	  var utcYears = utcYear.range;
	
	  var version = "0.1.1";
	
	  exports.version = version;
	  exports.milliseconds = milliseconds;
	  exports.seconds = seconds;
	  exports.minutes = minutes;
	  exports.hours = hours;
	  exports.days = days;
	  exports.sundays = sundays;
	  exports.mondays = mondays;
	  exports.tuesdays = tuesdays;
	  exports.wednesdays = wednesdays;
	  exports.thursdays = thursdays;
	  exports.fridays = fridays;
	  exports.saturdays = saturdays;
	  exports.weeks = weeks;
	  exports.months = months;
	  exports.years = years;
	  exports.utcMillisecond = utcMillisecond;
	  exports.utcMilliseconds = utcMilliseconds;
	  exports.utcSeconds = utcSeconds;
	  exports.utcMinutes = utcMinutes;
	  exports.utcHours = utcHours;
	  exports.utcDays = utcDays;
	  exports.utcSundays = utcSundays;
	  exports.utcMondays = utcMondays;
	  exports.utcTuesdays = utcTuesdays;
	  exports.utcWednesdays = utcWednesdays;
	  exports.utcThursdays = utcThursdays;
	  exports.utcFridays = utcFridays;
	  exports.utcSaturdays = utcSaturdays;
	  exports.utcWeeks = utcWeeks;
	  exports.utcMonths = utcMonths;
	  exports.utcYears = utcYears;
	  exports.millisecond = millisecond;
	  exports.second = second;
	  exports.minute = minute;
	  exports.hour = hour;
	  exports.day = day;
	  exports.sunday = sunday;
	  exports.monday = monday;
	  exports.tuesday = tuesday;
	  exports.wednesday = wednesday;
	  exports.thursday = thursday;
	  exports.friday = friday;
	  exports.saturday = saturday;
	  exports.week = sunday;
	  exports.month = month;
	  exports.year = year;
	  exports.utcSecond = utcSecond;
	  exports.utcMinute = utcMinute;
	  exports.utcHour = utcHour;
	  exports.utcDay = utcDay;
	  exports.utcSunday = utcSunday;
	  exports.utcMonday = utcMonday;
	  exports.utcTuesday = utcTuesday;
	  exports.utcWednesday = utcWednesday;
	  exports.utcThursday = utcThursday;
	  exports.utcFriday = utcFriday;
	  exports.utcSaturday = utcSaturday;
	  exports.utcWeek = utcSunday;
	  exports.utcMonth = utcMonth;
	  exports.utcYear = utcYear;
	  exports.interval = newInterval;
	
	}));

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports, __webpack_require__(39)) :
	  typeof define === 'function' && define.amd ? define('d3-time-format', ['exports', 'd3-time'], factory) :
	  factory((global.d3_time_format = {}),global.d3_time);
	}(this, function (exports,d3Time) { 'use strict';
	
	  function localDate(d) {
	    if (0 <= d.y && d.y < 100) {
	      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	      date.setFullYear(d.y);
	      return date;
	    }
	    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	  }
	
	  function utcDate(d) {
	    if (0 <= d.y && d.y < 100) {
	      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	      date.setUTCFullYear(d.y);
	      return date;
	    }
	    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	  }
	
	  function newYear(y) {
	    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	  }
	
	  function locale$1(locale) {
	    var locale_dateTime = locale.dateTime,
	        locale_date = locale.date,
	        locale_time = locale.time,
	        locale_periods = locale.periods,
	        locale_weekdays = locale.days,
	        locale_shortWeekdays = locale.shortDays,
	        locale_months = locale.months,
	        locale_shortMonths = locale.shortMonths;
	
	    var periodRe = formatRe(locale_periods),
	        periodLookup = formatLookup(locale_periods),
	        weekdayRe = formatRe(locale_weekdays),
	        weekdayLookup = formatLookup(locale_weekdays),
	        shortWeekdayRe = formatRe(locale_shortWeekdays),
	        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	        monthRe = formatRe(locale_months),
	        monthLookup = formatLookup(locale_months),
	        shortMonthRe = formatRe(locale_shortMonths),
	        shortMonthLookup = formatLookup(locale_shortMonths);
	
	    var formats = {
	      "a": formatShortWeekday,
	      "A": formatWeekday,
	      "b": formatShortMonth,
	      "B": formatMonth,
	      "c": null,
	      "d": formatDayOfMonth,
	      "e": formatDayOfMonth,
	      "H": formatHour24,
	      "I": formatHour12,
	      "j": formatDayOfYear,
	      "L": formatMilliseconds,
	      "m": formatMonthNumber,
	      "M": formatMinutes,
	      "p": formatPeriod,
	      "S": formatSeconds,
	      "U": formatWeekNumberSunday,
	      "w": formatWeekdayNumber,
	      "W": formatWeekNumberMonday,
	      "x": null,
	      "X": null,
	      "y": formatYear,
	      "Y": formatFullYear,
	      "Z": formatZone,
	      "%": formatLiteralPercent
	    };
	
	    var utcFormats = {
	      "a": formatUTCShortWeekday,
	      "A": formatUTCWeekday,
	      "b": formatUTCShortMonth,
	      "B": formatUTCMonth,
	      "c": null,
	      "d": formatUTCDayOfMonth,
	      "e": formatUTCDayOfMonth,
	      "H": formatUTCHour24,
	      "I": formatUTCHour12,
	      "j": formatUTCDayOfYear,
	      "L": formatUTCMilliseconds,
	      "m": formatUTCMonthNumber,
	      "M": formatUTCMinutes,
	      "p": formatUTCPeriod,
	      "S": formatUTCSeconds,
	      "U": formatUTCWeekNumberSunday,
	      "w": formatUTCWeekdayNumber,
	      "W": formatUTCWeekNumberMonday,
	      "x": null,
	      "X": null,
	      "y": formatUTCYear,
	      "Y": formatUTCFullYear,
	      "Z": formatUTCZone,
	      "%": formatLiteralPercent
	    };
	
	    var parses = {
	      "a": parseShortWeekday,
	      "A": parseWeekday,
	      "b": parseShortMonth,
	      "B": parseMonth,
	      "c": parseLocaleDateTime,
	      "d": parseDayOfMonth,
	      "e": parseDayOfMonth,
	      "H": parseHour24,
	      "I": parseHour24,
	      "j": parseDayOfYear,
	      "L": parseMilliseconds,
	      "m": parseMonthNumber,
	      "M": parseMinutes,
	      "p": parsePeriod,
	      "S": parseSeconds,
	      "U": parseWeekNumberSunday,
	      "w": parseWeekdayNumber,
	      "W": parseWeekNumberMonday,
	      "x": parseLocaleDate,
	      "X": parseLocaleTime,
	      "y": parseYear,
	      "Y": parseFullYear,
	      "Z": parseZone,
	      "%": parseLiteralPercent
	    };
	
	    // These recursive directive definitions must be deferred.
	    formats.x = newFormat(locale_date, formats);
	    formats.X = newFormat(locale_time, formats);
	    formats.c = newFormat(locale_dateTime, formats);
	    utcFormats.x = newFormat(locale_date, utcFormats);
	    utcFormats.X = newFormat(locale_time, utcFormats);
	    utcFormats.c = newFormat(locale_dateTime, utcFormats);
	
	    function newFormat(specifier, formats) {
	      return function(date) {
	        var string = [],
	            i = -1,
	            j = 0,
	            n = specifier.length,
	            c,
	            pad,
	            format;
	
	        if (!(date instanceof Date)) date = new Date(+date);
	
	        while (++i < n) {
	          if (specifier.charCodeAt(i) === 37) {
	            string.push(specifier.slice(j, i));
	            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	            else pad = c === "e" ? " " : "0";
	            if (format = formats[c]) c = format(date, pad);
	            string.push(c);
	            j = i + 1;
	          }
	        }
	
	        string.push(specifier.slice(j, i));
	        return string.join("");
	      };
	    }
	
	    function newParse(specifier, newDate) {
	      return function(string) {
	        var d = newYear(1900),
	            i = parseSpecifier(d, specifier, string += "", 0);
	        if (i != string.length) return null;
	
	        // The am-pm flag is 0 for AM, and 1 for PM.
	        if ("p" in d) d.H = d.H % 12 + d.p * 12;
	
	        // Convert day-of-week and week-of-year to day-of-year.
	        if ("W" in d || "U" in d) {
	          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
	          var day = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	          d.m = 0;
	          d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day + 5) % 7 : d.w + d.U * 7 - (day + 6) % 7;
	        }
	
	        // If a time zone is specified, all fields are interpreted as UTC and then
	        // offset according to the specified time zone.
	        if ("Z" in d) {
	          d.H += d.Z / 100 | 0;
	          d.M += d.Z % 100;
	          return utcDate(d);
	        }
	
	        // Otherwise, all fields are in local time.
	        return newDate(d);
	      };
	    }
	
	    function parseSpecifier(d, specifier, string, j) {
	      var i = 0,
	          n = specifier.length,
	          m = string.length,
	          c,
	          parse;
	
	      while (i < n) {
	        if (j >= m) return -1;
	        c = specifier.charCodeAt(i++);
	        if (c === 37) {
	          c = specifier.charAt(i++);
	          parse = parses[c in pads ? specifier.charAt(i++) : c];
	          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	        } else if (c != string.charCodeAt(j++)) {
	          return -1;
	        }
	      }
	
	      return j;
	    }
	
	    function parsePeriod(d, string, i) {
	      var n = periodRe.exec(string.slice(i));
	      return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }
	
	    function parseShortWeekday(d, string, i) {
	      var n = shortWeekdayRe.exec(string.slice(i));
	      return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }
	
	    function parseWeekday(d, string, i) {
	      var n = weekdayRe.exec(string.slice(i));
	      return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }
	
	    function parseShortMonth(d, string, i) {
	      var n = shortMonthRe.exec(string.slice(i));
	      return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }
	
	    function parseMonth(d, string, i) {
	      var n = monthRe.exec(string.slice(i));
	      return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	    }
	
	    function parseLocaleDateTime(d, string, i) {
	      return parseSpecifier(d, locale_dateTime, string, i);
	    }
	
	    function parseLocaleDate(d, string, i) {
	      return parseSpecifier(d, locale_date, string, i);
	    }
	
	    function parseLocaleTime(d, string, i) {
	      return parseSpecifier(d, locale_time, string, i);
	    }
	
	    function formatShortWeekday(d) {
	      return locale_shortWeekdays[d.getDay()];
	    }
	
	    function formatWeekday(d) {
	      return locale_weekdays[d.getDay()];
	    }
	
	    function formatShortMonth(d) {
	      return locale_shortMonths[d.getMonth()];
	    }
	
	    function formatMonth(d) {
	      return locale_months[d.getMonth()];
	    }
	
	    function formatPeriod(d) {
	      return locale_periods[+(d.getHours() >= 12)];
	    }
	
	    function formatUTCShortWeekday(d) {
	      return locale_shortWeekdays[d.getUTCDay()];
	    }
	
	    function formatUTCWeekday(d) {
	      return locale_weekdays[d.getUTCDay()];
	    }
	
	    function formatUTCShortMonth(d) {
	      return locale_shortMonths[d.getUTCMonth()];
	    }
	
	    function formatUTCMonth(d) {
	      return locale_months[d.getUTCMonth()];
	    }
	
	    function formatUTCPeriod(d) {
	      return locale_periods[+(d.getUTCHours() >= 12)];
	    }
	
	    return {
	      format: function(specifier) {
	        var f = newFormat(specifier += "", formats);
	        f.parse = newParse(specifier, localDate);
	        f.toString = function() { return specifier; };
	        return f;
	      },
	      utcFormat: function(specifier) {
	        var f = newFormat(specifier += "", utcFormats);
	        f.parse = newParse(specifier, utcDate);
	        f.toString = function() { return specifier; };
	        return f;
	      }
	    };
	  };
	
	  var pads = {"-": "", "_": " ", "0": "0"};
	  var numberRe = /^\s*\d+/;
	  var percentRe = /^%/;
	  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
	  function pad(value, fill, width) {
	    var sign = value < 0 ? "-" : "",
	        string = (sign ? -value : value) + "",
	        length = string.length;
	    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	  }
	
	  function requote(s) {
	    return s.replace(requoteRe, "\\$&");
	  }
	
	  function formatRe(names) {
	    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	  }
	
	  function formatLookup(names) {
	    var map = {}, i = -1, n = names.length;
	    while (++i < n) map[names[i].toLowerCase()] = i;
	    return map;
	  }
	
	  function parseWeekdayNumber(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 1));
	    return n ? (d.w = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseWeekNumberSunday(d, string, i) {
	    var n = numberRe.exec(string.slice(i));
	    return n ? (d.U = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseWeekNumberMonday(d, string, i) {
	    var n = numberRe.exec(string.slice(i));
	    return n ? (d.W = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseFullYear(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 4));
	    return n ? (d.y = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseYear(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	  }
	
	  function parseZone(d, string, i) {
	    var n = /^(Z)|([+-]\d\d)(?:\:?(\d\d))?/.exec(string.slice(i, i + 6));
	    return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	  }
	
	  function parseMonthNumber(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	  }
	
	  function parseDayOfMonth(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.d = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseDayOfYear(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 3));
	    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseHour24(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.H = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseMinutes(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.M = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseSeconds(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 2));
	    return n ? (d.S = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseMilliseconds(d, string, i) {
	    var n = numberRe.exec(string.slice(i, i + 3));
	    return n ? (d.L = +n[0], i + n[0].length) : -1;
	  }
	
	  function parseLiteralPercent(d, string, i) {
	    var n = percentRe.exec(string.slice(i, i + 1));
	    return n ? i + n[0].length : -1;
	  }
	
	  function formatDayOfMonth(d, p) {
	    return pad(d.getDate(), p, 2);
	  }
	
	  function formatHour24(d, p) {
	    return pad(d.getHours(), p, 2);
	  }
	
	  function formatHour12(d, p) {
	    return pad(d.getHours() % 12 || 12, p, 2);
	  }
	
	  function formatDayOfYear(d, p) {
	    return pad(1 + d3Time.day.count(d3Time.year(d), d), p, 3);
	  }
	
	  function formatMilliseconds(d, p) {
	    return pad(d.getMilliseconds(), p, 3);
	  }
	
	  function formatMonthNumber(d, p) {
	    return pad(d.getMonth() + 1, p, 2);
	  }
	
	  function formatMinutes(d, p) {
	    return pad(d.getMinutes(), p, 2);
	  }
	
	  function formatSeconds(d, p) {
	    return pad(d.getSeconds(), p, 2);
	  }
	
	  function formatWeekNumberSunday(d, p) {
	    return pad(d3Time.sunday.count(d3Time.year(d), d), p, 2);
	  }
	
	  function formatWeekdayNumber(d) {
	    return d.getDay();
	  }
	
	  function formatWeekNumberMonday(d, p) {
	    return pad(d3Time.monday.count(d3Time.year(d), d), p, 2);
	  }
	
	  function formatYear(d, p) {
	    return pad(d.getFullYear() % 100, p, 2);
	  }
	
	  function formatFullYear(d, p) {
	    return pad(d.getFullYear() % 10000, p, 4);
	  }
	
	  function formatZone(d) {
	    var z = d.getTimezoneOffset();
	    return (z > 0 ? "-" : (z *= -1, "+"))
	        + pad(z / 60 | 0, "0", 2)
	        + pad(z % 60, "0", 2);
	  }
	
	  function formatUTCDayOfMonth(d, p) {
	    return pad(d.getUTCDate(), p, 2);
	  }
	
	  function formatUTCHour24(d, p) {
	    return pad(d.getUTCHours(), p, 2);
	  }
	
	  function formatUTCHour12(d, p) {
	    return pad(d.getUTCHours() % 12 || 12, p, 2);
	  }
	
	  function formatUTCDayOfYear(d, p) {
	    return pad(1 + d3Time.utcDay.count(d3Time.utcYear(d), d), p, 3);
	  }
	
	  function formatUTCMilliseconds(d, p) {
	    return pad(d.getUTCMilliseconds(), p, 3);
	  }
	
	  function formatUTCMonthNumber(d, p) {
	    return pad(d.getUTCMonth() + 1, p, 2);
	  }
	
	  function formatUTCMinutes(d, p) {
	    return pad(d.getUTCMinutes(), p, 2);
	  }
	
	  function formatUTCSeconds(d, p) {
	    return pad(d.getUTCSeconds(), p, 2);
	  }
	
	  function formatUTCWeekNumberSunday(d, p) {
	    return pad(d3Time.utcSunday.count(d3Time.utcYear(d), d), p, 2);
	  }
	
	  function formatUTCWeekdayNumber(d) {
	    return d.getUTCDay();
	  }
	
	  function formatUTCWeekNumberMonday(d, p) {
	    return pad(d3Time.utcMonday.count(d3Time.utcYear(d), d), p, 2);
	  }
	
	  function formatUTCYear(d, p) {
	    return pad(d.getUTCFullYear() % 100, p, 2);
	  }
	
	  function formatUTCFullYear(d, p) {
	    return pad(d.getUTCFullYear() % 10000, p, 4);
	  }
	
	  function formatUTCZone() {
	    return "+0000";
	  }
	
	  function formatLiteralPercent() {
	    return "%";
	  }
	
	  var locale = locale$1({
	    dateTime: "%a %b %e %X %Y",
	    date: "%m/%d/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	  });
	
	  var caES = locale$1({
	    dateTime: "%A, %e de %B de %Y, %X",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"],
	    shortDays: ["dg.", "dl.", "dt.", "dc.", "dj.", "dv.", "ds."],
	    months: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"],
	    shortMonths: ["gen.", "febr.", "març", "abr.", "maig", "juny", "jul.", "ag.", "set.", "oct.", "nov.", "des."]
	  });
	
	  var deCH = locale$1({
	    dateTime: "%A, der %e. %B %Y, %X",
	    date: "%d.%m.%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"], // unused
	    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
	    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	    shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	  });
	
	  var deDE = locale$1({
	    dateTime: "%A, der %e. %B %Y, %X",
	    date: "%d.%m.%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"], // unused
	    days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
	    shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
	    months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	    shortMonths: ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
	  });
	
	  var enCA = locale$1({
	    dateTime: "%a %b %e %X %Y",
	    date: "%Y-%m-%d",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	  });
	
	  var enGB = locale$1({
	    dateTime: "%a %e %b %X %Y",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	  });
	
	  var esES = locale$1({
	    dateTime: "%A, %e de %B de %Y, %X",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
	    shortDays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
	    months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
	    shortMonths: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
	  });
	
	  var fiFI = locale$1({
	    dateTime: "%A, %-d. %Bta %Y klo %X",
	    date: "%-d.%-m.%Y",
	    time: "%H:%M:%S",
	    periods: ["a.m.", "p.m."],
	    days: ["sunnuntai", "maanantai", "tiistai", "keskiviikko", "torstai", "perjantai", "lauantai"],
	    shortDays: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
	    months: ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu", "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"],
	    shortMonths: ["Tammi", "Helmi", "Maalis", "Huhti", "Touko", "Kesä", "Heinä", "Elo", "Syys", "Loka", "Marras", "Joulu"]
	  });
	
	  var frCA = locale$1({
	    dateTime: "%a %e %b %Y %X",
	    date: "%Y-%m-%d",
	    time: "%H:%M:%S",
	    periods: ["", ""],
	    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
	    shortDays: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
	    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
	    shortMonths: ["jan", "fév", "mar", "avr", "mai", "jui", "jul", "aoû", "sep", "oct", "nov", "déc"]
	  });
	
	  var frFR = locale$1({
	    dateTime: "%A, le %e %B %Y, %X",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"], // unused
	    days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
	    shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
	    months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
	    shortMonths: ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
	  });
	
	  var heIL = locale$1({
	    dateTime: "%A, %e ב%B %Y %X",
	    date: "%d.%m.%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
	    shortDays: ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"],
	    months: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
	    shortMonths: ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"]
	  });
	
	  var huHU = locale$1({
	    dateTime: "%Y. %B %-e., %A %X",
	    date: "%Y. %m. %d.",
	    time: "%H:%M:%S",
	    periods: ["de.", "du."], // unused
	    days: ["vasárnap", "hétfő", "kedd", "szerda", "csütörtök", "péntek", "szombat"],
	    shortDays: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
	    months: ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"],
	    shortMonths: ["jan.", "feb.", "már.", "ápr.", "máj.", "jún.", "júl.", "aug.", "szept.", "okt.", "nov.", "dec."]
	  });
	
	  var itIT = locale$1({
	    dateTime: "%A %e %B %Y, %X",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"], // unused
	    days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
	    shortDays: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
	    months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
	    shortMonths: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"]
	  });
	
	  var jaJP = locale$1({
	    dateTime: "%Y %b %e %a %X",
	    date: "%Y/%m/%d",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
	    shortDays: ["日", "月", "火", "水", "木", "金", "土"],
	    months: ["睦月", "如月", "弥生", "卯月", "皐月", "水無月", "文月", "葉月", "長月", "神無月", "霜月", "師走"],
	    shortMonths: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
	  });
	
	  var koKR = locale$1({
	    dateTime: "%Y/%m/%d %a %X",
	    date: "%Y/%m/%d",
	    time: "%H:%M:%S",
	    periods: ["오전", "오후"],
	    days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
	    shortDays: ["일", "월", "화", "수", "목", "금", "토"],
	    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
	    shortMonths: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
	  });
	
	  var mkMK = locale$1({
	    dateTime: "%A, %e %B %Y г. %X",
	    date: "%d.%m.%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["недела", "понеделник", "вторник", "среда", "четврток", "петок", "сабота"],
	    shortDays: ["нед", "пон", "вто", "сре", "чет", "пет", "саб"],
	    months: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
	    shortMonths: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"]
	  });
	
	  var nlNL = locale$1({
	    dateTime: "%a %e %B %Y %T",
	    date: "%d-%m-%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"], // unused
	    days: ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
	    shortDays: ["zo", "ma", "di", "wo", "do", "vr", "za"],
	    months: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
	    shortMonths: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
	  });
	
	  var plPL = locale$1({
	    dateTime: "%A, %e %B %Y, %X",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"], // unused
	    days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
	    shortDays: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
	    months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
	    shortMonths: ["Stycz.", "Luty", "Marz.", "Kwie.", "Maj", "Czerw.", "Lipc.", "Sierp.", "Wrz.", "Paźdz.", "Listop.", "Grudz."]/* In Polish language abbraviated months are not commonly used so there is a dispute about the proper abbraviations. */
	  });
	
	  var ptBR = locale$1({
	    dateTime: "%A, %e de %B de %Y. %X",
	    date: "%d/%m/%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
	    shortDays: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
	    months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
	    shortMonths: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
	  });
	
	  var ruRU = locale$1({
	    dateTime: "%A, %e %B %Y г. %X",
	    date: "%d.%m.%Y",
	    time: "%H:%M:%S",
	    periods: ["AM", "PM"],
	    days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
	    shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
	    months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
	    shortMonths: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
	  });
	
	  var svSE = locale$1({
	    dateTime: "%A den %d %B %Y %X",
	    date: "%Y-%m-%d",
	    time: "%H:%M:%S",
	    periods: ["fm", "em"],
	    days: ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"],
	    shortDays: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
	    months: ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"],
	    shortMonths: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
	  });
	
	  var zhCN = locale$1({
	    dateTime: "%a %b %e %X %Y",
	    date: "%Y/%-m/%-d",
	    time: "%H:%M:%S",
	    periods: ["上午", "下午"],
	    days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
	    shortDays: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
	    months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	    shortMonths: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
	  });
	
	  var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";
	
	  function formatIsoNative(date) {
	    return date.toISOString();
	  }
	
	  formatIsoNative.parse = function(string) {
	    var date = new Date(string);
	    return isNaN(date) ? null : date;
	  };
	
	  formatIsoNative.toString = function() {
	    return isoSpecifier;
	  };
	
	  var formatIso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z")
	      ? formatIsoNative
	      : locale.utcFormat(isoSpecifier);
	
	  var format = locale.format;
	  var utcFormat = locale.utcFormat;
	
	  var version = "0.2.1";
	
	  exports.version = version;
	  exports.format = format;
	  exports.utcFormat = utcFormat;
	  exports.locale = locale$1;
	  exports.localeCaEs = caES;
	  exports.localeDeCh = deCH;
	  exports.localeDeDe = deDE;
	  exports.localeEnCa = enCA;
	  exports.localeEnGb = enGB;
	  exports.localeEnUs = locale;
	  exports.localeEsEs = esES;
	  exports.localeFiFi = fiFI;
	  exports.localeFrCa = frCA;
	  exports.localeFrFr = frFR;
	  exports.localeHeIl = heIL;
	  exports.localeHuHu = huHU;
	  exports.localeItIt = itIT;
	  exports.localeJaJp = jaJP;
	  exports.localeKoKr = koKR;
	  exports.localeMkMk = mkMK;
	  exports.localeNlNl = nlNL;
	  exports.localePlPl = plPL;
	  exports.localePtBr = ptBR;
	  exports.localeRuRu = ruRU;
	  exports.localeSvSe = svSE;
	  exports.localeZhCn = zhCN;
	  exports.isoFormat = formatIso;
	
	}));

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define('d3-format', ['exports'], factory) :
	  factory((global.d3_format = {}));
	}(this, function (exports) { 'use strict';
	
	  // Computes the decimal coefficient and exponent of the specified number x with
	  // significant digits p, where x is positive and p is in [1, 21] or undefined.
	  // For example, formatDecimal(1.23) returns ["123", 0].
	  function formatDecimal(x, p) {
	    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	    var i, coefficient = x.slice(0, i);
	
	    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	    return [
	      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	      +x.slice(i + 1)
	    ];
	  };
	
	  function exponent(x) {
	    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	  };
	
	  function formatGroup(grouping, thousands) {
	    return function(value, width) {
	      var i = value.length,
	          t = [],
	          j = 0,
	          g = grouping[0],
	          length = 0;
	
	      while (i > 0 && g > 0) {
	        if (length + g + 1 > width) g = Math.max(1, width - length);
	        t.push(value.substring(i -= g, i + g));
	        if ((length += g + 1) > width) break;
	        g = grouping[j = (j + 1) % grouping.length];
	      }
	
	      return t.reverse().join(thousands);
	    };
	  };
	
	  var prefixExponent;
	
	  function formatPrefixAuto(x, p) {
	    var d = formatDecimal(x, p);
	    if (!d) return x + "";
	    var coefficient = d[0],
	        exponent = d[1],
	        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	        n = coefficient.length;
	    return i === n ? coefficient
	        : i > n ? coefficient + new Array(i - n + 1).join("0")
	        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	        : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	  };
	
	  function formatRounded(x, p) {
	    var d = formatDecimal(x, p);
	    if (!d) return x + "";
	    var coefficient = d[0],
	        exponent = d[1];
	    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	  };
	
	  function formatDefault(x, p) {
	    x = x.toPrecision(p);
	
	    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
	      switch (x[i]) {
	        case ".": i0 = i1 = i; break;
	        case "0": if (i0 === 0) i0 = i; i1 = i; break;
	        case "e": break out;
	        default: if (i0 > 0) i0 = 0; break;
	      }
	    }
	
	    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
	  };
	
	  var formatTypes = {
	    "": formatDefault,
	    "%": function(x, p) { return (x * 100).toFixed(p); },
	    "b": function(x) { return Math.round(x).toString(2); },
	    "c": function(x) { return x + ""; },
	    "d": function(x) { return Math.round(x).toString(10); },
	    "e": function(x, p) { return x.toExponential(p); },
	    "f": function(x, p) { return x.toFixed(p); },
	    "g": function(x, p) { return x.toPrecision(p); },
	    "o": function(x) { return Math.round(x).toString(8); },
	    "p": function(x, p) { return formatRounded(x * 100, p); },
	    "r": formatRounded,
	    "s": formatPrefixAuto,
	    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	    "x": function(x) { return Math.round(x).toString(16); }
	  };
	
	  // [[fill]align][sign][symbol][0][width][,][.precision][type]
	  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;
	
	  function formatSpecifier(specifier) {
	    return new FormatSpecifier(specifier);
	  };
	
	  function FormatSpecifier(specifier) {
	    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
	
	    var match,
	        fill = match[1] || " ",
	        align = match[2] || ">",
	        sign = match[3] || "-",
	        symbol = match[4] || "",
	        zero = !!match[5],
	        width = match[6] && +match[6],
	        comma = !!match[7],
	        precision = match[8] && +match[8].slice(1),
	        type = match[9] || "";
	
	    // The "n" type is an alias for ",g".
	    if (type === "n") comma = true, type = "g";
	
	    // Map invalid types to the default format.
	    else if (!formatTypes[type]) type = "";
	
	    // If zero fill is specified, padding goes after sign and before digits.
	    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";
	
	    this.fill = fill;
	    this.align = align;
	    this.sign = sign;
	    this.symbol = symbol;
	    this.zero = zero;
	    this.width = width;
	    this.comma = comma;
	    this.precision = precision;
	    this.type = type;
	  }
	
	  FormatSpecifier.prototype.toString = function() {
	    return this.fill
	        + this.align
	        + this.sign
	        + this.symbol
	        + (this.zero ? "0" : "")
	        + (this.width == null ? "" : Math.max(1, this.width | 0))
	        + (this.comma ? "," : "")
	        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	        + this.type;
	  };
	
	  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];
	
	  function identity(x) {
	    return x;
	  }
	
	  function locale(locale) {
	    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity,
	        currency = locale.currency,
	        decimal = locale.decimal;
	
	    function format(specifier) {
	      specifier = formatSpecifier(specifier);
	
	      var fill = specifier.fill,
	          align = specifier.align,
	          sign = specifier.sign,
	          symbol = specifier.symbol,
	          zero = specifier.zero,
	          width = specifier.width,
	          comma = specifier.comma,
	          precision = specifier.precision,
	          type = specifier.type;
	
	      // Compute the prefix and suffix.
	      // For SI-prefix, the suffix is lazily computed.
	      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";
	
	      // What format function should we use?
	      // Is this an integer type?
	      // Can this type generate exponential notation?
	      var formatType = formatTypes[type],
	          maybeSuffix = !type || /[defgprs%]/.test(type);
	
	      // Set the default precision if not specified,
	      // or clamp the specified precision to the supported range.
	      // For significant precision, it must be in [1, 21].
	      // For fixed precision, it must be in [0, 20].
	      precision = precision == null ? (type ? 6 : 12)
	          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	          : Math.max(0, Math.min(20, precision));
	
	      return function(value) {
	        var valuePrefix = prefix,
	            valueSuffix = suffix;
	
	        if (type === "c") {
	          valueSuffix = formatType(value) + valueSuffix;
	          value = "";
	        } else {
	          value = +value;
	
	          // Convert negative to positive, and compute the prefix.
	          // Note that -0 is not less than 0, but 1 / -0 is!
	          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);
	
	          // Perform the initial formatting.
	          value = formatType(value, precision);
	
	          // If the original value was negative, it may be rounded to zero during
	          // formatting; treat this as (positive) zero.
	          if (valueNegative) {
	            var i = -1, n = value.length, c;
	            valueNegative = false;
	            while (++i < n) {
	              if (c = value.charCodeAt(i), (48 < c && c < 58)
	                  || (type === "x" && 96 < c && c < 103)
	                  || (type === "X" && 64 < c && c < 71)) {
	                valueNegative = true;
	                break;
	              }
	            }
	          }
	
	          // Compute the prefix and suffix.
	          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");
	
	          // Break the formatted value into the integer “value” part that can be
	          // grouped, and fractional or exponential “suffix” part that is not.
	          if (maybeSuffix) {
	            var i = -1, n = value.length, c;
	            while (++i < n) {
	              if (c = value.charCodeAt(i), 48 > c || c > 57) {
	                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	                value = value.slice(0, i);
	                break;
	              }
	            }
	          }
	        }
	
	        // If the fill character is not "0", grouping is applied before padding.
	        if (comma && !zero) value = group(value, Infinity);
	
	        // Compute the padding.
	        var length = valuePrefix.length + value.length + valueSuffix.length,
	            padding = length < width ? new Array(width - length + 1).join(fill) : "";
	
	        // If the fill character is "0", grouping is applied after padding.
	        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";
	
	        // Reconstruct the final output based on the desired alignment.
	        switch (align) {
	          case "<": return valuePrefix + value + valueSuffix + padding;
	          case "=": return valuePrefix + padding + value + valueSuffix;
	          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
	        }
	        return padding + valuePrefix + value + valueSuffix;
	      };
	    }
	
	    function formatPrefix(specifier, value) {
	      var f = format((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	          k = Math.pow(10, -e),
	          prefix = prefixes[8 + e / 3];
	      return function(value) {
	        return f(k * value) + prefix;
	      };
	    }
	
	    return {
	      format: format,
	      formatPrefix: formatPrefix
	    };
	  };
	
	  var defaultLocale = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["$", ""]
	  });
	
	  var caES = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["", "\xa0€"]
	  });
	
	  var csCZ = locale({
	    decimal: ",",
	    thousands: "\xa0",
	    grouping: [3],
	    currency: ["", "\xa0Kč"],
	  });
	
	  var deCH = locale({
	    decimal: ",",
	    thousands: "'",
	    grouping: [3],
	    currency: ["", "\xa0CHF"]
	  });
	
	  var deDE = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["", "\xa0€"]
	  });
	
	  var enCA = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["$", ""]
	  });
	
	  var enGB = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["£", ""]
	  });
	
	  var esES = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["", "\xa0€"]
	  });
	
	  var fiFI = locale({
	    decimal: ",",
	    thousands: "\xa0",
	    grouping: [3],
	    currency: ["", "\xa0€"]
	  });
	
	  var frCA = locale({
	    decimal: ",",
	    thousands: "\xa0",
	    grouping: [3],
	    currency: ["", "$"]
	  });
	
	  var frFR = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["", "\xa0€"]
	  });
	
	  var heIL = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["₪", ""]
	  });
	
	  var huHU = locale({
	    decimal: ",",
	    thousands: "\xa0",
	    grouping: [3],
	    currency: ["", "\xa0Ft"]
	  });
	
	  var itIT = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["€", ""]
	  });
	
	  var jaJP = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["", "円"]
	  });
	
	  var koKR = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["₩", ""]
	  });
	
	  var mkMK = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["", "\xa0ден."]
	  });
	
	  var nlNL = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["€\xa0", ""]
	  });
	
	  var plPL = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["", "zł"]
	  });
	
	  var ptBR = locale({
	    decimal: ",",
	    thousands: ".",
	    grouping: [3],
	    currency: ["R$", ""]
	  });
	
	  var ruRU = locale({
	    decimal: ",",
	    thousands: "\xa0",
	    grouping: [3],
	    currency: ["", "\xa0руб."]
	  });
	
	  var svSE = locale({
	    decimal: ",",
	    thousands: "\xa0",
	    grouping: [3],
	    currency: ["", "SEK"]
	  });
	
	  var zhCN = locale({
	    decimal: ".",
	    thousands: ",",
	    grouping: [3],
	    currency: ["¥", ""]
	  });
	
	  function precisionFixed(step) {
	    return Math.max(0, -exponent(Math.abs(step)));
	  };
	
	  function precisionPrefix(step, value) {
	    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	  };
	
	  function precisionRound(step, max) {
	    step = Math.abs(step), max = Math.abs(max) - step;
	    return Math.max(0, exponent(max) - exponent(step)) + 1;
	  };
	
	  var format = defaultLocale.format;
	  var formatPrefix = defaultLocale.formatPrefix;
	
	  var version = "0.4.2";
	
	  exports.version = version;
	  exports.format = format;
	  exports.formatPrefix = formatPrefix;
	  exports.locale = locale;
	  exports.localeCaEs = caES;
	  exports.localeCsCz = csCZ;
	  exports.localeDeCh = deCH;
	  exports.localeDeDe = deDE;
	  exports.localeEnCa = enCA;
	  exports.localeEnGb = enGB;
	  exports.localeEnUs = defaultLocale;
	  exports.localeEsEs = esES;
	  exports.localeFiFi = fiFI;
	  exports.localeFrCa = frCA;
	  exports.localeFrFr = frFR;
	  exports.localeHeIl = heIL;
	  exports.localeHuHu = huHU;
	  exports.localeItIt = itIT;
	  exports.localeJaJp = jaJP;
	  exports.localeKoKr = koKR;
	  exports.localeMkMk = mkMK;
	  exports.localeNlNl = nlNL;
	  exports.localePlPl = plPL;
	  exports.localePtBr = ptBR;
	  exports.localeRuRu = ruRU;
	  exports.localeSvSe = svSE;
	  exports.localeZhCn = zhCN;
	  exports.formatSpecifier = formatSpecifier;
	  exports.precisionFixed = precisionFixed;
	  exports.precisionPrefix = precisionPrefix;
	  exports.precisionRound = precisionRound;
	
	}));

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    Measures = __webpack_require__(43),
	    Collector = __webpack_require__(46);
	
	function Aggregator() {
	  this._cells = {};
	  this._aggr = [];
	  this._stream = false;
	}
	
	var Flags = Aggregator.Flags = {
	  ADD_CELL: 1,
	  MOD_CELL: 2
	};
	
	var proto = Aggregator.prototype;
	
	// Parameters
	
	proto.stream = function(v) {
	  if (v == null) return this._stream;
	  this._stream = !!v;
	  this._aggr = [];
	  return this;
	};
	
	// key accessor to use for streaming removes
	proto.key = function(key) {
	  if (key == null) return this._key;
	  this._key = util.$(key);
	  return this;
	};
	
	// Input: array of objects of the form
	// {name: string, get: function}
	proto.groupby = function(dims) {
	  this._dims = util.array(dims).map(function(d, i) {
	    d = util.isString(d) ? {name: d, get: util.$(d)}
	      : util.isFunction(d) ? {name: util.name(d) || d.name || ('_' + i), get: d}
	      : (d.name && util.isFunction(d.get)) ? d : null;
	    if (d == null) throw 'Invalid groupby argument: ' + d;
	    return d;
	  });
	  return this.clear();
	};
	
	// Input: array of objects of the form
	// {name: string, ops: [string, ...]}
	proto.summarize = function(fields) {
	  fields = summarize_args(fields);
	  this._count = true;
	  var aggr = (this._aggr = []),
	      m, f, i, j, op, as, get;
	
	  for (i=0; i<fields.length; ++i) {
	    for (j=0, m=[], f=fields[i]; j<f.ops.length; ++j) {
	      op = f.ops[j];
	      if (op !== 'count') this._count = false;
	      as = (f.as && f.as[j]) || (op + (f.name==='*' ? '' : '_'+f.name));
	      m.push(Measures[op](as));
	    }
	    get = f.get && util.$(f.get) ||
	      (f.name === '*' ? util.identity : util.$(f.name));
	    aggr.push({
	      name: f.name,
	      measures: Measures.create(
	        m,
	        this._stream, // streaming remove flag
	        get,          // input tuple getter
	        this._assign) // output tuple setter
	    });
	  }
	  return this.clear();
	};
	
	// Convenience method to summarize by count
	proto.count = function() {
	  return this.summarize({'*':'count'});
	};
	
	// Override to perform custom tuple value assignment
	proto._assign = function(object, name, value) {
	  object[name] = value;
	};
	
	function summarize_args(fields) {
	  if (util.isArray(fields)) { return fields; }
	  if (fields == null) { return []; }
	  var a = [], name, ops;
	  for (name in fields) {
	    ops = util.array(fields[name]);
	    a.push({name: name, ops: ops});
	  }
	  return a;
	}
	
	// Cell Management
	
	proto.clear = function() {
	  return (this._cells = {}, this);
	};
	
	proto._cellkey = function(x) {
	  var d = this._dims,
	      n = d.length, i,
	      k = String(d[0].get(x));
	  for (i=1; i<n; ++i) {
	    k += '|' + d[i].get(x);
	  }
	  return k;
	};
	
	proto._cell = function(x) {
	  var key = this._dims.length ? this._cellkey(x) : '';
	  return this._cells[key] || (this._cells[key] = this._newcell(x, key));
	};
	
	proto._newcell = function(x, key) {
	  var cell = {
	    num:   0,
	    tuple: this._newtuple(x, key),
	    flag:  Flags.ADD_CELL,
	    aggs:  {}
	  };
	
	  var aggr = this._aggr, i;
	  for (i=0; i<aggr.length; ++i) {
	    cell.aggs[aggr[i].name] = new aggr[i].measures(cell, cell.tuple);
	  }
	  if (cell.collect) {
	    cell.data = new Collector(this._key);
	  }
	  return cell;
	};
	
	proto._newtuple = function(x) {
	  var dims = this._dims,
	      t = {}, i, n;
	  for (i=0, n=dims.length; i<n; ++i) {
	    t[dims[i].name] = dims[i].get(x);
	  }
	  return this._ingest(t);
	};
	
	// Override to perform custom tuple ingestion
	proto._ingest = util.identity;
	
	// Process Tuples
	
	proto._add = function(x) {
	  var cell = this._cell(x),
	      aggr = this._aggr, i;
	
	  cell.num += 1;
	  if (!this._count) { // skip if count-only
	    if (cell.collect) cell.data.add(x);
	    for (i=0; i<aggr.length; ++i) {
	      cell.aggs[aggr[i].name].add(x);
	    }
	  }
	  cell.flag |= Flags.MOD_CELL;
	  if (this._on_add) this._on_add(x, cell);
	};
	
	proto._rem = function(x) {
	  var cell = this._cell(x),
	      aggr = this._aggr, i;
	
	  cell.num -= 1;
	  if (!this._count) { // skip if count-only
	    if (cell.collect) cell.data.rem(x);
	    for (i=0; i<aggr.length; ++i) {
	      cell.aggs[aggr[i].name].rem(x);
	    }
	  }
	  cell.flag |= Flags.MOD_CELL;
	  if (this._on_rem) this._on_rem(x, cell);
	};
	
	proto._mod = function(curr, prev) {
	  var cell0 = this._cell(prev),
	      cell1 = this._cell(curr),
	      aggr = this._aggr, i;
	
	  if (cell0 !== cell1) {
	    cell0.num -= 1;
	    cell1.num += 1;
	    if (cell0.collect) cell0.data.rem(prev);
	    if (cell1.collect) cell1.data.add(curr);
	  } else if (cell0.collect && !util.isObject(curr)) {
	    cell0.data.rem(prev);
	    cell0.data.add(curr);
	  }
	
	  for (i=0; i<aggr.length; ++i) {
	    cell0.aggs[aggr[i].name].rem(prev);
	    cell1.aggs[aggr[i].name].add(curr);
	  }
	  cell0.flag |= Flags.MOD_CELL;
	  cell1.flag |= Flags.MOD_CELL;
	  if (this._on_mod) this._on_mod(curr, prev, cell0, cell1);
	};
	
	proto._markMod = function(x) {
	  var cell0 = this._cell(x);
	  cell0.flag |= Flags.MOD_CELL;
	};
	
	proto.result = function() {
	  var result = [],
	      aggr = this._aggr,
	      cell, i, k;
	
	  for (k in this._cells) {
	    cell = this._cells[k];
	    if (cell.num > 0) {
	      // consolidate collector values
	      if (cell.collect) {
	        cell.data.values();
	      }
	      // update tuple properties
	      for (i=0; i<aggr.length; ++i) {
	        cell.aggs[aggr[i].name].set();
	      }
	      // add output tuple
	      result.push(cell.tuple);
	    } else {
	      delete this._cells[k];
	    }
	    cell.flag = 0;
	  }
	
	  this._rems = false;
	  return result;
	};
	
	proto.changes = function(output) {
	  var changes = output || {add:[], rem:[], mod:[]},
	      aggr = this._aggr,
	      cell, flag, i, k;
	
	  for (k in this._cells) {
	    cell = this._cells[k];
	    flag = cell.flag;
	
	    // consolidate collector values
	    if (cell.collect) {
	      cell.data.values();
	    }
	
	    // update tuple properties
	    for (i=0; i<aggr.length; ++i) {
	      cell.aggs[aggr[i].name].set();
	    }
	
	    // organize output tuples
	    if (cell.num <= 0) {
	      changes.rem.push(cell.tuple); // if (flag === Flags.MOD_CELL) { ??
	      delete this._cells[k];
	      if (this._on_drop) this._on_drop(cell);
	    } else {
	      if (this._on_keep) this._on_keep(cell);
	      if (flag & Flags.ADD_CELL) {
	        changes.add.push(cell.tuple);
	      } else if (flag & Flags.MOD_CELL) {
	        changes.mod.push(cell.tuple);
	      }
	    }
	
	    cell.flag = 0;
	  }
	
	  this._rems = false;
	  return changes;
	};
	
	proto.execute = function(input) {
	  return this.clear().insert(input).result();
	};
	
	proto.insert = function(input) {
	  this._consolidate();
	  for (var i=0; i<input.length; ++i) {
	    this._add(input[i]);
	  }
	  return this;
	};
	
	proto.remove = function(input) {
	  if (!this._stream) {
	    throw 'Aggregator not configured for streaming removes.' +
	      ' Call stream(true) prior to calling summarize.';
	  }
	  for (var i=0; i<input.length; ++i) {
	    this._rem(input[i]);
	  }
	  this._rems = true;
	  return this;
	};
	
	// consolidate removals
	proto._consolidate = function() {
	  if (!this._rems) return;
	  for (var k in this._cells) {
	    if (this._cells[k].collect) {
	      this._cells[k].data.values();
	    }
	  }
	  this._rems = false;
	};
	
	module.exports = Aggregator;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	
	var types = {
	  'values': measure({
	    name: 'values',
	    init: 'cell.collect = true;',
	    set:  'cell.data.values()', idx: -1
	  }),
	  'count': measure({
	    name: 'count',
	    set:  'cell.num'
	  }),
	  'missing': measure({
	    name: 'missing',
	    set:  'this.missing'
	  }),
	  'valid': measure({
	    name: 'valid',
	    set:  'this.valid'
	  }),
	  'sum': measure({
	    name: 'sum',
	    init: 'this.sum = 0;',
	    add:  'this.sum += v;',
	    rem:  'this.sum -= v;',
	    set:  'this.sum'
	  }),
	  'mean': measure({
	    name: 'mean',
	    init: 'this.mean = 0;',
	    add:  'var d = v - this.mean; this.mean += d / this.valid;',
	    rem:  'var d = v - this.mean; this.mean -= this.valid ? d / this.valid : this.mean;',
	    set:  'this.mean'
	  }),
	  'average': measure({
	    name: 'average',
	    set:  'this.mean',
	    req:  ['mean'], idx: 1
	  }),
	  'variance': measure({
	    name: 'variance',
	    init: 'this.dev = 0;',
	    add:  'this.dev += d * (v - this.mean);',
	    rem:  'this.dev -= d * (v - this.mean);',
	    set:  'this.valid > 1 ? this.dev / (this.valid-1) : 0',
	    req:  ['mean'], idx: 1
	  }),
	  'variancep': measure({
	    name: 'variancep',
	    set:  'this.valid > 1 ? this.dev / this.valid : 0',
	    req:  ['variance'], idx: 2
	  }),
	  'stdev': measure({
	    name: 'stdev',
	    set:  'this.valid > 1 ? Math.sqrt(this.dev / (this.valid-1)) : 0',
	    req:  ['variance'], idx: 2
	  }),
	  'stdevp': measure({
	    name: 'stdevp',
	    set:  'this.valid > 1 ? Math.sqrt(this.dev / this.valid) : 0',
	    req:  ['variance'], idx: 2
	  }),
	  'median': measure({
	    name: 'median',
	    set:  'cell.data.q2(this.get)',
	    req:  ['values'], idx: 3
	  }),
	  'q1': measure({
	    name: 'q1',
	    set:  'cell.data.q1(this.get)',
	    req:  ['values'], idx: 3
	  }),
	  'q3': measure({
	    name: 'q3',
	    set:  'cell.data.q3(this.get)',
	    req:  ['values'], idx: 3
	  }),
	  'distinct': measure({
	    name: 'distinct',
	    set:  'this.distinct(cell.data.values(), this.get)',
	    req:  ['values'], idx: 3
	  }),
	  'argmin': measure({
	    name: 'argmin',
	    add:  'if (v < this.min) this.argmin = t;',
	    rem:  'if (v <= this.min) this.argmin = null;',
	    set:  'this.argmin = this.argmin || cell.data.argmin(this.get)',
	    req:  ['min'], str: ['values'], idx: 3
	  }),
	  'argmax': measure({
	    name: 'argmax',
	    add:  'if (v > this.max) this.argmax = t;',
	    rem:  'if (v >= this.max) this.argmax = null;',
	    set:  'this.argmax = this.argmax || cell.data.argmax(this.get)',
	    req:  ['max'], str: ['values'], idx: 3
	  }),
	  'min': measure({
	    name: 'min',
	    init: 'this.min = +Infinity;',
	    add:  'if (v < this.min) this.min = v;',
	    rem:  'if (v <= this.min) this.min = NaN;',
	    set:  'this.min = (isNaN(this.min) ? cell.data.min(this.get) : this.min)',
	    str:  ['values'], idx: 4
	  }),
	  'max': measure({
	    name: 'max',
	    init: 'this.max = -Infinity;',
	    add:  'if (v > this.max) this.max = v;',
	    rem:  'if (v >= this.max) this.max = NaN;',
	    set:  'this.max = (isNaN(this.max) ? cell.data.max(this.get) : this.max)',
	    str:  ['values'], idx: 4
	  }),
	  'modeskew': measure({
	    name: 'modeskew',
	    set:  'this.dev===0 ? 0 : (this.mean - cell.data.q2(this.get)) / Math.sqrt(this.dev/(this.valid-1))',
	    req:  ['mean', 'stdev', 'median'], idx: 5
	  })
	};
	
	function measure(base) {
	  return function(out) {
	    var m = util.extend({init:'', add:'', rem:'', idx:0}, base);
	    m.out = out || base.name;
	    return m;
	  };
	}
	
	function resolve(agg, stream) {
	  function collect(m, a) {
	    function helper(r) { if (!m[r]) collect(m, m[r] = types[r]()); }
	    if (a.req) a.req.forEach(helper);
	    if (stream && a.str) a.str.forEach(helper);
	    return m;
	  }
	  var map = agg.reduce(
	    collect,
	    agg.reduce(function(m, a) { return (m[a.name] = a, m); }, {})
	  );
	  return util.vals(map).sort(function(a, b) { return a.idx - b.idx; });
	}
	
	function create(agg, stream, accessor, mutator) {
	  var all = resolve(agg, stream),
	      ctr = 'this.cell = cell; this.tuple = t; this.valid = 0; this.missing = 0;',
	      add = 'if (v==null) this.missing++; if (!this.isValid(v)) return; ++this.valid;',
	      rem = 'if (v==null) this.missing--; if (!this.isValid(v)) return; --this.valid;',
	      set = 'var t = this.tuple; var cell = this.cell;';
	
	  all.forEach(function(a) {
	    if (a.idx < 0) {
	      ctr = a.init + ctr;
	      add = a.add + add;
	      rem = a.rem + rem;
	    } else {
	      ctr += a.init;
	      add += a.add;
	      rem += a.rem;
	    }
	  });
	  agg.slice()
	    .sort(function(a, b) { return a.idx - b.idx; })
	    .forEach(function(a) {
	      set += 'this.assign(t,\''+a.out+'\','+a.set+');';
	    });
	  set += 'return t;';
	
	  /* jshint evil: true */
	  ctr = Function('cell', 't', ctr);
	  ctr.prototype.assign = mutator;
	  ctr.prototype.add = Function('t', 'var v = this.get(t);' + add);
	  ctr.prototype.rem = Function('t', 'var v = this.get(t);' + rem);
	  ctr.prototype.set = Function(set);
	  ctr.prototype.get = accessor;
	  ctr.prototype.distinct = __webpack_require__(44).count.distinct;
	  ctr.prototype.isValid = util.isValid;
	  ctr.fields = agg.map(util.$('out'));
	  return ctr;
	}
	
	types.create = create;
	module.exports = types;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	var type = __webpack_require__(30);
	var gen = __webpack_require__(45);
	
	var stats = module.exports;
	
	// Collect unique values.
	// Output: an array of unique values, in first-observed order
	stats.unique = function(values, f, results) {
	  f = util.$(f);
	  results = results || [];
	  var u = {}, v, i, n;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (v in u) continue;
	    u[v] = 1;
	    results.push(v);
	  }
	  return results;
	};
	
	// Return the length of the input array.
	stats.count = function(values) {
	  return values && values.length || 0;
	};
	
	// Count the number of non-null, non-undefined, non-NaN values.
	stats.count.valid = function(values, f) {
	  f = util.$(f);
	  var v, i, n, valid = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) valid += 1;
	  }
	  return valid;
	};
	
	// Count the number of null or undefined values.
	stats.count.missing = function(values, f) {
	  f = util.$(f);
	  var v, i, n, count = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (v == null) count += 1;
	  }
	  return count;
	};
	
	// Count the number of distinct values.
	// Null, undefined and NaN are each considered distinct values.
	stats.count.distinct = function(values, f) {
	  f = util.$(f);
	  var u = {}, v, i, n, count = 0;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (v in u) continue;
	    u[v] = 1;
	    count += 1;
	  }
	  return count;
	};
	
	// Construct a map from distinct values to occurrence counts.
	stats.count.map = function(values, f) {
	  f = util.$(f);
	  var map = {}, v, i, n;
	  for (i=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    map[v] = (v in map) ? map[v] + 1 : 1;
	  }
	  return map;
	};
	
	// Compute the median of an array of numbers.
	stats.median = function(values, f) {
	  if (f) values = values.map(util.$(f));
	  values = values.filter(util.isValid).sort(util.cmp);
	  return stats.quantile(values, 0.5);
	};
	
	// Computes the quartile boundaries of an array of numbers.
	stats.quartile = function(values, f) {
	  if (f) values = values.map(util.$(f));
	  values = values.filter(util.isValid).sort(util.cmp);
	  var q = stats.quantile;
	  return [q(values, 0.25), q(values, 0.50), q(values, 0.75)];
	};
	
	// Compute the quantile of a sorted array of numbers.
	// Adapted from the D3.js implementation.
	stats.quantile = function(values, f, p) {
	  if (p === undefined) { p = f; f = util.identity; }
	  f = util.$(f);
	  var H = (values.length - 1) * p + 1,
	      h = Math.floor(H),
	      v = +f(values[h - 1]),
	      e = H - h;
	  return e ? v + e * (f(values[h]) - v) : v;
	};
	
	// Compute the sum of an array of numbers.
	stats.sum = function(values, f) {
	  f = util.$(f);
	  for (var sum=0, i=0, n=values.length, v; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) sum += v;
	  }
	  return sum;
	};
	
	// Compute the mean (average) of an array of numbers.
	stats.mean = function(values, f) {
	  f = util.$(f);
	  var mean = 0, delta, i, n, c, v;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      delta = v - mean;
	      mean = mean + delta / (++c);
	    }
	  }
	  return mean;
	};
	
	// Compute the geometric mean of an array of numbers.
	stats.mean.geometric = function(values, f) {
	  f = util.$(f);
	  var mean = 1, c, n, v, i;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      if (v <= 0) {
	        throw Error("Geometric mean only defined for positive values.");
	      }
	      mean *= v;
	      ++c;
	    }
	  }
	  mean = c > 0 ? Math.pow(mean, 1/c) : 0;
	  return mean;
	};
	
	// Compute the harmonic mean of an array of numbers.
	stats.mean.harmonic = function(values, f) {
	  f = util.$(f);
	  var mean = 0, c, n, v, i;
	  for (i=0, c=0, n=values.length; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      mean += 1/v;
	      ++c;
	    }
	  }
	  return c / mean;
	};
	
	// Compute the sample variance of an array of numbers.
	stats.variance = function(values, f) {
	  f = util.$(f);
	  if (!util.isArray(values) || values.length < 2) return 0;
	  var mean = 0, M2 = 0, delta, i, c, v;
	  for (i=0, c=0; i<values.length; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      delta = v - mean;
	      mean = mean + delta / (++c);
	      M2 = M2 + delta * (v - mean);
	    }
	  }
	  M2 = M2 / (c - 1);
	  return M2;
	};
	
	// Compute the sample standard deviation of an array of numbers.
	stats.stdev = function(values, f) {
	  return Math.sqrt(stats.variance(values, f));
	};
	
	// Compute the Pearson mode skewness ((median-mean)/stdev) of an array of numbers.
	stats.modeskew = function(values, f) {
	  var avg = stats.mean(values, f),
	      med = stats.median(values, f),
	      std = stats.stdev(values, f);
	  return std === 0 ? 0 : (avg - med) / std;
	};
	
	// Find the minimum value in an array.
	stats.min = function(values, f) {
	  return stats.extent(values, f)[0];
	};
	
	// Find the maximum value in an array.
	stats.max = function(values, f) {
	  return stats.extent(values, f)[1];
	};
	
	// Find the minimum and maximum of an array of values.
	stats.extent = function(values, f) {
	  f = util.$(f);
	  var a, b, v, i, n = values.length;
	  for (i=0; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) { a = b = v; break; }
	  }
	  for (; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      if (v < a) a = v;
	      if (v > b) b = v;
	    }
	  }
	  return [a, b];
	};
	
	// Find the integer indices of the minimum and maximum values.
	stats.extent.index = function(values, f) {
	  f = util.$(f);
	  var x = -1, y = -1, a, b, v, i, n = values.length;
	  for (i=0; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) { a = b = v; x = y = i; break; }
	  }
	  for (; i<n; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      if (v < a) { a = v; x = i; }
	      if (v > b) { b = v; y = i; }
	    }
	  }
	  return [x, y];
	};
	
	// Compute the dot product of two arrays of numbers.
	stats.dot = function(values, a, b) {
	  var sum = 0, i, v;
	  if (!b) {
	    if (values.length !== a.length) {
	      throw Error('Array lengths must match.');
	    }
	    for (i=0; i<values.length; ++i) {
	      v = values[i] * a[i];
	      if (v === v) sum += v;
	    }
	  } else {
	    a = util.$(a);
	    b = util.$(b);
	    for (i=0; i<values.length; ++i) {
	      v = a(values[i]) * b(values[i]);
	      if (v === v) sum += v;
	    }
	  }
	  return sum;
	};
	
	// Compute the vector distance between two arrays of numbers.
	// Default is Euclidean (exp=2) distance, configurable via exp argument.
	stats.dist = function(values, a, b, exp) {
	  var f = util.isFunction(b) || util.isString(b),
	      X = values,
	      Y = f ? values : a,
	      e = f ? exp : b,
	      L2 = e === 2 || e == null,
	      n = values.length, s = 0, d, i;
	  if (f) {
	    a = util.$(a);
	    b = util.$(b);
	  }
	  for (i=0; i<n; ++i) {
	    d = f ? (a(X[i])-b(Y[i])) : (X[i]-Y[i]);
	    s += L2 ? d*d : Math.pow(Math.abs(d), e);
	  }
	  return L2 ? Math.sqrt(s) : Math.pow(s, 1/e);
	};
	
	// Compute the Cohen's d effect size between two arrays of numbers.
	stats.cohensd = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      x1 = stats.mean(X),
	      x2 = stats.mean(Y),
	      n1 = stats.count.valid(X),
	      n2 = stats.count.valid(Y);
	
	  if ((n1+n2-2) <= 0) {
	    // if both arrays are size 1, or one is empty, there's no effect size
	    return 0;
	  }
	  // pool standard deviation
	  var s1 = stats.variance(X),
	      s2 = stats.variance(Y),
	      s = Math.sqrt((((n1-1)*s1) + ((n2-1)*s2)) / (n1+n2-2));
	  // if there is no variance, there's no effect size
	  return s===0 ? 0 : (x1 - x2) / s;
	};
	
	// Computes the covariance between two arrays of numbers
	stats.covariance = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n = X.length,
	      xm = stats.mean(X),
	      ym = stats.mean(Y),
	      sum = 0, c = 0, i, x, y, vx, vy;
	
	  if (n !== Y.length) {
	    throw Error('Input lengths must match.');
	  }
	
	  for (i=0; i<n; ++i) {
	    x = X[i]; vx = util.isValid(x);
	    y = Y[i]; vy = util.isValid(y);
	    if (vx && vy) {
	      sum += (x-xm) * (y-ym);
	      ++c;
	    } else if (vx || vy) {
	      throw Error('Valid values must align.');
	    }
	  }
	  return sum / (c-1);
	};
	
	// Compute ascending rank scores for an array of values.
	// Ties are assigned their collective mean rank.
	stats.rank = function(values, f) {
	  f = util.$(f) || util.identity;
	  var a = values.map(function(v, i) {
	      return {idx: i, val: f(v)};
	    })
	    .sort(util.comparator('val'));
	
	  var n = values.length,
	      r = Array(n),
	      tie = -1, p = {}, i, v, mu;
	
	  for (i=0; i<n; ++i) {
	    v = a[i].val;
	    if (tie < 0 && p === v) {
	      tie = i - 1;
	    } else if (tie > -1 && p !== v) {
	      mu = 1 + (i-1 + tie) / 2;
	      for (; tie<i; ++tie) r[a[tie].idx] = mu;
	      tie = -1;
	    }
	    r[a[i].idx] = i + 1;
	    p = v;
	  }
	
	  if (tie > -1) {
	    mu = 1 + (n-1 + tie) / 2;
	    for (; tie<n; ++tie) r[a[tie].idx] = mu;
	  }
	
	  return r;
	};
	
	// Compute the sample Pearson product-moment correlation of two arrays of numbers.
	stats.cor = function(values, a, b) {
	  var fn = b;
	  b = fn ? values.map(util.$(b)) : a;
	  a = fn ? values.map(util.$(a)) : values;
	
	  var dot = stats.dot(a, b),
	      mua = stats.mean(a),
	      mub = stats.mean(b),
	      sda = stats.stdev(a),
	      sdb = stats.stdev(b),
	      n = values.length;
	
	  return (dot - n*mua*mub) / ((n-1) * sda * sdb);
	};
	
	// Compute the Spearman rank correlation of two arrays of values.
	stats.cor.rank = function(values, a, b) {
	  var ra = b ? stats.rank(values, a) : stats.rank(values),
	      rb = b ? stats.rank(values, b) : stats.rank(a),
	      n = values.length, i, s, d;
	
	  for (i=0, s=0; i<n; ++i) {
	    d = ra[i] - rb[i];
	    s += d * d;
	  }
	
	  return 1 - 6*s / (n * (n*n-1));
	};
	
	// Compute the distance correlation of two arrays of numbers.
	// http://en.wikipedia.org/wiki/Distance_correlation
	stats.cor.dist = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a;
	
	  var A = stats.dist.mat(X),
	      B = stats.dist.mat(Y),
	      n = A.length,
	      i, aa, bb, ab;
	
	  for (i=0, aa=0, bb=0, ab=0; i<n; ++i) {
	    aa += A[i]*A[i];
	    bb += B[i]*B[i];
	    ab += A[i]*B[i];
	  }
	
	  return Math.sqrt(ab / Math.sqrt(aa*bb));
	};
	
	// Simple linear regression.
	// Returns a "fit" object with slope (m), intercept (b),
	// r value (R), and sum-squared residual error (rss).
	stats.linearRegression = function(values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n = X.length,
	      xy = stats.covariance(X, Y), // will throw err if valid vals don't align
	      sx = stats.stdev(X),
	      sy = stats.stdev(Y),
	      slope = xy / (sx*sx),
	      icept = stats.mean(Y) - slope * stats.mean(X),
	      fit = {slope: slope, intercept: icept, R: xy / (sx*sy), rss: 0},
	      res, i;
	
	  for (i=0; i<n; ++i) {
	    if (util.isValid(X[i]) && util.isValid(Y[i])) {
	      res = (slope*X[i] + icept) - Y[i];
	      fit.rss += res * res;
	    }
	  }
	
	  return fit;
	};
	
	// Namespace for bootstrap
	stats.bootstrap = {};
	
	// Construct a bootstrapped confidence interval at a given percentile level
	// Arguments are an array, an optional n (defaults to 1000),
	//  an optional alpha (defaults to 0.05), and an optional smoothing parameter
	stats.bootstrap.ci = function(values, a, b, c, d) {
	  var X, N, alpha, smooth, bs, means, i;
	  if (util.isFunction(a) || util.isString(a)) {
	    X = values.map(util.$(a));
	    N = b;
	    alpha = c;
	    smooth = d;
	  } else {
	    X = values;
	    N = a;
	    alpha = b;
	    smooth = c;
	  }
	  N = N ? +N : 1000;
	  alpha = alpha || 0.05;
	
	  bs = gen.random.bootstrap(X, smooth);
	  for (i=0, means = Array(N); i<N; ++i) {
	    means[i] = stats.mean(bs.samples(X.length));
	  }
	  means.sort(util.numcmp);
	  return [
	    stats.quantile(means, alpha/2),
	    stats.quantile(means, 1-(alpha/2))
	  ];
	};
	
	// Namespace for z-tests
	stats.z = {};
	
	// Construct a z-confidence interval at a given significance level
	// Arguments are an array and an optional alpha (defaults to 0.05).
	stats.z.ci = function(values, a, b) {
	  var X = values, alpha = a;
	  if (util.isFunction(a) || util.isString(a)) {
	    X = values.map(util.$(a));
	    alpha = b;
	  }
	  alpha = alpha || 0.05;
	
	  var z = alpha===0.05 ? 1.96 : gen.random.normal(0, 1).icdf(1-(alpha/2)),
	      mu = stats.mean(X),
	      SE = stats.stdev(X) / Math.sqrt(stats.count.valid(X));
	  return [mu - (z*SE), mu + (z*SE)];
	};
	
	// Perform a z-test of means. Returns the p-value.
	// If a single array is provided, performs a one-sample location test.
	// If two arrays or a table and two accessors are provided, performs
	// a two-sample location test. A paired test is performed if specified
	// by the options hash.
	// The options hash format is: {paired: boolean, nullh: number}.
	// http://en.wikipedia.org/wiki/Z-test
	// http://en.wikipedia.org/wiki/Paired_difference_test
	stats.z.test = function(values, a, b, opt) {
	  if (util.isFunction(b) || util.isString(b)) { // table and accessors
	    return (opt && opt.paired ? ztestP : ztest2)(opt, values, a, b);
	  } else if (util.isArray(a)) { // two arrays
	    return (b && b.paired ? ztestP : ztest2)(b, values, a);
	  } else if (util.isFunction(a) || util.isString(a)) {
	    return ztest1(b, values, a); // table and accessor
	  } else {
	    return ztest1(a, values); // one array
	  }
	};
	
	// Perform a z-test of means. Returns the p-value.
	// Assuming we have a list of values, and a null hypothesis. If no null
	// hypothesis, assume our null hypothesis is mu=0.
	function ztest1(opt, X, f) {
	  var nullH = opt && opt.nullh || 0,
	      gaussian = gen.random.normal(0, 1),
	      mu = stats.mean(X,f),
	      SE = stats.stdev(X,f) / Math.sqrt(stats.count.valid(X,f));
	
	  if (SE===0) {
	    // Test not well defined when standard error is 0.
	    return (mu - nullH) === 0 ? 1 : 0;
	  }
	  // Two-sided, so twice the one-sided cdf.
	  var z = (mu - nullH) / SE;
	  return 2 * gaussian.cdf(-Math.abs(z));
	}
	
	// Perform a two sample paired z-test of means. Returns the p-value.
	function ztestP(opt, values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n1 = stats.count(X),
	      n2 = stats.count(Y),
	      diffs = Array(), i;
	
	  if (n1 !== n2) {
	    throw Error('Array lengths must match.');
	  }
	  for (i=0; i<n1; ++i) {
	    // Only valid differences should contribute to the test statistic
	    if (util.isValid(X[i]) && util.isValid(Y[i])) {
	      diffs.push(X[i] - Y[i]);
	    }
	  }
	  return stats.z.test(diffs, opt && opt.nullh || 0);
	}
	
	// Perform a two sample z-test of means. Returns the p-value.
	function ztest2(opt, values, a, b) {
	  var X = b ? values.map(util.$(a)) : values,
	      Y = b ? values.map(util.$(b)) : a,
	      n1 = stats.count.valid(X),
	      n2 = stats.count.valid(Y),
	      gaussian = gen.random.normal(0, 1),
	      meanDiff = stats.mean(X) - stats.mean(Y) - (opt && opt.nullh || 0),
	      SE = Math.sqrt(stats.variance(X)/n1 + stats.variance(Y)/n2);
	
	  if (SE===0) {
	    // Not well defined when pooled standard error is 0.
	    return meanDiff===0 ? 1 : 0;
	  }
	  // Two-tailed, so twice the one-sided cdf.
	  var z = meanDiff / SE;
	  return 2 * gaussian.cdf(-Math.abs(z));
	}
	
	// Construct a mean-centered distance matrix for an array of numbers.
	stats.dist.mat = function(X) {
	  var n = X.length,
	      m = n*n,
	      A = Array(m),
	      R = gen.zeros(n),
	      M = 0, v, i, j;
	
	  for (i=0; i<n; ++i) {
	    A[i*n+i] = 0;
	    for (j=i+1; j<n; ++j) {
	      A[i*n+j] = (v = Math.abs(X[i] - X[j]));
	      A[j*n+i] = v;
	      R[i] += v;
	      R[j] += v;
	    }
	  }
	
	  for (i=0; i<n; ++i) {
	    M += R[i];
	    R[i] /= n;
	  }
	  M /= m;
	
	  for (i=0; i<n; ++i) {
	    for (j=i; j<n; ++j) {
	      A[i*n+j] += M - R[i] - R[j];
	      A[j*n+i] = A[i*n+j];
	    }
	  }
	
	  return A;
	};
	
	// Compute the Shannon entropy (log base 2) of an array of counts.
	stats.entropy = function(counts, f) {
	  f = util.$(f);
	  var i, p, s = 0, H = 0, n = counts.length;
	  for (i=0; i<n; ++i) {
	    s += (f ? f(counts[i]) : counts[i]);
	  }
	  if (s === 0) return 0;
	  for (i=0; i<n; ++i) {
	    p = (f ? f(counts[i]) : counts[i]) / s;
	    if (p) H += p * Math.log(p);
	  }
	  return -H / Math.LN2;
	};
	
	// Compute the mutual information between two discrete variables.
	// Returns an array of the form [MI, MI_distance]
	// MI_distance is defined as 1 - I(a,b) / H(a,b).
	// http://en.wikipedia.org/wiki/Mutual_information
	stats.mutual = function(values, a, b, counts) {
	  var x = counts ? values.map(util.$(a)) : values,
	      y = counts ? values.map(util.$(b)) : a,
	      z = counts ? values.map(util.$(counts)) : b;
	
	  var px = {},
	      py = {},
	      n = z.length,
	      s = 0, I = 0, H = 0, p, t, i;
	
	  for (i=0; i<n; ++i) {
	    px[x[i]] = 0;
	    py[y[i]] = 0;
	  }
	
	  for (i=0; i<n; ++i) {
	    px[x[i]] += z[i];
	    py[y[i]] += z[i];
	    s += z[i];
	  }
	
	  t = 1 / (s * Math.LN2);
	  for (i=0; i<n; ++i) {
	    if (z[i] === 0) continue;
	    p = (s * z[i]) / (px[x[i]] * py[y[i]]);
	    I += z[i] * t * Math.log(p);
	    H += z[i] * t * Math.log(z[i]/s);
	  }
	
	  return [I, 1 + I/H];
	};
	
	// Compute the mutual information between two discrete variables.
	stats.mutual.info = function(values, a, b, counts) {
	  return stats.mutual(values, a, b, counts)[0];
	};
	
	// Compute the mutual information distance between two discrete variables.
	// MI_distance is defined as 1 - I(a,b) / H(a,b).
	stats.mutual.dist = function(values, a, b, counts) {
	  return stats.mutual(values, a, b, counts)[1];
	};
	
	// Compute a profile of summary statistics for a variable.
	stats.profile = function(values, f) {
	  var mean = 0,
	      valid = 0,
	      missing = 0,
	      distinct = 0,
	      min = null,
	      max = null,
	      M2 = 0,
	      vals = [],
	      u = {}, delta, sd, i, v, x;
	
	  // compute summary stats
	  for (i=0; i<values.length; ++i) {
	    v = f ? f(values[i]) : values[i];
	
	    // update unique values
	    u[v] = (v in u) ? u[v] + 1 : (distinct += 1, 1);
	
	    if (v == null) {
	      ++missing;
	    } else if (util.isValid(v)) {
	      // update stats
	      x = (typeof v === 'string') ? v.length : v;
	      if (min===null || x < min) min = x;
	      if (max===null || x > max) max = x;
	      delta = x - mean;
	      mean = mean + delta / (++valid);
	      M2 = M2 + delta * (x - mean);
	      vals.push(x);
	    }
	  }
	  M2 = M2 / (valid - 1);
	  sd = Math.sqrt(M2);
	
	  // sort values for median and iqr
	  vals.sort(util.cmp);
	
	  return {
	    type:     type(values, f),
	    unique:   u,
	    count:    values.length,
	    valid:    valid,
	    missing:  missing,
	    distinct: distinct,
	    min:      min,
	    max:      max,
	    mean:     mean,
	    stdev:    sd,
	    median:   (v = stats.quantile(vals, 0.5)),
	    q1:       stats.quantile(vals, 0.25),
	    q3:       stats.quantile(vals, 0.75),
	    modeskew: sd === 0 ? 0 : (mean - v) / sd
	  };
	};
	
	// Compute profiles for all variables in a data set.
	stats.summary = function(data, fields) {
	  fields = fields || util.keys(data[0]);
	  var s = fields.map(function(f) {
	    var p = stats.profile(data, util.$(f));
	    return (p.field = f, p);
	  });
	  return (s.__summary__ = true, s);
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    gen = module.exports;
	
	gen.repeat = function(val, n) {
	  var a = Array(n), i;
	  for (i=0; i<n; ++i) a[i] = val;
	  return a;
	};
	
	gen.zeros = function(n) {
	  return gen.repeat(0, n);
	};
	
	gen.range = function(start, stop, step) {
	  if (arguments.length < 3) {
	    step = 1;
	    if (arguments.length < 2) {
	      stop = start;
	      start = 0;
	    }
	  }
	  if ((stop - start) / step == Infinity) throw new Error('Infinite range');
	  var range = [], i = -1, j;
	  if (step < 0) while ((j = start + step * ++i) > stop) range.push(j);
	  else while ((j = start + step * ++i) < stop) range.push(j);
	  return range;
	};
	
	gen.random = {};
	
	gen.random.uniform = function(min, max) {
	  if (max === undefined) {
	    max = min === undefined ? 1 : min;
	    min = 0;
	  }
	  var d = max - min;
	  var f = function() {
	    return min + d * Math.random();
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  f.pdf = function(x) {
	    return (x >= min && x <= max) ? 1/d : 0;
	  };
	  f.cdf = function(x) {
	    return x < min ? 0 : x > max ? 1 : (x - min) / d;
	  };
	  f.icdf = function(p) {
	    return (p >= 0 && p <= 1) ? min + p*d : NaN;
	  };
	  return f;
	};
	
	gen.random.integer = function(a, b) {
	  if (b === undefined) {
	    b = a;
	    a = 0;
	  }
	  var d = b - a;
	  var f = function() {
	    return a + Math.floor(d * Math.random());
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  f.pdf = function(x) {
	    return (x === Math.floor(x) && x >= a && x < b) ? 1/d : 0;
	  };
	  f.cdf = function(x) {
	    var v = Math.floor(x);
	    return v < a ? 0 : v >= b ? 1 : (v - a + 1) / d;
	  };
	  f.icdf = function(p) {
	    return (p >= 0 && p <= 1) ? a - 1 + Math.floor(p*d) : NaN;
	  };
	  return f;
	};
	
	gen.random.normal = function(mean, stdev) {
	  mean = mean || 0;
	  stdev = stdev || 1;
	  var next;
	  var f = function() {
	    var x = 0, y = 0, rds, c;
	    if (next !== undefined) {
	      x = next;
	      next = undefined;
	      return x;
	    }
	    do {
	      x = Math.random()*2-1;
	      y = Math.random()*2-1;
	      rds = x*x + y*y;
	    } while (rds === 0 || rds > 1);
	    c = Math.sqrt(-2*Math.log(rds)/rds); // Box-Muller transform
	    next = mean + y*c*stdev;
	    return mean + x*c*stdev;
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  f.pdf = function(x) {
	    var exp = Math.exp(Math.pow(x-mean, 2) / (-2 * Math.pow(stdev, 2)));
	    return (1 / (stdev * Math.sqrt(2*Math.PI))) * exp;
	  };
	  f.cdf = function(x) {
	    // Approximation from West (2009)
	    // Better Approximations to Cumulative Normal Functions
	    var cd,
	        z = (x - mean) / stdev,
	        Z = Math.abs(z);
	    if (Z > 37) {
	      cd = 0;
	    } else {
	      var sum, exp = Math.exp(-Z*Z/2);
	      if (Z < 7.07106781186547) {
	        sum = 3.52624965998911e-02 * Z + 0.700383064443688;
	        sum = sum * Z + 6.37396220353165;
	        sum = sum * Z + 33.912866078383;
	        sum = sum * Z + 112.079291497871;
	        sum = sum * Z + 221.213596169931;
	        sum = sum * Z + 220.206867912376;
	        cd = exp * sum;
	        sum = 8.83883476483184e-02 * Z + 1.75566716318264;
	        sum = sum * Z + 16.064177579207;
	        sum = sum * Z + 86.7807322029461;
	        sum = sum * Z + 296.564248779674;
	        sum = sum * Z + 637.333633378831;
	        sum = sum * Z + 793.826512519948;
	        sum = sum * Z + 440.413735824752;
	        cd = cd / sum;
	      } else {
	        sum = Z + 0.65;
	        sum = Z + 4 / sum;
	        sum = Z + 3 / sum;
	        sum = Z + 2 / sum;
	        sum = Z + 1 / sum;
	        cd = exp / sum / 2.506628274631;
	      }
	    }
	    return z > 0 ? 1 - cd : cd;
	  };
	  f.icdf = function(p) {
	    // Approximation of Probit function using inverse error function.
	    if (p <= 0 || p >= 1) return NaN;
	    var x = 2*p - 1,
	        v = (8 * (Math.PI - 3)) / (3 * Math.PI * (4-Math.PI)),
	        a = (2 / (Math.PI*v)) + (Math.log(1 - Math.pow(x,2)) / 2),
	        b = Math.log(1 - (x*x)) / v,
	        s = (x > 0 ? 1 : -1) * Math.sqrt(Math.sqrt((a*a) - b) - a);
	    return mean + stdev * Math.SQRT2 * s;
	  };
	  return f;
	};
	
	gen.random.bootstrap = function(domain, smooth) {
	  // Generates a bootstrap sample from a set of observations.
	  // Smooth bootstrapping adds random zero-centered noise to the samples.
	  var val = domain.filter(util.isValid),
	      len = val.length,
	      err = smooth ? gen.random.normal(0, smooth) : null;
	  var f = function() {
	    return val[~~(Math.random()*len)] + (err ? err() : 0);
	  };
	  f.samples = function(n) {
	    return gen.zeros(n).map(f);
	  };
	  return f;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	var stats = __webpack_require__(44);
	
	var REM = '__dl_rem__';
	
	function Collector(key) {
	  this._add = [];
	  this._rem = [];
	  this._key = key || null;
	  this._last = null;
	}
	
	var proto = Collector.prototype;
	
	proto.add = function(v) {
	  this._add.push(v);
	};
	
	proto.rem = function(v) {
	  this._rem.push(v);
	};
	
	proto.values = function() {
	  this._get = null;
	  if (this._rem.length === 0) return this._add;
	
	  var a = this._add,
	      r = this._rem,
	      k = this._key,
	      x = Array(a.length - r.length),
	      i, j, n, m;
	
	  if (!util.isObject(r[0])) {
	    // processing raw values
	    m = stats.count.map(r);
	    for (i=0, j=0, n=a.length; i<n; ++i) {
	      if (m[a[i]] > 0) {
	        m[a[i]] -= 1;
	      } else {
	        x[j++] = a[i];
	      }
	    }
	  } else if (k) {
	    // has unique key field, so use that
	    m = util.toMap(r, k);
	    for (i=0, j=0, n=a.length; i<n; ++i) {
	      if (!m.hasOwnProperty(k(a[i]))) { x[j++] = a[i]; }
	    }
	  } else {
	    // no unique key, mark tuples directly
	    for (i=0, n=r.length; i<n; ++i) {
	      r[i][REM] = 1;
	    }
	    for (i=0, j=0, n=a.length; i<n; ++i) {
	      if (!a[i][REM]) { x[j++] = a[i]; }
	    }
	    for (i=0, n=r.length; i<n; ++i) {
	      delete r[i][REM];
	    }
	  }
	
	  this._rem = [];
	  return (this._add = x);
	};
	
	// memoizing statistics methods
	
	proto.extent = function(get) {
	  if (this._get !== get || !this._ext) {
	    var v = this.values(),
	        i = stats.extent.index(v, get);
	    this._ext = [v[i[0]], v[i[1]]];
	    this._get = get;
	  }
	  return this._ext;
	};
	
	proto.argmin = function(get) {
	  return this.extent(get)[0];
	};
	
	proto.argmax = function(get) {
	  return this.extent(get)[1];
	};
	
	proto.min = function(get) {
	  var m = this.extent(get)[0];
	  return m != null ? get(m) : +Infinity;
	};
	
	proto.max = function(get) {
	  var m = this.extent(get)[1];
	  return m != null ? get(m) : -Infinity;
	};
	
	proto.quartile = function(get) {
	  if (this._get !== get || !this._q) {
	    this._q = stats.quartile(this.values(), get);
	    this._get = get;
	  }
	  return this._q;
	};
	
	proto.q1 = function(get) {
	  return this.quartile(get)[0];
	};
	
	proto.q2 = function(get) {
	  return this.quartile(get)[1];
	};
	
	proto.q3 = function(get) {
	  return this.quartile(get)[2];
	};
	
	module.exports = Collector;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	var Aggregator = __webpack_require__(42);
	
	module.exports = function() {
	  // flatten arguments into a single array
	  var args = [].reduce.call(arguments, function(a, x) {
	    return a.concat(util.array(x));
	  }, []);
	  // create and return an aggregator
	  return new Aggregator()
	    .groupby(args)
	    .summarize({'*':'values'});
	};


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    time = __webpack_require__(49),
	    EPSILON = 1e-15;
	
	function bins(opt) {
	  if (!opt) { throw Error("Missing binning options."); }
	
	  // determine range
	  var maxb = opt.maxbins || 15,
	      base = opt.base || 10,
	      logb = Math.log(base),
	      div = opt.div || [5, 2],
	      min = opt.min,
	      max = opt.max,
	      span = max - min,
	      step, level, minstep, precision, v, i, eps;
	
	  if (opt.step) {
	    // if step size is explicitly given, use that
	    step = opt.step;
	  } else if (opt.steps) {
	    // if provided, limit choice to acceptable step sizes
	    step = opt.steps[Math.min(
	      opt.steps.length - 1,
	      bisect(opt.steps, span/maxb, 0, opt.steps.length)
	    )];
	  } else {
	    // else use span to determine step size
	    level = Math.ceil(Math.log(maxb) / logb);
	    minstep = opt.minstep || 0;
	    step = Math.max(
	      minstep,
	      Math.pow(base, Math.round(Math.log(span) / logb) - level)
	    );
	
	    // increase step size if too many bins
	    while (Math.ceil(span/step) > maxb) { step *= base; }
	
	    // decrease step size if allowed
	    for (i=0; i<div.length; ++i) {
	      v = step / div[i];
	      if (v >= minstep && span / v <= maxb) step = v;
	    }
	  }
	
	  // update precision, min and max
	  v = Math.log(step);
	  precision = v >= 0 ? 0 : ~~(-v / logb) + 1;
	  eps = Math.pow(base, -precision - 1);
	  min = Math.min(min, Math.floor(min / step + eps) * step);
	  max = Math.ceil(max / step) * step;
	
	  return {
	    start: min,
	    stop:  max,
	    step:  step,
	    unit:  {precision: precision},
	    value: value,
	    index: index
	  };
	}
	
	function bisect(a, x, lo, hi) {
	  while (lo < hi) {
	    var mid = lo + hi >>> 1;
	    if (util.cmp(a[mid], x) < 0) { lo = mid + 1; }
	    else { hi = mid; }
	  }
	  return lo;
	}
	
	function value(v) {
	  return this.step * Math.floor(v / this.step + EPSILON);
	}
	
	function index(v) {
	  return Math.floor((v - this.start) / this.step + EPSILON);
	}
	
	function date_value(v) {
	  return this.unit.date(value.call(this, v));
	}
	
	function date_index(v) {
	  return index.call(this, this.unit.unit(v));
	}
	
	bins.date = function(opt) {
	  if (!opt) { throw Error("Missing date binning options."); }
	
	  // find time step, then bin
	  var units = opt.utc ? time.utc : time,
	      dmin = opt.min,
	      dmax = opt.max,
	      maxb = opt.maxbins || 20,
	      minb = opt.minbins || 4,
	      span = (+dmax) - (+dmin),
	      unit = opt.unit ? units[opt.unit] : units.find(span, minb, maxb),
	      spec = bins({
	        min:     unit.min != null ? unit.min : unit.unit(dmin),
	        max:     unit.max != null ? unit.max : unit.unit(dmax),
	        maxbins: maxb,
	        minstep: unit.minstep,
	        steps:   unit.step
	      });
	
	  spec.unit = unit;
	  spec.index = date_index;
	  if (!opt.raw) spec.value = date_value;
	  return spec;
	};
	
	module.exports = bins;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var d3_time = __webpack_require__(39);
	
	var tempDate = new Date(),
	    baseDate = new Date(0, 0, 1).setFullYear(0), // Jan 1, 0 AD
	    utcBaseDate = new Date(Date.UTC(0, 0, 1)).setUTCFullYear(0);
	
	function date(d) {
	  return (tempDate.setTime(+d), tempDate);
	}
	
	// create a time unit entry
	function entry(type, date, unit, step, min, max) {
	  var e = {
	    type: type,
	    date: date,
	    unit: unit
	  };
	  if (step) {
	    e.step = step;
	  } else {
	    e.minstep = 1;
	  }
	  if (min != null) e.min = min;
	  if (max != null) e.max = max;
	  return e;
	}
	
	function create(type, unit, base, step, min, max) {
	  return entry(type,
	    function(d) { return unit.offset(base, d); },
	    function(d) { return unit.count(base, d); },
	    step, min, max);
	}
	
	var locale = [
	  create('second', d3_time.second, baseDate),
	  create('minute', d3_time.minute, baseDate),
	  create('hour',   d3_time.hour,   baseDate),
	  create('day',    d3_time.day,    baseDate, [1, 7]),
	  create('month',  d3_time.month,  baseDate, [1, 3, 6]),
	  create('year',   d3_time.year,   baseDate),
	
	  // periodic units
	  entry('seconds',
	    function(d) { return new Date(1970, 0, 1, 0, 0, d); },
	    function(d) { return date(d).getSeconds(); },
	    null, 0, 59
	  ),
	  entry('minutes',
	    function(d) { return new Date(1970, 0, 1, 0, d); },
	    function(d) { return date(d).getMinutes(); },
	    null, 0, 59
	  ),
	  entry('hours',
	    function(d) { return new Date(1970, 0, 1, d); },
	    function(d) { return date(d).getHours(); },
	    null, 0, 23
	  ),
	  entry('weekdays',
	    function(d) { return new Date(1970, 0, 4+d); },
	    function(d) { return date(d).getDay(); },
	    [1], 0, 6
	  ),
	  entry('dates',
	    function(d) { return new Date(1970, 0, d); },
	    function(d) { return date(d).getDate(); },
	    [1], 1, 31
	  ),
	  entry('months',
	    function(d) { return new Date(1970, d % 12, 1); },
	    function(d) { return date(d).getMonth(); },
	    [1], 0, 11
	  )
	];
	
	var utc = [
	  create('second', d3_time.utcSecond, utcBaseDate),
	  create('minute', d3_time.utcMinute, utcBaseDate),
	  create('hour',   d3_time.utcHour,   utcBaseDate),
	  create('day',    d3_time.utcDay,    utcBaseDate, [1, 7]),
	  create('month',  d3_time.utcMonth,  utcBaseDate, [1, 3, 6]),
	  create('year',   d3_time.utcYear,   utcBaseDate),
	
	  // periodic units
	  entry('seconds',
	    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, 0, d)); },
	    function(d) { return date(d).getUTCSeconds(); },
	    null, 0, 59
	  ),
	  entry('minutes',
	    function(d) { return new Date(Date.UTC(1970, 0, 1, 0, d)); },
	    function(d) { return date(d).getUTCMinutes(); },
	    null, 0, 59
	  ),
	  entry('hours',
	    function(d) { return new Date(Date.UTC(1970, 0, 1, d)); },
	    function(d) { return date(d).getUTCHours(); },
	    null, 0, 23
	  ),
	  entry('weekdays',
	    function(d) { return new Date(Date.UTC(1970, 0, 4+d)); },
	    function(d) { return date(d).getUTCDay(); },
	    [1], 0, 6
	  ),
	  entry('dates',
	    function(d) { return new Date(Date.UTC(1970, 0, d)); },
	    function(d) { return date(d).getUTCDate(); },
	    [1], 1, 31
	  ),
	  entry('months',
	    function(d) { return new Date(Date.UTC(1970, d % 12, 1)); },
	    function(d) { return date(d).getUTCMonth(); },
	    [1], 0, 11
	  )
	];
	
	var STEPS = [
	  [31536e6, 5],  // 1-year
	  [7776e6, 4],   // 3-month
	  [2592e6, 4],   // 1-month
	  [12096e5, 3],  // 2-week
	  [6048e5, 3],   // 1-week
	  [1728e5, 3],   // 2-day
	  [864e5, 3],    // 1-day
	  [432e5, 2],    // 12-hour
	  [216e5, 2],    // 6-hour
	  [108e5, 2],    // 3-hour
	  [36e5, 2],     // 1-hour
	  [18e5, 1],     // 30-minute
	  [9e5, 1],      // 15-minute
	  [3e5, 1],      // 5-minute
	  [6e4, 1],      // 1-minute
	  [3e4, 0],      // 30-second
	  [15e3, 0],     // 15-second
	  [5e3, 0],      // 5-second
	  [1e3, 0]       // 1-second
	];
	
	function find(units, span, minb, maxb) {
	  var step = STEPS[0], i, n, bins;
	
	  for (i=1, n=STEPS.length; i<n; ++i) {
	    step = STEPS[i];
	    if (span > step[0]) {
	      bins = span / step[0];
	      if (bins > maxb) {
	        return units[STEPS[i-1][1]];
	      }
	      if (bins >= minb) {
	        return units[step[1]];
	      }
	    }
	  }
	  return units[STEPS[n-1][1]];
	}
	
	function toUnitMap(units) {
	  var map = {}, i, n;
	  for (i=0, n=units.length; i<n; ++i) {
	    map[units[i].type] = units[i];
	  }
	  map.find = function(span, minb, maxb) {
	    return find(units, span, minb, maxb);
	  };
	  return map;
	}
	
	module.exports = toUnitMap(locale);
	module.exports.utc = toUnitMap(utc);

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var bins = __webpack_require__(48),
	    gen  = __webpack_require__(45),
	    type = __webpack_require__(30),
	    util = __webpack_require__(19),
	    stats = __webpack_require__(44);
	
	var qtype = {
	  'integer': 1,
	  'number': 1,
	  'date': 1
	};
	
	function $bin(values, f, opt) {
	  opt = options(values, f, opt);
	  var b = spec(opt);
	  return !b ? (opt.accessor || util.identity) :
	    util.$func('bin', b.unit.unit ?
	      function(x) { return b.value(b.unit.unit(x)); } :
	      function(x) { return b.value(x); }
	    )(opt.accessor);
	}
	
	function histogram(values, f, opt) {
	  opt = options(values, f, opt);
	  var b = spec(opt);
	  return b ?
	    numerical(values, opt.accessor, b) :
	    categorical(values, opt.accessor, opt && opt.sort);
	}
	
	function spec(opt) {
	  var t = opt.type, b = null;
	  if (t == null || qtype[t]) {
	    if (t === 'integer' && opt.minstep == null) opt.minstep = 1;
	    b = (t === 'date') ? bins.date(opt) : bins(opt);
	  }
	  return b;
	}
	
	function options() {
	  var a = arguments,
	      i = 0,
	      values = util.isArray(a[i]) ? a[i++] : null,
	      f = util.isFunction(a[i]) || util.isString(a[i]) ? util.$(a[i++]) : null,
	      opt = util.extend({}, a[i]);
	
	  if (values) {
	    opt.type = opt.type || type(values, f);
	    if (qtype[opt.type]) {
	      var ext = stats.extent(values, f);
	      opt = util.extend({min: ext[0], max: ext[1]}, opt);
	    }
	  }
	  if (f) { opt.accessor = f; }
	  return opt;
	}
	
	function numerical(values, f, b) {
	  var h = gen.range(b.start, b.stop + b.step/2, b.step)
	    .map(function(v) { return {value: b.value(v), count: 0}; });
	
	  for (var i=0, v, j; i<values.length; ++i) {
	    v = f ? f(values[i]) : values[i];
	    if (util.isValid(v)) {
	      j = b.index(v);
	      if (j < 0 || j >= h.length || !isFinite(j)) continue;
	      h[j].count += 1;
	    }
	  }
	  h.bins = b;
	  return h;
	}
	
	function categorical(values, f, sort) {
	  var u = stats.unique(values, f),
	      c = stats.count.map(values, f);
	  return u.map(function(k) { return {value: k, count: c[k]}; })
	    .sort(util.comparator(sort ? '-count' : '+value'));
	}
	
	module.exports = {
	  $bin: $bin,
	  histogram: histogram
	};


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    format = __webpack_require__(38);
	
	var context = {
	  formats:    [],
	  format_map: {},
	  truncate:   util.truncate,
	  pad:        util.pad,
	  day:        format.day,
	  month:      format.month
	};
	
	function template(text) {
	  var src = source(text, 'd');
	  src = 'var __t; return ' + src + ';';
	
	  /* jshint evil: true */
	  return (new Function('d', src)).bind(context);
	}
	
	template.source = source;
	template.context = context;
	template.format = get_format;
	module.exports = template;
	
	// Clear cache of format objects.
	// This can *break* prior template functions, so invoke with care!
	template.clearFormatCache = function() {
	  context.formats = [];
	  context.format_map = {};
	};
	
	// Generate property access code for use within template source.
	// object: the name of the object (variable) containing template data
	// property: the property access string, verbatim from template tag
	template.property = function(object, property) {
	  var src = util.field(property).map(util.str).join('][');
	  return object + '[' + src + ']';
	};
	
	// Generate source code for a template function.
	// text: the template text
	// variable: the name of the data object variable ('obj' by default)
	// properties: optional hash for collecting all accessed properties
	function source(text, variable, properties) {
	  variable = variable || 'obj';
	  var index = 0;
	  var src = '\'';
	  var regex = template_re;
	
	  // Compile the template source, escaping string literals appropriately.
	  text.replace(regex, function(match, interpolate, offset) {
	    src += text
	      .slice(index, offset)
	      .replace(template_escaper, template_escapeChar);
	    index = offset + match.length;
	
	    if (interpolate) {
	      src += '\'\n+((__t=(' +
	        template_var(interpolate, variable, properties) +
	        '))==null?\'\':__t)+\n\'';
	    }
	
	    // Adobe VMs need the match returned to produce the correct offest.
	    return match;
	  });
	  return src + '\'';
	}
	
	function template_var(text, variable, properties) {
	  var filters = text.match(filter_re);
	  var prop = filters.shift().trim();
	  var stringCast = true;
	
	  function strcall(fn) {
	    fn = fn || '';
	    if (stringCast) {
	      stringCast = false;
	      src = 'String(' + src + ')' + fn;
	    } else {
	      src += fn;
	    }
	    return src;
	  }
	
	  function date() {
	    return '(typeof ' + src + '==="number"?new Date('+src+'):'+src+')';
	  }
	
	  function formatter(type) {
	    var pattern = args[0];
	    if ((pattern[0] === '\'' && pattern[pattern.length-1] === '\'') ||
	        (pattern[0] === '"'  && pattern[pattern.length-1] === '"')) {
	      pattern = pattern.slice(1, -1);
	    } else {
	      throw Error('Format pattern must be quoted: ' + pattern);
	    }
	    a = template_format(pattern, type);
	    stringCast = false;
	    var arg = type === 'number' ? src : date();
	    src = 'this.formats['+a+']('+arg+')';
	  }
	
	  if (properties) properties[prop] = 1;
	  var src = template.property(variable, prop);
	
	  for (var i=0; i<filters.length; ++i) {
	    var f = filters[i], args = null, pidx, a, b;
	
	    if ((pidx=f.indexOf(':')) > 0) {
	      f = f.slice(0, pidx);
	      args = filters[i].slice(pidx+1)
	        .match(args_re)
	        .map(function(s) { return s.trim(); });
	    }
	    f = f.trim();
	
	    switch (f) {
	      case 'length':
	        strcall('.length');
	        break;
	      case 'lower':
	        strcall('.toLowerCase()');
	        break;
	      case 'upper':
	        strcall('.toUpperCase()');
	        break;
	      case 'lower-locale':
	        strcall('.toLocaleLowerCase()');
	        break;
	      case 'upper-locale':
	        strcall('.toLocaleUpperCase()');
	        break;
	      case 'trim':
	        strcall('.trim()');
	        break;
	      case 'left':
	        a = util.number(args[0]);
	        strcall('.slice(0,' + a + ')');
	        break;
	      case 'right':
	        a = util.number(args[0]);
	        strcall('.slice(-' + a +')');
	        break;
	      case 'mid':
	        a = util.number(args[0]);
	        b = a + util.number(args[1]);
	        strcall('.slice(+'+a+','+b+')');
	        break;
	      case 'slice':
	        a = util.number(args[0]);
	        strcall('.slice('+ a +
	          (args.length > 1 ? ',' + util.number(args[1]) : '') +
	          ')');
	        break;
	      case 'truncate':
	        a = util.number(args[0]);
	        b = args[1];
	        b = (b!=='left' && b!=='middle' && b!=='center') ? 'right' : b;
	        src = 'this.truncate(' + strcall() + ',' + a + ',\'' + b + '\')';
	        break;
	      case 'pad':
	        a = util.number(args[0]);
	        b = args[1];
	        b = (b!=='left' && b!=='middle' && b!=='center') ? 'right' : b;
	        src = 'this.pad(' + strcall() + ',' + a + ',\'' + b + '\')';
	        break;
	      case 'number':
	        formatter('number');
	        break;
	      case 'time':
	        formatter('time');
	        break;
	      case 'time-utc':
	        formatter('utc');
	        break;
	      case 'month':
	        src = 'this.month(' + src + ')';
	        break;
	      case 'month-abbrev':
	        src = 'this.month(' + src + ',true)';
	        break;
	      case 'day':
	        src = 'this.day(' + src + ')';
	        break;
	      case 'day-abbrev':
	        src = 'this.day(' + src + ',true)';
	        break;
	      default:
	        throw Error('Unrecognized template filter: ' + f);
	    }
	  }
	
	  return src;
	}
	
	var template_re = /\{\{(.+?)\}\}|$/g,
	    filter_re = /(?:"[^"]*"|\'[^\']*\'|[^\|"]+|[^\|\']+)+/g,
	    args_re = /(?:"[^"]*"|\'[^\']*\'|[^,"]+|[^,\']+)+/g;
	
	// Certain characters need to be escaped so that they can be put into a
	// string literal.
	var template_escapes = {
	  '\'':     '\'',
	  '\\':     '\\',
	  '\r':     'r',
	  '\n':     'n',
	  '\u2028': 'u2028',
	  '\u2029': 'u2029'
	};
	
	var template_escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	function template_escapeChar(match) {
	  return '\\' + template_escapes[match];
	}
	
	function template_format(pattern, type) {
	  var key = type + ':' + pattern;
	  if (context.format_map[key] == null) {
	    var f = format[type](pattern);
	    var i = context.formats.length;
	    context.formats.push(f);
	    context.format_map[key] = i;
	    return i;
	  }
	  return context.format_map[key];
	}
	
	function get_format(pattern, type) {
	  return context.formats[template_format(pattern, type)];
	}


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    time = __webpack_require__(49),
	    utc = time.utc;
	
	var u = module.exports;
	
	u.$year   = util.$func('year', time.year.unit);
	u.$month  = util.$func('month', time.months.unit);
	u.$date   = util.$func('date', time.dates.unit);
	u.$day    = util.$func('day', time.weekdays.unit);
	u.$hour   = util.$func('hour', time.hours.unit);
	u.$minute = util.$func('minute', time.minutes.unit);
	u.$second = util.$func('second', time.seconds.unit);
	
	u.$utcYear   = util.$func('utcYear', utc.year.unit);
	u.$utcMonth  = util.$func('utcMonth', utc.months.unit);
	u.$utcDate   = util.$func('utcDate', utc.dates.unit);
	u.$utcDay    = util.$func('utcDay', utc.weekdays.unit);
	u.$utcHour   = util.$func('utcHour', utc.hours.unit);
	u.$utcMinute = util.$func('utcMinute', utc.minutes.unit);
	u.$utcSecond = util.$func('utcSecond', utc.seconds.unit);


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19);
	var load = __webpack_require__(24);
	var read = __webpack_require__(29);
	
	module.exports = util
	  .keys(read.formats)
	  .reduce(function(out, type) {
	    out[type] = function(opt, format, callback) {
	      // process arguments
	      if (util.isString(opt)) { opt = {url: opt}; }
	      if (arguments.length === 2 && util.isFunction(format)) {
	        callback = format;
	        format = undefined;
	      }
	
	      // set up read format
	      format = util.extend({parse: 'auto'}, format);
	      format.type = type;
	
	      // load data
	      var data = load(opt, callback ? function(error, data) {
	        if (error) { callback(error, null); return; }
	        try {
	          // data loaded, now parse it (async)
	          data = read(data, format);
	          callback(null, data);
	        } catch (e) {
	          callback(e, null);
	        }
	      } : undefined);
	
	      // data loaded, now parse it (sync)
	      if (!callback) return read(data, format);
	    };
	    return out;
	  }, {});


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(19),
	    type = __webpack_require__(30),
	    stats = __webpack_require__(44),
	    template = __webpack_require__(51);
	
	module.exports = {
	  table:   formatTable,  // format a data table
	  summary: formatSummary // format a data table summary
	};
	
	var FMT = {
	  'date':    '|time:"%m/%d/%Y %H:%M:%S"',
	  'number':  '|number:".4f"',
	  'integer': '|number:"d"'
	};
	
	var POS = {
	  'number':  'left',
	  'integer': 'left'
	};
	
	function formatTable(data, opt) {
	  opt = util.extend({separator:' ', minwidth: 8, maxwidth: 15}, opt);
	  var fields = opt.fields || util.keys(data[0]),
	      types = type.all(data);
	
	  if (opt.start || opt.limit) {
	    var a = opt.start || 0,
	        b = opt.limit ? a + opt.limit : data.length;
	    data = data.slice(a, b);
	  }
	
	  // determine char width of fields
	  var lens = fields.map(function(name) {
	    var format = FMT[types[name]] || '',
	        t = template('{{' + name + format + '}}'),
	        l = stats.max(data, function(x) { return t(x).length; });
	    l = Math.max(Math.min(name.length, opt.minwidth), l);
	    return opt.maxwidth > 0 ? Math.min(l, opt.maxwidth) : l;
	  });
	
	  // print header row
	  var head = fields.map(function(name, i) {
	    return util.truncate(util.pad(name, lens[i], 'center'), lens[i]);
	  }).join(opt.separator);
	
	  // build template function for each row
	  var tmpl = template(fields.map(function(name, i) {
	    return '{{' +
	      name +
	      (FMT[types[name]] || '') +
	      ('|pad:' + lens[i] + ',' + (POS[types[name]] || 'right')) +
	      ('|truncate:' + lens[i]) +
	    '}}';
	  }).join(opt.separator));
	
	  // print table
	  return head + "\n" + data.map(tmpl).join('\n');
	}
	
	function formatSummary(s) {
	  s = s ? s.__summary__ ? s : stats.summary(s) : this;
	  var str = [], i, n;
	  for (i=0, n=s.length; i<n; ++i) {
	    str.push('-- ' + s[i].field + ' --');
	    if (s[i].type === 'string' || s[i].distinct < 10) {
	      str.push(printCategoricalProfile(s[i]));
	    } else {
	      str.push(printQuantitativeProfile(s[i]));
	    }
	    str.push('');
	  }
	  return str.join('\n');
	}
	
	function printQuantitativeProfile(p) {
	  return [
	    'valid:    ' + p.valid,
	    'missing:  ' + p.missing,
	    'distinct: ' + p.distinct,
	    'min:      ' + p.min,
	    'max:      ' + p.max,
	    'median:   ' + p.median,
	    'mean:     ' + p.mean,
	    'stdev:    ' + p.stdev,
	    'modeskew: ' + p.modeskew
	  ].join('\n');
	}
	
	function printCategoricalProfile(p) {
	  var list = [
	    'valid:    ' + p.valid,
	    'missing:  ' + p.missing,
	    'distinct: ' + p.distinct,
	    'top values: '
	  ];
	  var u = p.unique;
	  var top = util.keys(u)
	    .sort(function(a,b) { return u[b] - u[a]; })
	    .slice(0, 6)
	    .map(function(v) { return ' \'' + v + '\' (' + u[v] + ')'; });
	  return list.concat(top).join('\n');
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    Heap = __webpack_require__(56),
	    ChangeSet = __webpack_require__(11),
	    DataSource = __webpack_require__(17),
	    Collector = __webpack_require__(13),
	    Tuple = __webpack_require__(15),
	    Signal = __webpack_require__(57),
	    Deps = __webpack_require__(12);
	
	function Graph() {
	}
	
	var prototype = Graph.prototype;
	
	prototype.init = function() {
	  this._stamp = 0;
	  this._rank  = 0;
	
	  this._data = {};
	  this._signals = {};
	  this._requestedIndexes = {};
	
	  this.doNotPropagate = {};
	};
	
	prototype.rank = function() {
	  return ++this._rank;
	};
	
	prototype.values = function(type, names, hash) {
	  var data = (type === Deps.SIGNALS ? this._signals : this._data),
	      n = (names !== undefined ? names : dl.keys(data)),
	      vals, i;
	
	  if (Array.isArray(n)) {
	    vals = hash || {};
	    for (i=0; i<n.length; ++i) {
	      vals[n[i]] = data[n[i]].values();
	    }
	    return vals;
	  } else {
	    return data[n].values();
	  }
	};
	
	// Retain for backwards-compatibility
	prototype.dataValues = function(names) {
	  return this.values(Deps.DATA, names);
	};
	
	// Retain for backwards-compatibility
	prototype.signalValues = function(names) {
	  return this.values(Deps.SIGNALS, names);
	};
	
	prototype.data = function(name, pipeline, facet) {
	  var db = this._data;
	  if (!arguments.length) {
	    var all = [], key;
	    for (key in db) { all.push(db[key]); }
	    return all;
	  } else if (arguments.length === 1) {
	    return db[name];
	  } else {
	    return (db[name] = new DataSource(this, name, facet).pipeline(pipeline));
	  }
	};
	
	prototype.signal = function(name, init) {
	  if (arguments.length === 1) {
	    var m = this;
	    return Array.isArray(name) ?
	      name.map(function(n) { return m._signals[n]; }) :
	      this._signals[name];
	  } else {
	    return (this._signals[name] = new Signal(this, name, init));
	  }
	};
	
	prototype.signalRef = function(ref) {
	  if (!Array.isArray(ref)) {
	    ref = dl.field(ref);
	  }
	
	  var value = this.signal(ref[0]).value();
	  if (ref.length > 1) {
	    for (var i=1, n=ref.length; i<n; ++i) {
	      value = value[ref[i]];
	    }
	  }
	  return value;
	};
	
	prototype.requestIndex = function(data, field) {
	  var ri  = this._requestedIndexes,
	      reg = ri[data] || (ri[data] = {}); 
	  return (reg[field] = true, this);
	};
	
	prototype.buildIndexes = function() {
	  var ri = this._requestedIndexes,
	      data = dl.keys(ri),
	      i, len, j, jlen, d, src, fields, f;
	
	  for (i=0, len=data.length; i<len; ++i) {
	    src = this.data(d=data[i]);
	    if (!src) throw Error('Data source '+dl.str(d)+' does not exist.');
	
	    fields = dl.keys(ri[d]);
	    for (j=0, jlen=fields.length; j<jlen; ++j) {
	      if ((f=fields[j]) === null) continue;
	      src.getIndex(f);
	      ri[d][f] = null;
	    }
	  }
	
	  return this;
	};
	
	// Stamp should be specified with caution. It is necessary for inline datasources,
	// which need to be populated during the same cycle even though propagation has
	// passed that part of the dataflow graph. 
	// If skipSignals is true, Signal nodes do not get reevaluated but their listeners
	// are queued for propagation. This is useful when setting signal values in batch
	// (e.g., time travel to the initial state).
	prototype.propagate = function(pulse, node, stamp, skipSignals) {
	  var pulses = {},
	      listeners, next, nplse, tpls, ntpls, i, len, isSg;
	
	  // new PQ with each propagation cycle so that we can pulse branches
	  // of the dataflow graph during a propagation (e.g., when creating
	  // a new inline datasource).
	  var pq = new Heap(function(a, b) {
	    // Sort on qrank (queue-rank).
	    // Rank can change during propagation due to rewiring.
	    return a._qrank - b._qrank;
	  });
	
	  if (pulse.stamp) throw Error('Pulse already has a non-zero stamp.');
	
	  pulse.stamp = stamp || ++this._stamp;
	  pulses[node._id] = pulse;
	  pq.push(node.qrank(true));
	
	  while (pq.size() > 0) {
	    node  = pq.peek();
	    isSg  = node instanceof Signal;
	    pulse = pulses[node._id];
	
	    if (node.rank() !== node.qrank()) {
	      // A node's rank might change during a propagation. Re-queue if so.
	      pq.replace(node.qrank(true));
	    } else {
	      // Evaluate node and propagate pulse.
	      pq.pop();
	      pulses[node._id] = null;
	      listeners = node._listeners;
	
	      if (!isSg || (isSg && !skipSignals)) {
	        pulse = this.evaluate(pulse, node);
	      }
	
	      // Propagate the pulse.
	      if (pulse !== this.doNotPropagate) {
	        // Ensure reflow pulses always send reflow pulses even if skipped.
	        if (!pulse.reflow && node.reflows()) {
	          pulse = ChangeSet.create(pulse, true);
	        }
	
	        for (i=0, len=listeners.length; i<len; ++i) {
	          next = listeners[i];
	
	          if ((nplse = pulses[next._id]) !== undefined) {
	            if (nplse === null) throw Error('Already propagated to node.');
	            if (nplse === pulse) continue;  // Re-queueing the same pulse.
	
	            // We've already queued this node. Ensure there should be at most one
	            // pulse with tuples (add/mod/rem), and the remainder will be reflows.
	            tpls  = pulse.add.length || pulse.mod.length || pulse.rem.length;
	            ntpls = nplse.add.length || nplse.mod.length || nplse.rem.length;
	
	            if (tpls && ntpls) throw Error('Multiple changeset pulses to same node');
	
	            // Combine reflow and tuples into a single pulse.
	            pulses[next._id] = tpls ? pulse : nplse;
	            pulses[next._id].reflow = pulse.reflow || nplse.reflow;
	          } else {
	            // First time we're seeing this node, queue it for propagation.
	            pq.push(next.qrank(true));
	            pulses[next._id] = pulse;
	          }
	        }
	      }
	    }
	  }
	
	  return this.done(pulse);
	};
	
	// Perform final bookkeeping on the graph, after propagation is complete.
	//  - For all updated datasources, synchronize their previous values.
	prototype.done = function(pulse) {
	  log.debug(pulse, ['bookkeeping']);
	  for (var d in pulse.data) { this.data(d).synchronize(); }
	  return this;
	};
	
	// Process a new branch of the dataflow graph prior to connection:
	// (1) Insert new Collector nodes as needed.
	// (2) Track + return mutation/routing status of the branch.
	prototype.preprocess = function(branch) {
	  var graph = this,
	      mutates = 0,
	      node, router, collector, collects;
	
	  for (var i=0; i<branch.length; ++i) {
	    node = branch[i];
	
	    // Batch nodes need access to a materialized dataset.
	    if (node.batch() && !node._collector) {
	      if (router || !collector) {
	        node = new Collector(graph);
	        branch.splice(i, 0, node);
	        router = false;
	      } else {
	        node._collector = collector;
	      }
	    }
	
	    if ((collects = node.collector())) collector = node;
	    router  = router  || node.router() && !collects;
	    mutates = mutates || node.mutates();
	
	    // A collector needs to be inserted after tuple-producing
	    // nodes for correct previous value tracking.
	    if (node.produces()) {
	      branch.splice(i+1, 0, new Collector(graph));
	      router = false;
	    }
	  }
	
	  return {router: router, collector: collector, mutates: mutates};
	};
	
	prototype.connect = function(branch) {
	  var collector, node, data, signals, i, n, j, m, x, y;
	
	  // connect the pipeline
	  for (i=0, n=branch.length; i<n; ++i) {
	    node = branch[i];
	    if (node.collector()) collector = node;
	
	    data = node.dependency(Deps.DATA);
	    for (j=0, m=data.length; j<m; ++j) {
	      if (!(x=this.data(y=data[j]))) {
	        throw new Error('Unknown data source ' + dl.str(y));
	      }
	
	      x.addListener(collector);
	    }
	
	    signals = node.dependency(Deps.SIGNALS);
	    for (j=0, m=signals.length; j<m; ++j) {
	      if (!(x=this.signal(y=signals[j]))) {
	        throw new Error('Unknown signal ' + dl.str(y));
	      }
	
	      x.addListener(collector);
	    }
	
	    if (i > 0) branch[i-1].addListener(node);
	  }
	
	  return branch;
	};
	
	prototype.disconnect = function(branch) {
	  var collector, node, data, signals, i, n, j, m;
	
	  for (i=0, n=branch.length; i<n; ++i) {
	    node = branch[i];
	    if (node.collector()) collector = node;
	
	    data = node.dependency(Deps.DATA);
	    for (j=0, m=data.length; j<m; ++j) {
	      this.data(data[j]).removeListener(collector);
	    }
	
	    signals = node.dependency(Deps.SIGNALS);
	    for (j=0, m=signals.length; j<m; ++j) {
	      this.signal(signals[j]).removeListener(collector);
	    }
	
	    node.disconnect();
	  }
	
	  return branch;
	};
	
	prototype.synchronize = function(branch) {
	  var ids = {},
	      node, data, i, n, j, m, d, id;
	
	  for (i=0, n=branch.length; i<n; ++i) {
	    node = branch[i];
	    if (!node.collector()) continue;
	
	    for (j=0, data=node.data(), m=data.length; j<m; ++j) {
	      id = (d = data[j])._id;
	      if (ids[id]) continue;
	      Tuple.prev_update(d);
	      ids[id] = 1;
	    }
	  }
	
	  return this;
	};
	
	prototype.reevaluate = function(pulse, node) {
	  var reflowed = pulse.reflow && node.last() >= pulse.stamp,
	      run = node.router() || pulse.add.length || pulse.rem.length;
	
	  return run || !reflowed || node.reevaluate(pulse);
	};
	
	prototype.evaluate = function(pulse, node) {
	  if (!this.reevaluate(pulse, node)) return pulse;
	  pulse = node.evaluate(pulse);
	  node.last(pulse.stamp);
	  return pulse;
	};
	
	module.exports = Graph;


/***/ },
/* 56 */
/***/ function(module, exports) {

	function Heap(comparator) {
	  this.cmp = comparator;
	  this.nodes = [];
	}
	
	var prototype = Heap.prototype;
	
	prototype.size = function() {
	  return this.nodes.length;
	};
	
	prototype.clear = function() {
	  return (this.nodes = [], this);
	};
	
	prototype.peek = function() {
	  return this.nodes[0];
	};
	
	prototype.push = function(x) {
	  var array = this.nodes;
	  array.push(x);
	  return _siftdown(array, 0, array.length-1, this.cmp);
	};
	
	prototype.pop = function() {
	  var array = this.nodes,
	      last = array.pop(),
	      item;
	
	  if (array.length) {
	    item = array[0];
	    array[0] = last;
	    _siftup(array, 0, this.cmp);
	  } else {
	    item = last;
	  }
	  return item;
	};
	
	prototype.replace = function(item) {
	  var array = this.nodes,
	      retval = array[0];
	  array[0] = item;
	  _siftup(array, 0, this.cmp);
	  return retval;
	};
	
	prototype.pushpop = function(item) {
	  var array = this.nodes, ref = array[0];
	  if (array.length && this.cmp(ref, item) < 0) {
	    array[0] = item;
	    item = ref;
	    _siftup(array, 0, this.cmp);
	  }
	  return item;
	};
	
	function _siftdown(array, start, idx, cmp) {
	  var item, parent, pidx;
	
	  item = array[idx];
	  while (idx > start) {
	    pidx = (idx - 1) >> 1;
	    parent = array[pidx];
	    if (cmp(item, parent) < 0) {
	      array[idx] = parent;
	      idx = pidx;
	      continue;
	    }
	    break;
	  }
	  return (array[idx] = item);
	}
	
	function _siftup(array, idx, cmp) {
	  var start = idx,
	      end = array.length,
	      item = array[idx],
	      cidx = 2 * idx + 1, ridx;
	
	  while (cidx < end) {
	    ridx = cidx + 1;
	    if (ridx < end && cmp(array[cidx], array[ridx]) >= 0) {
	      cidx = ridx;
	    }
	    array[idx] = array[cidx];
	    idx = cidx;
	    cidx = 2 * idx + 1;
	  }
	  array[idx] = item;
	  return _siftdown(array, start, idx, cmp);
	}
	
	module.exports = Heap;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var ChangeSet = __webpack_require__(11),
	    Node = __webpack_require__(16), // jshint ignore:line
	    Base = Node.prototype;
	
	function Signal(graph, name, initialValue) {
	  Base.init.call(this, graph);
	  this._name  = name;
	  this._value = initialValue;
	  this._verbose = false; // Verbose signals re-pulse the graph even if prev === val.
	  this._handlers = [];
	  return this;
	}
	
	var prototype = (Signal.prototype = Object.create(Base));
	prototype.constructor = Signal;
	
	prototype.name = function() {
	  return this._name;
	};
	
	prototype.value = function(val) {
	  if (!arguments.length) return this._value;
	  return (this._value = val, this);
	};
	
	// Alias to value, for shared API with DataSource
	prototype.values = prototype.value;
	
	prototype.verbose = function(v) {
	  if (!arguments.length) return this._verbose;
	  return (this._verbose = !!v, this);
	};
	
	prototype.evaluate = function(input) {
	  return input.signals[this._name] ? input : this._graph.doNotPropagate;
	};
	
	prototype.fire = function(cs) {
	  if (!cs) cs = ChangeSet.create(null, true);
	  cs.signals[this._name] = 1;
	  this._graph.propagate(cs, this);
	};
	
	prototype.on = function(handler) {
	  var signal = this,
	      node = new Node(this._graph);
	
	  node.evaluate = function(input) {
	    handler(signal.name(), signal.value());
	    return input;
	  };
	
	  this._handlers.push({
	    handler: handler,
	    node: node
	  });
	
	  return this.addListener(node);
	};
	
	prototype.off = function(handler) {
	  var h = this._handlers, i, x;
	
	  for (i=h.length; --i>=0;) {
	    if (!handler || h[i].handler === handler) {
	      x = h.splice(i, 1)[0];
	      this.removeListener(x.node);
	    }
	  }
	
	  return this;
	};
	
	module.exports = Signal;


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  axes:       __webpack_require__(59),
	  background: __webpack_require__(106),
	  data:       __webpack_require__(107),
	  events:     __webpack_require__(141),
	  expr:       __webpack_require__(142),
	  legends:    __webpack_require__(148),
	  mark:       __webpack_require__(61),
	  marks:      __webpack_require__(150),
	  modify:     __webpack_require__(140),
	  padding:    __webpack_require__(151),
	  predicates: __webpack_require__(152),
	  properties: __webpack_require__(62),
	  signals:    __webpack_require__(153),
	  spec:       __webpack_require__(154),
	  streams:    __webpack_require__(164),
	  transforms: __webpack_require__(108)
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    axs = __webpack_require__(60);
	
	var ORIENT = {
	  "x":      "bottom",
	  "y":      "left",
	  "top":    "top",
	  "bottom": "bottom",
	  "left":   "left",
	  "right":  "right"
	};
	
	function parseAxes(model, spec, axes, group) {
	  var config = model.config();
	  (spec || []).forEach(function(def, index) {
	    axes[index] = axes[index] || axs(model);
	    parseAxis(config, def, index, axes[index], group);
	  });
	}
	
	function parseAxis(config, def, index, axis, group) {
	  // axis scale
	  if (def.scale !== undefined) {
	    axis.scale(group.scale(def.scale));
	  }
	
	  // axis orientation
	  axis.orient(def.orient || ORIENT[def.type]);
	  // axis offset
	  axis.offset(def.offset || 0);
	  // axis layer
	  axis.layer(def.layer || "front");
	  // axis grid lines
	  axis.grid(def.grid || false);
	  // axis title
	  axis.title(def.title || null);
	  // axis title offset
	  axis.titleOffset(def.titleOffset != null ?
	    def.titleOffset : config.axis.titleOffset);
	  // axis values
	  axis.tickValues(def.values || null);
	  // axis label formatting
	  axis.tickFormat(def.format || null);
	  axis.tickFormatType(def.formatType || null);
	  // axis tick subdivision
	  axis.tickSubdivide(def.subdivide || 0);
	  // axis tick padding
	  axis.tickPadding(def.tickPadding || config.axis.padding);
	
	  // axis tick size(s)
	  var size = [];
	  if (def.tickSize !== undefined) {
	    for (var i=0; i<3; ++i) size.push(def.tickSize);
	  } else {
	    var ts = config.axis.tickSize;
	    size = [ts, ts, ts];
	  }
	  if (def.tickSizeMajor != null) size[0] = def.tickSizeMajor;
	  if (def.tickSizeMinor != null) size[1] = def.tickSizeMinor;
	  if (def.tickSizeEnd   != null) size[2] = def.tickSizeEnd;
	  if (size.length) {
	    axis.tickSize.apply(axis, size);
	  }
	
	  // axis tick count
	  axis.tickCount(def.ticks || config.axis.ticks);
	
	  // style properties
	  var p = def.properties;
	  if (p && p.ticks) {
	    axis.majorTickProperties(p.majorTicks ?
	      dl.extend({}, p.ticks, p.majorTicks) : p.ticks);
	    axis.minorTickProperties(p.minorTicks ?
	      dl.extend({}, p.ticks, p.minorTicks) : p.ticks);
	  } else {
	    axis.majorTickProperties(p && p.majorTicks || {});
	    axis.minorTickProperties(p && p.minorTicks || {});
	  }
	  axis.tickLabelProperties(p && p.labels || {});
	  axis.titleProperties(p && p.title || {});
	  axis.gridLineProperties(p && p.grid || {});
	  axis.domainProperties(p && p.axis || {});
	}
	
	module.exports = parseAxes;
	
	parseAxes.schema = {
	  "defs": {
	    "axis": {
	      "type": "object",
	      "properties": {
	        "type": {"enum": ["x", "y"]},
	        "scale": {"type": "string"},
	        "orient": {"enum": ["top", "bottom", "left", "right"]},
	        "title": {"type": "string"},
	        "titleOffset": {"type": "number"},
	        "format": {"type": "string"},
	        "formatType": {"enum": ["time", "utc", "string", "number"]},
	        "ticks": {"type": "number"},
	        "values": {
	          "type": "array",
	          "items": {"type": ["string", "number"]}
	        },
	        "subdivide": {"type": "number"},
	        "tickPadding": {"type": "number"},
	        "tickSize": {"type": "number"},
	        "tickSizeMajor": {"type": "number"},
	        "tickSizeMinor": {"type": "number"},
	        "tickSizeEnd": {"type": "number"},
	        "offset": {
	          "oneOf": [{"type": "number"}, {
	            "type": "object",
	            "properties": {
	              "scale": {"type": "string"},
	              "value": {"type": ["string", "number"]}
	            },
	            "required": ["scale", "value"],
	            "additionalProperties": false
	          }]
	        },
	        "layer": {"enum": ["front", "back"], "default": "front"},
	        "grid": {"type": "boolean"},
	        "properties": {
	          "type": "object",
	          "properties": {
	            "ticks": {"$ref": "#/defs/propset"},
	            "majorTicks": {"$ref": "#/defs/propset"},
	            "minorTicks": {"$ref": "#/defs/propset"},
	            "labels": {"$ref": "#/defs/propset"},
	            "title": {"$ref": "#/defs/propset"},
	            "grid": {"$ref": "#/defs/propset"},
	            "axis": {"$ref": "#/defs/propset"}
	          },
	          "additionalProperties": false
	        }
	      },
	      "additionalProperties": false,
	      "required": ["type", "scale"]
	    }
	  }
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    parseMark = __webpack_require__(61),
	    util = __webpack_require__(64);
	
	var axisBounds = new (__webpack_require__(66).Bounds)();
	var ORDINAL = 'ordinal';
	
	function axs(model) {
	  var scale,
	      config = model.config().axis,
	      orient = config.orient,
	      offset = 0,
	      titleOffset = config.titleOffset,
	      axisDef = {},
	      layer = 'front',
	      grid = false,
	      title = null,
	      tickMajorSize = config.tickSize,
	      tickMinorSize = config.tickSize,
	      tickEndSize = config.tickSize,
	      tickPadding = config.padding,
	      tickValues = null,
	      tickFormatString = null,
	      tickFormatType = null,
	      tickSubdivide = 0,
	      tickCount = config.ticks,
	      gridLineStyle = {},
	      tickLabelStyle = {},
	      majorTickStyle = {},
	      minorTickStyle = {},
	      titleStyle = {},
	      domainStyle = {},
	      m = { // Axis marks as references for updates
	        gridLines:  {},
	        majorTicks: {},
	        minorTicks: {},
	        tickLabels: {},
	        domain: {},
	        title:  {}
	      };
	
	  var axis = {};
	
	  function reset() {
	    axisDef.type = null;
	  }
	
	  function ingest(d) {
	    return {data: d};
	  }
	
	  function getTicks(format) {
	    var major = tickValues || (scale.ticks ? scale.ticks(tickCount) : scale.domain()),
	        minor = axisSubdivide(scale, major, tickSubdivide).map(ingest);
	    major = major.map(function(d) { return (d = ingest(d), d.label = format(d.data), d); });
	    return [major, minor];
	  }
	
	  axis.def = function() {
	    if (!axisDef.type) axis_def(scale);
	
	    var format = util.getTickFormat(scale, tickCount, tickFormatType, tickFormatString),
	        ticks  = getTicks(format),
	        tdata  = title ? [title].map(ingest) : [];
	
	    axisDef.marks[0].from = function() { return grid ? ticks[0] : []; };
	    axisDef.marks[1].from = function() { return ticks[0]; };
	    axisDef.marks[2].from = function() { return ticks[1]; };
	    axisDef.marks[3].from = axisDef.marks[1].from;
	    axisDef.marks[4].from = function() { return [1]; };
	    axisDef.marks[5].from = function() { return tdata; };
	    axisDef.offset = offset;
	    axisDef.orient = orient;
	    axisDef.layer = layer;
	    if (titleOffset === 'auto') titleAutoOffset(axisDef);
	
	    return axisDef;
	  };
	
	  function titleAutoOffset(axisDef) {
	    var orient = axisDef.orient,
	        update = axisDef.marks[5].properties.update,
	        fn = update.encode,
	        min = config.titleOffsetAutoMin,
	        max = config.titleOffsetAutoMax,
	        pad = config.titleOffsetAutoMargin;
	
	    // Offset axis title using bounding box of axis domain and labels
	    // Assumes other components are **encoded and bounded** beforehand
	    update.encode = function(item, group, trans, db, signals, preds) {
	      var dirty = fn.call(fn, item, group, trans, db, signals, preds),
	          field = (orient==='bottom' || orient==='top') ? 'y' : 'x';
	      if (titleStyle[field] != null) return dirty;
	
	      axisBounds.clear()
	        .union(group.items[3].bounds)
	        .union(group.items[4].bounds);
	
	      var o = trans ? {} : item,
	          method = (orient==='left' || orient==='right') ? 'width' : 'height',
	          sign = (orient==='top' || orient==='left') ? -1 : 1,
	          off = ~~(axisBounds[method]() + item.fontSize/2 + pad);
	
	      Tuple.set(o, field, sign * Math.min(Math.max(min, off), max));
	      if (trans) trans.interpolate(item, o);
	      return true;
	    };
	  }
	
	  function axis_def(scale) {
	    // setup scale mapping
	    var newScale, oldScale, range;
	    if (scale.type === ORDINAL) {
	      newScale = {scale: scale.scaleName, offset: 0.5 + scale.rangeBand()/2};
	      oldScale = newScale;
	    } else {
	      newScale = {scale: scale.scaleName, offset: 0.5};
	      oldScale = {scale: scale.scaleName+':prev', offset: 0.5};
	    }
	    range = axisScaleRange(scale);
	
	    // setup axis marks
	    dl.extend(m.gridLines, axisTicks(config));
	    dl.extend(m.majorTicks, axisTicks(config));
	    dl.extend(m.minorTicks, axisTicks(config));
	    dl.extend(m.tickLabels, axisTickLabels(config));
	    dl.extend(m.domain, axisDomain(config));
	    dl.extend(m.title, axisTitle(config));
	    m.gridLines.properties.enter.stroke = {value: config.gridColor};
	    m.gridLines.properties.enter.strokeOpacity = {value: config.gridOpacity};
	
	    // extend axis marks based on axis orientation
	    axisTicksExtend(orient, m.gridLines, oldScale, newScale, Infinity, offset);
	    axisTicksExtend(orient, m.majorTicks, oldScale, newScale, tickMajorSize);
	    axisTicksExtend(orient, m.minorTicks, oldScale, newScale, tickMinorSize);
	    axisLabelExtend(orient, m.tickLabels, oldScale, newScale, tickMajorSize, tickPadding);
	
	    axisDomainExtend(orient, m.domain, range, tickEndSize);
	    axisTitleExtend(orient, m.title, range, +titleOffset || -1);
	
	    // add / override custom style properties
	    dl.extend(m.gridLines.properties.update, gridLineStyle);
	    dl.extend(m.majorTicks.properties.update, majorTickStyle);
	    dl.extend(m.minorTicks.properties.update, minorTickStyle);
	    dl.extend(m.tickLabels.properties.update, tickLabelStyle);
	    dl.extend(m.domain.properties.update, domainStyle);
	    dl.extend(m.title.properties.update, titleStyle);
	
	    var marks = [m.gridLines, m.majorTicks, m.minorTicks, m.tickLabels, m.domain, m.title];
	    dl.extend(axisDef, {
	      type: 'group',
	      interactive: false,
	      properties: {
	        enter: {
	          encode: axisUpdate,
	          scales: [scale.scaleName],
	          signals: [], data: []
	        },
	        update: {
	          encode: axisUpdate,
	          scales: [scale.scaleName],
	          signals: [], data: []
	        }
	      }
	    });
	
	    axisDef.marks = marks.map(function(m) { return parseMark(model, m); });
	  }
	
	  axis.scale = function(x) {
	    if (!arguments.length) return scale;
	    if (scale !== x) { scale = x; reset(); }
	    return axis;
	  };
	
	  axis.orient = function(x) {
	    if (!arguments.length) return orient;
	    if (orient !== x) {
	      orient = x in axisOrients ? x + '' : config.orient;
	      reset();
	    }
	    return axis;
	  };
	
	  axis.title = function(x) {
	    if (!arguments.length) return title;
	    if (title !== x) { title = x; reset(); }
	    return axis;
	  };
	
	  axis.tickCount = function(x) {
	    if (!arguments.length) return tickCount;
	    tickCount = x;
	    return axis;
	  };
	
	  axis.tickValues = function(x) {
	    if (!arguments.length) return tickValues;
	    tickValues = x;
	    return axis;
	  };
	
	  axis.tickFormat = function(x) {
	    if (!arguments.length) return tickFormatString;
	    if (tickFormatString !== x) {
	      tickFormatString = x;
	      reset();
	    }
	    return axis;
	  };
	
	  axis.tickFormatType = function(x) {
	    if (!arguments.length) return tickFormatType;
	    if (tickFormatType !== x) {
	      tickFormatType = x;
	      reset();
	    }
	    return axis;
	  };
	
	  axis.tickSize = function(x, y) {
	    if (!arguments.length) return tickMajorSize;
	    var n = arguments.length - 1,
	        major = +x,
	        minor = n > 1 ? +y : tickMajorSize,
	        end   = n > 0 ? +arguments[n] : tickMajorSize;
	
	    if (tickMajorSize !== major ||
	        tickMinorSize !== minor ||
	        tickEndSize !== end) {
	      reset();
	    }
	
	    tickMajorSize = major;
	    tickMinorSize = minor;
	    tickEndSize = end;
	    return axis;
	  };
	
	  axis.tickSubdivide = function(x) {
	    if (!arguments.length) return tickSubdivide;
	    tickSubdivide = +x;
	    return axis;
	  };
	
	  axis.offset = function(x) {
	    if (!arguments.length) return offset;
	    offset = dl.isObject(x) ? x : +x;
	    return axis;
	  };
	
	  axis.tickPadding = function(x) {
	    if (!arguments.length) return tickPadding;
	    if (tickPadding !== +x) { tickPadding = +x; reset(); }
	    return axis;
	  };
	
	  axis.titleOffset = function(x) {
	    if (!arguments.length) return titleOffset;
	    if (titleOffset !== x) { titleOffset = x; reset(); }
	    return axis;
	  };
	
	  axis.layer = function(x) {
	    if (!arguments.length) return layer;
	    if (layer !== x) { layer = x; reset(); }
	    return axis;
	  };
	
	  axis.grid = function(x) {
	    if (!arguments.length) return grid;
	    if (grid !== x) { grid = x; reset(); }
	    return axis;
	  };
	
	  axis.gridLineProperties = function(x) {
	    if (!arguments.length) return gridLineStyle;
	    if (gridLineStyle !== x) { gridLineStyle = x; }
	    return axis;
	  };
	
	  axis.majorTickProperties = function(x) {
	    if (!arguments.length) return majorTickStyle;
	    if (majorTickStyle !== x) { majorTickStyle = x; }
	    return axis;
	  };
	
	  axis.minorTickProperties = function(x) {
	    if (!arguments.length) return minorTickStyle;
	    if (minorTickStyle !== x) { minorTickStyle = x; }
	    return axis;
	  };
	
	  axis.tickLabelProperties = function(x) {
	    if (!arguments.length) return tickLabelStyle;
	    if (tickLabelStyle !== x) { tickLabelStyle = x; }
	    return axis;
	  };
	
	  axis.titleProperties = function(x) {
	    if (!arguments.length) return titleStyle;
	    if (titleStyle !== x) { titleStyle = x; }
	    return axis;
	  };
	
	  axis.domainProperties = function(x) {
	    if (!arguments.length) return domainStyle;
	    if (domainStyle !== x) { domainStyle = x; }
	    return axis;
	  };
	
	  axis.reset = function() {
	    reset();
	    return axis;
	  };
	
	  return axis;
	}
	
	var axisOrients = {top: 1, right: 1, bottom: 1, left: 1};
	
	function axisSubdivide(scale, ticks, m) {
	  var subticks = [];
	  if (m && ticks.length > 1) {
	    var extent = axisScaleExtent(scale.domain()),
	        i = -1,
	        n = ticks.length,
	        d = (ticks[1] - ticks[0]) / ++m,
	        j,
	        v;
	    while (++i < n) {
	      for (j = m; --j > 0;) {
	        if ((v = +ticks[i] - j * d) >= extent[0]) {
	          subticks.push(v);
	        }
	      }
	    }
	    for (--i, j = 0; ++j < m && (v = +ticks[i] + j * d) < extent[1];) {
	      subticks.push(v);
	    }
	  }
	  return subticks;
	}
	
	function axisScaleExtent(domain) {
	  var start = domain[0], stop = domain[domain.length - 1];
	  return start < stop ? [start, stop] : [stop, start];
	}
	
	function axisScaleRange(scale) {
	  return scale.rangeExtent ?
	    scale.rangeExtent() :
	    axisScaleExtent(scale.range());
	}
	
	var axisAlign = {
	  bottom: 'center',
	  top: 'center',
	  left: 'right',
	  right: 'left'
	};
	
	var axisBaseline = {
	  bottom: 'top',
	  top: 'bottom',
	  left: 'middle',
	  right: 'middle'
	};
	
	function axisLabelExtend(orient, labels, oldScale, newScale, size, pad) {
	  size = Math.max(size, 0) + pad;
	  if (orient === 'left' || orient === 'top') {
	    size *= -1;
	  }
	  if (orient === 'top' || orient === 'bottom') {
	    dl.extend(labels.properties.enter, {
	      x: oldScale,
	      y: {value: size},
	    });
	    dl.extend(labels.properties.update, {
	      x: newScale,
	      y: {value: size},
	      align: {value: 'center'},
	      baseline: {value: axisBaseline[orient]}
	    });
	  } else {
	    dl.extend(labels.properties.enter, {
	      x: {value: size},
	      y: oldScale,
	    });
	    dl.extend(labels.properties.update, {
	      x: {value: size},
	      y: newScale,
	      align: {value: axisAlign[orient]},
	      baseline: {value: 'middle'}
	    });
	  }
	}
	
	function axisTicksExtend(orient, ticks, oldScale, newScale, size, offset) {
	  var sign = (orient === 'left' || orient === 'top') ? -1 : 1;
	  if (size === Infinity) {
	    size = (orient === 'top' || orient === 'bottom') ?
	      {field: {group: 'height', level: 2}, mult: -sign, offset: offset*-sign} :
	      {field: {group: 'width',  level: 2}, mult: -sign, offset: offset*-sign};
	  } else {
	    size = {value: sign * size, offset: offset};
	  }
	  if (orient === 'top' || orient === 'bottom') {
	    dl.extend(ticks.properties.enter, {
	      x:  oldScale,
	      y:  {value: 0},
	      y2: size
	    });
	    dl.extend(ticks.properties.update, {
	      x:  newScale,
	      y:  {value: 0},
	      y2: size
	    });
	    dl.extend(ticks.properties.exit, {
	      x:  newScale,
	    });
	  } else {
	    dl.extend(ticks.properties.enter, {
	      x:  {value: 0},
	      x2: size,
	      y:  oldScale
	    });
	    dl.extend(ticks.properties.update, {
	      x:  {value: 0},
	      x2: size,
	      y:  newScale
	    });
	    dl.extend(ticks.properties.exit, {
	      y:  newScale,
	    });
	  }
	}
	
	function axisTitleExtend(orient, title, range, offset) {
	  var update = title.properties.update,
	      mid = ~~((range[0] + range[1]) / 2),
	      sign = (orient === 'top' || orient === 'left') ? -1 : 1;
	
	  if (orient === 'bottom' || orient === 'top') {
	    update.x = {value: mid};
	    update.angle = {value: 0};
	    if (offset >= 0) update.y = {value: sign * offset};
	  } else {
	    update.y = {value: mid};
	    update.angle = {value: orient === 'left' ? -90 : 90};
	    if (offset >= 0) update.x = {value: sign * offset};
	  }
	}
	
	function axisDomainExtend(orient, domain, range, size) {
	  var path;
	  if (orient === 'top' || orient === 'left') {
	    size = -1 * size;
	  }
	  if (orient === 'bottom' || orient === 'top') {
	    path = 'M' + range[0] + ',' + size + 'V0H' + range[1] + 'V' + size;
	  } else {
	    path = 'M' + size + ',' + range[0] + 'H0V' + range[1] + 'H' + size;
	  }
	  domain.properties.update.path = {value: path};
	}
	
	function axisUpdate(item, group, trans) {
	  var o = trans ? {} : item,
	      offset = item.mark.def.offset,
	      orient = item.mark.def.orient,
	      width  = group.width,
	      height = group.height; // TODO fallback to global w,h?
	
	  if (dl.isArray(offset)) {
	    var ofx = offset[0],
	        ofy = offset[1];
	
	    switch (orient) {
	      case 'left':   { Tuple.set(o, 'x', -ofx); Tuple.set(o, 'y', ofy); break; }
	      case 'right':  { Tuple.set(o, 'x', width + ofx); Tuple.set(o, 'y', ofy); break; }
	      case 'bottom': { Tuple.set(o, 'x', ofx); Tuple.set(o, 'y', height + ofy); break; }
	      case 'top':    { Tuple.set(o, 'x', ofx); Tuple.set(o, 'y', -ofy); break; }
	      default:       { Tuple.set(o, 'x', ofx); Tuple.set(o, 'y', ofy); }
	    }
	  } else {
	    if (dl.isObject(offset)) {
	      offset = -group.scale(offset.scale)(offset.value);
	    }
	
	    switch (orient) {
	      case 'left':   { Tuple.set(o, 'x', -offset); Tuple.set(o, 'y', 0); break; }
	      case 'right':  { Tuple.set(o, 'x', width + offset); Tuple.set(o, 'y', 0); break; }
	      case 'bottom': { Tuple.set(o, 'x', 0); Tuple.set(o, 'y', height + offset); break; }
	      case 'top':    { Tuple.set(o, 'x', 0); Tuple.set(o, 'y', -offset); break; }
	      default:       { Tuple.set(o, 'x', 0); Tuple.set(o, 'y', 0); }
	    }
	  }
	
	  if (trans) trans.interpolate(item, o);
	  return true;
	}
	
	function axisTicks(config) {
	  return {
	    type: 'rule',
	    interactive: false,
	    key: 'data',
	    properties: {
	      enter: {
	        stroke: {value: config.tickColor},
	        strokeWidth: {value: config.tickWidth},
	        opacity: {value: 1e-6}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: { opacity: {value: 1} }
	    }
	  };
	}
	
	function axisTickLabels(config) {
	  return {
	    type: 'text',
	    interactive: true,
	    key: 'data',
	    properties: {
	      enter: {
	        fill: {value: config.tickLabelColor},
	        font: {value: config.tickLabelFont},
	        fontSize: {value: config.tickLabelFontSize},
	        opacity: {value: 1e-6},
	        text: {field: 'label'}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: { opacity: {value: 1} }
	    }
	  };
	}
	
	function axisTitle(config) {
	  return {
	    type: 'text',
	    interactive: true,
	    properties: {
	      enter: {
	        font: {value: config.titleFont},
	        fontSize: {value: config.titleFontSize},
	        fontWeight: {value: config.titleFontWeight},
	        fill: {value: config.titleColor},
	        align: {value: 'center'},
	        baseline: {value: 'middle'},
	        text: {field: 'data'}
	      },
	      update: {}
	    }
	  };
	}
	
	function axisDomain(config) {
	  return {
	    type: 'path',
	    interactive: false,
	    properties: {
	      enter: {
	        x: {value: 0.5},
	        y: {value: 0.5},
	        stroke: {value: config.axisColor},
	        strokeWidth: {value: config.axisWidth}
	      },
	      update: {}
	    }
	  };
	}
	
	module.exports = axs;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    parseProperties = __webpack_require__(62);
	
	function parseMark(model, mark) {
	  var props = mark.properties,
	      group = mark.marks;
	
	  // parse mark property definitions
	  dl.keys(props).forEach(function(k) {
	    props[k] = parseProperties(model, mark.type, props[k]);
	  });
	
	  // parse delay function
	  if (mark.delay) {
	    mark.delay = parseProperties(model, mark.type, {delay: mark.delay});
	  }
	
	  // recurse if group type
	  if (group) {
	    mark.marks = group.map(function(g) { return parseMark(model, g); });
	  }
	
	  return mark;
	}
	
	module.exports = parseMark;
	
	parseMark.schema = {
	  "defs": {
	    "mark": {
	      "type": "object",
	
	      "properties": {
	        "name": {"type": "string"},
	        "key": {"type": "string"},
	        "type": {"enum": ["rect", "symbol", "path", "arc",
	          "area", "line", "rule", "image", "text", "group"]},
	
	        "from": {
	          "type": "object",
	          "properties": {
	            "data": {"type": "string"},
	            "mark": {"type": "string"},
	            "transform": {"$ref": "#/defs/transform"}
	          },
	          "additionalProperties": false
	        },
	
	        "delay": {"$ref": "#/refs/numberValue"},
	        "ease": {
	          "enum": ["linear", "quad", "cubic", "sin",
	            "exp", "circle", "bounce"].reduce(function(acc, e) {
	              ["in", "out", "in-out", "out-in"].forEach(function(m) {
	                acc.push(e+"-"+m);
	              });
	              return acc;
	          }, [])
	        },
	
	        "interactive": {"type": "boolean"},
	
	        "properties": {
	          "type": "object",
	          "properties": {
	            "enter":  {"$ref": "#/defs/propset"},
	            "update": {"$ref": "#/defs/propset"},
	            "exit":   {"$ref": "#/defs/propset"},
	            "hover":  {"$ref": "#/defs/propset"}
	          },
	          "additionalProperties": false,
	          "anyOf": [{"required": ["enter"]}, {"required": ["update"]}]
	        }
	      },
	
	      // "additionalProperties": false,
	      "required": ["type"]
	    }
	  }
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    Tuple = __webpack_require__(10).Tuple;
	
	var DEPS = ["signals", "scales", "data", "fields"];
	
	function properties(model, mark, spec) {
	  var config = model.config(),
	      code = "",
	      names = dl.keys(spec),
	      exprs = [], // parsed expressions injected in the generated code
	      i, len, name, ref, vars = {},
	      deps = {
	        signals: {},
	        scales:  {},
	        data:    {},
	        fields:  {},
	        nested:  [],
	        _nRefs:  {},  // Temp stash to de-dupe nested refs.
	        reflow:  false
	      };
	
	  code += "var o = trans ? {} : item, d=0, exprs=this.exprs, set=this.tpl.set, tmpl=signals||{}, t;\n" +
	          // Stash for dl.template
	          "tmpl.datum  = item.datum;\n" +
	          "tmpl.group  = group;\n" +
	          "tmpl.parent = group.datum;\n";
	
	  function handleDep(p) {
	    if (ref[p] == null) return;
	    var k = dl.array(ref[p]), i, n;
	    for (i=0, n=k.length; i<n; ++i) {
	      deps[p][k[i]] = 1;
	    }
	  }
	
	  function handleNestedRefs(r) {
	    var k = (r.parent ? "parent_" : "group_")+r.level;
	    deps._nRefs[k] = r;
	  }
	
	  for (i=0, len=names.length; i<len; ++i) {
	    ref = spec[name = names[i]];
	    code += (i > 0) ? "\n  " : "  ";
	    if (ref.rule) {
	      // a production rule valueref
	      ref = rule(model, name, ref.rule, exprs);
	      code += "\n  " + ref.code;
	    } else if (dl.isArray(ref)) {
	      // a production rule valueref as an array
	      ref = rule(model, name, ref, exprs);
	      code += "\n  " + ref.code;
	    } else {
	      // a simple valueref
	      ref = valueRef(config, name, ref);
	      code += "d += set(o, "+dl.str(name)+", "+ref.val+");";
	    }
	
	    vars[name] = true;
	    DEPS.forEach(handleDep);
	    deps.reflow = deps.reflow || ref.reflow;
	    if (ref.nested.length) ref.nested.forEach(handleNestedRefs);
	  }
	
	  // If nested references are present, sort them based on their level
	  // to speed up determination of whether encoders should be reeval'd.
	  dl.keys(deps._nRefs).forEach(function(k) { deps.nested.push(deps._nRefs[k]); });
	  deps.nested.sort(function(a, b) {
	    a = a.level;
	    b = b.level;
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  });
	
	  if (vars.x2) {
	    if (vars.x) {
	      code += "\n  if (o.x > o.x2) { " +
	              "\n    t = o.x;" +
	              "\n    d += set(o, 'x', o.x2);" +
	              "\n    d += set(o, 'x2', t); " +
	              "\n  };";
	      code += "\n  d += set(o, 'width', (o.x2 - o.x));";
	    } else if (vars.width) {
	      code += "\n  d += set(o, 'x', (o.x2 - o.width));";
	    } else {
	      code += "\n  d += set(o, 'x', o.x2);";
	    }
	  }
	
	  if (vars.xc) {
	    if (vars.width) {
	      code += "\n  d += set(o, 'x', (o.xc - o.width/2));" ;
	    } else {
	      code += "\n  d += set(o, 'x', o.xc);" ;
	    }
	  }
	
	  if (vars.y2) {
	    if (vars.y) {
	      code += "\n  if (o.y > o.y2) { " +
	              "\n    t = o.y;" +
	              "\n    d += set(o, 'y', o.y2);" +
	              "\n    d += set(o, 'y2', t);" +
	              "\n  };";
	      code += "\n  d += set(o, 'height', (o.y2 - o.y));";
	    } else if (vars.height) {
	      code += "\n  d += set(o, 'y', (o.y2 - o.height));";
	    } else {
	      code += "\n  d += set(o, 'y', o.y2);";
	    }
	  }
	
	  if (vars.yc) {
	    if (vars.height) {
	      code += "\n  d += set(o, 'y', (o.yc - o.height/2));" ;
	    } else {
	      code += "\n  d += set(o, 'y', o.yc);" ;
	    }
	  }
	
	  if (hasPath(mark, vars)) code += "\n  d += (item.touch(), 1);";
	  code += "\n  if (trans) trans.interpolate(item, o);";
	  code += "\n  return d > 0;";
	
	  try {
	    /* jshint evil:true */
	    var encoder = Function('item', 'group', 'trans', 'db',
	      'signals', 'predicates', code);
	
	    encoder.tpl  = Tuple;
	    encoder.exprs = exprs;
	    encoder.util = dl;
	    encoder.d3   = d3; // For color spaces
	    dl.extend(encoder, dl.template.context);
	    return {
	      encode:  encoder,
	      signals: dl.keys(deps.signals),
	      scales:  dl.keys(deps.scales),
	      data:    dl.keys(deps.data),
	      fields:  dl.keys(deps.fields),
	      nested:  deps.nested,
	      reflow:  deps.reflow
	    };
	  } catch (e) {
	    log.error(e);
	    log.log(code);
	  }
	}
	
	function dependencies(a, b) {
	  if (!dl.isObject(a)) {
	    a = {reflow: false, nested: []};
	    DEPS.forEach(function(d) { a[d] = []; });
	  }
	
	  if (dl.isObject(b)) {
	    a.reflow = a.reflow || b.reflow;
	    a.nested.push.apply(a.nested, b.nested);
	    DEPS.forEach(function(d) { a[d].push.apply(a[d], b[d]); });
	  }
	
	  return a;
	}
	
	function hasPath(mark, vars) {
	  return vars.path ||
	    ((mark==='area' || mark==='line') &&
	      (vars.x || vars.x2 || vars.width ||
	       vars.y || vars.y2 || vars.height ||
	       vars.tension || vars.interpolate));
	}
	
	function rule(model, name, rules, exprs) {
	  var config  = model.config(),
	      deps = dependencies(),
	      inputs  = [],
	      code = '';
	
	  (rules||[]).forEach(function(r, i) {
	    var ref = valueRef(config, name, r);
	    dependencies(deps, ref);
	
	    if (r.test) {
	      // rule uses an expression instead of a predicate.
	      var exprFn = model.expr(r.test);
	      deps.signals.push.apply(deps.signals, exprFn.globals);
	      deps.data.push.apply(deps.data, exprFn.dataSources);
	
	      code += "if (exprs[" + exprs.length + "](item.datum, null)) {" +
	          "\n    d += set(o, "+dl.str(name)+", " +ref.val+");";
	      code += rules[i+1] ? "\n  } else " : "  }";
	
	      exprs.push(exprFn.fn);
	    } else {
	      var def = r.predicate,
	          predName = def && (def.name || def),
	          pred = model.predicate(predName),
	          p = 'predicates['+dl.str(predName)+']',
	          input = [], args = name+'_arg'+i;
	
	      if (dl.isObject(def)) {
	        dl.keys(def).forEach(function(k) {
	          if (k === 'name') return;
	          var ref = valueRef(config, i, def[k], true);
	          input.push(dl.str(k)+': '+ref.val);
	          dependencies(deps, ref);
	        });
	      }
	
	      if (predName) {
	        // append the predicates dependencies to our dependencies
	        deps.signals.push.apply(deps.signals, pred.signals);
	        deps.data.push.apply(deps.data, pred.data);
	        inputs.push(args+" = {\n    "+input.join(",\n    ")+"\n  }");
	        code += "if ("+p+".call("+p+","+args+", db, signals, predicates)) {" +
	          "\n    d += set(o, "+dl.str(name)+", "+ref.val+");";
	        code += rules[i+1] ? "\n  } else " : "  }";
	      } else {
	        code += "{" +
	          "\n    d += set(o, "+dl.str(name)+", "+ref.val+");"+
	          "\n  }\n";
	      }
	    }
	  });
	
	  if (inputs.length) code = "var " + inputs.join(",\n      ") + ";\n  " + code;
	  return (deps.code = code, deps);
	}
	
	function valueRef(config, name, ref, predicateArg) {
	  if (ref == null) return null;
	
	  if (name==='fill' || name==='stroke') {
	    if (ref.c) {
	      return colorRef(config, 'hcl', ref.h, ref.c, ref.l);
	    } else if (ref.h || ref.s) {
	      return colorRef(config, 'hsl', ref.h, ref.s, ref.l);
	    } else if (ref.l || ref.a) {
	      return colorRef(config, 'lab', ref.l, ref.a, ref.b);
	    } else if (ref.r || ref.g || ref.b) {
	      return colorRef(config, 'rgb', ref.r, ref.g, ref.b);
	    }
	  }
	
	  // initialize value
	  var val = null, scale = null,
	      deps = dependencies(),
	      sgRef = null, fRef = null, sRef = null, tmpl = {};
	
	  if (ref.template !== undefined) {
	    val = dl.template.source(ref.template, 'tmpl', tmpl);
	    dl.keys(tmpl).forEach(function(k) {
	      var f = dl.field(k),
	          a = f.shift();
	      if (a === 'parent' || a === 'group') {
	        deps.nested.push({
	          parent: a === 'parent',
	          group:  a === 'group',
	          level:  1
	        });
	      } else if (a === 'datum') {
	        deps.fields.push(f[0]);
	      } else {
	        deps.signals.push(a);
	      }
	    });
	  }
	
	  if (ref.value !== undefined) {
	    val = dl.str(ref.value);
	  }
	
	  if (ref.signal !== undefined) {
	    sgRef = dl.field(ref.signal);
	    val = 'signals['+sgRef.map(dl.str).join('][')+']';
	    deps.signals.push(sgRef.shift());
	  }
	
	  if (ref.field !== undefined) {
	    ref.field = dl.isString(ref.field) ? {datum: ref.field} : ref.field;
	    fRef = fieldRef(ref.field);
	    val  = fRef.val;
	    dependencies(deps, fRef);
	  }
	
	  if (ref.scale !== undefined) {
	    sRef  = scaleRef(ref.scale);
	    scale = sRef.val;
	    dependencies(deps, sRef);
	    deps.scales.push(ref.scale.name || ref.scale);
	
	    // run through scale function if val specified.
	    // if no val, scale function is predicate arg.
	    if (val !== null || ref.band || ref.mult || ref.offset || !predicateArg) {
	      val = scale + (ref.band ? '.rangeBand()' :
	        '('+(val !== null ? val : 'item.datum.data')+')');
	    } else if (predicateArg) {
	      val = scale;
	    }
	  }
	
	  // multiply, offset, return value
	  val = '(' + (ref.mult?(dl.number(ref.mult)+' * '):'') + val + ')' +
	        (ref.offset ? ' + ' + dl.number(ref.offset) : '');
	
	  // Collate dependencies
	  return (deps.val = val, deps);
	}
	
	function colorRef(config, type, x, y, z) {
	  var xx = x ? valueRef(config, '', x) : config.color[type][0],
	      yy = y ? valueRef(config, '', y) : config.color[type][1],
	      zz = z ? valueRef(config, '', z) : config.color[type][2],
	      deps = dependencies();
	
	  [xx, yy, zz].forEach(function(v) {
	    if (dl.isArray) return;
	    dependencies(deps, v);
	  });
	
	  var val = '(this.d3.' + type + '(' + [xx.val, yy.val, zz.val].join(',') + ') + "")';
	  return (deps.val = val, deps);
	}
	
	// {field: {datum: "foo"} }  -> item.datum.foo
	// {field: {group: "foo"} }  -> group.foo
	// {field: {parent: "foo"} } -> group.datum.foo
	function fieldRef(ref) {
	  if (dl.isString(ref)) {
	    return {val: dl.field(ref).map(dl.str).join('][')};
	  }
	
	  // Resolve nesting/parent lookups
	  var l = ref.level || 1,
	      nested = (ref.group || ref.parent) && l,
	      scope = nested ? Array(l).join('group.mark.') : '',
	      r = fieldRef(ref.datum || ref.group || ref.parent || ref.signal),
	      val = r.val,
	      deps = dependencies(null, r);
	
	  if (ref.datum) {
	    val = 'item.datum['+val+']';
	    deps.fields.push(ref.datum);
	  } else if (ref.group) {
	    val = scope+'group['+val+']';
	    deps.nested.push({ level: l, group: true });
	  } else if (ref.parent) {
	    val = scope+'group.datum['+val+']';
	    deps.nested.push({ level: l, parent: true });
	  } else if (ref.signal) {
	    val = 'signals['+val+']';
	    deps.signals.push(dl.field(ref.signal)[0]);
	    deps.reflow = true;
	  }
	
	  return (deps.val = val, deps);
	}
	
	// {scale: "x"}
	// {scale: {name: "x"}},
	// {scale: fieldRef}
	function scaleRef(ref) {
	  var scale = null,
	      fr = null,
	      deps = dependencies();
	
	  if (dl.isString(ref)) {
	    scale = dl.str(ref);
	  } else if (ref.name) {
	    scale = dl.isString(ref.name) ? dl.str(ref.name) : (fr = fieldRef(ref.name)).val;
	  } else {
	    scale = (fr = fieldRef(ref)).val;
	  }
	
	  scale = '(item.mark._scaleRefs['+scale+'] = 1, group.scale('+scale+'))';
	  if (ref.invert) scale += '.invert';
	
	  // Mark scale refs as they're dealt with separately in mark._scaleRefs.
	  if (fr) fr.nested.forEach(function(g) { g.scale = true; });
	  return fr ? (fr.val = scale, fr) : (deps.val = scale, deps);
	}
	
	module.exports = properties;
	
	function valueSchema(type) {
	  type = dl.isArray(type) ? {"enum": type} : {"type": type};
	  var modType = type.type === "number" && type.type || "string";
	  var valRef  = {
	    "type": "object",
	    "allOf": [{"$ref": "#/refs/" + modType + "Modifiers"}, {
	      "oneOf": [{
	        "$ref": "#/refs/signal",
	        "required": ["signal"]
	      }, {
	        "properties": {"value": type},
	        "required": ["value"]
	      }, {
	        "properties": {"field": {"$ref": "#/refs/field"}},
	        "required": ["field"]
	      }, {
	        "properties": {"band": {"type": "boolean"}},
	        "required": ["band"]
	      }]
	    }]
	  };
	
	  if (type.type === "string") {
	    valRef.allOf[1].oneOf.push({
	      "properties": {"template": {"type": "string"}},
	      "required": ["template"]
	    });
	  }
	
	  return {
	    "oneOf": [{
	      "type": "object",
	      "properties": {
	        "rule": {
	          "type": "array",
	          "items": {
	            "allOf": [{"$ref": "#/defs/rule"}, valRef]
	          }
	        }
	      },
	      "additionalProperties": false,
	      "required": ["rule"]
	    },
	    {
	      "type": "array",
	      "items": {
	        "allOf": [{"$ref": "#/defs/rule"}, valRef]
	      }
	    },
	    valRef]
	  };
	}
	
	properties.schema = {
	  "refs": {
	    "field": {
	      "title": "FieldRef",
	      "oneOf": [
	        {"type": "string"},
	        {
	          "oneOf": [
	            {"$ref": "#/refs/signal"},
	            {
	              "type": "object",
	              "properties": {"datum": {"$ref": "#/refs/field"}},
	              "required": ["datum"],
	              "additionalProperties": false
	            },
	            {
	              "type": "object",
	              "properties": {
	                "group": {"$ref": "#/refs/field"},
	                "level": {"type": "number"}
	              },
	              "required": ["group"],
	              "additionalProperties": false
	            },
	            {
	              "type": "object",
	              "properties": {
	                "parent": {"$ref": "#/refs/field"},
	                "level": {"type": "number"}
	              },
	              "required": ["parent"],
	              "additionalProperties": false
	            }
	          ]
	        }
	      ]
	    },
	
	    "scale": {
	      "title": "ScaleRef",
	      "oneOf": [
	        {"$ref": "#/refs/field"},
	        {
	          "type": "object",
	          "properties": {
	            "name": {"$ref": "#/refs/field"},
	            "invert": {"type": "boolean", "default": false}
	          },
	          "required": ["name"]
	        }
	      ]
	    },
	
	    "stringModifiers": {
	      "properties": {
	        "scale": {"$ref": "#/refs/scale"}
	      }
	    },
	
	    "numberModifiers": {
	      "properties": {
	        "mult": {"type": "number"},
	        "offset": {"type": "number"},
	        "scale": {"$ref": "#/refs/scale"}
	      }
	    },
	
	    "value": valueSchema({}, "value"),
	    "numberValue": valueSchema("number", "numberValue"),
	    "stringValue": valueSchema("string", "stringValue"),
	    "booleanValue": valueSchema("boolean", "booleanValue"),
	    "arrayValue": valueSchema("array", "arrayValue"),
	
	    "colorValue": {
	      "title": "ColorRef",
	      "oneOf": [{"$ref": "#/refs/stringValue"}, {
	        "type": "object",
	        "properties": {
	          "r": {"$ref": "#/refs/numberValue"},
	          "g": {"$ref": "#/refs/numberValue"},
	          "b": {"$ref": "#/refs/numberValue"}
	        },
	        "required": ["r", "g", "b"]
	      }, {
	        "type": "object",
	        "properties": {
	          "h": {"$ref": "#/refs/numberValue"},
	          "s": {"$ref": "#/refs/numberValue"},
	          "l": {"$ref": "#/refs/numberValue"}
	        },
	        "required": ["h", "s", "l"]
	      }, {
	        "type": "object",
	        "properties": {
	          "l": {"$ref": "#/refs/numberValue"},
	          "a": {"$ref": "#/refs/numberValue"},
	          "b": {"$ref": "#/refs/numberValue"}
	        },
	        "required": ["l", "a", "b"]
	      }, {
	        "type": "object",
	        "properties": {
	          "h": {"$ref": "#/refs/numberValue"},
	          "c": {"$ref": "#/refs/numberValue"},
	          "l": {"$ref": "#/refs/numberValue"}
	        },
	        "required": ["h", "c", "l"]
	      }]
	    }
	  },
	
	  "defs": {
	    "rule": {
	      "anyOf": [
	        {
	          "type": "object",
	          "properties": {
	            "predicate": {
	              "oneOf": [
	                {"type": "string"},
	                {
	                  "type": "object",
	                  "properties": {"name": { "type": "string" }},
	                  "required": ["name"]
	                }
	              ]
	            }
	          }
	        },
	        {
	          "type": "object",
	          "properties": {"test": {"type": "string"}}
	        }
	      ]
	    },
	    "propset": {
	      "title": "Mark property set",
	      "type": "object",
	      "properties": {
	        // Common Properties
	        "x": {"$ref": "#/refs/numberValue"},
	        "x2": {"$ref": "#/refs/numberValue"},
	        "xc": {"$ref": "#/refs/numberValue"},
	        "width": {"$ref": "#/refs/numberValue"},
	        "y": {"$ref": "#/refs/numberValue"},
	        "y2": {"$ref": "#/refs/numberValue"},
	        "yc": {"$ref": "#/refs/numberValue"},
	        "height": {"$ref": "#/refs/numberValue"},
	        "opacity": {"$ref": "#/refs/numberValue"},
	        "fill": {"$ref": "#/refs/colorValue"},
	        "fillOpacity": {"$ref": "#/refs/numberValue"},
	        "stroke": {"$ref": "#/refs/colorValue"},
	        "strokeWidth": {"$ref": "#/refs/numberValue"},
	        "strokeOpacity": {"$ref": "#/refs/numberValue"},
	        "strokeDash": {"$ref": "#/refs/arrayValue"},
	        "strokeDashOffset": {"$ref": "#/refs/numberValue"},
	        "cursor": {"$ref": "#/refs/stringValue"},
	
	        // Group-mark properties
	        "clip": {"$ref": "#/refs/booleanValue"},
	
	        // Symbol-mark properties
	        "size": {"$ref": "#/refs/numberValue"},
	        "shape": valueSchema(["circle", "square",
	          "cross", "diamond", "triangle-up", "triangle-down"]),
	
	        // Path-mark properties
	        "path": {"$ref": "#/refs/stringValue"},
	
	        // Arc-mark properties
	        "innerRadius": {"$ref": "#/refs/numberValue"},
	        "outerRadius": {"$ref": "#/refs/numberValue"},
	        "startAngle": {"$ref": "#/refs/numberValue"},
	        "endAngle": {"$ref": "#/refs/numberValue"},
	
	        // Area- and line-mark properties
	        "interpolate": valueSchema(["linear", "step-before", "step-after",
	          "basis", "basis-open", "cardinal", "cardinal-open", "monotone"]),
	        "tension": {"$ref": "#/refs/numberValue"},
	
	        // Image-mark properties
	        "url": {"$ref": "#/refs/stringValue"},
	        "align": valueSchema(["left", "right", "center"]),
	        "baseline": valueSchema(["top", "middle", "bottom", "alphabetic"]),
	
	        // Text-mark properties
	        "text": {"$ref": "#/refs/stringValue"},
	        "dx": {"$ref": "#/refs/numberValue"},
	        "dy": {"$ref": "#/refs/numberValue"},
	        "radius":{"$ref": "#/refs/numberValue"},
	        "theta": {"$ref": "#/refs/numberValue"},
	        "angle": {"$ref": "#/refs/numberValue"},
	        "font": {"$ref": "#/refs/stringValue"},
	        "fontSize": {"$ref": "#/refs/numberValue"},
	        "fontWeight": {"$ref": "#/refs/stringValue"},
	        "fontStyle": {"$ref": "#/refs/stringValue"}
	      },
	
	      "additionalProperties": false
	    }
	  }
	};


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;!function(){function n(n){return n&&(n.ownerDocument||n.document||n).documentElement}function t(n){return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)}function e(n,t){return t>n?-1:n>t?1:n>=t?0:NaN}function r(n){return null===n?NaN:+n}function u(n){return!isNaN(n)}function i(n){return{left:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n(t[i],e)<0?r=i+1:u=i}return r},right:function(t,e,r,u){for(arguments.length<3&&(r=0),arguments.length<4&&(u=t.length);u>r;){var i=r+u>>>1;n(t[i],e)>0?u=i:r=i+1}return r}}}function a(n){return n.length}function o(n){for(var t=1;n*t%1;)t*=10;return t}function l(n,t){for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}function c(){this._=Object.create(null)}function s(n){return(n+="")===xa||n[0]===ba?ba+n:n}function f(n){return(n+="")[0]===ba?n.slice(1):n}function h(n){return s(n)in this._}function g(n){return(n=s(n))in this._&&delete this._[n]}function p(){var n=[];for(var t in this._)n.push(f(t));return n}function v(){var n=0;for(var t in this._)++n;return n}function d(){for(var n in this._)return!1;return!0}function m(){this._=Object.create(null)}function y(n){return n}function M(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function x(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e=0,r=_a.length;r>e;++e){var u=_a[e]+t;if(u in n)return u}}function b(){}function _(){}function w(n){function t(){for(var t,r=e,u=-1,i=r.length;++u<i;)(t=r[u].on)&&t.apply(this,arguments);return n}var e=[],r=new c;return t.on=function(t,u){var i,a=r.get(t);return arguments.length<2?a&&a.on:(a&&(a.on=null,e=e.slice(0,i=e.indexOf(a)).concat(e.slice(i+1)),r.remove(t)),u&&e.push(r.set(t,{on:u})),n)},t}function S(){oa.event.preventDefault()}function k(){for(var n,t=oa.event;n=t.sourceEvent;)t=n;return t}function N(n){for(var t=new _,e=0,r=arguments.length;++e<r;)t[arguments[e]]=w(t);return t.of=function(e,r){return function(u){try{var i=u.sourceEvent=oa.event;u.target=n,oa.event=u,t[u.type].apply(e,r)}finally{oa.event=i}}},t}function E(n){return Sa(n,Aa),n}function A(n){return"function"==typeof n?n:function(){return ka(n,this)}}function C(n){return"function"==typeof n?n:function(){return Na(n,this)}}function z(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function u(){this.setAttribute(n,t)}function i(){this.setAttributeNS(n.space,n.local,t)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=oa.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?o:a:n.local?i:u}function L(n){return n.trim().replace(/\s+/g," ")}function q(n){return new RegExp("(?:^|\\s+)"+oa.requote(n)+"(?:\\s+|$)","g")}function T(n){return(n+"").trim().split(/^|\s+/)}function R(n,t){function e(){for(var e=-1;++e<u;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<u;)n[e](this,r)}n=T(n).map(D);var u=n.length;return"function"==typeof t?r:e}function D(n){var t=q(n);return function(e,r){if(u=e.classList)return r?u.add(n):u.remove(n);var u=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(u)||e.setAttribute("class",L(u+" "+n))):e.setAttribute("class",L(u.replace(t," ")))}}function P(n,t,e){function r(){this.style.removeProperty(n)}function u(){this.style.setProperty(n,t,e)}function i(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?i:u}function U(n,t){function e(){delete this[n]}function r(){this[n]=t}function u(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?u:r}function j(n){function t(){var t=this.ownerDocument,e=this.namespaceURI;return e===Ca&&t.documentElement.namespaceURI===Ca?t.createElement(n):t.createElementNS(e,n)}function e(){return this.ownerDocument.createElementNS(n.space,n.local)}return"function"==typeof n?n:(n=oa.ns.qualify(n)).local?e:t}function F(){var n=this.parentNode;n&&n.removeChild(this)}function H(n){return{__data__:n}}function O(n){return function(){return Ea(this,n)}}function I(n){return arguments.length||(n=e),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function Y(n,t){for(var e=0,r=n.length;r>e;e++)for(var u,i=n[e],a=0,o=i.length;o>a;a++)(u=i[a])&&t(u,a,e);return n}function Z(n){return Sa(n,La),n}function V(n){var t,e;return function(r,u,i){var a,o=n[i].update,l=o.length;for(i!=e&&(e=i,t=0),u>=t&&(t=u+1);!(a=o[t])&&++t<l;);return a}}function X(n,t,e){function r(){var t=this[a];t&&(this.removeEventListener(n,t,t.$),delete this[a])}function u(){var u=l(t,ca(arguments));r.call(this),this.addEventListener(n,this[a]=u,u.$=e),u._=t}function i(){var t,e=new RegExp("^__on([^.]+)"+oa.requote(n)+"$");for(var r in this)if(t=r.match(e)){var u=this[r];this.removeEventListener(t[1],u,u.$),delete this[r]}}var a="__on"+n,o=n.indexOf("."),l=$;o>0&&(n=n.slice(0,o));var c=qa.get(n);return c&&(n=c,l=B),o?t?u:r:t?b:i}function $(n,t){return function(e){var r=oa.event;oa.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{oa.event=r}}}function B(n,t){var e=$(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function W(e){var r=".dragsuppress-"+ ++Ra,u="click"+r,i=oa.select(t(e)).on("touchmove"+r,S).on("dragstart"+r,S).on("selectstart"+r,S);if(null==Ta&&(Ta="onselectstart"in e?!1:x(e.style,"userSelect")),Ta){var a=n(e).style,o=a[Ta];a[Ta]="none"}return function(n){if(i.on(r,null),Ta&&(a[Ta]=o),n){var t=function(){i.on(u,null)};i.on(u,function(){S(),t()},!0),setTimeout(t,0)}}}function J(n,e){e.changedTouches&&(e=e.changedTouches[0]);var r=n.ownerSVGElement||n;if(r.createSVGPoint){var u=r.createSVGPoint();if(0>Da){var i=t(n);if(i.scrollX||i.scrollY){r=oa.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var a=r[0][0].getScreenCTM();Da=!(a.f||a.e),r.remove()}}return Da?(u.x=e.pageX,u.y=e.pageY):(u.x=e.clientX,u.y=e.clientY),u=u.matrixTransform(n.getScreenCTM().inverse()),[u.x,u.y]}var o=n.getBoundingClientRect();return[e.clientX-o.left-n.clientLeft,e.clientY-o.top-n.clientTop]}function G(){return oa.event.changedTouches[0].identifier}function K(n){return n>0?1:0>n?-1:0}function Q(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function nn(n){return n>1?0:-1>n?ja:Math.acos(n)}function tn(n){return n>1?Oa:-1>n?-Oa:Math.asin(n)}function en(n){return((n=Math.exp(n))-1/n)/2}function rn(n){return((n=Math.exp(n))+1/n)/2}function un(n){return((n=Math.exp(2*n))-1)/(n+1)}function an(n){return(n=Math.sin(n/2))*n}function on(){}function ln(n,t,e){return this instanceof ln?(this.h=+n,this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof ln?new ln(n.h,n.s,n.l):_n(""+n,wn,ln):new ln(n,t,e)}function cn(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?i+(a-i)*n/60:180>n?a:240>n?i+(a-i)*(240-n)/60:i}function u(n){return Math.round(255*r(n))}var i,a;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,a=.5>=e?e*(1+t):e+t-e*t,i=2*e-a,new yn(u(n+120),u(n),u(n-120))}function sn(n,t,e){return this instanceof sn?(this.h=+n,this.c=+t,void(this.l=+e)):arguments.length<2?n instanceof sn?new sn(n.h,n.c,n.l):n instanceof hn?pn(n.l,n.a,n.b):pn((n=Sn((n=oa.rgb(n)).r,n.g,n.b)).l,n.a,n.b):new sn(n,t,e)}function fn(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new hn(e,Math.cos(n*=Ia)*t,Math.sin(n)*t)}function hn(n,t,e){return this instanceof hn?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof hn?new hn(n.l,n.a,n.b):n instanceof sn?fn(n.h,n.c,n.l):Sn((n=yn(n)).r,n.g,n.b):new hn(n,t,e)}function gn(n,t,e){var r=(n+16)/116,u=r+t/500,i=r-e/200;return u=vn(u)*Qa,r=vn(r)*no,i=vn(i)*to,new yn(mn(3.2404542*u-1.5371385*r-.4985314*i),mn(-.969266*u+1.8760108*r+.041556*i),mn(.0556434*u-.2040259*r+1.0572252*i))}function pn(n,t,e){return n>0?new sn(Math.atan2(e,t)*Ya,Math.sqrt(t*t+e*e),n):new sn(NaN,NaN,n)}function vn(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function dn(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function mn(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function yn(n,t,e){return this instanceof yn?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof yn?new yn(n.r,n.g,n.b):_n(""+n,yn,cn):new yn(n,t,e)}function Mn(n){return new yn(n>>16,n>>8&255,255&n)}function xn(n){return Mn(n)+""}function bn(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function _n(n,t,e){var r,u,i,a=0,o=0,l=0;if(r=/([a-z]+)\((.*)\)/.exec(n=n.toLowerCase()))switch(u=r[2].split(","),r[1]){case"hsl":return e(parseFloat(u[0]),parseFloat(u[1])/100,parseFloat(u[2])/100);case"rgb":return t(Nn(u[0]),Nn(u[1]),Nn(u[2]))}return(i=uo.get(n))?t(i.r,i.g,i.b):(null==n||"#"!==n.charAt(0)||isNaN(i=parseInt(n.slice(1),16))||(4===n.length?(a=(3840&i)>>4,a=a>>4|a,o=240&i,o=o>>4|o,l=15&i,l=l<<4|l):7===n.length&&(a=(16711680&i)>>16,o=(65280&i)>>8,l=255&i)),t(a,o,l))}function wn(n,t,e){var r,u,i=Math.min(n/=255,t/=255,e/=255),a=Math.max(n,t,e),o=a-i,l=(a+i)/2;return o?(u=.5>l?o/(a+i):o/(2-a-i),r=n==a?(t-e)/o+(e>t?6:0):t==a?(e-n)/o+2:(n-t)/o+4,r*=60):(r=NaN,u=l>0&&1>l?0:r),new ln(r,u,l)}function Sn(n,t,e){n=kn(n),t=kn(t),e=kn(e);var r=dn((.4124564*n+.3575761*t+.1804375*e)/Qa),u=dn((.2126729*n+.7151522*t+.072175*e)/no),i=dn((.0193339*n+.119192*t+.9503041*e)/to);return hn(116*u-16,500*(r-u),200*(u-i))}function kn(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function Nn(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function En(n){return"function"==typeof n?n:function(){return n}}function An(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),Cn(t,e,n,r)}}function Cn(n,t,e,r){function u(){var n,t=l.status;if(!t&&Ln(l)||t>=200&&300>t||304===t){try{n=e.call(i,l)}catch(r){return void a.error.call(i,r)}a.load.call(i,n)}else a.error.call(i,l)}var i={},a=oa.dispatch("beforesend","progress","load","error"),o={},l=new XMLHttpRequest,c=null;return!this.XDomainRequest||"withCredentials"in l||!/^(http(s)?:)?\/\//.test(n)||(l=new XDomainRequest),"onload"in l?l.onload=l.onerror=u:l.onreadystatechange=function(){l.readyState>3&&u()},l.onprogress=function(n){var t=oa.event;oa.event=n;try{a.progress.call(i,l)}finally{oa.event=t}},i.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?o[n]:(null==t?delete o[n]:o[n]=t+"",i)},i.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",i):t},i.responseType=function(n){return arguments.length?(c=n,i):c},i.response=function(n){return e=n,i},["get","post"].forEach(function(n){i[n]=function(){return i.send.apply(i,[n].concat(ca(arguments)))}}),i.send=function(e,r,u){if(2===arguments.length&&"function"==typeof r&&(u=r,r=null),l.open(e,n,!0),null==t||"accept"in o||(o.accept=t+",*/*"),l.setRequestHeader)for(var s in o)l.setRequestHeader(s,o[s]);return null!=t&&l.overrideMimeType&&l.overrideMimeType(t),null!=c&&(l.responseType=c),null!=u&&i.on("error",u).on("load",function(n){u(null,n)}),a.beforesend.call(i,l),l.send(null==r?null:r),i},i.abort=function(){return l.abort(),i},oa.rebind(i,a,"on"),null==r?i:i.get(zn(r))}function zn(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Ln(n){var t=n.responseType;return t&&"text"!==t?n.response:n.responseText}function qn(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var u=e+t,i={c:n,t:u,n:null};return ao?ao.n=i:io=i,ao=i,oo||(lo=clearTimeout(lo),oo=1,co(Tn)),i}function Tn(){var n=Rn(),t=Dn()-n;t>24?(isFinite(t)&&(clearTimeout(lo),lo=setTimeout(Tn,t)),oo=0):(oo=1,co(Tn))}function Rn(){for(var n=Date.now(),t=io;t;)n>=t.t&&t.c(n-t.t)&&(t.c=null),t=t.n;return n}function Dn(){for(var n,t=io,e=1/0;t;)t.c?(t.t<e&&(e=t.t),t=(n=t).n):t=n?n.n=t.n:io=t.n;return ao=n,e}function Pn(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Un(n,t){var e=Math.pow(10,3*Ma(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function jn(n){var t=n.decimal,e=n.thousands,r=n.grouping,u=n.currency,i=r&&e?function(n,t){for(var u=n.length,i=[],a=0,o=r[0],l=0;u>0&&o>0&&(l+o+1>t&&(o=Math.max(1,t-l)),i.push(n.substring(u-=o,u+o)),!((l+=o+1)>t));)o=r[a=(a+1)%r.length];return i.reverse().join(e)}:y;return function(n){var e=fo.exec(n),r=e[1]||" ",a=e[2]||">",o=e[3]||"-",l=e[4]||"",c=e[5],s=+e[6],f=e[7],h=e[8],g=e[9],p=1,v="",d="",m=!1,y=!0;switch(h&&(h=+h.substring(1)),(c||"0"===r&&"="===a)&&(c=r="0",a="="),g){case"n":f=!0,g="g";break;case"%":p=100,d="%",g="f";break;case"p":p=100,d="%",g="r";break;case"b":case"o":case"x":case"X":"#"===l&&(v="0"+g.toLowerCase());case"c":y=!1;case"d":m=!0,h=0;break;case"s":p=-1,g="r"}"$"===l&&(v=u[0],d=u[1]),"r"!=g||h||(g="g"),null!=h&&("g"==g?h=Math.max(1,Math.min(21,h)):("e"==g||"f"==g)&&(h=Math.max(0,Math.min(20,h)))),g=ho.get(g)||Fn;var M=c&&f;return function(n){var e=d;if(m&&n%1)return"";var u=0>n||0===n&&0>1/n?(n=-n,"-"):"-"===o?"":o;if(0>p){var l=oa.formatPrefix(n,h);n=l.scale(n),e=l.symbol+d}else n*=p;n=g(n,h);var x,b,_=n.lastIndexOf(".");if(0>_){var w=y?n.lastIndexOf("e"):-1;0>w?(x=n,b=""):(x=n.substring(0,w),b=n.substring(w))}else x=n.substring(0,_),b=t+n.substring(_+1);!c&&f&&(x=i(x,1/0));var S=v.length+x.length+b.length+(M?0:u.length),k=s>S?new Array(S=s-S+1).join(r):"";return M&&(x=i(k+x,k.length?s-b.length:1/0)),u+=v,n=x+b,("<"===a?u+n+k:">"===a?k+u+n:"^"===a?k.substring(0,S>>=1)+u+n+k.substring(S):u+(M?n:k+n))+e}}}function Fn(n){return n+""}function Hn(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function On(n,t,e){function r(t){var e=n(t),r=i(e,1);return r-t>t-e?e:r}function u(e){return t(e=n(new po(e-1)),1),e}function i(n,e){return t(n=new po(+n),e),n}function a(n,r,i){var a=u(n),o=[];if(i>1)for(;r>a;)e(a)%i||o.push(new Date(+a)),t(a,1);else for(;r>a;)o.push(new Date(+a)),t(a,1);return o}function o(n,t,e){try{po=Hn;var r=new Hn;return r._=n,a(r,t,e)}finally{po=Date}}n.floor=n,n.round=r,n.ceil=u,n.offset=i,n.range=a;var l=n.utc=In(n);return l.floor=l,l.round=In(r),l.ceil=In(u),l.offset=In(i),l.range=o,n}function In(n){return function(t,e){try{po=Hn;var r=new Hn;return r._=t,n(r,e)._}finally{po=Date}}}function Yn(n){function t(n){function t(t){for(var e,u,i,a=[],o=-1,l=0;++o<r;)37===n.charCodeAt(o)&&(a.push(n.slice(l,o)),null!=(u=mo[e=n.charAt(++o)])&&(e=n.charAt(++o)),(i=A[e])&&(e=i(t,null==u?"e"===e?" ":"0":u)),a.push(e),l=o+1);return a.push(n.slice(l,o)),a.join("")}var r=n.length;return t.parse=function(t){var r={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},u=e(r,n,t,0);if(u!=t.length)return null;"p"in r&&(r.H=r.H%12+12*r.p);var i=null!=r.Z&&po!==Hn,a=new(i?Hn:po);return"j"in r?a.setFullYear(r.y,0,r.j):"W"in r||"U"in r?("w"in r||(r.w="W"in r?1:0),a.setFullYear(r.y,0,1),a.setFullYear(r.y,0,"W"in r?(r.w+6)%7+7*r.W-(a.getDay()+5)%7:r.w+7*r.U-(a.getDay()+6)%7)):a.setFullYear(r.y,r.m,r.d),a.setHours(r.H+(r.Z/100|0),r.M+r.Z%100,r.S,r.L),i?a._:a},t.toString=function(){return n},t}function e(n,t,e,r){for(var u,i,a,o=0,l=t.length,c=e.length;l>o;){if(r>=c)return-1;if(u=t.charCodeAt(o++),37===u){if(a=t.charAt(o++),i=C[a in mo?t.charAt(o++):a],!i||(r=i(n,e,r))<0)return-1}else if(u!=e.charCodeAt(r++))return-1}return r}function r(n,t,e){_.lastIndex=0;var r=_.exec(t.slice(e));return r?(n.w=w.get(r[0].toLowerCase()),e+r[0].length):-1}function u(n,t,e){x.lastIndex=0;var r=x.exec(t.slice(e));return r?(n.w=b.get(r[0].toLowerCase()),e+r[0].length):-1}function i(n,t,e){N.lastIndex=0;var r=N.exec(t.slice(e));return r?(n.m=E.get(r[0].toLowerCase()),e+r[0].length):-1}function a(n,t,e){S.lastIndex=0;var r=S.exec(t.slice(e));return r?(n.m=k.get(r[0].toLowerCase()),e+r[0].length):-1}function o(n,t,r){return e(n,A.c.toString(),t,r)}function l(n,t,r){return e(n,A.x.toString(),t,r)}function c(n,t,r){return e(n,A.X.toString(),t,r)}function s(n,t,e){var r=M.get(t.slice(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}var f=n.dateTime,h=n.date,g=n.time,p=n.periods,v=n.days,d=n.shortDays,m=n.months,y=n.shortMonths;t.utc=function(n){function e(n){try{po=Hn;var t=new po;return t._=n,r(t)}finally{po=Date}}var r=t(n);return e.parse=function(n){try{po=Hn;var t=r.parse(n);return t&&t._}finally{po=Date}},e.toString=r.toString,e},t.multi=t.utc.multi=ct;var M=oa.map(),x=Vn(v),b=Xn(v),_=Vn(d),w=Xn(d),S=Vn(m),k=Xn(m),N=Vn(y),E=Xn(y);p.forEach(function(n,t){M.set(n.toLowerCase(),t)});var A={a:function(n){return d[n.getDay()]},A:function(n){return v[n.getDay()]},b:function(n){return y[n.getMonth()]},B:function(n){return m[n.getMonth()]},c:t(f),d:function(n,t){return Zn(n.getDate(),t,2)},e:function(n,t){return Zn(n.getDate(),t,2)},H:function(n,t){return Zn(n.getHours(),t,2)},I:function(n,t){return Zn(n.getHours()%12||12,t,2)},j:function(n,t){return Zn(1+go.dayOfYear(n),t,3)},L:function(n,t){return Zn(n.getMilliseconds(),t,3)},m:function(n,t){return Zn(n.getMonth()+1,t,2)},M:function(n,t){return Zn(n.getMinutes(),t,2)},p:function(n){return p[+(n.getHours()>=12)]},S:function(n,t){return Zn(n.getSeconds(),t,2)},U:function(n,t){return Zn(go.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Zn(go.mondayOfYear(n),t,2)},x:t(h),X:t(g),y:function(n,t){return Zn(n.getFullYear()%100,t,2)},Y:function(n,t){return Zn(n.getFullYear()%1e4,t,4)},Z:ot,"%":function(){return"%"}},C={a:r,A:u,b:i,B:a,c:o,d:tt,e:tt,H:rt,I:rt,j:et,L:at,m:nt,M:ut,p:s,S:it,U:Bn,w:$n,W:Wn,x:l,X:c,y:Gn,Y:Jn,Z:Kn,"%":lt};return t}function Zn(n,t,e){var r=0>n?"-":"",u=(r?-n:n)+"",i=u.length;return r+(e>i?new Array(e-i+1).join(t)+u:u)}function Vn(n){return new RegExp("^(?:"+n.map(oa.requote).join("|")+")","i")}function Xn(n){for(var t=new c,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function $n(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Bn(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function Wn(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function Jn(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Gn(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+2));return r?(n.y=Qn(+r[0]),e+r[0].length):-1}function Kn(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}function Qn(n){return n+(n>68?1900:2e3)}function nt(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function tt(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function et(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function rt(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function ut(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function it(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function at(n,t,e){yo.lastIndex=0;var r=yo.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function ot(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=Ma(t)/60|0,u=Ma(t)%60;return e+Zn(r,"0",2)+Zn(u,"0",2)}function lt(n,t,e){Mo.lastIndex=0;var r=Mo.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function ct(n){for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}function st(){}function ft(n,t,e){var r=e.s=n+t,u=r-n,i=r-u;e.t=n-i+(t-u)}function ht(n,t){n&&wo.hasOwnProperty(n.type)&&wo[n.type](n,t)}function gt(n,t,e){var r,u=-1,i=n.length-e;for(t.lineStart();++u<i;)r=n[u],t.point(r[0],r[1],r[2]);t.lineEnd()}function pt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)gt(n[e],t,1);t.polygonEnd()}function vt(){function n(n,t){n*=Ia,t=t*Ia/2+ja/4;var e=n-r,a=e>=0?1:-1,o=a*e,l=Math.cos(t),c=Math.sin(t),s=i*c,f=u*l+s*Math.cos(o),h=s*a*Math.sin(o);ko.add(Math.atan2(h,f)),r=n,u=l,i=c}var t,e,r,u,i;No.point=function(a,o){No.point=n,r=(t=a)*Ia,u=Math.cos(o=(e=o)*Ia/2+ja/4),i=Math.sin(o)},No.lineEnd=function(){n(t,e)}}function dt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function mt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function yt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Mt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function xt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function bt(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function _t(n){return[Math.atan2(n[1],n[0]),tn(n[2])]}function wt(n,t){return Ma(n[0]-t[0])<Pa&&Ma(n[1]-t[1])<Pa}function St(n,t){n*=Ia;var e=Math.cos(t*=Ia);kt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function kt(n,t,e){++Eo,Co+=(n-Co)/Eo,zo+=(t-zo)/Eo,Lo+=(e-Lo)/Eo}function Nt(){function n(n,u){n*=Ia;var i=Math.cos(u*=Ia),a=i*Math.cos(n),o=i*Math.sin(n),l=Math.sin(u),c=Math.atan2(Math.sqrt((c=e*l-r*o)*c+(c=r*a-t*l)*c+(c=t*o-e*a)*c),t*a+e*o+r*l);Ao+=c,qo+=c*(t+(t=a)),To+=c*(e+(e=o)),Ro+=c*(r+(r=l)),kt(t,e,r)}var t,e,r;jo.point=function(u,i){u*=Ia;var a=Math.cos(i*=Ia);t=a*Math.cos(u),e=a*Math.sin(u),r=Math.sin(i),jo.point=n,kt(t,e,r)}}function Et(){jo.point=St}function At(){function n(n,t){n*=Ia;var e=Math.cos(t*=Ia),a=e*Math.cos(n),o=e*Math.sin(n),l=Math.sin(t),c=u*l-i*o,s=i*a-r*l,f=r*o-u*a,h=Math.sqrt(c*c+s*s+f*f),g=r*a+u*o+i*l,p=h&&-nn(g)/h,v=Math.atan2(h,g);Do+=p*c,Po+=p*s,Uo+=p*f,Ao+=v,qo+=v*(r+(r=a)),To+=v*(u+(u=o)),Ro+=v*(i+(i=l)),kt(r,u,i)}var t,e,r,u,i;jo.point=function(a,o){t=a,e=o,jo.point=n,a*=Ia;var l=Math.cos(o*=Ia);r=l*Math.cos(a),u=l*Math.sin(a),i=Math.sin(o),kt(r,u,i)},jo.lineEnd=function(){n(t,e),jo.lineEnd=Et,jo.point=St}}function Ct(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function zt(){return!0}function Lt(n,t,e,r,u){var i=[],a=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(wt(e,r)){u.lineStart();for(var o=0;t>o;++o)u.point((e=n[o])[0],e[1]);return void u.lineEnd()}var l=new Tt(e,n,null,!0),c=new Tt(e,null,l,!1);l.o=c,i.push(l),a.push(c),l=new Tt(r,n,null,!1),c=new Tt(r,null,l,!0),l.o=c,i.push(l),a.push(c)}}),a.sort(t),qt(i),qt(a),i.length){for(var o=0,l=e,c=a.length;c>o;++o)a[o].e=l=!l;for(var s,f,h=i[0];;){for(var g=h,p=!0;g.v;)if((g=g.n)===h)return;s=g.z,u.lineStart();do{if(g.v=g.o.v=!0,g.e){if(p)for(var o=0,c=s.length;c>o;++o)u.point((f=s[o])[0],f[1]);else r(g.x,g.n.x,1,u);g=g.n}else{if(p){s=g.p.z;for(var o=s.length-1;o>=0;--o)u.point((f=s[o])[0],f[1])}else r(g.x,g.p.x,-1,u);g=g.p}g=g.o,s=g.z,p=!p}while(!g.v);u.lineEnd()}}}function qt(n){if(t=n.length){for(var t,e,r=0,u=n[0];++r<t;)u.n=e=n[r],e.p=u,u=e;u.n=e=n[0],e.p=u}}function Tt(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function Rt(n,t,e,r){return function(u,i){function a(t,e){var r=u(t,e);n(t=r[0],e=r[1])&&i.point(t,e)}function o(n,t){var e=u(n,t);d.point(e[0],e[1])}function l(){y.point=o,d.lineStart()}function c(){y.point=a,d.lineEnd()}function s(n,t){v.push([n,t]);var e=u(n,t);x.point(e[0],e[1])}function f(){x.lineStart(),v=[]}function h(){s(v[0][0],v[0][1]),x.lineEnd();var n,t=x.clean(),e=M.buffer(),r=e.length;if(v.pop(),p.push(v),v=null,r)if(1&t){n=e[0];var u,r=n.length-1,a=-1;if(r>0){for(b||(i.polygonStart(),b=!0),i.lineStart();++a<r;)i.point((u=n[a])[0],u[1]);i.lineEnd()}}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),g.push(e.filter(Dt))}var g,p,v,d=t(i),m=u.invert(r[0],r[1]),y={point:a,lineStart:l,lineEnd:c,polygonStart:function(){y.point=s,y.lineStart=f,y.lineEnd=h,g=[],p=[]},polygonEnd:function(){y.point=a,y.lineStart=l,y.lineEnd=c,g=oa.merge(g);var n=Ot(m,p);g.length?(b||(i.polygonStart(),b=!0),Lt(g,Ut,n,e,i)):n&&(b||(i.polygonStart(),b=!0),i.lineStart(),e(null,null,1,i),i.lineEnd()),b&&(i.polygonEnd(),b=!1),g=p=null},sphere:function(){i.polygonStart(),i.lineStart(),e(null,null,1,i),i.lineEnd(),i.polygonEnd()}},M=Pt(),x=t(M),b=!1;return y}}function Dt(n){return n.length>1}function Pt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:b,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Ut(n,t){return((n=n.x)[0]<0?n[1]-Oa-Pa:Oa-n[1])-((t=t.x)[0]<0?t[1]-Oa-Pa:Oa-t[1])}function jt(n){var t,e=NaN,r=NaN,u=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(i,a){var o=i>0?ja:-ja,l=Ma(i-e);Ma(l-ja)<Pa?(n.point(e,r=(r+a)/2>0?Oa:-Oa),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(o,r),n.point(i,r),t=0):u!==o&&l>=ja&&(Ma(e-u)<Pa&&(e-=u*Pa),Ma(i-o)<Pa&&(i-=o*Pa),r=Ft(e,r,i,a),n.point(u,r),n.lineEnd(),n.lineStart(),n.point(o,r),t=0),n.point(e=i,r=a),u=o},lineEnd:function(){n.lineEnd(),e=r=NaN},clean:function(){return 2-t}}}function Ft(n,t,e,r){var u,i,a=Math.sin(n-e);return Ma(a)>Pa?Math.atan((Math.sin(t)*(i=Math.cos(r))*Math.sin(e)-Math.sin(r)*(u=Math.cos(t))*Math.sin(n))/(u*i*a)):(t+r)/2}function Ht(n,t,e,r){var u;if(null==n)u=e*Oa,r.point(-ja,u),r.point(0,u),r.point(ja,u),r.point(ja,0),r.point(ja,-u),r.point(0,-u),r.point(-ja,-u),r.point(-ja,0),r.point(-ja,u);else if(Ma(n[0]-t[0])>Pa){var i=n[0]<t[0]?ja:-ja;u=e*i/2,r.point(-i,u),r.point(0,u),r.point(i,u)}else r.point(t[0],t[1])}function Ot(n,t){var e=n[0],r=n[1],u=[Math.sin(e),-Math.cos(e),0],i=0,a=0;ko.reset();for(var o=0,l=t.length;l>o;++o){var c=t[o],s=c.length;if(s)for(var f=c[0],h=f[0],g=f[1]/2+ja/4,p=Math.sin(g),v=Math.cos(g),d=1;;){d===s&&(d=0),n=c[d];var m=n[0],y=n[1]/2+ja/4,M=Math.sin(y),x=Math.cos(y),b=m-h,_=b>=0?1:-1,w=_*b,S=w>ja,k=p*M;if(ko.add(Math.atan2(k*_*Math.sin(w),v*x+k*Math.cos(w))),i+=S?b+_*Fa:b,S^h>=e^m>=e){var N=yt(dt(f),dt(n));bt(N);var E=yt(u,N);bt(E);var A=(S^b>=0?-1:1)*tn(E[2]);(r>A||r===A&&(N[0]||N[1]))&&(a+=S^b>=0?1:-1)}if(!d++)break;h=m,p=M,v=x,f=n}}return(-Pa>i||Pa>i&&0>ko)^1&a}function It(n){function t(n,t){return Math.cos(n)*Math.cos(t)>i}function e(n){var e,i,l,c,s;return{lineStart:function(){c=l=!1,s=1},point:function(f,h){var g,p=[f,h],v=t(f,h),d=a?v?0:u(f,h):v?u(f+(0>f?ja:-ja),h):0;if(!e&&(c=l=v)&&n.lineStart(),v!==l&&(g=r(e,p),(wt(e,g)||wt(p,g))&&(p[0]+=Pa,p[1]+=Pa,v=t(p[0],p[1]))),v!==l)s=0,v?(n.lineStart(),g=r(p,e),n.point(g[0],g[1])):(g=r(e,p),n.point(g[0],g[1]),n.lineEnd()),e=g;else if(o&&e&&a^v){var m;d&i||!(m=r(p,e,!0))||(s=0,a?(n.lineStart(),n.point(m[0][0],m[0][1]),n.point(m[1][0],m[1][1]),n.lineEnd()):(n.point(m[1][0],m[1][1]),n.lineEnd(),n.lineStart(),n.point(m[0][0],m[0][1])))}!v||e&&wt(e,p)||n.point(p[0],p[1]),e=p,l=v,i=d},lineEnd:function(){l&&n.lineEnd(),e=null},clean:function(){return s|(c&&l)<<1}}}function r(n,t,e){var r=dt(n),u=dt(t),a=[1,0,0],o=yt(r,u),l=mt(o,o),c=o[0],s=l-c*c;if(!s)return!e&&n;var f=i*l/s,h=-i*c/s,g=yt(a,o),p=xt(a,f),v=xt(o,h);Mt(p,v);var d=g,m=mt(p,d),y=mt(d,d),M=m*m-y*(mt(p,p)-1);if(!(0>M)){var x=Math.sqrt(M),b=xt(d,(-m-x)/y);if(Mt(b,p),b=_t(b),!e)return b;var _,w=n[0],S=t[0],k=n[1],N=t[1];w>S&&(_=w,w=S,S=_);var E=S-w,A=Ma(E-ja)<Pa,C=A||Pa>E;if(!A&&k>N&&(_=k,k=N,N=_),C?A?k+N>0^b[1]<(Ma(b[0]-w)<Pa?k:N):k<=b[1]&&b[1]<=N:E>ja^(w<=b[0]&&b[0]<=S)){var z=xt(d,(-m+x)/y);return Mt(z,p),[b,_t(z)]}}}function u(t,e){var r=a?n:ja-n,u=0;return-r>t?u|=1:t>r&&(u|=2),-r>e?u|=4:e>r&&(u|=8),u}var i=Math.cos(n),a=i>0,o=Ma(i)>Pa,l=ve(n,6*Ia);return Rt(t,e,l,a?[0,-n]:[-ja,n-ja])}function Yt(n,t,e,r){return function(u){var i,a=u.a,o=u.b,l=a.x,c=a.y,s=o.x,f=o.y,h=0,g=1,p=s-l,v=f-c;if(i=n-l,p||!(i>0)){if(i/=p,0>p){if(h>i)return;g>i&&(g=i)}else if(p>0){if(i>g)return;i>h&&(h=i)}if(i=e-l,p||!(0>i)){if(i/=p,0>p){if(i>g)return;i>h&&(h=i)}else if(p>0){if(h>i)return;g>i&&(g=i)}if(i=t-c,v||!(i>0)){if(i/=v,0>v){if(h>i)return;g>i&&(g=i)}else if(v>0){if(i>g)return;i>h&&(h=i)}if(i=r-c,v||!(0>i)){if(i/=v,0>v){if(i>g)return;i>h&&(h=i)}else if(v>0){if(h>i)return;g>i&&(g=i)}return h>0&&(u.a={x:l+h*p,y:c+h*v}),1>g&&(u.b={x:l+g*p,y:c+g*v}),u}}}}}}function Zt(n,t,e,r){function u(r,u){return Ma(r[0]-n)<Pa?u>0?0:3:Ma(r[0]-e)<Pa?u>0?2:1:Ma(r[1]-t)<Pa?u>0?1:0:u>0?3:2}function i(n,t){return a(n.x,t.x)}function a(n,t){var e=u(n,1),r=u(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(o){function l(n){for(var t=0,e=d.length,r=n[1],u=0;e>u;++u)for(var i,a=1,o=d[u],l=o.length,c=o[0];l>a;++a)i=o[a],c[1]<=r?i[1]>r&&Q(c,i,n)>0&&++t:i[1]<=r&&Q(c,i,n)<0&&--t,c=i;return 0!==t}function c(i,o,l,c){var s=0,f=0;if(null==i||(s=u(i,l))!==(f=u(o,l))||a(i,o)<0^l>0){do c.point(0===s||3===s?n:e,s>1?r:t);while((s=(s+l+4)%4)!==f)}else c.point(o[0],o[1])}function s(u,i){return u>=n&&e>=u&&i>=t&&r>=i}function f(n,t){s(n,t)&&o.point(n,t)}function h(){C.point=p,d&&d.push(m=[]),S=!0,w=!1,b=_=NaN}function g(){v&&(p(y,M),x&&w&&E.rejoin(),v.push(E.buffer())),C.point=f,w&&o.lineEnd()}function p(n,t){n=Math.max(-Ho,Math.min(Ho,n)),t=Math.max(-Ho,Math.min(Ho,t));var e=s(n,t);if(d&&m.push([n,t]),S)y=n,M=t,x=e,S=!1,e&&(o.lineStart(),o.point(n,t));else if(e&&w)o.point(n,t);else{var r={a:{x:b,y:_},b:{x:n,y:t}};A(r)?(w||(o.lineStart(),o.point(r.a.x,r.a.y)),o.point(r.b.x,r.b.y),e||o.lineEnd(),k=!1):e&&(o.lineStart(),o.point(n,t),k=!1)}b=n,_=t,w=e}var v,d,m,y,M,x,b,_,w,S,k,N=o,E=Pt(),A=Yt(n,t,e,r),C={point:f,lineStart:h,lineEnd:g,polygonStart:function(){o=E,v=[],d=[],k=!0},polygonEnd:function(){o=N,v=oa.merge(v);var t=l([n,r]),e=k&&t,u=v.length;(e||u)&&(o.polygonStart(),e&&(o.lineStart(),c(null,null,1,o),o.lineEnd()),u&&Lt(v,i,t,c,o),o.polygonEnd()),v=d=m=null}};return C}}function Vt(n){var t=0,e=ja/3,r=oe(n),u=r(t,e);return u.parallels=function(n){return arguments.length?r(t=n[0]*ja/180,e=n[1]*ja/180):[t/ja*180,e/ja*180]},u}function Xt(n,t){function e(n,t){var e=Math.sqrt(i-2*u*Math.sin(t))/u;return[e*Math.sin(n*=u),a-e*Math.cos(n)]}var r=Math.sin(n),u=(r+Math.sin(t))/2,i=1+r*(2*u-r),a=Math.sqrt(i)/u;return e.invert=function(n,t){var e=a-t;return[Math.atan2(n,e)/u,tn((i-(n*n+e*e)*u*u)/(2*u))]},e}function $t(){function n(n,t){Io+=u*n-r*t,r=n,u=t}var t,e,r,u;$o.point=function(i,a){$o.point=n,t=r=i,e=u=a},$o.lineEnd=function(){n(t,e)}}function Bt(n,t){Yo>n&&(Yo=n),n>Vo&&(Vo=n),Zo>t&&(Zo=t),t>Xo&&(Xo=t)}function Wt(){function n(n,t){a.push("M",n,",",t,i)}function t(n,t){a.push("M",n,",",t),o.point=e}function e(n,t){a.push("L",n,",",t)}function r(){o.point=n}function u(){a.push("Z")}var i=Jt(4.5),a=[],o={point:n,lineStart:function(){o.point=t},lineEnd:r,polygonStart:function(){o.lineEnd=u},polygonEnd:function(){o.lineEnd=r,o.point=n},pointRadius:function(n){return i=Jt(n),o},result:function(){if(a.length){var n=a.join("");return a=[],n}}};return o}function Jt(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function Gt(n,t){Co+=n,zo+=t,++Lo}function Kt(){function n(n,r){var u=n-t,i=r-e,a=Math.sqrt(u*u+i*i);qo+=a*(t+n)/2,To+=a*(e+r)/2,Ro+=a,Gt(t=n,e=r)}var t,e;Wo.point=function(r,u){Wo.point=n,Gt(t=r,e=u)}}function Qt(){Wo.point=Gt}function ne(){function n(n,t){var e=n-r,i=t-u,a=Math.sqrt(e*e+i*i);qo+=a*(r+n)/2,To+=a*(u+t)/2,Ro+=a,a=u*n-r*t,Do+=a*(r+n),Po+=a*(u+t),Uo+=3*a,Gt(r=n,u=t)}var t,e,r,u;Wo.point=function(i,a){Wo.point=n,Gt(t=r=i,e=u=a)},Wo.lineEnd=function(){n(t,e)}}function te(n){function t(t,e){n.moveTo(t+a,e),n.arc(t,e,a,0,Fa)}function e(t,e){n.moveTo(t,e),o.point=r}function r(t,e){n.lineTo(t,e)}function u(){o.point=t}function i(){n.closePath()}var a=4.5,o={point:t,lineStart:function(){o.point=e},lineEnd:u,polygonStart:function(){o.lineEnd=i},polygonEnd:function(){o.lineEnd=u,o.point=t},pointRadius:function(n){return a=n,o},result:b};return o}function ee(n){function t(n){return(o?r:e)(n)}function e(t){return ie(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){M=NaN,S.point=i,t.lineStart()}function i(e,r){var i=dt([e,r]),a=n(e,r);u(M,x,y,b,_,w,M=a[0],x=a[1],y=e,b=i[0],_=i[1],w=i[2],o,t),t.point(M,x)}function a(){S.point=e,t.lineEnd()}function l(){
	r(),S.point=c,S.lineEnd=s}function c(n,t){i(f=n,h=t),g=M,p=x,v=b,d=_,m=w,S.point=i}function s(){u(M,x,y,b,_,w,g,p,f,v,d,m,o,t),S.lineEnd=a,a()}var f,h,g,p,v,d,m,y,M,x,b,_,w,S={point:e,lineStart:r,lineEnd:a,polygonStart:function(){t.polygonStart(),S.lineStart=l},polygonEnd:function(){t.polygonEnd(),S.lineStart=r}};return S}function u(t,e,r,o,l,c,s,f,h,g,p,v,d,m){var y=s-t,M=f-e,x=y*y+M*M;if(x>4*i&&d--){var b=o+g,_=l+p,w=c+v,S=Math.sqrt(b*b+_*_+w*w),k=Math.asin(w/=S),N=Ma(Ma(w)-1)<Pa||Ma(r-h)<Pa?(r+h)/2:Math.atan2(_,b),E=n(N,k),A=E[0],C=E[1],z=A-t,L=C-e,q=M*z-y*L;(q*q/x>i||Ma((y*z+M*L)/x-.5)>.3||a>o*g+l*p+c*v)&&(u(t,e,r,o,l,c,A,C,N,b/=S,_/=S,w,d,m),m.point(A,C),u(A,C,N,b,_,w,s,f,h,g,p,v,d,m))}}var i=.5,a=Math.cos(30*Ia),o=16;return t.precision=function(n){return arguments.length?(o=(i=n*n)>0&&16,t):Math.sqrt(i)},t}function re(n){var t=ee(function(t,e){return n([t*Ya,e*Ya])});return function(n){return le(t(n))}}function ue(n){this.stream=n}function ie(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function ae(n){return oe(function(){return n})()}function oe(n){function t(n){return n=o(n[0]*Ia,n[1]*Ia),[n[0]*h+l,c-n[1]*h]}function e(n){return n=o.invert((n[0]-l)/h,(c-n[1])/h),n&&[n[0]*Ya,n[1]*Ya]}function r(){o=Ct(a=fe(m,M,x),i);var n=i(v,d);return l=g-n[0]*h,c=p+n[1]*h,u()}function u(){return s&&(s.valid=!1,s=null),t}var i,a,o,l,c,s,f=ee(function(n,t){return n=i(n,t),[n[0]*h+l,c-n[1]*h]}),h=150,g=480,p=250,v=0,d=0,m=0,M=0,x=0,b=Fo,_=y,w=null,S=null;return t.stream=function(n){return s&&(s.valid=!1),s=le(b(a,f(_(n)))),s.valid=!0,s},t.clipAngle=function(n){return arguments.length?(b=null==n?(w=n,Fo):It((w=+n)*Ia),u()):w},t.clipExtent=function(n){return arguments.length?(S=n,_=n?Zt(n[0][0],n[0][1],n[1][0],n[1][1]):y,u()):S},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(g=+n[0],p=+n[1],r()):[g,p]},t.center=function(n){return arguments.length?(v=n[0]%360*Ia,d=n[1]%360*Ia,r()):[v*Ya,d*Ya]},t.rotate=function(n){return arguments.length?(m=n[0]%360*Ia,M=n[1]%360*Ia,x=n.length>2?n[2]%360*Ia:0,r()):[m*Ya,M*Ya,x*Ya]},oa.rebind(t,f,"precision"),function(){return i=n.apply(this,arguments),t.invert=i.invert&&e,r()}}function le(n){return ie(n,function(t,e){n.point(t*Ia,e*Ia)})}function ce(n,t){return[n,t]}function se(n,t){return[n>ja?n-Fa:-ja>n?n+Fa:n,t]}function fe(n,t,e){return n?t||e?Ct(ge(n),pe(t,e)):ge(n):t||e?pe(t,e):se}function he(n){return function(t,e){return t+=n,[t>ja?t-Fa:-ja>t?t+Fa:t,e]}}function ge(n){var t=he(n);return t.invert=he(-n),t}function pe(n,t){function e(n,t){var e=Math.cos(t),o=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),s=c*r+o*u;return[Math.atan2(l*i-s*a,o*r-c*u),tn(s*i+l*a)]}var r=Math.cos(n),u=Math.sin(n),i=Math.cos(t),a=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),o=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),s=c*i-l*a;return[Math.atan2(l*i+c*a,o*r+s*u),tn(s*r-o*u)]},e}function ve(n,t){var e=Math.cos(n),r=Math.sin(n);return function(u,i,a,o){var l=a*t;null!=u?(u=de(e,u),i=de(e,i),(a>0?i>u:u>i)&&(u+=a*Fa)):(u=n+a*Fa,i=n-.5*l);for(var c,s=u;a>0?s>i:i>s;s-=l)o.point((c=_t([e,-r*Math.cos(s),-r*Math.sin(s)]))[0],c[1])}}function de(n,t){var e=dt(t);e[0]-=n,bt(e);var r=nn(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Pa)%(2*Math.PI)}function me(n,t,e){var r=oa.range(n,t-Pa,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function ye(n,t,e){var r=oa.range(n,t-Pa,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function Me(n){return n.source}function xe(n){return n.target}function be(n,t,e,r){var u=Math.cos(t),i=Math.sin(t),a=Math.cos(r),o=Math.sin(r),l=u*Math.cos(n),c=u*Math.sin(n),s=a*Math.cos(e),f=a*Math.sin(e),h=2*Math.asin(Math.sqrt(an(r-t)+u*a*an(e-n))),g=1/Math.sin(h),p=h?function(n){var t=Math.sin(n*=h)*g,e=Math.sin(h-n)*g,r=e*l+t*s,u=e*c+t*f,a=e*i+t*o;return[Math.atan2(u,r)*Ya,Math.atan2(a,Math.sqrt(r*r+u*u))*Ya]}:function(){return[n*Ya,t*Ya]};return p.distance=h,p}function _e(){function n(n,u){var i=Math.sin(u*=Ia),a=Math.cos(u),o=Ma((n*=Ia)-t),l=Math.cos(o);Jo+=Math.atan2(Math.sqrt((o=a*Math.sin(o))*o+(o=r*i-e*a*l)*o),e*i+r*a*l),t=n,e=i,r=a}var t,e,r;Go.point=function(u,i){t=u*Ia,e=Math.sin(i*=Ia),r=Math.cos(i),Go.point=n},Go.lineEnd=function(){Go.point=Go.lineEnd=b}}function we(n,t){function e(t,e){var r=Math.cos(t),u=Math.cos(e),i=n(r*u);return[i*u*Math.sin(t),i*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),u=t(r),i=Math.sin(u),a=Math.cos(u);return[Math.atan2(n*i,r*a),Math.asin(r&&e*i/r)]},e}function Se(n,t){function e(n,t){a>0?-Oa+Pa>t&&(t=-Oa+Pa):t>Oa-Pa&&(t=Oa-Pa);var e=a/Math.pow(u(t),i);return[e*Math.sin(i*n),a-e*Math.cos(i*n)]}var r=Math.cos(n),u=function(n){return Math.tan(ja/4+n/2)},i=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(u(t)/u(n)),a=r*Math.pow(u(n),i)/i;return i?(e.invert=function(n,t){var e=a-t,r=K(i)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/i,2*Math.atan(Math.pow(a/r,1/i))-Oa]},e):Ne}function ke(n,t){function e(n,t){var e=i-t;return[e*Math.sin(u*n),i-e*Math.cos(u*n)]}var r=Math.cos(n),u=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),i=r/u+n;return Ma(u)<Pa?ce:(e.invert=function(n,t){var e=i-t;return[Math.atan2(n,e)/u,i-K(u)*Math.sqrt(n*n+e*e)]},e)}function Ne(n,t){return[n,Math.log(Math.tan(ja/4+t/2))]}function Ee(n){var t,e=ae(n),r=e.scale,u=e.translate,i=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=u.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var a=i.apply(e,arguments);if(a===e){if(t=null==n){var o=ja*r(),l=u();i([[l[0]-o,l[1]-o],[l[0]+o,l[1]+o]])}}else t&&(a=null);return a},e.clipExtent(null)}function Ae(n,t){return[Math.log(Math.tan(ja/4+t/2)),-n]}function Ce(n){return n[0]}function ze(n){return n[1]}function Le(n){for(var t=n.length,e=[0,1],r=2,u=2;t>u;u++){for(;r>1&&Q(n[e[r-2]],n[e[r-1]],n[u])<=0;)--r;e[r++]=u}return e.slice(0,r)}function qe(n,t){return n[0]-t[0]||n[1]-t[1]}function Te(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function Re(n,t,e,r){var u=n[0],i=e[0],a=t[0]-u,o=r[0]-i,l=n[1],c=e[1],s=t[1]-l,f=r[1]-c,h=(o*(l-c)-f*(u-i))/(f*a-o*s);return[u+h*a,l+h*s]}function De(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Pe(){rr(this),this.edge=this.site=this.circle=null}function Ue(n){var t=cl.pop()||new Pe;return t.site=n,t}function je(n){Be(n),al.remove(n),cl.push(n),rr(n)}function Fe(n){var t=n.circle,e=t.x,r=t.cy,u={x:e,y:r},i=n.P,a=n.N,o=[n];je(n);for(var l=i;l.circle&&Ma(e-l.circle.x)<Pa&&Ma(r-l.circle.cy)<Pa;)i=l.P,o.unshift(l),je(l),l=i;o.unshift(l),Be(l);for(var c=a;c.circle&&Ma(e-c.circle.x)<Pa&&Ma(r-c.circle.cy)<Pa;)a=c.N,o.push(c),je(c),c=a;o.push(c),Be(c);var s,f=o.length;for(s=1;f>s;++s)c=o[s],l=o[s-1],nr(c.edge,l.site,c.site,u);l=o[0],c=o[f-1],c.edge=Ke(l.site,c.site,null,u),$e(l),$e(c)}function He(n){for(var t,e,r,u,i=n.x,a=n.y,o=al._;o;)if(r=Oe(o,a)-i,r>Pa)o=o.L;else{if(u=i-Ie(o,a),!(u>Pa)){r>-Pa?(t=o.P,e=o):u>-Pa?(t=o,e=o.N):t=e=o;break}if(!o.R){t=o;break}o=o.R}var l=Ue(n);if(al.insert(t,l),t||e){if(t===e)return Be(t),e=Ue(t.site),al.insert(l,e),l.edge=e.edge=Ke(t.site,l.site),$e(t),void $e(e);if(!e)return void(l.edge=Ke(t.site,l.site));Be(t),Be(e);var c=t.site,s=c.x,f=c.y,h=n.x-s,g=n.y-f,p=e.site,v=p.x-s,d=p.y-f,m=2*(h*d-g*v),y=h*h+g*g,M=v*v+d*d,x={x:(d*y-g*M)/m+s,y:(h*M-v*y)/m+f};nr(e.edge,c,p,x),l.edge=Ke(c,n,null,x),e.edge=Ke(n,p,null,x),$e(t),$e(e)}}function Oe(n,t){var e=n.site,r=e.x,u=e.y,i=u-t;if(!i)return r;var a=n.P;if(!a)return-(1/0);e=a.site;var o=e.x,l=e.y,c=l-t;if(!c)return o;var s=o-r,f=1/i-1/c,h=s/c;return f?(-h+Math.sqrt(h*h-2*f*(s*s/(-2*c)-l+c/2+u-i/2)))/f+r:(r+o)/2}function Ie(n,t){var e=n.N;if(e)return Oe(e,t);var r=n.site;return r.y===t?r.x:1/0}function Ye(n){this.site=n,this.edges=[]}function Ze(n){for(var t,e,r,u,i,a,o,l,c,s,f=n[0][0],h=n[1][0],g=n[0][1],p=n[1][1],v=il,d=v.length;d--;)if(i=v[d],i&&i.prepare())for(o=i.edges,l=o.length,a=0;l>a;)s=o[a].end(),r=s.x,u=s.y,c=o[++a%l].start(),t=c.x,e=c.y,(Ma(r-t)>Pa||Ma(u-e)>Pa)&&(o.splice(a,0,new tr(Qe(i.site,s,Ma(r-f)<Pa&&p-u>Pa?{x:f,y:Ma(t-f)<Pa?e:p}:Ma(u-p)<Pa&&h-r>Pa?{x:Ma(e-p)<Pa?t:h,y:p}:Ma(r-h)<Pa&&u-g>Pa?{x:h,y:Ma(t-h)<Pa?e:g}:Ma(u-g)<Pa&&r-f>Pa?{x:Ma(e-g)<Pa?t:f,y:g}:null),i.site,null)),++l)}function Ve(n,t){return t.angle-n.angle}function Xe(){rr(this),this.x=this.y=this.arc=this.site=this.cy=null}function $e(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,u=n.site,i=e.site;if(r!==i){var a=u.x,o=u.y,l=r.x-a,c=r.y-o,s=i.x-a,f=i.y-o,h=2*(l*f-c*s);if(!(h>=-Ua)){var g=l*l+c*c,p=s*s+f*f,v=(f*g-c*p)/h,d=(l*p-s*g)/h,f=d+o,m=sl.pop()||new Xe;m.arc=n,m.site=u,m.x=v+a,m.y=f+Math.sqrt(v*v+d*d),m.cy=f,n.circle=m;for(var y=null,M=ll._;M;)if(m.y<M.y||m.y===M.y&&m.x<=M.x){if(!M.L){y=M.P;break}M=M.L}else{if(!M.R){y=M;break}M=M.R}ll.insert(y,m),y||(ol=m)}}}}function Be(n){var t=n.circle;t&&(t.P||(ol=t.N),ll.remove(t),sl.push(t),rr(t),n.circle=null)}function We(n){for(var t,e=ul,r=Yt(n[0][0],n[0][1],n[1][0],n[1][1]),u=e.length;u--;)t=e[u],(!Je(t,n)||!r(t)||Ma(t.a.x-t.b.x)<Pa&&Ma(t.a.y-t.b.y)<Pa)&&(t.a=t.b=null,e.splice(u,1))}function Je(n,t){var e=n.b;if(e)return!0;var r,u,i=n.a,a=t[0][0],o=t[1][0],l=t[0][1],c=t[1][1],s=n.l,f=n.r,h=s.x,g=s.y,p=f.x,v=f.y,d=(h+p)/2,m=(g+v)/2;if(v===g){if(a>d||d>=o)return;if(h>p){if(i){if(i.y>=c)return}else i={x:d,y:l};e={x:d,y:c}}else{if(i){if(i.y<l)return}else i={x:d,y:c};e={x:d,y:l}}}else if(r=(h-p)/(v-g),u=m-r*d,-1>r||r>1)if(h>p){if(i){if(i.y>=c)return}else i={x:(l-u)/r,y:l};e={x:(c-u)/r,y:c}}else{if(i){if(i.y<l)return}else i={x:(c-u)/r,y:c};e={x:(l-u)/r,y:l}}else if(v>g){if(i){if(i.x>=o)return}else i={x:a,y:r*a+u};e={x:o,y:r*o+u}}else{if(i){if(i.x<a)return}else i={x:o,y:r*o+u};e={x:a,y:r*a+u}}return n.a=i,n.b=e,!0}function Ge(n,t){this.l=n,this.r=t,this.a=this.b=null}function Ke(n,t,e,r){var u=new Ge(n,t);return ul.push(u),e&&nr(u,n,t,e),r&&nr(u,t,n,r),il[n.i].edges.push(new tr(u,n,t)),il[t.i].edges.push(new tr(u,t,n)),u}function Qe(n,t,e){var r=new Ge(n,null);return r.a=t,r.b=e,ul.push(r),r}function nr(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function tr(n,t,e){var r=n.a,u=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(u.x-r.x,r.y-u.y):Math.atan2(r.x-u.x,u.y-r.y)}function er(){this._=null}function rr(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function ur(n,t){var e=t,r=t.R,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function ir(n,t){var e=t,r=t.L,u=e.U;u?u.L===e?u.L=r:u.R=r:n._=r,r.U=u,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function ar(n){for(;n.L;)n=n.L;return n}function or(n,t){var e,r,u,i=n.sort(lr).pop();for(ul=[],il=new Array(n.length),al=new er,ll=new er;;)if(u=ol,i&&(!u||i.y<u.y||i.y===u.y&&i.x<u.x))(i.x!==e||i.y!==r)&&(il[i.i]=new Ye(i),He(i),e=i.x,r=i.y),i=n.pop();else{if(!u)break;Fe(u.arc)}t&&(We(t),Ze(t));var a={cells:il,edges:ul};return al=ll=ul=il=null,a}function lr(n,t){return t.y-n.y||t.x-n.x}function cr(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function sr(n){return n.x}function fr(n){return n.y}function hr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function gr(n,t,e,r,u,i){if(!n(t,e,r,u,i)){var a=.5*(e+u),o=.5*(r+i),l=t.nodes;l[0]&&gr(n,l[0],e,r,a,o),l[1]&&gr(n,l[1],a,r,u,o),l[2]&&gr(n,l[2],e,o,a,i),l[3]&&gr(n,l[3],a,o,u,i)}}function pr(n,t,e,r,u,i,a){var o,l=1/0;return function c(n,s,f,h,g){if(!(s>i||f>a||r>h||u>g)){if(p=n.point){var p,v=t-n.x,d=e-n.y,m=v*v+d*d;if(l>m){var y=Math.sqrt(l=m);r=t-y,u=e-y,i=t+y,a=e+y,o=p}}for(var M=n.nodes,x=.5*(s+h),b=.5*(f+g),_=t>=x,w=e>=b,S=w<<1|_,k=S+4;k>S;++S)if(n=M[3&S])switch(3&S){case 0:c(n,s,f,x,b);break;case 1:c(n,x,f,h,b);break;case 2:c(n,s,b,x,g);break;case 3:c(n,x,b,h,g)}}}(n,r,u,i,a),o}function vr(n,t){n=oa.rgb(n),t=oa.rgb(t);var e=n.r,r=n.g,u=n.b,i=t.r-e,a=t.g-r,o=t.b-u;return function(n){return"#"+bn(Math.round(e+i*n))+bn(Math.round(r+a*n))+bn(Math.round(u+o*n))}}function dr(n,t){var e,r={},u={};for(e in n)e in t?r[e]=Mr(n[e],t[e]):u[e]=n[e];for(e in t)e in n||(u[e]=t[e]);return function(n){for(e in r)u[e]=r[e](n);return u}}function mr(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}function yr(n,t){var e,r,u,i=hl.lastIndex=gl.lastIndex=0,a=-1,o=[],l=[];for(n+="",t+="";(e=hl.exec(n))&&(r=gl.exec(t));)(u=r.index)>i&&(u=t.slice(i,u),o[a]?o[a]+=u:o[++a]=u),(e=e[0])===(r=r[0])?o[a]?o[a]+=r:o[++a]=r:(o[++a]=null,l.push({i:a,x:mr(e,r)})),i=gl.lastIndex;return i<t.length&&(u=t.slice(i),o[a]?o[a]+=u:o[++a]=u),o.length<2?l[0]?(t=l[0].x,function(n){return t(n)+""}):function(){return t}:(t=l.length,function(n){for(var e,r=0;t>r;++r)o[(e=l[r]).i]=e.x(n);return o.join("")})}function Mr(n,t){for(var e,r=oa.interpolators.length;--r>=0&&!(e=oa.interpolators[r](n,t)););return e}function xr(n,t){var e,r=[],u=[],i=n.length,a=t.length,o=Math.min(n.length,t.length);for(e=0;o>e;++e)r.push(Mr(n[e],t[e]));for(;i>e;++e)u[e]=n[e];for(;a>e;++e)u[e]=t[e];return function(n){for(e=0;o>e;++e)u[e]=r[e](n);return u}}function br(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function _r(n){return function(t){return 1-n(1-t)}}function wr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function Sr(n){return n*n}function kr(n){return n*n*n}function Nr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function Er(n){return function(t){return Math.pow(t,n)}}function Ar(n){return 1-Math.cos(n*Oa)}function Cr(n){return Math.pow(2,10*(n-1))}function zr(n){return 1-Math.sqrt(1-n*n)}function Lr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/Fa*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Fa/t)}}function qr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Tr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Rr(n,t){n=oa.hcl(n),t=oa.hcl(t);var e=n.h,r=n.c,u=n.l,i=t.h-e,a=t.c-r,o=t.l-u;return isNaN(a)&&(a=0,r=isNaN(r)?t.c:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return fn(e+i*n,r+a*n,u+o*n)+""}}function Dr(n,t){n=oa.hsl(n),t=oa.hsl(t);var e=n.h,r=n.s,u=n.l,i=t.h-e,a=t.s-r,o=t.l-u;return isNaN(a)&&(a=0,r=isNaN(r)?t.s:r),isNaN(i)?(i=0,e=isNaN(e)?t.h:e):i>180?i-=360:-180>i&&(i+=360),function(n){return cn(e+i*n,r+a*n,u+o*n)+""}}function Pr(n,t){n=oa.lab(n),t=oa.lab(t);var e=n.l,r=n.a,u=n.b,i=t.l-e,a=t.a-r,o=t.b-u;return function(n){return gn(e+i*n,r+a*n,u+o*n)+""}}function Ur(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function jr(n){var t=[n.a,n.b],e=[n.c,n.d],r=Hr(t),u=Fr(t,e),i=Hr(Or(e,t,-u))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,u*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Ya,this.translate=[n.e,n.f],this.scale=[r,i],this.skew=i?Math.atan2(u,i)*Ya:0}function Fr(n,t){return n[0]*t[0]+n[1]*t[1]}function Hr(n){var t=Math.sqrt(Fr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Or(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Ir(n){return n.length?n.pop()+",":""}function Yr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var u=e.push("translate(",null,",",null,")");r.push({i:u-4,x:mr(n[0],t[0])},{i:u-2,x:mr(n[1],t[1])})}else(t[0]||t[1])&&e.push("translate("+t+")")}function Zr(n,t,e,r){n!==t?(n-t>180?t+=360:t-n>180&&(n+=360),r.push({i:e.push(Ir(e)+"rotate(",null,")")-2,x:mr(n,t)})):t&&e.push(Ir(e)+"rotate("+t+")")}function Vr(n,t,e,r){n!==t?r.push({i:e.push(Ir(e)+"skewX(",null,")")-2,x:mr(n,t)}):t&&e.push(Ir(e)+"skewX("+t+")")}function Xr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var u=e.push(Ir(e)+"scale(",null,",",null,")");r.push({i:u-4,x:mr(n[0],t[0])},{i:u-2,x:mr(n[1],t[1])})}else(1!==t[0]||1!==t[1])&&e.push(Ir(e)+"scale("+t+")")}function $r(n,t){var e=[],r=[];return n=oa.transform(n),t=oa.transform(t),Yr(n.translate,t.translate,e,r),Zr(n.rotate,t.rotate,e,r),Vr(n.skew,t.skew,e,r),Xr(n.scale,t.scale,e,r),n=t=null,function(n){for(var t,u=-1,i=r.length;++u<i;)e[(t=r[u]).i]=t.x(n);return e.join("")}}function Br(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}function Wr(n,t){return t=(t-=n=+n)||1/t,function(e){return Math.max(0,Math.min(1,(e-n)/t))}}function Jr(n){for(var t=n.source,e=n.target,r=Kr(t,e),u=[t];t!==r;)t=t.parent,u.push(t);for(var i=u.length;e!==r;)u.splice(i,0,e),e=e.parent;return u}function Gr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Kr(n,t){if(n===t)return n;for(var e=Gr(n),r=Gr(t),u=e.pop(),i=r.pop(),a=null;u===i;)a=u,u=e.pop(),i=r.pop();return a}function Qr(n){n.fixed|=2}function nu(n){n.fixed&=-7}function tu(n){n.fixed|=4,n.px=n.x,n.py=n.y}function eu(n){n.fixed&=-5}function ru(n,t,e){var r=0,u=0;if(n.charge=0,!n.leaf)for(var i,a=n.nodes,o=a.length,l=-1;++l<o;)i=a[l],null!=i&&(ru(i,t,e),n.charge+=i.charge,r+=i.charge*i.cx,u+=i.charge*i.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var c=t*e[n.point.index];n.charge+=n.pointCharge=c,r+=c*n.point.x,u+=c*n.point.y}n.cx=r/n.charge,n.cy=u/n.charge}function uu(n,t){return oa.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=su,n}function iu(n,t){for(var e=[n];null!=(n=e.pop());)if(t(n),(u=n.children)&&(r=u.length))for(var r,u;--r>=0;)e.push(u[r])}function au(n,t){for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(i=n.children)&&(u=i.length))for(var u,i,a=-1;++a<u;)e.push(i[a]);for(;null!=(n=r.pop());)t(n)}function ou(n){return n.children}function lu(n){return n.value}function cu(n,t){return t.value-n.value}function su(n){return oa.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function fu(n){return n.x}function hu(n){return n.y}function gu(n,t,e){n.y0=t,n.y=e}function pu(n){return oa.range(n.length)}function vu(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function du(n){for(var t,e=1,r=0,u=n[0][1],i=n.length;i>e;++e)(t=n[e][1])>u&&(r=e,u=t);return r}function mu(n){return n.reduce(yu,0)}function yu(n,t){return n+t[1]}function Mu(n,t){return xu(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function xu(n,t){for(var e=-1,r=+n[0],u=(n[1]-r)/t,i=[];++e<=t;)i[e]=u*e+r;return i}function bu(n){return[oa.min(n),oa.max(n)]}function _u(n,t){return n.value-t.value}function wu(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Su(n,t){n._pack_next=t,t._pack_prev=n}function ku(n,t){var e=t.x-n.x,r=t.y-n.y,u=n.r+t.r;return.999*u*u>e*e+r*r}function Nu(n){function t(n){s=Math.min(n.x-n.r,s),f=Math.max(n.x+n.r,f),h=Math.min(n.y-n.r,h),g=Math.max(n.y+n.r,g)}if((e=n.children)&&(c=e.length)){var e,r,u,i,a,o,l,c,s=1/0,f=-(1/0),h=1/0,g=-(1/0);if(e.forEach(Eu),r=e[0],r.x=-r.r,r.y=0,t(r),c>1&&(u=e[1],u.x=u.r,u.y=0,t(u),c>2))for(i=e[2],zu(r,u,i),t(i),wu(r,i),r._pack_prev=i,wu(i,u),u=r._pack_next,a=3;c>a;a++){zu(r,u,i=e[a]);var p=0,v=1,d=1;for(o=u._pack_next;o!==u;o=o._pack_next,v++)if(ku(o,i)){p=1;break}if(1==p)for(l=r._pack_prev;l!==o._pack_prev&&!ku(l,i);l=l._pack_prev,d++);p?(d>v||v==d&&u.r<r.r?Su(r,u=o):Su(r=l,u),a--):(wu(r,i),u=i,t(i))}var m=(s+f)/2,y=(h+g)/2,M=0;for(a=0;c>a;a++)i=e[a],i.x-=m,i.y-=y,M=Math.max(M,i.r+Math.sqrt(i.x*i.x+i.y*i.y));n.r=M,e.forEach(Au)}}function Eu(n){n._pack_next=n._pack_prev=n}function Au(n){delete n._pack_next,delete n._pack_prev}function Cu(n,t,e,r){var u=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,u)for(var i=-1,a=u.length;++i<a;)Cu(u[i],t,e,r)}function zu(n,t,e){var r=n.r+e.r,u=t.x-n.x,i=t.y-n.y;if(r&&(u||i)){var a=t.r+e.r,o=u*u+i*i;a*=a,r*=r;var l=.5+(r-a)/(2*o),c=Math.sqrt(Math.max(0,2*a*(r+o)-(r-=o)*r-a*a))/(2*o);e.x=n.x+l*u+c*i,e.y=n.y+l*i-c*u}else e.x=n.x+r,e.y=n.y}function Lu(n,t){return n.parent==t.parent?1:2}function qu(n){var t=n.children;return t.length?t[0]:n.t}function Tu(n){var t,e=n.children;return(t=e.length)?e[t-1]:n.t}function Ru(n,t,e){var r=e/(t.i-n.i);t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function Du(n){for(var t,e=0,r=0,u=n.children,i=u.length;--i>=0;)t=u[i],t.z+=e,t.m+=e,e+=t.s+(r+=t.c)}function Pu(n,t,e){return n.a.parent===t.parent?n.a:e}function Uu(n){return 1+oa.max(n,function(n){return n.y})}function ju(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Fu(n){var t=n.children;return t&&t.length?Fu(t[0]):n}function Hu(n){var t,e=n.children;return e&&(t=e.length)?Hu(e[t-1]):n}function Ou(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Iu(n,t){var e=n.x+t[3],r=n.y+t[0],u=n.dx-t[1]-t[3],i=n.dy-t[0]-t[2];return 0>u&&(e+=u/2,u=0),0>i&&(r+=i/2,i=0),{x:e,y:r,dx:u,dy:i}}function Yu(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Zu(n){return n.rangeExtent?n.rangeExtent():Yu(n.range())}function Vu(n,t,e,r){var u=e(n[0],n[1]),i=r(t[0],t[1]);return function(n){return i(u(n))}}function Xu(n,t){var e,r=0,u=n.length-1,i=n[r],a=n[u];return i>a&&(e=r,r=u,u=e,e=i,i=a,a=e),n[r]=t.floor(i),n[u]=t.ceil(a),n}function $u(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:Sl}function Bu(n,t,e,r){var u=[],i=[],a=0,o=Math.min(n.length,t.length)-1;for(n[o]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++a<=o;)u.push(e(n[a-1],n[a])),i.push(r(t[a-1],t[a]));return function(t){var e=oa.bisect(n,t,1,o)-1;return i[e](u[e](t))}}function Wu(n,t,e,r){function u(){var u=Math.min(n.length,t.length)>2?Bu:Vu,l=r?Wr:Br;return a=u(n,t,l,e),o=u(t,n,l,Mr),i}function i(n){return a(n)}var a,o;return i.invert=function(n){return o(n)},i.domain=function(t){return arguments.length?(n=t.map(Number),u()):n},i.range=function(n){return arguments.length?(t=n,u()):t},i.rangeRound=function(n){return i.range(n).interpolate(Ur)},i.clamp=function(n){return arguments.length?(r=n,u()):r},i.interpolate=function(n){return arguments.length?(e=n,u()):e},i.ticks=function(t){return Qu(n,t)},i.tickFormat=function(t,e){return ni(n,t,e)},i.nice=function(t){return Gu(n,t),u()},i.copy=function(){return Wu(n,t,e,r)},u()}function Ju(n,t){return oa.rebind(n,t,"range","rangeRound","interpolate","clamp")}function Gu(n,t){return Xu(n,$u(Ku(n,t)[2])),Xu(n,$u(Ku(n,t)[2])),n}function Ku(n,t){null==t&&(t=10);var e=Yu(n),r=e[1]-e[0],u=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),i=t/r*u;return.15>=i?u*=10:.35>=i?u*=5:.75>=i&&(u*=2),e[0]=Math.ceil(e[0]/u)*u,e[1]=Math.floor(e[1]/u)*u+.5*u,e[2]=u,e}function Qu(n,t){return oa.range.apply(oa,Ku(n,t))}function ni(n,t,e){var r=Ku(n,t);if(e){var u=fo.exec(e);if(u.shift(),"s"===u[8]){var i=oa.formatPrefix(Math.max(Ma(r[0]),Ma(r[1])));return u[7]||(u[7]="."+ti(i.scale(r[2]))),u[8]="f",e=oa.format(u.join("")),function(n){return e(i.scale(n))+i.symbol}}u[7]||(u[7]="."+ei(u[8],r)),e=u.join("")}else e=",."+ti(r[2])+"f";return oa.format(e)}function ti(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function ei(n,t){var e=ti(t[2]);return n in kl?Math.abs(e-ti(Math.max(Ma(t[0]),Ma(t[1]))))+ +("e"!==n):e-2*("%"===n)}function ri(n,t,e,r){function u(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function i(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function a(t){return n(u(t))}return a.invert=function(t){return i(n.invert(t))},a.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(u)),a):r},a.base=function(e){return arguments.length?(t=+e,n.domain(r.map(u)),a):t},a.nice=function(){var t=Xu(r.map(u),e?Math:El);return n.domain(t),r=t.map(i),a},a.ticks=function(){var n=Yu(r),a=[],o=n[0],l=n[1],c=Math.floor(u(o)),s=Math.ceil(u(l)),f=t%1?2:t;if(isFinite(s-c)){if(e){for(;s>c;c++)for(var h=1;f>h;h++)a.push(i(c)*h);a.push(i(c))}else for(a.push(i(c));c++<s;)for(var h=f-1;h>0;h--)a.push(i(c)*h);for(c=0;a[c]<o;c++);for(s=a.length;a[s-1]>l;s--);a=a.slice(c,s)}return a},a.tickFormat=function(n,e){if(!arguments.length)return Nl;arguments.length<2?e=Nl:"function"!=typeof e&&(e=oa.format(e));var r=Math.max(1,t*n/a.ticks().length);return function(n){var a=n/i(Math.round(u(n)));return t-.5>a*t&&(a*=t),r>=a?e(n):""}},a.copy=function(){return ri(n.copy(),t,e,r)},Ju(a,n)}function ui(n,t,e){function r(t){return n(u(t))}var u=ii(t),i=ii(1/t);return r.invert=function(t){return i(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(u)),r):e},r.ticks=function(n){return Qu(e,n)},r.tickFormat=function(n,t){return ni(e,n,t)},r.nice=function(n){return r.domain(Gu(e,n))},r.exponent=function(a){return arguments.length?(u=ii(t=a),i=ii(1/t),n.domain(e.map(u)),r):t},r.copy=function(){return ui(n.copy(),t,e)},Ju(r,n)}function ii(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function ai(n,t){function e(e){return i[((u.get(e)||("range"===t.t?u.set(e,n.push(e)):NaN))-1)%i.length]}function r(t,e){return oa.range(n.length).map(function(n){return t+e*n})}var u,i,a;return e.domain=function(r){if(!arguments.length)return n;n=[],u=new c;for(var i,a=-1,o=r.length;++a<o;)u.has(i=r[a])||u.set(i,n.push(i));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(i=n,a=0,t={t:"range",a:arguments},e):i},e.rangePoints=function(u,o){arguments.length<2&&(o=0);var l=u[0],c=u[1],s=n.length<2?(l=(l+c)/2,0):(c-l)/(n.length-1+o);return i=r(l+s*o/2,s),a=0,t={t:"rangePoints",a:arguments},e},e.rangeRoundPoints=function(u,o){arguments.length<2&&(o=0);var l=u[0],c=u[1],s=n.length<2?(l=c=Math.round((l+c)/2),0):(c-l)/(n.length-1+o)|0;return i=r(l+Math.round(s*o/2+(c-l-(n.length-1+o)*s)/2),s),a=0,t={t:"rangeRoundPoints",a:arguments},e},e.rangeBands=function(u,o,l){arguments.length<2&&(o=0),arguments.length<3&&(l=o);var c=u[1]<u[0],s=u[c-0],f=u[1-c],h=(f-s)/(n.length-o+2*l);return i=r(s+h*l,h),c&&i.reverse(),a=h*(1-o),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(u,o,l){arguments.length<2&&(o=0),arguments.length<3&&(l=o);var c=u[1]<u[0],s=u[c-0],f=u[1-c],h=Math.floor((f-s)/(n.length-o+2*l));return i=r(s+Math.round((f-s-(n.length-o)*h)/2),h),c&&i.reverse(),a=Math.round(h*(1-o)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return a},e.rangeExtent=function(){return Yu(t.a[0])},e.copy=function(){return ai(n,t)},e.domain(n)}function oi(n,t){function i(){var e=0,r=t.length;for(o=[];++e<r;)o[e-1]=oa.quantile(n,e/r);return a}function a(n){return isNaN(n=+n)?void 0:t[oa.bisect(o,n)]}var o;return a.domain=function(t){return arguments.length?(n=t.map(r).filter(u).sort(e),i()):n},a.range=function(n){return arguments.length?(t=n,i()):t},a.quantiles=function(){return o},a.invertExtent=function(e){return e=t.indexOf(e),0>e?[NaN,NaN]:[e>0?o[e-1]:n[0],e<o.length?o[e]:n[n.length-1]]},a.copy=function(){return oi(n,t)},i()}function li(n,t,e){function r(t){return e[Math.max(0,Math.min(a,Math.floor(i*(t-n))))]}function u(){return i=e.length/(t-n),a=e.length-1,r}var i,a;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],u()):[n,t]},r.range=function(n){return arguments.length?(e=n,u()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?NaN:t/i+n,[t,t+1/i]},r.copy=function(){return li(n,t,e)},u()}function ci(n,t){function e(e){return e>=e?t[oa.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return ci(n,t)},e}function si(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return Qu(n,t)},t.tickFormat=function(t,e){return ni(n,t,e)},t.copy=function(){return si(n)},t}function fi(){return 0}function hi(n){return n.innerRadius}function gi(n){return n.outerRadius}function pi(n){return n.startAngle}function vi(n){return n.endAngle}function di(n){return n&&n.padAngle}function mi(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}function yi(n,t,e,r,u){var i=n[0]-t[0],a=n[1]-t[1],o=(u?r:-r)/Math.sqrt(i*i+a*a),l=o*a,c=-o*i,s=n[0]+l,f=n[1]+c,h=t[0]+l,g=t[1]+c,p=(s+h)/2,v=(f+g)/2,d=h-s,m=g-f,y=d*d+m*m,M=e-r,x=s*g-h*f,b=(0>m?-1:1)*Math.sqrt(Math.max(0,M*M*y-x*x)),_=(x*m-d*b)/y,w=(-x*d-m*b)/y,S=(x*m+d*b)/y,k=(-x*d+m*b)/y,N=_-p,E=w-v,A=S-p,C=k-v;return N*N+E*E>A*A+C*C&&(_=S,w=k),[[_-l,w-c],[_*e/M,w*e/M]]}function Mi(n){function t(t){function a(){c.push("M",i(n(s),o))}for(var l,c=[],s=[],f=-1,h=t.length,g=En(e),p=En(r);++f<h;)u.call(this,l=t[f],f)?s.push([+g.call(this,l,f),+p.call(this,l,f)]):s.length&&(a(),s=[]);return s.length&&a(),c.length?c.join(""):null}var e=Ce,r=ze,u=zt,i=xi,a=i.key,o=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(u=n,t):u},t.interpolate=function(n){return arguments.length?(a="function"==typeof n?i=n:(i=Tl.get(n)||xi).key,t):a},t.tension=function(n){return arguments.length?(o=n,t):o},t}function xi(n){return n.length>1?n.join("L"):n+"Z"}function bi(n){return n.join("L")+"Z"}function _i(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&u.push("H",r[0]),u.join("")}function wi(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("V",(r=n[t])[1],"H",r[0]);return u.join("")}function Si(n){for(var t=0,e=n.length,r=n[0],u=[r[0],",",r[1]];++t<e;)u.push("H",(r=n[t])[0],"V",r[1]);return u.join("")}function ki(n,t){return n.length<4?xi(n):n[1]+Ai(n.slice(1,-1),Ci(n,t))}function Ni(n,t){return n.length<3?bi(n):n[0]+Ai((n.push(n[0]),n),Ci([n[n.length-2]].concat(n,[n[1]]),t))}function Ei(n,t){return n.length<3?xi(n):n[0]+Ai(n,Ci(n,t))}function Ai(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return xi(n);var e=n.length!=t.length,r="",u=n[0],i=n[1],a=t[0],o=a,l=1;if(e&&(r+="Q"+(i[0]-2*a[0]/3)+","+(i[1]-2*a[1]/3)+","+i[0]+","+i[1],u=n[1],l=2),t.length>1){o=t[1],i=n[l],l++,r+="C"+(u[0]+a[0])+","+(u[1]+a[1])+","+(i[0]-o[0])+","+(i[1]-o[1])+","+i[0]+","+i[1];for(var c=2;c<t.length;c++,l++)i=n[l],o=t[c],r+="S"+(i[0]-o[0])+","+(i[1]-o[1])+","+i[0]+","+i[1]}if(e){var s=n[l];r+="Q"+(i[0]+2*o[0]/3)+","+(i[1]+2*o[1]/3)+","+s[0]+","+s[1]}return r}function Ci(n,t){for(var e,r=[],u=(1-t)/2,i=n[0],a=n[1],o=1,l=n.length;++o<l;)e=i,i=a,a=n[o],r.push([u*(a[0]-e[0]),u*(a[1]-e[1])]);return r}function zi(n){if(n.length<3)return xi(n);var t=1,e=n.length,r=n[0],u=r[0],i=r[1],a=[u,u,u,(r=n[1])[0]],o=[i,i,i,r[1]],l=[u,",",i,"L",Ri(Pl,a),",",Ri(Pl,o)];for(n.push(n[e-1]);++t<=e;)r=n[t],a.shift(),a.push(r[0]),o.shift(),o.push(r[1]),Di(l,a,o);return n.pop(),l.push("L",r),l.join("")}function Li(n){if(n.length<4)return xi(n);for(var t,e=[],r=-1,u=n.length,i=[0],a=[0];++r<3;)t=n[r],i.push(t[0]),a.push(t[1]);for(e.push(Ri(Pl,i)+","+Ri(Pl,a)),--r;++r<u;)t=n[r],i.shift(),i.push(t[0]),a.shift(),a.push(t[1]),Di(e,i,a);return e.join("")}function qi(n){for(var t,e,r=-1,u=n.length,i=u+4,a=[],o=[];++r<4;)e=n[r%u],a.push(e[0]),o.push(e[1]);for(t=[Ri(Pl,a),",",Ri(Pl,o)],--r;++r<i;)e=n[r%u],a.shift(),a.push(e[0]),o.shift(),o.push(e[1]),Di(t,a,o);return t.join("")}function Ti(n,t){var e=n.length-1;if(e)for(var r,u,i=n[0][0],a=n[0][1],o=n[e][0]-i,l=n[e][1]-a,c=-1;++c<=e;)r=n[c],u=c/e,r[0]=t*r[0]+(1-t)*(i+u*o),r[1]=t*r[1]+(1-t)*(a+u*l);return zi(n)}function Ri(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Di(n,t,e){n.push("C",Ri(Rl,t),",",Ri(Rl,e),",",Ri(Dl,t),",",Ri(Dl,e),",",Ri(Pl,t),",",Ri(Pl,e))}function Pi(n,t){return(t[1]-n[1])/(t[0]-n[0])}function Ui(n){for(var t=0,e=n.length-1,r=[],u=n[0],i=n[1],a=r[0]=Pi(u,i);++t<e;)r[t]=(a+(a=Pi(u=i,i=n[t+1])))/2;return r[t]=a,r}function ji(n){for(var t,e,r,u,i=[],a=Ui(n),o=-1,l=n.length-1;++o<l;)t=Pi(n[o],n[o+1]),Ma(t)<Pa?a[o]=a[o+1]=0:(e=a[o]/t,r=a[o+1]/t,u=e*e+r*r,u>9&&(u=3*t/Math.sqrt(u),a[o]=u*e,a[o+1]=u*r));for(o=-1;++o<=l;)u=(n[Math.min(l,o+1)][0]-n[Math.max(0,o-1)][0])/(6*(1+a[o]*a[o])),i.push([u||0,a[o]*u||0]);return i}function Fi(n){return n.length<3?xi(n):n[0]+Ai(n,ji(n))}function Hi(n){for(var t,e,r,u=-1,i=n.length;++u<i;)t=n[u],e=t[0],r=t[1]-Oa,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Oi(n){function t(t){function l(){v.push("M",o(n(m),f),s,c(n(d.reverse()),f),"Z")}for(var h,g,p,v=[],d=[],m=[],y=-1,M=t.length,x=En(e),b=En(u),_=e===r?function(){
	return g}:En(r),w=u===i?function(){return p}:En(i);++y<M;)a.call(this,h=t[y],y)?(d.push([g=+x.call(this,h,y),p=+b.call(this,h,y)]),m.push([+_.call(this,h,y),+w.call(this,h,y)])):d.length&&(l(),d=[],m=[]);return d.length&&l(),v.length?v.join(""):null}var e=Ce,r=Ce,u=0,i=ze,a=zt,o=xi,l=o.key,c=o,s="L",f=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(u=i=n,t):i},t.y0=function(n){return arguments.length?(u=n,t):u},t.y1=function(n){return arguments.length?(i=n,t):i},t.defined=function(n){return arguments.length?(a=n,t):a},t.interpolate=function(n){return arguments.length?(l="function"==typeof n?o=n:(o=Tl.get(n)||xi).key,c=o.reverse||o,s=o.closed?"M":"L",t):l},t.tension=function(n){return arguments.length?(f=n,t):f},t}function Ii(n){return n.radius}function Yi(n){return[n.x,n.y]}function Zi(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]-Oa;return[e*Math.cos(r),e*Math.sin(r)]}}function Vi(){return 64}function Xi(){return"circle"}function $i(n){var t=Math.sqrt(n/ja);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Bi(n){return function(){var t,e,r;(t=this[n])&&(r=t[e=t.active])&&(r.timer.c=null,r.timer.t=NaN,--t.count?delete t[e]:delete this[n],t.active+=.5,r.event&&r.event.interrupt.call(this,this.__data__,r.index))}}function Wi(n,t,e){return Sa(n,Yl),n.namespace=t,n.id=e,n}function Ji(n,t,e,r){var u=n.id,i=n.namespace;return Y(n,"function"==typeof e?function(n,a,o){n[i][u].tween.set(t,r(e.call(n,n.__data__,a,o)))}:(e=r(e),function(n){n[i][u].tween.set(t,e)}))}function Gi(n){return null==n&&(n=""),function(){this.textContent=n}}function Ki(n){return null==n?"__transition__":"__transition_"+n+"__"}function Qi(n,t,e,r,u){function i(n){var t=v.delay;return s.t=t+l,n>=t?a(n-t):void(s.c=a)}function a(e){var u=p.active,i=p[u];i&&(i.timer.c=null,i.timer.t=NaN,--p.count,delete p[u],i.event&&i.event.interrupt.call(n,n.__data__,i.index));for(var a in p)if(r>+a){var c=p[a];c.timer.c=null,c.timer.t=NaN,--p.count,delete p[a]}s.c=o,qn(function(){return s.c&&o(e||1)&&(s.c=null,s.t=NaN),1},0,l),p.active=r,v.event&&v.event.start.call(n,n.__data__,t),g=[],v.tween.forEach(function(e,r){(r=r.call(n,n.__data__,t))&&g.push(r)}),h=v.ease,f=v.duration}function o(u){for(var i=u/f,a=h(i),o=g.length;o>0;)g[--o].call(n,a);return i>=1?(v.event&&v.event.end.call(n,n.__data__,t),--p.count?delete p[r]:delete n[e],1):void 0}var l,s,f,h,g,p=n[e]||(n[e]={active:0,count:0}),v=p[r];v||(l=u.time,s=qn(i,0,l),v=p[r]={tween:new c,time:l,timer:s,delay:u.delay,duration:u.duration,ease:u.ease,index:t},u=null,++p.count)}function na(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate("+(isFinite(r)?r:e(n))+",0)"})}function ta(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate(0,"+(isFinite(r)?r:e(n))+")"})}function ea(n){return n.toISOString()}function ra(n,t,e){function r(t){return n(t)}function u(n,e){var r=n[1]-n[0],u=r/e,i=oa.bisect(Kl,u);return i==Kl.length?[t.year,Ku(n.map(function(n){return n/31536e6}),e)[2]]:i?t[u/Kl[i-1]<Kl[i]/u?i-1:i]:[tc,Ku(n,e)[2]]}return r.invert=function(t){return ua(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(ua)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,ua(+e+1),t).length}var i=r.domain(),a=Yu(i),o=null==n?u(a,10):"number"==typeof n&&u(a,n);return o&&(n=o[0],t=o[1]),r.domain(Xu(i,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=ua(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=ua(+t+1);return t}}:n))},r.ticks=function(n,t){var e=Yu(r.domain()),i=null==n?u(e,10):"number"==typeof n?u(e,n):!n.range&&[{range:n},t];return i&&(n=i[0],t=i[1]),n.range(e[0],ua(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return ra(n.copy(),t,e)},Ju(r,n)}function ua(n){return new Date(n)}function ia(n){return JSON.parse(n.responseText)}function aa(n){var t=sa.createRange();return t.selectNode(sa.body),t.createContextualFragment(n.responseText)}var oa={version:"3.5.16"},la=[].slice,ca=function(n){return la.call(n)},sa=this.document;if(sa)try{ca(sa.documentElement.childNodes)[0].nodeType}catch(fa){ca=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}if(Date.now||(Date.now=function(){return+new Date}),sa)try{sa.createElement("DIV").style.setProperty("opacity",0,"")}catch(ha){var ga=this.Element.prototype,pa=ga.setAttribute,va=ga.setAttributeNS,da=this.CSSStyleDeclaration.prototype,ma=da.setProperty;ga.setAttribute=function(n,t){pa.call(this,n,t+"")},ga.setAttributeNS=function(n,t,e){va.call(this,n,t,e+"")},da.setProperty=function(n,t,e){ma.call(this,n,t+"",e)}}oa.ascending=e,oa.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:NaN},oa.min=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i;)if(null!=(r=n[u])&&r>=r){e=r;break}for(;++u<i;)null!=(r=n[u])&&e>r&&(e=r)}else{for(;++u<i;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=r;break}for(;++u<i;)null!=(r=t.call(n,n[u],u))&&e>r&&(e=r)}return e},oa.max=function(n,t){var e,r,u=-1,i=n.length;if(1===arguments.length){for(;++u<i;)if(null!=(r=n[u])&&r>=r){e=r;break}for(;++u<i;)null!=(r=n[u])&&r>e&&(e=r)}else{for(;++u<i;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=r;break}for(;++u<i;)null!=(r=t.call(n,n[u],u))&&r>e&&(e=r)}return e},oa.extent=function(n,t){var e,r,u,i=-1,a=n.length;if(1===arguments.length){for(;++i<a;)if(null!=(r=n[i])&&r>=r){e=u=r;break}for(;++i<a;)null!=(r=n[i])&&(e>r&&(e=r),r>u&&(u=r))}else{for(;++i<a;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=u=r;break}for(;++i<a;)null!=(r=t.call(n,n[i],i))&&(e>r&&(e=r),r>u&&(u=r))}return[e,u]},oa.sum=function(n,t){var e,r=0,i=n.length,a=-1;if(1===arguments.length)for(;++a<i;)u(e=+n[a])&&(r+=e);else for(;++a<i;)u(e=+t.call(n,n[a],a))&&(r+=e);return r},oa.mean=function(n,t){var e,i=0,a=n.length,o=-1,l=a;if(1===arguments.length)for(;++o<a;)u(e=r(n[o]))?i+=e:--l;else for(;++o<a;)u(e=r(t.call(n,n[o],o)))?i+=e:--l;return l?i/l:void 0},oa.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),u=+n[r-1],i=e-r;return i?u+i*(n[r]-u):u},oa.median=function(n,t){var i,a=[],o=n.length,l=-1;if(1===arguments.length)for(;++l<o;)u(i=r(n[l]))&&a.push(i);else for(;++l<o;)u(i=r(t.call(n,n[l],l)))&&a.push(i);return a.length?oa.quantile(a.sort(e),.5):void 0},oa.variance=function(n,t){var e,i,a=n.length,o=0,l=0,c=-1,s=0;if(1===arguments.length)for(;++c<a;)u(e=r(n[c]))&&(i=e-o,o+=i/++s,l+=i*(e-o));else for(;++c<a;)u(e=r(t.call(n,n[c],c)))&&(i=e-o,o+=i/++s,l+=i*(e-o));return s>1?l/(s-1):void 0},oa.deviation=function(){var n=oa.variance.apply(this,arguments);return n?Math.sqrt(n):n};var ya=i(e);oa.bisectLeft=ya.left,oa.bisect=oa.bisectRight=ya.right,oa.bisector=function(n){return i(1===n.length?function(t,r){return e(n(t),r)}:n)},oa.shuffle=function(n,t,e){(i=arguments.length)<3&&(e=n.length,2>i&&(t=0));for(var r,u,i=e-t;i;)u=Math.random()*i--|0,r=n[i+t],n[i+t]=n[u+t],n[u+t]=r;return n},oa.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},oa.pairs=function(n){for(var t,e=0,r=n.length-1,u=n[0],i=new Array(0>r?0:r);r>e;)i[e]=[t=u,u=n[++e]];return i},oa.transpose=function(n){if(!(u=n.length))return[];for(var t=-1,e=oa.min(n,a),r=new Array(e);++t<e;)for(var u,i=-1,o=r[t]=new Array(u);++i<u;)o[i]=n[i][t];return r},oa.zip=function(){return oa.transpose(arguments)},oa.keys=function(n){var t=[];for(var e in n)t.push(e);return t},oa.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},oa.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},oa.merge=function(n){for(var t,e,r,u=n.length,i=-1,a=0;++i<u;)a+=n[i].length;for(e=new Array(a);--u>=0;)for(r=n[u],t=r.length;--t>=0;)e[--a]=r[t];return e};var Ma=Math.abs;oa.range=function(n,t,e){if(arguments.length<3&&(e=1,arguments.length<2&&(t=n,n=0)),(t-n)/e===1/0)throw new Error("infinite range");var r,u=[],i=o(Ma(e)),a=-1;if(n*=i,t*=i,e*=i,0>e)for(;(r=n+e*++a)>t;)u.push(r/i);else for(;(r=n+e*++a)<t;)u.push(r/i);return u},oa.map=function(n,t){var e=new c;if(n instanceof c)n.forEach(function(n,t){e.set(n,t)});else if(Array.isArray(n)){var r,u=-1,i=n.length;if(1===arguments.length)for(;++u<i;)e.set(u,n[u]);else for(;++u<i;)e.set(t.call(n,r=n[u],u),r)}else for(var a in n)e.set(a,n[a]);return e};var xa="__proto__",ba="\x00";l(c,{has:h,get:function(n){return this._[s(n)]},set:function(n,t){return this._[s(n)]=t},remove:g,keys:p,values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:f(t),value:this._[t]});return n},size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,f(t),this._[t])}}),oa.nest=function(){function n(t,a,o){if(o>=i.length)return r?r.call(u,a):e?a.sort(e):a;for(var l,s,f,h,g=-1,p=a.length,v=i[o++],d=new c;++g<p;)(h=d.get(l=v(s=a[g])))?h.push(s):d.set(l,[s]);return t?(s=t(),f=function(e,r){s.set(e,n(t,r,o))}):(s={},f=function(e,r){s[e]=n(t,r,o)}),d.forEach(f),s}function t(n,e){if(e>=i.length)return n;var r=[],u=a[e++];return n.forEach(function(n,u){r.push({key:n,values:t(u,e)})}),u?r.sort(function(n,t){return u(n.key,t.key)}):r}var e,r,u={},i=[],a=[];return u.map=function(t,e){return n(e,t,0)},u.entries=function(e){return t(n(oa.map,e,0),0)},u.key=function(n){return i.push(n),u},u.sortKeys=function(n){return a[i.length-1]=n,u},u.sortValues=function(n){return e=n,u},u.rollup=function(n){return r=n,u},u},oa.set=function(n){var t=new m;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},l(m,{has:h,add:function(n){return this._[s(n+="")]=!0,n},remove:g,values:p,size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,f(t))}}),oa.behavior={},oa.rebind=function(n,t){for(var e,r=1,u=arguments.length;++r<u;)n[e=arguments[r]]=M(n,t,t[e]);return n};var _a=["webkit","ms","moz","Moz","o","O"];oa.dispatch=function(){for(var n=new _,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=w(n);return n},_.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.slice(e+1),n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},oa.event=null,oa.requote=function(n){return n.replace(wa,"\\$&")};var wa=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,Sa={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},ka=function(n,t){return t.querySelector(n)},Na=function(n,t){return t.querySelectorAll(n)},Ea=function(n,t){var e=n.matches||n[x(n,"matchesSelector")];return(Ea=function(n,t){return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(ka=function(n,t){return Sizzle(n,t)[0]||null},Na=Sizzle,Ea=Sizzle.matchesSelector),oa.selection=function(){return oa.select(sa.documentElement)};var Aa=oa.selection.prototype=[];Aa.select=function(n){var t,e,r,u,i=[];n=A(n);for(var a=-1,o=this.length;++a<o;){i.push(t=[]),t.parentNode=(r=this[a]).parentNode;for(var l=-1,c=r.length;++l<c;)(u=r[l])?(t.push(e=n.call(u,u.__data__,l,a)),e&&"__data__"in u&&(e.__data__=u.__data__)):t.push(null)}return E(i)},Aa.selectAll=function(n){var t,e,r=[];n=C(n);for(var u=-1,i=this.length;++u<i;)for(var a=this[u],o=-1,l=a.length;++o<l;)(e=a[o])&&(r.push(t=ca(n.call(e,e.__data__,o,u))),t.parentNode=e);return E(r)};var Ca="http://www.w3.org/1999/xhtml",za={svg:"http://www.w3.org/2000/svg",xhtml:Ca,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};oa.ns={prefix:za,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&"xmlns"!==(e=n.slice(0,t))&&(n=n.slice(t+1)),za.hasOwnProperty(e)?{space:za[e],local:n}:n}},Aa.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=oa.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(z(t,n[t]));return this}return this.each(z(n,t))},Aa.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=T(n)).length,u=-1;if(t=e.classList){for(;++u<r;)if(!t.contains(n[u]))return!1}else for(t=e.getAttribute("class");++u<r;)if(!q(n[u]).test(t))return!1;return!0}for(t in n)this.each(R(t,n[t]));return this}return this.each(R(n,t))},Aa.style=function(n,e,r){var u=arguments.length;if(3>u){if("string"!=typeof n){2>u&&(e="");for(r in n)this.each(P(r,n[r],e));return this}if(2>u){var i=this.node();return t(i).getComputedStyle(i,null).getPropertyValue(n)}r=""}return this.each(P(n,e,r))},Aa.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(U(t,n[t]));return this}return this.each(U(n,t))},Aa.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Aa.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Aa.append=function(n){return n=j(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Aa.insert=function(n,t){return n=j(n),t=A(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},Aa.remove=function(){return this.each(F)},Aa.data=function(n,t){function e(n,e){var r,u,i,a=n.length,f=e.length,h=Math.min(a,f),g=new Array(f),p=new Array(f),v=new Array(a);if(t){var d,m=new c,y=new Array(a);for(r=-1;++r<a;)(u=n[r])&&(m.has(d=t.call(u,u.__data__,r))?v[r]=u:m.set(d,u),y[r]=d);for(r=-1;++r<f;)(u=m.get(d=t.call(e,i=e[r],r)))?u!==!0&&(g[r]=u,u.__data__=i):p[r]=H(i),m.set(d,!0);for(r=-1;++r<a;)r in y&&m.get(y[r])!==!0&&(v[r]=n[r])}else{for(r=-1;++r<h;)u=n[r],i=e[r],u?(u.__data__=i,g[r]=u):p[r]=H(i);for(;f>r;++r)p[r]=H(e[r]);for(;a>r;++r)v[r]=n[r]}p.update=g,p.parentNode=g.parentNode=v.parentNode=n.parentNode,o.push(p),l.push(g),s.push(v)}var r,u,i=-1,a=this.length;if(!arguments.length){for(n=new Array(a=(r=this[0]).length);++i<a;)(u=r[i])&&(n[i]=u.__data__);return n}var o=Z([]),l=E([]),s=E([]);if("function"==typeof n)for(;++i<a;)e(r=this[i],n.call(r,r.parentNode.__data__,i));else for(;++i<a;)e(r=this[i],n);return l.enter=function(){return o},l.exit=function(){return s},l},Aa.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Aa.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=O(n));for(var i=0,a=this.length;a>i;i++){u.push(t=[]),t.parentNode=(e=this[i]).parentNode;for(var o=0,l=e.length;l>o;o++)(r=e[o])&&n.call(r,r.__data__,o,i)&&t.push(r)}return E(u)},Aa.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],u=r.length-1,i=r[u];--u>=0;)(e=r[u])&&(i&&i!==e.nextSibling&&i.parentNode.insertBefore(e,i),i=e);return this},Aa.sort=function(n){n=I.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Aa.each=function(n){return Y(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Aa.call=function(n){var t=ca(arguments);return n.apply(t[0]=this,t),this},Aa.empty=function(){return!this.node()},Aa.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,u=e.length;u>r;r++){var i=e[r];if(i)return i}return null},Aa.size=function(){var n=0;return Y(this,function(){++n}),n};var La=[];oa.selection.enter=Z,oa.selection.enter.prototype=La,La.append=Aa.append,La.empty=Aa.empty,La.node=Aa.node,La.call=Aa.call,La.size=Aa.size,La.select=function(n){for(var t,e,r,u,i,a=[],o=-1,l=this.length;++o<l;){r=(u=this[o]).update,a.push(t=[]),t.parentNode=u.parentNode;for(var c=-1,s=u.length;++c<s;)(i=u[c])?(t.push(r[c]=e=n.call(u.parentNode,i.__data__,c,o)),e.__data__=i.__data__):t.push(null)}return E(a)},La.insert=function(n,t){return arguments.length<2&&(t=V(this)),Aa.insert.call(this,n,t)},oa.select=function(t){var e;return"string"==typeof t?(e=[ka(t,sa)],e.parentNode=sa.documentElement):(e=[t],e.parentNode=n(t)),E([e])},oa.selectAll=function(n){var t;return"string"==typeof n?(t=ca(Na(n,sa)),t.parentNode=sa.documentElement):(t=ca(n),t.parentNode=null),E([t])},Aa.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(X(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(X(n,t,e))};var qa=oa.map({mouseenter:"mouseover",mouseleave:"mouseout"});sa&&qa.forEach(function(n){"on"+n in sa&&qa.remove(n)});var Ta,Ra=0;oa.mouse=function(n){return J(n,k())};var Da=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0;oa.touch=function(n,t,e){if(arguments.length<3&&(e=t,t=k().changedTouches),t)for(var r,u=0,i=t.length;i>u;++u)if((r=t[u]).identifier===e)return J(n,r)},oa.behavior.drag=function(){function n(){this.on("mousedown.drag",i).on("touchstart.drag",a)}function e(n,t,e,i,a){return function(){function o(){var n,e,r=t(h,v);r&&(n=r[0]-M[0],e=r[1]-M[1],p|=n|e,M=r,g({type:"drag",x:r[0]+c[0],y:r[1]+c[1],dx:n,dy:e}))}function l(){t(h,v)&&(m.on(i+d,null).on(a+d,null),y(p),g({type:"dragend"}))}var c,s=this,f=oa.event.target.correspondingElement||oa.event.target,h=s.parentNode,g=r.of(s,arguments),p=0,v=n(),d=".drag"+(null==v?"":"-"+v),m=oa.select(e(f)).on(i+d,o).on(a+d,l),y=W(f),M=t(h,v);u?(c=u.apply(s,arguments),c=[c.x-M[0],c.y-M[1]]):c=[0,0],g({type:"dragstart"})}}var r=N(n,"drag","dragstart","dragend"),u=null,i=e(b,oa.mouse,t,"mousemove","mouseup"),a=e(G,oa.touch,y,"touchmove","touchend");return n.origin=function(t){return arguments.length?(u=t,n):u},oa.rebind(n,r,"on")},oa.touches=function(n,t){return arguments.length<2&&(t=k().touches),t?ca(t).map(function(t){var e=J(n,t);return e.identifier=t.identifier,e}):[]};var Pa=1e-6,Ua=Pa*Pa,ja=Math.PI,Fa=2*ja,Ha=Fa-Pa,Oa=ja/2,Ia=ja/180,Ya=180/ja,Za=Math.SQRT2,Va=2,Xa=4;oa.interpolateZoom=function(n,t){var e,r,u=n[0],i=n[1],a=n[2],o=t[0],l=t[1],c=t[2],s=o-u,f=l-i,h=s*s+f*f;if(Ua>h)r=Math.log(c/a)/Za,e=function(n){return[u+n*s,i+n*f,a*Math.exp(Za*n*r)]};else{var g=Math.sqrt(h),p=(c*c-a*a+Xa*h)/(2*a*Va*g),v=(c*c-a*a-Xa*h)/(2*c*Va*g),d=Math.log(Math.sqrt(p*p+1)-p),m=Math.log(Math.sqrt(v*v+1)-v);r=(m-d)/Za,e=function(n){var t=n*r,e=rn(d),o=a/(Va*g)*(e*un(Za*t+d)-en(d));return[u+o*s,i+o*f,a*e/rn(Za*t+d)]}}return e.duration=1e3*r,e},oa.behavior.zoom=function(){function n(n){n.on(L,f).on(Ba+".zoom",g).on("dblclick.zoom",p).on(R,h)}function e(n){return[(n[0]-k.x)/k.k,(n[1]-k.y)/k.k]}function r(n){return[n[0]*k.k+k.x,n[1]*k.k+k.y]}function u(n){k.k=Math.max(A[0],Math.min(A[1],n))}function i(n,t){t=r(t),k.x+=n[0]-t[0],k.y+=n[1]-t[1]}function a(t,e,r,a){t.__chart__={x:k.x,y:k.y,k:k.k},u(Math.pow(2,a)),i(d=e,r),t=oa.select(t),C>0&&(t=t.transition().duration(C)),t.call(n.event)}function o(){b&&b.domain(x.range().map(function(n){return(n-k.x)/k.k}).map(x.invert)),w&&w.domain(_.range().map(function(n){return(n-k.y)/k.k}).map(_.invert))}function l(n){z++||n({type:"zoomstart"})}function c(n){o(),n({type:"zoom",scale:k.k,translate:[k.x,k.y]})}function s(n){--z||(n({type:"zoomend"}),d=null)}function f(){function n(){o=1,i(oa.mouse(u),h),c(a)}function r(){f.on(q,null).on(T,null),g(o),s(a)}var u=this,a=D.of(u,arguments),o=0,f=oa.select(t(u)).on(q,n).on(T,r),h=e(oa.mouse(u)),g=W(u);Il.call(u),l(a)}function h(){function n(){var n=oa.touches(p);return g=k.k,n.forEach(function(n){n.identifier in d&&(d[n.identifier]=e(n))}),n}function t(){var t=oa.event.target;oa.select(t).on(x,r).on(b,o),_.push(t);for(var e=oa.event.changedTouches,u=0,i=e.length;i>u;++u)d[e[u].identifier]=null;var l=n(),c=Date.now();if(1===l.length){if(500>c-M){var s=l[0];a(p,s,d[s.identifier],Math.floor(Math.log(k.k)/Math.LN2)+1),S()}M=c}else if(l.length>1){var s=l[0],f=l[1],h=s[0]-f[0],g=s[1]-f[1];m=h*h+g*g}}function r(){var n,t,e,r,a=oa.touches(p);Il.call(p);for(var o=0,l=a.length;l>o;++o,r=null)if(e=a[o],r=d[e.identifier]){if(t)break;n=e,t=r}if(r){var s=(s=e[0]-n[0])*s+(s=e[1]-n[1])*s,f=m&&Math.sqrt(s/m);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+r[0])/2,(t[1]+r[1])/2],u(f*g)}M=null,i(n,t),c(v)}function o(){if(oa.event.touches.length){for(var t=oa.event.changedTouches,e=0,r=t.length;r>e;++e)delete d[t[e].identifier];for(var u in d)return void n()}oa.selectAll(_).on(y,null),w.on(L,f).on(R,h),N(),s(v)}var g,p=this,v=D.of(p,arguments),d={},m=0,y=".zoom-"+oa.event.changedTouches[0].identifier,x="touchmove"+y,b="touchend"+y,_=[],w=oa.select(p),N=W(p);t(),l(v),w.on(L,null).on(R,t)}function g(){var n=D.of(this,arguments);y?clearTimeout(y):(Il.call(this),v=e(d=m||oa.mouse(this)),l(n)),y=setTimeout(function(){y=null,s(n)},50),S(),u(Math.pow(2,.002*$a())*k.k),i(d,v),c(n)}function p(){var n=oa.mouse(this),t=Math.log(k.k)/Math.LN2;a(this,n,e(n),oa.event.shiftKey?Math.ceil(t)-1:Math.floor(t)+1)}var v,d,m,y,M,x,b,_,w,k={x:0,y:0,k:1},E=[960,500],A=Wa,C=250,z=0,L="mousedown.zoom",q="mousemove.zoom",T="mouseup.zoom",R="touchstart.zoom",D=N(n,"zoomstart","zoom","zoomend");return Ba||(Ba="onwheel"in sa?($a=function(){return-oa.event.deltaY*(oa.event.deltaMode?120:1)},"wheel"):"onmousewheel"in sa?($a=function(){return oa.event.wheelDelta},"mousewheel"):($a=function(){return-oa.event.detail},"MozMousePixelScroll")),n.event=function(n){n.each(function(){var n=D.of(this,arguments),t=k;Hl?oa.select(this).transition().each("start.zoom",function(){k=this.__chart__||{x:0,y:0,k:1},l(n)}).tween("zoom:zoom",function(){var e=E[0],r=E[1],u=d?d[0]:e/2,i=d?d[1]:r/2,a=oa.interpolateZoom([(u-k.x)/k.k,(i-k.y)/k.k,e/k.k],[(u-t.x)/t.k,(i-t.y)/t.k,e/t.k]);return function(t){var r=a(t),o=e/r[2];this.__chart__=k={x:u-r[0]*o,y:i-r[1]*o,k:o},c(n)}}).each("interrupt.zoom",function(){s(n)}).each("end.zoom",function(){s(n)}):(this.__chart__=k,l(n),c(n),s(n))})},n.translate=function(t){return arguments.length?(k={x:+t[0],y:+t[1],k:k.k},o(),n):[k.x,k.y]},n.scale=function(t){return arguments.length?(k={x:k.x,y:k.y,k:null},u(+t),o(),n):k.k},n.scaleExtent=function(t){return arguments.length?(A=null==t?Wa:[+t[0],+t[1]],n):A},n.center=function(t){return arguments.length?(m=t&&[+t[0],+t[1]],n):m},n.size=function(t){return arguments.length?(E=t&&[+t[0],+t[1]],n):E},n.duration=function(t){return arguments.length?(C=+t,n):C},n.x=function(t){return arguments.length?(b=t,x=t.copy(),k={x:0,y:0,k:1},n):b},n.y=function(t){return arguments.length?(w=t,_=t.copy(),k={x:0,y:0,k:1},n):w},oa.rebind(n,D,"on")};var $a,Ba,Wa=[0,1/0];oa.color=on,on.prototype.toString=function(){return this.rgb()+""},oa.hsl=ln;var Ja=ln.prototype=new on;Ja.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,this.l/n)},Ja.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,n*this.l)},Ja.rgb=function(){return cn(this.h,this.s,this.l)},oa.hcl=sn;var Ga=sn.prototype=new on;Ga.brighter=function(n){return new sn(this.h,this.c,Math.min(100,this.l+Ka*(arguments.length?n:1)))},Ga.darker=function(n){return new sn(this.h,this.c,Math.max(0,this.l-Ka*(arguments.length?n:1)))},Ga.rgb=function(){return fn(this.h,this.c,this.l).rgb()},oa.lab=hn;var Ka=18,Qa=.95047,no=1,to=1.08883,eo=hn.prototype=new on;eo.brighter=function(n){return new hn(Math.min(100,this.l+Ka*(arguments.length?n:1)),this.a,this.b)},eo.darker=function(n){return new hn(Math.max(0,this.l-Ka*(arguments.length?n:1)),this.a,this.b)},eo.rgb=function(){return gn(this.l,this.a,this.b)},oa.rgb=yn;var ro=yn.prototype=new on;ro.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,u=30;return t||e||r?(t&&u>t&&(t=u),e&&u>e&&(e=u),r&&u>r&&(r=u),new yn(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new yn(u,u,u)},ro.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new yn(n*this.r,n*this.g,n*this.b)},ro.hsl=function(){return wn(this.r,this.g,this.b)},ro.toString=function(){return"#"+bn(this.r)+bn(this.g)+bn(this.b)};var uo=oa.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});uo.forEach(function(n,t){uo.set(n,Mn(t))}),oa.functor=En,oa.xhr=An(y),oa.dsv=function(n,t){function e(n,e,i){arguments.length<3&&(i=e,e=null);var a=Cn(n,t,null==e?r:u(e),i);return a.row=function(n){return arguments.length?a.response(null==(e=n)?r:u(n)):e},a}function r(n){return e.parse(n.responseText)}function u(n){return function(t){return e.parse(t.responseText,n)}}function i(t){return t.map(a).join(n)}function a(n){return o.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var o=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var u=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(u(n),e)}:u})},e.parseRows=function(n,t){function e(){if(s>=c)return a;if(u)return u=!1,i;var t=s;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}s=e+2;var r=n.charCodeAt(e+1);return 13===r?(u=!0,10===n.charCodeAt(e+2)&&++s):10===r&&(u=!0),n.slice(t+1,e).replace(/""/g,'"')}for(;c>s;){var r=n.charCodeAt(s++),o=1;if(10===r)u=!0;else if(13===r)u=!0,10===n.charCodeAt(s)&&(++s,++o);else if(r!==l)continue;return n.slice(t,s-o)}return n.slice(t)}for(var r,u,i={},a={},o=[],c=n.length,s=0,f=0;(r=e())!==a;){for(var h=[];r!==i&&r!==a;)h.push(r),r=e();t&&null==(h=t(h,f++))||o.push(h)}return o},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new m,u=[];return t.forEach(function(n){for(var t in n)r.has(t)||u.push(r.add(t))}),[u.map(a).join(n)].concat(t.map(function(t){return u.map(function(n){return a(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(i).join("\n")},e},oa.csv=oa.dsv(",","text/csv"),oa.tsv=oa.dsv("	","text/tab-separated-values");var io,ao,oo,lo,co=this[x(this,"requestAnimationFrame")]||function(n){setTimeout(n,17)};oa.timer=function(){qn.apply(this,arguments)},oa.timer.flush=function(){Rn(),Dn()},oa.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)};var so=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"].map(Un);oa.formatPrefix=function(n,t){var e=0;return(n=+n)&&(0>n&&(n*=-1),t&&(n=oa.round(n,Pn(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((e-1)/3)))),so[8+e/3]};var fo=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,ho=oa.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=oa.round(n,Pn(n,t))).toFixed(Math.max(0,Math.min(20,Pn(n*(1+1e-15),t))))}}),go=oa.time={},po=Date;Hn.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){vo.setUTCDate.apply(this._,arguments)},setDay:function(){vo.setUTCDay.apply(this._,arguments)},setFullYear:function(){vo.setUTCFullYear.apply(this._,arguments)},setHours:function(){vo.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){vo.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){vo.setUTCMinutes.apply(this._,arguments)},setMonth:function(){vo.setUTCMonth.apply(this._,arguments)},setSeconds:function(){vo.setUTCSeconds.apply(this._,arguments)},setTime:function(){vo.setTime.apply(this._,arguments)}};var vo=Date.prototype;go.year=On(function(n){return n=go.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),go.years=go.year.range,go.years.utc=go.year.utc.range,go.day=On(function(n){var t=new po(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),go.days=go.day.range,go.days.utc=go.day.utc.range,go.dayOfYear=function(n){var t=go.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(n,t){t=7-t;var e=go[n]=On(function(n){return(n=go.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=go.year(n).getDay();return Math.floor((go.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});go[n+"s"]=e.range,go[n+"s"].utc=e.utc.range,go[n+"OfYear"]=function(n){var e=go.year(n).getDay();return Math.floor((go.dayOfYear(n)+(e+t)%7)/7)}}),go.week=go.sunday,go.weeks=go.sunday.range,go.weeks.utc=go.sunday.utc.range,go.weekOfYear=go.sundayOfYear;var mo={"-":"",_:" ",0:"0"},yo=/^\s*\d+/,Mo=/^%/;oa.locale=function(n){return{numberFormat:jn(n),timeFormat:Yn(n)}};var xo=oa.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
	shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});oa.format=xo.numberFormat,oa.geo={},st.prototype={s:0,t:0,add:function(n){ft(n,this.t,bo),ft(bo.s,this.s,this),this.s?this.t+=bo.t:this.s=bo.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var bo=new st;oa.geo.stream=function(n,t){n&&_o.hasOwnProperty(n.type)?_o[n.type](n,t):ht(n,t)};var _o={Feature:function(n,t){ht(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,u=e.length;++r<u;)ht(e[r].geometry,t)}},wo={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){gt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)gt(e[r],t,0)},Polygon:function(n,t){pt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,u=e.length;++r<u;)pt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,u=e.length;++r<u;)ht(e[r],t)}};oa.geo.area=function(n){return So=0,oa.geo.stream(n,No),So};var So,ko=new st,No={sphere:function(){So+=4*ja},point:b,lineStart:b,lineEnd:b,polygonStart:function(){ko.reset(),No.lineStart=vt},polygonEnd:function(){var n=2*ko;So+=0>n?4*ja+n:n,No.lineStart=No.lineEnd=No.point=b}};oa.geo.bounds=function(){function n(n,t){M.push(x=[s=n,h=n]),f>t&&(f=t),t>g&&(g=t)}function t(t,e){var r=dt([t*Ia,e*Ia]);if(m){var u=yt(m,r),i=[u[1],-u[0],0],a=yt(i,u);bt(a),a=_t(a);var l=t-p,c=l>0?1:-1,v=a[0]*Ya*c,d=Ma(l)>180;if(d^(v>c*p&&c*t>v)){var y=a[1]*Ya;y>g&&(g=y)}else if(v=(v+360)%360-180,d^(v>c*p&&c*t>v)){var y=-a[1]*Ya;f>y&&(f=y)}else f>e&&(f=e),e>g&&(g=e);d?p>t?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t):h>=s?(s>t&&(s=t),t>h&&(h=t)):t>p?o(s,t)>o(s,h)&&(h=t):o(t,h)>o(s,h)&&(s=t)}else n(t,e);m=r,p=t}function e(){b.point=t}function r(){x[0]=s,x[1]=h,b.point=n,m=null}function u(n,e){if(m){var r=n-p;y+=Ma(r)>180?r+(r>0?360:-360):r}else v=n,d=e;No.point(n,e),t(n,e)}function i(){No.lineStart()}function a(){u(v,d),No.lineEnd(),Ma(y)>Pa&&(s=-(h=180)),x[0]=s,x[1]=h,m=null}function o(n,t){return(t-=n)<0?t+360:t}function l(n,t){return n[0]-t[0]}function c(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var s,f,h,g,p,v,d,m,y,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=u,b.lineStart=i,b.lineEnd=a,y=0,No.polygonStart()},polygonEnd:function(){No.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>ko?(s=-(h=180),f=-(g=90)):y>Pa?g=90:-Pa>y&&(f=-90),x[0]=s,x[1]=h}};return function(n){g=h=-(s=f=1/0),M=[],oa.geo.stream(n,b);var t=M.length;if(t){M.sort(l);for(var e,r=1,u=M[0],i=[u];t>r;++r)e=M[r],c(e[0],u)||c(e[1],u)?(o(u[0],e[1])>o(u[0],u[1])&&(u[1]=e[1]),o(e[0],u[1])>o(u[0],u[1])&&(u[0]=e[0])):i.push(u=e);for(var a,e,p=-(1/0),t=i.length-1,r=0,u=i[t];t>=r;u=e,++r)e=i[r],(a=o(u[1],e[0]))>p&&(p=a,s=e[0],h=u[1])}return M=x=null,s===1/0||f===1/0?[[NaN,NaN],[NaN,NaN]]:[[s,f],[h,g]]}}(),oa.geo.centroid=function(n){Eo=Ao=Co=zo=Lo=qo=To=Ro=Do=Po=Uo=0,oa.geo.stream(n,jo);var t=Do,e=Po,r=Uo,u=t*t+e*e+r*r;return Ua>u&&(t=qo,e=To,r=Ro,Pa>Ao&&(t=Co,e=zo,r=Lo),u=t*t+e*e+r*r,Ua>u)?[NaN,NaN]:[Math.atan2(e,t)*Ya,tn(r/Math.sqrt(u))*Ya]};var Eo,Ao,Co,zo,Lo,qo,To,Ro,Do,Po,Uo,jo={sphere:b,point:St,lineStart:Nt,lineEnd:Et,polygonStart:function(){jo.lineStart=At},polygonEnd:function(){jo.lineStart=Nt}},Fo=Rt(zt,jt,Ht,[-ja,-ja/2]),Ho=1e9;oa.geo.clipExtent=function(){var n,t,e,r,u,i,a={stream:function(n){return u&&(u.valid=!1),u=i(n),u.valid=!0,u},extent:function(o){return arguments.length?(i=Zt(n=+o[0][0],t=+o[0][1],e=+o[1][0],r=+o[1][1]),u&&(u.valid=!1,u=null),a):[[n,t],[e,r]]}};return a.extent([[0,0],[960,500]])},(oa.geo.conicEqualArea=function(){return Vt(Xt)}).raw=Xt,oa.geo.albers=function(){return oa.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},oa.geo.albersUsa=function(){function n(n){var i=n[0],a=n[1];return t=null,e(i,a),t||(r(i,a),t)||u(i,a),t}var t,e,r,u,i=oa.geo.albers(),a=oa.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),o=oa.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),l={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=i.scale(),e=i.translate(),r=(n[0]-e[0])/t,u=(n[1]-e[1])/t;return(u>=.12&&.234>u&&r>=-.425&&-.214>r?a:u>=.166&&.234>u&&r>=-.214&&-.115>r?o:i).invert(n)},n.stream=function(n){var t=i.stream(n),e=a.stream(n),r=o.stream(n);return{point:function(n,u){t.point(n,u),e.point(n,u),r.point(n,u)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(i.precision(t),a.precision(t),o.precision(t),n):i.precision()},n.scale=function(t){return arguments.length?(i.scale(t),a.scale(.35*t),o.scale(t),n.translate(i.translate())):i.scale()},n.translate=function(t){if(!arguments.length)return i.translate();var c=i.scale(),s=+t[0],f=+t[1];return e=i.translate(t).clipExtent([[s-.455*c,f-.238*c],[s+.455*c,f+.238*c]]).stream(l).point,r=a.translate([s-.307*c,f+.201*c]).clipExtent([[s-.425*c+Pa,f+.12*c+Pa],[s-.214*c-Pa,f+.234*c-Pa]]).stream(l).point,u=o.translate([s-.205*c,f+.212*c]).clipExtent([[s-.214*c+Pa,f+.166*c+Pa],[s-.115*c-Pa,f+.234*c-Pa]]).stream(l).point,n},n.scale(1070)};var Oo,Io,Yo,Zo,Vo,Xo,$o={point:b,lineStart:b,lineEnd:b,polygonStart:function(){Io=0,$o.lineStart=$t},polygonEnd:function(){$o.lineStart=$o.lineEnd=$o.point=b,Oo+=Ma(Io/2)}},Bo={point:Bt,lineStart:b,lineEnd:b,polygonStart:b,polygonEnd:b},Wo={point:Gt,lineStart:Kt,lineEnd:Qt,polygonStart:function(){Wo.lineStart=ne},polygonEnd:function(){Wo.point=Gt,Wo.lineStart=Kt,Wo.lineEnd=Qt}};oa.geo.path=function(){function n(n){return n&&("function"==typeof o&&i.pointRadius(+o.apply(this,arguments)),a&&a.valid||(a=u(i)),oa.geo.stream(n,a)),i.result()}function t(){return a=null,n}var e,r,u,i,a,o=4.5;return n.area=function(n){return Oo=0,oa.geo.stream(n,u($o)),Oo},n.centroid=function(n){return Co=zo=Lo=qo=To=Ro=Do=Po=Uo=0,oa.geo.stream(n,u(Wo)),Uo?[Do/Uo,Po/Uo]:Ro?[qo/Ro,To/Ro]:Lo?[Co/Lo,zo/Lo]:[NaN,NaN]},n.bounds=function(n){return Vo=Xo=-(Yo=Zo=1/0),oa.geo.stream(n,u(Bo)),[[Yo,Zo],[Vo,Xo]]},n.projection=function(n){return arguments.length?(u=(e=n)?n.stream||re(n):y,t()):e},n.context=function(n){return arguments.length?(i=null==(r=n)?new Wt:new te(n),"function"!=typeof o&&i.pointRadius(o),t()):r},n.pointRadius=function(t){return arguments.length?(o="function"==typeof t?t:(i.pointRadius(+t),+t),n):o},n.projection(oa.geo.albersUsa()).context(null)},oa.geo.transform=function(n){return{stream:function(t){var e=new ue(t);for(var r in n)e[r]=n[r];return e}}},ue.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},oa.geo.projection=ae,oa.geo.projectionMutator=oe,(oa.geo.equirectangular=function(){return ae(ce)}).raw=ce.invert=ce,oa.geo.rotation=function(n){function t(t){return t=n(t[0]*Ia,t[1]*Ia),t[0]*=Ya,t[1]*=Ya,t}return n=fe(n[0]%360*Ia,n[1]*Ia,n.length>2?n[2]*Ia:0),t.invert=function(t){return t=n.invert(t[0]*Ia,t[1]*Ia),t[0]*=Ya,t[1]*=Ya,t},t},se.invert=ce,oa.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=fe(-n[0]*Ia,-n[1]*Ia,0).invert,u=[];return e(null,null,1,{point:function(n,e){u.push(n=t(n,e)),n[0]*=Ya,n[1]*=Ya}}),{type:"Polygon",coordinates:[u]}}var t,e,r=[0,0],u=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=ve((t=+r)*Ia,u*Ia),n):t},n.precision=function(r){return arguments.length?(e=ve(t*Ia,(u=+r)*Ia),n):u},n.angle(90)},oa.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Ia,u=n[1]*Ia,i=t[1]*Ia,a=Math.sin(r),o=Math.cos(r),l=Math.sin(u),c=Math.cos(u),s=Math.sin(i),f=Math.cos(i);return Math.atan2(Math.sqrt((e=f*a)*e+(e=c*s-l*f*o)*e),l*s+c*f*o)},oa.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return oa.range(Math.ceil(i/d)*d,u,d).map(h).concat(oa.range(Math.ceil(c/m)*m,l,m).map(g)).concat(oa.range(Math.ceil(r/p)*p,e,p).filter(function(n){return Ma(n%d)>Pa}).map(s)).concat(oa.range(Math.ceil(o/v)*v,a,v).filter(function(n){return Ma(n%m)>Pa}).map(f))}var e,r,u,i,a,o,l,c,s,f,h,g,p=10,v=p,d=90,m=360,y=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(i).concat(g(l).slice(1),h(u).reverse().slice(1),g(c).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(i=+t[0][0],u=+t[1][0],c=+t[0][1],l=+t[1][1],i>u&&(t=i,i=u,u=t),c>l&&(t=c,c=l,l=t),n.precision(y)):[[i,c],[u,l]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],o=+t[0][1],a=+t[1][1],r>e&&(t=r,r=e,e=t),o>a&&(t=o,o=a,a=t),n.precision(y)):[[r,o],[e,a]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],m=+t[1],n):[d,m]},n.minorStep=function(t){return arguments.length?(p=+t[0],v=+t[1],n):[p,v]},n.precision=function(t){return arguments.length?(y=+t,s=me(o,a,90),f=ye(r,e,y),h=me(c,l,90),g=ye(i,u,y),n):y},n.majorExtent([[-180,-90+Pa],[180,90-Pa]]).minorExtent([[-180,-80-Pa],[180,80+Pa]])},oa.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||u.apply(this,arguments)]}}var t,e,r=Me,u=xe;return n.distance=function(){return oa.geo.distance(t||r.apply(this,arguments),e||u.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(u=t,e="function"==typeof t?null:t,n):u},n.precision=function(){return arguments.length?n:0},n},oa.geo.interpolate=function(n,t){return be(n[0]*Ia,n[1]*Ia,t[0]*Ia,t[1]*Ia)},oa.geo.length=function(n){return Jo=0,oa.geo.stream(n,Go),Jo};var Jo,Go={sphere:b,point:b,lineStart:_e,lineEnd:b,polygonStart:b,polygonEnd:b},Ko=we(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(oa.geo.azimuthalEqualArea=function(){return ae(Ko)}).raw=Ko;var Qo=we(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},y);(oa.geo.azimuthalEquidistant=function(){return ae(Qo)}).raw=Qo,(oa.geo.conicConformal=function(){return Vt(Se)}).raw=Se,(oa.geo.conicEquidistant=function(){return Vt(ke)}).raw=ke;var nl=we(function(n){return 1/n},Math.atan);(oa.geo.gnomonic=function(){return ae(nl)}).raw=nl,Ne.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Oa]},(oa.geo.mercator=function(){return Ee(Ne)}).raw=Ne;var tl=we(function(){return 1},Math.asin);(oa.geo.orthographic=function(){return ae(tl)}).raw=tl;var el=we(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(oa.geo.stereographic=function(){return ae(el)}).raw=el,Ae.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Oa]},(oa.geo.transverseMercator=function(){var n=Ee(Ae),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[n[1],-n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},e([0,0,90])}).raw=Ae,oa.geom={},oa.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,u=En(e),i=En(r),a=n.length,o=[],l=[];for(t=0;a>t;t++)o.push([+u.call(this,n[t],t),+i.call(this,n[t],t),t]);for(o.sort(qe),t=0;a>t;t++)l.push([o[t][0],-o[t][1]]);var c=Le(o),s=Le(l),f=s[0]===c[0],h=s[s.length-1]===c[c.length-1],g=[];for(t=c.length-1;t>=0;--t)g.push(n[o[c[t]][2]]);for(t=+f;t<s.length-h;++t)g.push(n[o[s[t]][2]]);return g}var e=Ce,r=ze;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},oa.geom.polygon=function(n){return Sa(n,rl),n};var rl=oa.geom.polygon.prototype=[];rl.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],u=0;++t<e;)n=r,r=this[t],u+=n[1]*r[0]-n[0]*r[1];return.5*u},rl.centroid=function(n){var t,e,r=-1,u=this.length,i=0,a=0,o=this[u-1];for(arguments.length||(n=-1/(6*this.area()));++r<u;)t=o,o=this[r],e=t[0]*o[1]-o[0]*t[1],i+=(t[0]+o[0])*e,a+=(t[1]+o[1])*e;return[i*n,a*n]},rl.clip=function(n){for(var t,e,r,u,i,a,o=De(n),l=-1,c=this.length-De(this),s=this[c-1];++l<c;){for(t=n.slice(),n.length=0,u=this[l],i=t[(r=t.length-o)-1],e=-1;++e<r;)a=t[e],Te(a,s,u)?(Te(i,s,u)||n.push(Re(i,a,s,u)),n.push(a)):Te(i,s,u)&&n.push(Re(i,a,s,u)),i=a;o&&n.push(n[0]),s=u}return n};var ul,il,al,ol,ll,cl=[],sl=[];Ye.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(Ve),t.length},tr.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},er.prototype={insert:function(n,t){var e,r,u;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=ar(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(u=r.R,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.R&&(ur(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ir(this,r))):(u=r.L,u&&u.C?(e.C=u.C=!1,r.C=!0,n=r):(n===e.L&&(ir(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ur(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,u=n.U,i=n.L,a=n.R;if(e=i?a?ar(a):i:a,u?u.L===n?u.L=e:u.R=e:this._=e,i&&a?(r=e.C,e.C=n.C,e.L=i,i.U=e,e!==a?(u=e.U,e.U=n.U,n=e.R,u.L=n,e.R=a,a.U=e):(e.U=u,u=e,n=e.R)):(r=n.C,n=e),n&&(n.U=u),!r){if(n&&n.C)return void(n.C=!1);do{if(n===this._)break;if(n===u.L){if(t=u.R,t.C&&(t.C=!1,u.C=!0,ur(this,u),t=u.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,ir(this,t),t=u.R),t.C=u.C,u.C=t.R.C=!1,ur(this,u),n=this._;break}}else if(t=u.L,t.C&&(t.C=!1,u.C=!0,ir(this,u),t=u.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,ur(this,t),t=u.L),t.C=u.C,u.C=t.L.C=!1,ir(this,u),n=this._;break}t.C=!0,n=u,u=u.U}while(!n.C);n&&(n.C=!1)}}},oa.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=o[0][0],u=o[0][1],i=o[1][0],a=o[1][1];return or(e(n),o).cells.forEach(function(e,o){var l=e.edges,c=e.site,s=t[o]=l.length?l.map(function(n){var t=n.start();return[t.x,t.y]}):c.x>=r&&c.x<=i&&c.y>=u&&c.y<=a?[[r,a],[i,a],[i,u],[r,u]]:[];s.point=n[o]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(i(n,t)/Pa)*Pa,y:Math.round(a(n,t)/Pa)*Pa,i:t}})}var r=Ce,u=ze,i=r,a=u,o=fl;return n?t(n):(t.links=function(n){return or(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return or(e(n)).cells.forEach(function(e,r){for(var u,i,a=e.site,o=e.edges.sort(Ve),l=-1,c=o.length,s=o[c-1].edge,f=s.l===a?s.r:s.l;++l<c;)u=s,i=f,s=o[l].edge,f=s.l===a?s.r:s.l,r<i.i&&r<f.i&&cr(a,i,f)<0&&t.push([n[r],n[i.i],n[f.i]])}),t},t.x=function(n){return arguments.length?(i=En(r=n),t):r},t.y=function(n){return arguments.length?(a=En(u=n),t):u},t.clipExtent=function(n){return arguments.length?(o=null==n?fl:n,t):o===fl?null:o},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):o===fl?null:o&&o[1]},t)};var fl=[[-1e6,-1e6],[1e6,1e6]];oa.geom.delaunay=function(n){return oa.geom.voronoi().triangles(n)},oa.geom.quadtree=function(n,t,e,r,u){function i(n){function i(n,t,e,r,u,i,a,o){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var l=n.x,s=n.y;if(null!=l)if(Ma(l-e)+Ma(s-r)<.01)c(n,t,e,r,u,i,a,o);else{var f=n.point;n.x=n.y=n.point=null,c(n,f,l,s,u,i,a,o),c(n,t,e,r,u,i,a,o)}else n.x=e,n.y=r,n.point=t}else c(n,t,e,r,u,i,a,o)}function c(n,t,e,r,u,a,o,l){var c=.5*(u+o),s=.5*(a+l),f=e>=c,h=r>=s,g=h<<1|f;n.leaf=!1,n=n.nodes[g]||(n.nodes[g]=hr()),f?u=c:o=c,h?a=s:l=s,i(n,t,e,r,u,a,o,l)}var s,f,h,g,p,v,d,m,y,M=En(o),x=En(l);if(null!=t)v=t,d=e,m=r,y=u;else if(m=y=-(v=d=1/0),f=[],h=[],p=n.length,a)for(g=0;p>g;++g)s=n[g],s.x<v&&(v=s.x),s.y<d&&(d=s.y),s.x>m&&(m=s.x),s.y>y&&(y=s.y),f.push(s.x),h.push(s.y);else for(g=0;p>g;++g){var b=+M(s=n[g],g),_=+x(s,g);v>b&&(v=b),d>_&&(d=_),b>m&&(m=b),_>y&&(y=_),f.push(b),h.push(_)}var w=m-v,S=y-d;w>S?y=d+w:m=v+S;var k=hr();if(k.add=function(n){i(k,n,+M(n,++g),+x(n,g),v,d,m,y)},k.visit=function(n){gr(n,k,v,d,m,y)},k.find=function(n){return pr(k,n[0],n[1],v,d,m,y)},g=-1,null==t){for(;++g<p;)i(k,n[g],f[g],h[g],v,d,m,y);--g}else n.forEach(k.add);return f=h=n=s=null,k}var a,o=Ce,l=ze;return(a=arguments.length)?(o=sr,l=fr,3===a&&(u=e,r=t,e=t=0),i(n)):(i.x=function(n){return arguments.length?(o=n,i):o},i.y=function(n){return arguments.length?(l=n,i):l},i.extent=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],u=+n[1][1]),i):null==t?null:[[t,e],[r,u]]},i.size=function(n){return arguments.length?(null==n?t=e=r=u=null:(t=e=0,r=+n[0],u=+n[1]),i):null==t?null:[r-t,u-e]},i)},oa.interpolateRgb=vr,oa.interpolateObject=dr,oa.interpolateNumber=mr,oa.interpolateString=yr;var hl=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,gl=new RegExp(hl.source,"g");oa.interpolate=Mr,oa.interpolators=[function(n,t){var e=typeof t;return("string"===e?uo.has(t.toLowerCase())||/^(#|rgb\(|hsl\()/i.test(t)?vr:yr:t instanceof on?vr:Array.isArray(t)?xr:"object"===e&&isNaN(t)?dr:mr)(n,t)}],oa.interpolateArray=xr;var pl=function(){return y},vl=oa.map({linear:pl,poly:Er,quad:function(){return Sr},cubic:function(){return kr},sin:function(){return Ar},exp:function(){return Cr},circle:function(){return zr},elastic:Lr,back:qr,bounce:function(){return Tr}}),dl=oa.map({"in":y,out:_r,"in-out":wr,"out-in":function(n){return wr(_r(n))}});oa.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.slice(0,t):n,r=t>=0?n.slice(t+1):"in";return e=vl.get(e)||pl,r=dl.get(r)||y,br(r(e.apply(null,la.call(arguments,1))))},oa.interpolateHcl=Rr,oa.interpolateHsl=Dr,oa.interpolateLab=Pr,oa.interpolateRound=Ur,oa.transform=function(n){var t=sa.createElementNS(oa.ns.prefix.svg,"g");return(oa.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new jr(e?e.matrix:ml)})(n)},jr.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var ml={a:1,b:0,c:0,d:1,e:0,f:0};oa.interpolateTransform=$r,oa.layout={},oa.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Jr(n[e]));return t}},oa.layout.chord=function(){function n(){var n,c,f,h,g,p={},v=[],d=oa.range(i),m=[];for(e=[],r=[],n=0,h=-1;++h<i;){for(c=0,g=-1;++g<i;)c+=u[h][g];v.push(c),m.push(oa.range(i)),n+=c}for(a&&d.sort(function(n,t){return a(v[n],v[t])}),o&&m.forEach(function(n,t){n.sort(function(n,e){return o(u[t][n],u[t][e])})}),n=(Fa-s*i)/n,c=0,h=-1;++h<i;){for(f=c,g=-1;++g<i;){var y=d[h],M=m[y][g],x=u[y][M],b=c,_=c+=x*n;p[y+"-"+M]={index:y,subindex:M,startAngle:b,endAngle:_,value:x}}r[y]={index:y,startAngle:f,endAngle:c,value:v[y]},c+=s}for(h=-1;++h<i;)for(g=h-1;++g<i;){var w=p[h+"-"+g],S=p[g+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}l&&t()}function t(){e.sort(function(n,t){return l((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,u,i,a,o,l,c={},s=0;return c.matrix=function(n){return arguments.length?(i=(u=n)&&u.length,e=r=null,c):u},c.padding=function(n){return arguments.length?(s=n,e=r=null,c):s},c.sortGroups=function(n){return arguments.length?(a=n,e=r=null,c):a},c.sortSubgroups=function(n){return arguments.length?(o=n,e=null,c):o},c.sortChords=function(n){return arguments.length?(l=n,e&&t(),c):l},c.chords=function(){return e||n(),e},c.groups=function(){return r||n(),r},c},oa.layout.force=function(){function n(n){return function(t,e,r,u){if(t.point!==n){var i=t.cx-n.x,a=t.cy-n.y,o=u-e,l=i*i+a*a;if(l>o*o/m){if(v>l){var c=t.charge/l;n.px-=i*c,n.py-=a*c}return!0}if(t.point&&l&&v>l){var c=t.pointCharge/l;n.px-=i*c,n.py-=a*c}}return!t.charge}}function t(n){n.px=oa.event.x,n.py=oa.event.y,l.resume()}var e,r,u,i,a,o,l={},c=oa.dispatch("start","tick","end"),s=[1,1],f=.9,h=yl,g=Ml,p=-30,v=xl,d=.1,m=.64,M=[],x=[];return l.tick=function(){if((u*=.99)<.005)return e=null,c.end({type:"end",alpha:u=0}),!0;var t,r,l,h,g,v,m,y,b,_=M.length,w=x.length;for(r=0;w>r;++r)l=x[r],h=l.source,g=l.target,y=g.x-h.x,b=g.y-h.y,(v=y*y+b*b)&&(v=u*a[r]*((v=Math.sqrt(v))-i[r])/v,y*=v,b*=v,g.x-=y*(m=h.weight+g.weight?h.weight/(h.weight+g.weight):.5),g.y-=b*m,h.x+=y*(m=1-m),h.y+=b*m);if((m=u*d)&&(y=s[0]/2,b=s[1]/2,r=-1,m))for(;++r<_;)l=M[r],l.x+=(y-l.x)*m,l.y+=(b-l.y)*m;if(p)for(ru(t=oa.geom.quadtree(M),u,o),r=-1;++r<_;)(l=M[r]).fixed||t.visit(n(l));for(r=-1;++r<_;)l=M[r],l.fixed?(l.x=l.px,l.y=l.py):(l.x-=(l.px-(l.px=l.x))*f,l.y-=(l.py-(l.py=l.y))*f);c.tick({type:"tick",alpha:u})},l.nodes=function(n){return arguments.length?(M=n,l):M},l.links=function(n){return arguments.length?(x=n,l):x},l.size=function(n){return arguments.length?(s=n,l):s},l.linkDistance=function(n){return arguments.length?(h="function"==typeof n?n:+n,l):h},l.distance=l.linkDistance,l.linkStrength=function(n){return arguments.length?(g="function"==typeof n?n:+n,l):g},l.friction=function(n){return arguments.length?(f=+n,l):f},l.charge=function(n){return arguments.length?(p="function"==typeof n?n:+n,l):p},l.chargeDistance=function(n){return arguments.length?(v=n*n,l):Math.sqrt(v)},l.gravity=function(n){return arguments.length?(d=+n,l):d},l.theta=function(n){return arguments.length?(m=n*n,l):Math.sqrt(m)},l.alpha=function(n){return arguments.length?(n=+n,u?n>0?u=n:(e.c=null,e.t=NaN,e=null,c.end({type:"end",alpha:u=0})):n>0&&(c.start({type:"start",alpha:u=n}),e=qn(l.tick)),l):u},l.start=function(){function n(n,r){if(!e){for(e=new Array(u),l=0;u>l;++l)e[l]=[];for(l=0;c>l;++l){var i=x[l];e[i.source.index].push(i.target),e[i.target.index].push(i.source)}}for(var a,o=e[t],l=-1,s=o.length;++l<s;)if(!isNaN(a=o[l][n]))return a;return Math.random()*r}var t,e,r,u=M.length,c=x.length,f=s[0],v=s[1];for(t=0;u>t;++t)(r=M[t]).index=t,r.weight=0;for(t=0;c>t;++t)r=x[t],"number"==typeof r.source&&(r.source=M[r.source]),"number"==typeof r.target&&(r.target=M[r.target]),++r.source.weight,++r.target.weight;for(t=0;u>t;++t)r=M[t],isNaN(r.x)&&(r.x=n("x",f)),isNaN(r.y)&&(r.y=n("y",v)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(i=[],"function"==typeof h)for(t=0;c>t;++t)i[t]=+h.call(this,x[t],t);else for(t=0;c>t;++t)i[t]=h;if(a=[],"function"==typeof g)for(t=0;c>t;++t)a[t]=+g.call(this,x[t],t);else for(t=0;c>t;++t)a[t]=g;if(o=[],"function"==typeof p)for(t=0;u>t;++t)o[t]=+p.call(this,M[t],t);else for(t=0;u>t;++t)o[t]=p;return l.resume()},l.resume=function(){return l.alpha(.1)},l.stop=function(){return l.alpha(0)},l.drag=function(){return r||(r=oa.behavior.drag().origin(y).on("dragstart.force",Qr).on("drag.force",t).on("dragend.force",nu)),arguments.length?void this.on("mouseover.force",tu).on("mouseout.force",eu).call(r):r},oa.rebind(l,c,"on")};var yl=20,Ml=1,xl=1/0;oa.layout.hierarchy=function(){function n(u){var i,a=[u],o=[];for(u.depth=0;null!=(i=a.pop());)if(o.push(i),(c=e.call(n,i,i.depth))&&(l=c.length)){for(var l,c,s;--l>=0;)a.push(s=c[l]),s.parent=i,s.depth=i.depth+1;r&&(i.value=0),i.children=c}else r&&(i.value=+r.call(n,i,i.depth)||0),delete i.children;return au(u,function(n){var e,u;t&&(e=n.children)&&e.sort(t),r&&(u=n.parent)&&(u.value+=n.value)}),o}var t=cu,e=ou,r=lu;return n.sort=function(e){return arguments.length?(t=e,n):t},n.children=function(t){return arguments.length?(e=t,n):e},n.value=function(t){return arguments.length?(r=t,n):r},n.revalue=function(t){return r&&(iu(t,function(n){n.children&&(n.value=0)}),au(t,function(t){var e;t.children||(t.value=+r.call(n,t,t.depth)||0),(e=t.parent)&&(e.value+=t.value)})),t},n},oa.layout.partition=function(){function n(t,e,r,u){var i=t.children;if(t.x=e,t.y=t.depth*u,t.dx=r,t.dy=u,i&&(a=i.length)){var a,o,l,c=-1;for(r=t.value?r/t.value:0;++c<a;)n(o=i[c],e,l=o.value*r,u),e+=l}}function t(n){var e=n.children,r=0;if(e&&(u=e.length))for(var u,i=-1;++i<u;)r=Math.max(r,t(e[i]));return 1+r}function e(e,i){var a=r.call(this,e,i);return n(a[0],0,u[0],u[1]/t(a[0])),a}var r=oa.layout.hierarchy(),u=[1,1];return e.size=function(n){return arguments.length?(u=n,e):u},uu(e,r)},oa.layout.pie=function(){function n(a){var o,l=a.length,c=a.map(function(e,r){return+t.call(n,e,r)}),s=+("function"==typeof r?r.apply(this,arguments):r),f=("function"==typeof u?u.apply(this,arguments):u)-s,h=Math.min(Math.abs(f)/l,+("function"==typeof i?i.apply(this,arguments):i)),g=h*(0>f?-1:1),p=oa.sum(c),v=p?(f-l*g)/p:0,d=oa.range(l),m=[];return null!=e&&d.sort(e===bl?function(n,t){return c[t]-c[n]}:function(n,t){return e(a[n],a[t])}),d.forEach(function(n){m[n]={data:a[n],value:o=c[n],startAngle:s,endAngle:s+=o*v+g,padAngle:h}}),m}var t=Number,e=bl,r=0,u=Fa,i=0;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(u=t,n):u},n.padAngle=function(t){return arguments.length?(i=t,n):i},n};var bl={};oa.layout.stack=function(){function n(o,l){if(!(h=o.length))return o;var c=o.map(function(e,r){return t.call(n,e,r)}),s=c.map(function(t){return t.map(function(t,e){return[i.call(n,t,e),a.call(n,t,e)]})}),f=e.call(n,s,l);c=oa.permute(c,f),s=oa.permute(s,f);var h,g,p,v,d=r.call(n,s,l),m=c[0].length;for(p=0;m>p;++p)for(u.call(n,c[0][p],v=d[p],s[0][p][1]),g=1;h>g;++g)u.call(n,c[g][p],v+=s[g-1][p][1],s[g][p][1]);return o}var t=y,e=pu,r=vu,u=gu,i=fu,a=hu;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:_l.get(t)||pu,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:wl.get(t)||vu,n):r},n.x=function(t){return arguments.length?(i=t,n):i},n.y=function(t){return arguments.length?(a=t,n):a},n.out=function(t){return arguments.length?(u=t,n):u},n};var _l=oa.map({"inside-out":function(n){var t,e,r=n.length,u=n.map(du),i=n.map(mu),a=oa.range(r).sort(function(n,t){return u[n]-u[t]}),o=0,l=0,c=[],s=[];for(t=0;r>t;++t)e=a[t],l>o?(o+=i[e],c.push(e)):(l+=i[e],s.push(e));return s.reverse().concat(c)},reverse:function(n){return oa.range(n.length).reverse()},"default":pu}),wl=oa.map({silhouette:function(n){var t,e,r,u=n.length,i=n[0].length,a=[],o=0,l=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];r>o&&(o=r),a.push(r)}for(e=0;i>e;++e)l[e]=(o-a[e])/2;return l},wiggle:function(n){var t,e,r,u,i,a,o,l,c,s=n.length,f=n[0],h=f.length,g=[];for(g[0]=l=c=0,e=1;h>e;++e){for(t=0,u=0;s>t;++t)u+=n[t][e][1];for(t=0,i=0,o=f[e][0]-f[e-1][0];s>t;++t){for(r=0,a=(n[t][e][1]-n[t][e-1][1])/(2*o);t>r;++r)a+=(n[r][e][1]-n[r][e-1][1])/o;i+=a*n[t][e][1]}g[e]=l-=u?i/u*o:0,c>l&&(c=l)}for(e=0;h>e;++e)g[e]-=c;return g},expand:function(n){var t,e,r,u=n.length,i=n[0].length,a=1/u,o=[];for(e=0;i>e;++e){for(t=0,r=0;u>t;t++)r+=n[t][e][1];if(r)for(t=0;u>t;t++)n[t][e][1]/=r;else for(t=0;u>t;t++)n[t][e][1]=a}for(e=0;i>e;++e)o[e]=0;return o},zero:vu});oa.layout.histogram=function(){function n(n,i){for(var a,o,l=[],c=n.map(e,this),s=r.call(this,c,i),f=u.call(this,s,c,i),i=-1,h=c.length,g=f.length-1,p=t?1:1/h;++i<g;)a=l[i]=[],a.dx=f[i+1]-(a.x=f[i]),a.y=0;if(g>0)for(i=-1;++i<h;)o=c[i],o>=s[0]&&o<=s[1]&&(a=l[oa.bisect(f,o,1,g)-1],a.y+=p,a.push(n[i]));return l}var t=!0,e=Number,r=bu,u=Mu;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=En(t),n):r},n.bins=function(t){return arguments.length?(u="number"==typeof t?function(n){return xu(n,t)}:En(t),n):u},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},oa.layout.pack=function(){function n(n,i){var a=e.call(this,n,i),o=a[0],l=u[0],c=u[1],s=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(o.x=o.y=0,au(o,function(n){n.r=+s(n.value)}),au(o,Nu),r){var f=r*(t?1:Math.max(2*o.r/l,2*o.r/c))/2;au(o,function(n){n.r+=f}),au(o,Nu),au(o,function(n){n.r-=f})}return Cu(o,l/2,c/2,t?1:1/Math.max(2*o.r/l,2*o.r/c)),a}var t,e=oa.layout.hierarchy().sort(_u),r=0,u=[1,1];return n.size=function(t){return arguments.length?(u=t,n):u},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},uu(n,e)},oa.layout.tree=function(){function n(n,u){var s=a.call(this,n,u),f=s[0],h=t(f);if(au(h,e),h.parent.m=-h.z,iu(h,r),c)iu(f,i);else{var g=f,p=f,v=f;iu(f,function(n){n.x<g.x&&(g=n),n.x>p.x&&(p=n),n.depth>v.depth&&(v=n)});var d=o(g,p)/2-g.x,m=l[0]/(p.x+o(p,g)/2+d),y=l[1]/(v.depth||1);iu(f,function(n){n.x=(n.x+d)*m,n.y=n.depth*y})}return s}function t(n){for(var t,e={A:null,children:[n]},r=[e];null!=(t=r.pop());)for(var u,i=t.children,a=0,o=i.length;o>a;++a)r.push((i[a]=u={_:i[a],parent:t,children:(u=i[a].children)&&u.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:a}).a=u);return e.children[0]}function e(n){var t=n.children,e=n.parent.children,r=n.i?e[n.i-1]:null;if(t.length){Du(n);var i=(t[0].z+t[t.length-1].z)/2;r?(n.z=r.z+o(n._,r._),n.m=n.z-i):n.z=i}else r&&(n.z=r.z+o(n._,r._));n.parent.A=u(n,r,n.parent.A||e[0])}function r(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}function u(n,t,e){if(t){for(var r,u=n,i=n,a=t,l=u.parent.children[0],c=u.m,s=i.m,f=a.m,h=l.m;a=Tu(a),u=qu(u),a&&u;)l=qu(l),i=Tu(i),i.a=n,r=a.z+f-u.z-c+o(a._,u._),r>0&&(Ru(Pu(a,n,e),n,r),c+=r,s+=r),f+=a.m,c+=u.m,h+=l.m,s+=i.m;a&&!Tu(i)&&(i.t=a,i.m+=f-s),u&&!qu(l)&&(l.t=u,l.m+=c-h,e=n)}return e}function i(n){n.x*=l[0],n.y=n.depth*l[1]}var a=oa.layout.hierarchy().sort(null).value(null),o=Lu,l=[1,1],c=null;return n.separation=function(t){return arguments.length?(o=t,n):o},n.size=function(t){return arguments.length?(c=null==(l=t)?i:null,n):c?null:l},n.nodeSize=function(t){return arguments.length?(c=null==(l=t)?null:i,n):c?l:null},uu(n,a)},oa.layout.cluster=function(){function n(n,i){var a,o=t.call(this,n,i),l=o[0],c=0;au(l,function(n){var t=n.children;t&&t.length?(n.x=ju(t),n.y=Uu(t)):(n.x=a?c+=e(n,a):0,n.y=0,a=n)});var s=Fu(l),f=Hu(l),h=s.x-e(s,f)/2,g=f.x+e(f,s)/2;return au(l,u?function(n){n.x=(n.x-l.x)*r[0],n.y=(l.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(g-h)*r[0],n.y=(1-(l.y?n.y/l.y:1))*r[1]}),o}var t=oa.layout.hierarchy().sort(null).value(null),e=Lu,r=[1,1],u=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(u=null==(r=t),n):u?null:r},n.nodeSize=function(t){return arguments.length?(u=null!=(r=t),n):u?r:null},uu(n,t)},oa.layout.treemap=function(){function n(n,t){for(var e,r,u=-1,i=n.length;++u<i;)r=(e=n[u]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var i=e.children;if(i&&i.length){var a,o,l,c=f(e),s=[],h=i.slice(),p=1/0,v="slice"===g?c.dx:"dice"===g?c.dy:"slice-dice"===g?1&e.depth?c.dy:c.dx:Math.min(c.dx,c.dy);for(n(h,c.dx*c.dy/e.value),s.area=0;(l=h.length)>0;)s.push(a=h[l-1]),s.area+=a.area,"squarify"!==g||(o=r(s,v))<=p?(h.pop(),p=o):(s.area-=s.pop().area,u(s,v,c,!1),v=Math.min(c.dx,c.dy),s.length=s.area=0,p=1/0);s.length&&(u(s,v,c,!0),s.length=s.area=0),i.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var i,a=f(t),o=r.slice(),l=[];for(n(o,a.dx*a.dy/t.value),l.area=0;i=o.pop();)l.push(i),l.area+=i.area,null!=i.z&&(u(l,i.z?a.dx:a.dy,a,!o.length),l.length=l.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,u=0,i=1/0,a=-1,o=n.length;++a<o;)(e=n[a].area)&&(i>e&&(i=e),e>u&&(u=e));return r*=r,t*=t,r?Math.max(t*u*p/r,r/(t*i*p)):1/0}function u(n,t,e,r){var u,i=-1,a=n.length,o=e.x,c=e.y,s=t?l(n.area/t):0;
	if(t==e.dx){for((r||s>e.dy)&&(s=e.dy);++i<a;)u=n[i],u.x=o,u.y=c,u.dy=s,o+=u.dx=Math.min(e.x+e.dx-o,s?l(u.area/s):0);u.z=!0,u.dx+=e.x+e.dx-o,e.y+=s,e.dy-=s}else{for((r||s>e.dx)&&(s=e.dx);++i<a;)u=n[i],u.x=o,u.y=c,u.dx=s,c+=u.dy=Math.min(e.y+e.dy-c,s?l(u.area/s):0);u.z=!1,u.dy+=e.y+e.dy-c,e.x+=s,e.dx-=s}}function i(r){var u=a||o(r),i=u[0];return i.x=i.y=0,i.value?(i.dx=c[0],i.dy=c[1]):i.dx=i.dy=0,a&&o.revalue(i),n([i],i.dx*i.dy/i.value),(a?e:t)(i),h&&(a=u),u}var a,o=oa.layout.hierarchy(),l=Math.round,c=[1,1],s=null,f=Ou,h=!1,g="squarify",p=.5*(1+Math.sqrt(5));return i.size=function(n){return arguments.length?(c=n,i):c},i.padding=function(n){function t(t){var e=n.call(i,t,t.depth);return null==e?Ou(t):Iu(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Iu(t,n)}if(!arguments.length)return s;var r;return f=null==(s=n)?Ou:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,i},i.round=function(n){return arguments.length?(l=n?Math.round:Number,i):l!=Number},i.sticky=function(n){return arguments.length?(h=n,a=null,i):h},i.ratio=function(n){return arguments.length?(p=n,i):p},i.mode=function(n){return arguments.length?(g=n+"",i):g},uu(i,o)},oa.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,u;do e=2*Math.random()-1,r=2*Math.random()-1,u=e*e+r*r;while(!u||u>1);return n+t*e*Math.sqrt(-2*Math.log(u)/u)}},logNormal:function(){var n=oa.random.normal.apply(oa,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=oa.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t}}},oa.scale={};var Sl={floor:y,ceil:y};oa.scale.linear=function(){return Wu([0,1],[0,1],Mr,!1)};var kl={s:1,g:1,p:1,r:1,e:1};oa.scale.log=function(){return ri(oa.scale.linear().domain([0,1]),10,!0,[1,10])};var Nl=oa.format(".0e"),El={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};oa.scale.pow=function(){return ui(oa.scale.linear(),1,[0,1])},oa.scale.sqrt=function(){return oa.scale.pow().exponent(.5)},oa.scale.ordinal=function(){return ai([],{t:"range",a:[[]]})},oa.scale.category10=function(){return oa.scale.ordinal().range(Al)},oa.scale.category20=function(){return oa.scale.ordinal().range(Cl)},oa.scale.category20b=function(){return oa.scale.ordinal().range(zl)},oa.scale.category20c=function(){return oa.scale.ordinal().range(Ll)};var Al=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(xn),Cl=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(xn),zl=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(xn),Ll=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(xn);oa.scale.quantile=function(){return oi([],[])},oa.scale.quantize=function(){return li(0,1,[0,1])},oa.scale.threshold=function(){return ci([.5],[0,1])},oa.scale.identity=function(){return si([0,1])},oa.svg={},oa.svg.arc=function(){function n(){var n=Math.max(0,+e.apply(this,arguments)),c=Math.max(0,+r.apply(this,arguments)),s=a.apply(this,arguments)-Oa,f=o.apply(this,arguments)-Oa,h=Math.abs(f-s),g=s>f?0:1;if(n>c&&(p=c,c=n,n=p),h>=Ha)return t(c,g)+(n?t(n,1-g):"")+"Z";var p,v,d,m,y,M,x,b,_,w,S,k,N=0,E=0,A=[];if((m=(+l.apply(this,arguments)||0)/2)&&(d=i===ql?Math.sqrt(n*n+c*c):+i.apply(this,arguments),g||(E*=-1),c&&(E=tn(d/c*Math.sin(m))),n&&(N=tn(d/n*Math.sin(m)))),c){y=c*Math.cos(s+E),M=c*Math.sin(s+E),x=c*Math.cos(f-E),b=c*Math.sin(f-E);var C=Math.abs(f-s-2*E)<=ja?0:1;if(E&&mi(y,M,x,b)===g^C){var z=(s+f)/2;y=c*Math.cos(z),M=c*Math.sin(z),x=b=null}}else y=M=0;if(n){_=n*Math.cos(f-N),w=n*Math.sin(f-N),S=n*Math.cos(s+N),k=n*Math.sin(s+N);var L=Math.abs(s-f+2*N)<=ja?0:1;if(N&&mi(_,w,S,k)===1-g^L){var q=(s+f)/2;_=n*Math.cos(q),w=n*Math.sin(q),S=k=null}}else _=w=0;if(h>Pa&&(p=Math.min(Math.abs(c-n)/2,+u.apply(this,arguments)))>.001){v=c>n^g?0:1;var T=p,R=p;if(ja>h){var D=null==S?[_,w]:null==x?[y,M]:Re([y,M],[S,k],[x,b],[_,w]),P=y-D[0],U=M-D[1],j=x-D[0],F=b-D[1],H=1/Math.sin(Math.acos((P*j+U*F)/(Math.sqrt(P*P+U*U)*Math.sqrt(j*j+F*F)))/2),O=Math.sqrt(D[0]*D[0]+D[1]*D[1]);R=Math.min(p,(n-O)/(H-1)),T=Math.min(p,(c-O)/(H+1))}if(null!=x){var I=yi(null==S?[_,w]:[S,k],[y,M],c,T,g),Y=yi([x,b],[_,w],c,T,g);p===T?A.push("M",I[0],"A",T,",",T," 0 0,",v," ",I[1],"A",c,",",c," 0 ",1-g^mi(I[1][0],I[1][1],Y[1][0],Y[1][1]),",",g," ",Y[1],"A",T,",",T," 0 0,",v," ",Y[0]):A.push("M",I[0],"A",T,",",T," 0 1,",v," ",Y[0])}else A.push("M",y,",",M);if(null!=S){var Z=yi([y,M],[S,k],n,-R,g),V=yi([_,w],null==x?[y,M]:[x,b],n,-R,g);p===R?A.push("L",V[0],"A",R,",",R," 0 0,",v," ",V[1],"A",n,",",n," 0 ",g^mi(V[1][0],V[1][1],Z[1][0],Z[1][1]),",",1-g," ",Z[1],"A",R,",",R," 0 0,",v," ",Z[0]):A.push("L",V[0],"A",R,",",R," 0 0,",v," ",Z[0])}else A.push("L",_,",",w)}else A.push("M",y,",",M),null!=x&&A.push("A",c,",",c," 0 ",C,",",g," ",x,",",b),A.push("L",_,",",w),null!=S&&A.push("A",n,",",n," 0 ",L,",",1-g," ",S,",",k);return A.push("Z"),A.join("")}function t(n,t){return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}var e=hi,r=gi,u=fi,i=ql,a=pi,o=vi,l=di;return n.innerRadius=function(t){return arguments.length?(e=En(t),n):e},n.outerRadius=function(t){return arguments.length?(r=En(t),n):r},n.cornerRadius=function(t){return arguments.length?(u=En(t),n):u},n.padRadius=function(t){return arguments.length?(i=t==ql?ql:En(t),n):i},n.startAngle=function(t){return arguments.length?(a=En(t),n):a},n.endAngle=function(t){return arguments.length?(o=En(t),n):o},n.padAngle=function(t){return arguments.length?(l=En(t),n):l},n.centroid=function(){var n=(+e.apply(this,arguments)+ +r.apply(this,arguments))/2,t=(+a.apply(this,arguments)+ +o.apply(this,arguments))/2-Oa;return[Math.cos(t)*n,Math.sin(t)*n]},n};var ql="auto";oa.svg.line=function(){return Mi(y)};var Tl=oa.map({linear:xi,"linear-closed":bi,step:_i,"step-before":wi,"step-after":Si,basis:zi,"basis-open":Li,"basis-closed":qi,bundle:Ti,cardinal:Ei,"cardinal-open":ki,"cardinal-closed":Ni,monotone:Fi});Tl.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var Rl=[0,2/3,1/3,0],Dl=[0,1/3,2/3,0],Pl=[0,1/6,2/3,1/6];oa.svg.line.radial=function(){var n=Mi(Hi);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},wi.reverse=Si,Si.reverse=wi,oa.svg.area=function(){return Oi(y)},oa.svg.area.radial=function(){var n=Oi(Hi);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},oa.svg.chord=function(){function n(n,o){var l=t(this,i,n,o),c=t(this,a,n,o);return"M"+l.p0+r(l.r,l.p1,l.a1-l.a0)+(e(l,c)?u(l.r,l.p1,l.r,l.p0):u(l.r,l.p1,c.r,c.p0)+r(c.r,c.p1,c.a1-c.a0)+u(c.r,c.p1,l.r,l.p0))+"Z"}function t(n,t,e,r){var u=t.call(n,e,r),i=o.call(n,u,r),a=l.call(n,u,r)-Oa,s=c.call(n,u,r)-Oa;return{r:i,a0:a,a1:s,p0:[i*Math.cos(a),i*Math.sin(a)],p1:[i*Math.cos(s),i*Math.sin(s)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>ja)+",1 "+t}function u(n,t,e,r){return"Q 0,0 "+r}var i=Me,a=xe,o=Ii,l=pi,c=vi;return n.radius=function(t){return arguments.length?(o=En(t),n):o},n.source=function(t){return arguments.length?(i=En(t),n):i},n.target=function(t){return arguments.length?(a=En(t),n):a},n.startAngle=function(t){return arguments.length?(l=En(t),n):l},n.endAngle=function(t){return arguments.length?(c=En(t),n):c},n},oa.svg.diagonal=function(){function n(n,u){var i=t.call(this,n,u),a=e.call(this,n,u),o=(i.y+a.y)/2,l=[i,{x:i.x,y:o},{x:a.x,y:o},a];return l=l.map(r),"M"+l[0]+"C"+l[1]+" "+l[2]+" "+l[3]}var t=Me,e=xe,r=Yi;return n.source=function(e){return arguments.length?(t=En(e),n):t},n.target=function(t){return arguments.length?(e=En(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},oa.svg.diagonal.radial=function(){var n=oa.svg.diagonal(),t=Yi,e=n.projection;return n.projection=function(n){return arguments.length?e(Zi(t=n)):t},n},oa.svg.symbol=function(){function n(n,r){return(Ul.get(t.call(this,n,r))||$i)(e.call(this,n,r))}var t=Xi,e=Vi;return n.type=function(e){return arguments.length?(t=En(e),n):t},n.size=function(t){return arguments.length?(e=En(t),n):e},n};var Ul=oa.map({circle:$i,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Fl)),e=t*Fl;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/jl),e=t*jl/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/jl),e=t*jl/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});oa.svg.symbolTypes=Ul.keys();var jl=Math.sqrt(3),Fl=Math.tan(30*Ia);Aa.transition=function(n){for(var t,e,r=Hl||++Zl,u=Ki(n),i=[],a=Ol||{time:Date.now(),ease:Nr,delay:0,duration:250},o=-1,l=this.length;++o<l;){i.push(t=[]);for(var c=this[o],s=-1,f=c.length;++s<f;)(e=c[s])&&Qi(e,s,u,r,a),t.push(e)}return Wi(i,u,r)},Aa.interrupt=function(n){return this.each(null==n?Il:Bi(Ki(n)))};var Hl,Ol,Il=Bi(Ki()),Yl=[],Zl=0;Yl.call=Aa.call,Yl.empty=Aa.empty,Yl.node=Aa.node,Yl.size=Aa.size,oa.transition=function(n,t){return n&&n.transition?Hl?n.transition(t):n:oa.selection().transition(n)},oa.transition.prototype=Yl,Yl.select=function(n){var t,e,r,u=this.id,i=this.namespace,a=[];n=A(n);for(var o=-1,l=this.length;++o<l;){a.push(t=[]);for(var c=this[o],s=-1,f=c.length;++s<f;)(r=c[s])&&(e=n.call(r,r.__data__,s,o))?("__data__"in r&&(e.__data__=r.__data__),Qi(e,s,i,u,r[i][u]),t.push(e)):t.push(null)}return Wi(a,i,u)},Yl.selectAll=function(n){var t,e,r,u,i,a=this.id,o=this.namespace,l=[];n=C(n);for(var c=-1,s=this.length;++c<s;)for(var f=this[c],h=-1,g=f.length;++h<g;)if(r=f[h]){i=r[o][a],e=n.call(r,r.__data__,h,c),l.push(t=[]);for(var p=-1,v=e.length;++p<v;)(u=e[p])&&Qi(u,p,o,a,i),t.push(u)}return Wi(l,o,a)},Yl.filter=function(n){var t,e,r,u=[];"function"!=typeof n&&(n=O(n));for(var i=0,a=this.length;a>i;i++){u.push(t=[]);for(var e=this[i],o=0,l=e.length;l>o;o++)(r=e[o])&&n.call(r,r.__data__,o,i)&&t.push(r)}return Wi(u,this.namespace,this.id)},Yl.tween=function(n,t){var e=this.id,r=this.namespace;return arguments.length<2?this.node()[r][e].tween.get(n):Y(this,null==t?function(t){t[r][e].tween.remove(n)}:function(u){u[r][e].tween.set(n,t)})},Yl.attr=function(n,t){function e(){this.removeAttribute(o)}function r(){this.removeAttributeNS(o.space,o.local)}function u(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(o);return e!==n&&(t=a(e,n),function(n){this.setAttribute(o,t(n))})})}function i(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(o.space,o.local);return e!==n&&(t=a(e,n),function(n){this.setAttributeNS(o.space,o.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var a="transform"==n?$r:Mr,o=oa.ns.qualify(n);return Ji(this,"attr."+n,t,o.local?i:u)},Yl.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(u));return r&&function(n){this.setAttribute(u,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(u.space,u.local));return r&&function(n){this.setAttributeNS(u.space,u.local,r(n))}}var u=oa.ns.qualify(n);return this.tween("attr."+n,u.local?r:e)},Yl.style=function(n,e,r){function u(){this.style.removeProperty(n)}function i(e){return null==e?u:(e+="",function(){var u,i=t(this).getComputedStyle(this,null).getPropertyValue(n);return i!==e&&(u=Mr(i,e),function(t){this.style.setProperty(n,u(t),r)})})}var a=arguments.length;if(3>a){if("string"!=typeof n){2>a&&(e="");for(r in n)this.style(r,n[r],e);return this}r=""}return Ji(this,"style."+n,e,i)},Yl.styleTween=function(n,e,r){function u(u,i){var a=e.call(this,u,i,t(this).getComputedStyle(this,null).getPropertyValue(n));return a&&function(t){this.style.setProperty(n,a(t),r)}}return arguments.length<3&&(r=""),this.tween("style."+n,u)},Yl.text=function(n){return Ji(this,"text",n,Gi)},Yl.remove=function(){var n=this.namespace;return this.each("end.transition",function(){var t;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)})},Yl.ease=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].ease:("function"!=typeof n&&(n=oa.ease.apply(oa,arguments)),Y(this,function(r){r[e][t].ease=n}))},Yl.delay=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].delay:Y(this,"function"==typeof n?function(r,u,i){r[e][t].delay=+n.call(r,r.__data__,u,i)}:(n=+n,function(r){r[e][t].delay=n}))},Yl.duration=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].duration:Y(this,"function"==typeof n?function(r,u,i){r[e][t].duration=Math.max(1,n.call(r,r.__data__,u,i))}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Yl.each=function(n,t){var e=this.id,r=this.namespace;if(arguments.length<2){var u=Ol,i=Hl;try{Hl=e,Y(this,function(t,u,i){Ol=t[r][e],n.call(t,t.__data__,u,i)})}finally{Ol=u,Hl=i}}else Y(this,function(u){var i=u[r][e];(i.event||(i.event=oa.dispatch("start","end","interrupt"))).on(n,t)});return this},Yl.transition=function(){for(var n,t,e,r,u=this.id,i=++Zl,a=this.namespace,o=[],l=0,c=this.length;c>l;l++){o.push(n=[]);for(var t=this[l],s=0,f=t.length;f>s;s++)(e=t[s])&&(r=e[a][u],Qi(e,s,a,i,{time:r.time,ease:r.ease,delay:r.delay+r.duration,duration:r.duration})),n.push(e)}return Wi(o,a,i)},oa.svg.axis=function(){function n(n){n.each(function(){var n,c=oa.select(this),s=this.__chart__||e,f=this.__chart__=e.copy(),h=null==l?f.ticks?f.ticks.apply(f,o):f.domain():l,g=null==t?f.tickFormat?f.tickFormat.apply(f,o):y:t,p=c.selectAll(".tick").data(h,f),v=p.enter().insert("g",".domain").attr("class","tick").style("opacity",Pa),d=oa.transition(p.exit()).style("opacity",Pa).remove(),m=oa.transition(p.order()).style("opacity",1),M=Math.max(u,0)+a,x=Zu(f),b=c.selectAll(".domain").data([0]),_=(b.enter().append("path").attr("class","domain"),oa.transition(b));v.append("line"),v.append("text");var w,S,k,N,E=v.select("line"),A=m.select("line"),C=p.select("text").text(g),z=v.select("text"),L=m.select("text"),q="top"===r||"left"===r?-1:1;if("bottom"===r||"top"===r?(n=na,w="x",k="y",S="x2",N="y2",C.attr("dy",0>q?"0em":".71em").style("text-anchor","middle"),_.attr("d","M"+x[0]+","+q*i+"V0H"+x[1]+"V"+q*i)):(n=ta,w="y",k="x",S="y2",N="x2",C.attr("dy",".32em").style("text-anchor",0>q?"end":"start"),_.attr("d","M"+q*i+","+x[0]+"H0V"+x[1]+"H"+q*i)),E.attr(N,q*u),z.attr(k,q*M),A.attr(S,0).attr(N,q*u),L.attr(w,0).attr(k,q*M),f.rangeBand){var T=f,R=T.rangeBand()/2;s=f=function(n){return T(n)+R}}else s.rangeBand?s=f:d.call(n,f,s);v.call(n,s,f),m.call(n,f,f)})}var t,e=oa.scale.linear(),r=Vl,u=6,i=6,a=3,o=[10],l=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Xl?t+"":Vl,n):r},n.ticks=function(){return arguments.length?(o=ca(arguments),n):o},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(u=+t,i=+arguments[e-1],n):u},n.innerTickSize=function(t){return arguments.length?(u=+t,n):u},n.outerTickSize=function(t){return arguments.length?(i=+t,n):i},n.tickPadding=function(t){return arguments.length?(a=+t,n):a},n.tickSubdivide=function(){return arguments.length&&n},n};var Vl="bottom",Xl={top:1,right:1,bottom:1,left:1};oa.svg.brush=function(){function n(t){t.each(function(){var t=oa.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",i).on("touchstart.brush",i),a=t.selectAll(".background").data([0]);a.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),t.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var o=t.selectAll(".resize").data(v,y);o.exit().remove(),o.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return $l[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),o.style("display",n.empty()?"none":null);var l,f=oa.transition(t),h=oa.transition(a);c&&(l=Zu(c),h.attr("x",l[0]).attr("width",l[1]-l[0]),r(f)),s&&(l=Zu(s),h.attr("y",l[0]).attr("height",l[1]-l[0]),u(f)),e(f)})}function e(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+f[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function r(n){n.select(".extent").attr("x",f[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",f[1]-f[0])}function u(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function i(){function i(){32==oa.event.keyCode&&(C||(M=null,L[0]-=f[1],L[1]-=h[1],C=2),S())}function v(){32==oa.event.keyCode&&2==C&&(L[0]+=f[1],L[1]+=h[1],C=0,S())}function d(){var n=oa.mouse(b),t=!1;x&&(n[0]+=x[0],n[1]+=x[1]),C||(oa.event.altKey?(M||(M=[(f[0]+f[1])/2,(h[0]+h[1])/2]),L[0]=f[+(n[0]<M[0])],L[1]=h[+(n[1]<M[1])]):M=null),E&&m(n,c,0)&&(r(k),t=!0),A&&m(n,s,1)&&(u(k),t=!0),t&&(e(k),w({type:"brush",mode:C?"move":"resize"}))}function m(n,t,e){var r,u,i=Zu(t),l=i[0],c=i[1],s=L[e],v=e?h:f,d=v[1]-v[0];return C&&(l-=s,c-=d+s),r=(e?p:g)?Math.max(l,Math.min(c,n[e])):n[e],C?u=(r+=s)+d:(M&&(s=Math.max(l,Math.min(c,2*M[e]-r))),r>s?(u=r,r=s):u=s),v[0]!=r||v[1]!=u?(e?o=null:a=null,v[0]=r,v[1]=u,!0):void 0}function y(){d(),k.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),oa.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),z(),w({type:"brushend"})}var M,x,b=this,_=oa.select(oa.event.target),w=l.of(b,arguments),k=oa.select(b),N=_.datum(),E=!/^(n|s)$/.test(N)&&c,A=!/^(e|w)$/.test(N)&&s,C=_.classed("extent"),z=W(b),L=oa.mouse(b),q=oa.select(t(b)).on("keydown.brush",i).on("keyup.brush",v);if(oa.event.changedTouches?q.on("touchmove.brush",d).on("touchend.brush",y):q.on("mousemove.brush",d).on("mouseup.brush",y),k.interrupt().selectAll("*").interrupt(),C)L[0]=f[0]-L[0],L[1]=h[0]-L[1];else if(N){var T=+/w$/.test(N),R=+/^n/.test(N);x=[f[1-T]-L[0],h[1-R]-L[1]],L[0]=f[T],L[1]=h[R]}else oa.event.altKey&&(M=L.slice());k.style("pointer-events","none").selectAll(".resize").style("display",null),oa.select("body").style("cursor",_.style("cursor")),w({type:"brushstart"}),d()}var a,o,l=N(n,"brushstart","brush","brushend"),c=null,s=null,f=[0,0],h=[0,0],g=!0,p=!0,v=Bl[0];return n.event=function(n){n.each(function(){var n=l.of(this,arguments),t={x:f,y:h,i:a,j:o},e=this.__chart__||t;this.__chart__=t,Hl?oa.select(this).transition().each("start.brush",function(){a=e.i,o=e.j,f=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=xr(f,t.x),r=xr(h,t.y);return a=o=null,function(u){f=t.x=e(u),h=t.y=r(u),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){a=t.i,o=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(c=t,v=Bl[!c<<1|!s],n):c},n.y=function(t){return arguments.length?(s=t,v=Bl[!c<<1|!s],n):s},n.clamp=function(t){return arguments.length?(c&&s?(g=!!t[0],p=!!t[1]):c?g=!!t:s&&(p=!!t),n):c&&s?[g,p]:c?g:s?p:null},n.extent=function(t){var e,r,u,i,l;return arguments.length?(c&&(e=t[0],r=t[1],s&&(e=e[0],r=r[0]),a=[e,r],c.invert&&(e=c(e),r=c(r)),e>r&&(l=e,e=r,r=l),(e!=f[0]||r!=f[1])&&(f=[e,r])),s&&(u=t[0],i=t[1],c&&(u=u[1],i=i[1]),o=[u,i],s.invert&&(u=s(u),i=s(i)),u>i&&(l=u,u=i,i=l),(u!=h[0]||i!=h[1])&&(h=[u,i])),n):(c&&(a?(e=a[0],r=a[1]):(e=f[0],r=f[1],c.invert&&(e=c.invert(e),r=c.invert(r)),e>r&&(l=e,e=r,r=l))),s&&(o?(u=o[0],i=o[1]):(u=h[0],i=h[1],s.invert&&(u=s.invert(u),i=s.invert(i)),u>i&&(l=u,u=i,i=l))),c&&s?[[e,u],[r,i]]:c?[e,r]:s&&[u,i])},n.clear=function(){return n.empty()||(f=[0,0],h=[0,0],a=o=null),n},n.empty=function(){return!!c&&f[0]==f[1]||!!s&&h[0]==h[1]},oa.rebind(n,l,"on")};var $l={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Bl=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Wl=go.format=xo.timeFormat,Jl=Wl.utc,Gl=Jl("%Y-%m-%dT%H:%M:%S.%LZ");Wl.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?ea:Gl,ea.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},ea.toString=Gl.toString,go.second=On(function(n){return new po(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),go.seconds=go.second.range,go.seconds.utc=go.second.utc.range,go.minute=On(function(n){return new po(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),go.minutes=go.minute.range,go.minutes.utc=go.minute.utc.range,go.hour=On(function(n){var t=n.getTimezoneOffset()/60;return new po(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),go.hours=go.hour.range,go.hours.utc=go.hour.utc.range,go.month=On(function(n){return n=go.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),go.months=go.month.range,go.months.utc=go.month.utc.range;var Kl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],Ql=[[go.second,1],[go.second,5],[go.second,15],[go.second,30],[go.minute,1],[go.minute,5],[go.minute,15],[go.minute,30],[go.hour,1],[go.hour,3],[go.hour,6],[go.hour,12],[go.day,1],[go.day,2],[go.week,1],[go.month,1],[go.month,3],[go.year,1]],nc=Wl.multi([[".%L",function(n){return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){return n.getMonth()}],["%Y",zt]]),tc={range:function(n,t,e){return oa.range(Math.ceil(n/e)*e,+t,e).map(ua)},floor:y,ceil:y};Ql.year=go.year,go.scale=function(){return ra(oa.scale.linear(),Ql,nc)};var ec=Ql.map(function(n){return[n[0].utc,n[1]]}),rc=Jl.multi([[".%L",function(n){return n.getUTCMilliseconds()}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){return n.getUTCMonth()}],["%Y",zt]]);ec.year=go.year.utc,go.scale.utc=function(){return ra(oa.scale.linear(),ec,rc)},oa.text=An(function(n){return n.responseText}),oa.json=function(n,t){return Cn(n,"application/json",ia,t)},oa.html=function(n,t){return Cn(n,"text/html",aa,t)},oa.xml=An(function(n){return n.responseXML}), true?(this.d3=oa,!(__WEBPACK_AMD_DEFINE_FACTORY__ = (oa), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))):"object"==typeof module&&module.exports?module.exports=oa:this.d3=oa}();

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    u  = {};
	
	dl.extend(u, __webpack_require__(65));
	module.exports = dl.extend(u, dl);

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18);
	
	var TIME    = 'time',
	    UTC     = 'utc',
	    STRING  = 'string',
	    ORDINAL = 'ordinal',
	    NUMBER  = 'number';
	
	function getTickFormat(scale, tickCount, tickFormatType, tickFormatString) {
	  var formatType = tickFormatType || inferFormatType(scale);
	  return getFormatter(scale, tickCount, formatType, tickFormatString);
	}
	
	function inferFormatType(scale) {
	  switch (scale.type) {
	    case TIME:    return TIME;
	    case UTC:     return UTC;
	    case ORDINAL: return STRING;
	    default:      return NUMBER;
	  }
	}
	
	// Adapted from d3 log scale
	// TODO customize? replace with range-size-aware filtering?
	function logFilter(scale, domain, count, f) {
	  if (count == null) return f;
	  var base = scale.base(),
	      k = Math.min(base, scale.ticks().length / count),
	      v = domain[0] > 0 ? (e = 1e-12, Math.ceil) : (e = -1e-12, Math.floor),
	      e;
	  function log(x) {
	    return (domain[0] < 0 ?
	      -Math.log(x > 0 ? 0 : -x) :
	      Math.log(x < 0 ? 0 : x)) / Math.log(base);
	  }
	  function pow(x) {
	    return domain[0] < 0 ? -Math.pow(base, -x) : Math.pow(base, x);
	  }
	  return function(d) {
	    return pow(v(log(d) + e)) / d >= k ? f(d) : '';
	  };
	}
	
	function getFormatter(scale, tickCount, formatType, str) {
	  var fmt = dl.format,
	      log = scale.type === 'log',
	      domain;
	
	  switch (formatType) {
	    case NUMBER:
	      domain = scale.domain();
	      return log ?
	        logFilter(scale, domain, tickCount, fmt.auto.number(str || null)) :
	        fmt.auto.linear(domain, tickCount, str || null);
	    case TIME: return (str ? fmt : fmt.auto).time(str);
	    case UTC:  return (str ? fmt : fmt.auto).utc(str);
	    default:   return String;
	  }
	}
	
	module.exports = {
	  getTickFormat: getTickFormat
	};

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  path:       __webpack_require__(67),
	  render:     __webpack_require__(71),
	  Item:       __webpack_require__(103),
	  bound:      __webpack_require__(90),
	  Bounds:     __webpack_require__(89),
	  canvas:     __webpack_require__(92),
	  Gradient:   __webpack_require__(104),
	  toJSON:     __webpack_require__(105).toJSON,
	  fromJSON:   __webpack_require__(105).fromJSON
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  parse:  __webpack_require__(68),
	  render: __webpack_require__(69)
	};


/***/ },
/* 68 */
/***/ function(module, exports) {

	// Path parsing and rendering code adapted from fabric.js -- Thanks!
	var cmdlen = { m:2, l:2, h:1, v:1, c:6, s:4, q:4, t:2, a:7 },
	    regexp = [/([MLHVCSQTAZmlhvcsqtaz])/g, /###/, /(\d)([-+])/g, /\s|,|###/];
	
	module.exports = function(pathstr) {
	  var result = [],
	      path,
	      curr,
	      chunks,
	      parsed, param,
	      cmd, len, i, j, n, m;
	
	  // First, break path into command sequence
	  path = pathstr
	    .slice()
	    .replace(regexp[0], '###$1')
	    .split(regexp[1])
	    .slice(1);
	
	  // Next, parse each command in turn
	  for (i=0, n=path.length; i<n; ++i) {
	    curr = path[i];
	    chunks = curr
	      .slice(1)
	      .trim()
	      .replace(regexp[2],'$1###$2')
	      .split(regexp[3]);
	    cmd = curr.charAt(0);
	
	    parsed = [cmd];
	    for (j=0, m=chunks.length; j<m; ++j) {
	      if ((param = +chunks[j]) === param) { // not NaN
	        parsed.push(param);
	      }
	    }
	
	    len = cmdlen[cmd.toLowerCase()];
	    if (parsed.length-1 > len) {
	      for (j=1, m=parsed.length; j<m; j+=len) {
	        result.push([cmd].concat(parsed.slice(j, j+len)));
	      }
	    }
	    else {
	      result.push(parsed);
	    }
	  }
	
	  return result;
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var arc = __webpack_require__(70);
	
	module.exports = function(g, path, l, t) {
	  var current, // current instruction
	      previous = null,
	      x = 0, // current x
	      y = 0, // current y
	      controlX = 0, // current control point x
	      controlY = 0, // current control point y
	      tempX,
	      tempY,
	      tempControlX,
	      tempControlY;
	
	  if (l == null) l = 0;
	  if (t == null) t = 0;
	
	  g.beginPath();
	
	  for (var i=0, len=path.length; i<len; ++i) {
	    current = path[i];
	
	    switch (current[0]) { // first letter
	
	      case 'l': // lineto, relative
	        x += current[1];
	        y += current[2];
	        g.lineTo(x + l, y + t);
	        break;
	
	      case 'L': // lineto, absolute
	        x = current[1];
	        y = current[2];
	        g.lineTo(x + l, y + t);
	        break;
	
	      case 'h': // horizontal lineto, relative
	        x += current[1];
	        g.lineTo(x + l, y + t);
	        break;
	
	      case 'H': // horizontal lineto, absolute
	        x = current[1];
	        g.lineTo(x + l, y + t);
	        break;
	
	      case 'v': // vertical lineto, relative
	        y += current[1];
	        g.lineTo(x + l, y + t);
	        break;
	
	      case 'V': // verical lineto, absolute
	        y = current[1];
	        g.lineTo(x + l, y + t);
	        break;
	
	      case 'm': // moveTo, relative
	        x += current[1];
	        y += current[2];
	        g.moveTo(x + l, y + t);
	        break;
	
	      case 'M': // moveTo, absolute
	        x = current[1];
	        y = current[2];
	        g.moveTo(x + l, y + t);
	        break;
	
	      case 'c': // bezierCurveTo, relative
	        tempX = x + current[5];
	        tempY = y + current[6];
	        controlX = x + current[3];
	        controlY = y + current[4];
	        g.bezierCurveTo(
	          x + current[1] + l, // x1
	          y + current[2] + t, // y1
	          controlX + l, // x2
	          controlY + t, // y2
	          tempX + l,
	          tempY + t
	        );
	        x = tempX;
	        y = tempY;
	        break;
	
	      case 'C': // bezierCurveTo, absolute
	        x = current[5];
	        y = current[6];
	        controlX = current[3];
	        controlY = current[4];
	        g.bezierCurveTo(
	          current[1] + l,
	          current[2] + t,
	          controlX + l,
	          controlY + t,
	          x + l,
	          y + t
	        );
	        break;
	
	      case 's': // shorthand cubic bezierCurveTo, relative
	        // transform to absolute x,y
	        tempX = x + current[3];
	        tempY = y + current[4];
	        // calculate reflection of previous control points
	        controlX = 2 * x - controlX;
	        controlY = 2 * y - controlY;
	        g.bezierCurveTo(
	          controlX + l,
	          controlY + t,
	          x + current[1] + l,
	          y + current[2] + t,
	          tempX + l,
	          tempY + t
	        );
	
	        // set control point to 2nd one of this command
	        // the first control point is assumed to be the reflection of
	        // the second control point on the previous command relative
	        // to the current point.
	        controlX = x + current[1];
	        controlY = y + current[2];
	
	        x = tempX;
	        y = tempY;
	        break;
	
	      case 'S': // shorthand cubic bezierCurveTo, absolute
	        tempX = current[3];
	        tempY = current[4];
	        // calculate reflection of previous control points
	        controlX = 2*x - controlX;
	        controlY = 2*y - controlY;
	        g.bezierCurveTo(
	          controlX + l,
	          controlY + t,
	          current[1] + l,
	          current[2] + t,
	          tempX + l,
	          tempY + t
	        );
	        x = tempX;
	        y = tempY;
	        // set control point to 2nd one of this command
	        // the first control point is assumed to be the reflection of
	        // the second control point on the previous command relative
	        // to the current point.
	        controlX = current[1];
	        controlY = current[2];
	
	        break;
	
	      case 'q': // quadraticCurveTo, relative
	        // transform to absolute x,y
	        tempX = x + current[3];
	        tempY = y + current[4];
	
	        controlX = x + current[1];
	        controlY = y + current[2];
	
	        g.quadraticCurveTo(
	          controlX + l,
	          controlY + t,
	          tempX + l,
	          tempY + t
	        );
	        x = tempX;
	        y = tempY;
	        break;
	
	      case 'Q': // quadraticCurveTo, absolute
	        tempX = current[3];
	        tempY = current[4];
	
	        g.quadraticCurveTo(
	          current[1] + l,
	          current[2] + t,
	          tempX + l,
	          tempY + t
	        );
	        x = tempX;
	        y = tempY;
	        controlX = current[1];
	        controlY = current[2];
	        break;
	
	      case 't': // shorthand quadraticCurveTo, relative
	
	        // transform to absolute x,y
	        tempX = x + current[1];
	        tempY = y + current[2];
	
	        if (previous[0].match(/[QqTt]/) === null) {
	          // If there is no previous command or if the previous command was not a Q, q, T or t,
	          // assume the control point is coincident with the current point
	          controlX = x;
	          controlY = y;
	        }
	        else if (previous[0] === 't') {
	          // calculate reflection of previous control points for t
	          controlX = 2 * x - tempControlX;
	          controlY = 2 * y - tempControlY;
	        }
	        else if (previous[0] === 'q') {
	          // calculate reflection of previous control points for q
	          controlX = 2 * x - controlX;
	          controlY = 2 * y - controlY;
	        }
	
	        tempControlX = controlX;
	        tempControlY = controlY;
	
	        g.quadraticCurveTo(
	          controlX + l,
	          controlY + t,
	          tempX + l,
	          tempY + t
	        );
	        x = tempX;
	        y = tempY;
	        controlX = x + current[1];
	        controlY = y + current[2];
	        break;
	
	      case 'T':
	        tempX = current[1];
	        tempY = current[2];
	
	        // calculate reflection of previous control points
	        controlX = 2 * x - controlX;
	        controlY = 2 * y - controlY;
	        g.quadraticCurveTo(
	          controlX + l,
	          controlY + t,
	          tempX + l,
	          tempY + t
	        );
	        x = tempX;
	        y = tempY;
	        break;
	
	      case 'a':
	        drawArc(g, x + l, y + t, [
	          current[1],
	          current[2],
	          current[3],
	          current[4],
	          current[5],
	          current[6] + x + l,
	          current[7] + y + t
	        ]);
	        x += current[6];
	        y += current[7];
	        break;
	
	      case 'A':
	        drawArc(g, x + l, y + t, [
	          current[1],
	          current[2],
	          current[3],
	          current[4],
	          current[5],
	          current[6] + l,
	          current[7] + t
	        ]);
	        x = current[6];
	        y = current[7];
	        break;
	
	      case 'z':
	      case 'Z':
	        g.closePath();
	        break;
	    }
	    previous = current;
	  }
	};
	
	function drawArc(g, x, y, coords) {
	  var seg = arc.segments(
	    coords[5], // end x
	    coords[6], // end y
	    coords[0], // radius x
	    coords[1], // radius y
	    coords[3], // large flag
	    coords[4], // sweep flag
	    coords[2], // rotation
	    x, y
	  );
	  for (var i=0; i<seg.length; ++i) {
	    var bez = arc.bezier(seg[i]);
	    g.bezierCurveTo.apply(g, bez);
	  }
	}


/***/ },
/* 70 */
/***/ function(module, exports) {

	var segmentCache = {},
	    bezierCache = {},
	    join = [].join;
	
	// Copied from Inkscape svgtopdf, thanks!
	function segments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
	  var key = join.call(arguments);
	  if (segmentCache[key]) {
	    return segmentCache[key];
	  }
	
	  var th = rotateX * (Math.PI/180);
	  var sin_th = Math.sin(th);
	  var cos_th = Math.cos(th);
	  rx = Math.abs(rx);
	  ry = Math.abs(ry);
	  var px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
	  var py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
	  var pl = (px*px) / (rx*rx) + (py*py) / (ry*ry);
	  if (pl > 1) {
	    pl = Math.sqrt(pl);
	    rx *= pl;
	    ry *= pl;
	  }
	
	  var a00 = cos_th / rx;
	  var a01 = sin_th / rx;
	  var a10 = (-sin_th) / ry;
	  var a11 = (cos_th) / ry;
	  var x0 = a00 * ox + a01 * oy;
	  var y0 = a10 * ox + a11 * oy;
	  var x1 = a00 * x + a01 * y;
	  var y1 = a10 * x + a11 * y;
	
	  var d = (x1-x0) * (x1-x0) + (y1-y0) * (y1-y0);
	  var sfactor_sq = 1 / d - 0.25;
	  if (sfactor_sq < 0) sfactor_sq = 0;
	  var sfactor = Math.sqrt(sfactor_sq);
	  if (sweep == large) sfactor = -sfactor;
	  var xc = 0.5 * (x0 + x1) - sfactor * (y1-y0);
	  var yc = 0.5 * (y0 + y1) + sfactor * (x1-x0);
	
	  var th0 = Math.atan2(y0-yc, x0-xc);
	  var th1 = Math.atan2(y1-yc, x1-xc);
	
	  var th_arc = th1-th0;
	  if (th_arc < 0 && sweep === 1){
	    th_arc += 2 * Math.PI;
	  } else if (th_arc > 0 && sweep === 0) {
	    th_arc -= 2 * Math.PI;
	  }
	
	  var segs = Math.ceil(Math.abs(th_arc / (Math.PI * 0.5 + 0.001)));
	  var result = [];
	  for (var i=0; i<segs; ++i) {
	    var th2 = th0 + i * th_arc / segs;
	    var th3 = th0 + (i+1) * th_arc / segs;
	    result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
	  }
	
	  return (segmentCache[key] = result);
	}
	
	function bezier(params) {
	  var key = join.call(params);
	  if (bezierCache[key]) {
	    return bezierCache[key];
	  }
	  
	  var cx = params[0],
	      cy = params[1],
	      th0 = params[2],
	      th1 = params[3],
	      rx = params[4],
	      ry = params[5],
	      sin_th = params[6],
	      cos_th = params[7];
	
	  var a00 = cos_th * rx;
	  var a01 = -sin_th * ry;
	  var a10 = sin_th * rx;
	  var a11 = cos_th * ry;
	
	  var cos_th0 = Math.cos(th0);
	  var sin_th0 = Math.sin(th0);
	  var cos_th1 = Math.cos(th1);
	  var sin_th1 = Math.sin(th1);
	
	  var th_half = 0.5 * (th1 - th0);
	  var sin_th_h2 = Math.sin(th_half * 0.5);
	  var t = (8/3) * sin_th_h2 * sin_th_h2 / Math.sin(th_half);
	  var x1 = cx + cos_th0 - t * sin_th0;
	  var y1 = cy + sin_th0 + t * cos_th0;
	  var x3 = cx + cos_th1;
	  var y3 = cy + sin_th1;
	  var x2 = x3 + t * sin_th1;
	  var y2 = y3 - t * cos_th1;
	
	  return (bezierCache[key] = [
	    a00 * x1 + a01 * y1,  a10 * x1 + a11 * y1,
	    a00 * x2 + a01 * y2,  a10 * x2 + a11 * y2,
	    a00 * x3 + a01 * y3,  a10 * x3 + a11 * y3
	  ]);
	}
	
	module.exports = {
	  segments: segments,
	  bezier: bezier,
	  cache: {
	    segments: segmentCache,
	    bezier: bezierCache
	  }
	};


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  'canvas': __webpack_require__(72),
	  'svg':    __webpack_require__(98)
	};


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  Handler:  __webpack_require__(73),
	  Renderer: __webpack_require__(95)
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var DOM = __webpack_require__(74),
	    Handler = __webpack_require__(75),
	    marks = __webpack_require__(76);
	
	function CanvasHandler() {
	  Handler.call(this);
	  this._down = null;
	  this._touch = null;
	  this._first = true;
	}
	
	var base = Handler.prototype;
	var prototype = (CanvasHandler.prototype = Object.create(base));
	prototype.constructor = CanvasHandler;
	
	prototype.initialize = function(el, pad, obj) {
	  // add event listeners
	  var canvas = this._canvas = DOM.find(el, 'canvas');
	  if (canvas) {
	    var that = this;
	    this.events.forEach(function(type) {
	      canvas.addEventListener(type, function(evt) {
	        if (prototype[type]) {
	          prototype[type].call(that, evt);
	        } else {
	          that.fire(type, evt);
	        }
	      });
	    });
	  }
	
	  return base.initialize.call(this, el, pad, obj);
	};
	
	prototype.canvas = function() {
	  return this._canvas;
	};
	
	// retrieve the current canvas context
	prototype.context = function() {
	  return this._canvas.getContext('2d');
	};
	
	// supported events
	prototype.events = [
	  'keydown',
	  'keypress',
	  'keyup',
	  'dragenter',
	  'dragleave',
	  'dragover',
	  'mousedown',
	  'mouseup',
	  'mousemove',
	  'mouseout',
	  'mouseover',
	  'click',
	  'dblclick',
	  'wheel',
	  'mousewheel',
	  'touchstart',
	  'touchmove',
	  'touchend'
	];
	
	// to keep firefox happy
	prototype.DOMMouseScroll = function(evt) {
	  this.fire('mousewheel', evt);
	};
	
	function move(moveEvent, overEvent, outEvent) {
	  return function(evt) {
	    var a = this._active,
	        p = this.pickEvent(evt);
	
	    if (p === a) {
	      // active item and picked item are the same
	      this.fire(moveEvent, evt); // fire move
	    } else {
	      // active item and picked item are different
	      this.fire(outEvent, evt);  // fire out for prior active item
	      this._active = p;            // set new active item
	      this.fire(overEvent, evt); // fire over for new active item
	      this.fire(moveEvent, evt); // fire move for new active item
	    }
	  };
	}
	
	function inactive(type) {
	  return function(evt) {
	    this.fire(type, evt);
	    this._active = null;
	  };
	}
	
	prototype.mousemove = move('mousemove', 'mouseover', 'mouseout');
	prototype.dragover  = move('dragover', 'dragenter', 'dragleave');
	
	prototype.mouseout  = inactive('mouseout');
	prototype.dragleave = inactive('dragleave');
	
	prototype.mousedown = function(evt) {
	  this._down = this._active;
	  this.fire('mousedown', evt);
	};
	
	prototype.click = function(evt) {
	  if (this._down === this._active) {
	    this.fire('click', evt);
	    this._down = null;
	  }
	};
	
	prototype.touchstart = function(evt) {
	  this._touch = this.pickEvent(evt.changedTouches[0]);
	
	  if (this._first) {
	    this._active = this._touch;
	    this._first = false;
	  }
	
	  this.fire('touchstart', evt, true);
	};
	
	prototype.touchmove = function(evt) {
	  this.fire('touchmove', evt, true);
	};
	
	prototype.touchend = function(evt) {
	  this.fire('touchend', evt, true);
	  this._touch = null;
	};
	
	// fire an event
	prototype.fire = function(type, evt, touch) {
	  var a = touch ? this._touch : this._active,
	      h = this._handlers[type], i, len;
	  if (h) {
	    evt.vegaType = type;
	    for (i=0, len=h.length; i<len; ++i) {
	      h[i].handler.call(this._obj, evt, a);
	    }
	  }
	};
	
	// add an event handler
	prototype.on = function(type, handler) {
	  var name = this.eventName(type),
	      h = this._handlers;
	  (h[name] || (h[name] = [])).push({
	    type: type,
	    handler: handler
	  });
	  return this;
	};
	
	// remove an event handler
	prototype.off = function(type, handler) {
	  var name = this.eventName(type),
	      h = this._handlers[name], i;
	  if (!h) return;
	  for (i=h.length; --i>=0;) {
	    if (h[i].type !== type) continue;
	    if (!handler || h[i].handler === handler) h.splice(i, 1);
	  }
	  return this;
	};
	
	prototype.pickEvent = function(evt) {
	  var rect = this._canvas.getBoundingClientRect(),
	      pad = this._padding, x, y;
	  return this.pick(this._scene,
	    x = (evt.clientX - rect.left),
	    y = (evt.clientY - rect.top),
	    x - pad.left, y - pad.top);
	};
	
	// find the scenegraph item at the current mouse position
	// x, y -- the absolute x, y mouse coordinates on the canvas element
	// gx, gy -- the relative coordinates within the current group
	prototype.pick = function(scene, x, y, gx, gy) {
	  var g = this.context(),
	      mark = marks[scene.marktype];
	  return mark.pick.call(this, g, scene, x, y, gx, gy);
	};
	
	module.exports = CanvasHandler;


/***/ },
/* 74 */
/***/ function(module, exports) {

	// create a new DOM element
	function create(doc, tag, ns) {
	  return ns ? doc.createElementNS(ns, tag) : doc.createElement(tag);
	}
	
	// remove element from DOM
	// recursively remove parent elements if empty
	function remove(el) {
	  if (!el) return;
	  var p = el.parentNode;
	  if (p) {
	    p.removeChild(el);
	    if (!p.childNodes || !p.childNodes.length) remove(p);
	  }
	}
	
	module.exports = {
	  // find first child element with matching tag
	  find: function(el, tag) {
	    tag = tag.toLowerCase();
	    for (var i=0, n=el.childNodes.length; i<n; ++i) {
	      if (el.childNodes[i].tagName.toLowerCase() === tag) {
	        return el.childNodes[i];
	      }
	    }
	  },
	  // retrieve child element at given index
	  // create & insert if doesn't exist or if tag/className do not match
	  child: function(el, index, tag, ns, className, insert) {
	    var a, b;
	    a = b = el.childNodes[index];
	    if (!a || insert ||
	        a.tagName.toLowerCase() !== tag.toLowerCase() ||
	        className && a.getAttribute('class') != className) {
	      a = create(el.ownerDocument, tag, ns);
	      el.insertBefore(a, b);
	      if (className) a.setAttribute('class', className);
	    }
	    return a;
	  },
	  // remove all child elements at or above the given index
	  clear: function(el, index) {
	    var curr = el.childNodes.length;
	    while (curr > index) {
	      el.removeChild(el.childNodes[--curr]);
	    }
	    return el;
	  },
	  remove: remove,
	  // generate css class name for mark
	  cssClass: function(mark) {
	    return 'mark-' + mark.marktype + (mark.name ? ' '+mark.name : '');
	  },
	  // generate string for an opening xml tag
	  // tag: the name of the xml tag
	  // attr: hash of attribute name-value pairs to include
	  // raw: additional raw string to include in tag markup
	  openTag: function(tag, attr, raw) {
	    var s = '<' + tag, key, val;
	    if (attr) {
	      for (key in attr) {
	        val = attr[key];
	        if (val != null) {
	          s += ' ' + key + '="' + val + '"';
	        }
	      }
	    }
	    if (raw) s += ' ' + raw;
	    return s + '>';
	  },
	  // generate string for closing xml tag
	  // tag: the name of the xml tag
	  closeTag: function(tag) {
	    return '</' + tag + '>';
	  }
	};


/***/ },
/* 75 */
/***/ function(module, exports) {

	function Handler() {
	  this._active = null;
	  this._handlers = {};
	}
	
	var prototype = Handler.prototype;
	
	prototype.initialize = function(el, pad, obj) {
	  this._el = el;
	  this._obj = obj || null;
	  return this.padding(pad);
	};
	
	prototype.element = function() {
	  return this._el;
	};
	
	prototype.padding = function(pad) {
	  this._padding = pad || {top:0, left:0, bottom:0, right:0};
	  return this;
	};
	
	prototype.scene = function(scene) {
	  if (!arguments.length) return this._scene;
	  this._scene = scene;
	  return this;
	};
	
	// add an event handler
	// subclasses should override
	prototype.on = function(/*type, handler*/) {};
	
	// remove an event handler
	// subclasses should override
	prototype.off = function(/*type, handler*/) {};
	
	// return an array with all registered event handlers
	prototype.handlers = function() {
	  var h = this._handlers, a = [], k;
	  for (k in h) { a.push.apply(a, h[k]); }
	  return a;
	};
	
	prototype.eventName = function(name) {
	  var i = name.indexOf('.');
	  return i < 0 ? name : name.slice(0,i);
	};
	
	module.exports = Handler;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  arc:    __webpack_require__(77),
	  area:   __webpack_require__(79),
	  group:  __webpack_require__(81),
	  image:  __webpack_require__(82),
	  line:   __webpack_require__(83),
	  path:   __webpack_require__(84),
	  rect:   __webpack_require__(85),
	  rule:   __webpack_require__(86),
	  symbol: __webpack_require__(87),
	  text:   __webpack_require__(88)
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78);
	var halfpi = Math.PI / 2;
	
	function path(g, o) {
	  var x = o.x || 0,
	      y = o.y || 0,
	      ir = o.innerRadius || 0,
	      or = o.outerRadius || 0,
	      sa = (o.startAngle || 0) - halfpi,
	      ea = (o.endAngle || 0) - halfpi;
	  g.beginPath();
	  if (ir === 0) g.moveTo(x, y);
	  else g.arc(x, y, ir, sa, ea, 0);
	  g.arc(x, y, or, ea, sa, 1);
	  g.closePath();
	}
	
	module.exports = {
	  draw: util.drawAll(path),
	  pick: util.pickPath(path)
	};

/***/ },
/* 78 */
/***/ function(module, exports) {

	function drawPathOne(path, g, o, items) {
	  if (path(g, items)) return;
	
	  var opac = o.opacity == null ? 1 : o.opacity;
	  if (opac===0) return;
	
	  if (o.fill && fill(g, o, opac)) { g.fill(); }
	  if (o.stroke && stroke(g, o, opac)) { g.stroke(); }
	}
	
	function drawPathAll(path, g, scene, bounds) {
	  var i, len, item;
	  for (i=0, len=scene.items.length; i<len; ++i) {
	    item = scene.items[i];
	    if (!bounds || bounds.intersects(item.bounds)) {
	      drawPathOne(path, g, item, item);
	    }
	  }
	}
	
	function drawAll(pathFunc) {
	  return function(g, scene, bounds) {
	    drawPathAll(pathFunc, g, scene, bounds);
	  };
	}
	
	function drawOne(pathFunc) {
	  return function(g, scene, bounds) {
	    if (!scene.items.length) return;
	    if (!bounds || bounds.intersects(scene.bounds)) {
	      drawPathOne(pathFunc, g, scene.items[0], scene.items);
	    }
	  };
	}
	
	var trueFunc = function() { return true; };
	
	function pick(test) {
	  if (!test) test = trueFunc;
	
	  return function(g, scene, x, y, gx, gy) {
	    if (!scene.items.length) return null;
	
	    var o, b, i;
	
	    if (g.pixelratio != null && g.pixelratio !== 1) {
	      x *= g.pixelratio;
	      y *= g.pixelratio;
	    }
	
	    for (i=scene.items.length; --i >= 0;) {
	      o = scene.items[i]; b = o.bounds;
	      // first hit test against bounding box
	      if ((b && !b.contains(gx, gy)) || !b) continue;
	      // if in bounding box, perform more careful test
	      if (test(g, o, x, y, gx, gy)) return o;
	    }
	    return null;
	  };
	}
	
	function testPath(path, filled) {
	  return function(g, o, x, y) {
	    var item = Array.isArray(o) ? o[0] : o,
	        fill = (filled == null) ? item.fill : filled,
	        stroke = item.stroke && g.isPointInStroke, lw, lc;
	
	    if (stroke) {
	      lw = item.strokeWidth;
	      lc = item.strokeCap;
	      g.lineWidth = lw != null ? lw : 1;
	      g.lineCap   = lc != null ? lc : 'butt';
	    }
	
	    return path(g, o) ? false :
	      (fill && g.isPointInPath(x, y)) ||
	      (stroke && g.isPointInStroke(x, y));
	  };
	}
	
	function pickPath(path) {
	  return pick(testPath(path));
	}
	
	function fill(g, o, opacity) {
	  opacity *= (o.fillOpacity==null ? 1 : o.fillOpacity);
	  if (opacity > 0) {
	    g.globalAlpha = opacity;
	    g.fillStyle = color(g, o, o.fill);
	    return true;
	  } else {
	    return false;
	  }
	}
	
	function stroke(g, o, opacity) {
	  var lw = (lw = o.strokeWidth) != null ? lw : 1, lc;
	  if (lw <= 0) return false;
	
	  opacity *= (o.strokeOpacity==null ? 1 : o.strokeOpacity);
	  if (opacity > 0) {
	    g.globalAlpha = opacity;
	    g.strokeStyle = color(g, o, o.stroke);
	    g.lineWidth = lw;
	    g.lineCap = (lc = o.strokeCap) != null ? lc : 'butt';
	    g.vgLineDash(o.strokeDash || null);
	    g.vgLineDashOffset(o.strokeDashOffset || 0);
	    return true;
	  } else {
	    return false;
	  }
	}
	
	function color(g, o, value) {
	  return (value.id) ?
	    gradient(g, value, o.bounds) :
	    value;
	}
	
	function gradient(g, p, b) {
	  var w = b.width(),
	      h = b.height(),
	      x1 = b.x1 + p.x1 * w,
	      y1 = b.y1 + p.y1 * h,
	      x2 = b.x1 + p.x2 * w,
	      y2 = b.y1 + p.y2 * h,
	      grad = g.createLinearGradient(x1, y1, x2, y2),
	      stop = p.stops,
	      i, n;
	
	  for (i=0, n=stop.length; i<n; ++i) {
	    grad.addColorStop(stop[i].offset, stop[i].color);
	  }
	  return grad;
	}
	
	module.exports = {
	  drawOne:  drawOne,
	  drawAll:  drawAll,
	  pick:     pick,
	  pickPath: pickPath,
	  testPath: testPath,
	  stroke:   stroke,
	  fill:     fill,
	  color:    color,
	  gradient: gradient
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78),
	    parse = __webpack_require__(68),
	    render = __webpack_require__(69),
	    areaPath = __webpack_require__(80).path.area;
	
	function path(g, items) {
	  var o = items[0],
	      p = o.pathCache || (o.pathCache = parse(areaPath(items)));
	  render(g, p);
	}
	
	function pick(g, scene, x, y, gx, gy) {
	  var items = scene.items,
	      b = scene.bounds;
	
	  if (!items || !items.length || b && !b.contains(gx, gy)) {
	    return null;
	  }
	
	  if (g.pixelratio != null && g.pixelratio !== 1) {
	    x *= g.pixelratio;
	    y *= g.pixelratio;
	  }
	  return hit(g, items, x, y) ? items[0] : null;
	}
	
	var hit = util.testPath(path);
	
	module.exports = {
	  draw: util.drawOne(path),
	  pick: pick,
	  nested: true
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	var d3_svg = __webpack_require__(63).svg;
	
	function x(o)     { return o.x || 0; }
	function y(o)     { return o.y || 0; }
	function xw(o)    { return (o.x || 0) + (o.width || 0); }
	function yh(o)    { return (o.y || 0) + (o.height || 0); }
	function size(o)  { return o.size == null ? 100 : o.size; }
	function shape(o) { return o.shape || 'circle'; }
	
	var areav = d3_svg.area().x(x).y1(y).y0(yh),
	    areah = d3_svg.area().y(y).x1(x).x0(xw),
	    line  = d3_svg.line().x(x).y(y);
	
	module.exports = {
	  metadata: {
	    'version': '1.1',
	    'xmlns': 'http://www.w3.org/2000/svg',
	    'xmlns:xlink': 'http://www.w3.org/1999/xlink'
	  },
	  path: {
	    arc: d3_svg.arc(),
	    symbol: d3_svg.symbol().type(shape).size(size),
	    area: function(items) {
	      var o = items[0];
	      return (o.orient === 'horizontal' ? areah : areav)
	        .interpolate(o.interpolate || 'linear')
	        .tension(o.tension || 0.7)
	        (items);
	    },
	    line: function(items) {
	      var o = items[0];
	      return line
	        .interpolate(o.interpolate || 'linear')
	        .tension(o.tension || 0.7)
	        (items);
	    }
	  },
	  textAlign: {
	    'left':   'start',
	    'center': 'middle',
	    'right':  'end'
	  },
	  textBaseline: {
	    'top':    'before-edge',
	    'bottom': 'after-edge',
	    'middle': 'central'
	  },
	  styles: {
	    'fill':             'fill',
	    'fillOpacity':      'fill-opacity',
	    'stroke':           'stroke',
	    'strokeWidth':      'stroke-width',
	    'strokeOpacity':    'stroke-opacity',
	    'strokeCap':        'stroke-linecap',
	    'strokeDash':       'stroke-dasharray',
	    'strokeDashOffset': 'stroke-dashoffset',
	    'opacity':          'opacity'
	  },
	  styleProperties: [
	    'fill',
	    'fillOpacity',
	    'stroke',
	    'strokeWidth',
	    'strokeOpacity',
	    'strokeCap',
	    'strokeDash',
	    'strokeDashOffset',
	    'opacity'
	  ]
	};


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78),
	    EMPTY = [];
	
	function draw(g, scene, bounds) {
	  if (!scene.items || !scene.items.length) return;
	
	  var groups = scene.items,
	      renderer = this,
	      group, items, axes, legends, gx, gy, w, h, opac, i, n, j, m;
	
	  for (i=0, n=groups.length; i<n; ++i) {
	    group = groups[i];
	    axes = group.axisItems || EMPTY;
	    items = group.items || EMPTY;
	    legends = group.legendItems || EMPTY;
	    gx = group.x || 0;
	    gy = group.y || 0;
	    w = group.width || 0;
	    h = group.height || 0;
	
	    // draw group background
	    if (group.stroke || group.fill) {
	      opac = group.opacity == null ? 1 : group.opacity;
	      if (opac > 0) {
	        if (group.fill && util.fill(g, group, opac)) {
	          g.fillRect(gx, gy, w, h);
	        }
	        if (group.stroke && util.stroke(g, group, opac)) {
	          g.strokeRect(gx, gy, w, h);
	        }
	      }
	    }
	
	    // setup graphics context
	    g.save();
	    g.translate(gx, gy);
	    if (group.clip) {
	      g.beginPath();
	      g.rect(0, 0, w, h);
	      g.clip();
	    }
	    if (bounds) bounds.translate(-gx, -gy);
	
	    // draw group contents
	    for (j=0, m=axes.length; j<m; ++j) {
	      if (axes[j].layer === 'back') {
	        renderer.draw(g, axes[j], bounds);
	      }
	    }
	    for (j=0, m=items.length; j<m; ++j) {
	      renderer.draw(g, items[j], bounds);
	    }
	    for (j=0, m=axes.length; j<m; ++j) {
	      if (axes[j].layer !== 'back') {
	        renderer.draw(g, axes[j], bounds);
	      }
	    }
	    for (j=0, m=legends.length; j<m; ++j) {
	      renderer.draw(g, legends[j], bounds);
	    }
	
	    // restore graphics context
	    if (bounds) bounds.translate(gx, gy);
	    g.restore();
	  }    
	}
	
	function pick(g, scene, x, y, gx, gy) {
	  if (scene.bounds && !scene.bounds.contains(gx, gy)) {
	    return null;
	  }
	
	  var groups = scene.items || EMPTY, subscene,
	      group, axes, items, legends, hits, dx, dy, i, j, b;
	
	  for (i=groups.length; --i>=0;) {
	    group = groups[i];
	
	    // first hit test against bounding box
	    // if a group is clipped, that should be handled by the bounds check.
	    b = group.bounds;
	    if (b && !b.contains(gx, gy)) continue;
	
	    // passed bounds check, so test sub-groups
	    axes = group.axisItems || EMPTY;
	    items = group.items || EMPTY;
	    legends = group.legendItems || EMPTY;
	    dx = (group.x || 0);
	    dy = (group.y || 0);
	
	    g.save();
	    g.translate(dx, dy);
	    dx = gx - dx;
	    dy = gy - dy;
	    for (j=legends.length; --j>=0;) {
	      subscene = legends[j];
	      if (subscene.interactive !== false) {
	        hits = this.pick(subscene, x, y, dx, dy);
	        if (hits) { g.restore(); return hits; }
	      }
	    }
	    for (j=axes.length; --j>=0;) {
	      subscene = axes[j];
	      if (subscene.interactive !== false && subscene.layer !== 'back') {
	        hits = this.pick(subscene, x, y, dx, dy);
	        if (hits) { g.restore(); return hits; }
	      }
	    }
	    for (j=items.length; --j>=0;) {
	      subscene = items[j];
	      if (subscene.interactive !== false) {
	        hits = this.pick(subscene, x, y, dx, dy);
	        if (hits) { g.restore(); return hits; }
	      }
	    }
	    for (j=axes.length; --j>=0;) {
	      subscene = axes[j];
	      if (subscene.interative !== false && subscene.layer === 'back') {
	        hits = this.pick(subscene, x, y, dx, dy);
	        if (hits) { g.restore(); return hits; }
	      }
	    }
	    g.restore();
	
	    if (scene.interactive !== false && (group.fill || group.stroke) &&
	        dx >= 0 && dx <= group.width && dy >= 0 && dy <= group.height) {
	      return group;
	    }
	  }
	
	  return null;
	}
	
	module.exports = {
	  draw: draw,
	  pick: pick
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78);
	
	function draw(g, scene, bounds) {
	  if (!scene.items || !scene.items.length) return;
	
	  var renderer = this,
	      items = scene.items, o;
	
	  for (var i=0, len=items.length; i<len; ++i) {
	    o = items[i];
	    if (bounds && !bounds.intersects(o.bounds))
	      continue; // bounds check
	
	    if (!(o.image && o.image.url === o.url)) {
	      o.image = renderer.loadImage(o.url);
	      o.image.url = o.url;
	    }
	
	    var x = o.x || 0,
	        y = o.y || 0,
	        w = o.width || (o.image && o.image.width) || 0,
	        h = o.height || (o.image && o.image.height) || 0,
	        opac;
	    x = x - (o.align==='center' ? w/2 : o.align==='right' ? w : 0);
	    y = y - (o.baseline==='middle' ? h/2 : o.baseline==='bottom' ? h : 0);
	
	    if (o.image.loaded) {
	      g.globalAlpha = (opac = o.opacity) != null ? opac : 1;
	      g.drawImage(o.image, x, y, w, h);
	    }
	  }
	}
	
	module.exports = {
	  draw: draw,
	  pick: util.pick()
	};

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78),
	    parse = __webpack_require__(68),
	    render = __webpack_require__(69),
	    linePath = __webpack_require__(80).path.line;
	    
	function path(g, items) {
	  var o = items[0],
	      p = o.pathCache || (o.pathCache = parse(linePath(items)));
	  render(g, p);
	}
	
	function pick(g, scene, x, y, gx, gy) {
	  var items = scene.items,
	      b = scene.bounds;
	
	  if (!items || !items.length || b && !b.contains(gx, gy)) {
	    return null;
	  }
	
	  if (g.pixelratio != null && g.pixelratio !== 1) {
	    x *= g.pixelratio;
	    y *= g.pixelratio;
	  }
	  return hit(g, items, x, y) ? items[0] : null;
	}
	
	var hit = util.testPath(path, false);
	
	module.exports = {
	  draw: util.drawOne(path),
	  pick: pick,
	  nested: true
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78),
	    parse = __webpack_require__(68),
	    render = __webpack_require__(69);
	
	function path(g, o) {
	  if (o.path == null) return true;
	  var p = o.pathCache || (o.pathCache = parse(o.path));
	  render(g, p, o.x, o.y);
	}
	
	module.exports = {
	  draw: util.drawAll(path),
	  pick: util.pickPath(path)
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78);
	
	function draw(g, scene, bounds) {
	  if (!scene.items || !scene.items.length) return;
	
	  var items = scene.items,
	      o, opac, x, y, w, h;
	
	  for (var i=0, len=items.length; i<len; ++i) {
	    o = items[i];
	    if (bounds && !bounds.intersects(o.bounds))
	      continue; // bounds check
	
	    opac = o.opacity == null ? 1 : o.opacity;
	    if (opac === 0) continue;
	
	    x = o.x || 0;
	    y = o.y || 0;
	    w = o.width || 0;
	    h = o.height || 0;
	
	    if (o.fill && util.fill(g, o, opac)) {
	      g.fillRect(x, y, w, h);
	    }
	    if (o.stroke && util.stroke(g, o, opac)) {
	      g.strokeRect(x, y, w, h);
	    }
	  }
	}
	
	module.exports = {
	  draw: draw,
	  pick: util.pick()
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78);
	
	function draw(g, scene, bounds) {
	  if (!scene.items || !scene.items.length) return;
	
	  var items = scene.items,
	      o, opac, x1, y1, x2, y2;
	
	  for (var i=0, len=items.length; i<len; ++i) {
	    o = items[i];
	    if (bounds && !bounds.intersects(o.bounds))
	      continue; // bounds check
	
	    opac = o.opacity == null ? 1 : o.opacity;
	    if (opac === 0) continue;
	      
	    x1 = o.x || 0;
	    y1 = o.y || 0;
	    x2 = o.x2 != null ? o.x2 : x1;
	    y2 = o.y2 != null ? o.y2 : y1;
	
	    if (o.stroke && util.stroke(g, o, opac)) {
	      g.beginPath();
	      g.moveTo(x1, y1);
	      g.lineTo(x2, y2);
	      g.stroke();
	    }
	  }
	}
	
	function stroke(g, o) {
	  var x1 = o.x || 0,
	      y1 = o.y || 0,
	      x2 = o.x2 != null ? o.x2 : x1,
	      y2 = o.y2 != null ? o.y2 : y1,
	      lw = o.strokeWidth,
	      lc = o.strokeCap;
	
	  g.lineWidth = lw != null ? lw : 1;
	  g.lineCap   = lc != null ? lc : 'butt';
	  g.beginPath();
	  g.moveTo(x1, y1);
	  g.lineTo(x2, y2);
	}
	
	function hit(g, o, x, y) {
	  if (!g.isPointInStroke) return false;
	  stroke(g, o);
	  return g.isPointInStroke(x, y);
	}
	
	module.exports = {
	  draw: draw,
	  pick: util.pick(hit)
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(78);
	
	var sqrt3 = Math.sqrt(3),
	    tan30 = Math.tan(30 * Math.PI / 180);
	
	function path(g, o) {
	  var size = o.size != null ? o.size : 100,
	      x = o.x, y = o.y, r, t, rx, ry;
	
	  g.beginPath();
	
	  if (o.shape == null || o.shape === 'circle') {
	    r = Math.sqrt(size / Math.PI);
	    g.arc(x, y, r, 0, 2*Math.PI, 0);
	    g.closePath();
	    return;
	  }
	
	  switch (o.shape) {
	    case 'cross':
	      r = Math.sqrt(size / 5) / 2;
	      t = 3*r;
	      g.moveTo(x-t, y-r);
	      g.lineTo(x-r, y-r);
	      g.lineTo(x-r, y-t);
	      g.lineTo(x+r, y-t);
	      g.lineTo(x+r, y-r);
	      g.lineTo(x+t, y-r);
	      g.lineTo(x+t, y+r);
	      g.lineTo(x+r, y+r);
	      g.lineTo(x+r, y+t);
	      g.lineTo(x-r, y+t);
	      g.lineTo(x-r, y+r);
	      g.lineTo(x-t, y+r);
	      break;
	
	    case 'diamond':
	      ry = Math.sqrt(size / (2 * tan30));
	      rx = ry * tan30;
	      g.moveTo(x, y-ry);
	      g.lineTo(x+rx, y);
	      g.lineTo(x, y+ry);
	      g.lineTo(x-rx, y);
	      break;
	
	    case 'square':
	      t = Math.sqrt(size);
	      r = t / 2;
	      g.rect(x-r, y-r, t, t);
	      break;
	
	    case 'triangle-down':
	      rx = Math.sqrt(size / sqrt3);
	      ry = rx * sqrt3 / 2;
	      g.moveTo(x, y+ry);
	      g.lineTo(x+rx, y-ry);
	      g.lineTo(x-rx, y-ry);
	      break;
	
	    case 'triangle-up':
	      rx = Math.sqrt(size / sqrt3);
	      ry = rx * sqrt3 / 2;
	      g.moveTo(x, y-ry);
	      g.lineTo(x+rx, y+ry);
	      g.lineTo(x-rx, y+ry);
	  }
	  g.closePath();
	}
	
	module.exports = {
	  draw: util.drawAll(path),
	  pick: util.pickPath(path)
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var Bounds = __webpack_require__(89),
	    textBounds = __webpack_require__(90).text,
	    text = __webpack_require__(94),
	    util = __webpack_require__(78),
	    tempBounds = new Bounds();
	
	function draw(g, scene, bounds) {
	  if (!scene.items || !scene.items.length) return;
	
	  var items = scene.items,
	      o, opac, x, y, r, t, str;
	
	  for (var i=0, len=items.length; i<len; ++i) {
	    o = items[i];
	    if (bounds && !bounds.intersects(o.bounds))
	      continue; // bounds check
	
	    str = text.value(o.text);
	    if (!str) continue;
	    opac = o.opacity == null ? 1 : o.opacity;
	    if (opac === 0) continue;
	
	    g.font = text.font(o);
	    g.textAlign = o.align || 'left';
	
	    x = (o.x || 0);
	    y = (o.y || 0);
	    if ((r = o.radius)) {
	      t = (o.theta || 0) - Math.PI/2;
	      x += r * Math.cos(t);
	      y += r * Math.sin(t);
	    }
	
	    if (o.angle) {
	      g.save();
	      g.translate(x, y);
	      g.rotate(o.angle * Math.PI/180);
	      x = y = 0; // reset x, y
	    }
	    x += (o.dx || 0);
	    y += (o.dy || 0) + text.offset(o);
	
	    if (o.fill && util.fill(g, o, opac)) {
	      g.fillText(str, x, y);
	    }
	    if (o.stroke && util.stroke(g, o, opac)) {
	      g.strokeText(str, x, y);
	    }
	    if (o.angle) g.restore();
	  }
	}
	
	function hit(g, o, x, y, gx, gy) {
	  if (o.fontSize <= 0) return false;
	  if (!o.angle) return true; // bounds sufficient if no rotation
	
	  // project point into space of unrotated bounds
	  var b = textBounds(o, tempBounds, true),
	      a = -o.angle * Math.PI / 180,
	      cos = Math.cos(a),
	      sin = Math.sin(a),
	      ox = o.x,
	      oy = o.y,
	      px = cos*gx - sin*gy + (ox - ox*cos + oy*sin),
	      py = sin*gx + cos*gy + (oy - ox*sin - oy*cos);
	
	  return b.contains(px, py);
	}
	
	module.exports = {
	  draw: draw,
	  pick: util.pick(hit)
	};


/***/ },
/* 89 */
/***/ function(module, exports) {

	function Bounds(b) {
	  this.clear();
	  if (b) this.union(b);
	}
	
	var prototype = Bounds.prototype;
	
	prototype.clone = function() {
	  return new Bounds(this);
	};
	
	prototype.clear = function() {
	  this.x1 = +Number.MAX_VALUE;
	  this.y1 = +Number.MAX_VALUE;
	  this.x2 = -Number.MAX_VALUE;
	  this.y2 = -Number.MAX_VALUE;
	  return this;
	};
	
	prototype.set = function(x1, y1, x2, y2) {
	  this.x1 = x1;
	  this.y1 = y1;
	  this.x2 = x2;
	  this.y2 = y2;
	  return this;
	};
	
	prototype.add = function(x, y) {
	  if (x < this.x1) this.x1 = x;
	  if (y < this.y1) this.y1 = y;
	  if (x > this.x2) this.x2 = x;
	  if (y > this.y2) this.y2 = y;
	  return this;
	};
	
	prototype.expand = function(d) {
	  this.x1 -= d;
	  this.y1 -= d;
	  this.x2 += d;
	  this.y2 += d;
	  return this;
	};
	
	prototype.round = function() {
	  this.x1 = Math.floor(this.x1);
	  this.y1 = Math.floor(this.y1);
	  this.x2 = Math.ceil(this.x2);
	  this.y2 = Math.ceil(this.y2);
	  return this;
	};
	
	prototype.translate = function(dx, dy) {
	  this.x1 += dx;
	  this.x2 += dx;
	  this.y1 += dy;
	  this.y2 += dy;
	  return this;
	};
	
	prototype.rotate = function(angle, x, y) {
	  var cos = Math.cos(angle),
	      sin = Math.sin(angle),
	      cx = x - x*cos + y*sin,
	      cy = y - x*sin - y*cos,
	      x1 = this.x1, x2 = this.x2,
	      y1 = this.y1, y2 = this.y2;
	
	  return this.clear()
	    .add(cos*x1 - sin*y1 + cx,  sin*x1 + cos*y1 + cy)
	    .add(cos*x1 - sin*y2 + cx,  sin*x1 + cos*y2 + cy)
	    .add(cos*x2 - sin*y1 + cx,  sin*x2 + cos*y1 + cy)
	    .add(cos*x2 - sin*y2 + cx,  sin*x2 + cos*y2 + cy);
	};
	
	prototype.union = function(b) {
	  if (b.x1 < this.x1) this.x1 = b.x1;
	  if (b.y1 < this.y1) this.y1 = b.y1;
	  if (b.x2 > this.x2) this.x2 = b.x2;
	  if (b.y2 > this.y2) this.y2 = b.y2;
	  return this;
	};
	
	prototype.encloses = function(b) {
	  return b && (
	    this.x1 <= b.x1 &&
	    this.x2 >= b.x2 &&
	    this.y1 <= b.y1 &&
	    this.y2 >= b.y2
	  );
	};
	
	prototype.alignsWith = function(b) {
	  return b && (
	    this.x1 == b.x1 ||
	    this.x2 == b.x2 ||
	    this.y1 == b.y1 ||
	    this.y2 == b.y2
	  );
	};
	
	prototype.intersects = function(b) {
	  return b && !(
	    this.x2 < b.x1 ||
	    this.x1 > b.x2 ||
	    this.y2 < b.y1 ||
	    this.y1 > b.y2
	  );
	};
	
	prototype.contains = function(x, y) {
	  return !(
	    x < this.x1 ||
	    x > this.x2 ||
	    y < this.y1 ||
	    y > this.y2
	  );
	};
	
	prototype.width = function() {
	  return this.x2 - this.x1;
	};
	
	prototype.height = function() {
	  return this.y2 - this.y1;
	};
	
	module.exports = Bounds;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var BoundsContext = __webpack_require__(91),
	    Bounds = __webpack_require__(89),
	    canvas = __webpack_require__(92),
	    svg = __webpack_require__(80),
	    text = __webpack_require__(94),
	    paths = __webpack_require__(67),
	    parse = paths.parse,
	    drawPath = paths.render,
	    areaPath = svg.path.area,
	    linePath = svg.path.line,
	    halfpi = Math.PI / 2,
	    sqrt3 = Math.sqrt(3),
	    tan30 = Math.tan(30 * Math.PI / 180),
	    g2D = null,
	    bc = BoundsContext();
	
	function context() {
	  return g2D || (g2D = canvas.instance(1,1).getContext('2d'));
	}
	
	function strokeBounds(o, bounds) {
	  if (o.stroke && o.opacity !== 0 && o.stokeOpacity !== 0) {
	    bounds.expand(o.strokeWidth != null ? o.strokeWidth : 1);
	  }
	  return bounds;
	}
	
	function pathBounds(o, path, bounds, x, y) {
	  if (path == null) {
	    bounds.set(0, 0, 0, 0);
	  } else {
	    drawPath(bc.bounds(bounds), path, x, y);
	    strokeBounds(o, bounds);
	  }
	  return bounds;
	}
	
	function path(o, bounds) {
	  var p = o.path ? o.pathCache || (o.pathCache = parse(o.path)) : null;
	  return pathBounds(o, p, bounds, o.x, o.y);
	}
	
	function area(mark, bounds) {
	  if (mark.items.length === 0) return bounds;
	  var items = mark.items,
	      item = items[0],
	      p = item.pathCache || (item.pathCache = parse(areaPath(items)));
	  return pathBounds(item, p, bounds);
	}
	
	function line(mark, bounds) {
	  if (mark.items.length === 0) return bounds;
	  var items = mark.items,
	      item = items[0],
	      p = item.pathCache || (item.pathCache = parse(linePath(items)));
	  return pathBounds(item, p, bounds);
	}
	
	function rect(o, bounds) {
	  var x, y;
	  return strokeBounds(o, bounds.set(
	    x = o.x || 0,
	    y = o.y || 0,
	    (x + o.width) || 0,
	    (y + o.height) || 0
	  ));
	}
	
	function image(o, bounds) {
	  var x = o.x || 0,
	      y = o.y || 0,
	      w = o.width || 0,
	      h = o.height || 0;
	  x = x - (o.align === 'center' ? w/2 : (o.align === 'right' ? w : 0));
	  y = y - (o.baseline === 'middle' ? h/2 : (o.baseline === 'bottom' ? h : 0));
	  return bounds.set(x, y, x+w, y+h);
	}
	
	function rule(o, bounds) {
	  var x1, y1;
	  return strokeBounds(o, bounds.set(
	    x1 = o.x || 0,
	    y1 = o.y || 0,
	    o.x2 != null ? o.x2 : x1,
	    o.y2 != null ? o.y2 : y1
	  ));
	}
	
	function arc(o, bounds) {
	  var cx = o.x || 0,
	      cy = o.y || 0,
	      ir = o.innerRadius || 0,
	      or = o.outerRadius || 0,
	      sa = (o.startAngle || 0) - halfpi,
	      ea = (o.endAngle || 0) - halfpi,
	      xmin = Infinity, xmax = -Infinity,
	      ymin = Infinity, ymax = -Infinity,
	      a, i, n, x, y, ix, iy, ox, oy;
	
	  var angles = [sa, ea],
	      s = sa - (sa % halfpi);
	  for (i=0; i<4 && s<ea; ++i, s+=halfpi) {
	    angles.push(s);
	  }
	
	  for (i=0, n=angles.length; i<n; ++i) {
	    a = angles[i];
	    x = Math.cos(a); ix = ir*x; ox = or*x;
	    y = Math.sin(a); iy = ir*y; oy = or*y;
	    xmin = Math.min(xmin, ix, ox);
	    xmax = Math.max(xmax, ix, ox);
	    ymin = Math.min(ymin, iy, oy);
	    ymax = Math.max(ymax, iy, oy);
	  }
	
	  return strokeBounds(o, bounds.set(
	    cx + xmin,
	    cy + ymin,
	    cx + xmax,
	    cy + ymax
	  ));
	}
	
	function symbol(o, bounds) {
	  var size = o.size != null ? o.size : 100,
	      x = o.x || 0,
	      y = o.y || 0,
	      r, t, rx, ry;
	
	  switch (o.shape) {
	    case 'cross':
	      t = 3 * Math.sqrt(size / 5) / 2;
	      bounds.set(x-t, y-t, x+t, y+t);
	      break;
	
	    case 'diamond':
	      ry = Math.sqrt(size / (2 * tan30));
	      rx = ry * tan30;
	      bounds.set(x-rx, y-ry, x+rx, y+ry);
	      break;
	
	    case 'square':
	      t = Math.sqrt(size);
	      r = t / 2;
	      bounds.set(x-r, y-r, x+r, y+r);
	      break;
	
	    case 'triangle-down':
	      rx = Math.sqrt(size / sqrt3);
	      ry = rx * sqrt3 / 2;
	      bounds.set(x-rx, y-ry, x+rx, y+ry);
	      break;
	
	    case 'triangle-up':
	      rx = Math.sqrt(size / sqrt3);
	      ry = rx * sqrt3 / 2;
	      bounds.set(x-rx, y-ry, x+rx, y+ry);
	      break;
	
	    default:
	      r = Math.sqrt(size/Math.PI);
	      bounds.set(x-r, y-r, x+r, y+r);
	  }
	
	  return strokeBounds(o, bounds);
	}
	
	function textMark(o, bounds, noRotate) {
	  var g = context(),
	      h = text.size(o),
	      a = o.align,
	      r = o.radius || 0,
	      x = (o.x || 0),
	      y = (o.y || 0),
	      dx = (o.dx || 0),
	      dy = (o.dy || 0) + text.offset(o) - Math.round(0.8*h), // use 4/5 offset
	      w, t;
	
	  if (r) {
	    t = (o.theta || 0) - Math.PI/2;
	    x += r * Math.cos(t);
	    y += r * Math.sin(t);
	  }
	
	  // horizontal alignment
	  g.font = text.font(o);
	  w = g.measureText(text.value(o.text)).width;
	  if (a === 'center') {
	    dx -= (w / 2);
	  } else if (a === 'right') {
	    dx -= w;
	  } else {
	    // left by default, do nothing
	  }
	
	  bounds.set(dx+=x, dy+=y, dx+w, dy+h);
	  if (o.angle && !noRotate) {
	    bounds.rotate(o.angle*Math.PI/180, x, y);
	  }
	  return bounds.expand(noRotate ? 0 : 1);
	}
	
	function group(g, bounds, includeLegends) {
	  var axes = g.axisItems || [],
	      items = g.items || [],
	      legends = g.legendItems || [],
	      j, m;
	
	  if (!g.clip) {
	    for (j=0, m=axes.length; j<m; ++j) {
	      bounds.union(axes[j].bounds);
	    }
	    for (j=0, m=items.length; j<m; ++j) {
	      bounds.union(items[j].bounds);
	    }
	    if (includeLegends) {
	      for (j=0, m=legends.length; j<m; ++j) {
	        bounds.union(legends[j].bounds);
	      }
	    }
	  }
	  if (g.clip || g.width || g.height) {
	    strokeBounds(g, bounds
	      .add(0, 0)
	      .add(g.width || 0, g.height || 0));
	  }
	  return bounds.translate(g.x || 0, g.y || 0);
	}
	
	var methods = {
	  group:  group,
	  symbol: symbol,
	  image:  image,
	  rect:   rect,
	  rule:   rule,
	  arc:    arc,
	  text:   textMark,
	  path:   path,
	  area:   area,
	  line:   line
	};
	methods.area.nest = true;
	methods.line.nest = true;
	
	function itemBounds(item, func, opt) {
	  var type = item.mark.marktype;
	  func = func || methods[type];
	  if (func.nest) item = item.mark;
	
	  var curr = item.bounds,
	      prev = item['bounds:prev'] || (item['bounds:prev'] = new Bounds());
	
	  if (curr) {
	    prev.clear().union(curr);
	    curr.clear();
	  } else {
	    item.bounds = new Bounds();
	  }
	  func(item, item.bounds, opt);
	  if (!curr) prev.clear().union(item.bounds);
	  return item.bounds;
	}
	
	var DUMMY_ITEM = {mark: null};
	
	function markBounds(mark, bounds, opt) {
	  var type  = mark.marktype,
	      func  = methods[type],
	      items = mark.items,
	      hasi  = items && items.length,
	      i, n, o, b;
	
	  if (func.nest) {
	    o = hasi ? items[0]
	      : (DUMMY_ITEM.mark = mark, DUMMY_ITEM); // no items, so fake it
	    b = itemBounds(o, func, opt);
	    bounds = bounds && bounds.union(b) || b;
	    return bounds;
	  }
	
	  bounds = bounds || mark.bounds && mark.bounds.clear() || new Bounds();
	  if (hasi) {  
	    for (i=0, n=items.length; i<n; ++i) {
	      bounds.union(itemBounds(items[i], func, opt));
	    }
	  }
	  return (mark.bounds = bounds);
	}
	
	module.exports = {
	  mark:  markBounds,
	  item:  itemBounds,
	  text:  textMark,
	  group: group
	};


/***/ },
/* 91 */
/***/ function(module, exports) {

	module.exports = function(b) {
	  function noop() { }
	  function add(x,y) { b.add(x, y); }
	
	  return {
	    bounds: function(_) {
	      if (!arguments.length) return b;
	      return (b = _, this);
	    },
	    beginPath: noop,
	    closePath: noop,
	    moveTo: add,
	    lineTo: add,
	    quadraticCurveTo: function(x1, y1, x2, y2) {
	      b.add(x1, y1);
	      b.add(x2, y2);
	    },
	    bezierCurveTo: function(x1, y1, x2, y2, x3, y3) {
	      b.add(x1, y1);
	      b.add(x2, y2);
	      b.add(x3, y3);
	    }
	  };
	};


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	function instance(w, h) {
	  w = w || 1;
	  h = h || 1;
	  var canvas;
	
	  if (typeof document !== 'undefined' && document.createElement) {
	    canvas = document.createElement('canvas');
	    canvas.width = w;
	    canvas.height = h;
	  } else {
	    var Canvas = __webpack_require__(93);
	    if (!Canvas.prototype) return null;
	    canvas = new Canvas(w, h);
	  }
	  return lineDash(canvas);
	}
	
	function resize(canvas, w, h, p, retina) {
	  var g = this._ctx = canvas.getContext('2d'), 
	      s = 1;
	
	  canvas.width = w + p.left + p.right;
	  canvas.height = h + p.top + p.bottom;
	
	  // if browser canvas, attempt to modify for retina display
	  if (retina && typeof HTMLElement !== 'undefined' &&
	      canvas instanceof HTMLElement)
	  {
	    g.pixelratio = (s = pixelRatio(canvas) || 1);
	  }
	
	  g.setTransform(s, 0, 0, s, s*p.left, s*p.top);
	  return canvas;
	}
	
	function pixelRatio(canvas) {
	  var g = canvas.getContext('2d');
	
	  // get canvas pixel data
	  var devicePixelRatio = window && window.devicePixelRatio || 1,
	      backingStoreRatio = (
	        g.webkitBackingStorePixelRatio ||
	        g.mozBackingStorePixelRatio ||
	        g.msBackingStorePixelRatio ||
	        g.oBackingStorePixelRatio ||
	        g.backingStorePixelRatio) || 1,
	      ratio = devicePixelRatio / backingStoreRatio;
	
	  if (devicePixelRatio !== backingStoreRatio) {
	    // set actual and visible canvas size
	    var w = canvas.width,
	        h = canvas.height;
	    canvas.width = w * ratio;
	    canvas.height = h * ratio;
	    canvas.style.width = w + 'px';
	    canvas.style.height = h + 'px';
	  }
	
	  return ratio;
	}
	
	function lineDash(canvas) {
	  var g = canvas.getContext('2d');
	  if (g.vgLineDash) return; // already initialized!
	
	  var NOOP = function() {},
	      NODASH = [];
	  
	  if (g.setLineDash) {
	    g.vgLineDash = function(dash) { this.setLineDash(dash || NODASH); };
	    g.vgLineDashOffset = function(off) { this.lineDashOffset = off; };
	  } else if (g.webkitLineDash !== undefined) {
	  	g.vgLineDash = function(dash) { this.webkitLineDash = dash || NODASH; };
	    g.vgLineDashOffset = function(off) { this.webkitLineDashOffset = off; };
	  } else if (g.mozDash !== undefined) {
	    g.vgLineDash = function(dash) { this.mozDash = dash; };
	    g.vgLineDashOffset = NOOP;
	  } else {
	    g.vgLineDash = NOOP;
	    g.vgLineDashOffset = NOOP;
	  }
	  return canvas;
	}
	
	module.exports = {
	  instance:   instance,
	  resize:     resize,
	  lineDash:   lineDash
	};


/***/ },
/* 93 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 94 */
/***/ function(module, exports) {

	function size(item) {
	  return item.fontSize != null ? item.fontSize : 11;
	}
	
	module.exports = {
	  size: size,
	  value: function(s) {
	    return s != null ? String(s) : '';
	  },
	  font: function(item, quote) {
	    var font = item.font;
	    if (quote && font) {
	      font = String(font).replace(/\"/g, '\'');
	    }
	    return '' +
	      (item.fontStyle ? item.fontStyle + ' ' : '') +
	      (item.fontVariant ? item.fontVariant + ' ' : '') +
	      (item.fontWeight ? item.fontWeight + ' ' : '') +
	      size(item) + 'px ' +
	      (font || 'sans-serif');
	  },
	  offset: function(item) {
	    // perform our own font baseline calculation
	    // why? not all browsers support SVG 1.1 'alignment-baseline' :(
	    var baseline = item.baseline,
	        h = size(item);
	    return Math.round(
	      baseline === 'top'    ?  0.93*h :
	      baseline === 'middle' ?  0.30*h :
	      baseline === 'bottom' ? -0.21*h : 0
	    );
	  }
	};


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var DOM = __webpack_require__(74),
	    Bounds = __webpack_require__(89),
	    ImageLoader = __webpack_require__(96),
	    Canvas = __webpack_require__(92),
	    Renderer = __webpack_require__(97),
	    marks = __webpack_require__(76);
	
	function CanvasRenderer(loadConfig) {
	  Renderer.call(this);
	  this._loader = new ImageLoader(loadConfig);
	}
	
	CanvasRenderer.RETINA = true;
	
	var base = Renderer.prototype;
	var prototype = (CanvasRenderer.prototype = Object.create(base));
	prototype.constructor = CanvasRenderer;
	
	prototype.initialize = function(el, width, height, padding) {
	  this._canvas = Canvas.instance(width, height);
	  if (el) {
	    DOM.clear(el, 0).appendChild(this._canvas);
	    this._canvas.setAttribute('class', 'marks');
	  }
	  return base.initialize.call(this, el, width, height, padding);
	};
	
	prototype.resize = function(width, height, padding) {
	  base.resize.call(this, width, height, padding);
	  Canvas.resize(this._canvas, this._width, this._height,
	    this._padding, CanvasRenderer.RETINA);
	  return this;
	};
	
	prototype.canvas = function() {
	  return this._canvas;
	};
	
	prototype.context = function() {
	  return this._canvas ? this._canvas.getContext('2d') : null;
	};
	
	prototype.pendingImages = function() {
	  return this._loader.pending();
	};
	
	function clipToBounds(g, items) {
	  if (!items) return null;
	
	  var b = new Bounds(), i, n, item, mark, group;
	  for (i=0, n=items.length; i<n; ++i) {
	    item = items[i];
	    mark = item.mark;
	    group = mark.group;
	    item = marks[mark.marktype].nested ? mark : item;
	    b.union(translate(item.bounds, group));
	    if (item['bounds:prev']) {
	      b.union(translate(item['bounds:prev'], group));
	    }
	  }
	  b.round();
	
	  g.beginPath();
	  g.rect(b.x1, b.y1, b.width(), b.height());
	  g.clip();
	
	  return b;
	}
	
	function translate(bounds, group) {
	  if (group == null) return bounds;
	  var b = bounds.clone();
	  for (; group != null; group = group.mark.group) {
	    b.translate(group.x || 0, group.y || 0);
	  }
	  return b;
	}
	
	prototype.render = function(scene, items) {
	  var g = this.context(),
	      p = this._padding,
	      w = this._width + p.left + p.right,
	      h = this._height + p.top + p.bottom,
	      b;
	
	  // setup
	  this._scene = scene; // cache scene for async redraw
	  g.save();
	  b = clipToBounds(g, items);
	  this.clear(-p.left, -p.top, w, h);
	
	  // render
	  this.draw(g, scene, b);
	  
	  // takedown
	  g.restore();
	  this._scene = null; // clear scene cache
	
	  return this;
	};
	
	prototype.draw = function(ctx, scene, bounds) {
	  var mark = marks[scene.marktype];
	  mark.draw.call(this, ctx, scene, bounds);
	};
	
	prototype.clear = function(x, y, w, h) {
	  var g = this.context();
	  g.clearRect(x, y, w, h);
	  if (this._bgcolor != null) {
	    g.fillStyle = this._bgcolor;
	    g.fillRect(x, y, w, h); 
	  }
	};
	
	prototype.loadImage = function(uri) {
	  var renderer = this,
	      scene = this._scene;
	  return this._loader.loadImage(uri, function() {
	    renderer.renderAsync(scene);
	  });
	};
	
	prototype.renderAsync = function(scene) {
	  // TODO make safe for multiple scene rendering?
	  var renderer = this;
	  if (renderer._async_id) {
	    clearTimeout(renderer._async_id);
	  }
	  renderer._async_id = setTimeout(function() {
	    renderer.render(scene);
	    delete renderer._async_id;
	  }, 10);
	};
	
	module.exports = CanvasRenderer;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	var load = __webpack_require__(24);
	
	function ImageLoader(loadConfig) {
	  this._pending = 0;
	  this._config = loadConfig || ImageLoader.Config; 
	}
	
	// Overridable global default load configuration
	ImageLoader.Config = null;
	
	var prototype = ImageLoader.prototype;
	
	prototype.pending = function() {
	  return this._pending;
	};
	
	prototype.params = function(uri) {
	  var p = {url: uri}, k;
	  for (k in this._config) { p[k] = this._config[k]; }
	  return p;
	};
	
	prototype.imageURL = function(uri) {
	  return load.sanitizeUrl(this.params(uri));
	};
	
	function browser(uri, callback) {
	  var url = load.sanitizeUrl(this.params(uri));
	  if (!url) { // error
	    if (callback) callback(uri, null);
	    return null;
	  }
	
	  var loader = this,
	      image = new Image();
	
	  loader._pending += 1;
	
	  image.onload = function() {
	    loader._pending -= 1;
	    image.loaded = true;
	    if (callback) callback(null, image);
	  };
	  image.src = url;
	
	  return image;
	}
	
	function server(uri, callback) {
	  var loader = this,
	      image = new (__webpack_require__(93).Image)();
	
	  loader._pending += 1;
	
	  load(this.params(uri), function(err, data) {
	    loader._pending -= 1;
	    if (err) {
	      if (callback) callback(err, null);
	      return null;
	    }
	    image.src = data;
	    image.loaded = true;
	    if (callback) callback(null, image);
	  });
	
	  return image;
	}
	
	prototype.loadImage = function(uri, callback) {
	  return load.useXHR ?
	    browser.call(this, uri, callback) :
	    server.call(this, uri, callback);
	};
	
	module.exports = ImageLoader;


/***/ },
/* 97 */
/***/ function(module, exports) {

	function Renderer() {
	  this._el = null;
	  this._bgcolor = null;
	}
	
	var prototype = Renderer.prototype;
	
	prototype.initialize = function(el, width, height, padding) {
	  this._el = el;
	  return this.resize(width, height, padding);
	};
	
	// Returns the parent container element for a visualization
	prototype.element = function() {
	  return this._el;
	};
	
	// Returns the scene element (e.g., canvas or SVG) of the visualization
	// Subclasses must override if the first child is not the scene element
	prototype.scene = function() {
	  return this._el && this._el.firstChild;
	};
	
	prototype.background = function(bgcolor) {
	  if (arguments.length === 0) return this._bgcolor;
	  this._bgcolor = bgcolor;
	  return this;
	};
	
	prototype.resize = function(width, height, padding) {
	  this._width = width;
	  this._height = height;
	  this._padding = padding || {top:0, left:0, bottom:0, right:0};
	  return this;
	};
	
	prototype.render = function(/*scene, items*/) {
	  return this;
	};
	
	module.exports = Renderer;

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  Handler:  __webpack_require__(99),
	  Renderer: __webpack_require__(100),
	  string: {
	    Renderer : __webpack_require__(102)
	  }
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	var DOM = __webpack_require__(74),
	    Handler = __webpack_require__(75);
	
	function SVGHandler() {
	  Handler.call(this);
	}
	
	var base = Handler.prototype;
	var prototype = (SVGHandler.prototype = Object.create(base));
	prototype.constructor = SVGHandler;
	
	prototype.initialize = function(el, pad, obj) {
	  this._svg = DOM.find(el, 'svg');
	  return base.initialize.call(this, el, pad, obj);
	};
	
	prototype.svg = function() {
	  return this._svg;
	};
	
	// wrap an event listener for the SVG DOM
	prototype.listener = function(handler) {
	  var that = this;
	  return function(evt) {
	    var target = evt.target,
	        item = target.__data__;
	    evt.vegaType = evt.type;
	    item = Array.isArray(item) ? item[0] : item;
	    handler.call(that._obj, evt, item);
	  };
	};
	
	// add an event handler
	prototype.on = function(type, handler) {
	  var name = this.eventName(type),
	      svg = this._svg,
	      h = this._handlers,
	      x = {
	        type:     type,
	        handler:  handler,
	        listener: this.listener(handler)
	      };
	
	  (h[name] || (h[name] = [])).push(x);
	  svg.addEventListener(name, x.listener);
	  return this;
	};
	
	// remove an event handler
	prototype.off = function(type, handler) {
	  var name = this.eventName(type),
	      svg = this._svg,
	      h = this._handlers[name], i;
	  if (!h) return;
	  for (i=h.length; --i>=0;) {
	    if (h[i].type === type && !handler || h[i].handler === handler) {
	      svg.removeEventListener(name, h[i].listener);
	      h.splice(i, 1);
	    }
	  }
	  return this;
	};
	
	module.exports = SVGHandler;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	var ImageLoader = __webpack_require__(96),
	    Renderer = __webpack_require__(97),
	    text = __webpack_require__(94),
	    DOM = __webpack_require__(74),
	    SVG = __webpack_require__(80),
	    ns = SVG.metadata.xmlns,
	    marks = __webpack_require__(101);
	
	function SVGRenderer(loadConfig) {
	  Renderer.call(this);
	  this._loader = new ImageLoader(loadConfig);
	  this._dirtyID = 0;
	}
	
	var base = Renderer.prototype;
	var prototype = (SVGRenderer.prototype = Object.create(base));
	prototype.constructor = SVGRenderer;
	
	prototype.initialize = function(el, width, height, padding) {
	  if (el) {
	    this._svg = DOM.child(el, 0, 'svg', ns, 'marks');
	    DOM.clear(el, 1);
	    // set the svg root group
	    this._root = DOM.child(this._svg, 0, 'g', ns);
	    DOM.clear(this._svg, 1);
	  }
	
	  // create the svg definitions cache
	  this._defs = {
	    clip_id:  1,
	    gradient: {},
	    clipping: {}
	  };
	
	  // set background color if defined
	  this.background(this._bgcolor);
	
	  return base.initialize.call(this, el, width, height, padding);
	};
	
	prototype.background = function(bgcolor) {
	  if (arguments.length && this._svg) {
	    this._svg.style.setProperty('background-color', bgcolor);
	  }
	  return base.background.apply(this, arguments);
	};
	
	prototype.resize = function(width, height, padding) {
	  base.resize.call(this, width, height, padding);
	  
	  if (this._svg) {
	    var w = this._width,
	        h = this._height,
	        p = this._padding;
	  
	    this._svg.setAttribute('width', w + p.left + p.right);
	    this._svg.setAttribute('height', h + p.top + p.bottom);
	    
	    this._root.setAttribute('transform', 'translate('+p.left+','+p.top+')');
	  }
	
	  return this;
	};
	
	prototype.svg = function() {
	  if (!this._svg) return null;
	
	  var attr = {
	    'class':  'marks',
	    'width':  this._width + this._padding.left + this._padding.right,
	    'height': this._height + this._padding.top + this._padding.bottom,
	  };
	  for (var key in SVG.metadata) {
	    attr[key] = SVG.metadata[key];
	  }
	
	  return DOM.openTag('svg', attr) + this._svg.innerHTML + DOM.closeTag('svg');
	};
	
	prototype.imageURL = function(url) {
	  return this._loader.imageURL(url);
	};
	
	
	// -- Render entry point --
	
	prototype.render = function(scene, items) {
	  if (this._dirtyCheck(items)) {
	    if (this._dirtyAll) this._resetDefs();
	    this.draw(this._root, scene, -1);
	    DOM.clear(this._root, 1);
	  }
	  this.updateDefs();
	  return this;
	};
	
	prototype.draw = function(el, scene, index) {
	  this.drawMark(el, scene, index, marks[scene.marktype]);
	};
	
	
	// -- Manage SVG definitions ('defs') block --
	
	prototype.updateDefs = function() {
	  var svg = this._svg,
	      defs = this._defs,
	      el = defs.el,
	      index = 0, id;
	
	  for (id in defs.gradient) {
	    if (!el) el = (defs.el = DOM.child(svg, 0, 'defs', ns));
	    updateGradient(el, defs.gradient[id], index++);
	  }
	
	  for (id in defs.clipping) {
	    if (!el) el = (defs.el = DOM.child(svg, 0, 'defs', ns));
	    updateClipping(el, defs.clipping[id], index++);
	  }
	
	  // clean-up
	  if (el) {
	    if (index === 0) {
	      svg.removeChild(el);
	      defs.el = null;
	    } else {
	      DOM.clear(el, index);      
	    }
	  }
	};
	
	function updateGradient(el, grad, index) {
	  var i, n, stop;
	
	  el = DOM.child(el, index, 'linearGradient', ns);
	  el.setAttribute('id', grad.id);
	  el.setAttribute('x1', grad.x1);
	  el.setAttribute('x2', grad.x2);
	  el.setAttribute('y1', grad.y1);
	  el.setAttribute('y2', grad.y2);
	  
	  for (i=0, n=grad.stops.length; i<n; ++i) {
	    stop = DOM.child(el, i, 'stop', ns);
	    stop.setAttribute('offset', grad.stops[i].offset);
	    stop.setAttribute('stop-color', grad.stops[i].color);
	  }
	  DOM.clear(el, i);
	}
	
	function updateClipping(el, clip, index) {
	  var rect;
	
	  el = DOM.child(el, index, 'clipPath', ns);
	  el.setAttribute('id', clip.id);
	  rect = DOM.child(el, 0, 'rect', ns);
	  rect.setAttribute('x', 0);
	  rect.setAttribute('y', 0);
	  rect.setAttribute('width', clip.width);
	  rect.setAttribute('height', clip.height);
	}
	
	prototype._resetDefs = function() {
	  var def = this._defs;
	  def.clip_id = 1;
	  def.gradient = {};
	  def.clipping = {};
	};
	
	
	// -- Manage rendering of items marked as dirty --
	
	prototype.isDirty = function(item) {
	  return this._dirtyAll || item.dirty === this._dirtyID;
	};
	
	prototype._dirtyCheck = function(items) {
	  this._dirtyAll = true;
	  if (!items) return true;
	
	  var id = ++this._dirtyID,
	      item, mark, type, mdef, i, n, o;
	
	  for (i=0, n=items.length; i<n; ++i) {
	    item = items[i];
	    mark = item.mark;
	    if (mark.marktype !== type) {
	      // memoize mark instance lookup
	      type = mark.marktype;
	      mdef = marks[type];
	    }
	
	    if (item.status === 'exit') { // EXIT
	      if (item._svg) {
	        if (mdef.nest && item.mark.items.length) {
	          // if nested mark with remaining points, update instead
	          this._update(mdef, item._svg, item.mark.items[0]);
	          o = item.mark.items[0];
	          o._svg = item._svg;
	          o._update = id;
	        } else {
	          // otherwise remove from DOM
	          DOM.remove(item._svg);
	        }
	        item._svg = null;
	      }
	      continue;
	    }
	
	    item = (mdef.nest ? mark.items[0] : item);
	    if (item._update === id) { // Already processed
	      continue;
	    } else if (item._svg) { // UPDATE
	      this._update(mdef, item._svg, item);
	    } else { // ENTER
	      this._dirtyAll = false;
	      dirtyParents(item, id);
	    }
	    item._update = id;
	  }
	  return !this._dirtyAll;
	};
	
	function dirtyParents(item, id) {
	  for (; item && item.dirty !== id; item=item.mark.group) {
	    item.dirty = id;
	    if (item.mark && item.mark.dirty !== id) {
	      item.mark.dirty = id;
	    } else return;
	  }
	}
	
	
	// -- Construct & maintain scenegraph to SVG mapping ---
	
	// Draw a mark container.
	prototype.drawMark = function(el, scene, index, mdef) {
	  if (!this.isDirty(scene)) return;
	
	  var items = mdef.nest ?
	        (scene.items && scene.items.length ? [scene.items[0]] : []) :
	        scene.items || [],
	      events = scene.interactive === false ? 'none' : null,
	      isGroup = (mdef.tag === 'g'),
	      className = DOM.cssClass(scene),
	      p, i, n, c, d, insert;
	
	  p = DOM.child(el, index+1, 'g', ns, className);
	  p.setAttribute('class', className);
	  scene._svg = p;
	  if (!isGroup && events) {
	    p.style.setProperty('pointer-events', events);
	  }
	
	  for (i=0, n=items.length; i<n; ++i) {
	    if (this.isDirty(d = items[i])) {
	      insert = !(this._dirtyAll || d._svg);
	      c = bind(p, mdef, d, i, insert);
	      this._update(mdef, c, d);
	      if (isGroup) {
	        if (insert) this._dirtyAll = true;
	        this._recurse(c, d);
	        if (insert) this._dirtyAll = false;
	      }
	    }
	  }
	  DOM.clear(p, i);
	  return p;
	};
	
	// Recursively process group contents.
	prototype._recurse = function(el, group) {
	  var items = group.items || [],
	      legends = group.legendItems || [],
	      axes = group.axisItems || [],
	      idx = 0, j, m;
	
	  for (j=0, m=axes.length; j<m; ++j) {
	    if (axes[j].layer === 'back') {
	      this.drawMark(el, axes[j], idx++, marks.group);
	    }
	  }
	  for (j=0, m=items.length; j<m; ++j) {
	    this.draw(el, items[j], idx++);
	  }
	  for (j=0, m=axes.length; j<m; ++j) {
	    if (axes[j].layer !== 'back') {
	      this.drawMark(el, axes[j], idx++, marks.group);
	    }
	  }
	  for (j=0, m=legends.length; j<m; ++j) {
	    this.drawMark(el, legends[j], idx++, marks.group);
	  }
	
	  // remove any extraneous DOM elements
	  DOM.clear(el, 1 + idx);
	};
	
	// Bind a scenegraph item to an SVG DOM element.
	// Create new SVG elements as needed.
	function bind(el, mdef, item, index, insert) {
	  // create svg element, bind item data for D3 compatibility
	  var node = DOM.child(el, index, mdef.tag, ns, null, insert);
	  node.__data__ = item;
	  node.__values__ = {fill: 'default'};
	
	  // create background rect
	  if (mdef.tag === 'g') {
	    var bg = DOM.child(node, 0, 'rect', ns, 'background');
	    bg.__data__ = item;
	  }
	
	  // add pointer from scenegraph item to svg element
	  return (item._svg = node);
	}
	
	
	// -- Set attributes & styles on SVG elements ---
	
	var element = null, // temp var for current SVG element
	    values = null;  // temp var for current values hash
	
	// Extra configuration for certain mark types
	var mark_extras = {
	  group: function(mdef, el, item) {
	    element = el.childNodes[0];
	    values = el.__values__; // use parent's values hash
	    mdef.background(emit, item, this);
	
	    var value = item.mark.interactive === false ? 'none' : null;
	    if (value !== values.events) {
	      element.style.setProperty('pointer-events', value);
	      values.events = value;
	    }
	  },
	  text: function(mdef, el, item) {
	    var str = text.value(item.text);
	    if (str !== values.text) {
	      el.textContent = str;
	      values.text = str;
	    }
	    str = text.font(item);
	    if (str !== values.font) {
	      el.style.setProperty('font', str);
	      values.font = str;
	    }
	  }
	};
	
	prototype._update = function(mdef, el, item) {
	  // set dom element and values cache
	  // provides access to emit method
	  element = el;
	  values = el.__values__;
	
	  // apply svg attributes
	  mdef.attr(emit, item, this);
	
	  // some marks need special treatment
	  var extra = mark_extras[mdef.type];
	  if (extra) extra(mdef, el, item);
	
	  // apply svg css styles
	  // note: element may be modified by 'extra' method
	  this.style(element, item);
	};
	
	function emit(name, value, ns) {
	  // early exit if value is unchanged
	  if (value === values[name]) return;
	
	  if (value != null) {
	    // if value is provided, update DOM attribute
	    if (ns) {
	      element.setAttributeNS(ns, name, value);
	    } else {
	      element.setAttribute(name, value);
	    }
	  } else {
	    // else remove DOM attribute
	    if (ns) {
	      element.removeAttributeNS(ns, name);
	    } else {
	      element.removeAttribute(name);
	    }
	  }
	
	  // note current value for future comparison
	  values[name] = value;
	}
	
	prototype.style = function(el, o) {
	  if (o == null) return;
	  var i, n, prop, name, value;
	
	  for (i=0, n=SVG.styleProperties.length; i<n; ++i) {
	    prop = SVG.styleProperties[i];
	    value = o[prop];
	    if (value === values[prop]) continue;
	
	    name = SVG.styles[prop];
	    if (value == null) {
	      if (name === 'fill') {
	        el.style.setProperty(name, 'none');
	      } else {
	        el.style.removeProperty(name);
	      }
	    } else {
	      if (value.id) {
	        // ensure definition is included
	        this._defs.gradient[value.id] = value;
	        value = 'url(' + href() + '#' + value.id + ')';
	      }
	      el.style.setProperty(name, value+'');
	    }
	
	    values[prop] = value;
	  }
	};
	
	function href() {
	  return typeof window !== 'undefined' ? window.location.href : '';
	}
	
	module.exports = SVGRenderer;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var text = __webpack_require__(94),
	    SVG = __webpack_require__(80),
	    textAlign = SVG.textAlign,
	    path = SVG.path;
	
	function translateItem(o) {
	  return translate(o.x || 0, o.y || 0);
	}
	
	function translate(x, y) {
	  return 'translate(' + x + ',' + y + ')';
	}
	
	module.exports = {
	  arc: {
	    tag:  'path',
	    type: 'arc',
	    attr: function(emit, o) {
	      emit('transform', translateItem(o));
	      emit('d', path.arc(o));
	    }
	  },
	  area: {
	    tag:  'path',
	    type: 'area',
	    nest: true,
	    attr: function(emit, o) {
	      var items = o.mark.items;
	      if (items.length) emit('d', path.area(items));
	    }
	  },
	  group: {
	    tag:  'g',
	    type: 'group',
	    attr: function(emit, o, renderer) {
	      var id = null, defs, c;
	      emit('transform', translateItem(o));
	      if (o.clip) {
	        defs = renderer._defs;
	        id = o.clip_id || (o.clip_id = 'clip' + defs.clip_id++);
	        c = defs.clipping[id] || (defs.clipping[id] = {id: id});
	        c.width = o.width || 0;
	        c.height = o.height || 0;
	      }
	      emit('clip-path', id ? ('url(#' + id + ')') : null);
	    },
	    background: function(emit, o) {
	      emit('class', 'background');
	      emit('width', o.width || 0);
	      emit('height', o.height || 0);
	    }
	  },
	  image: {
	    tag:  'image',
	    type: 'image',
	    attr: function(emit, o, renderer) {
	      var x = o.x || 0,
	          y = o.y || 0,
	          w = o.width || 0,
	          h = o.height || 0,
	          url = renderer.imageURL(o.url);
	
	      x = x - (o.align === 'center' ? w/2 : o.align === 'right' ? w : 0);
	      y = y - (o.baseline === 'middle' ? h/2 : o.baseline === 'bottom' ? h : 0);
	
	      emit('href', url, 'http://www.w3.org/1999/xlink', 'xlink:href');
	      emit('transform', translate(x, y));
	      emit('width', w);
	      emit('height', h);
	    }
	  },
	  line: {
	    tag:  'path',
	    type: 'line',
	    nest: true,
	    attr: function(emit, o) {
	      var items = o.mark.items;
	      if (items.length) emit('d', path.line(items));
	    }
	  },
	  path: {
	    tag:  'path',
	    type: 'path',
	    attr: function(emit, o) {
	      emit('transform', translateItem(o));
	      emit('d', o.path);
	    }
	  },
	  rect: {
	    tag:  'rect',
	    type: 'rect',
	    nest: false,
	    attr: function(emit, o) {
	      emit('transform', translateItem(o));
	      emit('width', o.width || 0);
	      emit('height', o.height || 0);
	    }
	  },
	  rule: {
	    tag:  'line',
	    type: 'rule',
	    attr: function(emit, o) {
	      emit('transform', translateItem(o));
	      emit('x2', o.x2 != null ? o.x2 - (o.x||0) : 0);
	      emit('y2', o.y2 != null ? o.y2 - (o.y||0) : 0);
	    }
	  },
	  symbol: {
	    tag:  'path',
	    type: 'symbol',
	    attr: function(emit, o) {
	      emit('transform', translateItem(o));
	      emit('d', path.symbol(o));
	    }
	  },
	  text: {
	    tag:  'text',
	    type: 'text',
	    nest: false,
	    attr: function(emit, o) {
	      var dx = (o.dx || 0),
	          dy = (o.dy || 0) + text.offset(o),
	          x = (o.x || 0),
	          y = (o.y || 0),
	          a = o.angle || 0,
	          r = o.radius || 0, t;
	
	      if (r) {
	        t = (o.theta || 0) - Math.PI/2;
	        x += r * Math.cos(t);
	        y += r * Math.sin(t);
	      }
	
	      emit('text-anchor', textAlign[o.align] || 'start');
	      
	      if (a) {
	        t = translate(x, y) + ' rotate('+a+')';
	        if (dx || dy) t += ' ' + translate(dx, dy);
	      } else {
	        t = translate(x+dx, y+dy);
	      }
	      emit('transform', t);
	    }
	  }
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	var Renderer = __webpack_require__(97),
	    ImageLoader = __webpack_require__(96),
	    SVG = __webpack_require__(80),
	    text = __webpack_require__(94),
	    DOM = __webpack_require__(74),
	    openTag = DOM.openTag,
	    closeTag = DOM.closeTag,
	    MARKS = __webpack_require__(101);
	
	function SVGStringRenderer(loadConfig) {
	  Renderer.call(this);
	
	  this._loader = new ImageLoader(loadConfig);
	
	  this._text = {
	    head: '',
	    root: '',
	    foot: '',
	    defs: '',
	    body: ''
	  };
	
	  this._defs = {
	    clip_id:  1,
	    gradient: {},
	    clipping: {}
	  };
	}
	
	var base = Renderer.prototype;
	var prototype = (SVGStringRenderer.prototype = Object.create(base));
	prototype.constructor = SVGStringRenderer;
	
	prototype.resize = function(width, height, padding) {
	  base.resize.call(this, width, height, padding);
	  var p = this._padding,
	      t = this._text;
	
	  var attr = {
	    'class':  'marks',
	    'width':  this._width + p.left + p.right,
	    'height': this._height + p.top + p.bottom,
	  };
	  for (var key in SVG.metadata) {
	    attr[key] = SVG.metadata[key];
	  }
	
	  t.head = openTag('svg', attr);
	  t.root = openTag('g', {
	    transform: 'translate(' + p.left + ',' + p.top + ')'
	  });
	  t.foot = closeTag('g') + closeTag('svg');
	
	  return this;
	};
	
	prototype.svg = function() {
	  var t = this._text;
	  return t.head + t.defs + t.root + t.body + t.foot;
	};
	
	prototype.render = function(scene) {
	  this._text.body = this.mark(scene);
	  this._text.defs = this.buildDefs();
	  return this;
	};
	
	prototype.reset = function() {
	  this._defs.clip_id = 0;
	  return this;
	};
	
	prototype.buildDefs = function() {
	  var all = this._defs,
	      defs = '',
	      i, id, def, stops;
	
	  for (id in all.gradient) {
	    def = all.gradient[id];
	    stops = def.stops;
	
	    defs += openTag('linearGradient', {
	      id: id,
	      x1: def.x1,
	      x2: def.x2,
	      y1: def.y1,
	      y2: def.y2
	    });
	    
	    for (i=0; i<stops.length; ++i) {
	      defs += openTag('stop', {
	        offset: stops[i].offset,
	        'stop-color': stops[i].color
	      }) + closeTag('stop');
	    }
	    
	    defs += closeTag('linearGradient');
	  }
	  
	  for (id in all.clipping) {
	    def = all.clipping[id];
	
	    defs += openTag('clipPath', {id: id});
	
	    defs += openTag('rect', {
	      x: 0,
	      y: 0,
	      width: def.width,
	      height: def.height
	    }) + closeTag('rect');
	
	    defs += closeTag('clipPath');
	  }
	  
	  return (defs.length > 0) ? openTag('defs') + defs + closeTag('defs') : '';
	};
	
	prototype.imageURL = function(url) {
	  return this._loader.imageURL(url);
	};
	
	var object;
	
	function emit(name, value, ns, prefixed) {
	  object[prefixed || name] = value;
	}
	
	prototype.attributes = function(attr, item) {
	  object = {};
	  attr(emit, item, this);
	  return object;
	};
	
	prototype.mark = function(scene) {
	  var mdef = MARKS[scene.marktype],
	      tag  = mdef.tag,
	      attr = mdef.attr,
	      nest = mdef.nest || false,
	      data = nest ?
	          (scene.items && scene.items.length ? [scene.items[0]] : []) :
	          (scene.items || []),
	      defs = this._defs,
	      str = '',
	      style, i, item;
	
	  if (tag !== 'g' && scene.interactive === false) {
	    style = 'style="pointer-events: none;"';
	  }
	
	  // render opening group tag
	  str += openTag('g', {
	    'class': DOM.cssClass(scene)
	  }, style);
	
	  // render contained elements
	  for (i=0; i<data.length; ++i) {
	    item = data[i];
	    style = (tag !== 'g') ? styles(item, scene, tag, defs) : null;
	    str += openTag(tag, this.attributes(attr, item), style);
	    if (tag === 'text') {
	      str += escape_text(text.value(item.text));
	    } else if (tag === 'g') {
	      str += openTag('rect',
	        this.attributes(mdef.background, item),
	        styles(item, scene, 'bgrect', defs)) + closeTag('rect');
	      str += this.markGroup(item);
	    }
	    str += closeTag(tag);
	  }
	
	  // render closing group tag
	  return str + closeTag('g');
	};
	
	prototype.markGroup = function(scene) {
	  var str = '',
	      axes = scene.axisItems || [],
	      items = scene.items || [],
	      legends = scene.legendItems || [],
	      j, m;
	
	  for (j=0, m=axes.length; j<m; ++j) {
	    if (axes[j].layer === 'back') {
	      str += this.mark(axes[j]);
	    }
	  }
	  for (j=0, m=items.length; j<m; ++j) {
	    str += this.mark(items[j]);
	  }
	  for (j=0, m=axes.length; j<m; ++j) {
	    if (axes[j].layer !== 'back') {
	      str += this.mark(axes[j]);
	    }
	  }
	  for (j=0, m=legends.length; j<m; ++j) {
	    str += this.mark(legends[j]);
	  }
	
	  return str;
	};
	
	function styles(o, mark, tag, defs) {
	  if (o == null) return '';
	  var i, n, prop, name, value, s = '';
	
	  if (tag === 'bgrect' && mark.interactive === false) {
	    s += 'pointer-events: none;';
	  }
	
	  if (tag === 'text') {
	    s += 'font: ' + text.font(o) + ';';
	  }
	
	  for (i=0, n=SVG.styleProperties.length; i<n; ++i) {
	    prop = SVG.styleProperties[i];
	    name = SVG.styles[prop];
	    value = o[prop];
	
	    if (value == null) {
	      if (name === 'fill') {
	        s += (s.length ? ' ' : '') + 'fill: none;';
	      }
	    } else {
	      if (value.id) {
	        // ensure definition is included
	        defs.gradient[value.id] = value;
	        value = 'url(#' + value.id + ')';
	      }
	      s += (s.length ? ' ' : '') + name + ': ' + value + ';';
	    }
	  }
	
	  return s ? 'style="' + s + '"' : null;
	}
	
	function escape_text(s) {
	  return s.replace(/&/g, '&amp;')
	          .replace(/</g, '&lt;')
	          .replace(/>/g, '&gt;');
	}
	
	module.exports = SVGStringRenderer;


/***/ },
/* 103 */
/***/ function(module, exports) {

	function Item(mark) {
	  this.mark = mark;
	}
	
	var prototype = Item.prototype;
	
	prototype.hasPropertySet = function(name) {
	  var props = this.mark.def.properties;
	  return props && props[name] != null;
	};
	
	prototype.cousin = function(offset, index) {
	  if (offset === 0) return this;
	  offset = offset || -1;
	  var mark = this.mark,
	      group = mark.group,
	      iidx = index==null ? mark.items.indexOf(this) : index,
	      midx = group.items.indexOf(mark) + offset;
	  return group.items[midx].items[iidx];
	};
	
	prototype.sibling = function(offset) {
	  if (offset === 0) return this;
	  offset = offset || -1;
	  var mark = this.mark,
	      iidx = mark.items.indexOf(this) + offset;
	  return mark.items[iidx];
	};
	
	prototype.remove = function() {
	  var item = this,
	      list = item.mark.items,
	      i = list.indexOf(item);
	  if (i >= 0) {
	    if (i===list.length-1) {
	      list.pop();
	    } else {
	      list.splice(i, 1);
	    }
	  }
	  return item;
	};
	
	prototype.touch = function() {
	  if (this.pathCache) this.pathCache = null;
	};
	
	module.exports = Item;

/***/ },
/* 104 */
/***/ function(module, exports) {

	var gradient_id = 0;
	
	function Gradient(type) {
	  this.id = 'gradient_' + (gradient_id++);
	  this.type = type || 'linear';
	  this.stops = [];
	  this.x1 = 0;
	  this.x2 = 1;
	  this.y1 = 0;
	  this.y2 = 0;
	}
	
	var prototype = Gradient.prototype;
	
	prototype.stop = function(offset, color) {
	  this.stops.push({
	    offset: offset,
	    color: color
	  });
	  return this;
	};
	
	module.exports = Gradient;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	var bound = __webpack_require__(90);
	
	var sets = [
	  'items',
	  'axisItems',
	  'legendItems'
	];
	
	var keys = [
	  'marktype', 'name', 'interactive', 'clip',
	  'items', 'axisItems', 'legendItems', 'layer',
	  'x', 'y', 'width', 'height', 'align', 'baseline',             // layout
	  'fill', 'fillOpacity', 'opacity',                             // fill
	  'stroke', 'strokeOpacity', 'strokeWidth', 'strokeCap',        // stroke
	  'strokeDash', 'strokeDashOffset',                             // stroke dash
	  'startAngle', 'endAngle', 'innerRadius', 'outerRadius',       // arc
	  'interpolate', 'tension', 'orient',                           // area, line
	  'url',                                                        // image
	  'path',                                                       // path
	  'x2', 'y2',                                                   // rule
	  'size', 'shape',                                              // symbol
	  'text', 'angle', 'theta', 'radius', 'dx', 'dy',               // text
	  'font', 'fontSize', 'fontWeight', 'fontStyle', 'fontVariant'  // font
	];
	
	function toJSON(scene, indent) {
	  return JSON.stringify(scene, keys, indent);
	}
	
	function fromJSON(json) {
	  var scene = (typeof json === 'string' ? JSON.parse(json) : json);
	  return initialize(scene);
	}
	
	function initialize(scene) {
	  var type = scene.marktype,
	      i, n, s, m, items;
	
	  for (s=0, m=sets.length; s<m; ++s) {
	    if ((items = scene[sets[s]])) {
	      for (i=0, n=items.length; i<n; ++i) {
	        items[i][type ? 'mark' : 'group'] = scene;
	        if (!type || type === 'group') {
	          initialize(items[i]);
	        }
	      }
	    }
	  }
	
	  if (type) bound.mark(scene);
	  return scene;
	}
	
	module.exports = {
	  toJSON:   toJSON,
	  fromJSON: fromJSON
	};

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63);
	
	function parseBg(bg) {
	  // return null if input is null or undefined
	  if (bg == null) return null;
	  // run through d3 rgb to sanity check
	  return d3.rgb(bg) + '';
	}
	
	module.exports = parseBg;
	
	parseBg.schema = {"defs": {"background": {"type": "string"}}};


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    parseTransforms = __webpack_require__(108),
	    parseModify = __webpack_require__(140);
	
	function parseData(model, spec, callback) {
	  var config = model.config(),
	      count = 0;
	
	  function onError(error, d) {
	    log.error('PARSE DATA FAILED: ' + d.name + ' ' + error);
	    count = -1;
	    callback(error);
	  }
	
	  function onLoad(d) {
	    return function(error, data) {
	      if (error) {
	        onError(error, d);
	      } else if (count > 0) {
	        try {
	          model.data(d.name).values(dl.read(data, d.format));
	          if (--count === 0) callback();
	        } catch (err) {
	          onError(err, d);
	        }
	      }
	    };
	  }
	
	  // process each data set definition
	  (spec || []).forEach(function(d) {
	    if (d.url) {
	      count += 1;
	      dl.load(dl.extend({url: d.url}, config.load), onLoad(d));
	    }
	    try {
	      parseData.datasource(model, d);
	    } catch (err) {
	      onError(err, d);
	    }
	  });
	
	  if (count === 0) setTimeout(callback, 1);
	  return spec;
	}
	
	parseData.datasource = function(model, d) {
	  var transform = (d.transform || []).map(function(t) {
	        return parseTransforms(model, t);
	      }),
	      mod = (d.modify || []).map(function(m) {
	        return parseModify(model, m, d);
	      }),
	      ds = model.data(d.name, mod.concat(transform));
	
	  if (d.values) {
	    ds.values(dl.read(d.values, d.format));
	  } else if (d.source) {
	    // Derived ds will be pulsed by its src rather than the model.
	    ds.source(d.source).addListener(ds);
	    model.removeListener(ds.pipeline()[0]);
	  }
	
	  return ds;
	};
	
	module.exports = parseData;
	
	var parseDef = {
	  "oneOf": [
	    {"enum": ["auto"]},
	    {
	      "type": "object",
	      "additionalProperties": {
	        "enum": ["number", "boolean", "date", "string"]
	      }
	    }
	  ]
	};
	
	parseData.schema = {
	  "defs": {
	    "data": {
	      "title": "Input data set definition",
	      "type": "object",
	
	      "allOf": [{
	        "properties": {
	          "name": {"type": "string"},
	          "transform": {"$ref": "#/defs/transform"},
	          "modify": {"$ref": "#/defs/modify"},
	          "format": {
	            "type": "object",
	            "oneOf": [{
	              "properties": {
	                "type": {"enum": ["json"]},
	                "parse": parseDef,
	                "property": {"type": "string"}
	              },
	              "additionalProperties": false
	            }, {
	              "properties": {
	                "type": {"enum": ["csv", "tsv"]},
	                "parse": parseDef
	              },
	              "additionalProperties": false
	            }, {
	              "oneOf": [{
	                "properties": {
	                  "type": {"enum": ["topojson"]},
	                  "feature": {"type": "string"}
	                },
	                "additionalProperties": false
	              }, {
	                "properties": {
	                  "type": {"enum": ["topojson"]},
	                  "mesh": {"type": "string"}
	                },
	                "additionalProperties": false
	              }]
	            }, {
	              "properties": {
	                "type": {"enum": ["treejson"]},
	                "children": {"type": "string"},
	                "parse": parseDef
	              },
	              "additionalProperties": false
	            }]
	          }
	        },
	        "required": ["name"]
	      }, {
	        "anyOf": [{
	          "required": ["name", "modify"]
	        }, {
	          "oneOf": [{
	            "properties": {"source": {"type": "string"}},
	            "required": ["source"]
	          }, {
	            "properties": {"values": {"type": "array"}},
	            "required": ["values"]
	          }, {
	            "properties": {"url": {"type": "string"}},
	            "required": ["url"]
	          }]
	        }]
	      }]
	    }
	  }
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    transforms = __webpack_require__(109);
	
	function parseTransforms(model, def) {
	  var transform = transforms[def.type],
	      tx;
	
	  if (!transform) throw new Error('"' + def.type + '" is not a valid transformation');
	
	  tx = new transform(model);
	  // We want to rename output fields before setting any other properties,
	  // as subsequent properties may require output to be set (e.g. group by).
	  if(def.output) tx.output(def.output);
	
	  dl.keys(def).forEach(function(k) {
	    if(k === 'type' || k === 'output') return;
	    tx.param(k, def[k]);
	  });
	
	  return tx;
	}
	
	module.exports = parseTransforms;
	
	var keys = dl.keys(transforms)
	  .filter(function(k) { return transforms[k].schema; });
	
	var defs = keys.reduce(function(acc, k) {
	  return (acc[k+'Transform'] = transforms[k].schema, acc);
	}, {});
	
	parseTransforms.schema = {
	  "defs": dl.extend(defs, {
	    "transform": {
	      "type": "array",
	      "items": {
	        "oneOf": keys.map(function(k) {
	          return {"$ref": "#/defs/"+k+"Transform"};
	        })
	      }
	    }
	  })
	};


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  aggregate:    __webpack_require__(110),
	  bin:          __webpack_require__(114),
	  cross:        __webpack_require__(116),
	  countpattern: __webpack_require__(117),
	  linkpath:     __webpack_require__(118),
	  facet:        __webpack_require__(119),
	  filter:       __webpack_require__(120),
	  fold:         __webpack_require__(121),
	  force:        __webpack_require__(122),
	  formula:      __webpack_require__(124),
	  geo:          __webpack_require__(125),
	  geopath:      __webpack_require__(126),
	  hierarchy:    __webpack_require__(127),
	  impute:       __webpack_require__(128),
	  lookup:       __webpack_require__(129),
	  pie:          __webpack_require__(130),
	  rank:         __webpack_require__(131),
	  sort:         __webpack_require__(132),
	  stack:        __webpack_require__(133),
	  treeify:      __webpack_require__(134),
	  treemap:      __webpack_require__(135),
	  voronoi:      __webpack_require__(136),
	  wordcloud:    __webpack_require__(137)
	};

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    log = __webpack_require__(14),
	    ChangeSet = df.ChangeSet,
	    Tuple = df.Tuple,
	    Deps = df.Dependencies,
	    Transform = __webpack_require__(111),
	    Facetor = __webpack_require__(113);
	
	function Aggregate(graph) {
	  Transform.prototype.init.call(this, graph);
	
	  Transform.addParameters(this, {
	    groupby: {type: 'array<field>'},
	    summarize: {
	      type: 'custom',
	      set: function(summarize) {
	        var signalDeps = {},
	            tx = this._transform,
	            i, len, f, fields, name, ops;
	
	        if (!dl.isArray(fields = summarize)) { // Object syntax from dl
	          fields = [];
	          for (name in summarize) {
	            ops = dl.array(summarize[name]);
	            fields.push({field: name, ops: ops});
	          }
	        }
	
	        function sg(x) { if (x.signal) signalDeps[x.signal] = 1; }
	
	        for (i=0, len=fields.length; i<len; ++i) {
	          f = fields[i];
	          if (f.field.signal) { signalDeps[f.field.signal] = 1; }
	          dl.array(f.ops).forEach(sg);
	          dl.array(f.as).forEach(sg);
	        }
	
	        tx._fields = fields;
	        tx._aggr = null;
	        tx.dependency(Deps.SIGNALS, dl.keys(signalDeps));
	        return tx;
	      }
	    }
	  });
	
	  this._aggr  = null; // dl.Aggregator
	  this._input = null; // Used by Facetor._on_keep.
	  this._args  = null; // To cull re-computation.
	  this._fields = [];
	  this._out = [];
	
	  this._type = TYPES.TUPLE;
	  this._acc = {groupby: dl.true, value: dl.true};
	
	  return this.router(true).produces(true);
	}
	
	var prototype = (Aggregate.prototype = Object.create(Transform.prototype));
	prototype.constructor = Aggregate;
	
	var TYPES = Aggregate.TYPES = {
	  VALUE: 1,
	  TUPLE: 2,
	  MULTI: 3
	};
	
	Aggregate.VALID_OPS = [
	  'values', 'count', 'valid', 'missing', 'distinct',
	  'sum', 'mean', 'average', 'variance', 'variancep', 'stdev',
	  'stdevp', 'median', 'q1', 'q3', 'modeskew', 'min', 'max',
	  'argmin', 'argmax'
	];
	
	prototype.type = function(type) {
	  return (this._type = type, this);
	};
	
	prototype.accessors = function(groupby, value) {
	  var acc = this._acc;
	  acc.groupby = dl.$(groupby) || dl.true;
	  acc.value = dl.$(value) || dl.true;
	};
	
	prototype.aggr = function() {
	  if (this._aggr) return this._aggr;
	
	  var g = this._graph,
	      hasGetter = false,
	      args = [],
	      groupby = this.param('groupby').field,
	      value = function(x) { return x.signal ? g.signalRef(x.signal) : x; };
	
	  // Prepare summarize fields.
	  var fields = this._fields.map(function(f) {
	    var field = {
	      name: value(f.field),
	      as:   dl.array(f.as),
	      ops:  dl.array(value(f.ops)).map(value),
	      get:  f.get
	    };
	    hasGetter = hasGetter || field.get != null;
	    args.push(field.name);
	    return field;
	  });
	
	  // If there is an arbitrary getter, all bets are off.
	  // Otherwise, we can check argument fields to cull re-computation.
	  groupby.forEach(function(g) {
	    if (g.get) hasGetter = true;
	    args.push(g.name || g);
	  });
	  this._args = hasGetter || !fields.length ? null : args;
	
	  if (!fields.length) fields = {'*': 'values'};
	
	  // Instantiate our aggregator instance.
	  // Facetor is a special subclass that can facet into data pipelines.
	  var aggr = this._aggr = new Facetor()
	    .groupby(groupby)
	    .stream(true)
	    .summarize(fields);
	
	  // Collect output fields sets by this aggregate.
	  this._out = getFields(aggr);
	
	  // If we are processing tuples, key them by '_id'.
	  if (this._type !== TYPES.VALUE) { aggr.key('_id'); }
	
	  return aggr;
	};
	
	function getFields(aggr) {
	  // Collect the output fields set by this aggregate.
	  var f = [], i, n, j, m, dims, vals, meas;
	
	  dims = aggr._dims;
	  for (i=0, n=dims.length; i<n; ++i) {
	    f.push(dims[i].name);
	  }
	
	  vals = aggr._aggr;
	  for (i=0, n=vals.length; i<n; ++i) {
	    meas = vals[i].measures.fields;
	    for (j=0, m=meas.length; j<m; ++j) {
	      f.push(meas[j]);
	    }
	  }
	
	  return f;
	}
	
	prototype.transform = function(input, reset) {
	  log.debug(input, ['aggregate']);
	
	  var output = ChangeSet.create(input),
	      aggr = this.aggr(),
	      out = this._out,
	      args = this._args,
	      reeval = true,
	      p = Tuple.prev,
	      add, rem, mod, mark, i;
	
	  // Upon reset, retract prior tuples and re-initialize.
	  if (reset) {
	    output.rem.push.apply(output.rem, aggr.result());
	    aggr.clear();
	    this._aggr = null;
	    aggr = this.aggr();
	  }
	
	  // Get update methods according to input type.
	  if (this._type === TYPES.TUPLE) {
	    add  = function(x) { aggr._add(x); Tuple.prev_init(x); };
	    rem  = function(x) { aggr._rem(p(x)); };
	    mod  = function(x) { aggr._mod(x, p(x)); };
	    mark = function(x) { aggr._markMod(x, p(x)); };
	  } else {
	    var gby = this._acc.groupby,
	        val = this._acc.value,
	        get = this._type === TYPES.VALUE ? val : function(x) {
	          return { _id: x._id, groupby: gby(x), value: val(x) };
	        };
	    add  = function(x) { aggr._add(get(x)); Tuple.prev_init(x); };
	    rem  = function(x) { aggr._rem(get(p(x))); };
	    mod  = function(x) { aggr._mod(get(x), get(p(x))); };
	    mark = function(x) { aggr._mark(get(x), get(p(x))); };
	  }
	
	  input.add.forEach(add);
	  if (reset) {
	    // A signal change triggered reflow. Add everything.
	    // No need for rem, we cleared the aggregator.
	    input.mod.forEach(add);
	  } else {
	    input.rem.forEach(rem);
	
	    // If possible, check argument fields to see if we need to re-process mods.
	    if (args) for (i=0, reeval=false; i<args.length; ++i) {
	      if (input.fields[args[i]]) { reeval = true; break; }
	    }
	    input.mod.forEach(reeval ? mod : mark);
	  }
	
	  // Indicate output fields and return aggregate tuples.
	  for (i=0; i<out.length; ++i) {
	    output.fields[out[i]] = 1;
	  }
	  return (aggr._input = input, aggr.changes(output));
	};
	
	module.exports = Aggregate;
	
	var VALID_OPS = Aggregate.VALID_OPS;
	
	Aggregate.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Aggregate transform",
	  "description": "Compute summary aggregate statistics",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["aggregate"]},
	    "groupby": {
	      "type": "array",
	      "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]},
	      "description": "A list of fields to split the data into groups."
	    },
	    "summarize": {
	      "oneOf": [
	        {
	          "type": "object",
	          "additionalProperties": {
	            "type": "array",
	            "description": "An array of aggregate functions.",
	            "items": {"oneOf": [{"enum": VALID_OPS}, {"$ref": "#/refs/signal"}]}
	          }
	        },
	        {
	          "type": "array",
	          "items": {
	            "type": "object",
	            "properties": {
	              "field": {
	                "description": "The name of the field to aggregate.",
	                "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	              },
	              "ops": {
	                "type": "array",
	                "description": "An array of aggregate functions.",
	                "items": {"oneOf": [{"enum": VALID_OPS}, {"$ref": "#/refs/signal"}]}
	              },
	              "as": {
	                "type": "array",
	                "description": "An optional array of names to use for the output fields.",
	                "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	              }
	            },
	            "additionalProperties": false,
	            "required": ["field", "ops"]
	          }
	        }
	      ]
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	var df = __webpack_require__(10),
	    Base = df.Node.prototype, // jshint ignore:line
	    Deps = df.Dependencies,
	    Parameter = __webpack_require__(112);
	
	function Transform(graph) {
	  if (graph) Base.init.call(this, graph);
	}
	
	Transform.addParameters = function(proto, params) {
	  proto._parameters = proto._parameters || {};
	  for (var name in params) {
	    var p = params[name],
	        param = new Parameter(name, p.type, proto);
	
	    proto._parameters[name] = param;
	
	    if (p.type === 'custom') {
	      if (p.set) param.set = p.set.bind(param);
	      if (p.get) param.get = p.get.bind(param);
	    }
	
	    if (p.hasOwnProperty('default')) param.set(p.default);
	  }
	};
	
	var prototype = (Transform.prototype = Object.create(Base));
	prototype.constructor = Transform;
	
	prototype.param = function(name, value) {
	  var param = this._parameters[name];
	  return (param === undefined) ? this :
	    (arguments.length === 1) ? param.get() : param.set(value);
	};
	
	// Perform transformation. Subclasses should override.
	prototype.transform = function(input/*, reset */) {
	  return input;
	};
	
	prototype.evaluate = function(input) {
	  // Many transforms store caches that must be invalidated if
	  // a signal value has changed.
	  var reset = this._stamp < input.stamp &&
	    this.dependency(Deps.SIGNALS).reduce(function(c, s) {
	      return c += input.signals[s] ? 1 : 0;
	    }, 0);
	  return this.transform(input, reset);
	};
	
	prototype.output = function(map) {
	  for (var key in this._output) {
	    if (map[key] !== undefined) {
	      this._output[key] = map[key];
	    }
	  }
	  return this;
	};
	
	module.exports = Transform;


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Deps = __webpack_require__(10).Dependencies;
	
	var arrayType = /array/i,
	    dataType  = /data/i,
	    fieldType = /field/i,
	    exprType  = /expr/i,
	    valType   = /value/i;
	
	function Parameter(name, type, transform) {
	  this._name = name;
	  this._type = type;
	  this._transform = transform;
	
	  // If parameter is defined w/signals, it must be resolved
	  // on every pulse.
	  this._value = [];
	  this._accessors = [];
	  this._resolution = false;
	  this._signals = [];
	}
	
	var prototype = Parameter.prototype;
	
	function get() {
	  var isArray = arrayType.test(this._type),
	      isData  = dataType.test(this._type),
	      isField = fieldType.test(this._type);
	
	  var val = isArray ? this._value : this._value[0],
	      acc = isArray ? this._accessors : this._accessors[0];
	
	  if (!dl.isValid(acc) && valType.test(this._type)) {
	    return val;
	  } else {
	    return isData ? { name: val, source: acc } :
	    isField ? { field: val, accessor: acc } : val;
	  }
	}
	
	prototype.get = function() {
	  var graph = this._transform._graph,
	      isData  = dataType.test(this._type),
	      isField = fieldType.test(this._type),
	      i, n, sig, idx, val;
	
	  // If we don't require resolution, return the value immediately.
	  if (!this._resolution) return get.call(this);
	
	  if (isData) {
	    this._accessors = this._value.map(function(v) { return graph.data(v); });
	    return get.call(this); // TODO: support signal as dataTypes
	  }
	
	  for (i=0, n=this._signals.length; i<n; ++i) {
	    sig = this._signals[i];
	    idx = sig.index;
	    val = sig.value(graph);
	
	    if (isField) {
	      this._accessors[idx] = this._value[idx] != val ?
	        dl.accessor(val) : this._accessors[idx];
	    }
	
	    this._value[idx] = val;
	  }
	
	  return get.call(this);
	};
	
	prototype.set = function(value) {
	  var p = this,
	      graph = p._transform._graph,
	      isExpr = exprType.test(this._type),
	      isData  = dataType.test(this._type),
	      isField = fieldType.test(this._type);
	
	  p._signals = [];
	  this._value = dl.array(value).map(function(v, i) {
	    var e;
	    if (dl.isString(v)) {
	      if (isExpr) {
	        e = graph.expr(v);
	        p._transform.dependency(Deps.FIELDS,  e.fields);
	        p._transform.dependency(Deps.SIGNALS, e.globals);
	        p._transform.dependency(Deps.DATA,    e.dataSources);
	        return e.fn;
	      } else if (isField) {  // Backwards compatibility
	        p._accessors[i] = dl.accessor(v);
	        p._transform.dependency(Deps.FIELDS, dl.field(v));
	      } else if (isData) {
	        p._resolution = true;
	        p._transform.dependency(Deps.DATA, v);
	      }
	      return v;
	    } else if (v.value !== undefined) {
	      return v.value;
	    } else if (v.field !== undefined) {
	      p._accessors[i] = dl.accessor(v.field);
	      p._transform.dependency(Deps.FIELDS, dl.field(v.field));
	      return v.field;
	    } else if (v.signal !== undefined) {
	      p._resolution = true;
	      p._transform.dependency(Deps.SIGNALS, v.signal);
	      p._signals.push({
	        index: i,
	        value: function(graph) { return graph.signalRef(v.signal); }
	      });
	      return v.signal;
	    } else if (v.expr !== undefined) {
	      p._resolution = true;
	      e = graph.expr(v.expr);
	      p._transform.dependency(Deps.SIGNALS, e.globals);
	      p._signals.push({
	        index: i,
	        value: function() { return e.fn(); }
	      });
	      return v.expr;
	    }
	
	    return v;
	  });
	
	  return p._transform;
	};
	
	module.exports = Parameter;
	
	// Schema for field|value-type parameters.
	Parameter.schema = {
	  "type": "object",
	  "oneOf": [{
	    "properties": {"field": {"type": "string"}},
	    "required": ["field"]
	  }, {
	    "properties": {"value": {"type": "string"}},
	    "required": ["value"]
	  }]
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Aggregator = dl.Aggregator,
	    Base = Aggregator.prototype,
	    df = __webpack_require__(10),
	    Tuple = df.Tuple,
	    log = __webpack_require__(14),
	    facetID = 0;
	
	function Facetor() {
	  Aggregator.call(this);
	  this._facet = null;
	  this._facetID = ++facetID;
	}
	
	var prototype = (Facetor.prototype = Object.create(Base));
	prototype.constructor = Facetor;
	
	prototype.facet = function(f) {
	  return arguments.length ? (this._facet = f, this) : this._facet;
	};
	
	prototype._ingest = function(t) {
	  return Tuple.ingest(t, null);
	};
	
	prototype._assign = Tuple.set;
	
	function disconnect_cell(facet) {
	  log.debug({}, ['disconnecting cell', this.tuple._id]);
	  var pipeline = this.ds.pipeline();
	  facet.removeListener(pipeline[0]);
	  facet._graph.removeListener(pipeline[0]);
	  facet._graph.disconnect(pipeline);
	}
	
	prototype._newcell = function(x, key) {
	  var cell  = Base._newcell.call(this, x, key),
	      facet = this._facet;
	
	  if (facet) {
	    var graph = facet._graph,
	        tuple = cell.tuple,
	        pipeline = facet.param('transform');
	    cell.ds = graph.data(tuple._facetID, pipeline, tuple);
	    cell.disconnect = disconnect_cell;
	    facet.addListener(pipeline[0]);
	  }
	
	  return cell;
	};
	
	prototype._newtuple = function(x, key) {
	  var t = Base._newtuple.call(this, x);
	  if (this._facet) {
	    Tuple.set(t, 'key', key);
	    Tuple.set(t, '_facetID', this._facetID + '_' + key);
	  }
	  return t;
	};
	
	prototype.clear = function() {
	  if (this._facet) {
	    for (var k in this._cells) {
	      this._cells[k].disconnect(this._facet);
	    }
	  }
	  return Base.clear.call(this);
	};
	
	prototype._on_add = function(x, cell) {
	  if (this._facet) cell.ds._input.add.push(x);
	};
	
	prototype._on_rem = function(x, cell) {
	  if (this._facet) cell.ds._input.rem.push(x);
	};
	
	prototype._on_mod = function(x, prev, cell0, cell1) {
	  if (this._facet) { // Propagate tuples
	    if (cell0 === cell1) {
	      cell0.ds._input.mod.push(x);
	    } else {
	      cell0.ds._input.rem.push(x);
	      cell1.ds._input.add.push(x);
	    }
	  }
	};
	
	prototype._on_drop = function(cell) {
	  if (this._facet) cell.disconnect(this._facet);
	};
	
	prototype._on_keep = function(cell) {
	  // propagate sort, signals, fields, etc.
	  if (this._facet) df.ChangeSet.copy(this._input, cell.ds._input);
	};
	
	module.exports = Facetor;


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Bin(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    field: {type: 'field'},
	    min: {type: 'value'},
	    max: {type: 'value'},
	    base: {type: 'value', default: 10},
	    maxbins: {type: 'value', default: 20},
	    step: {type: 'value'},
	    steps: {type: 'value'},
	    minstep: {type: 'value'},
	    div: {type: 'array<value>', default: [5, 2]}
	  });
	
	  this._output = {
	    start: 'bin_start',
	    end:   'bin_end',
	    mid:   'bin_mid'
	  };
	  return this.mutates(true);
	}
	
	var prototype = (Bin.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Bin;
	
	prototype.extent = function(data) {
	  // TODO only recompute extent upon data or field change?
	  var e = [this.param('min'), this.param('max')], d;
	  if (e[0] == null || e[1] == null) {
	    d = dl.extent(data, this.param('field').accessor);
	    if (e[0] == null) e[0] = d[0];
	    if (e[1] == null) e[1] = d[1];
	  }
	  return e;
	};
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['binning']);
	
	  var extent  = this.extent(data),
	      output  = this._output,
	      step    = this.param('step'),
	      steps   = this.param('steps'),
	      minstep = this.param('minstep'),
	      get     = this.param('field').accessor,
	      opt = {
	        min: extent[0],
	        max: extent[1],
	        base: this.param('base'),
	        maxbins: this.param('maxbins'),
	        div: this.param('div')
	      };
	
	  if (step) opt.step = step;
	  if (steps) opt.steps = steps;
	  if (minstep) opt.minstep = minstep;
	  var b = dl.bins(opt),
	      s = b.step;
	
	  function update(d) {
	    var v = get(d);
	    v = v == null ? null
	      : b.start + s * ~~((v - b.start) / s);
	    Tuple.set(d, output.start, v);
	    Tuple.set(d, output.end, v + s);
	    Tuple.set(d, output.mid, v + s/2);
	  }
	  input.add.forEach(update);
	  input.mod.forEach(update);
	  input.rem.forEach(update);
	
	  input.fields[output.start] = 1;
	  input.fields[output.end] = 1;
	  input.fields[output.mid] = 1;
	  return input;
	};
	
	module.exports = Bin;
	
	Bin.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Bin transform",
	  "description": "Bins values into quantitative bins (e.g., for a histogram).",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["bin"]},
	    "field": {
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "description": "The name of the field to bin values from."
	    },
	    "min": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "The minimum bin value to consider."
	    },
	    "max": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "The maximum bin value to consider."
	    },
	    "base": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "The number base to use for automatic bin determination.",
	      "default": 10
	    },
	    "maxbins": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "The maximum number of allowable bins.",
	      "default": 20
	    },
	    "step": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "An exact step size to use between bins. If provided, options such as maxbins will be ignored."
	    },
	    "steps": {
	      "description": "An array of allowable step sizes to choose from.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"type": "number"}
	        },
	        {"$ref": "#/refs/signal"}
	      ]
	    },
	    "minstep": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "A minimum allowable step size (particularly useful for integer values)."
	    },
	    "div": {
	      "description": "An array of scale factors indicating allowable subdivisions.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"type": "number"},
	          "default": [5, 2]
	        },
	        {"$ref": "#/refs/signal"}
	      ]
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "start": {"type": "string", "default": "bin_start"},
	        "end": {"type": "string", "default": "bin_end"},
	        "mid": {"type": "string", "default": "bin_mid"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "field"]
	};


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	var Base = __webpack_require__(111).prototype;
	
	function BatchTransform() {
	  // Nearest appropriate collector.
	  // Set by the dataflow Graph during connection.
	  this._collector = null;
	}
	
	var prototype = (BatchTransform.prototype = Object.create(Base));
	prototype.constructor = BatchTransform;
	
	prototype.init = function(graph) {
	  Base.init.call(this, graph);
	  return this.batch(true);
	};
	
	prototype.transform = function(input, reset) {
	  return this.batchTransform(input, this._collector.data(), reset);
	};
	
	prototype.batchTransform = function(/* input, data, reset */) {
	};
	
	module.exports = BatchTransform;


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    ChangeSet = df.ChangeSet,
	    Tuple = df.Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Cross(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    with: {type: 'data'},
	    diagonal: {type: 'value', default: 'true'},
	    filter: {type: 'expr'}
	  });
	
	  this._output = {'left': 'a', 'right': 'b'};
	  this._lastWith = null; // Last time we crossed w/with-ds.
	  this._cids  = {};
	  this._cache = {};
	
	  return this.router(true).produces(true);
	}
	
	var prototype = (Cross.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Cross;
	
	// Each cached incoming tuple also has a flag to determine whether
	// any tuples were filtered.
	function _cache(x, t) {
	  var c = this._cache,
	      cross = c[x._id] || (c[x._id] = {c: [], f: false});
	  cross.c.push(t);
	}
	
	function _cid(left, x, y) {
	  return left ? x._id+'_'+y._id : y._id+'_'+x._id;
	}
	
	function add(output, left, data, diag, test, mids, x) {
	  var as = this._output,
	      cache = this._cache,
	      cids  = this._cids,
	      oadd  = output.add,
	      fltrd = false,
	      i = 0, len = data.length,
	      t = {}, y, cid;
	
	  for (; i<len; ++i) {
	    y = data[i];
	    cid = _cid(left, x, y);
	    if (cids[cid]) continue;
	    if (x._id === y._id && !diag) continue;
	
	    Tuple.set(t, as.left, left ? x : y);
	    Tuple.set(t, as.right, left ? y : x);
	
	    // Only ingest a tuple if we keep it around. Otherwise, flag the
	    // caches as filtered.
	    if (!test || test(t)) {
	      oadd.push(t=Tuple.ingest(t));
	      _cache.call(this, x, t);
	      if (x._id !== y._id) _cache.call(this, y, t);
	      mids[t._id] = 1;
	      cids[cid] = true;
	      t = {};
	    } else {
	      if (cache[y._id]) cache[y._id].f = true;
	      fltrd = true;
	    }
	  }
	
	  if (cache[x._id]) cache[x._id].f = fltrd;
	}
	
	function mod(output, left, data, diag, test, mids, rids, x) {
	  var as = this._output,
	      cache = this._cache,
	      cids  = this._cids,
	      cross = cache[x._id],
	      tpls  = cross && cross.c,
	      fltrd = !cross || cross.f,
	      omod  = output.mod,
	      orem  = output.rem,
	      i, t, y, l, cid;
	
	  // If we have cached values, iterate through them for lazy
	  // removal, and to re-run the filter.
	  if (tpls) {
	    for (i=tpls.length-1; i>=0; --i) {
	      t = tpls[i];
	      l = x === t[as.left]; // Cache has tpls w/x both on left & right.
	      y = l ? t[as.right] : t[as.left];
	      cid = _cid(l, x, y);
	
	      // Lazy removal: y was previously rem'd, so clean up the cache.
	      if (!cache[y._id]) {
	        cids[cid] = false;
	        tpls.splice(i, 1);
	        continue;
	      }
	
	      if (!test || test(t)) {
	        if (mids[t._id]) continue;
	        omod.push(t);
	        mids[t._id] = 1;
	      } else {
	        if (!rids[t._id]) orem.push.apply(orem, tpls.splice(i, 1));
	        rids[t._id] = 1;
	        cids[cid] = false;
	        cross.f = true;
	      }
	    }
	  }
	
	  // If we have a filter param, call add to catch any tuples that may
	  // have previously been filtered.
	  if (test && fltrd) add.call(this, output, left, data, diag, test, mids, x);
	}
	
	function rem(output, left, rids, x) {
	  var as = this._output,
	      cross = this._cache[x._id],
	      cids  = this._cids,
	      orem  = output.rem,
	      i, len, t, y, l;
	  if (!cross) return;
	
	  for (i=0, len=cross.c.length; i<len; ++i) {
	    t = cross.c[i];
	    l = x === t[as.left];
	    y = l ? t[as.right] : t[as.left];
	    cids[_cid(l, x, y)] = false;
	    if (!rids[t._id]) {
	      orem.push(t);
	      rids[t._id] = 1;
	    }
	  }
	
	  this._cache[x._id] = null;
	}
	
	function purge(output, rids) {
	  var cache = this._cache,
	      keys  = dl.keys(cache),
	      rem = output.rem,
	      i, len, j, jlen, cross, t;
	
	  for (i=0, len=keys.length; i<len; ++i) {
	    cross = cache[keys[i]];
	    for (j=0, jlen=cross.c.length; j<jlen; ++j) {
	      t = cross.c[j];
	      if (rids[t._id]) continue;
	      rem.push(t);
	      rids[t._id] = 1;
	    }
	  }
	
	  this._cache = {};
	  this._cids = {};
	  this._lastWith = null;
	}
	
	prototype.batchTransform = function(input, data, reset) {
	  log.debug(input, ['crossing']);
	
	  var w = this.param('with'),
	      diag = this.param('diagonal'),
	      as = this._output,
	      test = this.param('filter') || null,
	      selfCross = (!w.name),
	      woutput = selfCross ? input : w.source.last(),
	      wdata   = selfCross ? data : w.source.values(),
	      output  = ChangeSet.create(input),
	      mids = {}, rids = {}; // Track IDs to prevent dupe mod/rem tuples.
	
	  // If signal values (for diag or test) have changed, purge the cache
	  // and re-run cross in batch mode. Otherwise stream cross values.
	  if (reset) {
	    purge.call(this, output, rids);
	    data.forEach(add.bind(this, output, true, wdata, diag, test, mids));
	    this._lastWith = woutput.stamp;
	  } else {
	    input.rem.forEach(rem.bind(this, output, true, rids));
	    input.add.forEach(add.bind(this, output, true, wdata, diag, test, mids));
	
	    if (woutput.stamp > this._lastWith) {
	      woutput.rem.forEach(rem.bind(this, output, false, rids));
	      woutput.add.forEach(add.bind(this, output, false, data, diag, test, mids));
	      woutput.mod.forEach(mod.bind(this, output, false, data, diag, test, mids, rids));
	      this._lastWith = woutput.stamp;
	    }
	
	    // Mods need to come after all removals have been run.
	    input.mod.forEach(mod.bind(this, output, true, wdata, diag, test, mids, rids));
	  }
	
	  output.fields[as.left]  = 1;
	  output.fields[as.right] = 1;
	  return output;
	};
	
	module.exports = Cross;
	
	Cross.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Cross transform",
	  "description": "Compute the cross-product of two data sets.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["cross"]},
	    "with": {
	      "type": "string",
	      "description": "The name of the secondary data set to cross with the primary data. " +
	        "If unspecified, the primary data is crossed with itself."
	    },
	    "diagonal": {
	      "oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}],
	      "description": "If false, items along the \"diagonal\" of the cross-product " +
	        "(those elements with the same index in their respective array) " +
	        "will not be included in the output.",
	      "default": true
	    },
	    "filter": {
	      "type": "string",
	      "description": "A string containing an expression (in JavaScript syntax) " +
	        "to filter the resulting data elements."
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "left": {"type": "string", "default": "a"},
	        "right": {"type": "string", "default": "b"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var df = __webpack_require__(10),
	    Tuple = df.Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function CountPattern(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    field:     {type: 'field', default: 'data'},
	    pattern:   {type: 'value', default: '[\\w\']+'},
	    case:      {type: 'value', default: 'lower'},
	    stopwords: {type: 'value', default: ''}
	  });
	
	  this._output = {text: 'text', count: 'count'};
	
	  return this.router(true).produces(true);
	}
	
	var prototype = (CountPattern.prototype = Object.create(Transform.prototype));
	prototype.constructor = CountPattern;
	
	prototype.transform = function(input, reset) {
	  log.debug(input, ['countpattern']);
	
	  var get = this.param('field').accessor,
	      pattern = this.param('pattern'),
	      stop = this.param('stopwords'),
	      rem = false;
	
	  // update parameters
	  if (this._stop !== stop) {
	    this._stop = stop;
	    this._stop_re = new RegExp('^' + stop + '$', 'i');
	    reset = true;
	  }
	
	  if (this._pattern !== pattern) {
	    this._pattern = pattern;
	    this._match = new RegExp(this._pattern, 'g');
	    reset = true;
	  }
	
	  if (reset) this._counts = {};
	
	  function curr(t) { return (Tuple.prev_init(t), get(t)); }
	  function prev(t) { return get(Tuple.prev(t)); }
	
	  this._add(input.add, curr);
	  if (!reset) this._rem(input.rem, prev);
	  if (reset || (rem = input.fields[get.field])) {
	    if (rem) this._rem(input.mod, prev);
	    this._add(input.mod, curr);
	  }
	
	  // generate output tuples
	  return this._changeset(input);
	};
	
	prototype._changeset = function(input) {
	  var counts = this._counts,
	      tuples = this._tuples || (this._tuples = {}),
	      change = df.ChangeSet.create(input),
	      out = this._output, w, t, c;
	
	  for (w in counts) {
	    t = tuples[w];
	    c = counts[w] || 0;
	    if (!t && c) {
	      tuples[w] = (t = Tuple.ingest({}));
	      t[out.text] = w;
	      t[out.count] = c;
	      change.add.push(t);
	    } else if (c === 0) {
	      if (t) change.rem.push(t);
	      delete counts[w];
	      delete tuples[w];
	    } else if (t[out.count] !== c) {
	      Tuple.set(t, out.count, c);
	      change.mod.push(t);
	    }
	  }
	  return change;
	};
	
	prototype._tokenize = function(text) {
	  switch (this.param('case')) {
	    case 'upper': text = text.toUpperCase(); break;
	    case 'lower': text = text.toLowerCase(); break;
	  }
	  return text.match(this._match);
	};
	
	prototype._add = function(tuples, get) {
	  var counts = this._counts,
	      stop = this._stop_re,
	      tok, i, j, t;
	
	  for (j=0; j<tuples.length; ++j) {
	    tok = this._tokenize(get(tuples[j]));
	    for (i=0; i<tok.length; ++i) {
	      if (!stop.test(t=tok[i])) {
	        counts[t] = 1 + (counts[t] || 0);
	      }
	    }
	  }
	};
	
	prototype._rem = function(tuples, get) {
	  var counts = this._counts,
	      stop = this._stop_re,
	      tok, i, j, t;
	
	  for (j=0; j<tuples.length; ++j) {
	    tok = this._tokenize(get(tuples[j]));
	    for (i=0; i<tok.length; ++i) {
	      if (!stop.test(t=tok[i])) {
	        counts[t] -= 1;
	      }
	    }
	  }
	};
	
	module.exports = CountPattern;
	
	CountPattern.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "CountPattern transform",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["countpattern"]},
	    "field": {
	      "description": "The field containing the text to analyze.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": 'data'
	    },
	    "pattern": {
	      "description": "A regexp pattern for matching words in text.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "[\\w\']+"
	    },
	    "case": {
	      "description": "Text case transformation to apply.",
	      "oneOf": [{"enum": ["lower", "upper", "none"]}, {"$ref": "#/refs/signal"}],
	      "default": "lower"
	    },
	    "stopwords": {
	      "description": "A regexp pattern for matching stopwords to omit.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": ""
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "text": {"type": "string", "default": "text"},
	        "count": {"type": "string", "default": "count"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	var Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function LinkPath(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    sourceX:  {type: 'field', default: '_source.layout_x'},
	    sourceY:  {type: 'field', default: '_source.layout_y'},
	    targetX:  {type: 'field', default: '_target.layout_x'},
	    targetY:  {type: 'field', default: '_target.layout_y'},
	    tension:  {type: 'value', default: 0.2},
	    shape:    {type: 'value', default: 'line'}
	  });
	
	  this._output = {'path': 'layout_path'};
	  return this.mutates(true);
	}
	
	var prototype = (LinkPath.prototype = Object.create(Transform.prototype));
	prototype.constructor = LinkPath;
	
	function line(sx, sy, tx, ty) {
	  return 'M' + sx + ',' + sy +
	         'L' + tx + ',' + ty;
	}
	
	function curve(sx, sy, tx, ty, tension) {
	  var dx = tx - sx,
	      dy = ty - sy,
	      ix = tension * (dx + dy),
	      iy = tension * (dy - dx);
	  return 'M' + sx + ',' + sy +
	         'C' + (sx+ix) + ',' + (sy+iy) +
	         ' ' + (tx+iy) + ',' + (ty-ix) +
	         ' ' + tx + ',' + ty;
	}
	
	function cornerX(sx, sy, tx, ty) {
	  return 'M' + sx + ',' + sy +
	         'V' + ty + 'H' + tx;
	}
	
	function cornerY(sx, sy, tx, ty) {
	  return 'M' + sx + ',' + sy +
	         'H' + tx + 'V' + ty;
	}
	
	function cornerR(sa, sr, ta, tr) {
	  var sc = Math.cos(sa),
	      ss = Math.sin(sa),
	      tc = Math.cos(ta),
	      ts = Math.sin(ta),
	      sf = Math.abs(ta - sa) > Math.PI ? ta <= sa : ta > sa;
	  return 'M' + (sr*sc) + ',' + (sr*ss) +
	         'A' + sr + ',' + sr + ' 0 0,' + (sf?1:0) +
	         ' ' + (sr*tc) + ',' + (sr*ts) +
	         'L' + (tr*tc) + ',' + (tr*ts);
	}
	
	function diagonalX(sx, sy, tx, ty) {
	  var m = (sx + tx) / 2;
	  return 'M' + sx + ',' + sy +
	         'C' + m  + ',' + sy +
	         ' ' + m  + ',' + ty +
	         ' ' + tx + ',' + ty;
	}
	
	function diagonalY(sx, sy, tx, ty) {
	  var m = (sy + ty) / 2;
	  return 'M' + sx + ',' + sy +
	         'C' + sx + ',' + m +
	         ' ' + tx + ',' + m +
	         ' ' + tx + ',' + ty;
	}
	
	function diagonalR(sa, sr, ta, tr) {
	  var sc = Math.cos(sa),
	      ss = Math.sin(sa),
	      tc = Math.cos(ta),
	      ts = Math.sin(ta),
	      mr = (sr + tr) / 2;
	  return 'M' + (sr*sc) + ',' + (sr*ss) +
	         'C' + (mr*sc) + ',' + (mr*ss) +
	         ' ' + (mr*tc) + ',' + (mr*ts) +
	         ' ' + (tr*tc) + ',' + (tr*ts);
	}
	
	var shapes = {
	  line:      line,
	  curve:     curve,
	  cornerX:   cornerX,
	  cornerY:   cornerY,
	  cornerR:   cornerR,
	  diagonalX: diagonalX,
	  diagonalY: diagonalY,
	  diagonalR: diagonalR
	};
	
	prototype.transform = function(input) {
	  log.debug(input, ['linkpath']);
	
	  var output = this._output,
	      shape = shapes[this.param('shape')] || shapes.line,
	      sourceX = this.param('sourceX').accessor,
	      sourceY = this.param('sourceY').accessor,
	      targetX = this.param('targetX').accessor,
	      targetY = this.param('targetY').accessor,
	      tension = this.param('tension');
	
	  function set(t) {
	    var path = shape(sourceX(t), sourceY(t), targetX(t), targetY(t), tension);
	    Tuple.set(t, output.path, path);
	  }
	
	  input.add.forEach(set);
	  if (this.reevaluate(input)) {
	    input.mod.forEach(set);
	    input.rem.forEach(set);
	  }
	
	  input.fields[output.path] = 1;
	  return input;
	};
	
	module.exports = LinkPath;
	
	LinkPath.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "LinkPath transform",
	  "description": "Computes a path definition for connecting nodes within a node-link network or tree diagram.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["linkpath"]},
	    "sourceX": {
	      "description": "The data field that references the source x-coordinate for this link.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "_source"
	    },
	    "sourceY": {
	      "description": "The data field that references the source y-coordinate for this link.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "_source"
	    },
	    "targetX": {
	      "description": "The data field that references the target x-coordinate for this link.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "_target"
	    },
	    "targetY": {
	      "description": "The data field that references the target y-coordinate for this link.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "_target"
	    },
	    "tension": {
	      "description": "A tension parameter for the \"tightness\" of \"curve\"-shaped links.",
	      "oneOf": [
	        {
	          "type": "number",
	          "minimum": 0,
	          "maximum": 1
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": 0.2
	    },
	    "shape": {
	      "description": "The path shape to use",
	      "oneOf": [
	        {"enum": ["line", "curve", "cornerX", "cornerY", "cornerR", "diagonalX", "diagonalY", "diagonalR"]},
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": "line"
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "path": {"type": "string", "default": "layout_path"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var Transform = __webpack_require__(111),
	    Aggregate = __webpack_require__(110);
	
	function Facet(graph) {
	  Transform.addParameters(this, {
	    transform: {
	      type: "custom",
	      set: function(pipeline) {
	        return (this._transform._pipeline = pipeline, this._transform);
	      },
	      get: function() {
	        var parse = __webpack_require__(108),
	            facet = this._transform;
	        return facet._pipeline.map(function(t) {
	          return parse(facet._graph, t);
	        });
	      }
	    }
	  });
	
	  this._pipeline = [];
	  return Aggregate.call(this, graph);
	}
	
	var prototype = (Facet.prototype = Object.create(Aggregate.prototype));
	prototype.constructor = Facet;
	
	prototype.aggr = function() {
	  return Aggregate.prototype.aggr.call(this).facet(this);
	};
	
	prototype.transform = function(input, reset) {
	  var output  = Aggregate.prototype.transform.call(this, input, reset);
	
	  // New facet cells should trigger a re-ranking of the dataflow graph.
	  // This ensures facet datasources are computed before scenegraph nodes.
	  // We rerank the Facet's first listener, which is the next node in the
	  // datasource's pipeline.
	  if (input.add.length) {
	    this.listeners()[0].rerank();
	  }
	
	  return output;
	};
	
	module.exports = Facet;
	
	var dl = __webpack_require__(18);
	
	Facet.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Facet transform",
	  "description": "A special aggregate transform that organizes a data set into groups or \"facets\".",
	  "type": "object",
	  "properties": dl.extend({}, Aggregate.schema.properties, {
	    "type": {"enum": ["facet"]},
	    "transform": {"$ref": "#/defs/transform"}
	  }),
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var df = __webpack_require__(10),
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Filter(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {test: {type: 'expr'}});
	
	  this._skip = {};
	  return this.router(true);
	}
	
	var prototype = (Filter.prototype = Object.create(Transform.prototype));
	prototype.constructor = Filter;
	
	prototype.transform = function(input) {
	  log.debug(input, ['filtering']);
	
	  var output = df.ChangeSet.create(input),
	      skip = this._skip,
	      test = this.param('test');
	
	  input.rem.forEach(function(x) {
	    if (skip[x._id] !== 1) output.rem.push(x);
	    else skip[x._id] = 0;
	  });
	
	  input.add.forEach(function(x) {
	    if (test(x)) output.add.push(x);
	    else skip[x._id] = 1;
	  });
	
	  input.mod.forEach(function(x) {
	    var b = test(x),
	        s = (skip[x._id] === 1);
	    if (b && s) {
	      skip[x._id] = 0;
	      output.add.push(x);
	    } else if (b && !s) {
	      output.mod.push(x);
	    } else if (!b && s) {
	      // do nothing, keep skip true
	    } else { // !b && !s
	      output.rem.push(x);
	      skip[x._id] = 1;
	    }
	  });
	
	  return output;
	};
	
	module.exports = Filter;
	
	Filter.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Filter transform",
	  "description": "Filters elements from a data set to remove unwanted items.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["filter"]},
	    "test": {
	      "type": "string",
	      "description": "A string containing an expression (in JavaScript syntax) for the filter predicate."
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "test"]
	};


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	var df = __webpack_require__(10),
	    Tuple = df.Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Fold(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    fields: {type: 'array<field>'}
	  });
	
	  this._output = {key: 'key', value: 'value'};
	  this._cache = {};
	
	  return this.router(true).produces(true);
	}
	
	var prototype = (Fold.prototype = Object.create(Transform.prototype));
	prototype.constructor = Fold;
	
	prototype._reset = function(input, output) {
	  for (var id in this._cache) {
	    output.rem.push.apply(output.rem, this._cache[id]);
	  }
	  this._cache = {};
	};
	
	prototype._tuple = function(x, i, len) {
	  var list = this._cache[x._id] || (this._cache[x._id] = Array(len));
	  return list[i] ? Tuple.rederive(x, list[i]) : (list[i] = Tuple.derive(x));
	};
	
	prototype._fn = function(data, on, out) {
	  var i, j, n, m, d, t;
	  for (i=0, n=data.length; i<n; ++i) {
	    d = data[i];
	    for (j=0, m=on.field.length; j<m; ++j) {
	      t = this._tuple(d, j, m);
	      Tuple.set(t, this._output.key, on.field[j]);
	      Tuple.set(t, this._output.value, on.accessor[j](d));
	      out.push(t);
	    }
	  }
	};
	
	prototype.transform = function(input, reset) {
	  log.debug(input, ['folding']);
	
	  var fold = this,
	      on = this.param('fields'),
	      output = df.ChangeSet.create(input);
	
	  if (reset) this._reset(input, output);
	
	  this._fn(input.add, on, output.add);
	  this._fn(input.mod, on, reset ? output.add : output.mod);
	  input.rem.forEach(function(x) {
	    output.rem.push.apply(output.rem, fold._cache[x._id]);
	    fold._cache[x._id] = null;
	  });
	
	  // If we're only propagating values, don't mark key/value as updated.
	  if (input.add.length || input.rem.length ||
	      on.field.some(function(f) { return !!input.fields[f]; })) {
	    output.fields[this._output.key] = 1;
	    output.fields[this._output.value] = 1;
	  }
	  return output;
	};
	
	module.exports = Fold;
	
	Fold.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Fold transform",
	  "description": "Collapse (\"fold\") one or more data properties into two properties.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["fold"]},
	    "fields": {
	      "oneOf": [
	        {
	          "type": "array",
	          "description": "An array of field references indicating the data properties to fold.",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]},
	          "minItems": 1,
	          "uniqueItems": true
	        },
	        {"$ref": "#/refs/signal"}
	      ]
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "key": {"type": "string", "default": "key"},
	        "value": {"type": "string", "default": "value"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "fields"]
	};


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    df = __webpack_require__(10),
	    Tuple = df.Tuple,
	    ChangeSet = df.ChangeSet,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Force(graph) {
	  Transform.prototype.init.call(this, graph);
	
	  this._prev = null;
	  this._interactive = false;
	  this._setup = true;
	  this._nodes  = [];
	  this._links = [];
	  this._layout = d3.layout.force();
	
	  Transform.addParameters(this, {
	    size: {type: 'array<value>', default: __webpack_require__(123).size},
	    bound: {type: 'value', default: true},
	    links: {type: 'data'},
	
	    // TODO: for now force these to be value params only (pun-intended)
	    // Can update to include fields after Parameter refactoring.
	    linkStrength: {type: 'value', default: 1},
	    linkDistance: {type: 'value', default: 20},
	    charge: {type: 'value', default: -30},
	
	    chargeDistance: {type: 'value', default: Infinity},
	    friction: {type: 'value', default: 0.9},
	    theta: {type: 'value', default: 0.8},
	    gravity: {type: 'value', default: 0.1},
	    alpha: {type: 'value', default: 0.1},
	    iterations: {type: 'value', default: 500},
	
	    interactive: {type: 'value', default: this._interactive},
	    active: {type: 'value', default: this._prev},
	    fixed: {type: 'data'}
	  });
	
	  this._output = {
	    'x': 'layout_x',
	    'y': 'layout_y'
	  };
	
	  return this.mutates(true);
	}
	
	var prototype = (Force.prototype = Object.create(Transform.prototype));
	prototype.constructor = Force;
	
	prototype.transform = function(nodeInput, reset) {
	  log.debug(nodeInput, ['force']);
	  reset = reset - (nodeInput.signals.active ? 1 : 0);
	
	  // get variables
	  var interactive = this.param('interactive'),
	      linkSource = this.param('links').source,
	      linkInput = linkSource.last(),
	      active = this.param('active'),
	      output = this._output,
	      layout = this._layout,
	      nodes = this._nodes,
	      links = this._links;
	
	  // configure nodes, links and layout
	  if (linkInput.stamp < nodeInput.stamp) linkInput = null;
	  this.configure(nodeInput, linkInput, interactive, reset);
	
	  // run batch layout
	  if (!interactive) {
	    var iterations = this.param('iterations');
	    for (var i=0; i<iterations; ++i) layout.tick();
	    layout.stop();
	  }
	
	  // update node positions
	  this.update(active);
	
	  // re-up alpha on parameter change
	  if (reset || active !== this._prev && active && active.update) {
	    layout.alpha(this.param('alpha')); // re-start layout
	  }
	
	  // update active node status,
	  if (active !== this._prev) {
	    this._prev = active;
	  }
	
	  // process removed nodes or edges
	  if (nodeInput.rem.length) {
	    layout.nodes(this._nodes = Tuple.idFilter(nodes, nodeInput.rem));
	  }
	  if (linkInput && linkInput.rem.length) {
	    layout.links(this._links = Tuple.idFilter(links, linkInput.rem));
	  }
	
	  // return changeset
	  nodeInput.fields[output.x] = 1;
	  nodeInput.fields[output.y] = 1;
	  return nodeInput;
	};
	
	prototype.configure = function(nodeInput, linkInput, interactive, reset) {
	  // check if we need to run configuration
	  var layout = this._layout,
	      update = this._setup || nodeInput.add.length ||
	            linkInput && linkInput.add.length ||
	            interactive !== this._interactive ||
	            this.param('charge') !== layout.charge() ||
	            this.param('linkStrength') !== layout.linkStrength() ||
	            this.param('linkDistance') !== layout.linkDistance();
	
	  if (update || reset) {
	    // a parameter changed, so update tick-only parameters
	    layout
	      .size(this.param('size'))
	      .chargeDistance(this.param('chargeDistance'))
	      .theta(this.param('theta'))
	      .gravity(this.param('gravity'))
	      .friction(this.param('friction'));
	  }
	
	  if (!update) return; // if no more updates needed, return now
	
	  this._setup = false;
	  this._interactive = interactive;
	
	  var force = this,
	      graph = this._graph,
	      nodes = this._nodes,
	      links = this._links, a, i;
	
	  // process added nodes
	  for (a=nodeInput.add, i=0; i<a.length; ++i) {
	    nodes.push({tuple: a[i]});
	  }
	
	  // process added edges
	  if (linkInput) for (a=linkInput.add, i=0; i<a.length; ++i) {
	    // TODO add configurable source/target accessors
	    // TODO support lookup by node id
	    // TODO process 'mod' of edge source or target?
	    links.push({
	      tuple:  a[i],
	      source: nodes[a[i].source],
	      target: nodes[a[i].target]
	    });
	  }
	
	  // setup handler for force layout tick events
	  var tickHandler = !interactive ? null : function() {
	    // re-schedule the transform, force reflow
	    graph.propagate(ChangeSet.create(null, true), force);
	  };
	
	  // configure the rest of the layout
	  layout
	    .linkStrength(this.param('linkStrength'))
	    .linkDistance(this.param('linkDistance'))
	    .charge(this.param('charge'))
	    .nodes(nodes)
	    .links(links)
	    .on('tick', tickHandler)
	    .start().alpha(this.param('alpha'));
	};
	
	prototype.update = function(active) {
	  var output = this._output,
	      bound = this.param('bound'),
	      fixed = this.param('fixed'),
	      size = this.param('size'),
	      nodes = this._nodes,
	      lut = {}, id, i, n, t, x, y;
	
	  if (fixed && fixed.source) {
	    // TODO: could cache and update as needed?
	    fixed = fixed.source.values();
	    for (i=0, n=fixed.length; i<n; ++i) {
	      lut[fixed[i].id] = 1;
	    }
	  }
	
	  for (i=0; i<nodes.length; ++i) {
	    n = nodes[i];
	    t = n.tuple;
	    id = t._id;
	
	    if (active && active.id === id) {
	      n.fixed = 1;
	      if (active.update) {
	        n.x = n.px = active.x;
	        n.y = n.py = active.y;
	      }
	    } else {
	      n.fixed = lut[id] || 0;
	    }
	
	    x = bound ? Math.max(0, Math.min(n.x, size[0])) : n.x;
	    y = bound ? Math.max(0, Math.min(n.y, size[1])) : n.y;
	    Tuple.set(t, output.x, x);
	    Tuple.set(t, output.y, y);
	  }
	};
	
	module.exports = Force;
	
	Force.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Force transform",
	  "description": "Performs force-directed layout for network data.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["force"]},
	    "size": {
	      "description": "The dimensions [width, height] of this force layout.",
	      "oneOf": [
	        {
	          "type": "array",
	          "minItems": 2,
	          "maxItems": 2,
	          "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	
	      "default": [500, 500]
	    },
	    "links": {
	      "type": "string",
	      "description": "The name of the link (edge) data set."
	    },
	    "linkDistance": {
	      "description": "Determines the length of edges, in pixels.",
	      "oneOf": [{"type": "number"}, {"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": 20
	    },
	    "linkStrength": {
	      "oneOf": [{"type": "number"}, {"type": "string"}, {"$ref": "#/refs/signal"}],
	      "description": "Determines the tension of edges (the spring constant).",
	      "default": 1
	    },
	    "charge": {
	      "oneOf": [{"type": "number"}, {"type": "string"}, {"$ref": "#/refs/signal"}],
	      "description": "The strength of the charge each node exerts.",
	      "default": -30
	    },
	    "chargeDistance": {
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "description": "The maximum distance over which charge forces are applied.",
	      "default": Infinity
	    },
	    "iterations": {
	      "description": "The number of iterations to run the force directed layout.",
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "default": 500
	    },
	    "friction": {
	      "description": "The strength of the friction force used to stabilize the layout.",
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "default": 0.9
	    },
	    "theta": {
	      "description": "The theta parameter for the Barnes-Hut algorithm, which is used to compute charge forces between nodes.",
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "default": 0.8
	    },
	    "gravity": {
	      "description": "The strength of the pseudo-gravity force that pulls nodes towards the center of the layout area.",
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "default": 0.1
	    },
	    "alpha": {
	      "description": "A \"temperature\" parameter that determines how much node positions are adjusted at each step.",
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "default": 0.1
	    },
	    "interactive": {
	      "description": "Enables an interactive force-directed layout.",
	      "oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}],
	      "default": false
	    },
	    "active": {
	      "description": "A signal representing the active node.",
	      "$ref": "#/refs/signal"
	    },
	    "fixed": {
	      "description": "The name of a datasource containing the IDs of nodes with fixed positions.",
	      "type": "string"
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "x": {"type": "string", "default": "layout_x"},
	        "y": {"type": "string", "default": "layout_y"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "links"]
	};


/***/ },
/* 123 */
/***/ function(module, exports) {

	module.exports = {
	  size:   [{signal: 'width'}, {signal: 'height'}],
	  mid:    [{expr: 'width/2'}, {expr: 'height/2'}],
	  extent: [
	    {expr: '[-padding.left, -padding.top]'},
	    {expr: '[width+padding.right, height+padding.bottom]'}
	  ]
	};

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	var df = __webpack_require__(10),
	    Tuple = df.Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Formula(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    field: {type: 'value'},
	    expr:  {type: 'expr'}
	  });
	
	  return this.mutates(true);
	}
	
	var prototype = (Formula.prototype = Object.create(Transform.prototype));
	prototype.constructor = Formula;
	
	prototype.transform = function(input) {
	  log.debug(input, ['formulating']);
	
	  var field = this.param('field'),
	      expr = this.param('expr');
	
	  function set(x) {
	    Tuple.set(x, field, expr(x));
	  }
	
	  input.add.forEach(set);
	
	  if (this.reevaluate(input)) {
	    input.mod.forEach(set);
	  }
	
	  input.fields[field] = 1;
	  return input;
	};
	
	module.exports = Formula;
	
	Formula.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Formula transform",
	  "description": "Extends data elements with new values according to a calculation formula.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["formula"]},
	    "field": {
	      "type": "string",
	      "description": "The property name in which to store the computed formula value."
	    },
	    "expr": {
	      "type": "string",
	      "description": "A string containing an expression (in JavaScript syntax) for the formula."
	    }
	  },
	  "required": ["type", "field", "expr"]
	};


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Geo(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, Geo.Parameters);
	  Transform.addParameters(this, {
	    lon: {type: 'field'},
	    lat: {type: 'field'}
	  });
	
	  this._output = {
	    'x': 'layout_x',
	    'y': 'layout_y'
	  };
	  return this.mutates(true);
	}
	
	Geo.Parameters = {
	  projection: {type: 'value', default: 'mercator'},
	  center:     {type: 'array<value>'},
	  translate:  {type: 'array<value>', default: __webpack_require__(123).center},
	  rotate:     {type: 'array<value>'},
	  scale:      {type: 'value'},
	  precision:  {type: 'value'},
	  clipAngle:  {type: 'value'},
	  clipExtent: {type: 'value'}
	};
	
	Geo.d3Projection = function() {
	  var p = this.param('projection'),
	      param = Geo.Parameters,
	      proj, name, value;
	
	  if (p !== this._mode) {
	    this._mode = p;
	    this._projection = d3.geo[p]();
	  }
	  proj = this._projection;
	
	  for (name in param) {
	    if (name === 'projection' || !proj[name]) continue;
	    value = this.param(name);
	    if (value === undefined || (dl.isArray(value) && value.length === 0)) {
	      continue;
	    }
	    if (value !== proj[name]()) {
	      proj[name](value);
	    }
	  }
	
	  return proj;
	};
	
	var prototype = (Geo.prototype = Object.create(Transform.prototype));
	prototype.constructor = Geo;
	
	prototype.transform = function(input) {
	  log.debug(input, ['geo']);
	
	  var output = this._output,
	      lon = this.param('lon').accessor,
	      lat = this.param('lat').accessor,
	      proj = Geo.d3Projection.call(this);
	
	  function set(t) {
	    var ll = [lon(t), lat(t)];
	    var xy = proj(ll) || [null, null];
	    Tuple.set(t, output.x, xy[0]);
	    Tuple.set(t, output.y, xy[1]);
	  }
	
	  input.add.forEach(set);
	  if (this.reevaluate(input)) {
	    input.mod.forEach(set);
	    input.rem.forEach(set);
	  }
	
	  input.fields[output.x] = 1;
	  input.fields[output.y] = 1;
	  return input;
	};
	
	module.exports = Geo;
	
	Geo.baseSchema = {
	  "projection": {
	    "description": "The type of cartographic projection to use.",
	    "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	    "default": "mercator"
	  },
	  "center": {
	    "description": "The center of the projection.",
	    "oneOf": [
	      {
	        "type": "array",
	        "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	        "minItems": 2,
	        "maxItems": 2
	      },
	      {"$ref": "#/refs/signal"}
	    ]
	  },
	  "translate": {
	    "description": "The translation of the projection.",
	    "oneOf": [
	      {
	        "type": "array",
	        "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	        "minItems": 2,
	        "maxItems": 2
	      },
	      {"$ref": "#/refs/signal"}
	    ]
	  },
	  "rotate": {
	    "description": "The rotation of the projection.",
	    "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	  },
	  "scale": {
	    "description": "The scale of the projection.",
	    "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	  },
	  "precision": {
	    "description": "The desired precision of the projection.",
	    "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	  },
	  "clipAngle": {
	    "description": "The clip angle of the projection.",
	    "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	  },
	  "clipExtent": {
	    "description": "The clip extent of the projection.",
	    "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	  }
	};
	
	Geo.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Geo transform",
	  "description": "Performs a cartographic projection. Given longitude and latitude values, sets corresponding x and y properties for a mark.",
	  "type": "object",
	  "properties": dl.extend({
	    "type": {"enum": ["geo"]},
	    "lon": {
	      "description": "The input longitude values.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "lat": {
	      "description": "The input latitude values.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "x": {"type": "string", "default": "layout_x"},
	        "y": {"type": "string", "default": "layout_y"}
	      },
	      "additionalProperties": false
	    }
	  }, Geo.baseSchema),
	  "required": ["type", "lon", "lat"],
	  "additionalProperties": false
	};
	


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Geo = __webpack_require__(125),
	    Transform = __webpack_require__(111);
	
	function GeoPath(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, Geo.Parameters);
	  Transform.addParameters(this, {
	    field: {type: 'field', default: null},
	  });
	
	  this._output = {
	    'path': 'layout_path'
	  };
	  return this.mutates(true);
	}
	
	var prototype = (GeoPath.prototype = Object.create(Transform.prototype));
	prototype.constructor = GeoPath;
	
	prototype.transform = function(input) {
	  log.debug(input, ['geopath']);
	
	  var output = this._output,
	      geojson = this.param('field').accessor || dl.identity,
	      proj = Geo.d3Projection.call(this),
	      path = d3.geo.path().projection(proj);
	
	  function set(t) {
	    Tuple.set(t, output.path, path(geojson(t)));
	  }
	
	  input.add.forEach(set);
	  if (this.reevaluate(input)) {
	    input.mod.forEach(set);
	    input.rem.forEach(set);
	  }
	
	  input.fields[output.path] = 1;
	  return input;
	};
	
	module.exports = GeoPath;
	
	GeoPath.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "GeoPath transform",
	  "description": "Creates paths for geographic regions, such as countries, states and counties.",
	  "type": "object",
	  "properties": dl.extend({
	    "type": {"enum": ["geopath"]},
	    "field": {
	      "description": "The data field containing GeoJSON Feature data.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "path": {"type": "string", "default": "layout_path"}
	      },
	      "additionalProperties": false
	    }
	  }, Geo.baseSchema),
	  "required": ["type"],
	  "additionalProperties": false
	};

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Hierarchy(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    // hierarchy parameters
	    sort: {type: 'array<field>', default: null},
	    children: {type: 'field', default: 'children'},
	    parent: {type: 'field', default: 'parent'},
	    field: {type: 'value', default: null},
	    // layout parameters
	    mode: {type: 'value', default: 'tidy'}, // tidy, cluster, partition
	    size: {type: 'array<value>', default: __webpack_require__(123).size},
	    nodesize: {type: 'array<value>', default: null},
	    orient: {type: 'value', default: 'cartesian'}
	  });
	
	  this._mode = null;
	  this._output = {
	    'x':      'layout_x',
	    'y':      'layout_y',
	    'width':  'layout_width',
	    'height': 'layout_height',
	    'depth':  'layout_depth'
	  };
	  return this.mutates(true);
	}
	
	var PARTITION = 'partition';
	
	var SEPARATION = {
	  cartesian: function(a, b) { return (a.parent === b.parent ? 1 : 2); },
	  radial: function(a, b) { return (a.parent === b.parent ? 1 : 2) / a.depth; }
	};
	
	var prototype = (Hierarchy.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Hierarchy;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['hierarchy layout']);
	
	  // get variables
	  var layout = this._layout,
	      output = this._output,
	      mode   = this.param('mode'),
	      sort   = this.param('sort'),
	      nodesz = this.param('nodesize'),
	      parent = this.param('parent').accessor,
	      root = data.filter(function(d) { return parent(d) === null; })[0];
	
	  if (mode !== this._mode) {
	    this._mode = mode;
	    if (mode === 'tidy') mode = 'tree';
	    layout = (this._layout = d3.layout[mode]());
	  }
	
	  input.fields[output.x] = 1;
	  input.fields[output.y] = 1;
	  input.fields[output.depth] = 1;
	  if (mode === PARTITION) {
	    input.fields[output.width] = 1;
	    input.fields[output.height] = 1;
	    layout.value(this.param('field').accessor);
	  } else {
	    layout.separation(SEPARATION[this.param('orient')]);
	  }
	
	  if (nodesz.length && mode !== PARTITION) {
	    layout.nodeSize(nodesz);
	  } else {
	    layout.size(this.param('size'));
	  }
	
	  layout
	    .sort(sort.field.length ? dl.comparator(sort.field) : null)
	    .children(this.param('children').accessor)
	    .nodes(root);
	
	  // copy layout values to nodes
	  data.forEach(function(n) {
	    Tuple.set(n, output.x, n.x);
	    Tuple.set(n, output.y, n.y);
	    Tuple.set(n, output.depth, n.depth);
	    if (mode === PARTITION) {
	      Tuple.set(n, output.width, n.dx);
	      Tuple.set(n, output.height, n.dy);
	    }
	  });
	
	  // return changeset
	  return input;
	};
	
	module.exports = Hierarchy;
	
	Hierarchy.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Hierarchy transform",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["hierarchy"]},
	    "sort": {
	      "description": "A list of fields to use as sort criteria for sibling nodes.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ]
	    },
	    "children": {
	      "description": "The data field for the children node array",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "children"
	    },
	    "parent": {
	      "description": "The data field for the parent node",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "parent"
	    },
	    "field": {
	      "description": "The value for the area of each leaf-level node for partition layouts.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "mode": {
	      "description": "The layout algorithm mode to use.",
	      "oneOf": [
	        {"enum": ["tidy", "cluster", "partition"]},
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": "tidy"
	    },
	    "orient": {
	      "description": "The layout orientation to use.",
	      "oneOf": [
	        {"enum": ["cartesian", "radial"]},
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": "cartesian"
	    },
	    "size": {
	      "description": "The dimensions of the tree layout",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	          "minItems": 2,
	          "maxItems": 2
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": [500, 500]
	    },
	    "nodesize": {
	      "description": "Sets a fixed x,y size for each node (overrides the size parameter)",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	          "minItems": 2,
	          "maxItems": 2
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": null
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "x": {"type": "string", "default": "layout_x"},
	        "y": {"type": "string", "default": "layout_y"},
	        "width": {"type": "string", "default": "layout_width"},
	        "height": {"type": "string", "default": "layout_height"},
	        "depth": {"type": "string", "default": "layout_depth"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    Tuple = __webpack_require__(10).Tuple,
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Impute(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    groupby: {type: 'array<field>'},
	    orderby: {type: 'array<field>'},
	    field:   {type: 'field'},
	    method:  {type: 'value', default: 'value'},
	    value:   {type: 'value', default: 0}
	  });
	
	  return this.router(true).produces(true);
	}
	
	var prototype = (Impute.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Impute;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['imputing']);
	
	  var groupby = this.param('groupby'),
	      orderby = this.param('orderby'),
	      method = this.param('method'),
	      value = this.param('value'),
	      field = this.param('field'),
	      get = field.accessor,
	      name = field.field,
	      prev = this._imputed || [], curr = [],
	      groups = partition(data, groupby.accessor, orderby.accessor),
	      domain = groups.domain,
	      group, i, j, n, m, t;
	
	  function getval(x) {
	    return x == null ? null : get(x);
	  }
	
	  for (j=0, m=groups.length; j<m; ++j) {
	    group = groups[j];
	
	    // determine imputation value
	    if (method !== 'value') {
	      value = dl[method](group, getval);
	    }
	
	    // add tuples for missing values
	    for (i=0, n=group.length; i<n; ++i) {
	      if (group[i] == null) {
	        t = tuple(groupby.field, group.values, orderby.field, domain[i]);
	        t[name] = value;
	        curr.push(t);
	      }
	    }
	  }
	
	  // update changeset with imputed tuples
	  for (i=0, n=curr.length; i<n; ++i) {
	    input.add.push(curr[i]);
	  }
	  for (i=0, n=prev.length; i<n; ++i) {
	    input.rem.push(prev[i]);
	  }
	  this._imputed = curr;
	
	  return input;
	};
	
	function tuple(gb, gv, ob, ov) {
	  var t = {_imputed: true}, i;
	  for (i=0; i<gv.length; ++i) t[gb[i]] = gv[i];
	  for (i=0; i<ov.length; ++i) t[ob[i]] = ov[i];
	  return Tuple.ingest(t);
	}
	
	function partition(data, groupby, orderby) {
	  var groups = [],
	      get = function(f) { return f(x); },
	      val = function(d) { return (x=d, orderby.map(get)); },
	      map, i, x, k, g, domain, lut, N;
	
	  domain = groups.domain = dl.unique(data, val);
	  N = domain.length;
	  lut = domain.reduce(function(m, d, i) {
	    return (m[d] = {value:d, index:i}, m);
	  }, {});
	
	  // partition data points into groups
	  for (map={}, i=0; i<data.length; ++i) {
	    x = data[i];
	    k = groupby == null ? [] : groupby.map(get);
	    g = map[k] || (groups.push(map[k] = Array(N)), map[k].values = k, map[k]);
	    g[lut[val(x)].index] = x;
	  }
	
	  return groups;
	}
	
	module.exports = Impute;
	
	Impute.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Impute transform",
	  "description": "Performs imputation of missing values.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["impute"]},
	    "method": {
	      "description": "The imputation method to use.",
	      "oneOf": [
	        {"enum": ["value", "mean", "median", "min", "max"]},
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": "value"
	    },
	    "value": {
	      "description": "The value to use for missing data if the method is 'value'.",
	      "oneOf": [
	        {"type": "number"},
	        {"type": "string"},
	        {"type": "boolean"},
	        {"type": "null"},
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": 0
	    },
	    "field": {
	      "description": "The data field to impute.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "groupby": {
	      "description": "A list of fields to group the data into series.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	    },
	    "orderby": {
	      "description": "A list of fields to determine ordering within series.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "groupby", "orderby", "field"]
	};


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	var Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Lookup(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    on:      {type: 'data'},
	    onKey:   {type: 'field', default: null},
	    as:      {type: 'array<value>'},
	    keys:    {type: 'array<field>', default: ['data']},
	    default: {type: 'value'}
	  });
	
	  return this.mutates(true);
	}
	
	var prototype = (Lookup.prototype = Object.create(Transform.prototype));
	prototype.constructor = Lookup;
	
	prototype.transform = function(input, reset) {
	  log.debug(input, ['lookup']);
	
	  var on = this.param('on'),
	      onLast = on.source.last(),
	      onData = on.source.values(),
	      onKey = this.param('onKey'),
	      onF = onKey.field,
	      keys = this.param('keys'),
	      get = keys.accessor,
	      as = this.param('as'),
	      defaultValue = this.param('default'),
	      lut = this._lut,
	      i, v;
	
	  // build lookup table on init, withKey modified, or tuple add/rem
	  if (lut == null || this._on !== onF || onF && onLast.fields[onF] ||
	      onLast.add.length || onLast.rem.length)
	  {
	    if (onF) { // build hash from withKey field
	      onKey = onKey.accessor;
	      for (lut={}, i=0; i<onData.length; ++i) {
	        lut[onKey(v = onData[i])] = v;
	      }
	    } else { // otherwise, use index-based lookup
	      lut = onData;
	    }
	    this._lut = lut;
	    this._on = onF;
	    reset = true;
	  }
	
	  function set(t) {
	    for (var i=0; i<get.length; ++i) {
	      var v = lut[get[i](t)] || defaultValue;
	      Tuple.set(t, as[i], v);
	    }
	  }
	
	  input.add.forEach(set);
	  var run = keys.field.some(function(f) { return input.fields[f]; });
	  if (run || reset) {
	    input.mod.forEach(set);
	    input.rem.forEach(set);
	  }
	
	  as.forEach(function(k) { input.fields[k] = 1; });
	  return input;
	};
	
	module.exports = Lookup;
	
	Lookup.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Lookup transform",
	  "description": "Extends a data set by looking up values in another data set.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["lookup"]},
	    "on": {
	      "type": "string",
	      "description": "The name of the secondary data set on which to lookup values."
	    },
	    "onKey": {
	      "description": "The key field to lookup, or null for index-based lookup.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "keys": {
	      "description": "One or more fields in the primary data set to match against the secondary data set.",
	      "type": "array",
	      "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	    },
	    "as": {
	      "type": "array",
	      "description": "The names of the fields in which to store looked-up values.",
	      "items": {"type": "string"}
	    },
	    "default": {
	      // "type": "any",
	      "description": "The default value to use if a lookup match fails."
	    }
	  },
	  "required": ["type", "on", "as", "keys"],
	  "additionalProperties": false
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Pie(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    field:      {type: 'field', default: null},
	    startAngle: {type: 'value', default: 0},
	    endAngle:   {type: 'value', default: 2 * Math.PI},
	    sort:       {type: 'value', default: false}
	  });
	
	  this._output = {
	    'start': 'layout_start',
	    'end':   'layout_end',
	    'mid':   'layout_mid'
	  };
	
	  return this.mutates(true);
	}
	
	var prototype = (Pie.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Pie;
	
	function ones() { return 1; }
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['pie']);
	
	  var output = this._output,
	      field = this.param('field').accessor || ones,
	      start = this.param('startAngle'),
	      stop = this.param('endAngle'),
	      sort = this.param('sort');
	
	  var values = data.map(field),
	      a = start,
	      k = (stop - start) / dl.sum(values),
	      index = dl.range(data.length),
	      i, t, v;
	
	  if (sort) {
	    index.sort(function(a, b) {
	      return values[a] - values[b];
	    });
	  }
	
	  for (i=0; i<index.length; ++i) {
	    t = data[index[i]];
	    v = values[index[i]];
	    Tuple.set(t, output.start, a);
	    Tuple.set(t, output.mid, (a + 0.5 * v * k));
	    Tuple.set(t, output.end, (a += v * k));
	  }
	
	  input.fields[output.start] = 1;
	  input.fields[output.end] = 1;
	  input.fields[output.mid] = 1;
	  return input;
	};
	
	module.exports = Pie;
	
	Pie.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Pie transform",
	  "description": "Computes a pie chart layout.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["pie"]},
	    "field": {
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "description": "The data values to encode as angular spans. " +
	        "If this property is omitted, all pie slices will have equal spans."
	    },
	    "startAngle": {
	      "oneOf": [
	        {
	          "type": "number",
	          "minimum": 0,
	          "maximum": 2 * Math.PI
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": 0
	    },
	    "endAngle": {
	      "oneOf": [
	        {
	          "type": "number",
	          "minimum": 0,
	          "maximum": 2 * Math.PI
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": 2 * Math.PI,
	    },
	    "sort": {
	      "description": " If true, will sort the data prior to computing angles.",
	      "oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}],
	      "default": false
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "start": {"type": "string", "default": "layout_start"},
	        "end": {"type": "string", "default": "layout_end"},
	        "mid": {"type": "string", "default": "layout_mid"}
	      }
	    }
	  },
	  "required": ["type"]
	};


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	var Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Rank(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    field: {type: 'field', default: null},
	    normalize: {type: 'value', default: false}
	  });
	
	  this._output = {
	    'rank': 'rank'
	  };
	
	  return this.mutates(true);
	}
	
	var prototype = (Rank.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Rank;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['rank']);
	
	  var rank  = this._output.rank,
	      norm  = this.param('normalize'),
	      field = this.param('field').accessor,
	      keys = {}, 
	      i, len = data.length, klen, d, f;
	
	  // If we have a field accessor, first compile distinct keys.
	  if (field) {
	    for (i=0, klen=0; i<len; ++i) {
	      d = data[i];
	      keys[f=field(d)] = keys[f] || (keys[f] = ++klen);
	    }
	  }
	
	  // Assign ranks to all tuples.
	  for (i=0; i<len && (d=data[i]); ++i) {
	    if (field && (f=field(d))) {
	      Tuple.set(d, rank, norm ? keys[f] / klen : keys[f]);
	    } else {
	      Tuple.set(d, rank, norm ? (i+1) / len : (i+1));
	    }
	  }
	
	  input.fields[rank] = 1;
	  return input;
	};
	
	module.exports = Rank;
	
	Rank.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Rank transform",
	  "description": "Computes ascending rank scores for data tuples.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["rank"]},
	    "field": {
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "description": "A key field to used to rank tuples. " +
	        "If undefined, tuples will be ranked in their observed order."
	    },
	    "normalize": {
	      "description": "If true, values of the output field will lie in the range [0, 1].",
	      "oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}],
	      "default": false
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "rank": {"type": "string", "default": "rank"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log  = __webpack_require__(14),
	    Transform = __webpack_require__(111);
	
	function Sort(graph) {
	  Transform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {by: {type: 'array<field>'} });
	  this.router(true);
	}
	
	var prototype = (Sort.prototype = Object.create(Transform.prototype));
	prototype.constructor = Sort;
	
	prototype.transform = function(input) {
	  log.debug(input, ['sorting']);
	
	  if (input.add.length || input.mod.length || input.rem.length) {
	    input.sort = dl.comparator(this.param('by').field);
	  }
	  return input;
	};
	
	module.exports = Sort;
	
	Sort.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Sort transform",
	  "description": "Sorts the values of a data set.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["sort"]},
	    "by": {
	      "oneOf": [
	        {"type": "string"},
	        {"type": "array", "items": {"type": "string"}}
	      ],
	      "description": "A list of fields to use as sort criteria."
	    }
	  },
	  "required": ["type", "by"]
	};


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Stack(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    groupby: {type: 'array<field>'},
	    sortby: {type: 'array<field>'},
	    field: {type: 'field'},
	    offset: {type: 'value', default: 'zero'}
	  });
	
	  this._output = {
	    'start': 'layout_start',
	    'end':   'layout_end',
	    'mid':   'layout_mid'
	  };
	  return this.mutates(true);
	}
	
	var prototype = (Stack.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Stack;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['stacking']);
	
	  var groupby = this.param('groupby').accessor,
	      sortby = dl.comparator(this.param('sortby').field),
	      field = this.param('field').accessor,
	      offset = this.param('offset'),
	      output = this._output;
	
	  // partition, sum, and sort the stack groups
	  var groups = partition(data, groupby, sortby, field);
	
	  // compute stack layouts per group
	  for (var i=0, max=groups.max; i<groups.length; ++i) {
	    var group = groups[i],
	        sum = group.sum,
	        off = offset==='center' ? (max - sum)/2 : 0,
	        scale = offset==='normalize' ? (1/sum) : 1,
	        j, x, a, b = off, v = 0;
	
	    // set stack coordinates for each datum in group
	    for (j=0; j<group.length; ++j) {
	      x = group[j];
	      a = b; // use previous value for start point
	      v += field(x);
	      b = scale * v + off; // compute end point
	      Tuple.set(x, output.start, a);
	      Tuple.set(x, output.end, b);
	      Tuple.set(x, output.mid, 0.5 * (a + b));
	    }
	  }
	
	  input.fields[output.start] = 1;
	  input.fields[output.end] = 1;
	  input.fields[output.mid] = 1;
	  return input;
	};
	
	function partition(data, groupby, sortby, field) {
	  var groups = [],
	      get = function(f) { return f(x); },
	      map, i, x, k, g, s, max;
	
	  // partition data points into stack groups
	  if (groupby == null) {
	    groups.push(data.slice());
	  } else {
	    for (map={}, i=0; i<data.length; ++i) {
	      x = data[i];
	      k = groupby.map(get);
	      g = map[k] || (groups.push(map[k] = []), map[k]);
	      g.push(x);
	    }
	  }
	
	  // compute sums of groups, sort groups as needed
	  for (k=0, max=0; k<groups.length; ++k) {
	    g = groups[k];
	    for (i=0, s=0; i<g.length; ++i) {
	      s += field(g[i]);
	    }
	    g.sum = s;
	    if (s > max) max = s;
	    if (sortby != null) g.sort(sortby);
	  }
	  groups.max = max;
	
	  return groups;
	}
	
	module.exports = Stack;
	
	Stack.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Stack transform",
	  "description": "Computes layout values for stacked graphs, as in stacked bar charts or stream graphs.",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["stack"]},
	    "groupby": {
	      "description": "A list of fields to split the data into groups (stacks).",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	    },
	    "sortby": {
	      "description": "A list of fields to determine the sort order of stacks.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	    },
	    "field": {
	      "description": "The data field that determines the thickness/height of stacks.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "offset": {
	      "description": "The baseline offset",
	      "oneOf": [{"enum": ["zero", "center", "normalize"]}, {"$ref": "#/refs/signal"}],
	      "default": "zero"
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "start": {"type": "string", "default": "layout_start"},
	        "end": {"type": "string", "default": "layout_end"},
	        "mid": {"type": "string", "default": "layout_mid"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "groupby", "field"]
	};


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Treeify(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    groupby: {type: 'array<field>'}
	  });
	
	  this._output = {
	    'children': 'children',
	    'parent':   'parent'
	  };
	  return this.router(true).produces(true);
	}
	
	var prototype = (Treeify.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Treeify;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['treeifying']);
	
	  var fields = this.param('groupby').field,
	      childField = this._output.children,
	      parentField = this._output.parent,
	      summary = [{name:'*', ops: ['values'], as: [childField]}],
	      aggrs = fields.map(function(f) {
	        return dl.groupby(f).summarize(summary);
	      }),
	      prev = this._internal || [], curr = [], i, n;
	
	  function level(index, node, values) {
	    var vals = aggrs[index].execute(values);
	
	    node[childField] = vals;
	    vals.forEach(function(n) {
	      n[parentField] = node;
	      curr.push(Tuple.ingest(n));
	      if (index+1 < fields.length) level(index+1, n, n[childField]);
	      else n[childField].forEach(function(c) { c[parentField] = n; });
	    });
	  }
	
	  var root = Tuple.ingest({});
	  root[parentField] = null;
	  curr.push(root);
	  level(0, root, data);
	
	  // update changeset with internal nodes
	  for (i=0, n=curr.length; i<n; ++i) {
	    input.add.push(curr[i]);
	  }
	  for (i=0, n=prev.length; i<n; ++i) {
	    input.rem.push(prev[i]);
	  }
	  this._internal = curr;
	
	  return input;
	};
	
	module.exports = Treeify;
	
	Treeify.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Treeify transform",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["treeify"]},
	    "groupby": {
	      "description": "An ordered list of fields by which to group tuples into a tree.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ]
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "children": {"type": "string", "default": "children"},
	        "parent": {"type": "string", "default": "parent"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type", "groupby"]
	};


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    Tuple = __webpack_require__(10).Tuple,
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	var defaultRatio = 0.5 * (1 + Math.sqrt(5));
	
	function Treemap(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    // hierarchy parameters
	    sort: {type: 'array<field>', default: ['-value']},
	    children: {type: 'field', default: 'children'},
	    parent: {type: 'field', default: 'parent'},
	    field: {type: 'field', default: 'value'},
	    // treemap parameters
	    size: {type: 'array<value>', default: __webpack_require__(123).size},
	    round: {type: 'value', default: true},
	    sticky: {type: 'value', default: false},
	    ratio: {type: 'value', default: defaultRatio},
	    padding: {type: 'value', default: null},
	    mode: {type: 'value', default: 'squarify'}
	  });
	
	  this._layout = d3.layout.treemap();
	
	  this._output = {
	    'x':      'layout_x',
	    'y':      'layout_y',
	    'width':  'layout_width',
	    'height': 'layout_height',
	    'depth':  'layout_depth',
	  };
	  return this.mutates(true);
	}
	
	var prototype = (Treemap.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Treemap;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['treemap']);
	
	  // get variables
	  var layout = this._layout,
	      output = this._output,
	      sticky = this.param('sticky'),
	      parent = this.param('parent').accessor,
	      root = data.filter(function(d) { return parent(d) === null; })[0];
	
	  // layout.sticky resets state _regardless_ of input value
	  // so, we perform out own check first
	  if (layout.sticky() !== sticky) { layout.sticky(sticky); }
	
	  // configure layout
	  layout
	    .sort(dl.comparator(this.param('sort').field))
	    .children(this.param('children').accessor)
	    .value(this.param('field').accessor)
	    .size(this.param('size'))
	    .round(this.param('round'))
	    .ratio(this.param('ratio'))
	    .padding(this.param('padding'))
	    .mode(this.param('mode'))
	    .nodes(root);
	
	  // copy layout values to nodes
	  data.forEach(function(n) {
	    Tuple.set(n, output.x, n.x);
	    Tuple.set(n, output.y, n.y);
	    Tuple.set(n, output.width, n.dx);
	    Tuple.set(n, output.height, n.dy);
	    Tuple.set(n, output.depth, n.depth);
	  });
	
	  // return changeset
	  input.fields[output.x] = 1;
	  input.fields[output.y] = 1;
	  input.fields[output.width] = 1;
	  input.fields[output.height] = 1;
	  input.fields[output.depth] = 1;
	  return input;
	};
	
	module.exports = Treemap;
	
	Treemap.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Treemap transform",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["treemap"]},
	    "sort": {
	      "description": "A list of fields to use as sort criteria for sibling nodes.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]}
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": ["-value"]
	    },
	    "children": {
	      "description": "The data field for the children node array",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "children"
	    },
	    "parent": {
	      "description": "The data field for the parent node",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": "parent"
	    },
	    "field": {
	      "description": "The values to use to determine the area of each leaf-level treemap cell.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "mode": {
	      "description": "The treemap layout algorithm to use.",
	      "oneOf": [
	        {"enum": ["squarify", "slice", "dice", "slice-dice"]},
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": "squarify"
	    },
	    "size": {
	      "description": "The dimensions of the treemap layout",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	          "minItems": 2,
	          "maxItems": 2
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": [500, 500]
	    },
	    "round": {
	      "description": "If true, treemap cell dimensions will be rounded to integer pixels.",
	      "oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}],
	      "default": true
	    },
	    "sticky": {
	      "description": "If true, repeated runs of the treemap will use cached partition boundaries.",
	      "oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}],
	      "default": false
	    },
	    "ratio": {
	      "description": "The target aspect ratio for the layout to optimize.",
	      "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}],
	      "default": defaultRatio
	    },
	    "padding": {
	      "oneOf": [
	        {"type": "number"},
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	          "minItems": 4,
	          "maxItems": 4
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "description": "he padding (in pixels) to provide around internal nodes in the treemap."
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "x": {"type": "string", "default": "layout_x"},
	        "y": {"type": "string", "default": "layout_y"},
	        "width": {"type": "string", "default": "layout_width"},
	        "height": {"type": "string", "default": "layout_height"},
	        "depth": {"type": "string", "default": "layout_depth"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    Tuple = __webpack_require__(15),
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Voronoi(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    clipExtent: {type: 'array<value>', default: __webpack_require__(123).extent},
	    x: {type: 'field', default: 'layout_x'},
	    y: {type: 'field', default: 'layout_y'}
	  });
	
	  this._layout = d3.geom.voronoi();
	  this._output = {'path': 'layout_path'};
	
	  return this.mutates(true);
	}
	
	var prototype = (Voronoi.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Voronoi;
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['voronoi']);
	
	  // get variables
	  var pathname = this._output.path;
	
	  // configure layout
	  var polygons = this._layout
	    .clipExtent(this.param('clipExtent'))
	    .x(this.param('x').accessor)
	    .y(this.param('y').accessor)
	    (data);
	
	  // build and assign path strings
	  for (var i=0; i<data.length; ++i) {
	    Tuple.set(data[i], pathname, 'M' + polygons[i].join('L') + 'Z');
	  }
	
	  // return changeset
	  input.fields[pathname] = 1;
	  return input;
	};
	
	module.exports = Voronoi;
	
	Voronoi.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Voronoi transform",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["voronoi"]},
	    "clipExtent": {
	      "description": "The min and max points at which to clip the voronoi diagram.",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {
	            "oneOf": [
	              {
	                "type": "array",
	                "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	                "minItems": 2,
	                "maxItems": 2
	              },
	              {"$ref": "#/refs/signal"}
	            ]
	          },
	          "minItems": 2,
	          "maxItems": 2
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": [[-1e5,-1e5],[1e5,1e5]]
	    },
	    "x": {
	      "description": "The input x coordinates.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "y": {
	      "description": "The input y coordinates.",
	      "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "path": {"type": "string", "default": "layout_path"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    d3 = __webpack_require__(63),
	    d3_cloud = __webpack_require__(138),
	    canvas = __webpack_require__(66).canvas,
	    Tuple = __webpack_require__(15),
	    log = __webpack_require__(14),
	    Transform = __webpack_require__(111),
	    BatchTransform = __webpack_require__(115);
	
	function Wordcloud(graph) {
	  BatchTransform.prototype.init.call(this, graph);
	  Transform.addParameters(this, {
	    size: {type: 'array<value>', default: __webpack_require__(123).size},
	    text: {type: 'field', default: 'data'},
	    rotate: {type: 'field|value', default: 0},
	    font: {type: 'field|value', default: {value: 'sans-serif'}},
	    fontSize: {type: 'field|value', default: 14},
	    fontStyle: {type: 'field|value', default: {value: 'normal'}},
	    fontWeight: {type: 'field|value', default: {value: 'normal'}},
	    fontScale: {type: 'array<value>', default: [10, 50]},
	    padding: {type: 'value', default: 1},
	    spiral: {type: 'value', default: 'archimedean'}
	  });
	
	  this._layout = d3_cloud().canvas(canvas.instance);
	
	  this._output = {
	    'x':          'layout_x',
	    'y':          'layout_y',
	    'font':       'layout_font',
	    'fontSize':   'layout_fontSize',
	    'fontStyle':  'layout_fontStyle',
	    'fontWeight': 'layout_fontWeight',
	    'rotate':     'layout_rotate',
	  };
	
	  return this.mutates(true);
	}
	
	var prototype = (Wordcloud.prototype = Object.create(BatchTransform.prototype));
	prototype.constructor = Wordcloud;
	
	function get(p) {
	  return (p && p.accessor) || p;
	}
	
	function wrap(tuple) {
	  var x = Object.create(tuple);
	  x._tuple = tuple;
	  return x;
	}
	
	prototype.batchTransform = function(input, data) {
	  log.debug(input, ['wordcloud']);
	
	  // get variables
	  var layout = this._layout,
	      output = this._output,
	      fontSize = this.param('fontSize'),
	      range = fontSize.accessor && this.param('fontScale'),
	      size, scale;
	  fontSize = fontSize.accessor || d3.functor(fontSize);
	
	  // create font size scaling function as needed
	  if (range.length) {
	    scale = d3.scale.sqrt()
	      .domain(dl.extent(data, size=fontSize))
	      .range(range);
	    fontSize = function(x) { return scale(size(x)); };
	  }
	
	  // configure layout
	  layout
	    .size(this.param('size'))
	    .text(get(this.param('text')))
	    .padding(this.param('padding'))
	    .spiral(this.param('spiral'))
	    .rotate(get(this.param('rotate')))
	    .font(get(this.param('font')))
	    .fontStyle(get(this.param('fontStyle')))
	    .fontWeight(get(this.param('fontWeight')))
	    .fontSize(fontSize)
	    .words(data.map(wrap)) // wrap to avoid tuple writes
	    .on('end', function(words) {
	      var size = layout.size(),
	          dx = size[0] >> 1,
	          dy = size[1] >> 1,
	          w, t, i, len;
	
	      for (i=0, len=words.length; i<len; ++i) {
	        w = words[i];
	        t = w._tuple;
	        Tuple.set(t, output.x, w.x + dx);
	        Tuple.set(t, output.y, w.y + dy);
	        Tuple.set(t, output.font, w.font);
	        Tuple.set(t, output.fontSize, w.size);
	        Tuple.set(t, output.fontStyle, w.style);
	        Tuple.set(t, output.fontWeight, w.weight);
	        Tuple.set(t, output.rotate, w.rotate);
	      }
	    })
	    .start();
	
	  // return changeset
	  for (var key in output) input.fields[output[key]] = 1;
	  return input;
	};
	
	module.exports = Wordcloud;
	
	var Parameter = __webpack_require__(112);
	Wordcloud.schema = {
	  "$schema": "http://json-schema.org/draft-04/schema#",
	  "title": "Wordcloud transform",
	  "type": "object",
	  "properties": {
	    "type": {"enum": ["wordcloud"]},
	    "size": {
	      "description": "The dimensions of the wordcloud layout",
	      "oneOf": [
	        {
	          "type": "array",
	          "items": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	          "minItems": 2,
	          "maxItems": 2
	        },
	        {"$ref": "#/refs/signal"}
	      ],
	      "default": [900, 500]
	    },
	    "font": {
	      "description": "The font face to use for a word.",
	      "oneOf": [{"type": "string"}, Parameter.schema, {"$ref": "#/refs/signal"}],
	      "default": "sans-serif"
	    },
	    "fontStyle": {
	      "description": "The font style to use for a word.",
	      "oneOf": [{"type": "string"}, Parameter.schema, {"$ref": "#/refs/signal"}],
	      "default": "normal"
	    },
	    "fontWeight": {
	      "description": "The font weight to use for a word.",
	      "oneOf": [{"type": "string"}, Parameter.schema, {"$ref": "#/refs/signal"}],
	      "default": "normal"
	    },
	    "fontSize": {
	      "description": "The font size to use for a word.",
	      "oneOf": [{"type": "number"}, Parameter.schema, {"type": "string"}, {"$ref": "#/refs/signal"}],
	      "default": 14
	    },
	    "fontScale": {
	      "description": "The minimum and maximum scaled font sizes, or null to prevent scaling.",
	      "oneOf": [
	        { "type": "null" },
	        {
	          "type": "array",
	          "minItems": 2,
	          "maxItems": 2,
	          "items": {"oneOf": [{"type":"number"}, {"$ref": "#/refs/signal"}]}
	        }
	      ],
	      "default": [10, 50]
	    },
	    "rotate": {
	      "description": "The field or number to set the roration angle (in degrees).",
	      "oneOf": [
	        {"type": "number"}, {"type": "string"},
	        Parameter.schema, {"$ref": "#/refs/signal"}
	      ],
	      "default": 0
	    },
	    "text": {
	      "description": "The field containing the text to use for each word.",
	      "oneOf": [{"type": "string"}, Parameter.schema, {"$ref": "#/refs/signal"}],
	      "default": 'data'
	    },
	    "spiral": {
	      "description": "The type of spiral used for positioning words, either 'archimedean' or 'rectangular'.",
	      "oneOf": [{"enum": ["archimedean", "rectangular"]}, Parameter.schema, {"$ref": "#/refs/signal"}],
	      "default": "archimedean"
	    },
	    "padding": {
	      "description": "The padding around each word.",
	      "oneOf": [{"type": "number"}, Parameter.schema, {"$ref": "#/refs/signal"}],
	      "default": 1
	    },
	    "output": {
	      "type": "object",
	      "description": "Rename the output data fields",
	      "properties": {
	        "x": {"type": "string", "default": "layout_x"},
	        "y": {"type": "string", "default": "layout_y"},
	        "font": {"type": "string", "default": "layout_font"},
	        "fontSize": {"type": "string", "default": "layout_fontSize"},
	        "fontStyle": {"type": "string", "default": "layout_fontStyle"},
	        "fontWeight": {"type": "string", "default": "layout_fontWeight"},
	        "rotate": {"type": "string", "default": "layout_rotate"}
	      },
	      "additionalProperties": false
	    }
	  },
	  "additionalProperties": false,
	  "required": ["type"]
	};


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	// Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/
	// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf
	
	var dispatch = __webpack_require__(139).dispatch;
	
	var cloudRadians = Math.PI / 180,
	    cw = 1 << 11 >> 5,
	    ch = 1 << 11;
	
	module.exports = function() {
	  var size = [256, 256],
	      text = cloudText,
	      font = cloudFont,
	      fontSize = cloudFontSize,
	      fontStyle = cloudFontNormal,
	      fontWeight = cloudFontNormal,
	      rotate = cloudRotate,
	      padding = cloudPadding,
	      spiral = archimedeanSpiral,
	      words = [],
	      timeInterval = Infinity,
	      event = dispatch("word", "end"),
	      timer = null,
	      random = Math.random,
	      cloud = {},
	      canvas = cloudCanvas;
	
	  cloud.canvas = function(_) {
	    return arguments.length ? (canvas = functor(_), cloud) : canvas;
	  };
	
	  cloud.start = function() {
	    var contextAndRatio = getContext(canvas()),
	        board = zeroArray((size[0] >> 5) * size[1]),
	        bounds = null,
	        n = words.length,
	        i = -1,
	        tags = [],
	        data = words.map(function(d, i) {
	          d.text = text.call(this, d, i);
	          d.font = font.call(this, d, i);
	          d.style = fontStyle.call(this, d, i);
	          d.weight = fontWeight.call(this, d, i);
	          d.rotate = rotate.call(this, d, i);
	          d.size = ~~fontSize.call(this, d, i);
	          d.padding = padding.call(this, d, i);
	          return d;
	        }).sort(function(a, b) { return b.size - a.size; });
	
	    if (timer) clearInterval(timer);
	    timer = setInterval(step, 0);
	    step();
	
	    return cloud;
	
	    function step() {
	      var start = Date.now();
	      while (Date.now() - start < timeInterval && ++i < n && timer) {
	        var d = data[i];
	        d.x = (size[0] * (random() + .5)) >> 1;
	        d.y = (size[1] * (random() + .5)) >> 1;
	        cloudSprite(contextAndRatio, d, data, i);
	        if (d.hasText && place(board, d, bounds)) {
	          tags.push(d);
	          event.word(d);
	          if (bounds) cloudBounds(bounds, d);
	          else bounds = [{x: d.x + d.x0, y: d.y + d.y0}, {x: d.x + d.x1, y: d.y + d.y1}];
	          // Temporary hack
	          d.x -= size[0] >> 1;
	          d.y -= size[1] >> 1;
	        }
	      }
	      if (i >= n) {
	        cloud.stop();
	        event.end(tags, bounds);
	      }
	    }
	  }
	
	  cloud.stop = function() {
	    if (timer) {
	      clearInterval(timer);
	      timer = null;
	    }
	    return cloud;
	  };
	
	  function getContext(canvas) {
	    canvas.width = canvas.height = 1;
	    var ratio = Math.sqrt(canvas.getContext("2d").getImageData(0, 0, 1, 1).data.length >> 2);
	    canvas.width = (cw << 5) / ratio;
	    canvas.height = ch / ratio;
	
	    var context = canvas.getContext("2d");
	    context.fillStyle = context.strokeStyle = "red";
	    context.textAlign = "center";
	
	    return {context: context, ratio: ratio};
	  }
	
	  function place(board, tag, bounds) {
	    var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],
	        startX = tag.x,
	        startY = tag.y,
	        maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),
	        s = spiral(size),
	        dt = random() < .5 ? 1 : -1,
	        t = -dt,
	        dxdy,
	        dx,
	        dy;
	
	    while (dxdy = s(t += dt)) {
	      dx = ~~dxdy[0];
	      dy = ~~dxdy[1];
	
	      if (Math.min(Math.abs(dx), Math.abs(dy)) >= maxDelta) break;
	
	      tag.x = startX + dx;
	      tag.y = startY + dy;
	
	      if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||
	          tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;
	      // TODO only check for collisions within current bounds.
	      if (!bounds || !cloudCollide(tag, board, size[0])) {
	        if (!bounds || collideRects(tag, bounds)) {
	          var sprite = tag.sprite,
	              w = tag.width >> 5,
	              sw = size[0] >> 5,
	              lx = tag.x - (w << 4),
	              sx = lx & 0x7f,
	              msx = 32 - sx,
	              h = tag.y1 - tag.y0,
	              x = (tag.y + tag.y0) * sw + (lx >> 5),
	              last;
	          for (var j = 0; j < h; j++) {
	            last = 0;
	            for (var i = 0; i <= w; i++) {
	              board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);
	            }
	            x += sw;
	          }
	          delete tag.sprite;
	          return true;
	        }
	      }
	    }
	    return false;
	  }
	
	  cloud.timeInterval = function(_) {
	    return arguments.length ? (timeInterval = _ == null ? Infinity : _, cloud) : timeInterval;
	  };
	
	  cloud.words = function(_) {
	    return arguments.length ? (words = _, cloud) : words;
	  };
	
	  cloud.size = function(_) {
	    return arguments.length ? (size = [+_[0], +_[1]], cloud) : size;
	  };
	
	  cloud.font = function(_) {
	    return arguments.length ? (font = functor(_), cloud) : font;
	  };
	
	  cloud.fontStyle = function(_) {
	    return arguments.length ? (fontStyle = functor(_), cloud) : fontStyle;
	  };
	
	  cloud.fontWeight = function(_) {
	    return arguments.length ? (fontWeight = functor(_), cloud) : fontWeight;
	  };
	
	  cloud.rotate = function(_) {
	    return arguments.length ? (rotate = functor(_), cloud) : rotate;
	  };
	
	  cloud.text = function(_) {
	    return arguments.length ? (text = functor(_), cloud) : text;
	  };
	
	  cloud.spiral = function(_) {
	    return arguments.length ? (spiral = spirals[_] || _, cloud) : spiral;
	  };
	
	  cloud.fontSize = function(_) {
	    return arguments.length ? (fontSize = functor(_), cloud) : fontSize;
	  };
	
	  cloud.padding = function(_) {
	    return arguments.length ? (padding = functor(_), cloud) : padding;
	  };
	
	  cloud.random = function(_) {
	    return arguments.length ? (random = _, cloud) : random;
	  };
	
	  cloud.on = function() {
	    var value = event.on.apply(event, arguments);
	    return value === event ? cloud : value;
	  };
	
	  return cloud;
	};
	
	function cloudText(d) {
	  return d.text;
	}
	
	function cloudFont() {
	  return "serif";
	}
	
	function cloudFontNormal() {
	  return "normal";
	}
	
	function cloudFontSize(d) {
	  return Math.sqrt(d.value);
	}
	
	function cloudRotate() {
	  return (~~(Math.random() * 6) - 3) * 30;
	}
	
	function cloudPadding() {
	  return 1;
	}
	
	// Fetches a monochrome sprite bitmap for the specified text.
	// Load in batches for speed.
	function cloudSprite(contextAndRatio, d, data, di) {
	  if (d.sprite) return;
	  var c = contextAndRatio.context,
	      ratio = contextAndRatio.ratio;
	
	  c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);
	  var x = 0,
	      y = 0,
	      maxh = 0,
	      n = data.length;
	  --di;
	  while (++di < n) {
	    d = data[di];
	    c.save();
	    c.font = d.style + " " + d.weight + " " + ~~((d.size + 1) / ratio) + "px " + d.font;
	    var w = c.measureText(d.text + "m").width * ratio,
	        h = d.size << 1;
	    if (d.rotate) {
	      var sr = Math.sin(d.rotate * cloudRadians),
	          cr = Math.cos(d.rotate * cloudRadians),
	          wcr = w * cr,
	          wsr = w * sr,
	          hcr = h * cr,
	          hsr = h * sr;
	      w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;
	      h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));
	    } else {
	      w = (w + 0x1f) >> 5 << 5;
	    }
	    if (h > maxh) maxh = h;
	    if (x + w >= (cw << 5)) {
	      x = 0;
	      y += maxh;
	      maxh = 0;
	    }
	    if (y + h >= ch) break;
	    c.translate((x + (w >> 1)) / ratio, (y + (h >> 1)) / ratio);
	    if (d.rotate) c.rotate(d.rotate * cloudRadians);
	    c.fillText(d.text, 0, 0);
	    if (d.padding) c.lineWidth = 2 * d.padding, c.strokeText(d.text, 0, 0);
	    c.restore();
	    d.width = w;
	    d.height = h;
	    d.xoff = x;
	    d.yoff = y;
	    d.x1 = w >> 1;
	    d.y1 = h >> 1;
	    d.x0 = -d.x1;
	    d.y0 = -d.y1;
	    d.hasText = true;
	    x += w;
	  }
	  var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data,
	      sprite = [];
	  while (--di >= 0) {
	    d = data[di];
	    if (!d.hasText) continue;
	    var w = d.width,
	        w32 = w >> 5,
	        h = d.y1 - d.y0;
	    // Zero the buffer
	    for (var i = 0; i < h * w32; i++) sprite[i] = 0;
	    x = d.xoff;
	    if (x == null) return;
	    y = d.yoff;
	    var seen = 0,
	        seenRow = -1;
	    for (var j = 0; j < h; j++) {
	      for (var i = 0; i < w; i++) {
	        var k = w32 * j + (i >> 5),
	            m = pixels[((y + j) * (cw << 5) + (x + i)) << 2] ? 1 << (31 - (i % 32)) : 0;
	        sprite[k] |= m;
	        seen |= m;
	      }
	      if (seen) seenRow = j;
	      else {
	        d.y0++;
	        h--;
	        j--;
	        y++;
	      }
	    }
	    d.y1 = d.y0 + seenRow;
	    d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);
	  }
	}
	
	// Use mask-based collision detection.
	function cloudCollide(tag, board, sw) {
	  sw >>= 5;
	  var sprite = tag.sprite,
	      w = tag.width >> 5,
	      lx = tag.x - (w << 4),
	      sx = lx & 0x7f,
	      msx = 32 - sx,
	      h = tag.y1 - tag.y0,
	      x = (tag.y + tag.y0) * sw + (lx >> 5),
	      last;
	  for (var j = 0; j < h; j++) {
	    last = 0;
	    for (var i = 0; i <= w; i++) {
	      if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))
	          & board[x + i]) return true;
	    }
	    x += sw;
	  }
	  return false;
	}
	
	function cloudBounds(bounds, d) {
	  var b0 = bounds[0],
	      b1 = bounds[1];
	  if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;
	  if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;
	  if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;
	  if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;
	}
	
	function collideRects(a, b) {
	  return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;
	}
	
	function archimedeanSpiral(size) {
	  var e = size[0] / size[1];
	  return function(t) {
	    return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
	  };
	}
	
	function rectangularSpiral(size) {
	  var dy = 4,
	      dx = dy * size[0] / size[1],
	      x = 0,
	      y = 0;
	  return function(t) {
	    var sign = t < 0 ? -1 : 1;
	    // See triangular numbers: T_n = n * (n + 1) / 2.
	    switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
	      case 0:  x += dx; break;
	      case 1:  y += dy; break;
	      case 2:  x -= dx; break;
	      default: y -= dy; break;
	    }
	    return [x, y];
	  };
	}
	
	// TODO reuse arrays?
	function zeroArray(n) {
	  var a = [],
	      i = -1;
	  while (++i < n) a[i] = 0;
	  return a;
	}
	
	function cloudCanvas() {
	  return document.createElement("canvas");
	}
	
	function functor(d) {
	  return typeof d === "function" ? d : function() { return d; };
	}
	
	var spirals = {
	  archimedean: archimedeanSpiral,
	  rectangular: rectangularSpiral
	};


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3_dispatch = {})));
	}(this, function (exports) { 'use strict';
	
	  function dispatch() {
	    return new Dispatch(arguments);
	  }
	
	  function Dispatch(types) {
	    var i = -1,
	        n = types.length,
	        callbacksByType = {},
	        callbackByName = {},
	        type,
	        that = this;
	
	    that.on = function(type, callback) {
	      type = parseType(type);
	
	      // Return the current callback, if any.
	      if (arguments.length < 2) {
	        return (callback = callbackByName[type.name]) && callback.value;
	      }
	
	      // If a type was specified…
	      if (type.type) {
	        var callbacks = callbacksByType[type.type],
	            callback0 = callbackByName[type.name],
	            i;
	
	        // Remove the current callback, if any, using copy-on-remove.
	        if (callback0) {
	          callback0.value = null;
	          i = callbacks.indexOf(callback0);
	          callbacksByType[type.type] = callbacks = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
	          delete callbackByName[type.name];
	        }
	
	        // Add the new callback, if any.
	        if (callback) {
	          callback = {value: callback};
	          callbackByName[type.name] = callback;
	          callbacks.push(callback);
	        }
	      }
	
	      // Otherwise, if a null callback was specified, remove all callbacks with the given name.
	      else if (callback == null) {
	        for (var otherType in callbacksByType) {
	          if (callback = callbackByName[otherType + type.name]) {
	            callback.value = null;
	            callbacks = callbacksByType[otherType];
	            i = callbacks.indexOf(callback);
	            callbacksByType[otherType] = callbacks.slice(0, i).concat(callbacks.slice(i + 1));
	            delete callbackByName[callback.name];
	          }
	        }
	      }
	
	      return that;
	    };
	
	    while (++i < n) {
	      type = types[i] + "";
	      if (!type || (type in that)) throw new Error("illegal or duplicate type: " + type);
	      callbacksByType[type] = [];
	      that[type] = applier(type);
	    }
	
	    function parseType(type) {
	      var i = (type += "").indexOf("."), name = type;
	      if (i >= 0) type = type.slice(0, i); else name += ".";
	      if (type && !callbacksByType.hasOwnProperty(type)) throw new Error("unknown type: " + type);
	      return {type: type, name: name};
	    }
	
	    function applier(type) {
	      return function() {
	        var callbacks = callbacksByType[type], // Defensive reference; copy-on-remove.
	            callbackValue,
	            i = -1,
	            n = callbacks.length;
	
	        while (++i < n) {
	          if (callbackValue = callbacks[i].value) {
	            callbackValue.apply(this, arguments);
	          }
	        }
	
	        return that;
	      };
	    }
	  }
	
	  dispatch.prototype = Dispatch.prototype;
	
	  var version = "0.2.6";
	
	  exports.version = version;
	  exports.dispatch = dispatch;
	
	}));

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    df = __webpack_require__(10),
	    Node = df.Node, // jshint ignore:line
	    Tuple = df.Tuple,
	    Deps = df.Dependencies;
	
	var Types = {
	  INSERT: "insert",
	  REMOVE: "remove",
	  TOGGLE: "toggle",
	  CLEAR:  "clear"
	};
	
	var EMPTY = [];
	
	var filter = function(fields, value, src, dest) {
	  if ((fields = dl.array(fields)) && !fields.length) {
	    fields = dl.isObject(value) ? dl.keys(value) : ['data'];
	  }
	
	  var splice = true, len = fields.length, i, j, f, v;
	  for (i = src.length - 1; i >= 0; --i) {
	    for (j=0; j<len; ++j) {
	      v = value[f=fields[j]] || value;
	      if (src[i][f] !== v) {
	        splice = false;
	        break;
	      }
	    }
	
	    if (splice) dest.push.apply(dest, src.splice(i, 1));
	    splice = true;
	  }
	};
	
	function parseModify(model, def, ds) {
	  var signal = def.signal ? dl.field(def.signal) : null,
	      signalName = signal ? signal[0] : null,
	      predicate = def.predicate ? model.predicate(def.predicate.name || def.predicate) : null,
	      exprTrigger = def.test ? model.expr(def.test) : null,
	      reeval  = (predicate === null && exprTrigger === null),
	      isClear = def.type === Types.CLEAR,
	      fieldName = def.field,
	      node = new Node(model).router(isClear);
	
	  node.evaluate = function(input) {
	    var db, sg;
	
	    if (predicate !== null) {  // TODO: predicate args
	      db = model.values(Deps.DATA, predicate.data || EMPTY);
	      sg = model.values(Deps.SIGNALS, predicate.signals || EMPTY);
	      reeval = predicate.call(predicate, {}, db, sg, model._predicates);
	    }
	
	    if (exprTrigger !== null) {
	      sg = model.values(Deps.SIGNALS, exprTrigger.globals || EMPTY);
	      reeval = exprTrigger.fn();
	    }
	
	    log.debug(input, [def.type+"ing", reeval]);
	    if (!reeval || (!isClear && !input.signals[signalName])) return input;
	
	    var value = signal ? model.signalRef(def.signal) : null,
	        d = model.data(ds.name),
	        t = null, add = [], rem = [], datum;
	
	    if (dl.isObject(value)) {
	      datum = value;
	    } else {
	      datum = {};
	      datum[fieldName || 'data'] = value;
	    }
	
	    // We have to modify ds._data so that subsequent pulses contain
	    // our dynamic data. W/o modifying ds._data, only the output
	    // collector will contain dynamic tuples.
	    if (def.type === Types.INSERT) {
	      input.add.push(t=Tuple.ingest(datum));
	      d._data.push(t);
	    } else if (def.type === Types.REMOVE) {
	      filter(fieldName, value, input.mod, input.rem);
	      filter(fieldName, value, input.add, rem);
	      filter(fieldName, value, d._data, rem);
	    } else if (def.type === Types.TOGGLE) {
	      // If tuples are in mod, remove them.
	      filter(fieldName, value, input.mod, rem);
	      input.rem.push.apply(input.rem, rem);
	
	      // If tuples are in add, they've been added to backing data source,
	      // but no downstream operators will have seen it yet.
	      filter(fieldName, value, input.add, add);
	
	      if (add.length || rem.length) {
	        d._data = d._data.filter(function(x) {
	          return rem.indexOf(x) < 0 && add.indexOf(x) < 0;
	        });
	      } else {
	        // If the tuples aren't seen in the changeset, add a new tuple.
	        // Note, tuple might be in input.rem, but we ignore this and just
	        // re-add a new tuple for simplicity.
	        input.add.push(t=Tuple.ingest(datum));
	        d._data.push(t);
	      }
	    } else if (def.type === Types.CLEAR) {
	      input.rem.push.apply(input.rem, input.mod.splice(0));
	      input.add.splice(0);
	      d._data.splice(0);
	    }
	
	    if (fieldName) input.fields[fieldName] = 1;
	    return input;
	  };
	
	  if (signalName) node.dependency(Deps.SIGNALS, signalName);
	
	  if (predicate) {
	    node.dependency(Deps.DATA, predicate.data);
	    node.dependency(Deps.SIGNALS, predicate.signals);
	  }
	
	  if (exprTrigger) {
	    node.dependency(Deps.SIGNALS, exprTrigger.globals);
	    node.dependency(Deps.DATA,    exprTrigger.dataSources);
	  }
	
	  return node;
	}
	
	module.exports = parseModify;
	parseModify.schema = {
	  "defs": {
	    "modify": {
	      "type": "array",
	      "items": {
	        "type": "object",
	        "oneOf": [{
	          "properties": {
	            "type": {"enum": [Types.INSERT, Types.REMOVE, Types.TOGGLE]},
	            "signal": {"type": "string"},
	            "field": {"type": "string"}
	          },
	          "required": ["type", "signal"]
	        }, {
	          "properties": {
	            "type": {"enum": [Types.CLEAR]},
	            "predicate": {"type": "string"}  // TODO predicate args
	          },
	          "required": ["type", "predicate"]
	        },
	        {
	          "properties": {
	            "type": {"enum": [Types.CLEAR]},
	            "test": {"type": "string"}
	          },
	          "required": ["type", "test"]
	        }]
	      }
	    }
	  }
	};


/***/ },
/* 141 */
/***/ function(module, exports) {

	module.exports = (function() {
	  "use strict";
	
	  /*
	   * Generated by PEG.js 0.9.0.
	   *
	   * http://pegjs.org/
	   */
	
	  function peg$subclass(child, parent) {
	    function ctor() { this.constructor = child; }
	    ctor.prototype = parent.prototype;
	    child.prototype = new ctor();
	  }
	
	  function peg$SyntaxError(message, expected, found, location) {
	    this.message  = message;
	    this.expected = expected;
	    this.found    = found;
	    this.location = location;
	    this.name     = "SyntaxError";
	
	    if (typeof Error.captureStackTrace === "function") {
	      Error.captureStackTrace(this, peg$SyntaxError);
	    }
	  }
	
	  peg$subclass(peg$SyntaxError, Error);
	
	  function peg$parse(input) {
	    var options = arguments.length > 1 ? arguments[1] : {},
	        parser  = this,
	
	        peg$FAILED = {},
	
	        peg$startRuleFunctions = { start: peg$parsestart },
	        peg$startRuleFunction  = peg$parsestart,
	
	        peg$c0 = ",",
	        peg$c1 = { type: "literal", value: ",", description: "\",\"" },
	        peg$c2 = function(o, m) { return [o].concat(m); },
	        peg$c3 = function(o) { return [o]; },
	        peg$c4 = "[",
	        peg$c5 = { type: "literal", value: "[", description: "\"[\"" },
	        peg$c6 = "]",
	        peg$c7 = { type: "literal", value: "]", description: "\"]\"" },
	        peg$c8 = ">",
	        peg$c9 = { type: "literal", value: ">", description: "\">\"" },
	        peg$c10 = function(f1, f2, o) { return {start: f1, end: f2, middle: o}; },
	        peg$c11 = function(s, f) { return (s.filters = f, s); },
	        peg$c12 = function(s) { return s; },
	        peg$c13 = "(",
	        peg$c14 = { type: "literal", value: "(", description: "\"(\"" },
	        peg$c15 = ")",
	        peg$c16 = { type: "literal", value: ")", description: "\")\"" },
	        peg$c17 = function(m) { return {stream: m}; },
	        peg$c18 = "@",
	        peg$c19 = { type: "literal", value: "@", description: "\"@\"" },
	        peg$c20 = ":",
	        peg$c21 = { type: "literal", value: ":", description: "\":\"" },
	        peg$c22 = function(n, e) { return {event: e, name: n}; },
	        peg$c23 = function(m, e) { return {event: e, mark: m}; },
	        peg$c24 = function(t, e) { return {event: e, target: t}; },
	        peg$c25 = function(e) { return {event: e}; },
	        peg$c26 = function(s) { return {signal: s}; },
	        peg$c27 = "rect",
	        peg$c28 = { type: "literal", value: "rect", description: "\"rect\"" },
	        peg$c29 = "symbol",
	        peg$c30 = { type: "literal", value: "symbol", description: "\"symbol\"" },
	        peg$c31 = "path",
	        peg$c32 = { type: "literal", value: "path", description: "\"path\"" },
	        peg$c33 = "arc",
	        peg$c34 = { type: "literal", value: "arc", description: "\"arc\"" },
	        peg$c35 = "area",
	        peg$c36 = { type: "literal", value: "area", description: "\"area\"" },
	        peg$c37 = "line",
	        peg$c38 = { type: "literal", value: "line", description: "\"line\"" },
	        peg$c39 = "rule",
	        peg$c40 = { type: "literal", value: "rule", description: "\"rule\"" },
	        peg$c41 = "image",
	        peg$c42 = { type: "literal", value: "image", description: "\"image\"" },
	        peg$c43 = "text",
	        peg$c44 = { type: "literal", value: "text", description: "\"text\"" },
	        peg$c45 = "group",
	        peg$c46 = { type: "literal", value: "group", description: "\"group\"" },
	        peg$c47 = "mousedown",
	        peg$c48 = { type: "literal", value: "mousedown", description: "\"mousedown\"" },
	        peg$c49 = "mouseup",
	        peg$c50 = { type: "literal", value: "mouseup", description: "\"mouseup\"" },
	        peg$c51 = "click",
	        peg$c52 = { type: "literal", value: "click", description: "\"click\"" },
	        peg$c53 = "dblclick",
	        peg$c54 = { type: "literal", value: "dblclick", description: "\"dblclick\"" },
	        peg$c55 = "wheel",
	        peg$c56 = { type: "literal", value: "wheel", description: "\"wheel\"" },
	        peg$c57 = "keydown",
	        peg$c58 = { type: "literal", value: "keydown", description: "\"keydown\"" },
	        peg$c59 = "keypress",
	        peg$c60 = { type: "literal", value: "keypress", description: "\"keypress\"" },
	        peg$c61 = "keyup",
	        peg$c62 = { type: "literal", value: "keyup", description: "\"keyup\"" },
	        peg$c63 = "mousewheel",
	        peg$c64 = { type: "literal", value: "mousewheel", description: "\"mousewheel\"" },
	        peg$c65 = "mousemove",
	        peg$c66 = { type: "literal", value: "mousemove", description: "\"mousemove\"" },
	        peg$c67 = "mouseout",
	        peg$c68 = { type: "literal", value: "mouseout", description: "\"mouseout\"" },
	        peg$c69 = "mouseover",
	        peg$c70 = { type: "literal", value: "mouseover", description: "\"mouseover\"" },
	        peg$c71 = "mouseenter",
	        peg$c72 = { type: "literal", value: "mouseenter", description: "\"mouseenter\"" },
	        peg$c73 = "touchstart",
	        peg$c74 = { type: "literal", value: "touchstart", description: "\"touchstart\"" },
	        peg$c75 = "touchmove",
	        peg$c76 = { type: "literal", value: "touchmove", description: "\"touchmove\"" },
	        peg$c77 = "touchend",
	        peg$c78 = { type: "literal", value: "touchend", description: "\"touchend\"" },
	        peg$c79 = "dragenter",
	        peg$c80 = { type: "literal", value: "dragenter", description: "\"dragenter\"" },
	        peg$c81 = "dragover",
	        peg$c82 = { type: "literal", value: "dragover", description: "\"dragover\"" },
	        peg$c83 = "dragleave",
	        peg$c84 = { type: "literal", value: "dragleave", description: "\"dragleave\"" },
	        peg$c85 = function(e) { return e; },
	        peg$c86 = /^[a-zA-Z0-9_\-]/,
	        peg$c87 = { type: "class", value: "[a-zA-Z0-9_-]", description: "[a-zA-Z0-9_-]" },
	        peg$c88 = function(n) { return n.join(""); },
	        peg$c89 = /^[a-zA-Z0-9\-_  #.>+~[\]=|\^$*]/,
	        peg$c90 = { type: "class", value: "[a-zA-Z0-9-_  #\\.\\>\\+~\\[\\]=|\\^\\$\\*]", description: "[a-zA-Z0-9-_  #\\.\\>\\+~\\[\\]=|\\^\\$\\*]" },
	        peg$c91 = function(c) { return c.join(""); },
	        peg$c92 = /^['"a-zA-Z0-9_().><=! \t-&|~]/,
	        peg$c93 = { type: "class", value: "['\"a-zA-Z0-9_\\(\\)\\.\\>\\<\\=\\! \\t-&|~]", description: "['\"a-zA-Z0-9_\\(\\)\\.\\>\\<\\=\\! \\t-&|~]" },
	        peg$c94 = function(v) { return v.join(""); },
	        peg$c95 = /^[ \t\r\n]/,
	        peg$c96 = { type: "class", value: "[ \\t\\r\\n]", description: "[ \\t\\r\\n]" },
	
	        peg$currPos          = 0,
	        peg$savedPos         = 0,
	        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
	        peg$maxFailPos       = 0,
	        peg$maxFailExpected  = [],
	        peg$silentFails      = 0,
	
	        peg$result;
	
	    if ("startRule" in options) {
	      if (!(options.startRule in peg$startRuleFunctions)) {
	        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
	      }
	
	      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
	    }
	
	    function text() {
	      return input.substring(peg$savedPos, peg$currPos);
	    }
	
	    function location() {
	      return peg$computeLocation(peg$savedPos, peg$currPos);
	    }
	
	    function expected(description) {
	      throw peg$buildException(
	        null,
	        [{ type: "other", description: description }],
	        input.substring(peg$savedPos, peg$currPos),
	        peg$computeLocation(peg$savedPos, peg$currPos)
	      );
	    }
	
	    function error(message) {
	      throw peg$buildException(
	        message,
	        null,
	        input.substring(peg$savedPos, peg$currPos),
	        peg$computeLocation(peg$savedPos, peg$currPos)
	      );
	    }
	
	    function peg$computePosDetails(pos) {
	      var details = peg$posDetailsCache[pos],
	          p, ch;
	
	      if (details) {
	        return details;
	      } else {
	        p = pos - 1;
	        while (!peg$posDetailsCache[p]) {
	          p--;
	        }
	
	        details = peg$posDetailsCache[p];
	        details = {
	          line:   details.line,
	          column: details.column,
	          seenCR: details.seenCR
	        };
	
	        while (p < pos) {
	          ch = input.charAt(p);
	          if (ch === "\n") {
	            if (!details.seenCR) { details.line++; }
	            details.column = 1;
	            details.seenCR = false;
	          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
	            details.line++;
	            details.column = 1;
	            details.seenCR = true;
	          } else {
	            details.column++;
	            details.seenCR = false;
	          }
	
	          p++;
	        }
	
	        peg$posDetailsCache[pos] = details;
	        return details;
	      }
	    }
	
	    function peg$computeLocation(startPos, endPos) {
	      var startPosDetails = peg$computePosDetails(startPos),
	          endPosDetails   = peg$computePosDetails(endPos);
	
	      return {
	        start: {
	          offset: startPos,
	          line:   startPosDetails.line,
	          column: startPosDetails.column
	        },
	        end: {
	          offset: endPos,
	          line:   endPosDetails.line,
	          column: endPosDetails.column
	        }
	      };
	    }
	
	    function peg$fail(expected) {
	      if (peg$currPos < peg$maxFailPos) { return; }
	
	      if (peg$currPos > peg$maxFailPos) {
	        peg$maxFailPos = peg$currPos;
	        peg$maxFailExpected = [];
	      }
	
	      peg$maxFailExpected.push(expected);
	    }
	
	    function peg$buildException(message, expected, found, location) {
	      function cleanupExpected(expected) {
	        var i = 1;
	
	        expected.sort(function(a, b) {
	          if (a.description < b.description) {
	            return -1;
	          } else if (a.description > b.description) {
	            return 1;
	          } else {
	            return 0;
	          }
	        });
	
	        while (i < expected.length) {
	          if (expected[i - 1] === expected[i]) {
	            expected.splice(i, 1);
	          } else {
	            i++;
	          }
	        }
	      }
	
	      function buildMessage(expected, found) {
	        function stringEscape(s) {
	          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }
	
	          return s
	            .replace(/\\/g,   '\\\\')
	            .replace(/"/g,    '\\"')
	            .replace(/\x08/g, '\\b')
	            .replace(/\t/g,   '\\t')
	            .replace(/\n/g,   '\\n')
	            .replace(/\f/g,   '\\f')
	            .replace(/\r/g,   '\\r')
	            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
	            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
	            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
	            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
	        }
	
	        var expectedDescs = new Array(expected.length),
	            expectedDesc, foundDesc, i;
	
	        for (i = 0; i < expected.length; i++) {
	          expectedDescs[i] = expected[i].description;
	        }
	
	        expectedDesc = expected.length > 1
	          ? expectedDescs.slice(0, -1).join(", ")
	              + " or "
	              + expectedDescs[expected.length - 1]
	          : expectedDescs[0];
	
	        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";
	
	        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
	      }
	
	      if (expected !== null) {
	        cleanupExpected(expected);
	      }
	
	      return new peg$SyntaxError(
	        message !== null ? message : buildMessage(expected, found),
	        expected,
	        found,
	        location
	      );
	    }
	
	    function peg$parsestart() {
	      var s0;
	
	      s0 = peg$parsemerged();
	
	      return s0;
	    }
	
	    function peg$parsemerged() {
	      var s0, s1, s2, s3, s4, s5;
	
	      s0 = peg$currPos;
	      s1 = peg$parseordered();
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parsesep();
	        if (s2 !== peg$FAILED) {
	          if (input.charCodeAt(peg$currPos) === 44) {
	            s3 = peg$c0;
	            peg$currPos++;
	          } else {
	            s3 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c1); }
	          }
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parsesep();
	            if (s4 !== peg$FAILED) {
	              s5 = peg$parsemerged();
	              if (s5 !== peg$FAILED) {
	                peg$savedPos = s0;
	                s1 = peg$c2(s1, s5);
	                s0 = s1;
	              } else {
	                peg$currPos = s0;
	                s0 = peg$FAILED;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$FAILED;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$FAILED;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$FAILED;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$FAILED;
	      }
	      if (s0 === peg$FAILED) {
	        s0 = peg$currPos;
	        s1 = peg$parseordered();
	        if (s1 !== peg$FAILED) {
	          peg$savedPos = s0;
	          s1 = peg$c3(s1);
	        }
	        s0 = s1;
	      }
	
	      return s0;
	    }
	
	    function peg$parseordered() {
	      var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13;
	
	      s0 = peg$currPos;
	      if (input.charCodeAt(peg$currPos) === 91) {
	        s1 = peg$c4;
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c5); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parsesep();
	        if (s2 !== peg$FAILED) {
	          s3 = peg$parsefiltered();
	          if (s3 !== peg$FAILED) {
	            s4 = peg$parsesep();
	            if (s4 !== peg$FAILED) {
	              if (input.charCodeAt(peg$currPos) === 44) {
	                s5 = peg$c0;
	                peg$currPos++;
	              } else {
	                s5 = peg$FAILED;
	                if (peg$silentFails === 0) { peg$fail(peg$c1); }
	              }
	              if (s5 !== peg$FAILED) {
	                s6 = peg$parsesep();
	                if (s6 !== peg$FAILED) {
	                  s7 = peg$parsefiltered();
	                  if (s7 !== peg$FAILED) {
	                    s8 = peg$parsesep();
	                    if (s8 !== peg$FAILED) {
	                      if (input.charCodeAt(peg$currPos) === 93) {
	                        s9 = peg$c6;
	                        peg$currPos++;
	                      } else {
	                        s9 = peg$FAILED;
	                        if (peg$silentFails === 0) { peg$fail(peg$c7); }
	                      }
	                      if (s9 !== peg$FAILED) {
	                        s10 = peg$parsesep();
	                        if (s10 !== peg$FAILED) {
	                          if (input.charCodeAt(peg$currPos) === 62) {
	                            s11 = peg$c8;
	                            peg$currPos++;
	                          } else {
	                            s11 = peg$FAILED;
	                            if (peg$silentFails === 0) { peg$fail(peg$c9); }
	                          }
	                          if (s11 !== peg$FAILED) {
	                            s12 = peg$parsesep();
	                            if (s12 !== peg$FAILED) {
	                              s13 = peg$parseordered();
	                              if (s13 !== peg$FAILED) {
	                                peg$savedPos = s0;
	                                s1 = peg$c10(s3, s7, s13);
	                                s0 = s1;
	                              } else {
	                                peg$currPos = s0;
	                                s0 = peg$FAILED;
	                              }
	                            } else {
	                              peg$currPos = s0;
	                              s0 = peg$FAILED;
	                            }
	                          } else {
	                            peg$currPos = s0;
	                            s0 = peg$FAILED;
	                          }
	                        } else {
	                          peg$currPos = s0;
	                          s0 = peg$FAILED;
	                        }
	                      } else {
	                        peg$currPos = s0;
	                        s0 = peg$FAILED;
	                      }
	                    } else {
	                      peg$currPos = s0;
	                      s0 = peg$FAILED;
	                    }
	                  } else {
	                    peg$currPos = s0;
	                    s0 = peg$FAILED;
	                  }
	                } else {
	                  peg$currPos = s0;
	                  s0 = peg$FAILED;
	                }
	              } else {
	                peg$currPos = s0;
	                s0 = peg$FAILED;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$FAILED;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$FAILED;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$FAILED;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$FAILED;
	      }
	      if (s0 === peg$FAILED) {
	        s0 = peg$parsefiltered();
	      }
	
	      return s0;
	    }
	
	    function peg$parsefiltered() {
	      var s0, s1, s2, s3;
	
	      s0 = peg$currPos;
	      s1 = peg$parsestream();
	      if (s1 !== peg$FAILED) {
	        s2 = [];
	        s3 = peg$parsefilter();
	        if (s3 !== peg$FAILED) {
	          while (s3 !== peg$FAILED) {
	            s2.push(s3);
	            s3 = peg$parsefilter();
	          }
	        } else {
	          s2 = peg$FAILED;
	        }
	        if (s2 !== peg$FAILED) {
	          peg$savedPos = s0;
	          s1 = peg$c11(s1, s2);
	          s0 = s1;
	        } else {
	          peg$currPos = s0;
	          s0 = peg$FAILED;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$FAILED;
	      }
	      if (s0 === peg$FAILED) {
	        s0 = peg$currPos;
	        s1 = peg$parsestream();
	        if (s1 !== peg$FAILED) {
	          peg$savedPos = s0;
	          s1 = peg$c12(s1);
	        }
	        s0 = s1;
	      }
	
	      return s0;
	    }
	
	    function peg$parsestream() {
	      var s0, s1, s2, s3, s4;
	
	      s0 = peg$currPos;
	      if (input.charCodeAt(peg$currPos) === 40) {
	        s1 = peg$c13;
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c14); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parsemerged();
	        if (s2 !== peg$FAILED) {
	          if (input.charCodeAt(peg$currPos) === 41) {
	            s3 = peg$c15;
	            peg$currPos++;
	          } else {
	            s3 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c16); }
	          }
	          if (s3 !== peg$FAILED) {
	            peg$savedPos = s0;
	            s1 = peg$c17(s2);
	            s0 = s1;
	          } else {
	            peg$currPos = s0;
	            s0 = peg$FAILED;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$FAILED;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$FAILED;
	      }
	      if (s0 === peg$FAILED) {
	        s0 = peg$currPos;
	        if (input.charCodeAt(peg$currPos) === 64) {
	          s1 = peg$c18;
	          peg$currPos++;
	        } else {
	          s1 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c19); }
	        }
	        if (s1 !== peg$FAILED) {
	          s2 = peg$parsename();
	          if (s2 !== peg$FAILED) {
	            if (input.charCodeAt(peg$currPos) === 58) {
	              s3 = peg$c20;
	              peg$currPos++;
	            } else {
	              s3 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c21); }
	            }
	            if (s3 !== peg$FAILED) {
	              s4 = peg$parseeventType();
	              if (s4 !== peg$FAILED) {
	                peg$savedPos = s0;
	                s1 = peg$c22(s2, s4);
	                s0 = s1;
	              } else {
	                peg$currPos = s0;
	                s0 = peg$FAILED;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$FAILED;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$FAILED;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$FAILED;
	        }
	        if (s0 === peg$FAILED) {
	          s0 = peg$currPos;
	          s1 = peg$parsemarkType();
	          if (s1 !== peg$FAILED) {
	            if (input.charCodeAt(peg$currPos) === 58) {
	              s2 = peg$c20;
	              peg$currPos++;
	            } else {
	              s2 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c21); }
	            }
	            if (s2 !== peg$FAILED) {
	              s3 = peg$parseeventType();
	              if (s3 !== peg$FAILED) {
	                peg$savedPos = s0;
	                s1 = peg$c23(s1, s3);
	                s0 = s1;
	              } else {
	                peg$currPos = s0;
	                s0 = peg$FAILED;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$FAILED;
	            }
	          } else {
	            peg$currPos = s0;
	            s0 = peg$FAILED;
	          }
	          if (s0 === peg$FAILED) {
	            s0 = peg$currPos;
	            s1 = peg$parsecss();
	            if (s1 !== peg$FAILED) {
	              if (input.charCodeAt(peg$currPos) === 58) {
	                s2 = peg$c20;
	                peg$currPos++;
	              } else {
	                s2 = peg$FAILED;
	                if (peg$silentFails === 0) { peg$fail(peg$c21); }
	              }
	              if (s2 !== peg$FAILED) {
	                s3 = peg$parseeventType();
	                if (s3 !== peg$FAILED) {
	                  peg$savedPos = s0;
	                  s1 = peg$c24(s1, s3);
	                  s0 = s1;
	                } else {
	                  peg$currPos = s0;
	                  s0 = peg$FAILED;
	                }
	              } else {
	                peg$currPos = s0;
	                s0 = peg$FAILED;
	              }
	            } else {
	              peg$currPos = s0;
	              s0 = peg$FAILED;
	            }
	            if (s0 === peg$FAILED) {
	              s0 = peg$currPos;
	              s1 = peg$parseeventType();
	              if (s1 !== peg$FAILED) {
	                peg$savedPos = s0;
	                s1 = peg$c25(s1);
	              }
	              s0 = s1;
	              if (s0 === peg$FAILED) {
	                s0 = peg$currPos;
	                s1 = peg$parsename();
	                if (s1 !== peg$FAILED) {
	                  peg$savedPos = s0;
	                  s1 = peg$c26(s1);
	                }
	                s0 = s1;
	              }
	            }
	          }
	        }
	      }
	
	      return s0;
	    }
	
	    function peg$parsemarkType() {
	      var s0;
	
	      if (input.substr(peg$currPos, 4) === peg$c27) {
	        s0 = peg$c27;
	        peg$currPos += 4;
	      } else {
	        s0 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c28); }
	      }
	      if (s0 === peg$FAILED) {
	        if (input.substr(peg$currPos, 6) === peg$c29) {
	          s0 = peg$c29;
	          peg$currPos += 6;
	        } else {
	          s0 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c30); }
	        }
	        if (s0 === peg$FAILED) {
	          if (input.substr(peg$currPos, 4) === peg$c31) {
	            s0 = peg$c31;
	            peg$currPos += 4;
	          } else {
	            s0 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c32); }
	          }
	          if (s0 === peg$FAILED) {
	            if (input.substr(peg$currPos, 3) === peg$c33) {
	              s0 = peg$c33;
	              peg$currPos += 3;
	            } else {
	              s0 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c34); }
	            }
	            if (s0 === peg$FAILED) {
	              if (input.substr(peg$currPos, 4) === peg$c35) {
	                s0 = peg$c35;
	                peg$currPos += 4;
	              } else {
	                s0 = peg$FAILED;
	                if (peg$silentFails === 0) { peg$fail(peg$c36); }
	              }
	              if (s0 === peg$FAILED) {
	                if (input.substr(peg$currPos, 4) === peg$c37) {
	                  s0 = peg$c37;
	                  peg$currPos += 4;
	                } else {
	                  s0 = peg$FAILED;
	                  if (peg$silentFails === 0) { peg$fail(peg$c38); }
	                }
	                if (s0 === peg$FAILED) {
	                  if (input.substr(peg$currPos, 4) === peg$c39) {
	                    s0 = peg$c39;
	                    peg$currPos += 4;
	                  } else {
	                    s0 = peg$FAILED;
	                    if (peg$silentFails === 0) { peg$fail(peg$c40); }
	                  }
	                  if (s0 === peg$FAILED) {
	                    if (input.substr(peg$currPos, 5) === peg$c41) {
	                      s0 = peg$c41;
	                      peg$currPos += 5;
	                    } else {
	                      s0 = peg$FAILED;
	                      if (peg$silentFails === 0) { peg$fail(peg$c42); }
	                    }
	                    if (s0 === peg$FAILED) {
	                      if (input.substr(peg$currPos, 4) === peg$c43) {
	                        s0 = peg$c43;
	                        peg$currPos += 4;
	                      } else {
	                        s0 = peg$FAILED;
	                        if (peg$silentFails === 0) { peg$fail(peg$c44); }
	                      }
	                      if (s0 === peg$FAILED) {
	                        if (input.substr(peg$currPos, 5) === peg$c45) {
	                          s0 = peg$c45;
	                          peg$currPos += 5;
	                        } else {
	                          s0 = peg$FAILED;
	                          if (peg$silentFails === 0) { peg$fail(peg$c46); }
	                        }
	                      }
	                    }
	                  }
	                }
	              }
	            }
	          }
	        }
	      }
	
	      return s0;
	    }
	
	    function peg$parseeventType() {
	      var s0;
	
	      if (input.substr(peg$currPos, 9) === peg$c47) {
	        s0 = peg$c47;
	        peg$currPos += 9;
	      } else {
	        s0 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c48); }
	      }
	      if (s0 === peg$FAILED) {
	        if (input.substr(peg$currPos, 7) === peg$c49) {
	          s0 = peg$c49;
	          peg$currPos += 7;
	        } else {
	          s0 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c50); }
	        }
	        if (s0 === peg$FAILED) {
	          if (input.substr(peg$currPos, 5) === peg$c51) {
	            s0 = peg$c51;
	            peg$currPos += 5;
	          } else {
	            s0 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c52); }
	          }
	          if (s0 === peg$FAILED) {
	            if (input.substr(peg$currPos, 8) === peg$c53) {
	              s0 = peg$c53;
	              peg$currPos += 8;
	            } else {
	              s0 = peg$FAILED;
	              if (peg$silentFails === 0) { peg$fail(peg$c54); }
	            }
	            if (s0 === peg$FAILED) {
	              if (input.substr(peg$currPos, 5) === peg$c55) {
	                s0 = peg$c55;
	                peg$currPos += 5;
	              } else {
	                s0 = peg$FAILED;
	                if (peg$silentFails === 0) { peg$fail(peg$c56); }
	              }
	              if (s0 === peg$FAILED) {
	                if (input.substr(peg$currPos, 7) === peg$c57) {
	                  s0 = peg$c57;
	                  peg$currPos += 7;
	                } else {
	                  s0 = peg$FAILED;
	                  if (peg$silentFails === 0) { peg$fail(peg$c58); }
	                }
	                if (s0 === peg$FAILED) {
	                  if (input.substr(peg$currPos, 8) === peg$c59) {
	                    s0 = peg$c59;
	                    peg$currPos += 8;
	                  } else {
	                    s0 = peg$FAILED;
	                    if (peg$silentFails === 0) { peg$fail(peg$c60); }
	                  }
	                  if (s0 === peg$FAILED) {
	                    if (input.substr(peg$currPos, 5) === peg$c61) {
	                      s0 = peg$c61;
	                      peg$currPos += 5;
	                    } else {
	                      s0 = peg$FAILED;
	                      if (peg$silentFails === 0) { peg$fail(peg$c62); }
	                    }
	                    if (s0 === peg$FAILED) {
	                      if (input.substr(peg$currPos, 10) === peg$c63) {
	                        s0 = peg$c63;
	                        peg$currPos += 10;
	                      } else {
	                        s0 = peg$FAILED;
	                        if (peg$silentFails === 0) { peg$fail(peg$c64); }
	                      }
	                      if (s0 === peg$FAILED) {
	                        if (input.substr(peg$currPos, 9) === peg$c65) {
	                          s0 = peg$c65;
	                          peg$currPos += 9;
	                        } else {
	                          s0 = peg$FAILED;
	                          if (peg$silentFails === 0) { peg$fail(peg$c66); }
	                        }
	                        if (s0 === peg$FAILED) {
	                          if (input.substr(peg$currPos, 8) === peg$c67) {
	                            s0 = peg$c67;
	                            peg$currPos += 8;
	                          } else {
	                            s0 = peg$FAILED;
	                            if (peg$silentFails === 0) { peg$fail(peg$c68); }
	                          }
	                          if (s0 === peg$FAILED) {
	                            if (input.substr(peg$currPos, 9) === peg$c69) {
	                              s0 = peg$c69;
	                              peg$currPos += 9;
	                            } else {
	                              s0 = peg$FAILED;
	                              if (peg$silentFails === 0) { peg$fail(peg$c70); }
	                            }
	                            if (s0 === peg$FAILED) {
	                              if (input.substr(peg$currPos, 10) === peg$c71) {
	                                s0 = peg$c71;
	                                peg$currPos += 10;
	                              } else {
	                                s0 = peg$FAILED;
	                                if (peg$silentFails === 0) { peg$fail(peg$c72); }
	                              }
	                              if (s0 === peg$FAILED) {
	                                if (input.substr(peg$currPos, 10) === peg$c73) {
	                                  s0 = peg$c73;
	                                  peg$currPos += 10;
	                                } else {
	                                  s0 = peg$FAILED;
	                                  if (peg$silentFails === 0) { peg$fail(peg$c74); }
	                                }
	                                if (s0 === peg$FAILED) {
	                                  if (input.substr(peg$currPos, 9) === peg$c75) {
	                                    s0 = peg$c75;
	                                    peg$currPos += 9;
	                                  } else {
	                                    s0 = peg$FAILED;
	                                    if (peg$silentFails === 0) { peg$fail(peg$c76); }
	                                  }
	                                  if (s0 === peg$FAILED) {
	                                    if (input.substr(peg$currPos, 8) === peg$c77) {
	                                      s0 = peg$c77;
	                                      peg$currPos += 8;
	                                    } else {
	                                      s0 = peg$FAILED;
	                                      if (peg$silentFails === 0) { peg$fail(peg$c78); }
	                                    }
	                                    if (s0 === peg$FAILED) {
	                                      if (input.substr(peg$currPos, 9) === peg$c79) {
	                                        s0 = peg$c79;
	                                        peg$currPos += 9;
	                                      } else {
	                                        s0 = peg$FAILED;
	                                        if (peg$silentFails === 0) { peg$fail(peg$c80); }
	                                      }
	                                      if (s0 === peg$FAILED) {
	                                        if (input.substr(peg$currPos, 8) === peg$c81) {
	                                          s0 = peg$c81;
	                                          peg$currPos += 8;
	                                        } else {
	                                          s0 = peg$FAILED;
	                                          if (peg$silentFails === 0) { peg$fail(peg$c82); }
	                                        }
	                                        if (s0 === peg$FAILED) {
	                                          if (input.substr(peg$currPos, 9) === peg$c83) {
	                                            s0 = peg$c83;
	                                            peg$currPos += 9;
	                                          } else {
	                                            s0 = peg$FAILED;
	                                            if (peg$silentFails === 0) { peg$fail(peg$c84); }
	                                          }
	                                        }
	                                      }
	                                    }
	                                  }
	                                }
	                              }
	                            }
	                          }
	                        }
	                      }
	                    }
	                  }
	                }
	              }
	            }
	          }
	        }
	      }
	
	      return s0;
	    }
	
	    function peg$parsefilter() {
	      var s0, s1, s2, s3;
	
	      s0 = peg$currPos;
	      if (input.charCodeAt(peg$currPos) === 91) {
	        s1 = peg$c4;
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c5); }
	      }
	      if (s1 !== peg$FAILED) {
	        s2 = peg$parseexpr();
	        if (s2 !== peg$FAILED) {
	          if (input.charCodeAt(peg$currPos) === 93) {
	            s3 = peg$c6;
	            peg$currPos++;
	          } else {
	            s3 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c7); }
	          }
	          if (s3 !== peg$FAILED) {
	            peg$savedPos = s0;
	            s1 = peg$c85(s2);
	            s0 = s1;
	          } else {
	            peg$currPos = s0;
	            s0 = peg$FAILED;
	          }
	        } else {
	          peg$currPos = s0;
	          s0 = peg$FAILED;
	        }
	      } else {
	        peg$currPos = s0;
	        s0 = peg$FAILED;
	      }
	
	      return s0;
	    }
	
	    function peg$parsename() {
	      var s0, s1, s2;
	
	      s0 = peg$currPos;
	      s1 = [];
	      if (peg$c86.test(input.charAt(peg$currPos))) {
	        s2 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s2 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c87); }
	      }
	      if (s2 !== peg$FAILED) {
	        while (s2 !== peg$FAILED) {
	          s1.push(s2);
	          if (peg$c86.test(input.charAt(peg$currPos))) {
	            s2 = input.charAt(peg$currPos);
	            peg$currPos++;
	          } else {
	            s2 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c87); }
	          }
	        }
	      } else {
	        s1 = peg$FAILED;
	      }
	      if (s1 !== peg$FAILED) {
	        peg$savedPos = s0;
	        s1 = peg$c88(s1);
	      }
	      s0 = s1;
	
	      return s0;
	    }
	
	    function peg$parsecss() {
	      var s0, s1, s2;
	
	      s0 = peg$currPos;
	      s1 = [];
	      if (peg$c89.test(input.charAt(peg$currPos))) {
	        s2 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s2 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c90); }
	      }
	      if (s2 !== peg$FAILED) {
	        while (s2 !== peg$FAILED) {
	          s1.push(s2);
	          if (peg$c89.test(input.charAt(peg$currPos))) {
	            s2 = input.charAt(peg$currPos);
	            peg$currPos++;
	          } else {
	            s2 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c90); }
	          }
	        }
	      } else {
	        s1 = peg$FAILED;
	      }
	      if (s1 !== peg$FAILED) {
	        peg$savedPos = s0;
	        s1 = peg$c91(s1);
	      }
	      s0 = s1;
	
	      return s0;
	    }
	
	    function peg$parseexpr() {
	      var s0, s1, s2;
	
	      s0 = peg$currPos;
	      s1 = [];
	      if (peg$c92.test(input.charAt(peg$currPos))) {
	        s2 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s2 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c93); }
	      }
	      if (s2 !== peg$FAILED) {
	        while (s2 !== peg$FAILED) {
	          s1.push(s2);
	          if (peg$c92.test(input.charAt(peg$currPos))) {
	            s2 = input.charAt(peg$currPos);
	            peg$currPos++;
	          } else {
	            s2 = peg$FAILED;
	            if (peg$silentFails === 0) { peg$fail(peg$c93); }
	          }
	        }
	      } else {
	        s1 = peg$FAILED;
	      }
	      if (s1 !== peg$FAILED) {
	        peg$savedPos = s0;
	        s1 = peg$c94(s1);
	      }
	      s0 = s1;
	
	      return s0;
	    }
	
	    function peg$parsesep() {
	      var s0, s1;
	
	      s0 = [];
	      if (peg$c95.test(input.charAt(peg$currPos))) {
	        s1 = input.charAt(peg$currPos);
	        peg$currPos++;
	      } else {
	        s1 = peg$FAILED;
	        if (peg$silentFails === 0) { peg$fail(peg$c96); }
	      }
	      while (s1 !== peg$FAILED) {
	        s0.push(s1);
	        if (peg$c95.test(input.charAt(peg$currPos))) {
	          s1 = input.charAt(peg$currPos);
	          peg$currPos++;
	        } else {
	          s1 = peg$FAILED;
	          if (peg$silentFails === 0) { peg$fail(peg$c96); }
	        }
	      }
	
	      return s0;
	    }
	
	    peg$result = peg$startRuleFunction();
	
	    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
	      return peg$result;
	    } else {
	      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
	        peg$fail({ type: "end", description: "end of input" });
	      }
	
	      throw peg$buildException(
	        null,
	        peg$maxFailExpected,
	        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
	        peg$maxFailPos < input.length
	          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
	          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
	      );
	    }
	  }
	
	  return {
	    SyntaxError: peg$SyntaxError,
	    parse:       peg$parse
	  };
	})();


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    template = dl.template,
	    expr = __webpack_require__(143),
	    args = ['datum', 'event', 'signals'];
	
	var compile = expr.compiler(args, {
	  idWhiteList: args,
	  fieldVar:    args[0],
	  globalVar:   function(id) {
	    return 'this.sig[' + dl.str(id) + ']._value';
	  },
	  functions:   function(codegen) {
	    var fn = expr.functions(codegen);
	    fn.eventItem  = 'event.vg.getItem';
	    fn.eventGroup = 'event.vg.getGroup';
	    fn.eventX     = 'event.vg.getX';
	    fn.eventY     = 'event.vg.getY';
	    fn.open       = 'window.open';
	    fn.scale      = scaleGen(codegen, false);
	    fn.iscale     = scaleGen(codegen, true);
	    fn.inrange    = 'this.defs.inrange';
	    fn.indata     = indataGen(codegen);
	    fn.format     = 'this.defs.format';
	    fn.timeFormat = 'this.defs.timeFormat';
	    fn.utcFormat  = 'this.defs.utcFormat';
	    return fn;
	  },
	  functionDefs: function(/*codegen*/) {
	    return {
	      'scale':      scale,
	      'inrange':    inrange,
	      'indata':     indata,
	      'format':     numberFormat,
	      'timeFormat': timeFormat,
	      'utcFormat':  utcFormat
	    };
	  }
	});
	
	function scaleGen(codegen, invert) {
	  return function(args) {
	    args = args.map(codegen);
	    var n = args.length;
	    if (n < 2 || n > 3) {
	      throw Error("scale takes exactly 2 or 3 arguments.");
	    }
	    return 'this.defs.scale(this.model, ' + invert + ', ' +
	      args[0] + ',' + args[1] + (n > 2 ? ',' + args[2] : '') + ')';
	  };
	}
	
	function scale(model, invert, name, value, scope) {
	  if (!scope || !scope.scale) {
	    scope = (scope && scope.mark) ? scope.mark.group : model.scene().items[0];
	  }
	  // Verify scope is valid
	  if (model.group(scope._id) !== scope) {
	    throw Error('Scope for scale "'+name+'" is not a valid group item.');
	  }
	  var s = scope.scale(name);
	  return !s ? value : (invert ? s.invert(value) : s(value));
	}
	
	function inrange(val, a, b, exclusive) {
	  var min = a, max = b;
	  if (a > b) { min = b; max = a; }
	  return exclusive ?
	    (min < val && max > val) :
	    (min <= val && max >= val);
	}
	
	function indataGen(codegen) {
	  return function(args, globals, fields, dataSources) {
	    var data;
	    if (args.length !== 3) {
	      throw Error("indata takes 3 arguments.");
	    }
	    if (args[0].type !== 'Literal') {
	      throw Error("Data source name must be a literal for indata.");
	    }
	
	    data = args[0].value;
	    dataSources[data] = 1;
	    if (args[2].type === 'Literal') {
	      indataGen.model.requestIndex(data, args[2].value);
	    }
	
	    args = args.map(codegen);
	    return 'this.defs.indata(this.model,' + 
	      args[0] + ',' + args[1] + ',' + args[2] + ')';
	  };
	}
	
	function indata(model, dataname, val, field) {
	  var data = model.data(dataname),
	      index = data.getIndex(field);
	  return index[val] > 0;
	}
	
	function numberFormat(specifier, v) {
	  return template.format(specifier, 'number')(v);
	}
	
	function timeFormat(specifier, d) {
	  return template.format(specifier, 'time')(d);
	}
	
	function utcFormat(specifier, d) {
	  return template.format(specifier, 'utc')(d);
	}
	
	function wrap(model) {
	  return function(str) {
	    indataGen.model = model;
	    var x = compile(str);
	    x.model = model;
	    x.sig = model ? model._signals : {};
	    return x;
	  };
	}
	
	wrap.scale = scale;
	wrap.codegen = compile.codegen;
	module.exports = wrap;


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	var parser = __webpack_require__(144),
	    codegen = __webpack_require__(145);
	
	var expr = module.exports = {
	  parse: function(input, opt) {
	      return parser.parse('('+input+')', opt);
	    },
	  code: function(opt) {
	      return codegen(opt);
	    },
	  compiler: function(args, opt) {
	      args = args.slice();
	      var generator = codegen(opt),
	          len = args.length,
	          compile = function(str) {
	            var value = generator(expr.parse(str));
	            args[len] = '"use strict"; return (' + value.code + ');';
	            var fn = Function.apply(null, args);
	            value.fn = (args.length > 8) ?
	              function() { return fn.apply(value, arguments); } :
	              function(a, b, c, d, e, f, g) {
	                return fn.call(value, a, b, c, d, e, f, g);
	              }; // call often faster than apply, use if args low enough
	            return value;
	          };
	      compile.codegen = generator;
	      return compile;
	    },
	  functions: __webpack_require__(147),
	  constants: __webpack_require__(146)
	};

/***/ },
/* 144 */
/***/ function(module, exports) {

	/*
	  The following expression parser is based on Esprima (http://esprima.org/).
	  Original header comment and license for Esprima is included here:
	
	  Copyright (C) 2013 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2013 Thaddee Tyl <thaddee.tyl@gmail.com>
	  Copyright (C) 2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>
	  Copyright (C) 2011 Ariya Hidayat <ariya.hidayat@gmail.com>
	
	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:
	
	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.
	
	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/* istanbul ignore next */
	module.exports = (function() {
	  'use strict';
	
	  var Token,
	      TokenName,
	      Syntax,
	      PropertyKind,
	      Messages,
	      Regex,
	      source,
	      strict,
	      index,
	      lineNumber,
	      lineStart,
	      length,
	      lookahead,
	      state,
	      extra;
	
	  Token = {
	      BooleanLiteral: 1,
	      EOF: 2,
	      Identifier: 3,
	      Keyword: 4,
	      NullLiteral: 5,
	      NumericLiteral: 6,
	      Punctuator: 7,
	      StringLiteral: 8,
	      RegularExpression: 9
	  };
	
	  TokenName = {};
	  TokenName[Token.BooleanLiteral] = 'Boolean';
	  TokenName[Token.EOF] = '<end>';
	  TokenName[Token.Identifier] = 'Identifier';
	  TokenName[Token.Keyword] = 'Keyword';
	  TokenName[Token.NullLiteral] = 'Null';
	  TokenName[Token.NumericLiteral] = 'Numeric';
	  TokenName[Token.Punctuator] = 'Punctuator';
	  TokenName[Token.StringLiteral] = 'String';
	  TokenName[Token.RegularExpression] = 'RegularExpression';
	
	  Syntax = {
	      AssignmentExpression: 'AssignmentExpression',
	      ArrayExpression: 'ArrayExpression',
	      BinaryExpression: 'BinaryExpression',
	      CallExpression: 'CallExpression',
	      ConditionalExpression: 'ConditionalExpression',
	      ExpressionStatement: 'ExpressionStatement',
	      Identifier: 'Identifier',
	      Literal: 'Literal',
	      LogicalExpression: 'LogicalExpression',
	      MemberExpression: 'MemberExpression',
	      ObjectExpression: 'ObjectExpression',
	      Program: 'Program',
	      Property: 'Property',
	      UnaryExpression: 'UnaryExpression'
	  };
	
	  PropertyKind = {
	      Data: 1,
	      Get: 2,
	      Set: 4
	  };
	
	  // Error messages should be identical to V8.
	  Messages = {
	      UnexpectedToken:  'Unexpected token %0',
	      UnexpectedNumber:  'Unexpected number',
	      UnexpectedString:  'Unexpected string',
	      UnexpectedIdentifier:  'Unexpected identifier',
	      UnexpectedReserved:  'Unexpected reserved word',
	      UnexpectedEOS:  'Unexpected end of input',
	      NewlineAfterThrow:  'Illegal newline after throw',
	      InvalidRegExp: 'Invalid regular expression',
	      UnterminatedRegExp:  'Invalid regular expression: missing /',
	      InvalidLHSInAssignment:  'Invalid left-hand side in assignment',
	      InvalidLHSInForIn:  'Invalid left-hand side in for-in',
	      MultipleDefaultsInSwitch: 'More than one default clause in switch statement',
	      NoCatchOrFinally:  'Missing catch or finally after try',
	      UnknownLabel: 'Undefined label \'%0\'',
	      Redeclaration: '%0 \'%1\' has already been declared',
	      IllegalContinue: 'Illegal continue statement',
	      IllegalBreak: 'Illegal break statement',
	      IllegalReturn: 'Illegal return statement',
	      StrictModeWith:  'Strict mode code may not include a with statement',
	      StrictCatchVariable:  'Catch variable may not be eval or arguments in strict mode',
	      StrictVarName:  'Variable name may not be eval or arguments in strict mode',
	      StrictParamName:  'Parameter name eval or arguments is not allowed in strict mode',
	      StrictParamDupe: 'Strict mode function may not have duplicate parameter names',
	      StrictFunctionName:  'Function name may not be eval or arguments in strict mode',
	      StrictOctalLiteral:  'Octal literals are not allowed in strict mode.',
	      StrictDelete:  'Delete of an unqualified identifier in strict mode.',
	      StrictDuplicateProperty:  'Duplicate data property in object literal not allowed in strict mode',
	      AccessorDataProperty:  'Object literal may not have data and accessor property with the same name',
	      AccessorGetSet:  'Object literal may not have multiple get/set accessors with the same name',
	      StrictLHSAssignment:  'Assignment to eval or arguments is not allowed in strict mode',
	      StrictLHSPostfix:  'Postfix increment/decrement may not have eval or arguments operand in strict mode',
	      StrictLHSPrefix:  'Prefix increment/decrement may not have eval or arguments operand in strict mode',
	      StrictReservedWord:  'Use of future reserved word in strict mode'
	  };
	
	  // See also tools/generate-unicode-regex.py.
	  Regex = {
	      NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
	      NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
	  };
	
	  // Ensure the condition is true, otherwise throw an error.
	  // This is only to have a better contract semantic, i.e. another safety net
	  // to catch a logic error. The condition shall be fulfilled in normal case.
	  // Do NOT use this to enforce a certain condition on any user input.
	
	  function assert(condition, message) {
	      if (!condition) {
	          throw new Error('ASSERT: ' + message);
	      }
	  }
	
	  function isDecimalDigit(ch) {
	      return (ch >= 0x30 && ch <= 0x39);   // 0..9
	  }
	
	  function isHexDigit(ch) {
	      return '0123456789abcdefABCDEF'.indexOf(ch) >= 0;
	  }
	
	  function isOctalDigit(ch) {
	      return '01234567'.indexOf(ch) >= 0;
	  }
	
	  // 7.2 White Space
	
	  function isWhiteSpace(ch) {
	      return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
	          (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
	  }
	
	  // 7.3 Line Terminators
	
	  function isLineTerminator(ch) {
	      return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
	  }
	
	  // 7.6 Identifier Names and Identifiers
	
	  function isIdentifierStart(ch) {
	      return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
	          (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
	          (ch >= 0x61 && ch <= 0x7A) ||         // a..z
	          (ch === 0x5C) ||                      // \ (backslash)
	          ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
	  }
	
	  function isIdentifierPart(ch) {
	      return (ch === 0x24) || (ch === 0x5F) ||  // $ (dollar) and _ (underscore)
	          (ch >= 0x41 && ch <= 0x5A) ||         // A..Z
	          (ch >= 0x61 && ch <= 0x7A) ||         // a..z
	          (ch >= 0x30 && ch <= 0x39) ||         // 0..9
	          (ch === 0x5C) ||                      // \ (backslash)
	          ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
	  }
	
	  // 7.6.1.2 Future Reserved Words
	
	  function isFutureReservedWord(id) {
	      switch (id) {
	      case 'class':
	      case 'enum':
	      case 'export':
	      case 'extends':
	      case 'import':
	      case 'super':
	          return true;
	      default:
	          return false;
	      }
	  }
	
	  function isStrictModeReservedWord(id) {
	      switch (id) {
	      case 'implements':
	      case 'interface':
	      case 'package':
	      case 'private':
	      case 'protected':
	      case 'public':
	      case 'static':
	      case 'yield':
	      case 'let':
	          return true;
	      default:
	          return false;
	      }
	  }
	
	  // 7.6.1.1 Keywords
	
	  function isKeyword(id) {
	      if (strict && isStrictModeReservedWord(id)) {
	          return true;
	      }
	
	      // 'const' is specialized as Keyword in V8.
	      // 'yield' and 'let' are for compatiblity with SpiderMonkey and ES.next.
	      // Some others are from future reserved words.
	
	      switch (id.length) {
	      case 2:
	          return (id === 'if') || (id === 'in') || (id === 'do');
	      case 3:
	          return (id === 'var') || (id === 'for') || (id === 'new') ||
	              (id === 'try') || (id === 'let');
	      case 4:
	          return (id === 'this') || (id === 'else') || (id === 'case') ||
	              (id === 'void') || (id === 'with') || (id === 'enum');
	      case 5:
	          return (id === 'while') || (id === 'break') || (id === 'catch') ||
	              (id === 'throw') || (id === 'const') || (id === 'yield') ||
	              (id === 'class') || (id === 'super');
	      case 6:
	          return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	              (id === 'switch') || (id === 'export') || (id === 'import');
	      case 7:
	          return (id === 'default') || (id === 'finally') || (id === 'extends');
	      case 8:
	          return (id === 'function') || (id === 'continue') || (id === 'debugger');
	      case 10:
	          return (id === 'instanceof');
	      default:
	          return false;
	      }
	  }
	
	  function skipComment() {
	      var ch, start;
	
	      start = (index === 0);
	      while (index < length) {
	          ch = source.charCodeAt(index);
	
	          if (isWhiteSpace(ch)) {
	              ++index;
	          } else if (isLineTerminator(ch)) {
	              ++index;
	              if (ch === 0x0D && source.charCodeAt(index) === 0x0A) {
	                  ++index;
	              }
	              ++lineNumber;
	              lineStart = index;
	              start = true;
	          } else {
	              break;
	          }
	      }
	  }
	
	  function scanHexEscape(prefix) {
	      var i, len, ch, code = 0;
	
	      len = (prefix === 'u') ? 4 : 2;
	      for (i = 0; i < len; ++i) {
	          if (index < length && isHexDigit(source[index])) {
	              ch = source[index++];
	              code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	          } else {
	              return '';
	          }
	      }
	      return String.fromCharCode(code);
	  }
	
	  function scanUnicodeCodePointEscape() {
	      var ch, code, cu1, cu2;
	
	      ch = source[index];
	      code = 0;
	
	      // At least, one hex digit is required.
	      if (ch === '}') {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      while (index < length) {
	          ch = source[index++];
	          if (!isHexDigit(ch)) {
	              break;
	          }
	          code = code * 16 + '0123456789abcdef'.indexOf(ch.toLowerCase());
	      }
	
	      if (code > 0x10FFFF || ch !== '}') {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      // UTF-16 Encoding
	      if (code <= 0xFFFF) {
	          return String.fromCharCode(code);
	      }
	      cu1 = ((code - 0x10000) >> 10) + 0xD800;
	      cu2 = ((code - 0x10000) & 1023) + 0xDC00;
	      return String.fromCharCode(cu1, cu2);
	  }
	
	  function getEscapedIdentifier() {
	      var ch, id;
	
	      ch = source.charCodeAt(index++);
	      id = String.fromCharCode(ch);
	
	      // '\u' (U+005C, U+0075) denotes an escaped character.
	      if (ch === 0x5C) {
	          if (source.charCodeAt(index) !== 0x75) {
	              throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	          }
	          ++index;
	          ch = scanHexEscape('u');
	          if (!ch || ch === '\\' || !isIdentifierStart(ch.charCodeAt(0))) {
	              throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	          }
	          id = ch;
	      }
	
	      while (index < length) {
	          ch = source.charCodeAt(index);
	          if (!isIdentifierPart(ch)) {
	              break;
	          }
	          ++index;
	          id += String.fromCharCode(ch);
	
	          // '\u' (U+005C, U+0075) denotes an escaped character.
	          if (ch === 0x5C) {
	              id = id.substr(0, id.length - 1);
	              if (source.charCodeAt(index) !== 0x75) {
	                  throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	              }
	              ++index;
	              ch = scanHexEscape('u');
	              if (!ch || ch === '\\' || !isIdentifierPart(ch.charCodeAt(0))) {
	                  throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	              }
	              id += ch;
	          }
	      }
	
	      return id;
	  }
	
	  function getIdentifier() {
	      var start, ch;
	
	      start = index++;
	      while (index < length) {
	          ch = source.charCodeAt(index);
	          if (ch === 0x5C) {
	              // Blackslash (U+005C) marks Unicode escape sequence.
	              index = start;
	              return getEscapedIdentifier();
	          }
	          if (isIdentifierPart(ch)) {
	              ++index;
	          } else {
	              break;
	          }
	      }
	
	      return source.slice(start, index);
	  }
	
	  function scanIdentifier() {
	      var start, id, type;
	
	      start = index;
	
	      // Backslash (U+005C) starts an escaped character.
	      id = (source.charCodeAt(index) === 0x5C) ? getEscapedIdentifier() : getIdentifier();
	
	      // There is no keyword or literal with only one character.
	      // Thus, it must be an identifier.
	      if (id.length === 1) {
	          type = Token.Identifier;
	      } else if (isKeyword(id)) {
	          type = Token.Keyword;
	      } else if (id === 'null') {
	          type = Token.NullLiteral;
	      } else if (id === 'true' || id === 'false') {
	          type = Token.BooleanLiteral;
	      } else {
	          type = Token.Identifier;
	      }
	
	      return {
	          type: type,
	          value: id,
	          lineNumber: lineNumber,
	          lineStart: lineStart,
	          start: start,
	          end: index
	      };
	  }
	
	  // 7.7 Punctuators
	
	  function scanPunctuator() {
	      var start = index,
	          code = source.charCodeAt(index),
	          code2,
	          ch1 = source[index],
	          ch2,
	          ch3,
	          ch4;
	
	      switch (code) {
	
	      // Check for most common single-character punctuators.
	      case 0x2E:  // . dot
	      case 0x28:  // ( open bracket
	      case 0x29:  // ) close bracket
	      case 0x3B:  // ; semicolon
	      case 0x2C:  // , comma
	      case 0x7B:  // { open curly brace
	      case 0x7D:  // } close curly brace
	      case 0x5B:  // [
	      case 0x5D:  // ]
	      case 0x3A:  // :
	      case 0x3F:  // ?
	      case 0x7E:  // ~
	          ++index;
	          if (extra.tokenize) {
	              if (code === 0x28) {
	                  extra.openParenToken = extra.tokens.length;
	              } else if (code === 0x7B) {
	                  extra.openCurlyToken = extra.tokens.length;
	              }
	          }
	          return {
	              type: Token.Punctuator,
	              value: String.fromCharCode(code),
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: start,
	              end: index
	          };
	
	      default:
	          code2 = source.charCodeAt(index + 1);
	
	          // '=' (U+003D) marks an assignment or comparison operator.
	          if (code2 === 0x3D) {
	              switch (code) {
	              case 0x2B:  // +
	              case 0x2D:  // -
	              case 0x2F:  // /
	              case 0x3C:  // <
	              case 0x3E:  // >
	              case 0x5E:  // ^
	              case 0x7C:  // |
	              case 0x25:  // %
	              case 0x26:  // &
	              case 0x2A:  // *
	                  index += 2;
	                  return {
	                      type: Token.Punctuator,
	                      value: String.fromCharCode(code) + String.fromCharCode(code2),
	                      lineNumber: lineNumber,
	                      lineStart: lineStart,
	                      start: start,
	                      end: index
	                  };
	
	              case 0x21: // !
	              case 0x3D: // =
	                  index += 2;
	
	                  // !== and ===
	                  if (source.charCodeAt(index) === 0x3D) {
	                      ++index;
	                  }
	                  return {
	                      type: Token.Punctuator,
	                      value: source.slice(start, index),
	                      lineNumber: lineNumber,
	                      lineStart: lineStart,
	                      start: start,
	                      end: index
	                  };
	              }
	          }
	      }
	
	      // 4-character punctuator: >>>=
	
	      ch4 = source.substr(index, 4);
	
	      if (ch4 === '>>>=') {
	          index += 4;
	          return {
	              type: Token.Punctuator,
	              value: ch4,
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: start,
	              end: index
	          };
	      }
	
	      // 3-character punctuators: === !== >>> <<= >>=
	
	      ch3 = ch4.substr(0, 3);
	
	      if (ch3 === '>>>' || ch3 === '<<=' || ch3 === '>>=') {
	          index += 3;
	          return {
	              type: Token.Punctuator,
	              value: ch3,
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: start,
	              end: index
	          };
	      }
	
	      // Other 2-character punctuators: ++ -- << >> && ||
	      ch2 = ch3.substr(0, 2);
	
	      if ((ch1 === ch2[1] && ('+-<>&|'.indexOf(ch1) >= 0)) || ch2 === '=>') {
	          index += 2;
	          return {
	              type: Token.Punctuator,
	              value: ch2,
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: start,
	              end: index
	          };
	      }
	
	      // 1-character punctuators: < > = ! + - * % & | ^ /
	
	      if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
	          ++index;
	          return {
	              type: Token.Punctuator,
	              value: ch1,
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: start,
	              end: index
	          };
	      }
	
	      throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	  }
	
	  // 7.8.3 Numeric Literals
	
	  function scanHexLiteral(start) {
	      var number = '';
	
	      while (index < length) {
	          if (!isHexDigit(source[index])) {
	              break;
	          }
	          number += source[index++];
	      }
	
	      if (number.length === 0) {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      if (isIdentifierStart(source.charCodeAt(index))) {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      return {
	          type: Token.NumericLiteral,
	          value: parseInt('0x' + number, 16),
	          lineNumber: lineNumber,
	          lineStart: lineStart,
	          start: start,
	          end: index
	      };
	  }
	
	  function scanOctalLiteral(start) {
	      var number = '0' + source[index++];
	      while (index < length) {
	          if (!isOctalDigit(source[index])) {
	              break;
	          }
	          number += source[index++];
	      }
	
	      if (isIdentifierStart(source.charCodeAt(index)) || isDecimalDigit(source.charCodeAt(index))) {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      return {
	          type: Token.NumericLiteral,
	          value: parseInt(number, 8),
	          octal: true,
	          lineNumber: lineNumber,
	          lineStart: lineStart,
	          start: start,
	          end: index
	      };
	  }
	
	  function scanNumericLiteral() {
	      var number, start, ch;
	
	      ch = source[index];
	      assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
	          'Numeric literal must start with a decimal digit or a decimal point');
	
	      start = index;
	      number = '';
	      if (ch !== '.') {
	          number = source[index++];
	          ch = source[index];
	
	          // Hex number starts with '0x'.
	          // Octal number starts with '0'.
	          if (number === '0') {
	              if (ch === 'x' || ch === 'X') {
	                  ++index;
	                  return scanHexLiteral(start);
	              }
	              if (isOctalDigit(ch)) {
	                  return scanOctalLiteral(start);
	              }
	
	              // decimal number starts with '0' such as '09' is illegal.
	              if (ch && isDecimalDigit(ch.charCodeAt(0))) {
	                  throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	              }
	          }
	
	          while (isDecimalDigit(source.charCodeAt(index))) {
	              number += source[index++];
	          }
	          ch = source[index];
	      }
	
	      if (ch === '.') {
	          number += source[index++];
	          while (isDecimalDigit(source.charCodeAt(index))) {
	              number += source[index++];
	          }
	          ch = source[index];
	      }
	
	      if (ch === 'e' || ch === 'E') {
	          number += source[index++];
	
	          ch = source[index];
	          if (ch === '+' || ch === '-') {
	              number += source[index++];
	          }
	          if (isDecimalDigit(source.charCodeAt(index))) {
	              while (isDecimalDigit(source.charCodeAt(index))) {
	                  number += source[index++];
	              }
	          } else {
	              throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	          }
	      }
	
	      if (isIdentifierStart(source.charCodeAt(index))) {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      return {
	          type: Token.NumericLiteral,
	          value: parseFloat(number),
	          lineNumber: lineNumber,
	          lineStart: lineStart,
	          start: start,
	          end: index
	      };
	  }
	
	  // 7.8.4 String Literals
	
	  function scanStringLiteral() {
	      var str = '', quote, start, ch, code, unescaped, restore, octal = false, startLineNumber, startLineStart;
	      startLineNumber = lineNumber;
	      startLineStart = lineStart;
	
	      quote = source[index];
	      assert((quote === '\'' || quote === '"'),
	          'String literal must starts with a quote');
	
	      start = index;
	      ++index;
	
	      while (index < length) {
	          ch = source[index++];
	
	          if (ch === quote) {
	              quote = '';
	              break;
	          } else if (ch === '\\') {
	              ch = source[index++];
	              if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
	                  switch (ch) {
	                  case 'u':
	                  case 'x':
	                      if (source[index] === '{') {
	                          ++index;
	                          str += scanUnicodeCodePointEscape();
	                      } else {
	                          restore = index;
	                          unescaped = scanHexEscape(ch);
	                          if (unescaped) {
	                              str += unescaped;
	                          } else {
	                              index = restore;
	                              str += ch;
	                          }
	                      }
	                      break;
	                  case 'n':
	                      str += '\n';
	                      break;
	                  case 'r':
	                      str += '\r';
	                      break;
	                  case 't':
	                      str += '\t';
	                      break;
	                  case 'b':
	                      str += '\b';
	                      break;
	                  case 'f':
	                      str += '\f';
	                      break;
	                  case 'v':
	                      str += '\x0B';
	                      break;
	
	                  default:
	                      if (isOctalDigit(ch)) {
	                          code = '01234567'.indexOf(ch);
	
	                          // \0 is not octal escape sequence
	                          if (code !== 0) {
	                              octal = true;
	                          }
	
	                          if (index < length && isOctalDigit(source[index])) {
	                              octal = true;
	                              code = code * 8 + '01234567'.indexOf(source[index++]);
	
	                              // 3 digits are only allowed when string starts
	                              // with 0, 1, 2, 3
	                              if ('0123'.indexOf(ch) >= 0 &&
	                                      index < length &&
	                                      isOctalDigit(source[index])) {
	                                  code = code * 8 + '01234567'.indexOf(source[index++]);
	                              }
	                          }
	                          str += String.fromCharCode(code);
	                      } else {
	                          str += ch;
	                      }
	                      break;
	                  }
	              } else {
	                  ++lineNumber;
	                  if (ch ===  '\r' && source[index] === '\n') {
	                      ++index;
	                  }
	                  lineStart = index;
	              }
	          } else if (isLineTerminator(ch.charCodeAt(0))) {
	              break;
	          } else {
	              str += ch;
	          }
	      }
	
	      if (quote !== '') {
	          throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
	      }
	
	      return {
	          type: Token.StringLiteral,
	          value: str,
	          octal: octal,
	          startLineNumber: startLineNumber,
	          startLineStart: startLineStart,
	          lineNumber: lineNumber,
	          lineStart: lineStart,
	          start: start,
	          end: index
	      };
	  }
	
	  function testRegExp(pattern, flags) {
	      var tmp = pattern,
	          value;
	
	      if (flags.indexOf('u') >= 0) {
	          // Replace each astral symbol and every Unicode code point
	          // escape sequence with a single ASCII symbol to avoid throwing on
	          // regular expressions that are only valid in combination with the
	          // `/u` flag.
	          // Note: replacing with the ASCII symbol `x` might cause false
	          // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
	          // perfectly valid pattern that is equivalent to `[a-b]`, but it
	          // would be replaced by `[x-b]` which throws an error.
	          tmp = tmp
	              .replace(/\\u\{([0-9a-fA-F]+)\}/g, function ($0, $1) {
	                  if (parseInt($1, 16) <= 0x10FFFF) {
	                      return 'x';
	                  }
	                  throwError({}, Messages.InvalidRegExp);
	              })
	              .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, 'x');
	      }
	
	      // First, detect invalid regular expressions.
	      try {
	          value = new RegExp(tmp);
	      } catch (e) {
	          throwError({}, Messages.InvalidRegExp);
	      }
	
	      // Return a regular expression object for this pattern-flag pair, or
	      // `null` in case the current environment doesn't support the flags it
	      // uses.
	      try {
	          return new RegExp(pattern, flags);
	      } catch (exception) {
	          return null;
	      }
	  }
	
	  function scanRegExpBody() {
	      var ch, str, classMarker, terminated, body;
	
	      ch = source[index];
	      assert(ch === '/', 'Regular expression literal must start with a slash');
	      str = source[index++];
	
	      classMarker = false;
	      terminated = false;
	      while (index < length) {
	          ch = source[index++];
	          str += ch;
	          if (ch === '\\') {
	              ch = source[index++];
	              // ECMA-262 7.8.5
	              if (isLineTerminator(ch.charCodeAt(0))) {
	                  throwError({}, Messages.UnterminatedRegExp);
	              }
	              str += ch;
	          } else if (isLineTerminator(ch.charCodeAt(0))) {
	              throwError({}, Messages.UnterminatedRegExp);
	          } else if (classMarker) {
	              if (ch === ']') {
	                  classMarker = false;
	              }
	          } else {
	              if (ch === '/') {
	                  terminated = true;
	                  break;
	              } else if (ch === '[') {
	                  classMarker = true;
	              }
	          }
	      }
	
	      if (!terminated) {
	          throwError({}, Messages.UnterminatedRegExp);
	      }
	
	      // Exclude leading and trailing slash.
	      body = str.substr(1, str.length - 2);
	      return {
	          value: body,
	          literal: str
	      };
	  }
	
	  function scanRegExpFlags() {
	      var ch, str, flags, restore;
	
	      str = '';
	      flags = '';
	      while (index < length) {
	          ch = source[index];
	          if (!isIdentifierPart(ch.charCodeAt(0))) {
	              break;
	          }
	
	          ++index;
	          if (ch === '\\' && index < length) {
	              ch = source[index];
	              if (ch === 'u') {
	                  ++index;
	                  restore = index;
	                  ch = scanHexEscape('u');
	                  if (ch) {
	                      flags += ch;
	                      for (str += '\\u'; restore < index; ++restore) {
	                          str += source[restore];
	                      }
	                  } else {
	                      index = restore;
	                      flags += 'u';
	                      str += '\\u';
	                  }
	                  throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	              } else {
	                  str += '\\';
	                  throwErrorTolerant({}, Messages.UnexpectedToken, 'ILLEGAL');
	              }
	          } else {
	              flags += ch;
	              str += ch;
	          }
	      }
	
	      return {
	          value: flags,
	          literal: str
	      };
	  }
	
	  function scanRegExp() {
	      var start, body, flags, value;
	
	      lookahead = null;
	      skipComment();
	      start = index;
	
	      body = scanRegExpBody();
	      flags = scanRegExpFlags();
	      value = testRegExp(body.value, flags.value);
	
	      if (extra.tokenize) {
	          return {
	              type: Token.RegularExpression,
	              value: value,
	              regex: {
	                  pattern: body.value,
	                  flags: flags.value
	              },
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: start,
	              end: index
	          };
	      }
	
	      return {
	          literal: body.literal + flags.literal,
	          value: value,
	          regex: {
	              pattern: body.value,
	              flags: flags.value
	          },
	          start: start,
	          end: index
	      };
	  }
	
	  function collectRegex() {
	      var pos, loc, regex, token;
	
	      skipComment();
	
	      pos = index;
	      loc = {
	          start: {
	              line: lineNumber,
	              column: index - lineStart
	          }
	      };
	
	      regex = scanRegExp();
	
	      loc.end = {
	          line: lineNumber,
	          column: index - lineStart
	      };
	
	      if (!extra.tokenize) {
	          // Pop the previous token, which is likely '/' or '/='
	          if (extra.tokens.length > 0) {
	              token = extra.tokens[extra.tokens.length - 1];
	              if (token.range[0] === pos && token.type === 'Punctuator') {
	                  if (token.value === '/' || token.value === '/=') {
	                      extra.tokens.pop();
	                  }
	              }
	          }
	
	          extra.tokens.push({
	              type: 'RegularExpression',
	              value: regex.literal,
	              regex: regex.regex,
	              range: [pos, index],
	              loc: loc
	          });
	      }
	
	      return regex;
	  }
	
	  function isIdentifierName(token) {
	      return token.type === Token.Identifier ||
	          token.type === Token.Keyword ||
	          token.type === Token.BooleanLiteral ||
	          token.type === Token.NullLiteral;
	  }
	
	  function advanceSlash() {
	      var prevToken,
	          checkToken;
	      // Using the following algorithm:
	      // https://github.com/mozilla/sweet.js/wiki/design
	      prevToken = extra.tokens[extra.tokens.length - 1];
	      if (!prevToken) {
	          // Nothing before that: it cannot be a division.
	          return collectRegex();
	      }
	      if (prevToken.type === 'Punctuator') {
	          if (prevToken.value === ']') {
	              return scanPunctuator();
	          }
	          if (prevToken.value === ')') {
	              checkToken = extra.tokens[extra.openParenToken - 1];
	              if (checkToken &&
	                      checkToken.type === 'Keyword' &&
	                      (checkToken.value === 'if' ||
	                       checkToken.value === 'while' ||
	                       checkToken.value === 'for' ||
	                       checkToken.value === 'with')) {
	                  return collectRegex();
	              }
	              return scanPunctuator();
	          }
	          if (prevToken.value === '}') {
	              // Dividing a function by anything makes little sense,
	              // but we have to check for that.
	              if (extra.tokens[extra.openCurlyToken - 3] &&
	                      extra.tokens[extra.openCurlyToken - 3].type === 'Keyword') {
	                  // Anonymous function.
	                  checkToken = extra.tokens[extra.openCurlyToken - 4];
	                  if (!checkToken) {
	                      return scanPunctuator();
	                  }
	              } else if (extra.tokens[extra.openCurlyToken - 4] &&
	                      extra.tokens[extra.openCurlyToken - 4].type === 'Keyword') {
	                  // Named function.
	                  checkToken = extra.tokens[extra.openCurlyToken - 5];
	                  if (!checkToken) {
	                      return collectRegex();
	                  }
	              } else {
	                  return scanPunctuator();
	              }
	              return scanPunctuator();
	          }
	          return collectRegex();
	      }
	      if (prevToken.type === 'Keyword' && prevToken.value !== 'this') {
	          return collectRegex();
	      }
	      return scanPunctuator();
	  }
	
	  function advance() {
	      var ch;
	
	      skipComment();
	
	      if (index >= length) {
	          return {
	              type: Token.EOF,
	              lineNumber: lineNumber,
	              lineStart: lineStart,
	              start: index,
	              end: index
	          };
	      }
	
	      ch = source.charCodeAt(index);
	
	      if (isIdentifierStart(ch)) {
	          return scanIdentifier();
	      }
	
	      // Very common: ( and ) and ;
	      if (ch === 0x28 || ch === 0x29 || ch === 0x3B) {
	          return scanPunctuator();
	      }
	
	      // String literal starts with single quote (U+0027) or double quote (U+0022).
	      if (ch === 0x27 || ch === 0x22) {
	          return scanStringLiteral();
	      }
	
	
	      // Dot (.) U+002E can also start a floating-point number, hence the need
	      // to check the next character.
	      if (ch === 0x2E) {
	          if (isDecimalDigit(source.charCodeAt(index + 1))) {
	              return scanNumericLiteral();
	          }
	          return scanPunctuator();
	      }
	
	      if (isDecimalDigit(ch)) {
	          return scanNumericLiteral();
	      }
	
	      // Slash (/) U+002F can also start a regex.
	      if (extra.tokenize && ch === 0x2F) {
	          return advanceSlash();
	      }
	
	      return scanPunctuator();
	  }
	
	  function collectToken() {
	      var loc, token, value, entry;
	
	      skipComment();
	      loc = {
	          start: {
	              line: lineNumber,
	              column: index - lineStart
	          }
	      };
	
	      token = advance();
	      loc.end = {
	          line: lineNumber,
	          column: index - lineStart
	      };
	
	      if (token.type !== Token.EOF) {
	          value = source.slice(token.start, token.end);
	          entry = {
	              type: TokenName[token.type],
	              value: value,
	              range: [token.start, token.end],
	              loc: loc
	          };
	          if (token.regex) {
	              entry.regex = {
	                  pattern: token.regex.pattern,
	                  flags: token.regex.flags
	              };
	          }
	          extra.tokens.push(entry);
	      }
	
	      return token;
	  }
	
	  function lex() {
	      var token;
	
	      token = lookahead;
	      index = token.end;
	      lineNumber = token.lineNumber;
	      lineStart = token.lineStart;
	
	      lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
	
	      index = token.end;
	      lineNumber = token.lineNumber;
	      lineStart = token.lineStart;
	
	      return token;
	  }
	
	  function peek() {
	      var pos, line, start;
	
	      pos = index;
	      line = lineNumber;
	      start = lineStart;
	      lookahead = (typeof extra.tokens !== 'undefined') ? collectToken() : advance();
	      index = pos;
	      lineNumber = line;
	      lineStart = start;
	  }
	
	  function Position() {
	      this.line = lineNumber;
	      this.column = index - lineStart;
	  }
	
	  function SourceLocation() {
	      this.start = new Position();
	      this.end = null;
	  }
	
	  function WrappingSourceLocation(startToken) {
	      if (startToken.type === Token.StringLiteral) {
	          this.start = {
	              line: startToken.startLineNumber,
	              column: startToken.start - startToken.startLineStart
	          };
	      } else {
	          this.start = {
	              line: startToken.lineNumber,
	              column: startToken.start - startToken.lineStart
	          };
	      }
	      this.end = null;
	  }
	
	  function Node() {
	      // Skip comment.
	      index = lookahead.start;
	      if (lookahead.type === Token.StringLiteral) {
	          lineNumber = lookahead.startLineNumber;
	          lineStart = lookahead.startLineStart;
	      } else {
	          lineNumber = lookahead.lineNumber;
	          lineStart = lookahead.lineStart;
	      }
	      if (extra.range) {
	          this.range = [index, 0];
	      }
	      if (extra.loc) {
	          this.loc = new SourceLocation();
	      }
	  }
	
	  function WrappingNode(startToken) {
	      if (extra.range) {
	          this.range = [startToken.start, 0];
	      }
	      if (extra.loc) {
	          this.loc = new WrappingSourceLocation(startToken);
	      }
	  }
	
	  WrappingNode.prototype = Node.prototype = {
	
	      finish: function () {
	          if (extra.range) {
	              this.range[1] = index;
	          }
	          if (extra.loc) {
	              this.loc.end = new Position();
	              if (extra.source) {
	                  this.loc.source = extra.source;
	              }
	          }
	      },
	
	      finishArrayExpression: function (elements) {
	          this.type = Syntax.ArrayExpression;
	          this.elements = elements;
	          this.finish();
	          return this;
	      },
	
	      finishAssignmentExpression: function (operator, left, right) {
	          this.type = Syntax.AssignmentExpression;
	          this.operator = operator;
	          this.left = left;
	          this.right = right;
	          this.finish();
	          return this;
	      },
	
	      finishBinaryExpression: function (operator, left, right) {
	          this.type = (operator === '||' || operator === '&&') ? Syntax.LogicalExpression : Syntax.BinaryExpression;
	          this.operator = operator;
	          this.left = left;
	          this.right = right;
	          this.finish();
	          return this;
	      },
	
	      finishCallExpression: function (callee, args) {
	          this.type = Syntax.CallExpression;
	          this.callee = callee;
	          this.arguments = args;
	          this.finish();
	          return this;
	      },
	
	      finishConditionalExpression: function (test, consequent, alternate) {
	          this.type = Syntax.ConditionalExpression;
	          this.test = test;
	          this.consequent = consequent;
	          this.alternate = alternate;
	          this.finish();
	          return this;
	      },
	
	      finishExpressionStatement: function (expression) {
	          this.type = Syntax.ExpressionStatement;
	          this.expression = expression;
	          this.finish();
	          return this;
	      },
	
	      finishIdentifier: function (name) {
	          this.type = Syntax.Identifier;
	          this.name = name;
	          this.finish();
	          return this;
	      },
	
	      finishLiteral: function (token) {
	          this.type = Syntax.Literal;
	          this.value = token.value;
	          this.raw = source.slice(token.start, token.end);
	          if (token.regex) {
	              if (this.raw == '//') {
	                this.raw = '/(?:)/';
	              }
	              this.regex = token.regex;
	          }
	          this.finish();
	          return this;
	      },
	
	      finishMemberExpression: function (accessor, object, property) {
	          this.type = Syntax.MemberExpression;
	          this.computed = accessor === '[';
	          this.object = object;
	          this.property = property;
	          this.finish();
	          return this;
	      },
	
	      finishObjectExpression: function (properties) {
	          this.type = Syntax.ObjectExpression;
	          this.properties = properties;
	          this.finish();
	          return this;
	      },
	
	      finishProgram: function (body) {
	          this.type = Syntax.Program;
	          this.body = body;
	          this.finish();
	          return this;
	      },
	
	      finishProperty: function (kind, key, value) {
	          this.type = Syntax.Property;
	          this.key = key;
	          this.value = value;
	          this.kind = kind;
	          this.finish();
	          return this;
	      },
	
	      finishUnaryExpression: function (operator, argument) {
	          this.type = Syntax.UnaryExpression;
	          this.operator = operator;
	          this.argument = argument;
	          this.prefix = true;
	          this.finish();
	          return this;
	      }
	  };
	
	  // Return true if there is a line terminator before the next token.
	
	  function peekLineTerminator() {
	      var pos, line, start, found;
	
	      pos = index;
	      line = lineNumber;
	      start = lineStart;
	      skipComment();
	      found = lineNumber !== line;
	      index = pos;
	      lineNumber = line;
	      lineStart = start;
	
	      return found;
	  }
	
	  // Throw an exception
	
	  function throwError(token, messageFormat) {
	      var error,
	          args = Array.prototype.slice.call(arguments, 2),
	          msg = messageFormat.replace(
	              /%(\d)/g,
	              function (whole, index) {
	                  assert(index < args.length, 'Message reference must be in range');
	                  return args[index];
	              }
	          );
	
	      if (typeof token.lineNumber === 'number') {
	          error = new Error('Line ' + token.lineNumber + ': ' + msg);
	          error.index = token.start;
	          error.lineNumber = token.lineNumber;
	          error.column = token.start - lineStart + 1;
	      } else {
	          error = new Error('Line ' + lineNumber + ': ' + msg);
	          error.index = index;
	          error.lineNumber = lineNumber;
	          error.column = index - lineStart + 1;
	      }
	
	      error.description = msg;
	      throw error;
	  }
	
	  function throwErrorTolerant() {
	      try {
	          throwError.apply(null, arguments);
	      } catch (e) {
	          if (extra.errors) {
	              extra.errors.push(e);
	          } else {
	              throw e;
	          }
	      }
	  }
	
	
	  // Throw an exception because of the token.
	
	  function throwUnexpected(token) {
	      if (token.type === Token.EOF) {
	          throwError(token, Messages.UnexpectedEOS);
	      }
	
	      if (token.type === Token.NumericLiteral) {
	          throwError(token, Messages.UnexpectedNumber);
	      }
	
	      if (token.type === Token.StringLiteral) {
	          throwError(token, Messages.UnexpectedString);
	      }
	
	      if (token.type === Token.Identifier) {
	          throwError(token, Messages.UnexpectedIdentifier);
	      }
	
	      if (token.type === Token.Keyword) {
	          if (isFutureReservedWord(token.value)) {
	              throwError(token, Messages.UnexpectedReserved);
	          } else if (strict && isStrictModeReservedWord(token.value)) {
	              throwErrorTolerant(token, Messages.StrictReservedWord);
	              return;
	          }
	          throwError(token, Messages.UnexpectedToken, token.value);
	      }
	
	      // BooleanLiteral, NullLiteral, or Punctuator.
	      throwError(token, Messages.UnexpectedToken, token.value);
	  }
	
	  // Expect the next token to match the specified punctuator.
	  // If not, an exception will be thrown.
	
	  function expect(value) {
	      var token = lex();
	      if (token.type !== Token.Punctuator || token.value !== value) {
	          throwUnexpected(token);
	      }
	  }
	
	  /**
	   * @name expectTolerant
	   * @description Quietly expect the given token value when in tolerant mode, otherwise delegates
	   * to <code>expect(value)</code>
	   * @param {String} value The value we are expecting the lookahead token to have
	   * @since 2.0
	   */
	  function expectTolerant(value) {
	      if (extra.errors) {
	          var token = lookahead;
	          if (token.type !== Token.Punctuator && token.value !== value) {
	              throwErrorTolerant(token, Messages.UnexpectedToken, token.value);
	          } else {
	              lex();
	          }
	      } else {
	          expect(value);
	      }
	  }
	
	  // Return true if the next token matches the specified punctuator.
	
	  function match(value) {
	      return lookahead.type === Token.Punctuator && lookahead.value === value;
	  }
	
	  // Return true if the next token matches the specified keyword
	
	  function matchKeyword(keyword) {
	      return lookahead.type === Token.Keyword && lookahead.value === keyword;
	  }
	
	  function consumeSemicolon() {
	      var line;
	
	      // Catch the very common case first: immediately a semicolon (U+003B).
	      if (source.charCodeAt(index) === 0x3B || match(';')) {
	          lex();
	          return;
	      }
	
	      line = lineNumber;
	      skipComment();
	      if (lineNumber !== line) {
	          return;
	      }
	
	      if (lookahead.type !== Token.EOF && !match('}')) {
	          throwUnexpected(lookahead);
	      }
	  }
	
	  // 11.1.4 Array Initialiser
	
	  function parseArrayInitialiser() {
	      var elements = [], node = new Node();
	
	      expect('[');
	
	      while (!match(']')) {
	          if (match(',')) {
	              lex();
	              elements.push(null);
	          } else {
	              elements.push(parseAssignmentExpression());
	
	              if (!match(']')) {
	                  expect(',');
	              }
	          }
	      }
	
	      lex();
	
	      return node.finishArrayExpression(elements);
	  }
	
	  // 11.1.5 Object Initialiser
	
	  function parseObjectPropertyKey() {
	      var token, node = new Node();
	
	      token = lex();
	
	      // Note: This function is called only from parseObjectProperty(), where
	      // EOF and Punctuator tokens are already filtered out.
	
	      if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
	          if (strict && token.octal) {
	              throwErrorTolerant(token, Messages.StrictOctalLiteral);
	          }
	          return node.finishLiteral(token);
	      }
	
	      return node.finishIdentifier(token.value);
	  }
	
	  function parseObjectProperty() {
	      var token, key, id, value, node = new Node();
	
	      token = lookahead;
	
	      if (token.type === Token.Identifier) {
	          id = parseObjectPropertyKey();
	          expect(':');
	          value = parseAssignmentExpression();
	          return node.finishProperty('init', id, value);
	      }
	      if (token.type === Token.EOF || token.type === Token.Punctuator) {
	          throwUnexpected(token);
	      } else {
	          key = parseObjectPropertyKey();
	          expect(':');
	          value = parseAssignmentExpression();
	          return node.finishProperty('init', key, value);
	      }
	  }
	
	  function parseObjectInitialiser() {
	      var properties = [], property, name, key, kind, map = {}, toString = String, node = new Node();
	
	      expect('{');
	
	      while (!match('}')) {
	          property = parseObjectProperty();
	
	          if (property.key.type === Syntax.Identifier) {
	              name = property.key.name;
	          } else {
	              name = toString(property.key.value);
	          }
	          kind = (property.kind === 'init') ? PropertyKind.Data : (property.kind === 'get') ? PropertyKind.Get : PropertyKind.Set;
	
	          key = '$' + name;
	          if (Object.prototype.hasOwnProperty.call(map, key)) {
	              if (map[key] === PropertyKind.Data) {
	                  if (strict && kind === PropertyKind.Data) {
	                      throwErrorTolerant({}, Messages.StrictDuplicateProperty);
	                  } else if (kind !== PropertyKind.Data) {
	                      throwErrorTolerant({}, Messages.AccessorDataProperty);
	                  }
	              } else {
	                  if (kind === PropertyKind.Data) {
	                      throwErrorTolerant({}, Messages.AccessorDataProperty);
	                  } else if (map[key] & kind) {
	                      throwErrorTolerant({}, Messages.AccessorGetSet);
	                  }
	              }
	              map[key] |= kind;
	          } else {
	              map[key] = kind;
	          }
	
	          properties.push(property);
	
	          if (!match('}')) {
	              expectTolerant(',');
	          }
	      }
	
	      expect('}');
	
	      return node.finishObjectExpression(properties);
	  }
	
	  // 11.1.6 The Grouping Operator
	
	  function parseGroupExpression() {
	      var expr;
	
	      expect('(');
	
	      ++state.parenthesisCount;
	
	      expr = parseExpression();
	
	      expect(')');
	
	      return expr;
	  }
	
	
	  // 11.1 Primary Expressions
	
	  var legalKeywords = {"if":1, "this":1};
	
	  function parsePrimaryExpression() {
	      var type, token, expr, node;
	
	      if (match('(')) {
	          return parseGroupExpression();
	      }
	
	      if (match('[')) {
	          return parseArrayInitialiser();
	      }
	
	      if (match('{')) {
	          return parseObjectInitialiser();
	      }
	
	      type = lookahead.type;
	      node = new Node();
	
	      if (type === Token.Identifier || legalKeywords[lookahead.value]) {
	          expr = node.finishIdentifier(lex().value);
	      } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
	          if (strict && lookahead.octal) {
	              throwErrorTolerant(lookahead, Messages.StrictOctalLiteral);
	          }
	          expr = node.finishLiteral(lex());
	      } else if (type === Token.Keyword) {
	          throw new Error("Disabled.");
	      } else if (type === Token.BooleanLiteral) {
	          token = lex();
	          token.value = (token.value === 'true');
	          expr = node.finishLiteral(token);
	      } else if (type === Token.NullLiteral) {
	          token = lex();
	          token.value = null;
	          expr = node.finishLiteral(token);
	      } else if (match('/') || match('/=')) {
	          if (typeof extra.tokens !== 'undefined') {
	              expr = node.finishLiteral(collectRegex());
	          } else {
	              expr = node.finishLiteral(scanRegExp());
	          }
	          peek();
	      } else {
	          throwUnexpected(lex());
	      }
	
	      return expr;
	  }
	
	  // 11.2 Left-Hand-Side Expressions
	
	  function parseArguments() {
	      var args = [];
	
	      expect('(');
	
	      if (!match(')')) {
	          while (index < length) {
	              args.push(parseAssignmentExpression());
	              if (match(')')) {
	                  break;
	              }
	              expectTolerant(',');
	          }
	      }
	
	      expect(')');
	
	      return args;
	  }
	
	  function parseNonComputedProperty() {
	      var token, node = new Node();
	
	      token = lex();
	
	      if (!isIdentifierName(token)) {
	          throwUnexpected(token);
	      }
	
	      return node.finishIdentifier(token.value);
	  }
	
	  function parseNonComputedMember() {
	      expect('.');
	
	      return parseNonComputedProperty();
	  }
	
	  function parseComputedMember() {
	      var expr;
	
	      expect('[');
	
	      expr = parseExpression();
	
	      expect(']');
	
	      return expr;
	  }
	
	  function parseLeftHandSideExpressionAllowCall() {
	      var expr, args, property, startToken, previousAllowIn = state.allowIn;
	
	      startToken = lookahead;
	      state.allowIn = true;
	      expr = parsePrimaryExpression();
	
	      for (;;) {
	          if (match('.')) {
	              property = parseNonComputedMember();
	              expr = new WrappingNode(startToken).finishMemberExpression('.', expr, property);
	          } else if (match('(')) {
	              args = parseArguments();
	              expr = new WrappingNode(startToken).finishCallExpression(expr, args);
	          } else if (match('[')) {
	              property = parseComputedMember();
	              expr = new WrappingNode(startToken).finishMemberExpression('[', expr, property);
	          } else {
	              break;
	          }
	      }
	      state.allowIn = previousAllowIn;
	
	      return expr;
	  }
	
	  // 11.3 Postfix Expressions
	
	  function parsePostfixExpression() {
	      var expr = parseLeftHandSideExpressionAllowCall();
	
	      if (lookahead.type === Token.Punctuator) {
	          if ((match('++') || match('--')) && !peekLineTerminator()) {
	              throw new Error("Disabled.");
	          }
	      }
	
	      return expr;
	  }
	
	  // 11.4 Unary Operators
	
	  function parseUnaryExpression() {
	      var token, expr, startToken;
	
	      if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
	          expr = parsePostfixExpression();
	      } else if (match('++') || match('--')) {
	          throw new Error("Disabled.");
	      } else if (match('+') || match('-') || match('~') || match('!')) {
	          startToken = lookahead;
	          token = lex();
	          expr = parseUnaryExpression();
	          expr = new WrappingNode(startToken).finishUnaryExpression(token.value, expr);
	      } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
	          throw new Error("Disabled.");
	      } else {
	          expr = parsePostfixExpression();
	      }
	
	      return expr;
	  }
	
	  function binaryPrecedence(token, allowIn) {
	      var prec = 0;
	
	      if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
	          return 0;
	      }
	
	      switch (token.value) {
	      case '||':
	          prec = 1;
	          break;
	
	      case '&&':
	          prec = 2;
	          break;
	
	      case '|':
	          prec = 3;
	          break;
	
	      case '^':
	          prec = 4;
	          break;
	
	      case '&':
	          prec = 5;
	          break;
	
	      case '==':
	      case '!=':
	      case '===':
	      case '!==':
	          prec = 6;
	          break;
	
	      case '<':
	      case '>':
	      case '<=':
	      case '>=':
	      case 'instanceof':
	          prec = 7;
	          break;
	
	      case 'in':
	          prec = allowIn ? 7 : 0;
	          break;
	
	      case '<<':
	      case '>>':
	      case '>>>':
	          prec = 8;
	          break;
	
	      case '+':
	      case '-':
	          prec = 9;
	          break;
	
	      case '*':
	      case '/':
	      case '%':
	          prec = 11;
	          break;
	
	      default:
	          break;
	      }
	
	      return prec;
	  }
	
	  // 11.5 Multiplicative Operators
	  // 11.6 Additive Operators
	  // 11.7 Bitwise Shift Operators
	  // 11.8 Relational Operators
	  // 11.9 Equality Operators
	  // 11.10 Binary Bitwise Operators
	  // 11.11 Binary Logical Operators
	
	  function parseBinaryExpression() {
	      var marker, markers, expr, token, prec, stack, right, operator, left, i;
	
	      marker = lookahead;
	      left = parseUnaryExpression();
	
	      token = lookahead;
	      prec = binaryPrecedence(token, state.allowIn);
	      if (prec === 0) {
	          return left;
	      }
	      token.prec = prec;
	      lex();
	
	      markers = [marker, lookahead];
	      right = parseUnaryExpression();
	
	      stack = [left, token, right];
	
	      while ((prec = binaryPrecedence(lookahead, state.allowIn)) > 0) {
	
	          // Reduce: make a binary expression from the three topmost entries.
	          while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
	              right = stack.pop();
	              operator = stack.pop().value;
	              left = stack.pop();
	              markers.pop();
	              expr = new WrappingNode(markers[markers.length - 1]).finishBinaryExpression(operator, left, right);
	              stack.push(expr);
	          }
	
	          // Shift.
	          token = lex();
	          token.prec = prec;
	          stack.push(token);
	          markers.push(lookahead);
	          expr = parseUnaryExpression();
	          stack.push(expr);
	      }
	
	      // Final reduce to clean-up the stack.
	      i = stack.length - 1;
	      expr = stack[i];
	      markers.pop();
	      while (i > 1) {
	          expr = new WrappingNode(markers.pop()).finishBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
	          i -= 2;
	      }
	
	      return expr;
	  }
	
	  // 11.12 Conditional Operator
	
	  function parseConditionalExpression() {
	      var expr, previousAllowIn, consequent, alternate, startToken;
	
	      startToken = lookahead;
	
	      expr = parseBinaryExpression();
	
	      if (match('?')) {
	          lex();
	          previousAllowIn = state.allowIn;
	          state.allowIn = true;
	          consequent = parseAssignmentExpression();
	          state.allowIn = previousAllowIn;
	          expect(':');
	          alternate = parseAssignmentExpression();
	
	          expr = new WrappingNode(startToken).finishConditionalExpression(expr, consequent, alternate);
	      }
	
	      return expr;
	  }
	
	  // 11.13 Assignment Operators
	
	  function parseAssignmentExpression() {
	      var oldParenthesisCount, token, expr, startToken;
	
	      oldParenthesisCount = state.parenthesisCount;
	
	      startToken = lookahead;
	      token = lookahead;
	
	      expr = parseConditionalExpression();
	
	      return expr;
	  }
	
	  // 11.14 Comma Operator
	
	  function parseExpression() {
	      var expr = parseAssignmentExpression();
	
	      if (match(',')) {
	          throw new Error("Disabled."); // no sequence expressions
	      }
	
	      return expr;
	  }
	
	  // 12.4 Expression Statement
	
	  function parseExpressionStatement(node) {
	      var expr = parseExpression();
	      consumeSemicolon();
	      return node.finishExpressionStatement(expr);
	  }
	
	  // 12 Statements
	
	  function parseStatement() {
	      var type = lookahead.type,
	          expr,
	          node;
	
	      if (type === Token.EOF) {
	          throwUnexpected(lookahead);
	      }
	
	      if (type === Token.Punctuator && lookahead.value === '{') {
	          throw new Error("Disabled."); // block statement
	      }
	
	      node = new Node();
	
	      if (type === Token.Punctuator) {
	          switch (lookahead.value) {
	          case ';':
	              throw new Error("Disabled."); // empty statement
	          case '(':
	              return parseExpressionStatement(node);
	          default:
	              break;
	          }
	      } else if (type === Token.Keyword) {
	          throw new Error("Disabled."); // keyword
	      }
	
	      expr = parseExpression();
	      consumeSemicolon();
	      return node.finishExpressionStatement(expr);
	  }
	
	  // 14 Program
	
	  function parseSourceElement() {
	      if (lookahead.type === Token.Keyword) {
	          switch (lookahead.value) {
	          case 'const':
	          case 'let':
	              throw new Error("Disabled.");
	          case 'function':
	              throw new Error("Disabled.");
	          default:
	              return parseStatement();
	          }
	      }
	
	      if (lookahead.type !== Token.EOF) {
	          return parseStatement();
	      }
	  }
	
	  function parseSourceElements() {
	      var sourceElement, sourceElements = [], token, directive, firstRestricted;
	
	      while (index < length) {
	          token = lookahead;
	          if (token.type !== Token.StringLiteral) {
	              break;
	          }
	
	          sourceElement = parseSourceElement();
	          sourceElements.push(sourceElement);
	          if (sourceElement.expression.type !== Syntax.Literal) {
	              // this is not directive
	              break;
	          }
	          directive = source.slice(token.start + 1, token.end - 1);
	          if (directive === 'use strict') {
	              strict = true;
	              if (firstRestricted) {
	                  throwErrorTolerant(firstRestricted, Messages.StrictOctalLiteral);
	              }
	          } else {
	              if (!firstRestricted && token.octal) {
	                  firstRestricted = token;
	              }
	          }
	      }
	
	      while (index < length) {
	          sourceElement = parseSourceElement();
	          if (typeof sourceElement === 'undefined') {
	              break;
	          }
	          sourceElements.push(sourceElement);
	      }
	      return sourceElements;
	  }
	
	  function parseProgram() {
	      var body, node;
	
	      skipComment();
	      peek();
	      node = new Node();
	      strict = true; // assume strict
	
	      body = parseSourceElements();
	      return node.finishProgram(body);
	  }
	
	  function filterTokenLocation() {
	      var i, entry, token, tokens = [];
	
	      for (i = 0; i < extra.tokens.length; ++i) {
	          entry = extra.tokens[i];
	          token = {
	              type: entry.type,
	              value: entry.value
	          };
	          if (entry.regex) {
	              token.regex = {
	                  pattern: entry.regex.pattern,
	                  flags: entry.regex.flags
	              };
	          }
	          if (extra.range) {
	              token.range = entry.range;
	          }
	          if (extra.loc) {
	              token.loc = entry.loc;
	          }
	          tokens.push(token);
	      }
	
	      extra.tokens = tokens;
	  }
	
	  function tokenize(code, options) {
	      var toString,
	          tokens;
	
	      toString = String;
	      if (typeof code !== 'string' && !(code instanceof String)) {
	          code = toString(code);
	      }
	
	      source = code;
	      index = 0;
	      lineNumber = (source.length > 0) ? 1 : 0;
	      lineStart = 0;
	      length = source.length;
	      lookahead = null;
	      state = {
	          allowIn: true,
	          labelSet: {},
	          inFunctionBody: false,
	          inIteration: false,
	          inSwitch: false,
	          lastCommentStart: -1
	      };
	
	      extra = {};
	
	      // Options matching.
	      options = options || {};
	
	      // Of course we collect tokens here.
	      options.tokens = true;
	      extra.tokens = [];
	      extra.tokenize = true;
	      // The following two fields are necessary to compute the Regex tokens.
	      extra.openParenToken = -1;
	      extra.openCurlyToken = -1;
	
	      extra.range = (typeof options.range === 'boolean') && options.range;
	      extra.loc = (typeof options.loc === 'boolean') && options.loc;
	
	      if (typeof options.tolerant === 'boolean' && options.tolerant) {
	          extra.errors = [];
	      }
	
	      try {
	          peek();
	          if (lookahead.type === Token.EOF) {
	              return extra.tokens;
	          }
	
	          lex();
	          while (lookahead.type !== Token.EOF) {
	              try {
	                  lex();
	              } catch (lexError) {
	                  if (extra.errors) {
	                      extra.errors.push(lexError);
	                      // We have to break on the first error
	                      // to avoid infinite loops.
	                      break;
	                  } else {
	                      throw lexError;
	                  }
	              }
	          }
	
	          filterTokenLocation();
	          tokens = extra.tokens;
	          if (typeof extra.errors !== 'undefined') {
	              tokens.errors = extra.errors;
	          }
	      } catch (e) {
	          throw e;
	      } finally {
	          extra = {};
	      }
	      return tokens;
	  }
	
	  function parse(code, options) {
	      var program, toString;
	
	      toString = String;
	      if (typeof code !== 'string' && !(code instanceof String)) {
	          code = toString(code);
	      }
	
	      source = code;
	      index = 0;
	      lineNumber = (source.length > 0) ? 1 : 0;
	      lineStart = 0;
	      length = source.length;
	      lookahead = null;
	      state = {
	          allowIn: true,
	          labelSet: {},
	          parenthesisCount: 0,
	          inFunctionBody: false,
	          inIteration: false,
	          inSwitch: false,
	          lastCommentStart: -1
	      };
	
	      extra = {};
	      if (typeof options !== 'undefined') {
	          extra.range = (typeof options.range === 'boolean') && options.range;
	          extra.loc = (typeof options.loc === 'boolean') && options.loc;
	
	          if (extra.loc && options.source !== null && options.source !== undefined) {
	              extra.source = toString(options.source);
	          }
	
	          if (typeof options.tokens === 'boolean' && options.tokens) {
	              extra.tokens = [];
	          }
	          if (typeof options.tolerant === 'boolean' && options.tolerant) {
	              extra.errors = [];
	          }
	      }
	
	      try {
	          program = parseProgram();
	          if (typeof extra.tokens !== 'undefined') {
	              filterTokenLocation();
	              program.tokens = extra.tokens;
	          }
	          if (typeof extra.errors !== 'undefined') {
	              program.errors = extra.errors;
	          }
	      } catch (e) {
	          throw e;
	      } finally {
	          extra = {};
	      }
	
	      return program;
	  }
	
	  return {
	    tokenize: tokenize,
	    parse: parse
	  };
	
	})();

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	function toMap(list) {
	  var map = {}, i, n;
	  for (i=0, n=list.length; i<n; ++i) map[list[i]] = 1;
	  return map;
	}
	
	function keys(object) {
	  var list = [], k;
	  for (k in object) list.push(k);
	  return list;
	}
	
	module.exports = function(opt) {
	  opt = opt || {};
	  var constants = opt.constants || __webpack_require__(146),
	      functions = (opt.functions || __webpack_require__(147))(codegen),
	      functionDefs = opt.functionDefs ? opt.functionDefs(codegen) : {},
	      idWhiteList = opt.idWhiteList ? toMap(opt.idWhiteList) : null,
	      idBlackList = opt.idBlackList ? toMap(opt.idBlackList) : null,
	      memberDepth = 0,
	      FIELD_VAR = opt.fieldVar || 'datum',
	      GLOBAL_VAR = opt.globalVar || 'signals',
	      globals = {},
	      fields = {},
	      dataSources = {};
	
	  function codegen_wrap(ast) {
	    var retval = {
	      code: codegen(ast),
	      globals: keys(globals),
	      fields: keys(fields),
	      dataSources: keys(dataSources),
	      defs: functionDefs
	    };
	    globals = {};
	    fields = {};
	    dataSources = {};
	    return retval;
	  }
	
	  /* istanbul ignore next */
	  var lookupGlobal = typeof GLOBAL_VAR === 'function' ? GLOBAL_VAR :
	    function (id) {
	      return GLOBAL_VAR + '["' + id + '"]';
	    };
	
	  function codegen(ast) {
	    if (typeof ast === 'string') return ast;
	    var generator = CODEGEN_TYPES[ast.type];
	    if (generator == null) {
	      throw new Error('Unsupported type: ' + ast.type);
	    }
	    return generator(ast);
	  }
	
	  var CODEGEN_TYPES = {
	    'Literal': function(n) {
	        return n.raw;
	      },
	    'Identifier': function(n) {
	        var id = n.name;
	        if (memberDepth > 0) {
	          return id;
	        }
	        if (constants.hasOwnProperty(id)) {
	          return constants[id];
	        }
	        if (idWhiteList) {
	          if (idWhiteList.hasOwnProperty(id)) {
	            return id;
	          } else {
	            globals[id] = 1;
	            return lookupGlobal(id);
	          }
	        }
	        if (idBlackList && idBlackList.hasOwnProperty(id)) {
	          throw new Error('Illegal identifier: ' + id);
	        }
	        return id;
	      },
	    'Program': function(n) {
	        return n.body.map(codegen).join('\n');
	      },
	    'MemberExpression': function(n) {
	        var d = !n.computed;
	        var o = codegen(n.object);
	        if (d) memberDepth += 1;
	        var p = codegen(n.property);
	        if (o === FIELD_VAR) { fields[p] = 1; } // HACKish...
	        if (d) memberDepth -= 1;
	        return o + (d ? '.'+p : '['+p+']');
	      },
	    'CallExpression': function(n) {
	        if (n.callee.type !== 'Identifier') {
	          throw new Error('Illegal callee type: ' + n.callee.type);
	        }
	        var callee = n.callee.name;
	        var args = n.arguments;
	        var fn = functions.hasOwnProperty(callee) && functions[callee];
	        if (!fn) throw new Error('Unrecognized function: ' + callee);
	        return fn instanceof Function ?
	          fn(args, globals, fields, dataSources) :
	          fn + '(' + args.map(codegen).join(',') + ')';
	      },
	    'ArrayExpression': function(n) {
	        return '[' + n.elements.map(codegen).join(',') + ']';
	      },
	    'BinaryExpression': function(n) {
	        return '(' + codegen(n.left) + n.operator + codegen(n.right) + ')';
	      },
	    'UnaryExpression': function(n) {
	        return '(' + n.operator + codegen(n.argument) + ')';
	      },
	    'ConditionalExpression': function(n) {
	        return '(' + codegen(n.test) +
	          '?' + codegen(n.consequent) +
	          ':' + codegen(n.alternate) +
	          ')';
	      },
	    'LogicalExpression': function(n) {
	        return '(' + codegen(n.left) + n.operator + codegen(n.right) + ')';
	      },
	    'ObjectExpression': function(n) {
	        return '{' + n.properties.map(codegen).join(',') + '}';
	      },
	    'Property': function(n) {
	        memberDepth += 1;
	        var k = codegen(n.key);
	        memberDepth -= 1;
	        return k + ':' + codegen(n.value);
	      },
	    'ExpressionStatement': function(n) {
	        return codegen(n.expression);
	      }
	  };
	
	  codegen_wrap.functions = functions;
	  codegen_wrap.functionDefs = functionDefs;
	  codegen_wrap.constants = constants;
	  return codegen_wrap;
	};


/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = {
	  'NaN':     'NaN',
	  'E':       'Math.E',
	  'LN2':     'Math.LN2',
	  'LN10':    'Math.LN10',
	  'LOG2E':   'Math.LOG2E',
	  'LOG10E':  'Math.LOG10E',
	  'PI':      'Math.PI',
	  'SQRT1_2': 'Math.SQRT1_2',
	  'SQRT2':   'Math.SQRT2'
	};

/***/ },
/* 147 */
/***/ function(module, exports) {

	module.exports = function(codegen) {
	
	  function fncall(name, args, cast, type) {
	    var obj = codegen(args[0]);
	    if (cast) {
	      obj = cast + '(' + obj + ')';
	      if (cast.lastIndexOf('new ', 0) === 0) obj = '(' + obj + ')';
	    }
	    return obj + '.' + name + (type < 0 ? '' : type === 0 ?
	      '()' :
	      '(' + args.slice(1).map(codegen).join(',') + ')');
	  }
	
	  function fn(name, cast, type) {
	    return function(args) {
	      return fncall(name, args, cast, type);
	    };
	  }
	
	  var DATE = 'new Date',
	      STRING = 'String',
	      REGEXP = 'RegExp';
	
	  return {
	    // MATH functions
	    'isNaN':    'isNaN',
	    'isFinite': 'isFinite',
	    'abs':      'Math.abs',
	    'acos':     'Math.acos',
	    'asin':     'Math.asin',
	    'atan':     'Math.atan',
	    'atan2':    'Math.atan2',
	    'ceil':     'Math.ceil',
	    'cos':      'Math.cos',
	    'exp':      'Math.exp',
	    'floor':    'Math.floor',
	    'log':      'Math.log',
	    'max':      'Math.max',
	    'min':      'Math.min',
	    'pow':      'Math.pow',
	    'random':   'Math.random',
	    'round':    'Math.round',
	    'sin':      'Math.sin',
	    'sqrt':     'Math.sqrt',
	    'tan':      'Math.tan',
	
	    'clamp': function(args) {
	      if (args.length < 3)
	        throw new Error('Missing arguments to clamp function.');
	      if (args.length > 3)
	        throw new Error('Too many arguments to clamp function.');
	      var a = args.map(codegen);
	      return 'Math.max('+a[1]+', Math.min('+a[2]+','+a[0]+'))';
	    },
	
	    // DATE functions
	    'now':             'Date.now',
	    'utc':             'Date.UTC',
	    'datetime':        DATE,
	    'date':            fn('getDate', DATE, 0),
	    'day':             fn('getDay', DATE, 0),
	    'year':            fn('getFullYear', DATE, 0),
	    'month':           fn('getMonth', DATE, 0),
	    'hours':           fn('getHours', DATE, 0),
	    'minutes':         fn('getMinutes', DATE, 0),
	    'seconds':         fn('getSeconds', DATE, 0),
	    'milliseconds':    fn('getMilliseconds', DATE, 0),
	    'time':            fn('getTime', DATE, 0),
	    'timezoneoffset':  fn('getTimezoneOffset', DATE, 0),
	    'utcdate':         fn('getUTCDate', DATE, 0),
	    'utcday':          fn('getUTCDay', DATE, 0),
	    'utcyear':         fn('getUTCFullYear', DATE, 0),
	    'utcmonth':        fn('getUTCMonth', DATE, 0),
	    'utchours':        fn('getUTCHours', DATE, 0),
	    'utcminutes':      fn('getUTCMinutes', DATE, 0),
	    'utcseconds':      fn('getUTCSeconds', DATE, 0),
	    'utcmilliseconds': fn('getUTCMilliseconds', DATE, 0),
	
	    // shared sequence functions
	    'length':      fn('length', null, -1),
	    'indexof':     fn('indexOf', null),
	    'lastindexof': fn('lastIndexOf', null),
	
	    // STRING functions
	    'parseFloat':  'parseFloat',
	    'parseInt':    'parseInt',
	    'upper':       fn('toUpperCase', STRING, 0),
	    'lower':       fn('toLowerCase', STRING, 0),
	    'slice':       fn('slice', STRING),
	    'substring':   fn('substring', STRING),
	    'replace':     fn('replace', STRING),
	
	    // REGEXP functions
	    'regexp':  REGEXP,
	    'test':    fn('test', REGEXP),
	
	    // Control Flow functions
	    'if': function(args) {
	        if (args.length < 3)
	          throw new Error('Missing arguments to if function.');
	        if (args.length > 3)
	          throw new Error('Too many arguments to if function.');
	        var a = args.map(codegen);
	        return a[0]+'?'+a[1]+':'+a[2];
	      }
	  };
	};


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var lgnd = __webpack_require__(149);
	
	function parseLegends(model, spec, legends, group) {
	  (spec || []).forEach(function(def, index) {
	    legends[index] = legends[index] || lgnd(model);
	    parseLegend(def, index, legends[index], group);
	  });
	}
	
	function parseLegend(def, index, legend, group) {
	  // legend scales
	  legend.size  (def.size   ? group.scale(def.size)   : null);
	  legend.shape (def.shape  ? group.scale(def.shape)  : null);
	  legend.fill  (def.fill   ? group.scale(def.fill)   : null);
	  legend.stroke(def.stroke ? group.scale(def.stroke) : null);
	
	  // legend orientation
	  if (def.orient) legend.orient(def.orient);
	
	  // legend offset
	  if (def.offset != null) legend.offset(def.offset);
	
	  // legend title
	  legend.title(def.title || null);
	
	  // legend values
	  legend.values(def.values || null);
	
	  // legend label formatting
	  legend.format(def.format !== undefined ? def.format : null);
	  legend.formatType(def.formatType || null);
	
	  // style properties
	  var p = def.properties;
	  legend.titleProperties(p && p.title || {});
	  legend.labelProperties(p && p.labels || {});
	  legend.legendProperties(p && p.legend || {});
	  legend.symbolProperties(p && p.symbols || {});
	  legend.gradientProperties(p && p.gradient || {});
	}
	
	module.exports = parseLegends;
	
	parseLegends.schema = {
	  "defs": {
	    "legend": {
	      "type": "object",
	      "properties": {
	        "size": {"type": "string"},
	        "shape": {"type": "string"},
	        "fill": {"type": "string"},
	        "stroke": {"type": "string"},
	        "orient": {"enum": ["left", "right"], "default": "right"},
	        "offset": {"type": "number"},
	        "title": {"type": "string"},
	        "values": {"type": "array"},
	        "format": {"type": "string"},
	        "formatType": {"enum": ["time", "utc", "string", "number"]},
	        "properties": {
	          "type": "object",
	          "properties": {
	            "title": {"$ref": "#/defs/propset"},
	            "labels": {"$ref": "#/defs/propset"},
	            "legend": {"$ref": "#/defs/propset"},
	            "symbols": {"$ref": "#/defs/propset"},
	            "gradient": {"$ref": "#/defs/propset"}
	          },
	          "additionalProperties": false
	        }
	      },
	      "additionalProperties": false,
	      "anyOf": [
	        {"required": ["size"]},
	        {"required": ["shape"]},
	        {"required": ["fill"]},
	        {"required": ["stroke"]}
	      ]
	    }
	  }
	};


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    Gradient = __webpack_require__(66).Gradient,
	    parseProperties = __webpack_require__(62),
	    parseMark = __webpack_require__(61),
	    util = __webpack_require__(64);
	
	function lgnd(model) {
	  var size  = null,
	      shape = null,
	      fill  = null,
	      stroke  = null,
	      spacing = null,
	      values  = null,
	      formatString = null,
	      formatType   = null,
	      title  = null,
	      config = model.config().legend,
	      orient = config.orient,
	      offset = config.offset,
	      padding = config.padding,
	      tickArguments = [5],
	      legendStyle = {},
	      symbolStyle = {},
	      gradientStyle = {},
	      titleStyle = {},
	      labelStyle = {},
	      m = { // Legend marks as references for updates
	        titles:  {},
	        symbols: {},
	        labels:  {},
	        gradient: {}
	      };
	
	  var legend = {},
	      legendDef = {};
	
	  function reset() { legendDef.type = null; }
	  function ingest(d, i) { return {data: d, index: i}; }
	
	  legend.def = function() {
	    var scale = size || shape || fill || stroke;
	
	    if (!legendDef.type) {
	      legendDef = (scale===fill || scale===stroke) && !discrete(scale.type) ?
	        quantDef(scale) : ordinalDef(scale);
	    }
	    legendDef.orient = orient;
	    legendDef.offset = offset;
	    legendDef.padding = padding;
	    legendDef.margin = config.margin;
	    return legendDef;
	  };
	
	  function discrete(type) {
	    return type==='ordinal' || type==='quantize' ||
	           type==='quantile' || type==='threshold';
	  }
	
	  function ordinalDef(scale) {
	    var def = o_legend_def(size, shape, fill, stroke);
	
	    // generate data
	    var data = (values == null ?
	      (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) :
	      values).map(ingest);
	
	    var fmt = util.getTickFormat(scale, data.length, formatType, formatString);
	
	    // determine spacing between legend entries
	    var fs, range, offset, pad=5, domain = d3.range(data.length);
	    if (size) {
	      range = data.map(function(x) { return Math.sqrt(size(x.data)); });
	      offset = d3.max(range);
	      range = range.reduce(function(a,b,i,z) {
	          if (i > 0) a[i] = a[i-1] + z[i-1]/2 + pad;
	          return (a[i] += b/2, a); }, [0]).map(Math.round);
	    } else {
	      offset = Math.round(Math.sqrt(config.symbolSize));
	      range = spacing ||
	        (fs = labelStyle.fontSize) && (fs.value + pad) ||
	        (config.labelFontSize + pad);
	      range = domain.map(function(d,i) {
	        return Math.round(offset/2 + i*range);
	      });
	    }
	
	    // account for padding and title size
	    var sz = padding, ts;
	    if (title) {
	      ts = titleStyle.fontSize;
	      sz += 5 + ((ts && ts.value) || config.titleFontSize);
	    }
	    for (var i=0, n=range.length; i<n; ++i) range[i] += sz;
	
	    // build scale for label layout
	    def.scales = def.scales || [{}];
	    dl.extend(def.scales[0], {
	      name: 'legend',
	      type: 'ordinal',
	      points: true,
	      domain: domain,
	      range: range
	    });
	
	    // update legend def
	    var tdata = (title ? [title] : []).map(ingest);
	    data.forEach(function(d) {
	      d.label = fmt(d.data);
	      d.offset = offset;
	    });
	    def.marks[0].from = function() { return tdata; };
	    def.marks[1].from = function() { return data; };
	    def.marks[2].from = def.marks[1].from;
	
	    return def;
	  }
	
	  function o_legend_def(size, shape, fill, stroke) {
	    // setup legend marks
	    var titles  = dl.extend(m.titles, legendTitle(config)),
	        symbols = dl.extend(m.symbols, legendSymbols(config)),
	        labels  = dl.extend(m.labels, vLegendLabels(config));
	
	    // extend legend marks
	    legendSymbolExtend(symbols, size, shape, fill, stroke);
	
	    // add / override custom style properties
	    dl.extend(titles.properties.update,  titleStyle);
	    dl.extend(symbols.properties.update, symbolStyle);
	    dl.extend(labels.properties.update,  labelStyle);
	
	    // padding from legend border
	    titles.properties.enter.x.value += padding;
	    titles.properties.enter.y.value += padding;
	    labels.properties.enter.x.offset += padding + 1;
	    symbols.properties.enter.x.offset = padding + 1;
	    labels.properties.update.x.offset += padding + 1;
	    symbols.properties.update.x.offset = padding + 1;
	
	    dl.extend(legendDef, {
	      type: 'group',
	      interactive: false,
	      properties: {
	        enter: parseProperties(model, 'group', legendStyle),
	        legendPosition: {
	          encode: legendPosition,
	          signals: [], scales:[], data: [], fields: []
	        }
	      }
	    });
	
	    legendDef.marks = [titles, symbols, labels].map(function(m) { return parseMark(model, m); });
	    return legendDef;
	  }
	
	  function quantDef(scale) {
	    var def = q_legend_def(scale),
	        dom = scale.domain(),
	        data  = (values == null ? dom : values).map(ingest),
	        width = (gradientStyle.width && gradientStyle.width.value) || config.gradientWidth,
	        fmt = util.getTickFormat(scale, data.length, formatType, formatString);
	
	    // build scale for label layout
	    def.scales = def.scales || [{}];
	    var layoutSpec = dl.extend(def.scales[0], {
	      name: 'legend',
	      type: scale.type,
	      round: true,
	      zero: false,
	      domain: [dom[0], dom[dom.length-1]],
	      range: [padding, width+padding]
	    });
	    if (scale.type==='pow') layoutSpec.exponent = scale.exponent();
	
	    // update legend def
	    var tdata = (title ? [title] : []).map(ingest);
	    data.forEach(function(d,i) {
	      d.label = fmt(d.data);
	      d.align = i==(data.length-1) ? 'right' : i===0 ? 'left' : 'center';
	    });
	
	    def.marks[0].from = function() { return tdata; };
	    def.marks[1].from = function() { return [1]; };
	    def.marks[2].from = function() { return data; };
	    return def;
	  }
	
	  function q_legend_def(scale) {
	    // setup legend marks
	    var titles = dl.extend(m.titles, legendTitle(config)),
	        gradient = dl.extend(m.gradient, legendGradient(config)),
	        labels = dl.extend(m.labels, hLegendLabels(config)),
	        grad = new Gradient();
	
	    // setup color gradient
	    var dom = scale.domain(),
	        min = dom[0],
	        max = dom[dom.length-1],
	        f = scale.copy().domain([min, max]).range([0,1]);
	
	    var stops = (scale.type !== 'linear' && scale.ticks) ?
	      scale.ticks.call(scale, 15) : dom;
	    if (min !== stops[0]) stops.unshift(min);
	    if (max !== stops[stops.length-1]) stops.push(max);
	
	    for (var i=0, n=stops.length; i<n; ++i) {
	      grad.stop(f(stops[i]), scale(stops[i]));
	    }
	    gradient.properties.enter.fill = {value: grad};
	
	    // add / override custom style properties
	    dl.extend(titles.properties.update, titleStyle);
	    dl.extend(gradient.properties.update, gradientStyle);
	    dl.extend(labels.properties.update, labelStyle);
	
	    // account for gradient size
	    var gp = gradient.properties, gh = gradientStyle.height,
	        hh = (gh && gh.value) || gp.enter.height.value;
	    labels.properties.enter.y.value = hh;
	    labels.properties.update.y.value = hh;
	
	    // account for title size as needed
	    if (title) {
	      var tp = titles.properties, fs = titleStyle.fontSize,
	          sz = 4 + ((fs && fs.value) || tp.enter.fontSize.value);
	      gradient.properties.enter.y.value += sz;
	      labels.properties.enter.y.value += sz;
	      gradient.properties.update.y.value += sz;
	      labels.properties.update.y.value += sz;
	    }
	
	    // padding from legend border
	    titles.properties.enter.x.value += padding;
	    titles.properties.enter.y.value += padding;
	    gradient.properties.enter.x.value += padding;
	    gradient.properties.enter.y.value += padding;
	    labels.properties.enter.y.value += padding;
	    gradient.properties.update.x.value += padding;
	    gradient.properties.update.y.value += padding;
	    labels.properties.update.y.value += padding;
	
	    dl.extend(legendDef, {
	      type: 'group',
	      interactive: false,
	      properties: {
	        enter: parseProperties(model, 'group', legendStyle),
	        legendPosition: {
	          encode: legendPosition,
	          signals: [], scales: [], data: [], fields: []
	        }
	      }
	    });
	
	    legendDef.marks = [titles, gradient, labels].map(function(m) { return parseMark(model, m); });
	    return legendDef;
	  }
	
	  legend.size = function(x) {
	    if (!arguments.length) return size;
	    if (size !== x) { size = x; reset(); }
	    return legend;
	  };
	
	  legend.shape = function(x) {
	    if (!arguments.length) return shape;
	    if (shape !== x) { shape = x; reset(); }
	    return legend;
	  };
	
	  legend.fill = function(x) {
	    if (!arguments.length) return fill;
	    if (fill !== x) { fill = x; reset(); }
	    return legend;
	  };
	
	  legend.stroke = function(x) {
	    if (!arguments.length) return stroke;
	    if (stroke !== x) { stroke = x; reset(); }
	    return legend;
	  };
	
	  legend.title = function(x) {
	    if (!arguments.length) return title;
	    if (title !== x) { title = x; reset(); }
	    return legend;
	  };
	
	  legend.format = function(x) {
	    if (!arguments.length) return formatString;
	    if (formatString !== x) {
	      formatString = x;
	      reset();
	    }
	    return legend;
	  };
	
	  legend.formatType = function(x) {
	    if (!arguments.length) return formatType;
	    if (formatType !== x) {
	      formatType = x;
	      reset();
	    }
	    return legend;
	  };
	
	  legend.spacing = function(x) {
	    if (!arguments.length) return spacing;
	    if (spacing !== +x) { spacing = +x; reset(); }
	    return legend;
	  };
	
	  legend.orient = function(x) {
	    if (!arguments.length) return orient;
	    orient = x in LEGEND_ORIENT ? x + '' : config.orient;
	    return legend;
	  };
	
	  legend.offset = function(x) {
	    if (!arguments.length) return offset;
	    offset = +x;
	    return legend;
	  };
	
	  legend.values = function(x) {
	    if (!arguments.length) return values;
	    values = x;
	    return legend;
	  };
	
	  legend.legendProperties = function(x) {
	    if (!arguments.length) return legendStyle;
	    legendStyle = x;
	    return legend;
	  };
	
	  legend.symbolProperties = function(x) {
	    if (!arguments.length) return symbolStyle;
	    symbolStyle = x;
	    return legend;
	  };
	
	  legend.gradientProperties = function(x) {
	    if (!arguments.length) return gradientStyle;
	    gradientStyle = x;
	    return legend;
	  };
	
	  legend.labelProperties = function(x) {
	    if (!arguments.length) return labelStyle;
	    labelStyle = x;
	    return legend;
	  };
	
	  legend.titleProperties = function(x) {
	    if (!arguments.length) return titleStyle;
	    titleStyle = x;
	    return legend;
	  };
	
	  legend.reset = function() {
	    reset();
	    return legend;
	  };
	
	  return legend;
	}
	
	var LEGEND_ORIENT = {left: 'x1', right: 'x2'};
	
	function legendPosition(item, group, trans, db, signals, predicates) {
	  var o = trans ? {} : item, i,
	      def = item.mark.def,
	      offset = def.offset,
	      orient = def.orient,
	      pad = def.padding * 2,
	      ao  = orient === 'left' ? 0 : group.width,
	      lw  = ~~item.bounds.width() + (item.width ? 0 : pad),
	      lh  = ~~item.bounds.height() + (item.height ? 0 : pad),
	      pos = group._legendPositions ||
	        (group._legendPositions = {right: 0.5, left: 0.5});
	
	  o.x = 0.5;
	  o.width = lw;
	  o.y = pos[orient];
	  pos[orient] += (o.height = lh) + def.margin;
	
	  // Calculate axis offset. 
	  var axes  = group.axes, 
	      items = group.axisItems,
	      bound = LEGEND_ORIENT[orient];
	  for (i=0; i<axes.length; ++i) {
	    if (axes[i].orient() === orient) {
	      ao = Math.max(ao, Math.abs(items[i].bounds[bound]));
	    }
	  }
	
	  if (orient === 'left') {
	    o.x -= ao + offset + lw;
	  } else {
	    o.x += ao + offset;
	  }
	
	  if (trans) trans.interpolate(item, o);
	  var enc = item.mark.def.properties.enter.encode;
	  enc.call(enc, item, group, trans, db, signals, predicates);
	  return true;
	}
	
	function legendSymbolExtend(mark, size, shape, fill, stroke) {
	  var e = mark.properties.enter,
	      u = mark.properties.update;
	  if (size)   e.size   = u.size   = {scale: size.scaleName,   field: 'data'};
	  if (shape)  e.shape  = u.shape  = {scale: shape.scaleName,  field: 'data'};
	  if (fill)   e.fill   = u.fill   = {scale: fill.scaleName,   field: 'data'};
	  if (stroke) e.stroke = u.stroke = {scale: stroke.scaleName, field: 'data'};
	}
	
	function legendTitle(config) {
	  return {
	    type: 'text',
	    interactive: false,
	    key: 'data',
	    properties: {
	      enter: {
	        x: {value: 0},
	        y: {value: 0},
	        fill: {value: config.titleColor},
	        font: {value: config.titleFont},
	        fontSize: {value: config.titleFontSize},
	        fontWeight: {value: config.titleFontWeight},
	        baseline: {value: 'top'},
	        text: {field: 'data'},
	        opacity: {value: 1e-6}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: { opacity: {value: 1} }
	    }
	  };
	}
	
	function legendSymbols(config) {
	  return {
	    type: 'symbol',
	    interactive: false,
	    key: 'data',
	    properties: {
	      enter: {
	        x: {field: 'offset', mult: 0.5},
	        y: {scale: 'legend', field: 'index'},
	        shape: {value: config.symbolShape},
	        size: {value: config.symbolSize},
	        stroke: {value: config.symbolColor},
	        strokeWidth: {value: config.symbolStrokeWidth},
	        opacity: {value: 1e-6}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: {
	        x: {field: 'offset', mult: 0.5},
	        y: {scale: 'legend', field: 'index'},
	        opacity: {value: 1}
	      }
	    }
	  };
	}
	
	function vLegendLabels(config) {
	  return {
	    type: 'text',
	    interactive: false,
	    key: 'data',
	    properties: {
	      enter: {
	        x: {field: 'offset', offset: 5},
	        y: {scale: 'legend', field: 'index'},
	        fill: {value: config.labelColor},
	        font: {value: config.labelFont},
	        fontSize: {value: config.labelFontSize},
	        align: {value: config.labelAlign},
	        baseline: {value: config.labelBaseline},
	        text: {field: 'label'},
	        opacity: {value: 1e-6}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: {
	        opacity: {value: 1},
	        x: {field: 'offset', offset: 5},
	        y: {scale: 'legend', field: 'index'},
	      }
	    }
	  };
	}
	
	function legendGradient(config) {
	  return {
	    type: 'rect',
	    interactive: false,
	    properties: {
	      enter: {
	        x: {value: 0},
	        y: {value: 0},
	        width: {value: config.gradientWidth},
	        height: {value: config.gradientHeight},
	        stroke: {value: config.gradientStrokeColor},
	        strokeWidth: {value: config.gradientStrokeWidth},
	        opacity: {value: 1e-6}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: {
	        x: {value: 0},
	        y: {value: 0},
	        opacity: {value: 1}
	      }
	    }
	  };
	}
	
	function hLegendLabels(config) {
	  return {
	    type: 'text',
	    interactive: false,
	    key: 'data',
	    properties: {
	      enter: {
	        x: {scale: 'legend', field: 'data'},
	        y: {value: 20},
	        dy: {value: 2},
	        fill: {value: config.labelColor},
	        font: {value: config.labelFont},
	        fontSize: {value: config.labelFontSize},
	        align: {field: 'align'},
	        baseline: {value: 'top'},
	        text: {field: 'label'},
	        opacity: {value: 1e-6}
	      },
	      exit: { opacity: {value: 1e-6} },
	      update: {
	        x: {scale: 'legend', field: 'data'},
	        y: {value: 20},
	        opacity: {value: 1}
	      }
	    }
	  };
	}
	
	module.exports = lgnd;


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	var parseMark = __webpack_require__(61),
	    parseProperties = __webpack_require__(62);
	
	function parseRootMark(model, spec, width, height) {
	  return {
	    type:       'group',
	    width:      width,
	    height:     height,
	    properties: defaults(spec.scene || {}, model),
	    scales:     spec.scales  || [],
	    axes:       spec.axes    || [],
	    legends:    spec.legends || [],
	    marks:      (spec.marks || []).map(function(m) { return parseMark(model, m); })
	  };
	}
	
	var PROPERTIES = [
	  'fill', 'fillOpacity', 'stroke', 'strokeOpacity',
	  'strokeWidth', 'strokeDash', 'strokeDashOffset'
	];
	
	function defaults(spec, model) {
	  var config = model.config().scene,
	      props = {}, i, n, m, p, s;
	
	  for (i=0, n=m=PROPERTIES.length; i<n; ++i) {
	    p = PROPERTIES[i];
	    if ((s=spec[p]) !== undefined) {
	      props[p] = s.signal ? s : {value: s};
	    } else if (config[p]) {
	      props[p] = {value: config[p]};
	    } else {
	      --m;
	    }
	  }
	
	  return m ? {update: parseProperties(model, 'group', props)} : {};
	}
	
	module.exports = parseRootMark;
	
	parseRootMark.schema = {
	  "defs": {
	    "container": {
	      "type": "object",
	      "properties": {
	        "scene": {
	          "type": "object",
	          "properties": {
	            "fill": {
	              "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	            },
	            "fillOpacity": {
	              "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	            },
	            "stroke": {
	              "oneOf": [{"type": "string"}, {"$ref": "#/refs/signal"}]
	            },
	            "strokeOpacity": {
	              "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	            },
	            "strokeWidth": {
	              "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	            },
	            "strokeDash": {
	              "oneOf": [
	                {"type": "array", "items": {"type": "number"}}, 
	                {"$ref": "#/refs/signal"}
	              ]
	            },
	            "strokeDashOffset": {
	              "oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]
	            },
	          }
	        },
	        "scales": {
	          "type": "array",
	          "items": {"$ref": "#/defs/scale"}
	        },
	        "axes": {
	          "type": "array",
	          "items": {"$ref": "#/defs/axis"}
	        },
	        "legends": {
	          "type": "array",
	          "items": {"$ref": "#/defs/legend"}
	        },
	        "marks": {
	          "type": "array",
	          "items": {"oneOf":[{"$ref": "#/defs/groupMark"}, {"$ref": "#/defs/visualMark"}]}
	        }
	      }
	    },
	
	
	    "groupMark": {
	      "allOf": [
	        {
	          "properties": { "type": {"enum": ["group"]} },
	          "required": ["type"]
	        },
	        {"$ref": "#/defs/mark"},
	        {"$ref": "#/defs/container"}
	      ]
	    },
	
	    "visualMark": {
	      "allOf": [
	        {
	          "not": { "properties": { "type": {"enum": ["group"]} } },
	        },
	        {"$ref": "#/defs/mark"}
	      ]
	    }
	  }
	};


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18);
	
	function parsePadding(pad) {
	  return pad == null ? 'auto' :
	    dl.isObject(pad) ? pad :
	    dl.isNumber(pad) ? {top:pad, left:pad, right:pad, bottom:pad} :
	    pad === 'strict' ? pad : 'auto';
	}
	
	module.exports = parsePadding;
	parsePadding.schema = {
	  "defs": {
	    "padding": {
	      "oneOf": [{
	        "enum": ["strict", "auto"]
	      }, {
	        "type": "number"
	      }, {
	        "type": "object",
	        "properties": {
	          "top": {"type": "number"},
	          "bottom": {"type": "number"},
	          "left": {"type": "number"},
	          "right": {"type": "number"}
	        },
	        "additionalProperties": false
	      }]
	    }
	  }
	};


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18);
	
	var types = {
	  '=':   parseComparator,
	  '==':  parseComparator,
	  '!=':  parseComparator,
	  '>':   parseComparator,
	  '>=':  parseComparator,
	  '<':   parseComparator,
	  '<=':  parseComparator,
	  'and': parseLogical,
	  '&&':  parseLogical,
	  'or':  parseLogical,
	  '||':  parseLogical,
	  'in':  parseIn
	};
	
	var nullScale = function() { return 0; };
	nullScale.invert = nullScale;
	
	function parsePredicates(model, spec) {
	  (spec || []).forEach(function(s) {
	    var parse = types[s.type](model, s);
	
	    /* jshint evil:true */
	    var pred  = Function("args", "db", "signals", "predicates", parse.code);
	    pred.root = function() { return model.scene().items[0]; }; // For global scales
	    pred.nullScale = nullScale;
	    pred.isFunction = dl.isFunction;
	    pred.signals = parse.signals;
	    pred.data = parse.data;
	
	    model.predicate(s.name, pred);
	  });
	
	  return spec;
	}
	
	function parseSignal(signal, signals) {
	  var s = dl.field(signal),
	      code = "signals["+s.map(dl.str).join("][")+"]";
	  signals[s[0]] = 1;
	  return code;
	}
	
	function parseOperands(model, operands) {
	  var decl = [], defs = [],
	      signals = {}, db = {};
	
	  function setSignal(s) { signals[s] = 1; }
	  function setData(d) { db[d] = 1; }
	
	  dl.array(operands).forEach(function(o, i) {
	    var name = "o" + i,
	        def = "";
	
	    if (o.value !== undefined) {
	      def = dl.str(o.value);
	    } else if (o.arg) {
	      def = "args["+dl.str(o.arg)+"]";
	    } else if (o.signal) {
	      def = parseSignal(o.signal, signals);
	    } else if (o.predicate) {
	      var ref = o.predicate,
	          predName = ref && (ref.name || ref),
	          pred = model.predicate(predName),
	          p = "predicates["+dl.str(predName)+"]";
	
	      pred.signals.forEach(setSignal);
	      pred.data.forEach(setData);
	
	      if (dl.isObject(ref)) {
	        dl.keys(ref).forEach(function(k) {
	          if (k === "name") return;
	          var i = ref[k];
	          def += "args["+dl.str(k)+"] = ";
	          if (i.signal) {
	            def += parseSignal(i.signal, signals);
	          } else if (i.arg) {
	            def += "args["+dl.str(i.arg)+"]";
	          }
	          def += ", ";
	        });
	      }
	
	      def += p+".call("+p+", args, db, signals, predicates)";
	    }
	
	    decl.push(name);
	    defs.push(name+"=("+def+")");
	  });
	
	  return {
	    code: "var " + decl.join(", ") + ";\n" + defs.join(";\n") + ";\n",
	    signals: dl.keys(signals),
	    data: dl.keys(db)
	  };
	}
	
	function parseComparator(model, spec) {
	  var ops = parseOperands(model, spec.operands);
	  if (spec.type === '=') spec.type = '==';
	
	  ops.code += "o0 = o0 instanceof Date ? o0.getTime() : o0;\n" +
	    "o1 = o1 instanceof Date ? o1.getTime() : o1;\n";
	
	  return {
	    code: ops.code + "return " + ["o0", "o1"].join(spec.type) + ";",
	    signals: ops.signals,
	    data: ops.data
	  };
	}
	
	function parseLogical(model, spec) {
	  var ops = parseOperands(model, spec.operands),
	      o = [], i = 0, len = spec.operands.length;
	
	  while (o.push("o"+i++) < len);
	  if (spec.type === 'and') spec.type = '&&';
	  else if (spec.type === 'or') spec.type = '||';
	
	  return {
	    code: ops.code + "return " + o.join(spec.type) + ";",
	    signals: ops.signals,
	    data: ops.data
	  };
	}
	
	function parseIn(model, spec) {
	  var o = [spec.item], code = "";
	  if (spec.range) o.push.apply(o, spec.range);
	  if (spec.scale) {
	    code = parseScale(spec.scale, o);
	  }
	
	  var ops = parseOperands(model, o);
	  code = ops.code + code + "\n  var ordSet = null;\n";
	
	  if (spec.data) {
	    var field = dl.field(spec.field).map(dl.str);
	    code += "var where = function(d) { return d["+field.join("][")+"] == o0 };\n";
	    code += "return db["+dl.str(spec.data)+"].filter(where).length > 0;";
	  } else if (spec.range) {
	    // TODO: inclusive/exclusive range?
	    if (spec.scale) {
	      code += "if (scale.length == 2) {\n" + // inverting ordinal scales
	        "  ordSet = scale(o1, o2);\n" +
	        "} else {\n" +
	        "  o1 = scale(o1);\no2 = scale(o2);\n" +
	        "}";
	    }
	
	    code += "return ordSet !== null ? ordSet.indexOf(o0) !== -1 :\n" +
	      "  o1 < o2 ? o1 <= o0 && o0 <= o2 : o2 <= o0 && o0 <= o1;";
	  }
	
	  return {
	    code: code,
	    signals: ops.signals,
	    data: ops.data.concat(spec.data ? [spec.data] : [])
	  };
	}
	
	// Populate ops such that ultimate scale/inversion function will be in `scale` var.
	function parseScale(spec, ops) {
	  var code = "var scale = ",
	      idx  = ops.length;
	
	  if (dl.isString(spec)) {
	    ops.push({ value: spec });
	    code += "this.root().scale(o"+idx+")";
	  } else if (spec.arg) {  // Scale function is being passed as an arg
	    ops.push(spec);
	    code += "o"+idx;
	  } else if (spec.name) { // Full scale parameter {name: ..}
	    ops.push(dl.isString(spec.name) ? {value: spec.name} : spec.name);
	    code += "(this.isFunction(o"+idx+") ? o"+idx+" : ";
	    if (spec.scope) {
	      ops.push(spec.scope);
	      code += "((o"+(idx+1)+".scale || this.root().scale)(o"+idx+") || this.nullScale)";
	    } else {
	      code += "this.root().scale(o"+idx+")";
	    }
	    code += ")";
	  }
	
	  if (spec.invert === true) {  // Allow spec.invert.arg?
	    code += ".invert";
	  }
	
	  return code+";\n";
	}
	
	module.exports = parsePredicates;
	parsePredicates.schema = {
	  "refs": {
	    "operand": {
	      "type": "object",
	      "oneOf": [
	        {
	          "properties": {"value": {}},
	          "required": ["value"]
	        },
	        {
	          "properties": {"arg": {"type": "string"}},
	          "required": ["arg"]
	        },
	        {"$ref": "#/refs/signal"},
	        {
	          "properties": {
	            "predicate": {
	              "oneOf": [
	                {"type": "string"},
	                {
	                  "type": "object",
	                  "properties": {"name": {"type": "string"}},
	                  "required": ["name"]
	                }
	              ]
	            }
	          },
	          "required": ["predicate"]
	        }
	      ]
	    }
	  },
	
	  "defs": {
	    "predicate": {
	      "type": "object",
	      "oneOf": [{
	        "properties": {
	          "name": {"type": "string"},
	          "type": {"enum": ["==", "!=", ">", "<", ">=", "<="]},
	          "operands": {
	            "type": "array",
	            "items": {"$ref": "#/refs/operand"},
	            "minItems": 2,
	            "maxItems": 2
	          }
	        },
	        "required": ["name", "type", "operands"]
	      }, {
	        "properties": {
	          "name": {"type": "string"},
	          "type": {"enum": ["and", "&&", "or", "||"]},
	          "operands": {
	            "type": "array",
	            "items": {"$ref": "#/refs/operand"},
	            "minItems": 2
	          }
	        },
	        "required": ["name", "type", "operands"]
	      }, {
	        "properties": {
	          "name": {"type": "string"},
	          "type": {"enum": ["in"]},
	          "item": {"$ref": "#/refs/operand"}
	        },
	
	        "oneOf": [
	          {
	            "properties": {
	              "range": {
	                "type": "array",
	                "items": {"$ref": "#/refs/operand"},
	                "minItems": 2
	              },
	              "scale": {"$ref": "#/refs/scopedScale"}
	            },
	            "required": ["range"]
	          },
	          {
	            "properties": {
	              "data": {"type": "string"},
	              "field": {"type": "string"}
	            },
	            "required": ["data", "field"]
	          }
	        ],
	
	        "required": ["name", "type", "item"]
	      }]
	    }
	  }
	};


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    expr = __webpack_require__(142),
	    SIGNALS = __webpack_require__(10).Dependencies.SIGNALS;
	
	var RESERVED = ['datum', 'event', 'signals', 'width', 'height', 'padding']
	    .concat(dl.keys(expr.codegen.functions));
	
	function parseSignals(model, spec) {
	  // process each signal definition
	  (spec || []).forEach(function(s) {
	    if (RESERVED.indexOf(s.name) !== -1) {
	      throw Error('Signal name "'+s.name+'" is a '+
	        'reserved keyword ('+RESERVED.join(', ')+').');
	    }
	
	    var signal = model.signal(s.name, s.init)
	      .verbose(s.verbose);
	
	    if (s.init && s.init.expr) {
	      s.init.expr = model.expr(s.init.expr);
	      signal.value(exprVal(model, s.init));
	    }
	
	    if (s.expr) {
	      s.expr = model.expr(s.expr);
	      signal.evaluate = function(input) {
	        var val = exprVal(model, s),
	            sg  = input.signals;
	        if (val !== signal.value() || signal.verbose()) {
	          signal.value(val);
	          sg[s.name] = 1;
	        }
	        return sg[s.name] ? input : model.doNotPropagate;
	      };
	      signal.dependency(SIGNALS, s.expr.globals);
	      s.expr.globals.forEach(function(dep) {
	        model.signal(dep).addListener(signal);
	      });
	    }
	  });
	
	  return spec;
	}
	
	function exprVal(model, spec) {
	  var e = spec.expr, v = e.fn();
	  return spec.scale ? parseSignals.scale(model, spec, v) : v;
	}
	
	parseSignals.scale = function scale(model, spec, value, datum, evt) {
	  var def = spec.scale,
	      name  = def.name || def.signal || def,
	      scope = def.scope, e;
	
	  if (scope) {
	    if (scope.signal) {
	      scope = model.signalRef(scope.signal);
	    } else if (dl.isString(scope)) { // Scope is an expression
	      e = def._expr = (def._expr || model.expr(scope));
	      scope = e.fn(datum, evt);
	    }
	  }
	
	  return expr.scale(model, def.invert, name, value, scope);
	};
	
	module.exports = parseSignals;
	parseSignals.schema = {
	  "refs": {
	    "signal": {
	      "title": "SignalRef",
	      "type": "object",
	      "properties": {"signal": {"type": "string"}},
	      "required": ["signal"]
	    },
	
	    "scopedScale": {
	      "oneOf": [
	        {"type": "string"},
	        {
	          "type": "object",
	          "properties": {
	            "name": {
	              "oneOf": [{"$ref": "#/refs/signal"}, {"type": "string"}]
	            },
	            "scope": {
	              "oneOf": [
	                {"$ref": "#/refs/signal"},
	                {"type": "string"}
	              ]
	            },
	            "invert": {"type": "boolean", "default": false}
	          },
	
	          "additionalProperties": false,
	          "required": ["name"]
	        }
	      ]
	    }
	  },
	
	  "defs": {
	    "signal": {
	      "type": "object",
	
	      "properties": {
	        "name": {
	          "type": "string",
	          "not": {"enum": RESERVED}
	        },
	        "init": {},
	        "verbose": {"type": "boolean", "default": false},
	        "expr": {"type": "string"},
	        "scale": {"$ref": "#/refs/scopedScale"},
	        "streams": {"$ref": "#/defs/streams"}
	      },
	
	      "additionalProperties": false,
	      "required": ["name"]
	    }
	  }
	};


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	var dl  = __webpack_require__(18),
	    log = __webpack_require__(14),
	    Model = __webpack_require__(155),
	    View  = __webpack_require__(163);
	
	/**
	 * Parse graph specification
	 * @param spec (object)
	 * @param config (optional object)
	 * @param viewFactory (optional function)
	 * @param callback (error, model)
	 */
	 function parseSpec(spec /*, [config,] [viewFactory,] callback */) {
	  // do not assign any values to callback, as it will change arguments
	  var arglen = arguments.length,
	      argidx = 2,
	      cb = arguments[arglen-1],
	      model = new Model(),
	      viewFactory = View.factory;
	
	  if (arglen > argidx && dl.isFunction(arguments[arglen - argidx])) {
	    viewFactory = arguments[arglen - argidx];
	    ++argidx;
	  }
	  if (arglen > argidx && dl.isObject(arguments[arglen - argidx])) {
	    model.config(arguments[arglen - argidx]);
	  }
	
	  if (dl.isObject(spec)) {
	    parse(spec);
	  } else if (dl.isString(spec)) {
	    var opts = dl.extend({url: spec}, model.config().load);
	    dl.json(opts, function(err, spec) {
	      if (err) done('SPECIFICATION LOAD FAILED: ' + err);
	      else parse(spec);
	    });
	  } else {
	    done('INVALID SPECIFICATION: Must be a valid JSON object or URL.');
	  }
	
	  function parse(spec) {
	    try {
	      // protect against subsequent spec modification
	      spec = dl.duplicate(spec);
	
	      var parsers = __webpack_require__(58),
	          width   = spec.width || 500,
	          height  = spec.height || 500,
	          padding = parsers.padding(spec.padding);
	
	      // create signals for width, height, padding, and cursor
	      model.signal('width', width);
	      model.signal('height', height);
	      model.signal('padding', padding);
	      cursor(spec);
	
	      // initialize model
	      model.defs({
	        width:      width,
	        height:     height,
	        padding:    padding,
	        viewport:   spec.viewport || null,
	        background: parsers.background(spec.background),
	        signals:    parsers.signals(model, spec.signals),
	        predicates: parsers.predicates(model, spec.predicates),
	        marks:      parsers.marks(model, spec, width, height),
	        data:       parsers.data(model, spec.data, done)
	      });
	    } catch (err) { done(err); }
	  }
	
	  function cursor(spec) {
	    var signals = spec.signals || (spec.signals=[]),  def;
	    signals.some(function(sg) {
	      return (sg.name === 'cursor') ? (def=sg, true) : false;
	    });
	
	    if (!def) signals.push(def={name: 'cursor', streams: []});
	
	    // Add a stream def at the head, so that custom defs can override it.
	    def.init = def.init || {};
	    def.streams.unshift({
	      type: 'mousemove',
	      expr: 'eventItem().cursor === cursor.default ? cursor : {default: eventItem().cursor}'
	    });
	  }
	
	  function done(err) {
	    var view;
	    if (err) {
	      log.error(err);
	    } else {
	      view = viewFactory(model.buildIndexes());
	    }
	
	    if (cb) {
	      if (cb.length > 1) cb(err, view);
	      else if (!err) cb(view);
	      cb = null;
	    }
	  }
	}
	
	module.exports = parseSpec;
	
	parseSpec.schema = {
	  "defs": {
	    "spec": {
	      "title": "Vega visualization specification",
	      "type": "object",
	
	      "allOf": [{"$ref": "#/defs/container"}, {
	        "properties": {
	          "width": {"type": "number"},
	          "height": {"type": "number"},
	          "viewport": {
	            "type": "array",
	            "items": {"type": "number"},
	            "maxItems": 2
	          },
	
	          "background": {"$ref": "#/defs/background"},
	          "padding": {"$ref": "#/defs/padding"},
	
	          "signals": {
	            "type": "array",
	            "items": {"$ref": "#/defs/signal"}
	          },
	
	          "predicates": {
	            "type": "array",
	            "items": {"$ref": "#/defs/predicate"}
	          },
	
	          "data": {
	            "type": "array",
	            "items": {"$ref": "#/defs/data"}
	          }
	        }
	      }]
	    }
	  }
	};


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    ChangeSet = df.ChangeSet,
	    Base = df.Graph.prototype,
	    Node  = df.Node, // jshint ignore:line
	    GroupBuilder = __webpack_require__(156),
	    visit = __webpack_require__(161),
	    compiler = __webpack_require__(142),
	    config = __webpack_require__(162);
	
	function Model(cfg) {
	  this._defs = {};
	  this._predicates = {};
	
	  this._scene  = null;  // Root scenegraph node.
	  this._groups = null;  // Index of group items.
	
	  this._node = null;
	  this._builder = null; // Top-level scenegraph builder.
	
	  this._reset = {axes: false, legends: false};
	
	  this.config(cfg);
	  this.expr = compiler(this);
	  Base.init.call(this);
	}
	
	var prototype = (Model.prototype = Object.create(Base));
	prototype.constructor = Model;
	
	prototype.defs = function(defs) {
	  if (!arguments.length) return this._defs;
	  this._defs = defs;
	  return this;
	};
	
	prototype.config = function(cfg) {
	  if (!arguments.length) return this._config;
	  this._config = Object.create(config);
	  for (var name in cfg) {
	    var x = cfg[name], y = this._config[name];
	    if (dl.isObject(x) && dl.isObject(y)) {
	      this._config[name] = dl.extend({}, y, x);
	    } else {
	      this._config[name] = x;
	    }
	  }
	
	  return this;
	};
	
	prototype.width = function(width) {
	  if (this._defs) this._defs.width = width;
	  if (this._defs && this._defs.marks) this._defs.marks.width = width;
	  if (this._scene) {
	    this._scene.items[0].width = width;
	    this._scene.items[0]._dirty = true;
	  }
	  this._reset.axes = true;
	  return this;
	};
	
	prototype.height = function(height) {
	  if (this._defs) this._defs.height = height;
	  if (this._defs && this._defs.marks) this._defs.marks.height = height;
	  if (this._scene) {
	    this._scene.items[0].height = height;
	    this._scene.items[0]._dirty = true;
	  }
	  this._reset.axes = true;
	  return this;
	};
	
	prototype.node = function() {
	  return this._node || (this._node = new Node(this));
	};
	
	prototype.data = function() {
	  var data = Base.data.apply(this, arguments);
	  if (arguments.length > 1) {  // new Datasource
	    this.node().addListener(data.pipeline()[0]);
	  }
	  return data;
	};
	
	function predicates(name) {
	  var m = this, pred = {};
	  if (!dl.isArray(name)) return this._predicates[name];
	  name.forEach(function(n) { pred[n] = m._predicates[n]; });
	  return pred;
	}
	
	prototype.predicate = function(name, predicate) {
	  if (arguments.length === 1) return predicates.call(this, name);
	  return (this._predicates[name] = predicate);
	};
	
	prototype.predicates = function() { return this._predicates; };
	
	prototype.scene = function(renderer) {
	  if (!arguments.length) return this._scene;
	
	  if (this._builder) {
	    this.node().removeListener(this._builder);
	    this._builder._groupBuilder.disconnect();
	  }
	
	  var m = this,
	      b = this._builder = new Node(this);
	
	  b.evaluate = function(input) {
	    if (b._groupBuilder) return input;
	
	    var gb = b._groupBuilder = new GroupBuilder(m, m._defs.marks, m._scene={}),
	        p  = gb.pipeline();
	
	    m._groups = {};
	    this.addListener(gb.connect());
	    p[p.length-1].addListener(renderer);
	    return input;
	  };
	
	  this.addListener(b);
	  return this;
	};
	
	prototype.group = function(id, item) {
	  var groups = this._groups;
	  if (arguments.length === 1) return groups[id];
	  return (groups[id] = item, this);
	};
	
	prototype.reset = function() {
	  if (this._scene && this._reset.axes) {
	    visit(this._scene, function(item) {
	      if (item.axes) item.axes.forEach(function(axis) { axis.reset(); });
	    });
	    this._reset.axes = false;
	  }
	  if (this._scene && this._reset.legends) {
	    visit(this._scene, function(item) {
	      if (item.legends) item.legends.forEach(function(l) { l.reset(); });
	    });
	    this._reset.legends = false;
	  }
	  return this;
	};
	
	prototype.addListener = function(l) {
	  this.node().addListener(l);
	};
	
	prototype.removeListener = function(l) {
	  this.node().removeListener(l);
	};
	
	prototype.fire = function(cs) {
	  if (!cs) cs = ChangeSet.create();
	  this.propagate(cs, this.node());
	};
	
	module.exports = Model;


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    Node = df.Node, // jshint ignore:line
	    Deps = df.Dependencies,
	    Collector = df.Collector,
	    log = __webpack_require__(14),
	    Builder = __webpack_require__(157),
	    Scale = __webpack_require__(160),
	    parseAxes = __webpack_require__(59),
	    parseLegends = __webpack_require__(148);
	
	function GroupBuilder() {
	  this._children = {};
	  this._scaler = null;
	  this._recursor = null;
	
	  this._scales = {};
	  this.scale = scale.bind(this);
	  return arguments.length ? this.init.apply(this, arguments) : this;
	}
	
	var Types = GroupBuilder.TYPES = {
	  GROUP:  "group",
	  MARK:   "mark",
	  AXIS:   "axis",
	  LEGEND: "legend"
	};
	
	var proto = (GroupBuilder.prototype = new Builder());
	
	proto.init = function(graph, def) {
	  var builder = this, name;
	
	  this._scaler = new Node(graph);
	
	  (def.scales||[]).forEach(function(s) {
	    s = builder.scale((name=s.name), new Scale(graph, s, builder));
	    builder.scale(name+":prev", s);
	    builder._scaler.addListener(s);  // Scales should be computed after group is encoded
	  });
	
	  this._recursor = new Node(graph);
	  this._recursor.evaluate = recurse.bind(this);
	
	  var scales = (def.axes||[]).reduce(function(acc, x) {
	    return (acc[x.scale] = 1, acc);
	  }, {});
	
	  scales = (def.legends||[]).reduce(function(acc, x) {
	    return (acc[x.size || x.shape || x.fill || x.stroke], acc);
	  }, scales);
	
	  this._recursor.dependency(Deps.SCALES, dl.keys(scales));
	
	  // We only need a collector for up-propagation of bounds calculation,
	  // so only GroupBuilders, and not regular Builders, have collectors.
	  this._collector = new Collector(graph);
	
	  return Builder.prototype.init.apply(this, arguments);
	};
	
	proto.evaluate = function() {
	  var output  = Builder.prototype.evaluate.apply(this, arguments),
	      model   = this._graph,
	      builder = this;
	
	  output.add.forEach(function(group) { buildGroup.call(builder, output, group); });
	  output.rem.forEach(function(group) { model.group(group._id, null); });
	  return output;
	};
	
	proto.pipeline = function() {
	  return [this, this._scaler, this._recursor, this._collector, this._bounder];
	};
	
	proto.disconnect = function() {
	  var builder = this;
	  dl.keys(builder._children).forEach(function(group_id) {
	    builder._children[group_id].forEach(function(c) {
	      builder._recursor.removeListener(c.builder);
	      c.builder.disconnect();
	    });
	  });
	
	  builder._children = {};
	  return Builder.prototype.disconnect.call(this);
	};
	
	proto.child = function(name, group_id) {
	  var children = this._children[group_id],
	      i = 0, len = children.length,
	      child;
	
	  for (; i<len; ++i) {
	    child = children[i];
	    if (child.type == Types.MARK && child.builder._def.name == name) break;
	  }
	
	  return child.builder;
	};
	
	function recurse(input) {
	  var builder = this,
	      hasMarks = dl.array(this._def.marks).length > 0,
	      hasAxes = dl.array(this._def.axes).length > 0,
	      hasLegends = dl.array(this._def.legends).length > 0,
	      i, j, c, len, group, pipeline, def, inline = false;
	
	  for (i=0, len=input.add.length; i<len; ++i) {
	    group = input.add[i];
	    if (hasMarks) buildMarks.call(this, input, group);
	    if (hasAxes)  buildAxes.call(this, input, group);
	    if (hasLegends) buildLegends.call(this, input, group);
	  }
	
	  // Wire up new children builders in reverse to minimize graph rewrites.
	  for (i=input.add.length-1; i>=0; --i) {
	    group = input.add[i];
	    for (j=this._children[group._id].length-1; j>=0; --j) {
	      c = this._children[group._id][j];
	      c.builder.connect();
	      pipeline = c.builder.pipeline();
	      def = c.builder._def;
	
	      // This new child needs to be built during this propagation cycle.
	      // We could add its builder as a listener off the _recursor node,
	      // but try to inline it if we can to minimize graph dispatches.
	      inline = (def.type !== Types.GROUP);
	      inline = inline && (this._graph.data(c.from) !== undefined);
	      inline = inline && (pipeline[pipeline.length-1].listeners().length === 1); // Reactive geom source
	      inline = inline && (def.from && !def.from.mark); // Reactive geom target
	      c.inline = inline;
	
	      if (inline) this._graph.evaluate(input, c.builder);
	      else this._recursor.addListener(c.builder);
	    }
	  }
	
	  function removeTemp(c) {
	    if (c.type == Types.MARK && !c.inline &&
	        builder._graph.data(c.from) !== undefined) {
	      builder._recursor.removeListener(c.builder);
	    }
	  }
	
	  function updateAxis(a) {
	    var scale = a.scale();
	    if (!input.scales[scale.scaleName]) return;
	    a.reset().def();
	  }
	
	  function updateLegend(l) {
	    var scale = l.size() || l.shape() || l.fill() || l.stroke();
	    if (!input.scales[scale.scaleName]) return;
	    l.reset().def();
	  }
	
	  for (i=0, len=input.mod.length; i<len; ++i) {
	    group = input.mod[i];
	
	    // Remove temporary connection for marks that draw from a source
	    if (hasMarks) builder._children[group._id].forEach(removeTemp);
	
	    // Update axis data defs
	    if (hasAxes) group.axes.forEach(updateAxis);
	
	    // Update legend data defs
	    if (hasLegends) group.legends.forEach(updateLegend);
	  }
	
	  function disconnectChildren(c) {
	    builder._recursor.removeListener(c.builder);
	    c.builder.disconnect();
	  }
	
	  for (i=0, len=input.rem.length; i<len; ++i) {
	    group = input.rem[i];
	    // For deleted groups, disconnect their children
	    builder._children[group._id].forEach(disconnectChildren);
	    delete builder._children[group._id];
	  }
	
	  return input;
	}
	
	function scale(name, x) {
	  var group = this, s = null;
	  if (arguments.length === 2) return (group._scales[name] = x, x);
	  while (s == null) {
	    s = group._scales[name];
	    group = group.mark ? group.mark.group : group._parent;
	    if (!group) break;
	  }
	  return s;
	}
	
	function buildGroup(input, group) {
	  log.debug(input, ["building group", group._id]);
	
	  group._scales = group._scales || {};
	  group.scale = scale.bind(group);
	
	  group.items = group.items || [];
	  this._children[group._id] = this._children[group._id] || [];
	
	  group.axes = group.axes || [];
	  group.axisItems = group.axisItems || [];
	
	  group.legends = group.legends || [];
	  group.legendItems = group.legendItems || [];
	
	  // Index group by ID to enable safe scoped scale lookups.
	  this._graph.group(group._id, group);
	}
	
	function buildMarks(input, group) {
	  log.debug(input, ["building children marks #"+group._id]);
	  var marks = this._def.marks,
	      mark, from, inherit, i, len, b;
	
	  for (i=0, len=marks.length; i<len; ++i) {
	    mark = marks[i];
	    from = mark.from || {};
	    inherit = group.datum._facetID;
	    group.items[i] = {group: group, _scaleRefs: {}};
	    b = (mark.type === Types.GROUP) ? new GroupBuilder() : new Builder();
	    b.init(this._graph, mark, group.items[i], this, group._id, inherit);
	    this._children[group._id].push({
	      builder: b,
	      from: from.data || (from.mark ? ("vg_" + group._id + "_" + from.mark) : inherit),
	      type: Types.MARK
	    });
	  }
	}
	
	function buildAxes(input, group) {
	  var axes = group.axes,
	      axisItems = group.axisItems,
	      builder = this;
	
	  parseAxes(this._graph, this._def.axes, axes, group);
	  axes.forEach(function(a, i) {
	    var scale = builder._def.axes[i].scale,
	        def = a.def(),
	        b = null;
	
	    axisItems[i] = {group: group, axis: a, layer: def.layer};
	    b = (def.type === Types.GROUP) ? new GroupBuilder() : new Builder();
	    b.init(builder._graph, def, axisItems[i], builder)
	      .dependency(Deps.SCALES, scale);
	    builder._children[group._id].push({ builder: b, type: Types.AXIS, scale: scale });
	  });
	}
	
	function buildLegends(input, group) {
	  var legends = group.legends,
	      legendItems = group.legendItems,
	      builder = this;
	
	  parseLegends(this._graph, this._def.legends, legends, group);
	  legends.forEach(function(l, i) {
	    var scale = l.size() || l.shape() || l.fill() || l.stroke(),
	        def = l.def(),
	        b = null;
	
	    legendItems[i] = {group: group, legend: l};
	    b = (def.type === Types.GROUP) ? new GroupBuilder() : new Builder();
	    b.init(builder._graph, def, legendItems[i], builder)
	      .dependency(Deps.SCALES, scale);
	    builder._children[group._id].push({ builder: b, type: Types.LEGEND, scale: scale });
	  });
	}
	
	module.exports = GroupBuilder;

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    Item = __webpack_require__(66).Item,
	    df = __webpack_require__(10),
	    Node = df.Node, // jshint ignore:line
	    Deps = df.Dependencies,
	    Tuple = df.Tuple,
	    ChangeSet = df.ChangeSet,
	    Sentinel = {},
	    Encoder  = __webpack_require__(158),
	    Bounder  = __webpack_require__(159),
	    parseData = __webpack_require__(107);
	
	function Builder() {
	  return arguments.length ? this.init.apply(this, arguments) : this;
	}
	
	var Status = Builder.STATUS = {
	  ENTER:  'enter',
	  UPDATE: 'update',
	  EXIT:   'exit'
	};
	
	var CONNECTED = 1, DISCONNECTED = 2;
	
	var proto = (Builder.prototype = new Node());
	
	proto.init = function(graph, def, mark, parent, parent_id, inheritFrom) {
	  Node.prototype.init.call(this, graph)
	    .router(true)
	    .collector(true);
	
	  this._def   = def;
	  this._mark  = mark;
	  this._from  = (def.from ? def.from.data : null) || inheritFrom;
	  this._ds    = dl.isString(this._from) ? graph.data(this._from) : null;
	  this._map   = {};
	  this._status = null; // Connected or disconnected?
	
	  mark.def = def;
	  mark.marktype = def.type;
	  mark.interactive = (def.interactive !== false);
	  mark.items = [];
	  if (dl.isValid(def.name)) mark.name = def.name;
	
	  this._parent = parent;
	  this._parent_id = parent_id;
	
	  if (def.from && (def.from.mark || def.from.transform || def.from.modify)) {
	    inlineDs.call(this);
	  }
	
	  // Non-group mark builders are super nodes. Encoder and Bounder remain
	  // separate operators but are embedded and called by Builder.evaluate.
	  this._isSuper = (this._def.type !== 'group');
	  this._encoder = new Encoder(this._graph, this._mark, this);
	  this._bounder = new Bounder(this._graph, this._mark);
	  this._output  = null; // Output changeset for reactive geom as Bounder reflows
	
	  if (this._ds) { this._encoder.dependency(Deps.DATA, this._from); }
	
	  // Since Builders are super nodes, copy over encoder dependencies
	  // (bounder has no registered dependencies).
	  this.dependency(Deps.DATA, this._encoder.dependency(Deps.DATA));
	  this.dependency(Deps.SCALES, this._encoder.dependency(Deps.SCALES));
	  this.dependency(Deps.SIGNALS, this._encoder.dependency(Deps.SIGNALS));
	
	  return this;
	};
	
	// Reactive geometry and mark-level transformations are handled here
	// because they need their group's data-joined context.
	function inlineDs() {
	  var from = this._def.from,
	      geom = from.mark,
	      src, name, spec, sibling, output, input, node;
	
	  if (geom) {
	    sibling = this.sibling(geom);
	    src  = sibling._isSuper ? sibling : sibling._bounder;
	    name = ['vg', this._parent_id, geom, src.listeners(true).length].join('_');
	    spec = {
	      name: name,
	      transform: from.transform,
	      modify: from.modify
	    };
	  } else {
	    src = this._graph.data(this._from);
	    if (!src) throw Error('Data source "'+this._from+'" is not defined.');
	    name = ['vg', this._from, this._def.type, src.listeners(true).length].join('_');
	    spec = {
	      name: name,
	      source: this._from,
	      transform: from.transform,
	      modify: from.modify
	    };
	  }
	
	  this._from = name;
	  this._ds = parseData.datasource(this._graph, spec);
	
	  if (geom) {
	    // Bounder reflows, so we need an intermediary node to propagate
	    // the output constructed by the Builder.
	    node = new Node(this._graph).addListener(this._ds.listener());
	    node.evaluate = function(input) { 
	      var out  = ChangeSet.create(input),
	          sout = sibling._output;
	
	      out.add = sout.add;
	      out.mod = sout.mod;
	      out.rem = sout.rem;
	      return out;
	    };
	    src.addListener(node);
	  } else {
	    // At this point, we have a new datasource but it is empty as
	    // the propagation cycle has already crossed the datasources.
	    // So, we repulse just this datasource. This should be safe
	    // as the ds isn't connected to the scenegraph yet.
	    output = this._ds.source().last();
	    input  = ChangeSet.create(output);
	
	    input.add = output.add;
	    input.mod = output.mod;
	    input.rem = output.rem;
	    input.stamp = null;
	    this._graph.propagate(input, this._ds.listener(), output.stamp);
	  }
	}
	
	proto.ds = function() { return this._ds; };
	proto.parent   = function() { return this._parent; };
	proto.encoder  = function() { return this._encoder; };
	proto.pipeline = function() { return [this]; };
	
	proto.connect = function() {
	  var builder = this;
	
	  this._graph.connect(this.pipeline());
	  this._encoder._scales.forEach(function(s) {
	    if (!(s = builder._parent.scale(s))) return;
	    s.addListener(builder);
	  });
	
	  if (this._parent) {
	    if (this._isSuper) this.addListener(this._parent._collector);
	    else this._bounder.addListener(this._parent._collector);
	  }
	
	  return (this._status = CONNECTED, this);
	};
	
	proto.disconnect = function() {
	  var builder = this;
	  if (!this._listeners.length) return this;
	
	  function disconnectScales(scales) {
	    for(var i=0, len=scales.length, s; i<len; ++i) {
	      if (!(s = builder._parent.scale(scales[i]))) continue;
	      s.removeListener(builder);
	    }
	  }
	
	  Node.prototype.disconnect.call(this);
	  this._graph.disconnect(this.pipeline());
	  disconnectScales(this._encoder._scales);
	  disconnectScales(dl.keys(this._mark._scaleRefs));
	
	  return (this._status = DISCONNECTED, this);
	};
	
	proto.sibling = function(name) {
	  return this._parent.child(name, this._parent_id);
	};
	
	proto.evaluate = function(input) {
	  log.debug(input, ['building', (this._from || this._def.from), this._def.type]);
	
	  var self = this,
	      def = this._mark.def,
	      props  = def.properties || {},
	      update = props.update   || {},
	      output = ChangeSet.create(input),
	      fullUpdate, fcs, data, name;
	
	  if (this._ds) {
	    // We need to determine if any encoder dependencies have been updated.
	    // However, the encoder's data source will likely be updated, and shouldn't
	    // trigger all items to mod.
	    data = output.data[(name=this._ds.name())];
	    output.data[name] = null;
	    fullUpdate = this._encoder.reevaluate(output);
	    output.data[name] = data;
	
	    fcs = this._ds.last();
	    if (!fcs) throw Error('Builder evaluated before backing DataSource.');
	    if (fcs.stamp > this._stamp) {
	      join.call(this, fcs, output, this._ds.values(), true, fullUpdate);
	    } else if (fullUpdate) {
	      output.mod = this._mark.items.slice();
	    }
	  } else {
	    data = dl.isFunction(this._def.from) ? this._def.from() : [Sentinel];
	    join.call(this, input, output, data);
	  }
	
	  // Stash output before Bounder for downstream reactive geometry.
	  this._output = output = this._graph.evaluate(output, this._encoder);
	
	  // Add any new scale references to the dependency list, and ensure
	  // they're connected.
	  if (update.nested && update.nested.length && this._status === CONNECTED) {
	    dl.keys(this._mark._scaleRefs).forEach(function(s) {
	      var scale = self._parent.scale(s);
	      if (!scale) return;
	
	      scale.addListener(self);
	      self.dependency(Deps.SCALES, s);
	      self._encoder.dependency(Deps.SCALES, s);
	    });
	  }
	
	  // Supernodes calculate bounds too, but only on items marked dirty.
	  if (this._isSuper) {
	    output.mod = output.mod.filter(function(x) { return x._dirty; });
	    output = this._graph.evaluate(output, this._bounder);
	  }
	
	  return output;
	};
	
	function newItem() {
	  var item = Tuple.ingest(new Item(this._mark));
	
	  // For the root node's item
	  if (this._def.width)  Tuple.set(item, 'width',  this._def.width);
	  if (this._def.height) Tuple.set(item, 'height', this._def.height);
	  return item;
	}
	
	function join(input, output, data, ds, fullUpdate) {
	  var keyf = keyFunction(this._def.key || (ds ? '_id' : null)),
	      prev = this._mark.items || [],
	      rem  = ds ? input.rem : prev,
	      mod  = Tuple.idMap((!ds || fullUpdate) ? data : input.mod),
	      next = [],
	      i, key, len, item, datum, enter, diff;
	
	  // Only mark rems as exiting. Due to keyf, there may be an add/mod
	  // tuple that replaces it.
	  for (i=0, len=rem.length; i<len; ++i) {
	    item = (rem[i] === prev[i]) ? prev[i] :
	      keyf ? this._map[keyf(rem[i])] : rem[i];
	    item.status = Status.EXIT;
	  }
	
	  for(i=0, len=data.length; i<len; ++i) {
	    datum = data[i];
	    item  = keyf ? this._map[key = keyf(datum)] : prev[i];
	    enter = item ? false : (item = newItem.call(this), true);
	    item.status = enter ? Status.ENTER : Status.UPDATE;
	    diff = !enter && item.datum !== datum;
	    item.datum = datum;
	
	    if (keyf) {
	      Tuple.set(item, 'key', key);
	      this._map[key] = item;
	    }
	
	    if (enter) {
	      output.add.push(item);
	    } else if (diff || mod[datum._id]) {
	      output.mod.push(item);
	    }
	
	    next.push(item);
	  }
	
	  for (i=0, len=rem.length; i<len; ++i) {
	    item = (rem[i] === prev[i]) ? prev[i] :
	      keyf ? this._map[key = keyf(rem[i])] : rem[i];
	    if (item.status === Status.EXIT) {
	      item._dirty = true;
	      input.dirty.push(item);
	      next.push(item);
	      output.rem.push(item);
	      if (keyf) this._map[key] = null;
	    }
	  }
	
	  return (this._mark.items = next, output);
	}
	
	function keyFunction(key) {
	  if (key == null) return null;
	  var f = dl.array(key).map(dl.accessor);
	  return function(d) {
	    for (var s='', i=0, n=f.length; i<n; ++i) {
	      if (i>0) s += '|';
	      s += String(f[i](d));
	    }
	    return s;
	  };
	}
	
	module.exports = Builder;


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    log = __webpack_require__(14),
	    df = __webpack_require__(10),
	    Node = df.Node, // jshint ignore:line
	    Deps = df.Dependencies,
	    bound = __webpack_require__(66).bound;
	
	var EMPTY = {};
	
	function Encoder(graph, mark, builder) {
	  var props  = mark.def.properties || {},
	      enter  = props.enter,
	      update = props.update,
	      exit   = props.exit;
	
	  Node.prototype.init.call(this, graph);
	
	  this._mark = mark;
	  this._builder = builder;
	  var s = this._scales = [];
	
	  // Only scales used in the 'update' property set are set as
	  // encoder depedencies to have targeted reevaluations. However,
	  // we still want scales in 'enter' and 'exit' to be evaluated
	  // before the encoder.
	  if (enter) s.push.apply(s, enter.scales);
	
	  if (update) {
	    this.dependency(Deps.DATA, update.data);
	    this.dependency(Deps.SIGNALS, update.signals);
	    this.dependency(Deps.FIELDS, update.fields);
	    this.dependency(Deps.SCALES, update.scales);
	    s.push.apply(s, update.scales);
	  }
	
	  if (exit) s.push.apply(s, exit.scales);
	
	  return this.mutates(true);
	}
	
	var proto = (Encoder.prototype = new Node());
	
	proto.evaluate = function(input) {
	  log.debug(input, ['encoding', this._mark.def.type]);
	  var graph = this._graph,
	      props = this._mark.def.properties || {},
	      items = this._mark.items,
	      enter  = props.enter,
	      update = props.update,
	      exit   = props.exit,
	      dirty  = input.dirty,
	      preds  = graph.predicates(),
	      req = input.request,
	      group = this._mark.group,
	      guide = group && (group.mark.axis || group.mark.legend),
	      db = EMPTY, sg = EMPTY, i, len, item, prop;
	
	  if (req && !guide) {
	    if ((prop = props[req]) && input.mod.length) {
	      db = prop.data ? graph.values(Deps.DATA, prop.data) : null;
	      sg = prop.signals ? graph.values(Deps.SIGNALS, prop.signals) : null;
	
	      for (i=0, len=input.mod.length; i<len; ++i) {
	        item = input.mod[i];
	        encode.call(this, prop, item, input.trans, db, sg, preds, dirty);
	      }
	    }
	
	    return input; // exit early if given request
	  }
	
	  db = values(Deps.DATA, graph, input, props);
	  sg = values(Deps.SIGNALS, graph, input, props);
	
	  // Items marked for removal are at the tail of items. Process them first.
	  for (i=0, len=input.rem.length; i<len; ++i) {
	    item = input.rem[i];
	    if (exit) encode.call(this, exit, item, input.trans, db, sg, preds, dirty);
	    if (input.trans && !exit) input.trans.interpolate(item, EMPTY);
	    else if (!input.trans) items.pop();
	  }
	
	  var update_status = __webpack_require__(157).STATUS.UPDATE;
	  for (i=0, len=input.add.length; i<len; ++i) {
	    item = input.add[i];
	    if (enter)  encode.call(this, enter,  item, input.trans, db, sg, preds, dirty);
	    if (update) encode.call(this, update, item, input.trans, db, sg, preds, dirty);
	    item.status = update_status;
	  }
	
	  if (update) {
	    for (i=0, len=input.mod.length; i<len; ++i) {
	      item = input.mod[i];
	      encode.call(this, update, item, input.trans, db, sg, preds, dirty);
	    }
	  }
	
	  return input;
	};
	
	// Only marshal necessary data and signal values
	function values(type, graph, input, props) {
	  var p, x, o, add = input.add.length;
	  if ((p=props.enter) && (x=p[type]).length && add) {
	    o = graph.values(type, x, (o=o||{}));
	  }
	  if ((p=props.exit) && (x=p[type]).length && input.rem.length) {
	    o = graph.values(type, x, (o=o||{}));
	  }
	  if ((p=props.update) && (x=p[type]).length && (add || input.mod.length)) {
	    o = graph.values(type, x, (o=o||{}));
	  }
	  return o || EMPTY;
	}
	
	function encode(prop, item, trans, db, sg, preds, dirty) {
	  var enc = prop.encode,
	      wasDirty = item._dirty,
	      isDirty  = enc.call(enc, item, item.mark.group||item, trans, db, sg, preds);
	
	  item._dirty = isDirty || wasDirty;
	  if (isDirty && !wasDirty) dirty.push(item);
	}
	
	// If a specified property set called, or update property set
	// uses nested fieldrefs, reevaluate all items.
	proto.reevaluate = function(pulse) {
	  var def = this._mark.def,
	      props = def.properties || {},
	      reeval = dl.isFunction(def.from) || def.orient || pulse.request ||
	        Node.prototype.reevaluate.call(this, pulse);
	
	  return reeval || (props.update ? nestedRefs.call(this) : false);
	};
	
	// Test if any nested refs trigger a reflow of mark items.
	function nestedRefs() {
	  var refs = this._mark.def.properties.update.nested,
	      parent = this._builder,
	      level = 0,
	      i = 0, len = refs.length,
	      ref, ds, stamp;
	
	  for (; i<len; ++i) {
	    ref = refs[i];
	
	    // Scale references are resolved via this._mark._scaleRefs which are
	    // added to dependency lists + connected in Builder.evaluate.
	    if (ref.scale) continue;
	
	    for (; level<ref.level; ++level) {
	      parent = parent.parent();
	      ds = parent.ds();
	    }
	
	    // Compare stamps to determine if a change in a group's properties
	    // or data should trigger a reeval. We cannot check anything fancier
	    // (e.g., pulse.fields) as the ref may use item.datum.
	    stamp = (ref.group ? parent.encoder() : ds.last())._stamp;
	    if (stamp > this._stamp) return true;
	  }
	
	  return false;
	}
	
	// Short-circuit encoder if user specifies items
	Encoder.update = function(graph, trans, request, items, dirty) {
	  items = dl.array(items);
	  var preds = graph.predicates(),
	      db = graph.values(Deps.DATA),
	      sg = graph.values(Deps.SIGNALS),
	      i, len, item, props, prop;
	
	  for (i=0, len=items.length; i<len; ++i) {
	    item = items[i];
	    props = item.mark.def.properties;
	    prop = props && props[request];
	    if (prop) {
	      encode.call(null, prop, item, trans, db, sg, preds, dirty);
	      bound.item(item);
	    }
	  }
	
	};
	
	module.exports = Encoder;


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    scene = __webpack_require__(66),
	    Node = df.Node, // jshint ignore:line
	    log = __webpack_require__(14),
	    bound = scene.bound,
	    Bounds = scene.Bounds,
	    Encoder = __webpack_require__(158);
	
	function Bounder(graph, mark) {
	  this._mark = mark;
	  return Node.prototype.init.call(this, graph)
	    .router(true)
	    .reflows(true)
	    .mutates(true);
	}
	
	var proto = (Bounder.prototype = new Node());
	
	proto.evaluate = function(input) {
	  log.debug(input, ['bounds', this._mark.marktype]);
	
	  var mark  = this._mark,
	      type  = mark.marktype,
	      isGrp = type === 'group',
	      items = mark.items,
	      hasLegends = dl.array(mark.def.legends).length > 0,
	      bounds  = mark.bounds,
	      rebound = !bounds || input.rem.length,
	      i, ilen, j, jlen, group, legend;
	
	  if (type === 'line' || type === 'area') {
	    bound.mark(mark, null, isGrp && !hasLegends);
	  } else {
	    input.add.forEach(function(item) {
	      bound.item(item);
	      rebound = rebound || (bounds && !bounds.encloses(item.bounds));
	    });
	
	    input.mod.forEach(function(item) {
	      rebound = rebound || (bounds && bounds.alignsWith(item.bounds));
	      bound.item(item);
	    });
	
	    if (rebound) {
	      bounds = mark.bounds && mark.bounds.clear() || (mark.bounds = new Bounds());
	      for (i=0, ilen=items.length; i<ilen; ++i) bounds.union(items[i].bounds);
	    }
	  }
	
	  if (isGrp && hasLegends) {
	    for (i=0, ilen=items.length; i<ilen; ++i) {
	      group = items[i];
	      group._legendPositions = null;
	      for (j=0, jlen=group.legendItems.length; j<jlen; ++j) {
	        legend = group.legendItems[j];
	        Encoder.update(this._graph, input.trans, 'legendPosition', legend.items, input.dirty);
	        bound.mark(legend, null, false);
	      }
	    }
	
	    bound.mark(mark, null, true);
	  }
	
	  return df.ChangeSet.create(input, true);
	};
	
	module.exports = Bounder;


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    log = __webpack_require__(14),
	    Node = df.Node, // jshint ignore:line
	    Deps = df.Dependencies,
	    Aggregate = __webpack_require__(110);
	
	var Properties = {
	  width: 1,
	  height: 1
	};
	
	var Types = {
	  LINEAR: 'linear',
	  ORDINAL: 'ordinal',
	  LOG: 'log',
	  POWER: 'pow',
	  SQRT: 'sqrt',
	  TIME: 'time',
	  TIME_UTC: 'utc',
	  QUANTILE: 'quantile',
	  QUANTIZE: 'quantize',
	  THRESHOLD: 'threshold'
	};
	
	var DataRef = {
	  DOMAIN: 'domain',
	  RANGE: 'range',
	
	  COUNT: 'count',
	  GROUPBY: 'groupby',
	  MIN: 'min',
	  MAX: 'max',
	  VALUE: 'value',
	
	  ASC: 'asc',
	  DESC: 'desc'
	};
	
	function Scale(graph, def, parent) {
	  this._def     = def;
	  this._parent  = parent;
	  this._updated = false;
	  return Node.prototype.init.call(this, graph).reflows(true);
	}
	
	var proto = (Scale.prototype = new Node());
	
	proto.evaluate = function(input) {
	  var self = this,
	      fn = function(group) { scale.call(self, group); };
	
	  this._updated = false;
	  input.add.forEach(fn);
	  input.mod.forEach(fn);
	
	  // Scales are at the end of an encoding pipeline, so they should forward a
	  // reflow pulse. Thus, if multiple scales update in the parent group, we don't
	  // reevaluate child marks multiple times.
	  if (this._updated) {
	    input.scales[this._def.name] = 1;
	    log.debug(input, ["scale", this._def.name]);
	  }
	  return df.ChangeSet.create(input, true);
	};
	
	// All of a scale's dependencies are registered during propagation as we parse
	// dataRefs. So a scale must be responsible for connecting itself to dependents.
	proto.dependency = function(type, deps) {
	  if (arguments.length == 2) {
	    var method = (type === Deps.DATA ? 'data' : 'signal');
	    deps = dl.array(deps);
	    for (var i=0, len=deps.length; i<len; ++i) {
	      this._graph[method](deps[i]).addListener(this._parent);
	    }
	  }
	
	  return Node.prototype.dependency.call(this, type, deps);
	};
	
	function scale(group) {
	  var name = this._def.name,
	      prev = name + ':prev',
	      s = instance.call(this, group.scale(name)),
	      m = s.type===Types.ORDINAL ? ordinal : quantitative,
	      rng = range.call(this, group);
	
	  m.call(this, s, rng, group);
	
	  group.scale(name, s);
	  group.scale(prev, group.scale(prev) || s);
	
	  return s;
	}
	
	function instance(scale) {
	  var config = this._graph.config(),
	      type = this._def.type || Types.LINEAR;
	  if (!scale || type !== scale.type) {
	    var ctor = config.scale[type] || d3.scale[type];
	    if (!ctor) throw Error('Unrecognized scale type: ' + type);
	    (scale = ctor()).type = scale.type || type;
	    scale.scaleName = this._def.name;
	    scale._prev = {};
	  }
	  return scale;
	}
	
	function ordinal(scale, rng, group) {
	  var def = this._def,
	      prev = scale._prev,
	      dataDrivenRange = false,
	      pad = signal.call(this, def.padding) || 0,
	      outer = def.outerPadding == null ? pad : signal.call(this, def.outerPadding),
	      points = def.points && signal.call(this, def.points),
	      round = signal.call(this, def.round) || def.round == null,
	      domain, str, spatial=true;
	
	  // range pre-processing for data-driven ranges
	  if (dl.isObject(def.range) && !dl.isArray(def.range)) {
	    dataDrivenRange = true;
	    rng = dataRef.call(this, DataRef.RANGE, def.range, scale, group);
	  }
	
	  // domain
	  domain = dataRef.call(this, DataRef.DOMAIN, def.domain, scale, group);
	  if (domain && !dl.equal(prev.domain, domain)) {
	    scale.domain(domain);
	    prev.domain = domain;
	    this._updated = true;
	  }
	
	  // range
	  if (!dl.equal(prev.range, rng)) {
	    // width-defined range
	    if (def.bandSize) {
	      var bw = signal.call(this, def.bandSize),
	          len = domain.length,
	          space = def.points ? (pad*bw) : (pad*bw*(len-1) + 2*outer),
	          start;
	      if (rng[0] > rng[1]) {
	        start = rng[1] || 0;
	        rng = [start + (bw * len + space), start];
	      } else {
	        start = rng[0] || 0;
	        rng = [start, start + (bw * len + space)];
	      }
	
	      if (def.reverse) rng = rng.reverse();
	    }
	
	    str = typeof rng[0] === 'string';
	    if (str || rng.length > 2 || rng.length===1 || dataDrivenRange) {
	      scale.range(rng); // color or shape values
	      spatial = false;
	    } else if (points && round) {
	      scale.rangeRoundPoints(rng, pad);
	    } else if (points) {
	      scale.rangePoints(rng, pad);
	    } else if (round) {
	      scale.rangeRoundBands(rng, pad, outer);
	    } else {
	      scale.rangeBands(rng, pad, outer);
	    }
	
	    prev.range = rng;
	    this._updated = true;
	  }
	
	  if (!scale.invert && spatial) invertOrdinal(scale);
	}
	
	// "Polyfill" ordinal scale inversion. Currently, only ordinal scales
	// with ordered numeric ranges are supported.
	var bisect = d3.bisector(dl.numcmp).right,
	    findAsc = function(a, x) { return bisect(a,x) - 1; },
	    findDsc = d3.bisector(function(a,b) { return -1 * dl.numcmp(a,b); }).left;
	
	function invertOrdinal(scale) {
	  scale.invert = function(x, y) {
	    var rng = scale.range(),
	        asc = rng[0] < rng[1],
	        find = asc ? findAsc : findDsc;
	
	    if (arguments.length === 1) {
	      if (!dl.isNumber(x)) {
	        throw Error('Ordinal scale inversion is only supported for numeric input ('+x+').');
	      }
	      return scale.domain()[find(rng, x)];
	
	    } else if (arguments.length === 2) {  // Invert extents
	      if (!dl.isNumber(x) || !dl.isNumber(y)) {
	        throw Error('Extents to ordinal invert are not numbers ('+x+', '+y+').');
	      }
	
	      var domain = scale.domain(),
	          a = find(rng, x),
	          b = find(rng, y),
	          n = rng.length - 1, r;
	      if (b < a) { r = a; a = b; b = a; } // ensure a <= b
	      if (a < 0) a = 0;
	      if (b > n) b = n;
	
	      return (asc ? dl.range(a, b+1) : dl.range(b, a-1, -1))
	        .map(function(i) { return domain[i]; });
	    }
	  };
	}
	
	function quantitative(scale, rng, group) {
	  var def = this._def,
	      prev = scale._prev,
	      round = signal.call(this, def.round),
	      exponent = signal.call(this, def.exponent),
	      clamp = signal.call(this, def.clamp),
	      nice = signal.call(this, def.nice),
	      domain, interval;
	
	  // domain
	  domain = (def.type === Types.QUANTILE) ?
	    dataRef.call(this, DataRef.DOMAIN, def.domain, scale, group) :
	    domainMinMax.call(this, scale, group);
	  if (domain && !dl.equal(prev.domain, domain)) {
	    scale.domain(domain);
	    prev.domain = domain;
	    this._updated = true;
	  }
	
	  // range
	  // vertical scales should flip by default, so use XOR here
	  if (signal.call(this, def.range) === 'height') rng = rng.reverse();
	  if (rng && !dl.equal(prev.range, rng)) {
	    scale[round && scale.rangeRound ? 'rangeRound' : 'range'](rng);
	    prev.range = rng;
	    this._updated = true;
	  }
	
	  if (exponent && def.type===Types.POWER) scale.exponent(exponent);
	  if (clamp) scale.clamp(true);
	  if (nice) {
	    if (def.type === Types.TIME) {
	      interval = d3.time[nice];
	      if (!interval) log.error('Unrecognized interval: ' + interval);
	      scale.nice(interval);
	    } else {
	      scale.nice();
	    }
	  }
	}
	
	function isUniques(scale) {
	  return scale.type === Types.ORDINAL || scale.type === Types.QUANTILE;
	}
	
	function getRefs(def) {
	  return def.fields || dl.array(def);
	}
	
	function inherits(refs) {
	  return refs.some(function(r) {
	    if (!r.data) return true;
	    return r.data && dl.array(r.field).some(function(f) {
	      return f.parent;
	    });
	  });
	}
	
	function getFields(ref, group) {
	  return dl.array(ref.field).map(function(f) {
	    return f.parent ?
	      dl.accessor(f.parent)(group.datum) :
	      f; // String or {'signal'}
	  });
	}
	
	// Scale datarefs can be computed over multiple schema types.
	// This function determines the type of aggregator created, and
	// what data is sent to it: values, tuples, or multi-tuples that must
	// be standardized into a consistent schema.
	function aggrType(def, scale) {
	  var refs = getRefs(def);
	
	  // If we're operating over only a single domain, send full tuples
	  // through for efficiency (fewer accessor creations/calls)
	  if (refs.length == 1 && dl.array(refs[0].field).length == 1) {
	    return Aggregate.TYPES.TUPLE;
	  }
	
	  // With quantitative scales, we only care about min/max.
	  if (!isUniques(scale)) return Aggregate.TYPES.VALUE;
	
	  // If we don't sort, then we can send values directly to aggrs as well
	  if (!dl.isObject(def.sort)) return Aggregate.TYPES.VALUE;
	
	  return Aggregate.TYPES.MULTI;
	}
	
	function getCache(which, def, scale, group) {
	  var refs = getRefs(def),
	      inherit = inherits(refs),
	      atype = aggrType(def, scale),
	      uniques = isUniques(scale),
	      sort = def.sort,
	      ck = '_'+which,
	      fields = getFields(refs[0], group);
	
	  if (scale[ck] || this[ck]) return scale[ck] || this[ck];
	
	  var cache = new Aggregate(this._graph).type(atype),
	      groupby, summarize;
	
	  // If a scale's dataref doesn't inherit data from the group, we can
	  // store the dataref aggregator at the Scale (dataflow node) level.
	  if (inherit) {
	    scale[ck] = cache;
	  } else {
	    this[ck]  = cache;
	  }
	
	  if (uniques) {
	    if (atype === Aggregate.TYPES.VALUE) {
	      groupby = [{ name: DataRef.GROUPBY, get: dl.identity }];
	      summarize = {'*': DataRef.COUNT};
	    } else if (atype === Aggregate.TYPES.TUPLE) {
	      groupby = [{ name: DataRef.GROUPBY, get: dl.$(fields[0]) }];
	      summarize = dl.isObject(sort) ? [{
	        field: DataRef.VALUE,
	        get:  dl.$(sort.field),
	        ops: [sort.op]
	      }] : {'*': DataRef.COUNT};
	    } else {  // atype === Aggregate.TYPES.MULTI
	      groupby   = DataRef.GROUPBY;
	      summarize = [{ field: DataRef.VALUE, ops: [sort.op] }];
	    }
	  } else {
	    groupby = [];
	    summarize = [{
	      field: DataRef.VALUE,
	      get: (atype == Aggregate.TYPES.TUPLE) ? dl.$(fields[0]) : dl.identity,
	      ops: [DataRef.MIN, DataRef.MAX],
	      as:  [DataRef.MIN, DataRef.MAX]
	    }];
	  }
	
	  cache.param('groupby', groupby)
	    .param('summarize', summarize);
	
	  return (cache._lastUpdate = -1, cache);
	}
	
	function dataRef(which, def, scale, group) {
	  if (def == null) { return []; }
	  if (dl.isArray(def)) return def.map(signal.bind(this));
	
	  var self = this, graph = this._graph,
	      refs = getRefs(def),
	      inherit = inherits(refs),
	      atype = aggrType(def, scale),
	      cache = getCache.apply(this, arguments),
	      sort  = def.sort,
	      uniques = isUniques(scale),
	      i, rlen, j, flen, ref, fields, field, data, from, cmp;
	
	  function addDep(s) {
	    self.dependency(Deps.SIGNALS, s);
	  }
	
	  if (inherit || (!inherit && cache._lastUpdate < this._stamp)) {
	    for (i=0, rlen=refs.length; i<rlen; ++i) {
	      ref = refs[i];
	      from = ref.data || group.datum._facetID;
	      data = graph.data(from).last();
	
	      if (data.stamp <= this._stamp) continue;
	
	      fields = getFields(ref, group);
	      for (j=0, flen=fields.length; j<flen; ++j) {
	        field = fields[j];
	
	        if (atype === Aggregate.TYPES.VALUE) {
	          cache.accessors(null, field);
	        } else if (atype === Aggregate.TYPES.MULTI) {
	          cache.accessors(field, ref.sort || sort.field);
	        } // Else (Tuple-case) is handled by the aggregator accessors by default
	
	        cache.evaluate(data);
	      }
	
	      this.dependency(Deps.DATA, from);
	      cache.dependency(Deps.SIGNALS).forEach(addDep);
	    }
	
	    cache._lastUpdate = this._stamp;
	
	    data = cache.aggr().result();
	    if (uniques) {
	      if (dl.isObject(sort)) {
	        cmp = sort.op + '_' + DataRef.VALUE;
	        cmp = dl.comparator(cmp);
	      } else if (sort === true) {
	        cmp = dl.comparator(DataRef.GROUPBY);
	      }
	
	      if (cmp) data = data.sort(cmp);
	      cache._values = data.map(function(d) { return d[DataRef.GROUPBY]; });
	    } else {
	      data = data[0];
	      cache._values = !dl.isValid(data) ? [] : [data[DataRef.MIN], data[DataRef.MAX]];
	    }
	  }
	
	  return cache._values;
	}
	
	function signal(v) {
	  if (!v || !v.signal) return v;
	  var s = v.signal, ref;
	  this.dependency(Deps.SIGNALS, (ref = dl.field(s))[0]);
	  return this._graph.signalRef(ref);
	}
	
	function domainMinMax(scale, group) {
	  var def = this._def,
	      domain = [null, null], s, z;
	
	  if (def.domain !== undefined) {
	    domain = (!dl.isObject(def.domain)) ? domain :
	      dataRef.call(this, DataRef.DOMAIN, def.domain, scale, group);
	  }
	
	  z = domain.length - 1;
	  if (def.domainMin !== undefined) {
	    if (dl.isObject(def.domainMin)) {
	      if (def.domainMin.signal) {
	        domain[0] = dl.isValid(s=signal.call(this, def.domainMin)) ? s : domain[0];
	      } else {
	        domain[0] = dataRef.call(this, DataRef.DOMAIN+DataRef.MIN, def.domainMin, scale, group)[0];
	      }
	    } else {
	      domain[0] = def.domainMin;
	    }
	  }
	  if (def.domainMax !== undefined) {
	    if (dl.isObject(def.domainMax)) {
	      if (def.domainMax.signal) {
	        domain[z] = dl.isValid(s=signal.call(this, def.domainMax)) ? s : domain[z];
	      } else {
	        domain[z] = dataRef.call(this, DataRef.DOMAIN+DataRef.MAX, def.domainMax, scale, group)[1];
	      }
	    } else {
	      domain[z] = def.domainMax;
	    }
	  }
	  if (def.type !== Types.LOG && def.type !== Types.TIME && (def.zero || def.zero===undefined)) {
	    domain[0] = Math.min(0, domain[0]);
	    domain[z] = Math.max(0, domain[z]);
	  }
	  return domain;
	}
	
	function range(group) {
	  var def = this._def,
	      config = this._graph.config(),
	      rangeVal = signal.call(this, def.range),
	      rng = [null, null];
	
	  if (rangeVal !== undefined) {
	    if (typeof rangeVal === 'string') {
	      if (Properties[rangeVal]) {
	        rng = [0, group[rangeVal]];
	      } else if (config.range[rangeVal]) {
	        rng = config.range[rangeVal];
	      } else {
	        log.error('Unrecogized range: ' + rangeVal);
	        return rng;
	      }
	    } else if (dl.isArray(rangeVal)) {
	      rng = dl.duplicate(rangeVal).map(signal.bind(this));
	    } else if (dl.isObject(rangeVal)) {
	      return null; // early exit
	    } else {
	      rng = [0, rangeVal];
	    }
	  }
	  if (def.rangeMin !== undefined) {
	    rng[0] = def.rangeMin.signal ?
	      signal.call(this, def.rangeMin) :
	      def.rangeMin;
	  }
	  if (def.rangeMax !== undefined) {
	    rng[rng.length-1] = def.rangeMax.signal ?
	      signal.call(this, def.rangeMax) :
	      def.rangeMax;
	  }
	
	  if (def.reverse !== undefined) {
	    var rev = signal.call(this, def.reverse);
	    if (dl.isObject(rev)) {
	      rev = dl.accessor(rev.field)(group.datum);
	    }
	    if (rev) rng = rng.reverse();
	  }
	
	  return rng;
	}
	
	module.exports = Scale;
	
	var rangeDef = [
	  {"enum": ["width", "height", "shapes", "category10", "category20", "category20b", "category20c"]},
	  {
	    "type": "array",
	    "items": {"oneOf": [{"type":"string"}, {"type": "number"}, {"$ref": "#/refs/signal"}]}
	  },
	  {"$ref": "#/refs/signal"}
	];
	
	Scale.schema = {
	  "refs": {
	    "data": {
	      "type": "object",
	      "properties": {
	        "data": {
	          "oneOf": [
	            {"type": "string"},
	            {
	              "type": "object",
	              "properties": {
	                "fields": {
	                  "type": "array",
	                  "items": {"$ref": "#/refs/data"}
	                }
	              },
	              "required": ["fields"]
	            }
	          ]
	        },
	        "field": {
	          "oneOf": [
	            {"type": "string"},
	            {
	              "type": "array",
	              "items": {"type": "string"}
	            },
	            {
	              "type": "object",
	              "properties": {
	                "parent": {"type": "string"}
	              },
	              "required": ["parent"]
	            },
	            {
	              "type": "array",
	              "items": {
	                "type": "object",
	                "properties": {
	                  "parent": {"type": "string"}
	                },
	                "required": ["parent"]
	              }
	            }
	          ]
	        },
	        "sort": {
	          "oneOf": [{"type": "boolean"}, {
	            "type": "object",
	            "properties": {
	              "field": {"type": "string"},
	              "op": {"enum": __webpack_require__(110).VALID_OPS}
	            }
	          }]
	        }
	      },
	      "additionalProperties": false
	    }
	  },
	
	  "defs": {
	    "scale": {
	      "title": "Scale function",
	      "type": "object",
	
	      "allOf": [{
	        "properties": {
	          "name": {"type": "string"},
	
	          "type": {
	            "enum": [Types.LINEAR, Types.ORDINAL, Types.TIME, Types.TIME_UTC, Types.LOG,
	              Types.POWER, Types.SQRT, Types.QUANTILE, Types.QUANTIZE, Types.THRESHOLD],
	            "default": Types.LINEAR
	          },
	
	          "domain": {
	            "oneOf": [
	              {
	                "type": "array",
	                "items": {
	                  "oneOf": [
	                    {"type":"string"},
	                    {"type": "number"},
	                    {"$ref": "#/refs/signal"}
	                  ]
	                }
	              },
	              {"$ref": "#/refs/data"}
	            ]
	          },
	
	          "domainMin": {
	            "oneOf": [
	              {"type": "number"},
	              {"$ref": "#/refs/data"},
	              {"$ref": "#/refs/signal"}
	            ]
	          },
	
	          "domainMax": {
	            "oneOf": [
	              {"type": "number"},
	              {"$ref": "#/refs/data"},
	              {"$ref": "#/refs/signal"}
	            ]
	          },
	
	          "rangeMin": {
	            "oneOf": [
	              {"type":"string"},
	              {"type": "number"},
	              {"$ref": "#/refs/signal"}
	            ]
	          },
	
	          "rangeMax": {
	            "oneOf": [
	              {"type":"string"},
	              {"type": "number"},
	              {"$ref": "#/refs/signal"}
	            ]
	          },
	
	          "reverse": {
	            "oneOf": [
	              {"type": "boolean"},
	              {"$ref": "#/refs/data"}
	            ],
	          },
	          "round": {"type": "boolean"}
	        },
	
	        "required": ["name"]
	      }, {
	        "oneOf": [{
	          "properties": {
	            "type": {"enum": [Types.ORDINAL]},
	
	            "range": {
	              "oneOf": rangeDef.concat({"$ref": "#/refs/data"})
	            },
	
	            "points": {"oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}]},
	            "padding": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	            "outerPadding": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]},
	            "bandSize": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]}
	          },
	          "required": ["type"]
	        }, {
	          "properties": {
	            "type": {"enum": [Types.TIME, Types.TIME_UTC]},
	            "range": {"oneOf": rangeDef},
	            "clamp": {"oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}]},
	            "nice": {"oneOf": [{"enum": ["second", "minute", "hour",
	              "day", "week", "month", "year"]}, {"$ref": "#/refs/signal"}]}
	          },
	          "required": ["type"]
	        }, {
	          "anyOf": [{
	            "properties": {
	              "type": {"enum": [Types.LINEAR, Types.LOG, Types.POWER, Types.SQRT,
	                Types.QUANTILE, Types.QUANTIZE, Types.THRESHOLD], "default": Types.LINEAR},
	              "range": {"oneOf": rangeDef},
	              "clamp": {"oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}]},
	              "nice": {"oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}]},
	              "zero": {"oneOf": [{"type": "boolean"}, {"$ref": "#/refs/signal"}]}
	            }
	          }, {
	            "properties": {
	              "type": {"enum": [Types.POWER]},
	              "exponent": {"oneOf": [{"type": "number"}, {"$ref": "#/refs/signal"}]}
	            },
	            "required": ["type"]
	          }]
	        }]
	      }]
	    }
	  }
	};


/***/ },
/* 161 */
/***/ function(module, exports) {

	module.exports = function visit(node, func) {
	  var i, n, s, m, items;
	  if (func(node)) return true;
	
	  var sets = ['items', 'axisItems', 'legendItems'];
	  for (s=0, m=sets.length; s<m; ++s) {
	    if ((items = node[sets[s]])) {
	      for (i=0, n=items.length; i<n; ++i) {
	        if (visit(items[i], func)) return true;
	      }
	    }
	  }
	};


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    config = {};
	
	config.load = {
	  // base url for loading external data files
	  // used only for server-side operation
	  baseURL: '',
	  // Allows domain restriction when using data loading via XHR.
	  // To enable, set it to a list of allowed domains
	  // e.g., ['wikipedia.org', 'eff.org']
	  domainWhiteList: false
	};
	
	// inset padding for automatic padding calculation
	config.autopadInset = 5;
	
	// extensible scale lookup table
	// all d3.scale.* instances also supported
	config.scale = {
	  time: d3.time.scale,
	  utc:  d3.time.scale.utc
	};
	
	// default rendering settings
	config.render = {
	  retina: true
	};
	
	// root scenegraph group
	config.scene = {
	  fill: undefined,
	  fillOpacity: undefined,
	  stroke: undefined,
	  strokeOpacity: undefined,
	  strokeWidth: undefined,
	  strokeDash: undefined,
	  strokeDashOffset: undefined
	};
	
	// default axis properties
	config.axis = {
	  orient: 'bottom',
	  ticks: 10,
	  padding: 3,
	  axisColor: '#000',
	  axisWidth: 1,
	  gridColor: '#000',
	  gridOpacity: 0.15,
	  tickColor: '#000',
	  tickLabelColor: '#000',
	  tickWidth: 1,
	  tickSize: 6,
	  tickLabelFontSize: 11,
	  tickLabelFont: 'sans-serif',
	  titleColor: '#000',
	  titleFont: 'sans-serif',
	  titleFontSize: 11,
	  titleFontWeight: 'bold',
	  titleOffset: 'auto',
	  titleOffsetAutoMin: 30,
	  titleOffsetAutoMax: Infinity,
	  titleOffsetAutoMargin: 4
	};
	
	// default legend properties
	config.legend = {
	  orient: 'right',
	  offset: 20,
	  padding: 3, // padding between legend items and border
	  margin: 2,  // extra margin between two consecutive legends
	  gradientStrokeColor: '#888',
	  gradientStrokeWidth: 1,
	  gradientHeight: 16,
	  gradientWidth: 100,
	  labelColor: '#000',
	  labelFontSize: 10,
	  labelFont: 'sans-serif',
	  labelAlign: 'left',
	  labelBaseline: 'middle',
	  labelOffset: 8,
	  symbolShape: 'circle',
	  symbolSize: 50,
	  symbolColor: '#888',
	  symbolStrokeWidth: 1,
	  titleColor: '#000',
	  titleFont: 'sans-serif',
	  titleFontSize: 11,
	  titleFontWeight: 'bold'
	};
	
	// default color values
	config.color = {
	  rgb: [128, 128, 128],
	  lab: [50, 0, 0],
	  hcl: [0, 0, 50],
	  hsl: [0, 0, 0.5]
	};
	
	// default scale ranges
	config.range = {
	  category10:  d3.scale.category10().range(),
	  category20:  d3.scale.category20().range(),
	  category20b: d3.scale.category20b().range(),
	  category20c: d3.scale.category20c().range(),
	  shapes: [
	    'circle',
	    'cross',
	    'diamond',
	    'square',
	    'triangle-down',
	    'triangle-up'
	  ]
	};
	
	module.exports = config;


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    sg = __webpack_require__(66).render,
	    log = __webpack_require__(14),
	    Deps = df.Dependencies,
	    parseStreams = __webpack_require__(164),
	    Encoder = __webpack_require__(158),
	    Transition = __webpack_require__(165);
	
	function View(el, width, height) {
	  this._el    = null;
	  this._model = null;
	  this._width   = this.__width = width || 500;
	  this._height  = this.__height = height || 300;
	  this._bgcolor = null;
	  this._cursor  = true; // Set cursor based on hover propset?
	  this._autopad = 1;
	  this._padding = {top:0, left:0, bottom:0, right:0};
	  this._viewport = null;
	  this._renderer = null;
	  this._handler  = null;
	  this._streamer = null; // Targeted update for streaming changes
	  this._skipSignals = false; // Batch set signals can skip reevaluation.
	  this._changeset = null;
	  this._repaint = true; // Full re-render on every re-init
	  this._renderers = sg;
	  this._io  = null;
	  this._api = {}; // Stash streaming data API sandboxes.
	}
	
	var prototype = View.prototype;
	
	prototype.model = function(model) {
	  if (!arguments.length) return this._model;
	  if (this._model !== model) {
	    this._model = model;
	    this._streamer = new df.Node(model);
	    this._streamer._rank = -1;  // HACK: To reduce re-ranking churn.
	    this._changeset = df.ChangeSet.create();
	    if (this._handler) this._handler.model(model);
	  }
	  return this;
	};
	
	// Sandboxed streaming data API
	function streaming(src) {
	  var view = this,
	      ds = this._model.data(src);
	  if (!ds) return log.error('Data source "'+src+'" is not defined.');
	
	  var listener = ds.pipeline()[0],
	      streamer = this._streamer,
	      api = {};
	
	  // If we have it stashed, don't create a new closure.
	  if (this._api[src]) return this._api[src];
	
	  api.insert = function(vals) {
	    ds.insert(dl.duplicate(vals));  // Don't pollute the environment
	    streamer.addListener(listener);
	    view._changeset.data[src] = 1;
	    return api;
	  };
	
	  api.update = function() {
	    streamer.addListener(listener);
	    view._changeset.data[src] = 1;
	    return (ds.update.apply(ds, arguments), api);
	  };
	
	  api.remove = function() {
	    streamer.addListener(listener);
	    view._changeset.data[src] = 1;
	    return (ds.remove.apply(ds, arguments), api);
	  };
	
	  api.values = function() { return ds.values(); };
	
	  return (this._api[src] = api);
	}
	
	prototype.data = function(data) {
	  var v = this;
	  if (!arguments.length) return v._model.values();
	  else if (dl.isString(data)) return streaming.call(v, data);
	  else if (dl.isObject(data)) {
	    dl.keys(data).forEach(function(k) {
	      var api = streaming.call(v, k);
	      data[k](api);
	    });
	  }
	  return this;
	};
	
	var VIEW_SIGNALS = dl.toMap(['width', 'height', 'padding']);
	
	prototype.signal = function(name, value, skip) {
	  var m = this._model,
	      key, values;
	
	  // Getter. Returns the value for the specified signal, or
	  // returns all signal values.
	  if (!arguments.length) {
	    return m.values(Deps.SIGNALS);
	  } else if (arguments.length === 1 && dl.isString(name)) {
	    return m.values(Deps.SIGNALS, name);
	  }
	
	  // Setter. Can be done in batch or individually. In either case,
	  // the final argument determines if set signals should be skipped.
	  if (dl.isObject(name)) {
	    values = name;
	    skip = value;
	  } else {
	    values = {};
	    values[name] = value;
	  }
	  for (key in values) {
	    if (VIEW_SIGNALS[key]) {
	      this[key](values[key]);
	    } else {
	      setSignal.call(this, key, values[key]);
	    }
	  }
	  return (this._skipSignals = skip, this);
	};
	
	function setSignal(name, value) {
	  var cs = this._changeset,
	      sg = this._model.signal(name);
	  if (!sg) return log.error('Signal "'+name+'" is not defined.');
	
	  this._streamer.addListener(sg.value(value));
	  cs.signals[name] = 1;
	  cs.reflow = true;
	}
	
	prototype.width = function(width) {
	  if (!arguments.length) return this.__width;
	  if (this.__width !== width) {
	    this._width = this.__width = width;
	    this.model().width(width);
	    this.initialize();
	    if (this._strict) this._autopad = 1;
	    setSignal.call(this, 'width', width);
	  }
	  return this;
	};
	
	prototype.height = function(height) {
	  if (!arguments.length) return this.__height;
	  if (this.__height !== height) {
	    this._height = this.__height = height;
	    this.model().height(height);
	    this.initialize();
	    if (this._strict) this._autopad = 1;
	    setSignal.call(this, 'height', height);
	  }
	  return this;
	};
	
	prototype.background = function(bgcolor) {
	  if (!arguments.length) return this._bgcolor;
	  if (this._bgcolor !== bgcolor) {
	    this._bgcolor = bgcolor;
	    this.initialize();
	  }
	  return this;
	};
	
	prototype.padding = function(pad) {
	  if (!arguments.length) return this._padding;
	  if (this._padding !== pad) {
	    if (dl.isString(pad)) {
	      this._autopad = 1;
	      this._padding = {top:0, left:0, bottom:0, right:0};
	      this._strict = (pad === 'strict');
	    } else {
	      this._autopad = 0;
	      this._padding = pad;
	      this._strict = false;
	    }
	    if (this._renderer) this._renderer.resize(this._width, this._height, this._padding);
	    if (this._handler)  this._handler.padding(this._padding);
	    setSignal.call(this, 'padding', this._padding);
	  }
	  return (this._repaint = true, this);
	};
	
	prototype.autopad = function(opt) {
	  if (this._autopad < 1) return this;
	  else this._autopad = 0;
	
	  var b = this.model().scene().bounds,
	      pad = this._padding,
	      config = this.model().config(),
	      inset = config.autopadInset,
	      l = b.x1 < 0 ? Math.ceil(-b.x1) + inset : 0,
	      t = b.y1 < 0 ? Math.ceil(-b.y1) + inset : 0,
	      r = b.x2 > this._width  ? Math.ceil(+b.x2 - this._width) + inset : 0;
	  b = b.y2 > this._height ? Math.ceil(+b.y2 - this._height) + inset : 0;
	  pad = {left:l, top:t, right:r, bottom:b};
	
	  if (this._strict) {
	    this._autopad = 0;
	    this._padding = pad;
	    this._width = Math.max(0, this.__width - (l+r));
	    this._height = Math.max(0, this.__height - (t+b));
	
	    this._model.width(this._width).height(this._height).reset();
	    setSignal.call(this, 'width', this._width);
	    setSignal.call(this, 'height', this._height);
	    setSignal.call(this, 'padding', pad);
	
	    this.initialize().update({props:'enter'}).update({props:'update'});
	  } else {
	    this.padding(pad).update(opt);
	  }
	  return this;
	};
	
	prototype.viewport = function(size) {
	  if (!arguments.length) return this._viewport;
	  if (this._viewport !== size) {
	    this._viewport = size;
	    this.initialize();
	  }
	  return this;
	};
	
	prototype.renderer = function(type) {
	  if (!arguments.length) return this._renderer;
	  if (this._renderers[type]) type = this._renderers[type];
	  else if (dl.isString(type)) throw new Error('Unknown renderer: ' + type);
	  else if (!type) throw new Error('No renderer specified');
	
	  if (this._io !== type) {
	    this._io = type;
	    this._renderer = null;
	    this.initialize();
	    if (this._build) this.render();
	  }
	  return this;
	};
	
	prototype.initialize = function(el) {
	  var v = this, prevHandler,
	      w = v._width, h = v._height, pad = v._padding, bg = v._bgcolor,
	      config = this.model().config();
	
	  if (!arguments.length || el === null) {
	    el = this._el ? this._el.parentNode : null;
	    if (!el) return this;  // This View cannot init w/o an
	  }
	
	  // clear pre-existing container
	  d3.select(el).select('div.vega').remove();
	
	  // add div container
	  this._el = el = d3.select(el)
	    .append('div')
	    .attr('class', 'vega')
	    .style('position', 'relative')
	    .node();
	  if (v._viewport) {
	    d3.select(el)
	      .style('width',  (v._viewport[0] || w)+'px')
	      .style('height', (v._viewport[1] || h)+'px')
	      .style('overflow', 'auto');
	  }
	
	  // renderer
	  sg.canvas.Renderer.RETINA = config.render.retina;
	  v._renderer = (v._renderer || new this._io.Renderer(config.load))
	    .initialize(el, w, h, pad)
	    .background(bg);
	
	  // input handler
	  prevHandler = v._handler;
	  v._handler = new this._io.Handler()
	    .initialize(el, pad, v);
	
	  if (prevHandler) {
	    prevHandler.handlers().forEach(function(h) {
	      v._handler.on(h.type, h.handler);
	    });
	  } else {
	    // Register event listeners for signal stream definitions.
	    v._detach = parseStreams(this);
	  }
	
	  return (this._repaint = true, this);
	};
	
	prototype.destroy = function() {
	  if (this._detach) this._detach();
	};
	
	function build() {
	  var v = this;
	  v._renderNode = new df.Node(v._model)
	    .router(true);
	
	  v._renderNode.evaluate = function(input) {
	    log.debug(input, ['rendering']);
	
	    var s = v._model.scene(),
	        h = v._handler;
	
	    if (h && h.scene) h.scene(s);
	
	    if (input.trans) {
	      input.trans.start(function(items) { v._renderer.render(s, items); });
	    } else if (v._repaint) {
	      v._renderer.render(s);
	    } else if (input.dirty.length) {
	      v._renderer.render(s, input.dirty);
	    }
	
	    if (input.dirty.length) {
	      input.dirty.forEach(function(i) { i._dirty = false; });
	      s.items[0]._dirty = false;
	    }
	
	    v._repaint = v._skipSignals = false;
	    return input;
	  };
	
	  return (v._model.scene(v._renderNode), true);
	}
	
	prototype.update = function(opt) {
	  opt = opt || {};
	  var v = this,
	      model = this._model,
	      streamer = this._streamer,
	      cs = this._changeset,
	      trans = opt.duration ? new Transition(opt.duration, opt.ease) : null;
	
	  if (trans) cs.trans = trans;
	  if (opt.props !== undefined) {
	    if (dl.keys(cs.data).length > 0) {
	      throw Error(
	        'New data values are not reflected in the visualization.' +
	        ' Please call view.update() before updating a specified property set.'
	      );
	    }
	
	    cs.reflow  = true;
	    cs.request = opt.props;
	  }
	
	  var built = v._build;
	  v._build = v._build || build.call(this);
	
	  // If specific items are specified, short-circuit dataflow graph.
	  // Else-If there are streaming updates, perform a targeted propagation.
	  // Otherwise, re-evaluate the entire model (datasources + scene).
	  if (opt.items && built) {
	    Encoder.update(model, opt.trans, opt.props, opt.items, cs.dirty);
	    v._renderNode.evaluate(cs);
	  } else if (streamer.listeners().length && built) {
	    // Include re-evaluation entire model when repaint flag is set
	    if (this._repaint) streamer.addListener(model.node());
	    model.propagate(cs, streamer, null, this._skipSignals);
	    streamer.disconnect();
	  } else {
	    model.fire(cs);
	  }
	
	  v._changeset = df.ChangeSet.create();
	
	  return v.autopad(opt);
	};
	
	prototype.toImageURL = function(type) {
	  var v = this, Renderer;
	
	  // lookup appropriate renderer
	  switch (type || 'png') {
	    case 'canvas':
	    case 'png':
	      Renderer = sg.canvas.Renderer; break;
	    case 'svg':
	      Renderer = sg.svg.string.Renderer; break;
	    default: throw Error('Unrecognized renderer type: ' + type);
	  }
	
	  var retina = sg.canvas.Renderer.RETINA;
	  sg.canvas.Renderer.RETINA = false; // ignore retina screen
	
	  // render the scenegraph
	  var ren = new Renderer(v._model.config.load)
	    .initialize(null, v._width, v._height, v._padding)
	    .render(v._model.scene());
	
	  sg.canvas.Renderer.RETINA = retina; // restore retina settings
	
	  // return data url
	  if (type === 'svg') {
	    var blob = new Blob([ren.svg()], {type: 'image/svg+xml'});
	    return window.URL.createObjectURL(blob);
	  } else {
	    return ren.canvas().toDataURL('image/png');
	  }
	};
	
	prototype.render = function(items) {
	  this._renderer.render(this._model.scene(), items);
	  return this;
	};
	
	prototype.on = function() {
	  this._handler.on.apply(this._handler, arguments);
	  return this;
	};
	
	prototype.onSignal = function(name, handler) {
	  var sg = this._model.signal(name);
	  return (sg ?
	    sg.on(handler) : log.error('Signal "'+name+'" is not defined.'), this);
	};
	
	prototype.off = function() {
	  this._handler.off.apply(this._handler, arguments);
	  return this;
	};
	
	prototype.offSignal = function(name, handler) {
	  var sg = this._model.signal(name);
	  return (sg ?
	    sg.off(handler) : log.error('Signal "'+name+'" is not defined.'), this);
	};
	
	View.factory = function(model) {
	  var HeadlessView = __webpack_require__(166);
	  return function(opt) {
	    opt = opt || {};
	    var defs = model.defs();
	    var v = (opt.el ? new View() : new HeadlessView())
	      .model(model)
	      .renderer(opt.renderer || 'canvas')
	      .width(defs.width)
	      .height(defs.height)
	      .background(defs.background)
	      .padding(defs.padding)
	      .viewport(defs.viewport)
	      .initialize(opt.el);
	
	    if (opt.data) v.data(opt.data);
	
	    // Register handlers for the hover propset and cursors.
	    if (opt.el) {
	      if (opt.hover !== false) {
	        v.on('mouseover', function(evt, item) {
	          if (item && item.hasPropertySet('hover')) {
	            this.update({props:'hover', items:item});
	          }
	        })
	        .on('mouseout', function(evt, item) {
	          if (item && item.hasPropertySet('hover')) {
	            this.update({props:'update', items:item});
	          }
	        });
	      }
	
	      if (opt.cursor !== false) {
	        // If value is a string, it is a custom value set by the user.
	        // In this case, the user is responsible for maintaining the cursor state
	        // and control only reverts back to this handler if set back to 'default'.
	        v.onSignal('cursor', function(name, value) {
	          var body = d3.select('body');
	          if (dl.isString(value)) {
	            v._cursor = value === 'default';
	            body.style('cursor', value);
	          } else if (dl.isObject(value) && v._cursor) {
	            body.style('cursor', value.default);
	          }
	        });
	      }
	    }
	
	    return v;
	  };
	};
	
	module.exports = View;


/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    dl = __webpack_require__(18),
	    df = __webpack_require__(10),
	    selector = __webpack_require__(141),
	    parseSignals = __webpack_require__(153);
	
	var GATEKEEPER = '_vgGATEKEEPER',
	    EVALUATOR  = '_vgEVALUATOR';
	
	var vgEvent = {
	  getItem: function() { return this.item; },
	  getGroup: function(name) { return name ? this.name[name] : this.group; },
	  getXY: function(item) {
	      var p = {x: this.x, y: this.y};
	      if (typeof item === 'string') {
	        item = this.name[item];
	      }
	      for (; item; item = item.mark && item.mark.group) {
	        p.x -= item.x || 0;
	        p.y -= item.y || 0;
	      }
	      return p;
	    },
	  getX: function(item) { return this.getXY(item).x; },
	  getY: function(item) { return this.getXY(item).y; }
	};
	
	function parseStreams(view) {
	  var model = view.model(),
	      trueFn  = model.expr('true'),
	      falseFn = model.expr('false'),
	      spec    = model.defs().signals,
	      registry = {handlers: {}, nodes: {}},
	      internal = dl.duplicate(registry),  // Internal event processing
	      external = dl.duplicate(registry);  // External event processing
	
	  dl.array(spec).forEach(function(sig) {
	    var signal = model.signal(sig.name);
	    if (sig.expr) return;  // Cannot have an expr and stream definition.
	
	    dl.array(sig.streams).forEach(function(stream) {
	      var sel = selector.parse(stream.type),
	          exp = model.expr(stream.expr);
	      mergedStream(signal, sel, exp, stream);
	    });
	  });
	
	  // We register the event listeners all together so that if multiple
	  // signals are registered on the same event, they will receive the
	  // new value on the same pulse.
	  dl.keys(internal.handlers).forEach(function(type) {
	    view.on(type, function(evt, item) {
	      evt.preventDefault(); // stop text selection
	      extendEvent(evt, item);
	      fire(internal, type, (item && item.datum) || {}, evt);
	    });
	  });
	
	  // add external event listeners
	  dl.keys(external.handlers).forEach(function(type) {
	    if (typeof window === 'undefined') return; // No external support
	
	    var h = external.handlers[type],
	        t = type.split(':'), // --> no element pseudo-selectors
	        elt = (t[0] === 'window') ? [window] :
	              window.document.querySelectorAll(t[0]);
	
	    function handler(evt) {
	      extendEvent(evt);
	      fire(external, type, d3.select(this).datum(), evt);
	    }
	
	    for (var i=0; i<elt.length; ++i) {
	      elt[i].addEventListener(t[1], handler);
	    }
	
	    h.elements = elt;
	    h.listener = handler;
	  });
	
	  // remove external event listeners
	  external.detach = function() {
	    dl.keys(external.handlers).forEach(function(type) {
	      var h = external.handlers[type],
	          t = type.split(':'),
	          elt = dl.array(h.elements);
	
	      for (var i=0; i<elt.length; ++i) {
	        elt[i].removeEventListener(t[1], h.listener);
	      }
	    });
	  };
	
	  // export detach method
	  return external.detach;
	
	  // -- helper functions -----
	
	  function extendEvent(evt, item) {
	    var mouse = d3.mouse((d3.event=evt, view.renderer().scene())),
	        pad = view.padding(),
	        names = {}, mark, group, i;
	
	    if (item) {
	      mark = item.mark;
	      group = mark.marktype === 'group' ? item : mark.group;
	      for (i=item; i!=null; i=i.mark.group) {
	        if (i.mark.def.name) {
	          names[i.mark.def.name] = i;
	        }
	      }
	    }
	    names.root = view.model().scene().items[0];
	
	    evt.vg = Object.create(vgEvent);
	    evt.vg.group = group;
	    evt.vg.item = item || {};
	    evt.vg.name = names;
	    evt.vg.x = mouse[0] - pad.left;
	    evt.vg.y = mouse[1] - pad.top;
	  }
	
	  function fire(registry, type, datum, evt) {
	    var handlers = registry.handlers[type],
	        node = registry.nodes[type],
	        cs = df.ChangeSet.create(null, true),
	        filtered = false,
	        val, i, n, h;
	
	    function invoke(f) {
	      return !f.fn(datum, evt);
	    }
	
	    for (i=0, n=handlers.length; i<n; ++i) {
	      h = handlers[i];
	      filtered = h.filters.some(invoke);
	      if (filtered) continue;
	
	      val = h.exp.fn(datum, evt);
	      if (h.spec.scale) {
	        val = parseSignals.scale(model, h.spec, val, datum, evt);
	      }
	
	      if (val !== h.signal.value() || h.signal.verbose()) {
	        h.signal.value(val);
	        cs.signals[h.signal.name()] = 1;
	      }
	    }
	
	    model.propagate(cs, node);
	  }
	
	  function mergedStream(sig, selector, exp, spec) {
	    selector.forEach(function(s) {
	      if (s.event)       domEvent(sig, s, exp, spec);
	      else if (s.signal) signal(sig, s, exp, spec);
	      else if (s.start)  orderedStream(sig, s, exp, spec);
	      else if (s.stream) mergedStream(sig, s.stream, exp, spec);
	    });
	  }
	
	  function domEvent(sig, selector, exp, spec) {
	    var evt = selector.event,
	        name = selector.name,
	        mark = selector.mark,
	        target   = selector.target,
	        filters  = dl.array(selector.filters),
	        registry = target ? external : internal,
	        type = target ? target+':'+evt : evt,
	        node = registry.nodes[type] || (registry.nodes[type] = new df.Node(model)),
	        handlers = registry.handlers[type] || (registry.handlers[type] = []);
	
	    if (name) {
	      filters.push('!!event.vg.name["' + name + '"]'); // Mimic event bubbling
	    } else if (mark) {
	      filters.push('event.vg.item.mark && event.vg.item.mark.marktype==='+dl.str(mark));
	    }
	
	    handlers.push({
	      signal: sig,
	      exp: exp,
	      spec: spec,
	      filters: filters.map(function(f) { return model.expr(f); })
	    });
	
	    node.addListener(sig);
	  }
	
	  function signal(sig, selector, exp, spec) {
	    var n = sig.name(), s = model.signal(n+EVALUATOR, null);
	    s.evaluate = function(input) {
	      if (!input.signals[selector.signal]) return model.doNotPropagate;
	      var val = exp.fn();
	      if (spec.scale) {
	        val = parseSignals.scale(model, spec, val);
	      }
	
	      if (val !== sig.value() || sig.verbose()) {
	        sig.value(val);
	        input.signals[n] = 1;
	        input.reflow = true;
	      }
	
	      return input;
	    };
	    s.dependency(df.Dependencies.SIGNALS, selector.signal);
	    s.addListener(sig);
	    model.signal(selector.signal).addListener(s);
	  }
	
	  function orderedStream(sig, selector, exp, spec) {
	    var name = sig.name(),
	        gk = name + GATEKEEPER,
	        middle  = selector.middle,
	        filters = middle.filters || (middle.filters = []),
	        gatekeeper = model.signal(gk) || model.signal(gk, false);
	
	    // Register an anonymous signal to act as a gatekeeper. Its value is
	    // true or false depending on whether the start or end streams occur.
	    // The middle signal then simply filters for the gatekeeper's value.
	    mergedStream(gatekeeper, [selector.start], trueFn, {});
	    mergedStream(gatekeeper, [selector.end], falseFn, {});
	
	    filters.push(gatekeeper.name());
	    mergedStream(sig, [selector.middle], exp, spec);
	  }
	}
	
	module.exports = parseStreams;
	parseStreams.schema = {
	  "defs": {
	    "streams": {
	      "type": "array",
	      "items": {
	        "type": "object",
	
	        "properties": {
	          "type": {"type": "string"},
	          "expr": {"type": "string"},
	          "scale": {"$ref": "#/refs/scopedScale"}
	        },
	
	        "additionalProperties": false,
	        "required": ["type", "expr"]
	      }
	    }
	  }
	};


/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	var d3 = __webpack_require__(63),
	    bound = __webpack_require__(66).bound,
	    Tuple = __webpack_require__(10).Tuple,
	    Status = __webpack_require__(157).STATUS;
	
	function Transition(duration, ease) {
	  this.duration = duration || 500;
	  this.ease = ease && d3.ease(ease) || d3.ease('cubic-in-out');
	  this.updates = {next: null};
	}
	
	var prototype = Transition.prototype;
	
	var skip = {
	  'text': 1,
	  'url':  1
	};
	
	prototype.interpolate = function(item, values) {
	  var key, curr, next, interp, list = null;
	
	  for (key in values) {
	    curr = item[key];
	    next = values[key];
	    if (curr !== next) {
	      if (skip[key] || curr === undefined) {
	        // skip interpolation for specific keys or undefined start values
	        Tuple.set(item, key, next);
	      } else if (typeof curr === 'number' && !isFinite(curr)) {
	        // for NaN or infinite numeric values, skip to final value
	        Tuple.set(item, key, next);
	      } else {
	        // otherwise lookup interpolator
	        interp = d3.interpolate(curr, next);
	        interp.property = key;
	        (list || (list=[])).push(interp);
	      }
	    }
	  }
	
	  if (list === null && item.status === Status.EXIT) {
	    list = []; // ensure exiting items are included
	  }
	
	  if (list != null) {
	    list.item = item;
	    list.ease = item.mark.ease || this.ease;
	    list.next = this.updates.next;
	    this.updates.next = list;
	  }
	  return this;
	};
	
	prototype.start = function(callback) {
	  var t = this, prev = t.updates, curr = prev.next;
	  for (; curr!=null; prev=curr, curr=prev.next) {
	    if (curr.item.status === Status.EXIT) {
	      // Only mark item as exited when it is removed.
	      curr.item.status = Status.UPDATE;
	      curr.remove = true;
	    }
	  }
	  t.callback = callback;
	  d3.timer(function(elapsed) { return step.call(t, elapsed); });
	};
	
	function step(elapsed) {
	  var list = this.updates, prev = list, curr = prev.next,
	      duration = this.duration,
	      item, delay, f, e, i, n, stop = true;
	
	  for (; curr!=null; prev=curr, curr=prev.next) {
	    item = curr.item;
	    delay = item.delay || 0;
	
	    f = (elapsed - delay) / duration;
	    if (f < 0) { stop = false; continue; }
	    if (f > 1) f = 1;
	    e = curr.ease(f);
	
	    for (i=0, n=curr.length; i<n; ++i) {
	      item[curr[i].property] = curr[i](e);
	    }
	    item.touch();
	    bound.item(item);
	
	    if (f === 1) {
	      if (curr.remove) {
	        item.status = Status.EXIT;
	        item.remove();
	      }
	      prev.next = curr.next;
	      curr = prev;
	    } else {
	      stop = false;
	    }
	  }
	
	  this.callback();
	  return stop;
	}
	
	module.exports = Transition;


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	var sg = __webpack_require__(66).render,
	    canvas = sg.canvas,
	    svg = sg.svg.string,
	    View = __webpack_require__(163);
	
	function HeadlessView(width, height, model) {
	  View.call(this, width, height, model);
	  this._type = 'canvas';
	  this._renderers = {canvas: canvas, svg: svg};
	}
	
	var prototype = (HeadlessView.prototype = new View());
	
	prototype.renderer = function(type) {
	  if(type) this._type = type;
	  return View.prototype.renderer.apply(this, arguments);
	};
	
	prototype.canvas = function() {
	  return (this._type === 'canvas') ? this._renderer.canvas() : null;
	};
	
	prototype.canvasAsync = function(callback) {
	  var r = this._renderer, view = this;
	
	  function wait() {
	    if (r.pendingImages() === 0) {
	      view.render(); // re-render with all images
	      callback(view.canvas());
	    } else {
	      setTimeout(wait, 10);
	    }
	  }
	
	  // if images loading, poll until ready
	  if (this._type !== 'canvas') return null;
	  if (r.pendingImages() > 0) { wait(); } else { callback(this.canvas()); }
	};
	
	prototype.svg = function() {
	  return (this._type === 'svg') ? this._renderer.svg() : null;
	};
	
	prototype.initialize = function() {
	  var w = this._width,
	      h = this._height,
	      bg  = this._bgcolor,
	      pad = this._padding,
	      config = this.model().config();
	
	  if (this._viewport) {
	    w = this._viewport[0] - (pad ? pad.left + pad.right : 0);
	    h = this._viewport[1] - (pad ? pad.top + pad.bottom : 0);
	  }
	
	  this._renderer = (this._renderer || new this._io.Renderer(config.load))
	    .initialize(null, w, h, pad)
	    .background(bg);
	
	  return this;
	};
	
	module.exports = HeadlessView;


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	var dl = __webpack_require__(18),
	    parse = __webpack_require__(58),
	    Scale = __webpack_require__(160),
	    config = __webpack_require__(162);
	
	function compile(module, opt, schema) {
	  var s = module.schema;
	  if (!s) return;
	  if (s.refs) dl.extend(schema.refs, s.refs);
	  if (s.defs) dl.extend(schema.defs, s.defs);
	}
	
	module.exports = function(opt) {
	  var schema = null;
	  opt = opt || {};
	
	  // Compile if we're not loading the schema from a URL.
	  // Load from a URL to extend the existing base schema.
	  if (opt.url) {
	    schema = dl.json(dl.extend({url: opt.url}, config.load));
	  } else {
	    schema = {
	      "$schema": "http://json-schema.org/draft-04/schema#",
	      "title": "Vega Visualization Specification Language",
	      "defs": {},
	      "refs": {},
	      "$ref": "#/defs/spec"
	    };
	
	    dl.keys(parse).forEach(function(k) { compile(parse[k], opt, schema); });
	
	    // Scales aren't in the parser, add schema manually
	    compile(Scale, opt, schema);
	  }
	
	  // Extend schema to support custom mark properties or property sets.
	  if (opt.properties) dl.keys(opt.properties).forEach(function(k) {
	    schema.defs.propset.properties[k] = {"$ref": "#/refs/"+opt.properties[k]+"Value"};
	  });
	
	  if (opt.propertySets) dl.keys(opt.propertySets).forEach(function(k) {
	    schema.defs.mark.properties.properties.properties[k] = {"$ref": "#/defs/propset"};
	  });
	
	  return schema;
	};


/***/ },
/* 168 */
/***/ function(module, exports) {

	module.exports = [
		"@let",
		[
			[
				"event",
				[
					"@if",
					[
						"@eq",
						[
							"@get",
							"axis"
						],
						"x"
					],
					"eventX()",
					"eventY()"
				]
			],
			[
				"sizeSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"size"
					]
				]
			],
			[
				"pointSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"point"
					]
				]
			],
			[
				"deltaSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"delta"
					]
				]
			],
			[
				"anchorSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"anchor"
					]
				]
			],
			[
				"zoomSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"zoom"
					]
				]
			],
			[
				"minAnchorSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"minanchor"
					]
				]
			],
			[
				"maxAnchorSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"maxanchor"
					]
				]
			],
			[
				"minSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"min"
					]
				]
			],
			[
				"maxSignal",
				[
					"@join",
					"",
					[
						[
							"@get",
							"axis"
						],
						"max"
					]
				]
			]
		],
		{
			"signals": [
				{
					"name": [
						"@get",
						"sizeSignal"
					],
					"init": [
						"@get",
						"size"
					]
				},
				{
					"name": [
						"@get",
						"pointSignal"
					],
					"init": 0,
					"streams": [
						{
							"type": "mousedown",
							"expr": [
								"@get",
								"event"
							]
						}
					]
				},
				{
					"name": [
						"@get",
						"deltaSignal"
					],
					"init": 0,
					"streams": [
						{
							"type": "[mousedown, window:mouseup] > window:mousemove",
							"expr": [
								"@join",
								"",
								[
									"@if",
									[
										"@eq",
										[
											"@get",
											"axis"
										],
										"x"
									],
									[
										[
											"@get",
											"pointSignal"
										],
										" - ",
										[
											"@get",
											"event"
										]
									],
									[
										[
											"@get",
											"event"
										],
										" - ",
										[
											"@get",
											"pointSignal"
										]
									]
								]
							]
						}
					]
				},
				{
					"name": [
						"@get",
						"anchorSignal"
					],
					"init": 0,
					"streams": [
						{
							"type": "mousemove, wheel",
							"expr": [
								"@get",
								"event"
							],
							"scale": {
								"name": [
									"@get",
									"axis"
								],
								"invert": true
							}
						}
					]
				},
				{
					"name": [
						"@get",
						"zoomSignal"
					],
					"init": 1,
					"streams": [
						{
							"type": "wheel",
							"expr": "pow(1.001, event.deltaY)"
						}
					]
				},
				{
					"name": [
						"@get",
						"minAnchorSignal"
					],
					"streams": [
						{
							"type": "mousedown, mouseup, wheel",
							"expr": [
								"@if",
								[
									"@eq",
									[
										"@get",
										"axis"
									],
									"x"
								],
								"0",
								[
									"@get",
									"sizeSignal"
								]
							],
							"scale": {
								"name": [
									"@get",
									"axis"
								],
								"invert": true
							}
						}
					]
				},
				{
					"name": [
						"@get",
						"maxAnchorSignal"
					],
					"streams": [
						{
							"type": "mousedown, mouseup, wheel",
							"expr": [
								"@if",
								[
									"@eq",
									[
										"@get",
										"axis"
									],
									"x"
								],
								[
									"@get",
									"sizeSignal"
								],
								"0"
							],
							"scale": {
								"name": [
									"@get",
									"axis"
								],
								"invert": true
							}
						}
					]
				},
				{
					"name": [
						"@get",
						"minSignal"
					],
					"init": [
						"@get",
						"domain.0",
						null
					],
					"streams": [
						{
							"type": [
								"@get",
								"deltaSignal"
							],
							"expr": [
								"@if",
								[
									"@get",
									"pan",
									true
								],
								[
									"@if",
									[
										"@eq",
										[
											"@get",
											"type"
										],
										"time"
									],
									[
										"@join",
										"",
										[
											"time(",
											[
												"@get",
												"minAnchorSignal"
											],
											") + (time(",
											[
												"@get",
												"maxAnchorSignal"
											],
											")-time(",
											[
												"@get",
												"minAnchorSignal"
											],
											"))*",
											[
												"@get",
												"deltaSignal"
											],
											"/",
											[
												"@get",
												"sizeSignal"
											]
										]
									],
									[
										"@join",
										"",
										[
											[
												"@get",
												"minAnchorSignal"
											],
											" + (",
											[
												"@get",
												"maxAnchorSignal"
											],
											"-",
											[
												"@get",
												"minAnchorSignal"
											],
											")*",
											[
												"@get",
												"deltaSignal"
											],
											"/",
											[
												"@get",
												"sizeSignal"
											]
										]
									]
								],
								[
									"@get",
									"minAnchorSignal"
								]
							]
						},
						{
							"type": [
								"@get",
								"zoomSignal"
							],
							"expr": [
								"@if",
								[
									"@get",
									"zoom",
									true
								],
								[
									"@if",
									[
										"@eq",
										[
											"@get",
											"type"
										],
										"time"
									],
									[
										"@join",
										"",
										[
											"(time(",
											[
												"@get",
												"minAnchorSignal"
											],
											")-time(",
											[
												"@get",
												"anchorSignal"
											],
											"))*",
											[
												"@get",
												"zoomSignal"
											],
											" + time(",
											[
												"@get",
												"anchorSignal"
											],
											")"
										]
									],
									[
										"@join",
										"",
										[
											"(",
											[
												"@get",
												"minAnchorSignal"
											],
											"-",
											[
												"@get",
												"anchorSignal"
											],
											")*",
											[
												"@get",
												"zoomSignal"
											],
											" + ",
											[
												"@get",
												"anchorSignal"
											]
										]
									]
								],
								[
									"@get",
									"minAnchorSignal"
								]
							]
						}
					]
				},
				{
					"name": [
						"@get",
						"maxSignal"
					],
					"init": [
						"@get",
						"domain.1",
						null
					],
					"streams": [
						{
							"type": [
								"@get",
								"deltaSignal"
							],
							"expr": [
								"@if",
								[
									"@get",
									"pan",
									true
								],
								[
									"@if",
									[
										"@eq",
										[
											"@get",
											"type"
										],
										"time"
									],
									[
										"@join",
										"",
										[
											"time(",
											[
												"@get",
												"maxAnchorSignal"
											],
											") + (time(",
											[
												"@get",
												"maxAnchorSignal"
											],
											")-time(",
											[
												"@get",
												"minAnchorSignal"
											],
											"))*",
											[
												"@get",
												"deltaSignal"
											],
											"/",
											[
												"@get",
												"sizeSignal"
											]
										]
									],
									[
										"@join",
										"",
										[
											[
												"@get",
												"maxAnchorSignal"
											],
											" + (",
											[
												"@get",
												"maxAnchorSignal"
											],
											"-",
											[
												"@get",
												"minAnchorSignal"
											],
											")*",
											[
												"@get",
												"deltaSignal"
											],
											"/",
											[
												"@get",
												"sizeSignal"
											]
										]
									]
								],
								[
									"@get",
									"maxAnchorSignal"
								]
							]
						},
						{
							"type": [
								"@get",
								"zoomSignal"
							],
							"expr": [
								"@if",
								[
									"@get",
									"zoom",
									true
								],
								[
									"@if",
									[
										"@eq",
										[
											"@get",
											"type"
										],
										"time"
									],
									[
										"@join",
										"",
										[
											"(time(",
											[
												"@get",
												"maxAnchorSignal"
											],
											")-time(",
											[
												"@get",
												"anchorSignal"
											],
											"))*",
											[
												"@get",
												"zoomSignal"
											],
											" + time(",
											[
												"@get",
												"anchorSignal"
											],
											")"
										]
									],
									[
										"@join",
										"",
										[
											"(",
											[
												"@get",
												"maxAnchorSignal"
											],
											"-",
											[
												"@get",
												"anchorSignal"
											],
											")*",
											[
												"@get",
												"zoomSignal"
											],
											" + ",
											[
												"@get",
												"anchorSignal"
											]
										]
									]
								],
								[
									"@get",
									"maxAnchorSignal"
								]
							]
						}
					]
				}
			],
			"scales": [
				{
					"name": [
						"@get",
						"axis"
					],
					"type": [
						"@get",
						"type",
						"linear"
					],
					"range": [
						"@if",
						[
							"@eq",
							[
								"@get",
								"axis"
							],
							"x"
						],
						[
							0,
							[
								"@get",
								"size"
							]
						],
						[
							[
								"@get",
								"size"
							],
							0
						]
					],
					"points": [
						"@get",
						"points",
						false
					],
					"zero": [
						"@get",
						"zero",
						false
					],
					"padding": [
						"@get",
						"padding",
						0
					],
					"domain": [
						"@get",
						"domain"
					],
					"domainMin": {
						"signal": [
							"@get",
							"minSignal"
						]
					},
					"domainMax": {
						"signal": [
							"@get",
							"maxSignal"
						]
					}
				}
			],
			"axes": [
				{
					"type": [
						"@get",
						"axis"
					],
					"scale": [
						"@get",
						"axis"
					],
					"grid": [
						"@get",
						"grid",
						false
					],
					"layer": "back",
					"title": [
						"@get",
						"title",
						""
					]
				}
			]
		}
	];

/***/ },
/* 169 */
/***/ function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"x",
				"x"
			],
			[
				"y",
				"y"
			]
		],
		{
			"width": [
				"@get",
				"width",
				800
			],
			"height": [
				"@get",
				"height",
				500
			],
			"padding": [
				"@get",
				"padding",
				{
					"top": 20,
					"bottom": 50,
					"left": 50,
					"right": 10
				}
			],
			"predicates": [
				{
					"name": "tooltip",
					"type": "==",
					"operands": [
						{
							"signal": "d._id"
						},
						{
							"arg": "id"
						}
					]
				}
			],
			"data": [
				{
					"name": "series",
					"values": [
						"@get",
						"values"
					]
				}
			],
			"signals": [
				{
					"name": "d",
					"init": {},
					"streams": [
						{
							"type": "rect:mouseover",
							"expr": "datum"
						},
						{
							"type": "rect:mouseout",
							"expr": "{}"
						}
					]
				}
			],
			"scales": [
				{
					"name": "x",
					"type": "ordinal",
					"range": "width",
					"domain": {
						"data": "series",
						"field": [
							"@get",
							"x"
						]
					}
				},
				{
					"name": "y",
					"type": [
						"@get",
						"yAxis.type",
						"linear"
					],
					"range": "height",
					"zero": true,
					"domain": {
						"data": "series",
						"field": [
							"@get",
							"y"
						]
					}
				}
			],
			"axes": [
				{
					"type": "x",
					"scale": "x",
					"layer": "back",
					"title": [
						"@get",
						"xAxis.title",
						""
					]
				},
				{
					"type": "y",
					"scale": "y",
					"layer": "back",
					"title": [
						"@get",
						"yAxis.title",
						""
					]
				}
			],
			"marks": [
				{
					"type": "rect",
					"from": {
						"data": "series"
					},
					"properties": {
						"enter": {
							"x": {
								"scale": "x",
								"field": [
									"@get",
									"x"
								],
								"offset": 1
							},
							"width": {
								"scale": "x",
								"band": true,
								"offset": -1
							},
							"y": {
								"scale": "y",
								"field": [
									"@get",
									"y"
								]
							},
							"y2": {
								"scale": "y",
								"value": 0
							}
						},
						"update": {
							"fill": {
								"value": [
									"@get",
									"fill",
									"steelblue"
								]
							}
						},
						"hover": {
							"fill": {
								"value": [
									"@get",
									"hover",
									"red"
								]
							}
						}
					}
				},
				{
					"type": "text",
					"properties": {
						"enter": {
							"align": {
								"value": "center"
							},
							"fill": {
								"value": "#333"
							}
						},
						"update": {
							"x": {
								"scale": "x",
								"signal": [
									"@join",
									"",
									[
										"d['",
										[
											"@get",
											"x"
										],
										"']"
									]
								]
							},
							"dx": {
								"scale": "x",
								"band": true,
								"mult": 0.5
							},
							"y": {
								"scale": "y",
								"signal": [
									"@join",
									"",
									[
										"d['",
										[
											"@get",
											"y"
										],
										"']"
									]
								],
								"offset": -5
							},
							"text": {
								"template": [
									"@get",
									"tooltip",
									[
										"@join",
										"",
										[
											"{{d['",
											[
												"@get",
												"x"
											],
											"']}}: {{d['",
											[
												"@get",
												"y"
											],
											"']}}"
										]
									]
								]
							},
							"fillOpacity": {
								"rule": [
									{
										"predicate": {
											"name": "tooltip",
											"id": {
												"value": null
											}
										},
										"value": 0
									},
									{
										"value": 1
									}
								]
							}
						}
					}
				}
			]
		}
	];

/***/ },
/* 170 */
/***/ function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"group",
				"key"
			],
			[
				"boxSize",
				0.75
			],
			[
				"capSize",
				0.5
			],
			[
				"orient",
				"horizontal"
			],
			[
				"horiz",
				[
					"@eq",
					[
						"@get",
						"orient"
					],
					"horizontal"
				]
			],
			[
				"valueAxis",
				[
					"@if",
					[
						"@get",
						"horiz"
					],
					"x",
					"y"
				]
			],
			[
				"categoryAxis",
				[
					"@if",
					[
						"@get",
						"horiz"
					],
					"y",
					"x"
				]
			]
		],
		[
			"@merge",
			[
				"@apply",
				"axis",
				[
					"@merge",
					[
						"@if",
						[
							"@get",
							"horiz"
						],
						[
							"@get",
							"xAxis"
						],
						[
							"@get",
							"yAxis"
						]
					],
					{
						"axis": [
							"@get",
							"valueAxis"
						],
						"size": [
							"@if",
							[
								"@get",
								"horiz"
							],
							[
								"@get",
								"width"
							],
							[
								"@get",
								"height"
							]
						],
						"domain": {
							"data": "table",
							"field": "value"
						}
					}
				]
			],
			[
				"@apply",
				"axis",
				[
					"@merge",
					[
						"@if",
						[
							"@get",
							"horiz"
						],
						[
							"@get",
							"yAxis"
						],
						[
							"@get",
							"xAxis"
						]
					],
					{
						"axis": [
							"@get",
							"categoryAxis"
						],
						"size": [
							"@if",
							[
								"@get",
								"horiz"
							],
							[
								"@get",
								"height"
							],
							[
								"@get",
								"width"
							]
						],
						"type": "ordinal",
						"points": true,
						"padding": 1,
						"domain": {
							"data": "table",
							"field": "name",
							"sort": true
						}
					}
				]
			],
			{
				"name": "boxplot",
				"height": [
					"@get",
					"height",
					400
				],
				"padding": [
					"@get",
					"padding",
					{
						"left": 100,
						"right": 10,
						"top": 10,
						"bottom": 50
					}
				],
				"width": [
					"@get",
					"width",
					600
				],
				"data": [
					{
						"name": "table",
						"values": [
							"@get",
							"values"
						],
						"transform": [
							{
								"type": "fold",
								"fields": [
									"@get",
									"fields"
								]
							},
							{
								"type": "formula",
								"field": "name",
								"expr": [
									"@if",
									[
										"@eq",
										"key",
										[
											"@get",
											"group"
										]
									],
									"datum.key",
									[
										"@join",
										"",
										[
											"datum.key + ' ' + datum.",
											[
												"@get",
												"group"
											]
										]
									]
								]
							}
						]
					},
					{
						"name": "stats",
						"source": "table",
						"transform": [
							{
								"type": "aggregate",
								"groupby": [
									"name"
								],
								"summarize": [
									{
										"field": "value",
										"ops": [
											"min",
											"max",
											"median",
											"q1",
											"q3",
											"valid"
										]
									}
								]
							}
						]
					},
					{
						"name": "calcs",
						"source": "stats",
						"transform": [
							{
								"type": "formula",
								"field": "lower",
								"expr": "max(datum.min_value,datum.q1_value-1.5*(datum.q3_value-datum.q1_value))"
							},
							{
								"type": "formula",
								"field": "upper",
								"expr": "min(datum.max_value,datum.q3_value+1.5*(datum.q3_value-datum.q1_value))"
							},
							{
								"type": "formula",
								"field": "min_value_opacity",
								"expr": "if(datum.min_value==datum.lower,0,1)"
							},
							{
								"type": "formula",
								"field": "max_value_opacity",
								"expr": "if(datum.max_value==datum.upper,0,1)"
							}
						]
					}
				],
				"scales": [
					{
						"name": "ybar",
						"range": [
							"@if",
							[
								"@get",
								"horiz"
							],
							"height",
							"width"
						],
						"domain": {
							"data": "table",
							"field": "name",
							"sort": true
						},
						"type": "ordinal",
						"round": true
					}
				],
				"marks": [
					{
						"type": "group",
						"properties": {
							"enter": {
								"x": {
									"value": 0
								},
								"width": {
									"field": {
										"group": "width"
									}
								},
								"y": {
									"value": 0
								},
								"height": {
									"field": {
										"group": "height"
									}
								},
								"clip": {
									"value": true
								}
							}
						},
						"marks": [
							{
								"type": "rect",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"field": "lower",
												"scale": [
													"@get",
													"valueAxis"
												]
											},
											"x2": {
												"field": "upper",
												"scale": [
													"@get",
													"valueAxis"
												]
											},
											"yc": {
												"field": "name",
												"scale": [
													"@get",
													"categoryAxis"
												]
											},
											"height": {
												"value": 1
											},
											"fill": {
												"value": "#888"
											}
										}
									]
								}
							},
							{
								"type": "rect",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "q1_value"
											},
											"x2": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "q3_value"
											},
											"yc": {
												"scale": [
													"@get",
													"categoryAxis"
												],
												"field": "name"
											},
											"height": {
												"scale": "ybar",
												"band": true,
												"mult": [
													"@get",
													"boxSize"
												]
											},
											"fill": {
												"value": [
													"@get",
													"fill",
													"white"
												]
											},
											"stroke": {
												"value": "#888"
											}
										}
									]
								}
							},
							{
								"type": "rect",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "median_value"
											},
											"width": {
												"value": 2
											},
											"yc": {
												"scale": [
													"@get",
													"categoryAxis"
												],
												"field": "name"
											},
											"height": {
												"scale": "ybar",
												"band": true,
												"mult": [
													"@get",
													"boxSize"
												]
											},
											"fill": {
												"value": "#000"
											}
										}
									]
								}
							},
							{
								"type": "rect",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "lower"
											},
											"width": {
												"value": 1
											},
											"yc": {
												"scale": [
													"@get",
													"categoryAxis"
												],
												"field": "name"
											},
											"height": {
												"scale": "ybar",
												"band": true,
												"mult": [
													"@get",
													"capSize"
												]
											},
											"fill": {
												"value": "#000"
											}
										}
									]
								}
							},
							{
								"type": "rect",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "upper"
											},
											"width": {
												"value": 1
											},
											"yc": {
												"scale": [
													"@get",
													"categoryAxis"
												],
												"field": "name"
											},
											"height": {
												"scale": "ybar",
												"band": true,
												"mult": [
													"@get",
													"capSize"
												]
											},
											"fill": {
												"value": "#000"
											}
										}
									]
								}
							},
							{
								"type": "symbol",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "min_value"
											},
											"yc": {
												"scale": [
													"@get",
													"categoryAxis"
												],
												"field": "name"
											},
											"size": {
												"value": 20
											},
											"stroke": {
												"value": "#000"
											},
											"fill": {
												"value": "#fff"
											},
											"opacity": {
												"field": "min_value_opacity"
											}
										}
									]
								}
							},
							{
								"type": "symbol",
								"from": {
									"data": "calcs"
								},
								"properties": {
									"update": [
										"@orient",
										[
											"@get",
											"orient"
										],
										{
											"x": {
												"scale": [
													"@get",
													"valueAxis"
												],
												"field": "max_value"
											},
											"yc": {
												"scale": [
													"@get",
													"categoryAxis"
												],
												"field": "name"
											},
											"size": {
												"value": 20
											},
											"stroke": {
												"value": "#000"
											},
											"fill": {
												"value": "#fff"
											},
											"opacity": {
												"field": "max_value_opacity"
											}
										}
									]
								}
							}
						]
					}
				]
			}
		]
	];

/***/ },
/* 171 */
/***/ function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"width",
				300
			],
			[
				"height",
				40
			],
			[
				"ranges",
				[
					{
						"min": 0,
						"max": 0.1,
						"background": "hsl(0,0%,90%)",
						"foreground": "rgb(102,191,103)"
					},
					{
						"min": 0.1,
						"max": 0.5,
						"background": "hsl(0,0%,75%)",
						"foreground": "rgb(255,179,24)"
					},
					{
						"min": 0.5,
						"max": 1,
						"background": "hsl(0,0%,60%)",
						"foreground": "rgb(228,0,0)"
					}
				]
			]
		],
		{
			"width": [
				"@get",
				"width"
			],
			"height": [
				"@get",
				"height"
			],
			"padding": {
				"top": 10,
				"left": [
					"@if",
					[
						"@get",
						"title",
						""
					],
					150,
					10
				],
				"bottom": 30,
				"right": 10
			},
			"data": [
				{
					"name": "ranges",
					"values": [
						"@get",
						"ranges"
					]
				},
				{
					"name": "values",
					"values": [
						{
							"value": [
								"@get",
								"value",
								0
							]
						}
					],
					"transform": [
						{
							"type": "formula",
							"field": "align",
							"expr": "if(datum.value < 0, 'left', 'right')"
						},
						{
							"type": "formula",
							"field": "dx",
							"expr": "if(datum.value < 0, 5, -5)"
						}
					]
				},
				{
					"name": "markers",
					"values": [
						"@get",
						"markers",
						[]
					]
				}
			],
			"scales": [
				{
					"name": "x",
					"type": "linear",
					"range": "width",
					"domain": {
						"data": "ranges",
						"field": [
							"min",
							"max"
						]
					}
				},
				{
					"name": "y",
					"type": "linear",
					"range": [
						0,
						[
							"@get",
							"height"
						]
					],
					"domain": [
						0,
						1
					]
				},
				{
					"name": "color",
					"type": "linear",
					"range": [
						"@map",
						[
							"@get",
							"ranges"
						],
						"range",
						[
							"@get",
							"range.foreground",
							"black"
						],
						[
							"@get",
							"range.foreground",
							"black"
						]
					],
					"domain": [
						"@map",
						[
							"@get",
							"ranges"
						],
						"range",
						[
							"@get",
							"range.min"
						],
						[
							"@get",
							"range.max"
						]
					]
				}
			],
			"axes": [
				{
					"type": "x",
					"scale": "x",
					"ticks": 5,
					"properties": {
						"axis": {
							"stroke": {
								"value": "hsl(0,0%,75%)"
							},
							"strokeWidth": {
								"value": 0.5
							}
						},
						"ticks": {
							"stroke": {
								"value": "hsl(0,0%,75%)"
							},
							"strokeWidth": {
								"value": 0.5
							}
						},
						"labels": {
							"fontSize": {
								"value": [
									"@get",
									"axisFontSize",
									14
								]
							}
						}
					}
				}
			],
			"marks": [
				{
					"type": "rect",
					"from": {
						"data": "ranges"
					},
					"properties": {
						"enter": {
							"x": {
								"scale": "x",
								"field": "min"
							},
							"x2": {
								"scale": "x",
								"field": "max"
							},
							"y": {
								"scale": "y",
								"value": 0
							},
							"y2": {
								"scale": "y",
								"value": 1
							},
							"fill": {
								"field": "background"
							},
							"opacity": {
								"value": 0.5
							}
						}
					}
				},
				{
					"type": "rect",
					"from": {
						"data": "markers"
					},
					"properties": {
						"enter": {
							"xc": {
								"scale": "x",
								"field": "value"
							},
							"width": {
								"value": 2
							},
							"yc": {
								"scale": "y",
								"value": 0.5
							},
							"height": {
								"scale": "y",
								"value": 0.75
							},
							"fill": {
								"scale": "color",
								"field": "value"
							}
						}
					}
				},
				{
					"type": "rect",
					"from": {
						"data": "values"
					},
					"properties": {
						"enter": {
							"x": {
								"scale": "x",
								"value": 0
							},
							"x2": {
								"scale": "x",
								"field": "value"
							},
							"yc": {
								"scale": "y",
								"value": 0.5
							},
							"height": {
								"scale": "y",
								"value": 0.5
							},
							"fill": {
								"scale": "color",
								"field": "value"
							}
						}
					}
				},
				{
					"type": "text",
					"properties": {
						"enter": {
							"x": {
								"value": -10
							},
							"y": {
								"scale": "y",
								"value": 0.5
							},
							"fontSize": {
								"value": [
									"@get",
									"titleFontSize",
									20
								]
							},
							"text": {
								"value": [
									"@get",
									"title",
									""
								]
							},
							"align": {
								"value": "right"
							},
							"baseline": {
								"value": "middle"
							},
							"fill": {
								"value": "black"
							}
						}
					}
				},
				{
					"type": "text",
					"properties": {
						"enter": {
							"x": {
								"value": -10
							},
							"y": {
								"scale": "y",
								"value": 0.5,
								"offset": 15
							},
							"fontSize": {
								"value": [
									"@get",
									"subtitleFontSize",
									12
								]
							},
							"text": {
								"value": [
									"@get",
									"subtitle",
									""
								]
							},
							"align": {
								"value": "right"
							},
							"baseline": {
								"value": "middle"
							},
							"fill": {
								"value": "black"
							}
						}
					}
				},
				{
					"type": "text",
					"from": {
						"data": "values"
					},
					"properties": {
						"enter": {
							"x": {
								"scale": "x",
								"field": "value"
							},
							"dx": {
								"field": "dx"
							},
							"y": {
								"scale": "y",
								"value": 0.5
							},
							"fontSize": {
								"value": [
									"@get",
									"labelFontSize",
									16
								]
							},
							"text": {
								"template": [
									"@get",
									"display",
									"{{datum.value|number:'.2g'}}"
								]
							},
							"align": {
								"field": "align"
							},
							"baseline": {
								"value": "middle"
							},
							"fill": {
								"value": "white"
							}
						}
					}
				}
			]
		}
	];

/***/ },
/* 172 */
/***/ function(module, exports) {

	module.exports = {
		"width": [
			"@get",
			"width",
			700
		],
		"height": [
			"@get",
			"height",
			600
		],
		"data": [
			{
				"name": "data",
				"values": [
					"@get",
					"values"
				]
			}
		],
		"scales": [
			{
				"name": "y",
				"type": "ordinal",
				"range": "height",
				"domain": {
					"data": "data",
					"field": "label"
				}
			},
			{
				"name": "x",
				"type": "linear",
				"range": "width",
				"domain": {
					"data": "data",
					"field": [
						"enter",
						"leave"
					]
				}
			},
			{
				"name": "weight",
				"type": "ordinal",
				"range": [
					"bold",
					"normal"
				],
				"domain": {
					"data": "data",
					"field": "level"
				}
			},
			{
				"name": "color",
				"type": "ordinal",
				"range": [
					"steelblue",
					"#bbb"
				],
				"domain": {
					"data": "data",
					"field": "level"
				}
			}
		],
		"axes": [
			{
				"type": "x",
				"scale": "x",
				"values": [
					"@get",
					"xAxis.values",
					[
						0,
						6,
						12,
						18,
						24
					]
				],
				"title": [
					"@get",
					"xAxis.title",
					"Month"
				]
			}
		],
		"marks": [
			{
				"type": "text",
				"from": {
					"data": "data"
				},
				"properties": {
					"enter": {
						"x": {
							"scale": "x",
							"value": 0,
							"offset": -5
						},
						"y": {
							"scale": "y",
							"field": "label"
						},
						"fill": {
							"value": "#000"
						},
						"text": {
							"field": "label"
						},
						"font": {
							"value": "Helvetica Neue"
						},
						"fontSize": {
							"value": 10
						},
						"fontWeight": {
							"scale": "weight",
							"field": "level"
						},
						"align": {
							"value": "right"
						},
						"baseline": {
							"value": "middle"
						}
					}
				}
			},
			{
				"type": "rect",
				"from": {
					"data": "data"
				},
				"properties": {
					"enter": {
						"x": {
							"value": 0
						},
						"y": {
							"scale": "y",
							"field": "label",
							"offset": -1
						},
						"width": {
							"field": {
								"group": "width"
							}
						},
						"height": {
							"value": 1
						},
						"fill": {
							"value": "#ccc"
						}
					}
				}
			},
			{
				"type": "rect",
				"from": {
					"data": "data"
				},
				"properties": {
					"enter": {
						"x": {
							"scale": "x",
							"field": "enter"
						},
						"x2": {
							"scale": "x",
							"field": "leave"
						},
						"yc": {
							"scale": "y",
							"field": "label"
						},
						"height": {
							"value": 7
						},
						"fill": {
							"scale": "color",
							"field": "level"
						}
					}
				}
			}
		]
	};

/***/ },
/* 173 */
/***/ function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"bin",
				"value"
			],
			[
				"discrete",
				false
			],
			[
				"width",
				800
			],
			[
				"height",
				500
			]
		],
		[
			"@merge",
			[
				"@apply",
				"axis",
				[
					"@merge",
					[
						"@get",
						"xAxis"
					],
					{
						"axis": "x",
						"size": [
							"@get",
							"width"
						],
						"type": "ordinal",
						"sort": false,
						"domain": {
							"data": "series",
							"field": "bin",
							"sort": true
						}
					}
				]
			],
			[
				"@apply",
				"axis",
				[
					"@merge",
					[
						"@get",
						"yAxis"
					],
					{
						"axis": "y",
						"size": [
							"@get",
							"height"
						],
						"type": "linear",
						"domain": {
							"data": "series",
							"field": "count"
						}
					}
				]
			],
			{
				"width": [
					"@get",
					"width"
				],
				"height": [
					"@get",
					"height"
				],
				"padding": [
					"@get",
					"padding",
					{
						"top": 20,
						"bottom": 50,
						"left": 50,
						"right": 10
					}
				],
				"predicates": [
					{
						"name": "tooltip",
						"type": "==",
						"operands": [
							{
								"signal": "d._id"
							},
							{
								"arg": "id"
							}
						]
					}
				],
				"data": [
					{
						"name": "series",
						"values": [
							"@get",
							"values"
						],
						"transform": [
							"@if",
							[
								"@get",
								"discrete"
							],
							[
								{
									"type": "formula",
									"field": "bin",
									"expr": [
										"@join",
										"",
										[
											"datum['",
											[
												"@get",
												"bin"
											],
											"']"
										]
									]
								},
								{
									"type": "aggregate",
									"groupby": [
										"bin"
									],
									"summarize": [
										{
											"field": "*",
											"ops": [
												"count"
											]
										}
									]
								}
							],
							[
								{
									"type": "bin",
									"field": [
										"@get",
										"bin"
									],
									"output": {
										"start": "bin"
									},
									"maxbins": [
										"@get",
										"maxBins",
										10
									]
								},
								{
									"type": "aggregate",
									"groupby": [
										"bin"
									],
									"summarize": [
										{
											"field": "*",
											"ops": [
												"count"
											]
										}
									]
								}
							]
						]
					}
				],
				"signals": [
					{
						"name": "d",
						"init": {},
						"streams": [
							{
								"type": "rect:mouseover",
								"expr": "datum"
							},
							{
								"type": "rect:mouseout",
								"expr": "{}"
							}
						]
					}
				],
				"marks": [
					{
						"type": "group",
						"properties": {
							"enter": {
								"x": {
									"value": 0
								},
								"width": {
									"field": {
										"group": "width"
									}
								},
								"y": {
									"value": 0
								},
								"height": {
									"field": {
										"group": "height"
									}
								},
								"clip": {
									"value": true
								}
							}
						},
						"marks": [
							{
								"type": "rect",
								"from": {
									"data": "series"
								},
								"properties": {
									"update": {
										"x": {
											"scale": "x",
											"field": "bin",
											"offset": 1
										},
										"width": {
											"scale": "x",
											"band": true,
											"offset": -1
										},
										"y": {
											"scale": "y",
											"field": "count"
										},
										"y2": {
											"scale": "y",
											"value": 0
										},
										"fill": {
											"value": [
												"@get",
												"fill",
												"steelblue"
											]
										}
									},
									"hover": {
										"fill": {
											"value": [
												"@get",
												"hover",
												"red"
											]
										}
									}
								}
							},
							{
								"type": "text",
								"properties": {
									"enter": {
										"align": {
											"value": "center"
										},
										"fill": {
											"value": "#333"
										}
									},
									"update": {
										"x": {
											"scale": "x",
											"signal": "d.bin"
										},
										"dx": {
											"scale": "x",
											"band": true,
											"mult": 0.5
										},
										"y": {
											"scale": "y",
											"signal": "d.count",
											"offset": -5
										},
										"text": {
											"template": [
												"@get",
												"tooltip",
												"{{d.count}}"
											]
										},
										"fillOpacity": {
											"rule": [
												{
													"predicate": {
														"name": "tooltip",
														"id": {
															"value": null
														}
													},
													"value": 0
												},
												{
													"value": 1
												}
											]
										}
									}
								}
							}
						]
					}
				]
			}
		]
	];

/***/ },
/* 174 */
/***/ function(module, exports) {

	module.exports = [
		"@get",
		"spec"
	];

/***/ },
/* 175 */
/***/ function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"width",
				800
			],
			[
				"height",
				500
			],
			[
				"legend",
				true
			]
		],
		[
			"@merge",
			[
				"@apply",
				"axis",
				[
					"@merge",
					[
						"@get",
						"xAxis"
					],
					{
						"axis": "x",
						"size": [
							"@get",
							"width"
						],
						"domain": [
							"@get",
							"xAxis.domain",
							{
								"fields": [
									"@map",
									[
										"@get",
										"series"
									],
									"s",
									{
										"data": [
											"@get",
											"s.name"
										],
										"field": "x"
									}
								]
							}
						]
					}
				]
			],
			[
				"@apply",
				"axis",
				[
					"@merge",
					[
						"@get",
						"yAxis"
					],
					{
						"axis": "y",
						"size": [
							"@get",
							"height"
						],
						"domain": [
							"@get",
							"xAxis.domain",
							{
								"fields": [
									"@map",
									[
										"@get",
										"series"
									],
									"s",
									{
										"data": [
											"@get",
											"s.name"
										],
										"field": "y"
									}
								]
							}
						]
					}
				]
			],
			{
				"width": [
					"@get",
					"width"
				],
				"height": [
					"@get",
					"height"
				],
				"padding": [
					"@get",
					"padding",
					{
						"top": 10,
						"bottom": 50,
						"left": 50,
						"right": [
							"@if",
							[
								"@get",
								"legend"
							],
							150,
							10
						]
					}
				],
				"predicates": [
					{
						"name": "tooltip",
						"type": "==",
						"operands": [
							{
								"signal": "d._id"
							},
							{
								"arg": "id"
							}
						]
					}
				],
				"data": [
					"@map",
					[
						"@get",
						"series"
					],
					"d",
					{
						"name": [
							"@get",
							"d.name"
						],
						"values": [
							"@get",
							"d.values"
						],
						"transform": [
							{
								"type": "formula",
								"field": "x",
								"expr": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"d.x",
											"x"
										],
										"']"
									]
								]
							},
							{
								"type": "formula",
								"field": "y",
								"expr": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"d.y",
											"y"
										],
										"']"
									]
								]
							}
						]
					}
				],
				"signals": [
					{
						"name": "d",
						"init": {},
						"streams": [
							{
								"type": "symbol:mouseover",
								"expr": "datum"
							},
							{
								"type": "symbol:mouseout",
								"expr": "{}"
							}
						]
					}
				],
				"scales": [
					{
						"name": "color",
						"type": "ordinal",
						"domain": [
							"@map",
							[
								"@get",
								"series"
							],
							"d",
							[
								"@get",
								"d.name"
							]
						],
						"range": [
							"@map",
							[
								"@get",
								"series"
							],
							"d",
							[
								"@get",
								"d.color",
								"steelblue"
							]
						]
					}
				],
				"legends": [
					"@if",
					[
						"@get",
						"legend"
					],
					[
						{
							"fill": "color",
							"orient": "right",
							"properties": {
								"symbols": {
									"stroke": {
										"value": "transparent"
									}
								}
							}
						}
					],
					[]
				],
				"marks": [
					{
						"type": "group",
						"properties": {
							"enter": {
								"x": {
									"value": 0
								},
								"width": {
									"field": {
										"group": "width"
									}
								},
								"y": {
									"value": 0
								},
								"height": {
									"field": {
										"group": "height"
									}
								},
								"clip": {
									"value": true
								}
							}
						},
						"marks": [
							{
								"type": "group",
								"marks": [
									"@map",
									[
										"@get",
										"series"
									],
									"d",
									[
										"@if",
										[
											"@get",
											"d.line",
											false
										],
										{
											"type": "line",
											"from": {
												"data": [
													"@get",
													"d.name"
												]
											},
											"properties": {
												"update": {
													"x": {
														"scale": "x",
														"field": "x"
													},
													"y": {
														"scale": "y",
														"field": "y"
													},
													"stroke": {
														"scale": "color",
														"value": [
															"@get",
															"d.name"
														]
													},
													"strokeWidth": [
														"@get",
														"d.lineWidth",
														1
													]
												}
											}
										},
										null
									]
								]
							},
							{
								"type": "group",
								"marks": [
									"@map",
									[
										"@get",
										"series"
									],
									"d",
									[
										"@if",
										[
											"@get",
											"d.point",
											true
										],
										{
											"type": "symbol",
											"from": {
												"data": [
													"@get",
													"d.name"
												]
											},
											"properties": {
												"update": {
													"x": {
														"scale": "x",
														"field": "x"
													},
													"y": {
														"scale": "y",
														"field": "y"
													},
													"fill": {
														"scale": "color",
														"value": [
															"@get",
															"d.name"
														]
													},
													"stroke": {
														"value": "#444"
													},
													"shape": {
														"value": [
															"@get",
															"d.shape",
															"circle"
														]
													},
													"strokeWidth": {
														"value": [
															"@get",
															"d.strokeWidth",
															0
														]
													},
													"size": {
														"value": [
															"@get",
															"d.pointSize",
															20
														]
													}
												},
												"hover": {
													"size": {
														"value": 80
													}
												}
											}
										},
										null
									]
								]
							},
							{
								"type": "text",
								"properties": {
									"enter": {
										"align": {
											"value": "center"
										},
										"fill": {
											"value": "#333"
										}
									},
									"update": {
										"x": {
											"scale": "x",
											"signal": "d.x"
										},
										"y": {
											"scale": "y",
											"signal": "d.y",
											"offset": -10
										},
										"text": {
											"template": [
												"@get",
												"tooltip",
												"({{d.x|number:'.4g'}}, {{d.y|number:'.4g'}})"
											]
										},
										"fillOpacity": {
											"rule": [
												{
													"predicate": {
														"name": "tooltip",
														"id": {
															"value": null
														}
													},
													"value": 0
												},
												{
													"value": 1
												}
											]
										}
									}
								}
							}
						]
					}
				]
			}
		]
	];

/***/ },
/* 176 */
/***/ function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"color.value",
				"steelblue"
			],
			[
				"color.type",
				"ordinal"
			]
		],
		{
			"width": [
				"@get",
				"width",
				600
			],
			"height": [
				"@get",
				"height",
				600
			],
			"padding": [
				"@get",
				"padding",
				{
					"top": 30,
					"bottom": 10,
					"left": 100,
					"right": [
						"@if",
						[
							"@get",
							"color.field"
						],
						100,
						0
					]
				}
			],
			"data": [
				{
					"name": "data",
					"values": [
						"@get",
						"values"
					]
				},
				{
					"name": "fields",
					"values": [
						"@get",
						"fields"
					]
				}
			],
			"scales": [
				{
					"name": "gx",
					"type": "ordinal",
					"range": "width",
					"round": true,
					"domain": {
						"data": "fields",
						"field": "data"
					}
				},
				{
					"name": "gy",
					"type": "ordinal",
					"range": "height",
					"round": true,
					"reverse": true,
					"domain": {
						"data": "fields",
						"field": "data"
					}
				},
				{
					"name": "c",
					"type": [
						"@get",
						"color.type"
					],
					"domain": {
						"data": "data",
						"field": [
							"@get",
							"color.field"
						]
					},
					"zero": false,
					"range": [
						"@if",
						[
							"@eq",
							[
								"@get",
								"color.type"
							],
							"ordinal"
						],
						"category10",
						[
							"yellow",
							"blue"
						]
					]
				}
			],
			"legends": [
				"@if",
				[
					"@get",
					"color.field"
				],
				[
					{
						"fill": "c",
						"title": [
							"@get",
							"color.field"
						],
						"offset": 10,
						"properties": {
							"symbols": {
								"fillOpacity": {
									"value": 0.5
								},
								"stroke": {
									"value": "transparent"
								}
							}
						}
					}
				],
				[]
			],
			"marks": [
				{
					"type": "group",
					"from": {
						"data": "fields",
						"transform": [
							{
								"type": "cross"
							}
						]
					},
					"properties": {
						"enter": {
							"x": {
								"scale": "gx",
								"field": "a.data"
							},
							"y": {
								"scale": "gy",
								"field": "b.data"
							},
							"width": {
								"scale": "gx",
								"band": true,
								"offset": -35
							},
							"height": {
								"scale": "gy",
								"band": true,
								"offset": -35
							},
							"fill": {
								"value": "#fff"
							},
							"stroke": {
								"value": "#ddd"
							}
						}
					},
					"scales": [
						{
							"name": "x",
							"range": "width",
							"zero": false,
							"round": true,
							"domain": {
								"data": "data",
								"field": {
									"parent": "a.data"
								}
							}
						},
						{
							"name": "y",
							"range": "height",
							"zero": false,
							"round": true,
							"domain": {
								"data": "data",
								"field": {
									"parent": "b.data"
								}
							}
						}
					],
					"axes": [
						{
							"type": "x",
							"scale": "x",
							"ticks": 5
						},
						{
							"type": "y",
							"scale": "y",
							"ticks": 5
						}
					],
					"marks": [
						{
							"type": "symbol",
							"from": {
								"data": "data"
							},
							"properties": {
								"enter": {
									"x": {
										"scale": "x",
										"field": {
											"datum": {
												"parent": "a.data"
											}
										}
									},
									"y": {
										"scale": "y",
										"field": {
											"datum": {
												"parent": "b.data"
											}
										}
									},
									"fill": [
										"@if",
										[
											"@get",
											"color.field"
										],
										{
											"scale": "c",
											"field": [
												"@get",
												"color.field"
											]
										},
										{
											"value": [
												"@get",
												"color.value"
											]
										}
									],
									"fillOpacity": {
										"value": 0.5
									}
								},
								"update": {
									"size": {
										"value": 36
									},
									"stroke": {
										"value": "transparent"
									}
								},
								"hover": {
									"size": {
										"value": 100
									},
									"stroke": {
										"value": "white"
									}
								}
							}
						}
					]
				},
				{
					"type": "text",
					"from": {
						"data": "fields"
					},
					"properties": {
						"enter": {
							"x": {
								"value": -30
							},
							"y": {
								"scale": "gy",
								"field": "data"
							},
							"text": {
								"field": "data"
							},
							"fontSize": {
								"value": 12
							},
							"fill": {
								"value": "black"
							},
							"align": {
								"value": "right"
							},
							"baseline": {
								"value": "top"
							},
							"fontWeight": {
								"value": "bold"
							}
						}
					}
				},
				{
					"type": "text",
					"from": {
						"data": "fields"
					},
					"properties": {
						"enter": {
							"y": {
								"value": -10
							},
							"x": {
								"scale": "gx",
								"field": "data"
							},
							"text": {
								"field": "data"
							},
							"fontSize": {
								"value": 12
							},
							"fill": {
								"value": "black"
							},
							"align": {
								"value": "left"
							},
							"baseline": {
								"value": "bottom"
							},
							"fontWeight": {
								"value": "bold"
							}
						}
					}
				}
			]
		}
	];

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _src = __webpack_require__(7);
	
	var _src2 = _interopRequireDefault(_src);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ScatterMatrix = function () {
	  _createClass(ScatterMatrix, null, [{
	    key: 'options',
	    get: function get() {
	      return [{ name: 'data', type: 'table' }, { name: 'fields', type: 'string_list' }, { name: 'color', type: 'string' }];
	    }
	  }]);
	
	  function ScatterMatrix(el, options) {
	    _classCallCheck(this, ScatterMatrix);
	
	    var chart = _src2.default.chart('xymatrix', {
	      el: el,
	      values: options.data,
	      fields: options.fields,
	      color: {
	        field: options.color
	      }
	    });
	    window.onresize = function () {
	      return chart.update();
	    };
	  }
	
	  return ScatterMatrix;
	}();

	exports.default = ScatterMatrix;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=candela.js.map