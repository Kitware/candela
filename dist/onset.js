(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("datalib"), require("onset"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "d3", "datalib", "onset"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("datalib"), require("onset"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["d3"], root["datalib"], root["onset"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_35__) {
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
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _candela = __webpack_require__(3);

	var _candela2 = _interopRequireDefault(_candela);

	var _OnSet = __webpack_require__(34);

	var _OnSet2 = _interopRequireDefault(_OnSet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_OnSet2.default, 'OnSet');

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),

/***/ 14:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }),

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _datalib = __webpack_require__(14);

	var _onset = __webpack_require__(35);

	var _onset2 = _interopRequireDefault(_onset);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var OnSet = function (_VisComponent) {
	  _inherits(OnSet, _VisComponent);

	  _createClass(OnSet, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'id',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'sets',
	        type: 'string_list',
	        format: 'string_list',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['integer', 'boolean']
	        }
	      }, {
	        name: 'fields',
	        type: 'string_list',
	        format: 'string_list',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  function OnSet(el, options) {
	    _classCallCheck(this, OnSet);

	    var _this = _possibleConstructorReturn(this, (OnSet.__proto__ || Object.getPrototypeOf(OnSet)).call(this, el));

	    _this.options = options;
	    return _this;
	  }

	  _createClass(OnSet, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      if (!this.options.id || !this.options.sets && !this.options.fields) {
	        return;
	      }

	      _d2.default.select(this.el).html(_onset2.default.template);

	      // Swizzle the data into what OnSet expects (csv of form id,set1,set2,...)
	      var data = [];
	      this.options.data.forEach(function (d) {
	        data.push([d[_this2.options.id]]);
	      });

	      // Add 0/1 sets.
	      if (this.options.sets) {
	        var membershipVals = ['1', 'yes', 'true'];
	        this.options.data.forEach(function (d, i) {
	          _this2.options.sets.forEach(function (s) {
	            var strVal = ('' + d[s]).toLowerCase();
	            if (membershipVals.indexOf(strVal) !== -1) {
	              data[i].push(s);
	            }
	          });
	        });
	      }

	      // Add sets derived from general fields.
	      // A set is defined by records sharing a field value.
	      if (this.options.fields) {
	        this.options.fields.forEach(function (field) {
	          var distinct = (0, _datalib.unique)(_this2.options.data, function (d) {
	            return d[field];
	          });
	          _this2.options.data.forEach(function (d, i) {
	            distinct.forEach(function (v) {
	              if (v === d[field]) {
	                data[i].push(field + ' ' + v);
	              }
	            });
	          });
	        });
	      }

	      var csvData = '';
	      if (this.options.rowSets) {
	        data.forEach(function (d) {
	          csvData += d.join(',') + '\n';
	        });
	      } else {
	        var sets = {};
	        data.forEach(function (d) {
	          d.forEach(function (s, i) {
	            if (i === 0) {
	              return;
	            }
	            if (sets[s] === undefined) {
	              sets[s] = [s];
	            }
	            sets[s].push(d[0]);
	          });
	        });
	        Object.keys(sets).forEach(function (s) {
	          csvData += sets[s].join(',') + '\n';
	        });
	      }

	      window.sessionStorage.setItem('datatype', 'custom');
	      window.sessionStorage.setItem('data', csvData);

	      _onset2.default.main();
	    }
	  }]);

	  return OnSet;
	}(_VisComponent3.default);

	exports.default = OnSet;

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_35__;

/***/ })

/******/ })
});
;