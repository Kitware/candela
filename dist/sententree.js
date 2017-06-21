(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("sententree"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "sententree"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("sententree"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["sententree"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_37__) {
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

	var _SentenTree = __webpack_require__(36);

	var _SentenTree2 = _interopRequireDefault(_SentenTree);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_SentenTree2.default, 'SentenTree');

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _sententree = __webpack_require__(37);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SentenTree = function (_VisComponent) {
	  _inherits(SentenTree, _VisComponent);

	  _createClass(SentenTree, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        description: 'The data table.',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'id',
	        description: 'The field containing the identifier of each row.',
	        type: 'string',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'integer', 'number']
	        }
	      }, {
	        name: 'text',
	        description: 'The field containing the text sample.',
	        type: 'string',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string']
	        }
	      }, {
	        name: 'count',
	        description: 'The field containing the count for each text sample.',
	        type: 'string',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['integer']
	        }
	      }, {
	        name: 'graphs',
	        description: 'The number of graphs to compute and render.',
	        type: 'integer',
	        format: 'integer',
	        default: 3
	      }];
	    }
	  }]);

	  function SentenTree(el, _ref) {
	    var data = _ref.data,
	        _ref$id = _ref.id,
	        id = _ref$id === undefined ? null : _ref$id,
	        _ref$text = _ref.text,
	        text = _ref$text === undefined ? 'text' : _ref$text,
	        _ref$count = _ref.count,
	        count = _ref$count === undefined ? 'count' : _ref$count,
	        _ref$graphs = _ref.graphs,
	        graphs = _ref$graphs === undefined ? 3 : _ref$graphs;

	    _classCallCheck(this, SentenTree);

	    // Empty element.
	    var _this = _possibleConstructorReturn(this, (SentenTree.__proto__ || Object.getPrototypeOf(SentenTree)).call(this, el));

	    _this.empty();

	    // Transform input data into correct form.
	    _this.data = data.map(function (d, i) {
	      return {
	        id: id ? d[id] : i,
	        text: d[text],
	        count: d[count] !== undefined ? d[count] : 1
	      };
	    });

	    var model = new _sententree.SentenTreeBuilder().buildModel(_this.data);

	    _this.vis = new _sententree.SentenTreeVis(el).data(model.getRenderedGraphs(graphs));
	    return _this;
	  }

	  _createClass(SentenTree, [{
	    key: 'render',
	    value: function render() {}
	  }]);

	  return SentenTree;
	}(_VisComponent3.default);

	exports.default = SentenTree;

/***/ }),

/***/ 37:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_37__;

/***/ })

/******/ })
});
;