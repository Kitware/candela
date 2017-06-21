(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("webcola"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "d3", "webcola"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("webcola"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["d3"], root["webcola"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_39__) {
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

	var _SimilarityGraph = __webpack_require__(38);

	var _SimilarityGraph2 = _interopRequireDefault(_SimilarityGraph);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_SimilarityGraph2.default, 'SimilarityGraph');

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

/***/ 38:
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

	var _webcola = __webpack_require__(39);

	var _webcola2 = _interopRequireDefault(_webcola);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SimilarityGraph = function (_VisComponent) {
	  _inherits(SimilarityGraph, _VisComponent);

	  function SimilarityGraph(el, _ref) {
	    var data = _ref.data,
	        _ref$threshold = _ref.threshold,
	        threshold = _ref$threshold === undefined ? 0 : _ref$threshold,
	        _ref$linkDistance = _ref.linkDistance,
	        linkDistance = _ref$linkDistance === undefined ? 100 : _ref$linkDistance,
	        _ref$id = _ref.id,
	        id = _ref$id === undefined ? 'id' : _ref$id,
	        color = _ref.color,
	        _ref$size = _ref.size,
	        size = _ref$size === undefined ? 10 : _ref$size,
	        _ref$width = _ref.width,
	        width = _ref$width === undefined ? 960 : _ref$width,
	        _ref$height = _ref.height,
	        height = _ref$height === undefined ? 540 : _ref$height;

	    _classCallCheck(this, SimilarityGraph);

	    var _this = _possibleConstructorReturn(this, (SimilarityGraph.__proto__ || Object.getPrototypeOf(SimilarityGraph)).call(this, el));

	    _this.data = data;

	    // Empty the top-level div.
	    _this.empty();
	    _d2.default.select(_this.el).selectAll('*').remove();

	    // Construct an SVG element inside the top-level div.
	    _this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	    _this.svg.setAttribute('width', width);
	    _this.svg.setAttribute('height', height);
	    _this.el.appendChild(_this.svg);

	    // Construct a function that returns the needed size - either a constant
	    // supplied in the `size` parameter, or a lookup function that pulls it from
	    // the data table.
	    var sizeMap = _d2.default.scale.linear().domain(_d2.default.extent(data, function (d) {
	      return d[size];
	    })).range([5, 15]);
	    var sizeFunc = function sizeFunc(d) {
	      return typeof size === 'string' ? sizeMap(d[size]) : size;
	    };

	    // Construct lookup function for the color field.
	    var colorScale = _d2.default.scale.linear().domain(_d2.default.extent(data, function (d) {
	      return d[color];
	    })).range(['white', 'steelblue']);
	    var colormap = typeof data[0][color] === 'string' ? _d2.default.scale.category10() : colorScale;
	    var colorFunc = color !== undefined ? function (d) {
	      return colormap(d[color]);
	    } : function () {
	      return 'rgb(31, 119, 180)';
	    };

	    // Get the width and height of the SVG element. This is necessary here in
	    // case non-pixel measures like '100%' were passed to the component.
	    var bbox = _this.svg.getBoundingClientRect();
	    var w = bbox.width;
	    var h = bbox.height;

	    // Initialize the cola object.
	    _this.cola = _webcola2.default.d3adaptor(_d2.default).linkDistance(linkDistance).size([w, h]);

	    // Compute the graph.
	    //
	    // Create a list of nodes.
	    var nodes = _this.nodes = _this.data.map(function (d) {
	      return {
	        id: d[id],
	        color: colorFunc(d),
	        width: 2 * sizeFunc(d),
	        height: 2 * sizeFunc(d),
	        size: sizeFunc(d)
	      };
	    });

	    // Construct an index map into the nodes list.
	    var idxmap = {};
	    nodes.forEach(function (node, i) {
	      return idxmap[node.id] = i;
	    });

	    // Create a list of links by using a nested forEach to cull out the links
	    // that don't have enough strength.
	    _this.links = [];
	    _this.data.forEach(function (a) {
	      return _this.data.forEach(function (b) {
	        if (a[id] !== b[id] && a[b[id]] >= threshold) {
	          _this.links.push({
	            source: idxmap[a[id]],
	            target: idxmap[b[id]]
	          });
	        }
	      });
	    });

	    // Create a D3 selection for the links, and initialize it with some line
	    // elements.
	    _this.linkSelection = _d2.default.select(_this.svg).selectAll('line.link').data(_this.links);

	    _this.linkSelection = _this.linkSelection.enter().append('line').classed('link', true).attr('stroke-width', 1).attr('stroke', 'gray');

	    // Create a D3 selection for the nodes, and initialize it with some circle
	    // elements.
	    _this.nodeSelection = _d2.default.select(_this.svg).selectAll('circle.node').data(_this.nodes);

	    _this.nodeSelection = _this.nodeSelection.enter().append('circle').classed('node', true).attr('r', function (d) {
	      return d.size;
	    }).style('stroke', 'black').style('fill', function (d) {
	      return d.color;
	    }).style('cursor', 'crosshair').call(_this.cola.drag);

	    // Create a D3 selection for node labels.
	    _this.labelSelection = _d2.default.select(_this.svg).selectAll('text.label').data(_this.nodes);

	    var that = _this;
	    _this.labelSelection = _this.labelSelection.enter().append('text').classed('label', true).text(function (d) {
	      return d.id;
	    }).each(function (d, i) {
	      var bbox = this.getBBox();
	      that.nodes[i].height += bbox.height;
	    }).style('cursor', 'crosshair').call(_this.cola.drag);

	    _this.cola.on('tick', function () {
	      _this.nodeSelection.attr('cx', function (d) {
	        return d.x;
	      }).attr('cy', function (d) {
	        return d.y;
	      });

	      _this.labelSelection.attr('x', function (d) {
	        var bbox = this.getBBox();
	        return d.x - 0.5 * bbox.width;
	      }).attr('y', function (d) {
	        var bbox = this.getBBox();
	        return d.y + bbox.height + 0.5 * d.size;
	      });

	      _this.linkSelection.attr('x1', function (d) {
	        return d.source.x;
	      }).attr('y1', function (d) {
	        return d.source.y;
	      }).attr('x2', function (d) {
	        return d.target.x;
	      }).attr('y2', function (d) {
	        return d.target.y;
	      });
	    });

	    _this.cola.avoidOverlaps(true).nodes(_this.nodes).links(_this.links).start(10, 15, 20);
	    return _this;
	  }

	  _createClass(SimilarityGraph, [{
	    key: 'render',
	    value: function render() {}
	  }], [{
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
	        name: 'color',
	        description: 'The field used for coloring the nodes.',
	        type: 'string',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'size',
	        description: 'The field used for sizing the nodes.',
	        type: 'string',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number', 'integer']
	        }
	      }, {
	        name: 'linkDistance',
	        description: 'The desired length of links.',
	        type: 'number',
	        format: 'number',
	        default: 100
	      }, {
	        name: 'threshold',
	        description: 'Only display links where the similarity is above this threshold.',
	        type: 'number',
	        format: 'number',
	        default: 0
	      }];
	    }
	  }]);

	  return SimilarityGraph;
	}(_VisComponent3.default);

	exports.default = SimilarityGraph;

/***/ }),

/***/ 39:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_39__;

/***/ })

/******/ })
});
;