(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("geojs"), require("candela/VisComponent"), require("d3"), require("candela/util"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "geojs", "candela/VisComponent", "d3", "candela/util"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("geojs"), require("candela/VisComponent"), require("d3"), require("candela/util"));
	else
		root["candela"] = factory(root["candela"], root["geojs"], root["candela/VisComponent"], root["d3"], root["candela/util"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_9__) {
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

	var _Geo = __webpack_require__(4);

	var _Geo2 = _interopRequireDefault(_Geo);

	var _GeoDots = __webpack_require__(7);

	var _GeoDots2 = _interopRequireDefault(_GeoDots);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var components = {
	  Geo: _Geo2.default,
	  GeoDots: _GeoDots2.default
	};

	Object.entries(components).forEach(function (entry) {
	  return _candela2.default.register(entry[1], entry[0]);
	});

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _geojs = __webpack_require__(5);

	var _geojs2 = _interopRequireDefault(_geojs);

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Geo = function (_VisComponent) {
	  _inherits(Geo, _VisComponent);

	  function Geo(el, _ref) {
	    var _ref$map = _ref.map,
	        map = _ref$map === undefined ? {} : _ref$map,
	        _ref$layers = _ref.layers,
	        layers = _ref$layers === undefined ? [] : _ref$layers,
	        width = _ref.width,
	        height = _ref.height;

	    _classCallCheck(this, Geo);

	    var _this = _possibleConstructorReturn(this, (Geo.__proto__ || Object.getPrototypeOf(Geo)).call(this, el));

	    width = width || map.width || 600;
	    height = height || map.height || 600;

	    el.style.width = width + 'px';
	    el.style.height = height + 'px';

	    // Construct a GeoJS map object based on the requested options.
	    _this.plot = _geojs2.default.map(Object.assign({
	      node: el
	    }, map));

	    // Process the requested layers.
	    _this.layers = [];
	    layers.forEach(function (layer) {
	      switch (layer.type) {
	        case 'osm':
	          _this.layers.push(_this.plot.createLayer('osm', layer));
	          break;

	        case 'feature':
	          layer.features.forEach(function (spec) {
	            var feature = _this.plot.createLayer('feature', {
	              renderer: 'd3'
	            }).createFeature(spec.type).data(spec.data).position(function (d) {
	              return {
	                x: d[spec.x],
	                y: d[spec.y]
	              };
	            });

	            var style = Object.assign({
	              fillColor: 'red',
	              strokeColor: 'darkred'
	            }, spec.style);

	            feature.style(style);

	            _this.layers.push(feature);
	          });
	          break;
	      }
	    });

	    _this.render();
	    return _this;
	  }

	  _createClass(Geo, [{
	    key: 'render',
	    value: function render() {
	      this.plot.draw();
	    }
	  }]);

	  return Geo;
	}(_VisComponent3.default);

	exports.default = Geo;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _Geo = __webpack_require__(4);

	var _Geo2 = _interopRequireDefault(_Geo);

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _util = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var computeSizeTransform = function computeSizeTransform(data, sizeField) {
	  var sizeTransform = 5;
	  if (sizeField) {
	    var range = (0, _util.minmax)(data.map(function (d) {
	      return d[sizeField];
	    }));
	    var scale = _d2.default.scale.linear().domain([range.min, range.max]).range([3, 19]);

	    sizeTransform = function sizeTransform(d) {
	      return scale(d[sizeField]);
	    };
	  }

	  return sizeTransform;
	};

	var computeColorTransforms = function computeColorTransforms(data, color) {
	  var fillTransform = 'red';
	  var strokeTransform = 'darkred';
	  if (color && data.length > 0) {
	    var fillScale = void 0,
	        strokeScale = void 0;

	    var type = _typeof(data[0][color]);
	    if (type === undefined || type === 'string') {
	      fillScale = _d2.default.scale.category10();
	      strokeScale = 'black';
	    } else {
	      var range = (0, _util.minmax)(data.map(function (d) {
	        return d[color];
	      }));

	      var red = _d2.default.rgb('#ef6a62');
	      var blue = _d2.default.rgb('#67a9cf');
	      var darkred = red.darker();
	      var darkblue = blue.darker();

	      fillScale = _d2.default.scale.linear().domain([range.min, range.max]).range([red, blue]);

	      strokeScale = _d2.default.scale.linear().domain([range.min, range.max]).range([darkred, darkblue]);
	    }

	    fillTransform = function fillTransform(d) {
	      return fillScale(d[color]);
	    };
	    if (strokeScale === 'black') {
	      strokeTransform = 'black';
	    } else {
	      strokeTransform = function strokeTransform(d) {
	        return strokeScale(d[color]);
	      };
	    }
	  }

	  return {
	    fillTransform: fillTransform,
	    strokeTransform: strokeTransform
	  };
	};

	var GeoDots = function (_VisComponent) {
	  _inherits(GeoDots, _VisComponent);

	  _createClass(GeoDots, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'latitude',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number']
	        }
	      }, {
	        name: 'longitude',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number']
	        }
	      }, {
	        name: 'color',
	        type: 'string',
	        format: 'text',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'size',
	        type: 'string',
	        format: 'text',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  function GeoDots(el, options) {
	    _classCallCheck(this, GeoDots);

	    var _this = _possibleConstructorReturn(this, (GeoDots.__proto__ || Object.getPrototypeOf(GeoDots)).call(this, el));

	    var width = options.width || 600;
	    var height = options.height || 600;

	    el.style.width = width + 'px';
	    el.style.height = height + 'px';

	    var sizeTransform = computeSizeTransform(options.data, options.size);

	    var _computeColorTransfor = computeColorTransforms(options.data, options.color),
	        fillTransform = _computeColorTransfor.fillTransform,
	        strokeTransform = _computeColorTransfor.strokeTransform;

	    // TODO(choudhury): don't mutate the options object directly.


	    options.layers = [];
	    if (options.tileUrl !== null) {
	      options.layers.push({
	        type: 'osm',
	        url: options.tileUrl
	      });
	    }

	    options.layers.push({
	      type: 'feature',
	      features: [{
	        name: 'feature1',
	        type: 'point',
	        x: options.longitude,
	        y: options.latitude,
	        style: {
	          radius: sizeTransform,
	          fillColor: fillTransform,
	          strokeColor: strokeTransform
	        },
	        data: options.data
	      }]
	    });

	    options.center = options.center || {};
	    var center = {
	      x: options.center.longitude || 0.0,
	      y: options.center.latitude || 0.0
	    };

	    var map_options = Object.assign({
	      map: {
	        zoom: options.zoom,
	        center: center
	      }
	    }, options);

	    _this.geojs = new _Geo2.default(_this.el, map_options);
	    _this.options = options;
	    return _this;
	  }

	  _createClass(GeoDots, [{
	    key: 'render',
	    value: function render() {
	      this.geojs.render();
	    }
	  }, {
	    key: 'update',
	    value: function update(options) {
	      var _this2 = this;

	      var points = this.geojs.layers[1];

	      var changed = new Set();
	      ['longitude', 'latitude', 'color', 'size'].forEach(function (opt) {
	        if (options[opt]) {
	          changed.add(opt);
	          _this2.options[opt] = options[opt];
	        }
	      });

	      if (changed.has('longitude') || changed.has('latitude')) {
	        points.position(function (d) {
	          return {
	            x: d[_this2.options.longitude],
	            y: d[_this2.options.latitude]
	          };
	        });
	      }

	      if (changed.has('size')) {
	        points.style('radius', computeSizeTransform(this.options.data, this.options.size));
	      }

	      if (changed.has('color')) {
	        var _computeColorTransfor2 = computeColorTransforms(this.options.data, this.options.color),
	            fillTransform = _computeColorTransfor2.fillTransform,
	            strokeTransform = _computeColorTransfor2.strokeTransform;

	        points.style('fillColor', fillTransform).style('strokeColor', strokeTransform);
	      }

	      if (changed.size > 0) {
	        points.modified();
	      }

	      return Promise.resolve(this);
	    }
	  }]);

	  return GeoDots;
	}(_VisComponent3.default);

	exports.default = GeoDots;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ })
/******/ ])
});
;