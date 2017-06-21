(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("datalib"), require("font-awesome-webpack"), require("UpSet"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "d3", "datalib", "font-awesome-webpack", "UpSet"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("datalib"), require("font-awesome-webpack"), require("UpSet"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["d3"], root["datalib"], root["font-awesome-webpack"], root["UpSet"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_68__) {
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

	var _UpSet = __webpack_require__(67);

	var _UpSet2 = _interopRequireDefault(_UpSet);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_UpSet2.default, 'UpSet');

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

/***/ 22:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ }),

/***/ 67:
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

	var _UpSet = __webpack_require__(68);

	var upset = _interopRequireWildcard(_UpSet);

	var _template = __webpack_require__(69);

	var _template2 = _interopRequireDefault(_template);

	__webpack_require__(22);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UpSet = function (_VisComponent) {
	  _inherits(UpSet, _VisComponent);

	  _createClass(UpSet, null, [{
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
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['integer', 'boolean', 'string']
	        }
	      }, {
	        name: 'fields',
	        type: 'string_list',
	        format: 'string_list',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'metadata',
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

	  function UpSet(el, options) {
	    _classCallCheck(this, UpSet);

	    var _this = _possibleConstructorReturn(this, (UpSet.__proto__ || Object.getPrototypeOf(UpSet)).call(this, el));

	    _this.options = options;
	    return _this;
	  }

	  _createClass(UpSet, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      if (!this.options.id || !this.options.sets && !this.options.fields) {
	        return;
	      }
	      if (!this.options.data || this.options.data.length === 0) {
	        return;
	      }

	      _d2.default.select(this.el).html(_template2.default);

	      // Swizzle the data into what UpSet expects (array of arrays)
	      var data = [];
	      var header = [this.options.id];
	      data.push(header);
	      this.options.data.forEach(function (d) {
	        data.push([d[_this2.options.id]]);
	      });

	      // Add 0/1 sets.
	      if (this.options.sets) {
	        var membershipVals = ['1', 'yes', 'true'];
	        this.options.sets.forEach(function (s) {
	          return header.push(s);
	        });
	        this.options.data.forEach(function (d, i) {
	          _this2.options.sets.forEach(function (s) {
	            var boolVal = '0';
	            var strVal = ('' + d[s]).toLowerCase();
	            if (membershipVals.indexOf(strVal) !== -1) {
	              boolVal = '1';
	            }
	            data[i + 1].push(boolVal);
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
	          distinct.forEach(function (v) {
	            return header.push(field + ' ' + v);
	          });
	          _this2.options.data.forEach(function (d, i) {
	            distinct.forEach(function (v) {
	              data[i + 1].push(v === d[field] ? '1' : '0');
	            });
	          });
	        });
	      }

	      var setsEnd = header.length - 1;

	      var meta = [{
	        type: 'id',
	        index: 0,
	        name: 'Name'
	      }];

	      // Add metadata fields.
	      if (this.options.metadata) {
	        if (!this.options.data.__types__) {
	          (0, _datalib.read)(this.options.data, { parse: 'auto' });
	        }
	        var upsetTypeMap = {
	          string: 'string',
	          date: 'integer',
	          number: 'float',
	          integer: 'integer',
	          boolean: 'integer'
	        };
	        this.options.metadata.forEach(function (field) {
	          header.push(field);
	          var type = upsetTypeMap[_this2.options.data.__types__[field]];
	          meta.push({
	            type: type,
	            index: header.length - 1,
	            name: field
	          });
	          _this2.options.data.forEach(function (d, i) {
	            data[i + 1].push('' + d[field]);
	          });
	        });
	      }

	      var datasets = [{
	        name: 'data',
	        data: data,
	        header: 0,
	        meta: meta,
	        sets: [{
	          format: 'binary',
	          start: 1,
	          end: setsEnd
	        }],
	        author: '',
	        description: '',
	        source: ''
	      }];

	      upset.UpSet(datasets);
	      this.ui = new upset.Ui();
	    }
	  }]);

	  return UpSet;
	}(_VisComponent3.default);

	exports.default = UpSet;

/***/ }),

/***/ 68:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_68__;

/***/ }),

/***/ 69:
/***/ (function(module, exports) {

	module.exports = "<div class=\"upset-body\">\n\n<div class=\"ui-header\">\n  <div class=\"header-container\">\n    <span class=\"header\">UpSet - Visualizing Intersecting Sets</span>\n    <span id=\"data-loading-indicator\">\n           <i class=\"fa fa-refresh fa-spin\"></i>\n    </span>\n    <span class=\"header-right-clickable\"><a href=\"https://github.com/hms-dbmi/UpSetR/\">UpSet for R</a></span>\n    <span class=\"header-right-clickable\"><a href=\"http://caleydo.org/tools/upset/\">About UpSet</a></span>\n    <span id=\"load-data-header\" class=\"header-right-clickable\">Load Data</span>\n    <span id=\"dataset-selector\" class=\"header-right\"></span>\n  </div>\n</div>\n\n<div class=\"ui-menu\">\n  <div class=\"menu-container\">\n      <span>Provide a <a href=\"https://github.com/VCG/upset/wiki/Data-Import\">JSON file</a> defining your data: <input\n              id=\"custom-dataset-url\"\n              type=\"text\" style=\"width: 500px\"\n              value=\"https://dl.dropboxusercontent.com/u/36962787/UpSet/movies.json\"/> <input id=\"custom-dataset-submit\"\n                                                                                              type=\"submit\"\n                                                                                              value=\"Submit\"> | <a\n              href=\"https://github.com/VCG/upset/wiki/\">Learn how to create the JSON file</a></span>\n  </div>\n</div>\n\n<div class=\"ui-fader\">\n</div>\n\n\n<div class=\"ui-container\">\n  <div class=\"ui-row\">\n\n    <!--------------- Left Side configuration menu ------------------>\n\n    <div class=\"ui-column ui-layout-west\" style=\"width:120px;\">\n      <div id=\"groupConfig\" class=\"configTable\">\n\n\n        <div class=\"configHeader\">First, aggregate by</div>\n        <div id=\"firstLevelGrouping\"></div>\n        <div id='firstLevelMinCardinality' style=\"padding-top: 5px;\" hidden>overlap degree:<br/> <input\n                id='firstLevelMinCardinalityInput' type='number' min='0' max='12' value='0'>\n\n        </div>\n      </div>\n\n\n      <div id=\"groupL2Config\" class=\"configTable\">\n        <div class=\"configHeader\">Then, aggregate by</div>\n        <div id=\"secondLevelGrouping\"></div>\n        <div id='secondLevelMinCardinality' style=\"padding-top: 5px;\" hidden>overlap degree:<br/> <input\n                id='secondLevelMinCardinalityInput' type='number' min='0' max='12' value='0'>\n        </div>\n      </div>\n\n      <div id=\"sortConfig\" class=\"configTable\">\n        <div class=\"configHeader\"> Sort by</div>\n        <div><input type='radio' id='sortNrSetsInIntersection' name='sort' checked=\"true\">\n          <label for=\"sortNrSetsInIntersection\">Degree</label></div>\n        <div><input type='radio' id='sortIntersectionSize' name='sort'><label for=\"sortIntersectionSize\">\n          Cardinality</label></div>\n        <div><input type='radio' id=\"sortRelevanceMeasure\" name='sort'>\n          <label for=\"sortRelevanceMeasure\"> Deviation</label></div>\n      </div>\n\n      <div id='options' class='configTable'>\n        <div class=\"configHeader\">Aggregates</div>\n        <div><span class=\"option level-1-button\" id=\"collapseAll\">Collapse All</span></div>\n        <div><span class=\"option level-1-button\" id=\"expandAll\">Expand All</span></div>\n      </div>\n\n\n      <div id='rowSize' class='configTable'>\n        <div class=\"configHeader\">Row Height</div>\n        <div>\n          <select id='rowSizeValue'>\n            <option value=\"20\">Large</option>\n            <option value=\"15\">Medium</option>\n            <option value=\"12\">Small</option>\n          </select>\n        </div>\n      </div>\n\n\n      <div id='intersectionSize' class='configTable'>\n        <div class=\"configHeader\">Data</div>\n        <div>Min Degree:<br/> <input id='minCardinality' type='number' min='0' max='12' value='0'>\n\n        </div>\n        <div>Max Degree:<br/><input id='maxCardinality' type='number' min='0' max='12'></div>\n        <div><input type='checkbox' id='hideEmpties' checked='true'><label for=\"hideEmpties\">Hide Empty\n          Intersections</label></div>\n      </div>\n\n\n      <div id='venn-diagram-viewer' class='configTable'>\n        <div class=\"configHeader\">Venn Diagram</div>\n        <div id=\"venn-vis\"></div>\n      </div>\n\n      <div id='dataset-info-viewer'>\n        <div class=\"configH1\">Dataset Information</div>\n        <div id='dataset-info-content'>Was</div>\n      </div>\n\n\n    </div>\n\n\n    <!---------------center panel with set view  ------------------>\n\n    <!--padding: 0px;-->\n    <div class=\"ui-column ui-layout-center\">\n      <div id=\"set-vis-container\" data-height-ratio=\"1\" class=\"fixed-y-container\">\n\n        <!--<div class=\"matrixTableContainer\">-->\n        <div style=\"display: table;\">\n          <div style=\"display: table-row;\">\n            <div style=\"display: table-cell\">\n              <div id=\"headerVis\">\n                <!--style=\"width:200px\"-->\n\n              </div>\n            </div>\n          </div>\n          <div style=\"display: table-row\">\n            <div style=\"display: table-cell\">\n\n              <div id=\"bodyVis\">\n                <!--style=\"height:300px; width:200px\"-->\n\n              </div>\n\n            </div>\n          </div>\n\n\n        </div>\n        <!--</div>-->\n\n        <!--<div id=\"vis\"></div>-->\n      </div>\n    </div>\n\n    <!---------------right panel with element view  ------------------>\n\n    <div class=\"ui-column ui-layout-east\">\n\n      <span id=\"moveHandle\"></span>\n\n      <div class=\"element-view-header\">\n        <div class=\"element-view-title\">\n          Element Visualizations\n        </div>\n      </div>\n      <div id=\"element-viewers-container\" class=\"element-view-container\">\n        <div id=\"element-viewers-visualization\"></div>\n        <div id=\"element-viewers-controls\" class=\"element-view-controls\"></div>\n      </div>\n\n      <div class=\"element-view-header\">\n        <div class=\"element-view-title\">\n          Element Queries\n        </div>\n      </div>\n\n      <div id=\"selection-vis-container\" class=\"element-view-container\">\n        <div id=\"selection-tabs\"></div>\n        <div id=\"selection-controls\" class=\"element-view-controls\"></div>\n      </div>\n\n      <div class=\"element-view-header\">\n        <div class=\"element-view-subtitle\">\n          Query Filters\n        </div>\n      </div>\n\n      <div id=\"filters-container\" class=\"element-view-container\">\n        <div id=\"filters-list\"></div>\n        <div id=\"filters-controls\" class=\"element-view-controls\"></div>\n      </div>\n\n      <div class=\"element-view-header\">\n        <div class=\"element-view-subtitle\">\n          Query Results\n        </div>\n      </div>\n\n      <div id=\"item-table-container\" data-height-ratio=\"1\" class=\"fixed-y-container element-view-container\">\n        <div id=\"item-table\"></div>\n      </div>\n    </div>\n  </div>\n</div>\n\n</div>\n";

/***/ })

/******/ })
});
;