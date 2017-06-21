(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("jquery"), require("datalib"), require("lineupjs"), require("lineupjs/build/style.css"), require("font-awesome-webpack"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "d3", "jquery", "datalib", "lineupjs", "lineupjs/build/style.css", "font-awesome-webpack"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("jquery"), require("datalib"), require("lineupjs"), require("lineupjs/build/style.css"), require("font-awesome-webpack"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["d3"], root["jquery"], root["datalib"], root["lineupjs"], root["lineupjs/build/style.css"], root["font-awesome-webpack"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_16__, __WEBPACK_EXTERNAL_MODULE_22__) {
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

	var _LineUp = __webpack_require__(12);

	var _LineUp2 = _interopRequireDefault(_LineUp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_LineUp2.default, 'LineUp');

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
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _datalib = __webpack_require__(14);

	var _datalib2 = _interopRequireDefault(_datalib);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _lineupjs = __webpack_require__(15);

	var LineUpJS = _interopRequireWildcard(_lineupjs);

	__webpack_require__(16);

	__webpack_require__(17);

	__webpack_require__(22);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LineUp = function (_VisComponent) {
	  _inherits(LineUp, _VisComponent);

	  _createClass(LineUp, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'fields',
	        type: 'string_list',
	        format: 'string_list',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'stacked',
	        type: 'boolean',
	        format: 'boolean',
	        optional: true
	      }, {
	        name: 'histograms',
	        type: 'boolean',
	        format: 'boolean',
	        optional: true
	      }, {
	        name: 'animation',
	        type: 'boolean',
	        format: 'boolean',
	        optional: true
	      }];
	    }
	  }]);

	  function LineUp(el, options) {
	    _classCallCheck(this, LineUp);

	    var _this = _possibleConstructorReturn(this, (LineUp.__proto__ || Object.getPrototypeOf(LineUp)).call(this, el));

	    var width = options.width || 800;
	    var height = options.height || 600;

	    el.style.width = width + 'px';
	    el.style.height = height + 'px';

	    _this.options = options;
	    _this.lineUpConfig = {
	      interaction: {
	        tooltips: false
	      },
	      renderingOptions: {
	        animation: options.animation !== undefined ? options.animation : true,
	        histograms: options.histograms !== undefined ? options.histograms : true,
	        stacked: options.stacked !== undefined ? options.stacked : false
	      },
	      body: {
	        mode: 'separate',
	        rowPadding: 0
	      },
	      /* false to prevent removing columns and other actions */
	      manipulative: true
	    };
	    _this.lineupInstances = {};
	    _this.lineupColumns = {};
	    _this.lineupRankWidth = 50; /* from the LineUpJS code */
	    return _this;
	  }

	  /* Get the width of a column.  If the user has changed the width, scale based
	  * on that activity.
	  *
	  * @param name: name of the lineup.  Used for user settings.
	  * @param col: column specification.
	  * @param fixed: minimum width for a column.
	  */


	  _createClass(LineUp, [{
	    key: 'lineupGetColumnWidth',
	    value: function lineupGetColumnWidth(name, col, fixed) {
	      var width = col.width || 0;
	      var colname = col.column || col.type;
	      /* Get the column scaling based on the user settings, if available */
	      if (this.lineupColumns && this.lineupColumns[name] && this.lineupColumns[name][colname]) {
	        width = this.lineupColumns[name][colname] + fixed;
	      }
	      var colWidth = width < fixed ? 0 : width - fixed;
	      if (col === 'rank') {
	        /* defined in LineUp */
	        colWidth = this.lineupRankWidth;
	      }
	      col.widthBasis = colWidth;
	      col.widthFixed = fixed;
	      return col.widthBasis;
	    }

	    /* Adjust the width of the columns in lineup to (a) use the available space,
	    * and (b) use the weights selected by the user.
	    *
	    * @param elem: the element where the lineup is placed.
	    * @param name: the name used for this lineup.  Used for tracking user widths.
	    * @param spec: the specification for the lineup.  Modified.
	    * @param fixed: fixed width used in each column.
	    * @returns: relative scale of lineup to available space.
	    */

	  }, {
	    key: 'createLineupAdjustWidth',
	    value: function createLineupAdjustWidth(elem, name, spec, fixed) {
	      var rankWidth = 0;
	      var total = 0;
	      var count = 0;
	      var c1 = void 0,
	          c2 = void 0;
	      /* The final width value of 30 is to leave room for a scroll bar. */
	      var width = (0, _jquery2.default)(elem)[0].getBoundingClientRect().width - fixed * 2 - 30;
	      var col = spec.dataspec.layout.primary;
	      for (c1 = 0; c1 < col.length; c1 += 1) {
	        if (col[c1].children) {
	          for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
	            count += 1;
	            total += this.lineupGetColumnWidth(name, col[c1].children[c2], fixed);
	          }
	        } else {
	          if (col[c1].type === 'rank') {
	            /* LineUp wants this to be 50 */
	            rankWidth = this.lineupRankWidth + fixed;
	            continue;
	          }
	          count += 1;
	          total += this.lineupGetColumnWidth(name, col[c1], fixed);
	        }
	      }
	      var avail = width - count * fixed - rankWidth;
	      avail -= count + (rankWidth ? 1 : 0); // I'm not sure why this is necessary
	      var scale = avail / total;
	      for (c1 = 0; c1 < col.length; c1 += 1) {
	        if (col[c1].children) {
	          for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
	            col[c1].children[c2].width = fixed + col[c1].children[c2].widthBasis * scale;
	          }
	        } else {
	          col[c1].width = fixed + col[c1].widthBasis * scale;
	          if (col[c1].type === 'rank') {
	            /* LineUp wants this to be fixed */
	            col[c1].width = this.lineupRankWidth + fixed;
	          }
	        }
	      }
	      return scale;
	    }

	    /* Create or recreate a lineup control.
	    *
	    * @param elem: selector to the parent div wrapper for the control.
	    * @param name: name of the control.
	    * @param desc: column description.
	    * @param dataset: dataset to load.
	    * @param lineupObj: old lineup object to replace.
	    * @param sort: if specified, sort by this column.
	    * @param selectCallback: if present, bind 'selected' to this function.
	    * @returns: a lineup control object.
	    */

	  }, {
	    key: 'createLineup',
	    value: function createLineup(elem, name, desc, dataset, lineupObj, sort, selectCallback) {
	      var _this2 = this;

	      var spec = {};
	      spec.name = name;
	      spec.dataspec = desc;
	      delete spec.dataspec.file;
	      delete spec.dataspec.separator;
	      spec.dataspec.data = dataset;
	      spec.storage = LineUpJS.createLocalStorage(dataset, LineUpJS.deriveColors(desc.columns));
	      var config = (lineupObj ? lineupObj.config : _jquery2.default.extend({}, this.lineUpConfig)) || {};
	      if (!config.renderingOptions) {
	        config.renderingOptions = {};
	      }
	      var oldAnimation = config.renderingOptions.animation;
	      config.renderingOptions.animation = false;
	      var columnFixed = 5;
	      var scale = this.createLineupAdjustWidth(elem, name, spec, columnFixed);
	      /* Always recreate the control */
	      (0, _jquery2.default)(elem).empty();
	      /* Lineup takes a d3 element */
	      lineupObj = LineUpJS.create(spec.storage, _d2.default.select(elem), this.lineUpConfig);
	      lineupObj.restore(desc);
	      config = lineupObj.config;
	      lineupObj.header.dragHandler.on('dragend.lineupWidget', function (evt) {
	        _this2.lineupDragColumnEnd(name, evt);
	      });
	      lineupObj['column-scale'] = scale;
	      lineupObj['column-fixed'] = columnFixed;
	      lineupObj['lineup-key'] = name;
	      (0, _jquery2.default)(elem).attr('lineup-key', name);
	      if (sort) {
	        var sortColumn = void 0;
	        _jquery2.default.each(lineupObj.data.getRankings(), function (ridx, ranking) {
	          _jquery2.default.each(ranking.flatColumns, function (cidx, column) {
	            if (column.label === sort) {
	              sortColumn = column.id;
	            }
	          });
	        });
	        lineupObj.sortBy(sortColumn !== undefined ? sortColumn : sort);
	      }
	      lineupObj.changeRenderingOption('animation', oldAnimation);
	      var fixTooltips = function fixTooltips() {
	        for (var i = 0; i < desc.columns.length; i += 1) {
	          if (desc.columns[i].description) {
	            var label = desc.columns[i].label || desc.columns[i].column;
	            (0, _jquery2.default)('title', (0, _jquery2.default)(elem + ' .lu-header text.headerLabel:contains("' + label + '")').parent()).text(label + ': ' + desc.columns[i].description);
	          }
	        }
	      };
	      if (selectCallback) {
	        lineupObj.on('selectionChanged.lineupWidget', null);
	        lineupObj.on('selectionChanged.lineupWidget', function (row) {
	          selectCallback(dataset[row]);
	        });
	      }
	      /* Try twice to work around some issues */
	      window.setTimeout(fixTooltips, 1);
	      window.setTimeout(fixTooltips, 1000);
	      this.lineupInstances[name] = lineupObj;
	      return lineupObj;
	    }

	    /* After a column is resized in lineup, record the size it became relative to
	     * the scaling we are using.
	     *
	     * @param name: name of the lineup record we have adjusted.
	     */

	  }, {
	    key: 'lineupDragColumnEnd',
	    value: function lineupDragColumnEnd(name) {
	      var c1 = void 0,
	          c2 = void 0;
	      if (!this.lineupColumns[name]) {
	        this.lineupColumns[name] = {};
	      }
	      var record = this.lineupColumns[name];
	      var col = this.lineupInstances[name].dump().rankings[0].columns;
	      var scale = this.lineupInstances[name]['column-scale'];
	      var fixed = this.lineupInstances[name]['column-fixed'];
	      for (c1 = 0; c1 < col.length; c1 += 1) {
	        if (col[c1].children) {
	          for (c2 = 0; c2 < col[c1].children.length; c2 += 1) {
	            record[col[c1].children[c2].desc.split('@')[1]] = (col[c1].children[c2].width - fixed) / scale;
	          }
	        } else {
	          record[col[c1].desc.label ? 'rank' : col[c1].desc.split('@')[1]] = (col[c1].width - fixed) / scale;
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var data = _jquery2.default.extend(true, [], this.options.data);
	      if (!data || data.length === 0) {
	        return;
	      }
	      var desc = {
	        primaryKey: '__index',
	        columns: [],
	        layout: {
	          primary: [{ type: 'rank', width: this.lineupRankWidth }]
	        }
	      };
	      var stacked = {
	        type: 'stacked',
	        label: 'Combined',
	        children: []
	      };
	      var attributes = _datalib.type.inferAll(data);
	      /* If fields was specified, use them in order (if they exist as data
	       * attributes).  If fields was not specified, use the data attributes. */
	      var fields = this.options.fields ? this.options.fields : Object.keys(attributes);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        var _loop = function _loop() {
	          var attr = _step.value;

	          if (!(attr in attributes)) {
	            return 'continue';
	          }
	          var type = attributes[attr];
	          if (type === 'integer' || type === 'date') {
	            type = 'number';
	          }
	          var col = {
	            column: attr,
	            type: type
	          };
	          if (type === 'number') {
	            col.domain = _datalib2.default.extent(data, function (d) {
	              return d[attr];
	            });
	          }
	          desc.columns.push(col);

	          var layout = {
	            column: attr,
	            width: 200
	          };
	          if (type === 'number' || type === 'boolean') {
	            stacked.children.push(layout);
	          } else {
	            desc.layout.primary.push(layout);
	          }
	        };

	        for (var _iterator = fields[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _ret = _loop();

	          if (_ret === 'continue') continue;
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

	      if (stacked.children.length) {
	        desc.layout.primary.push(stacked);
	      }
	      data.forEach(function (d, i) {
	        d.__index = i;
	      });
	      var name = 'main';
	      this.createLineup(this.el, 'main', desc, data, this.lineupInstances[name], 'Combined');
	    }
	  }]);

	  return LineUp;
	}(_VisComponent3.default);

	exports.default = LineUp;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_14__;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_15__;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_16__;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// Prepare cssTransformation
	var transform;

	var options = {}
	options.transform = transform
	// add the styles to the DOM
	var update = __webpack_require__(20)(content, options);
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./index.styl", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/stylus-loader/index.js!./index.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(19)(undefined);
	// imports


	// module
	exports.push([module.id, "div.lu {\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  padding: 0;\n  overflow: auto;\n}\ndiv.lu .header.stack .header_i .toolbar .fa.fa-toggle-left {\n  display: none;\n}\n", ""]);

	// exports


/***/ }),
/* 19 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function(useSourceMap) {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if(item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}

		if (useSourceMap && typeof btoa === 'function') {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
			});

			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}

		return [content].join('\n');
	}

	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
		// eslint-disable-next-line no-undef
		var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
		var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

		return '/*# ' + data + ' */';
	}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/

	var stylesInDom = {};

	var	memoize = function (fn) {
		var memo;

		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	};

	var isOldIE = memoize(function () {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	});

	var getElement = (function (fn) {
		var memo = {};

		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}

			return memo[selector]
		};
	})(function (target) {
		return document.querySelector(target)
	});

	var singleton = null;
	var	singletonCounter = 0;
	var	stylesInsertedAtTop = [];

	var	fixUrls = __webpack_require__(21);

	module.exports = function(list, options) {
		if (false) {
			if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};

		options.attrs = typeof options.attrs === "object" ? options.attrs : {};

		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (!options.singleton) options.singleton = isOldIE();

		// By default, add <style> tags to the <head> element
		if (!options.insertInto) options.insertInto = "head";

		// By default, add <style> tags to the bottom of the target
		if (!options.insertAt) options.insertAt = "bottom";

		var styles = listToStyles(list, options);

		addStylesToDom(styles, options);

		return function update (newList) {
			var mayRemove = [];

			for (var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];

				domStyle.refs--;
				mayRemove.push(domStyle);
			}

			if(newList) {
				var newStyles = listToStyles(newList, options);
				addStylesToDom(newStyles, options);
			}

			for (var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];

				if(domStyle.refs === 0) {
					for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

					delete stylesInDom[domStyle.id];
				}
			}
		};
	};

	function addStylesToDom (styles, options) {
		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			if(domStyle) {
				domStyle.refs++;

				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}

				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];

				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}

				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles (list, options) {
		var styles = [];
		var newStyles = {};

		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = options.base ? item[0] + options.base : item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};

			if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
			else newStyles[id].parts.push(part);
		}

		return styles;
	}

	function insertStyleElement (options, style) {
		var target = getElement(options.insertInto)

		if (!target) {
			throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
		}

		var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

		if (options.insertAt === "top") {
			if (!lastStyleElementInsertedAtTop) {
				target.insertBefore(style, target.firstChild);
			} else if (lastStyleElementInsertedAtTop.nextSibling) {
				target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				target.appendChild(style);
			}
			stylesInsertedAtTop.push(style);
		} else if (options.insertAt === "bottom") {
			target.appendChild(style);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement (style) {
		if (style.parentNode === null) return false;
		style.parentNode.removeChild(style);

		var idx = stylesInsertedAtTop.indexOf(style);
		if(idx >= 0) {
			stylesInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement (options) {
		var style = document.createElement("style");

		options.attrs.type = "text/css";

		addAttrs(style, options.attrs);
		insertStyleElement(options, style);

		return style;
	}

	function createLinkElement (options) {
		var link = document.createElement("link");

		options.attrs.type = "text/css";
		options.attrs.rel = "stylesheet";

		addAttrs(link, options.attrs);
		insertStyleElement(options, link);

		return link;
	}

	function addAttrs (el, attrs) {
		Object.keys(attrs).forEach(function (key) {
			el.setAttribute(key, attrs[key]);
		});
	}

	function addStyle (obj, options) {
		var style, update, remove, result;

		// If a transform function was defined, run it on the css
		if (options.transform && obj.css) {
		    result = options.transform(obj.css);

		    if (result) {
		    	// If transform returns a value, use that instead of the original css.
		    	// This allows running runtime transformations on the css.
		    	obj.css = result;
		    } else {
		    	// If the transform function returns a falsy value, don't add this css.
		    	// This allows conditional loading of css
		    	return function() {
		    		// noop
		    	};
		    }
		}

		if (options.singleton) {
			var styleIndex = singletonCounter++;

			style = singleton || (singleton = createStyleElement(options));

			update = applyToSingletonTag.bind(null, style, styleIndex, false);
			remove = applyToSingletonTag.bind(null, style, styleIndex, true);

		} else if (
			obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function"
		) {
			style = createLinkElement(options);
			update = updateLink.bind(null, style, options);
			remove = function () {
				removeStyleElement(style);

				if(style.href) URL.revokeObjectURL(style.href);
			};
		} else {
			style = createStyleElement(options);
			update = applyToTag.bind(null, style);
			remove = function () {
				removeStyleElement(style);
			};
		}

		update(obj);

		return function updateStyle (newObj) {
			if (newObj) {
				if (
					newObj.css === obj.css &&
					newObj.media === obj.media &&
					newObj.sourceMap === obj.sourceMap
				) {
					return;
				}

				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;

			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag (style, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (style.styleSheet) {
			style.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = style.childNodes;

			if (childNodes[index]) style.removeChild(childNodes[index]);

			if (childNodes.length) {
				style.insertBefore(cssNode, childNodes[index]);
			} else {
				style.appendChild(cssNode);
			}
		}
	}

	function applyToTag (style, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			style.setAttribute("media", media)
		}

		if(style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			while(style.firstChild) {
				style.removeChild(style.firstChild);
			}

			style.appendChild(document.createTextNode(css));
		}
	}

	function updateLink (link, options, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		/*
			If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
			and there is no publicPath defined then lets turn convertToAbsoluteUrls
			on by default.  Otherwise default to the convertToAbsoluteUrls option
			directly
		*/
		var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

		if (options.convertToAbsoluteUrls || autoFixUrls) {
			css = fixUrls(css);
		}

		if (sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = link.href;

		link.href = URL.createObjectURL(blob);

		if(oldSrc) URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 21 */
/***/ (function(module, exports) {

	
	/**
	 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
	 * embed the css on the page. This breaks all relative urls because now they are relative to a
	 * bundle instead of the current page.
	 *
	 * One solution is to only use full urls, but that may be impossible.
	 *
	 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
	 *
	 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
	 *
	 */

	module.exports = function (css) {
	  // get current location
	  var location = typeof window !== "undefined" && window.location;

	  if (!location) {
	    throw new Error("fixUrls requires window.location");
	  }

		// blank or null?
		if (!css || typeof css !== "string") {
		  return css;
	  }

	  var baseUrl = location.protocol + "//" + location.host;
	  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

		// convert each url(...)
		/*
		This regular expression is just a way to recursively match brackets within
		a string.

		 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
		   (  = Start a capturing group
		     (?:  = Start a non-capturing group
		         [^)(]  = Match anything that isn't a parentheses
		         |  = OR
		         \(  = Match a start parentheses
		             (?:  = Start another non-capturing groups
		                 [^)(]+  = Match anything that isn't a parentheses
		                 |  = OR
		                 \(  = Match a start parentheses
		                     [^)(]*  = Match anything that isn't a parentheses
		                 \)  = Match a end parentheses
		             )  = End Group
	              *\) = Match anything and then a close parens
	          )  = Close non-capturing group
	          *  = Match anything
	       )  = Close capturing group
		 \)  = Match a close parens

		 /gi  = Get all matches, not the first.  Be case insensitive.
		 */
		var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
			// strip quotes (if they exist)
			var unquotedOrigUrl = origUrl
				.trim()
				.replace(/^"(.*)"$/, function(o, $1){ return $1; })
				.replace(/^'(.*)'$/, function(o, $1){ return $1; });

			// already a full url? no change
			if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			  return fullMatch;
			}

			// convert the url to a full url
			var newUrl;

			if (unquotedOrigUrl.indexOf("//") === 0) {
			  	//TODO: should we add protocol?
				newUrl = unquotedOrigUrl;
			} else if (unquotedOrigUrl.indexOf("/") === 0) {
				// path should be relative to the base url
				newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
			} else {
				// path should be relative to current directory
				newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
			}

			// send back the fixed url(...)
			return "url(" + JSON.stringify(newUrl) + ")";
		});

		// send back the fixed css
		return fixedCss;
	};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_22__;

/***/ })
/******/ ])
});
;