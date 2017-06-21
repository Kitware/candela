(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("glo"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "d3", "glo"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("glo"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["d3"], root["glo"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_11__) {
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

	var _Glo = __webpack_require__(10);

	var _Glo2 = _interopRequireDefault(_Glo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_Glo2.default, 'Glo');

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ }),
/* 9 */,
/* 10 */
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

	var _glo = __webpack_require__(11);

	var _glo2 = _interopRequireDefault(_glo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var colorNodes = function colorNodes(glo, field, type) {
	  glo.glo.node_attr(_defineProperty({}, field, type));

	  glo.glo.color_nodes_by(field);
	};

	var Glo = function (_VisComponent) {
	  _inherits(Glo, _VisComponent);

	  function Glo(el, _ref) {
	    var nodes = _ref.nodes,
	        edges = _ref.edges,
	        _ref$width = _ref.width,
	        width = _ref$width === undefined ? 960 : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === undefined ? 540 : _ref$height;

	    _classCallCheck(this, Glo);

	    // Empty the top-level div.
	    var _this = _possibleConstructorReturn(this, (Glo.__proto__ || Object.getPrototypeOf(Glo)).call(this, el));

	    _d2.default.select(_this.el).selectAll('*').remove();

	    // Construct and append an SVG element to the top-level div.
	    _this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	    _this.svg.setAttribute('width', width);
	    _this.svg.setAttribute('height', height);
	    _this.el.appendChild(_this.svg);

	    // Construct a GLO object.
	    _this.glo = new _glo2.default.GLO(_d2.default.select(_this.svg)).nodes(nodes).edges(edges);
	    return _this;
	  }

	  _createClass(Glo, [{
	    key: 'render',
	    value: function render() {
	      if (!this.drawn) {
	        this.glo.draw();
	        this.drawn = true;
	      }
	    }
	  }, {
	    key: 'colorNodesDiscrete',
	    value: function colorNodesDiscrete(field) {
	      colorNodes(this, field, 'discrete');
	    }
	  }, {
	    key: 'colorNodesContinuous',
	    value: function colorNodesContinuous(field) {
	      colorNodes(this, field, 'continuous');
	    }
	  }, {
	    key: 'colorNodesDefault',
	    value: function colorNodesDefault() {
	      this.glo.color_nodes_by_constant();
	    }
	  }, {
	    key: 'sizeNodes',
	    value: function sizeNodes(field) {
	      this.glo.node_attr(_defineProperty({}, field, 'continuous'));

	      this.glo.size_nodes_by(field);
	    }
	  }, {
	    key: 'sizeNodesDefault',
	    value: function sizeNodesDefault() {
	      this.glo.size_nodes_by_constant();
	    }
	  }, {
	    key: 'distributeNodes',
	    value: function distributeNodes(axis) {
	      var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	      if (attr === null) {
	        this.glo.evenly_distribute_nodes_on(axis);
	      } else {
	        this.glo.evenly_distribute_nodes_on(axis, {
	          by: attr
	        });
	      }
	    }
	  }, {
	    key: 'positionNodes',
	    value: function positionNodes(axis, value) {
	      this.glo.node_attr(_defineProperty({}, value, 'continuous'));

	      this.glo.position_nodes_on(axis, value);
	    }
	  }, {
	    key: 'forceDirected',
	    value: function forceDirected() {
	      this.glo.apply_force_directed_algorithm_to_nodes();
	    }
	  }, {
	    key: 'showEdges',
	    value: function showEdges() {
	      this.glo.show_all_edges();
	    }
	  }, {
	    key: 'hideEdges',
	    value: function hideEdges() {
	      this.glo.hide_edges();
	    }
	  }, {
	    key: 'fadeEdges',
	    value: function fadeEdges() {
	      this.glo.show_edges_as_faded();
	    }
	  }, {
	    key: 'solidEdges',
	    value: function solidEdges() {
	      this.hideEdges();
	      this.showEdges();
	    }
	  }, {
	    key: 'incidentEdges',
	    value: function incidentEdges() {
	      this.glo.show_incident_edges();
	    }
	  }, {
	    key: 'curvedEdges',
	    value: function curvedEdges() {
	      this.glo.display_edges_as_curved_lines();
	    }
	  }, {
	    key: 'straightEdges',
	    value: function straightEdges() {
	      this.glo.display_edges_as_straight_lines();
	    }
	  }]);

	  return Glo;
	}(_VisComponent3.default);

	exports.default = Glo;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_11__;

/***/ })
/******/ ])
});
;