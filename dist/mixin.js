(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3-selection"), require("candela"), require("datalib"), require("javascript-detect-element-resize/detect-element-resize"), require("telegraph-events"), require("vega"));
	else if(typeof define === 'function' && define.amd)
		define(["d3-selection", "candela", "datalib", "javascript-detect-element-resize/detect-element-resize", "telegraph-events", "vega"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("d3-selection"), require("candela"), require("datalib"), require("javascript-detect-element-resize/detect-element-resize"), require("telegraph-events"), require("vega"));
	else
		root["candela"] = factory(root["d3-selection"], root["candela"], root["datalib"], root["javascript-detect-element-resize/detect-element-resize"], root["telegraph-events"], root["vega"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_25__, __WEBPACK_EXTERNAL_MODULE_27__, __WEBPACK_EXTERNAL_MODULE_32__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _candela = __webpack_require__(3);

	var _candela2 = _interopRequireDefault(_candela);

	var _AutoResize = __webpack_require__(23);

	var _AutoResize2 = _interopRequireDefault(_AutoResize);

	var _Events = __webpack_require__(26);

	var _Events2 = _interopRequireDefault(_Events);

	var _InitSize = __webpack_require__(29);

	var _InitSize2 = _interopRequireDefault(_InitSize);

	var _Resize = __webpack_require__(24);

	var _Resize2 = _interopRequireDefault(_Resize);

	var _VegaChart = __webpack_require__(30);

	var _VegaChart2 = _interopRequireDefault(_VegaChart);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var mixins = {
	  AutoResize: _AutoResize2.default,
	  Events: _Events2.default,
	  InitSize: _InitSize2.default,
	  Resize: _Resize2.default,
	  VegaChart: _VegaChart2.default
	};

	Object.entries(mixins).forEach(function (entry) {
	  return _candela2.default.registerMixin(entry[1], entry[0]);
	});

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }),
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Resize2 = __webpack_require__(24);

	var _Resize3 = _interopRequireDefault(_Resize2);

	var _InitSize = __webpack_require__(29);

	var _InitSize2 = _interopRequireDefault(_InitSize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var AutoResize = function AutoResize(Base) {
	  return function (_Resize) {
	    _inherits(_class, _Resize);

	    function _class() {
	      var _ref;

	      _classCallCheck(this, _class);

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

	      _this.on('resize', function (w, h) {
	        _this.width = w;
	        _this.height = h;

	        _this.render();
	      });
	      return _this;
	    }

	    return _class;
	  }((0, _Resize3.default)((0, _InitSize2.default)(Base)));
	};

	exports.default = AutoResize;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(25);

	var _Events2 = __webpack_require__(26);

	var _Events3 = _interopRequireDefault(_Events2);

	var _util = __webpack_require__(28);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Resize = function Resize(Base) {
	  return function (_Events) {
	    _inherits(_class, _Events);

	    function _class() {
	      var _ref;

	      _classCallCheck(this, _class);

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

	      window.addResizeListener(_this.el, function () {
	        var size = (0, _util.getElementSize)(_this.el);
	        _this.emit('resize', size.width, size.height, _this);
	      });
	      return _this;
	    }

	    return _class;
	  }((0, _Events3.default)(Base));
	};

	exports.default = Resize;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_25__;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _telegraphEvents = __webpack_require__(27);

	var _telegraphEvents2 = _interopRequireDefault(_telegraphEvents);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Events = function Events(Base) {
	  return function (_Base) {
	    _inherits(_class, _Base);

	    function _class() {
	      var _ref;

	      _classCallCheck(this, _class);

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

	      (0, _telegraphEvents2.default)(_this);
	      return _this;
	    }

	    return _class;
	  }(Base);
	};

	exports.default = Events;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_27__;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getElementSize = getElementSize;
	exports.minmax = minmax;
	function getElementSize(el) {
	  var style = window.getComputedStyle(el, null);
	  var width = window.parseInt(style.getPropertyValue('width'));
	  var height = window.parseInt(style.getPropertyValue('height'));

	  return {
	    width: width,
	    height: height
	  };
	}

	function minmax(data) {
	  var range = {
	    min: null,
	    max: null
	  };

	  if (data.length > 0) {
	    range.min = range.max = data[0];

	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	      for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	        var val = _step.value;

	        if (val < range.min) {
	          range.min = val;
	        }

	        if (val > range.max) {
	          range.max = val;
	        }
	      }
	    } catch (err) {
	      _didIteratorError = true;
	      _iteratorError = err;
	    } finally {
	      try {
	        if (!_iteratorNormalCompletion && _iterator.return) {
	          _iterator.return();
	        }
	      } finally {
	        if (_didIteratorError) {
	          throw _iteratorError;
	        }
	      }
	    }
	  }

	  return range;
	}

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(28);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InitSize = function InitSize(Base) {
	  return function (_Base) {
	    _inherits(_class, _Base);

	    function _class() {
	      var _ref;

	      _classCallCheck(this, _class);

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

	      var size = (0, _util.getElementSize)(_this.el);
	      _this.width = size.width;
	      _this.height = size.height;
	      return _this;
	    }

	    return _class;
	  }(Base);
	};

	exports.default = InitSize;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _vega = __webpack_require__(31);

	var _vega2 = _interopRequireDefault(_vega);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var VegaChart = function VegaChart(Base, spec) {
	  return function (_Base) {
	    _inherits(_class, _Base);

	    function _class() {
	      var _ref;

	      _classCallCheck(this, _class);

	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }

	      var _this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args)));

	      _this.options = args[1];
	      _this.chart = _vega2.default.parseChart(spec, _this.el, _this.options);
	      return _this;
	    }

	    _createClass(_class, [{
	      key: 'render',
	      value: function render() {
	        var _this2 = this;

	        return this.chart.then(function (chart) {
	          if (_this2.width) {
	            chart = chart.width(_this2.width);
	          }

	          if (_this2.height) {
	            chart = chart.height(_this2.height);
	          }

	          chart.update();
	        });
	      }
	    }, {
	      key: 'update',
	      value: function update(options) {
	        var _this3 = this;

	        var promise = this.chart;

	        Object.assign(this.options, options);

	        if (this.options.data) {
	          promise = promise.then(function (chart) {
	            return chart.data('data').remove(function () {
	              return true;
	            }).insert(_this3.options.data);
	          });
	        }

	        if (this.options.width) {
	          this.width = this.options.width;
	        }

	        if (this.options.height) {
	          this.height = this.options.height;
	        }

	        return promise;
	      }
	    }, {
	      key: 'destroy',
	      value: function destroy() {
	        this.empty();
	        delete this.chart;
	      }
	    }, {
	      key: 'serialize',
	      value: function serialize(format) {
	        if (!this.chart) {
	          return Promise.reject('The render() method must be called before serialize().');
	        }
	        return this.chart.then(function (vobj) {
	          return vobj.toImageURL(format);
	        });
	      }
	    }, {
	      key: 'serializationFormats',
	      get: function get() {
	        return ['png', 'svg'];
	      }
	    }]);

	    return _class;
	  }(Base);
	};

	exports.default = VegaChart;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _d3Selection = __webpack_require__(2);

	var _vega = __webpack_require__(32);

	var _vega2 = _interopRequireDefault(_vega);

	var _datalib = __webpack_require__(14);

	var _axis = __webpack_require__(33);

	var _axis2 = _interopRequireDefault(_axis);

	var _ = __webpack_require__(28);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    for (var index = 0; index < args[0].length; index += 1) {
	      var name = transform(args[0][index][0], options, scope);
	      var value = getNested(scope, name);
	      if (value === undefined) {
	        value = getNested(options, name);
	      }
	      if (value === undefined) {
	        value = transform(args[0][index][1], options, scope);
	        setNested(scope, name, value);
	      }
	    }
	    return transform(args[1], options, scope);
	  },

	  let: function _let(args, options, scope) {
	    for (var index = 0; index < args[0].length; index += 1) {
	      var name = transform(args[0][index][0], options, scope);
	      var value = transform(args[0][index][1], options, scope);
	      setNested(scope, name, value);
	    }
	    return transform(args[1], options, scope);
	  },

	  get: function get(args, options, scope) {
	    var name = transform(args[0], options, scope);
	    var value = getNested(scope, name);
	    if (value === undefined) {
	      value = getNested(options, name);
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
	    var transformed = [];
	    var elements = transform(args[0], options, scope);

	    if (!Array.isArray(elements)) {
	      return transformed;
	    }

	    for (var elementIndex = 0; elementIndex < elements.length; elementIndex += 1) {
	      scope[args[1]] = elements[elementIndex];
	      scope.index = elementIndex;
	      for (var itemIndex = 2; itemIndex < args.length; itemIndex += 1) {
	        var element = transform(args[itemIndex], options, scope);
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
	    var a = transform(args[0], options, scope);
	    var b = transform(args[1], options, scope);
	    return a === b;
	  },

	  lt: function lt(args, options, scope) {
	    var a = transform(args[0], options, scope);
	    var b = transform(args[1], options, scope);
	    return a < b;
	  },

	  gt: function gt(args, options, scope) {
	    var a = transform(args[0], options, scope);
	    var b = transform(args[1], options, scope);
	    return a > b;
	  },

	  length: function length(args, options, scope) {
	    var a = transform(args[0], options, scope);
	    if ((0, _datalib.isArray)(a) || (0, _datalib.isString)(a)) {
	      return a.length;
	    }
	    return 0;
	  },

	  and: function and(args, options, scope) {
	    var arr = transform(args, options, scope);
	    for (var i = 0; i < arr.length; i += 1) {
	      if (!arr[i]) {
	        return false;
	      }
	    }
	    return true;
	  },

	  or: function or(args, options, scope) {
	    var arr = transform(args, options, scope);
	    for (var i = 0; i < arr.length; i += 1) {
	      if (arr[i]) {
	        return true;
	      }
	    }
	    return false;
	  },

	  mult: function mult(args, options, scope) {
	    var arr = transform(args, options, scope);
	    var value = 1;
	    for (var i = 0; i < arr.length; i += 1) {
	      value *= arr[i];
	    }
	    return value;
	  },

	  add: function add(args, options, scope) {
	    var arr = transform(args, options, scope);
	    var value = 0;
	    for (var i = 0; i < arr.length; i += 1) {
	      value += arr[i];
	    }
	    return value;
	  },

	  join: function join(args, options, scope) {
	    var result = '';
	    var sep = transform(args[0], options, scope);
	    var arr = transform(args[1], options, scope);
	    if (!Array.isArray(arr)) {
	      return result;
	    }
	    for (var i = 0; i < arr.length; i += 1) {
	      if (i > 0) {
	        result += sep;
	      }
	      result += arr[i];
	    }
	    return result;
	  },

	  merge: function merge(args, options, scope) {
	    var merged = transform(args[0], options, scope);
	    for (var i = 1; i < args.length; i += 1) {
	      merged = _merge(merged, transform(args[i], options, scope));
	    }
	    return merged;
	  },

	  colorScale: function colorScale(args, options, scope) {
	    var params = transform(args[0], options, scope);
	    var name = params.name || 'color';
	    if (!Array.isArray(params.values) || params.values.length < 1 || params.values[0][params.field] === undefined || typeof params.values[0][params.field] === 'string') {
	      return {
	        name: name,
	        type: 'ordinal',
	        domain: { data: params.data, field: params.field },
	        range: 'category10'
	      };
	    }
	    return {
	      name: name,
	      type: 'linear',
	      zero: false,
	      domain: { data: params.data, field: params.field },
	      range: ['#df2709', '#2709df']
	    };
	  },

	  axis: function axis(args, options, scope) {
	    var opt = transform(args[0], options, scope);
	    if (opt.data && Array.isArray(opt.data) && opt.field) {
	      if (!opt.data.__types__) {
	        (0, _datalib.read)(opt.data, { parse: 'auto' });
	      }
	      var type = opt.data.__types__[opt.field];
	      if (type === 'string') {
	        opt.formatType = 'string';
	      } else if (type === 'date') {
	        opt.type = opt.type || 'time';
	        opt.formatType = 'time';
	        opt.format = '%Y-%m-%d';
	      } else {
	        opt.formatType = 'number';
	        opt.format = 's';
	      }
	    }
	    return transform(_axis2.default, opt);
	  },

	  isStringField: function isStringField(args, options, scope) {
	    var values = transform(args[0], options, scope);
	    var field = transform(args[1], options, scope);

	    if (!Array.isArray(values) || values.length < 1 || values[0][field] === undefined || typeof values[0][field] === 'string') {
	      return true;
	    }
	    return false;
	  },

	  orient: function orient(args, options, scope) {
	    var dir = transform(args[0], options, scope);
	    var obj = transform(args[1], options, scope);
	    var transformed = {};
	    var matching = {
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
	    for (var key in obj) {
	      if (obj.hasOwnProperty(key)) {
	        if (matching[key]) {
	          transformed[matching[key]] = obj[key];
	        } else {
	          transformed[key] = obj[key];
	        }
	      }
	    }
	    return transformed;
	  }
	};

	var transform = function transform(spec, options, scope) {
	  options = options || {};
	  scope = scope || {};

	  if (Array.isArray(spec)) {
	    if (spec.length > 0 && typeof spec[0] === 'string' && spec[0].slice(0, 1) === '@') {
	      return templateFunctions[spec[0].slice(1)](spec.slice(1), options, scope);
	    }
	    var transformed = [];
	    for (var index = 0; index < spec.length; index += 1) {
	      transformed.push(transform(spec[index], options, scope));
	    }
	    return transformed;
	  }
	  if (spec === null) {
	    return spec;
	  }
	  if (spec instanceof Date) {
	    return spec;
	  }
	  if ((typeof spec === 'undefined' ? 'undefined' : _typeof(spec)) === 'object') {
	    var _transformed = {};
	    for (var key in spec) {
	      if (spec.hasOwnProperty(key)) {
	        _transformed[key] = transform(spec[key], options, scope);
	      }
	    }
	    return _transformed;
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
	  if (options === undefined) {
	    return defaults;
	  }
	  if (isObjectLiteral(defaults)) {
	    var extended = {};
	    for (var prop in defaults) {
	      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
	        extended[prop] = extend(defaults[prop], options[prop]);
	      }
	    }
	    for (var _prop in options) {
	      if (!Object.prototype.hasOwnProperty.call(defaults, _prop)) {
	        extended[_prop] = options[_prop];
	      }
	    }
	    return extended;
	  }
	  if (isArrayLiteral(defaults)) {
	    var _extended = [];
	    for (var index = 0; index < defaults.length; index += 1) {
	      _extended.push(extend(defaults[index], options[index]));
	    }
	    if (isArrayLiteral(options)) {
	      for (var _index = defaults.length; _index < options.length; _index += 1) {
	        _extended.push(options[_index]);
	      }
	    }
	    return _extended;
	  }
	  return options;
	};

	var _merge = function _merge(defaults, options) {
	  if (options === undefined || options === null) {
	    return defaults;
	  }
	  if (defaults === undefined || defaults === null) {
	    return options;
	  }
	  if (isObjectLiteral(defaults)) {
	    var extended = {};
	    for (var prop in defaults) {
	      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
	        extended[prop] = _merge(defaults[prop], options[prop]);
	      }
	    }
	    for (var _prop2 in options) {
	      if (!Object.prototype.hasOwnProperty.call(extended, _prop2)) {
	        extended[_prop2] = options[_prop2];
	      }
	    }
	    return extended;
	  }
	  if (isArrayLiteral(defaults)) {
	    var _extended2 = [];
	    for (var index = 0; index < defaults.length; index += 1) {
	      _extended2.push(defaults[index]);
	    }
	    if (isArrayLiteral(options)) {
	      for (var _index2 = 0; _index2 < options.length; _index2 += 1) {
	        _extended2.push(options[_index2]);
	      }
	    }
	    return _extended2;
	  }
	  return defaults;
	};

	var parseChart = function parseChart(spec, element, options) {
	  // Use element size to set size, unless size explicitly specified or
	  // element size is zero.
	  var el = (0, _d3Selection.select)(element).node();
	  var sizeOptions = {};

	  var size = (0, _.getElementSize)(el);
	  var elWidth = size.width;
	  var elHeight = size.height;

	  if (elWidth !== 0 && elHeight !== 0) {
	    if (options.width === undefined) {
	      sizeOptions.width = elWidth;
	    }
	    if (options.height === undefined) {
	      sizeOptions.height = elHeight;
	    }
	  }
	  var curOptions = extend(options, sizeOptions);

	  // Options that go directly to Vega runtime
	  var vegaOptions = {
	    el: el,
	    renderer: curOptions.renderer
	  };

	  var vegaSpec = transform(spec, curOptions);

	  // Return a promise for the Vega chart object
	  return new Promise(function (resolve) {
	    _vega2.default.parse.spec(vegaSpec, function (chartObj) {
	      var chart = chartObj(vegaOptions);
	      chart.update();
	      resolve(chart);
	    });
	  });
	};

	exports.default = {
	  transform: transform,
	  parseChart: parseChart
	};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_32__;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

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
					"@if",
					[
						"@eq",
						[
							"@get",
							"axis"
						],
						"x"
					],
					"width",
					"height"
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
						"@get",
						"sizeSignal"
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
					"nice": [
						"@get",
						"nice",
						false
					],
					"round": [
						"@get",
						"round",
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
					],
					"formatType": [
						"@get",
						"formatType"
					],
					"format": [
						"@get",
						"format"
					],
					"properties": [
						"@get",
						"properties",
						{}
					]
				}
			]
		}
	];

/***/ })
/******/ ])
});
;