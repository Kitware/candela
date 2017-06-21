(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("jquery"), require("underscore"), require("nvd3"), require("md5"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "d3", "jquery", "underscore", "nvd3", "md5"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("d3"), require("jquery"), require("underscore"), require("nvd3"), require("md5"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["d3"], root["jquery"], root["underscore"], root["nvd3"], root["md5"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_8__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_41__, __WEBPACK_EXTERNAL_MODULE_43__, __WEBPACK_EXTERNAL_MODULE_50__) {
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

	var _TrackerDash = __webpack_require__(40);

	var _TrackerDash2 = _interopRequireDefault(_TrackerDash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_TrackerDash2.default, 'TrackerDash');

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
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_13__;

/***/ }),
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
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

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _InfoPane = __webpack_require__(42);

	var _InfoPane2 = _interopRequireDefault(_InfoPane);

	var _TrendPane = __webpack_require__(53);

	var _TrendPane2 = _interopRequireDefault(_TrendPane);

	var _ResultTablePane = __webpack_require__(55);

	var _ResultTablePane2 = _interopRequireDefault(_ResultTablePane);

	var _TopInfoBar = __webpack_require__(59);

	var _TopInfoBar2 = _interopRequireDefault(_TopInfoBar);

	var _utility = __webpack_require__(49);

	var _layout = __webpack_require__(61);

	var _layout2 = _interopRequireDefault(_layout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	//  Calculate an percentile value from an array of numbers sorted in numerically
	//  increasing order, p should be a ratio percentile, e.g. 50th percentile is p
	//  = 0.5.
	var calcPercentile = function calcPercentile(arr, p) {
	  if (arr.length === 0) return 0;
	  if (typeof p !== 'number') throw new TypeError('p must be a number');
	  if (p <= 0) return arr[0];
	  if (p >= 1) return arr[arr.length - 1];

	  var index = Math.round(p * arr.length) - 1;
	  // Ind may be below 0, in this case the closest value is the 0th index.
	  index = index < 0 ? 0 : index;
	  return arr[index];
	};

	// Synthesize aggregate metrics from the supplied trend values, which will
	// result in a percentile value per trend if an aggregate metric isn't already
	// supplied for the trend.
	var synthesizeMissingAggTrends = function synthesizeMissingAggTrends(aggTrends, trendMap, trendValuesByDataset, percentile) {
	  var byTrend = _underscore2.default.groupBy(trendValuesByDataset, 'trend');
	  var trends = _underscore2.default.keys(byTrend);
	  if (!aggTrends) {
	    aggTrends = [];
	  }
	  var aggTrendsByTrendName = _underscore2.default.indexBy(aggTrends, 'trend_name');
	  for (var i = 0; i < trends.length; i++) {
	    if (!_underscore2.default.has(aggTrendsByTrendName, trends[i])) {
	      var aggTrend = _underscore2.default.clone(trendMap[trends[i]]);
	      var trendVals = _underscore2.default.chain(byTrend[aggTrend.name]).pluck('current').map(function (value) {
	        return (0, _utility.deArray)(value, _d2.default.median);
	      }
	      // '+' converts values to numeric for a numeric sort.
	      ).sortBy(function (num) {
	        return +num;
	      }).value();
	      aggTrend.history = [calcPercentile(trendVals, percentile / 100)];
	      aggTrend.title = 'Default of ' + percentile + ' percentile key metric value (' + aggTrend.name + '), No saved aggregate metrics for trend';
	      aggTrend.synth = true;
	      aggTrends.push(aggTrend);
	    }
	  }
	  return aggTrends;
	};

	// Creates a valid display_name and id_selector per trend, create a mouseover
	// title property, and determines if the threshold is correctly defined.
	var sanitizeTrend = function sanitizeTrend(trend) {
	  if (!trend.abbreviation) {
	    trend.display_name = trend.name;
	    if (!trend.title) {
	      trend.title = 'No abbreviation defined';
	    }
	  } else {
	    trend.display_name = trend.abbreviation;
	    if (!trend.title) {
	      trend.title = trend.name;
	    }
	  }
	  if (!_underscore2.default.has(trend, 'warning') || !_underscore2.default.has(trend, 'fail')) {
	    trend.incompleteThreshold = true;
	    trend.title += ' & Incomplete threshold definition';
	  }
	  trend.id_selector = (0, _utility.sanitizeSelector)(trend.display_name);
	  return trend;
	};

	/**
	 * Ensures that an aggregate metric has a max value set, as a fallback
	 * it will be set to the last value in the history.
	 */
	var sanitizeAggregateThreshold = function sanitizeAggregateThreshold(aggTrend) {
	  if (_underscore2.default.isNaN(parseFloat(aggTrend.max))) {
	    aggTrend.max = aggTrend.history[aggTrend.history.length - 1];
	    if (!aggTrend.incompleteThreshold) {
	      aggTrend.incompleteThreshold = true;
	      aggTrend.title += ' & Incomplete threshold definition';
	    }
	  }
	  return aggTrend;
	};

	var TrackerDash = function (_VisComponent) {
	  _inherits(TrackerDash, _VisComponent);

	  function TrackerDash(el, settings) {
	    _classCallCheck(this, TrackerDash);

	    var _this = _possibleConstructorReturn(this, (TrackerDash.__proto__ || Object.getPrototypeOf(TrackerDash)).call(this, el));

	    _this.$el = (0, _jquery2.default)(_this.el);

	    // Perform all the data munging at the outset so that it is consistent as it
	    // gets passed down throughout the application.

	    if (!settings.trends) {
	      settings.trends = [];
	    }
	    // trendMap maps full trend name to a sanitized trend object.
	    settings.trendMap = {};
	    _underscore2.default.each(settings.trends, function (trend) {
	      settings.trendMap[trend.name] = sanitizeTrend(trend);
	    });
	    // Create trends for any scalars that don't supply them, setting
	    // the max as the max input value for that trend.
	    _underscore2.default.each(settings.trendValuesByDataset, function (trendValue) {
	      if (!_underscore2.default.has(settings.trendMap, trendValue.trend)) {
	        var current = (0, _utility.deArray)(trendValue.current, _d2.default.median);
	        var syntheticTrend = sanitizeTrend({
	          name: trendValue.trend,
	          synth: true,
	          max: current
	        });
	        settings.trendMap[syntheticTrend.name] = syntheticTrend;
	        settings.trends.push(syntheticTrend);
	      } else {
	        var _current = (0, _utility.deArray)(trendValue.current, _d2.default.median);
	        var trend = settings.trendMap[trendValue.trend];
	        if (trend.synth && trend.max < _current) {
	          trend.max = _current;
	        }
	      }
	    });

	    // Sort trends now that they have display_name property.
	    settings.trends = _underscore2.default.sortBy(settings.trends, 'display_name');
	    // Order the individual trend dataset values by trend display_name.
	    settings.trendValuesByDataset = _underscore2.default.sortBy(settings.trendValuesByDataset, function (val) {
	      return settings.trendMap[val.trend].display_name;
	    });

	    // Generate aggregate trends if needed.
	    var percentile = 50.0;
	    var aggTrends = synthesizeMissingAggTrends(settings.agg_trends, settings.trendMap, settings.trendValuesByDataset, percentile);
	    settings.aggTrends = _underscore2.default.chain(aggTrends).map(sanitizeTrend).map(sanitizeAggregateThreshold).sortBy('display_name').value();

	    _this.trackData = settings;
	    delete _this.trackData.el;

	    _this.$el.html((0, _layout2.default)());
	    _this.topInfoBar = new _TopInfoBar2.default(_this.$el.find('.top-info-bar').get(0), _this.trackData);
	    _this.infoPane = new _InfoPane2.default(_this.$el.find('.info-pane').get(0), _this.$el.find('.status-bar-widget').get(0), _this.trackData);
	    _this.trendPane = new _TrendPane2.default(_this.$el.find('.trend-pane').get(0), _this.trackData);
	    _this.resultPane = new _ResultTablePane2.default(_this.$el.find('.result-table-pane').get(0), _this.trackData);

	    _this.render();
	    return _this;
	  }

	  _createClass(TrackerDash, [{
	    key: 'render',
	    value: function render() {
	      this.topInfoBar.render();
	      this.infoPane.render();
	      this.trendPane.render();
	      this.resultPane.render();
	    }
	  }]);

	  return TrackerDash;
	}(_VisComponent3.default);

	exports.default = TrackerDash;

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_41__;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _nvd = __webpack_require__(43);

	var _nvd2 = _interopRequireDefault(_nvd);

	var _StatusBarWidget = __webpack_require__(44);

	var _StatusBarWidget2 = _interopRequireDefault(_StatusBarWidget);

	var _ErrorBulletWidget = __webpack_require__(48);

	var _ErrorBulletWidget2 = _interopRequireDefault(_ErrorBulletWidget);

	var _utility = __webpack_require__(49);

	var _infoPane = __webpack_require__(52);

	var _infoPane2 = _interopRequireDefault(_infoPane);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var InfoPane = function (_VisComponent) {
	  _inherits(InfoPane, _VisComponent);

	  function InfoPane(el, statusBarEl, settings) {
	    _classCallCheck(this, InfoPane);

	    var _this = _possibleConstructorReturn(this, (InfoPane.__proto__ || Object.getPrototypeOf(InfoPane)).call(this, el));

	    _this.$el = (0, _jquery2.default)(_this.el);

	    _this.statusBarEl = statusBarEl;

	    _this.name = settings.name || 'Ground Truth';
	    _this.branch = settings.branch || 'master';
	    _this.day = settings.day || _this.getToday();
	    _this.warning = settings.warning || 3;
	    _this.fail = settings.fail || 4;
	    _this.max = settings.max || 5;
	    _this.producerLink = settings.producer_link || null;

	    _this.numIncomplete = 0;
	    _this.numSuccess = 0;
	    _this.numBad = 0;
	    _this.numFail = 0;
	    _this.allValues = [];
	    _this.aggTrends = settings.aggTrends;
	    _underscore2.default.each(settings.trendValuesByDataset, _underscore2.default.bind(function (dataset) {
	      var current = (0, _utility.deArray)(dataset.current, _d2.default.median);
	      this.allValues.push(current);

	      if (settings.trendMap[dataset.trend].incompleteThreshold) {
	        this.numIncomplete++;
	      } else {
	        var failTrend = settings.trendMap[dataset.trend].fail;
	        var warningTrend = settings.trendMap[dataset.trend].warning;
	        if ((0, _utility.failValue)(current, warningTrend, failTrend)) {
	          this.numFail++;
	        } else if ((0, _utility.warningValue)(current, warningTrend, failTrend)) {
	          this.numBad++;
	        } else {
	          this.numSuccess++;
	        }
	      }
	    }, _this));
	    return _this;
	  }

	  _createClass(InfoPane, [{
	    key: 'getToday',
	    value: function getToday() {
	      var today = new Date();
	      var dd = today.getDate();
	      var mm = today.getMonth() + 1; // January is 0!
	      var yyyy = today.getFullYear();

	      if (dd < 10) {
	        dd = '0' + dd;
	      }

	      if (mm < 10) {
	        mm = '0' + mm;
	      }

	      return yyyy + '/' + mm + '/' + dd;
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      // Test if any of the aggregate trends have spark line historical data.
	      var sparklinesExist = _underscore2.default.find(this.aggTrends, function (trend) {
	        return trend.history && trend.history.length > 1;
	      }, this) !== undefined;
	      this.$el.html((0, _infoPane2.default)({
	        name: this.name,
	        branch: this.branch,
	        day: this.day,
	        aggTrends: this.aggTrends,
	        sparklinesExist: sparklinesExist,
	        producerLink: this.producerLink
	      })).promise().done(_underscore2.default.bind(function () {
	        var _this2 = this;

	        this.aggBullets = {};
	        _underscore2.default.each(this.aggTrends, function (trend, key, list) {
	          if (trend.history && trend.history.length > 1) {
	            _nvd2.default.addGraph({
	              generate: _underscore2.default.bind(function () {
	                var parent = (0, _jquery2.default)('#' + trend.id_selector + '-aggregate-sparkline');
	                var width = parent.width();
	                var height = parent.height();
	                var chart = _nvd2.default.models.sparklinePlus().margin({ right: 40 }).height(height).width(width).x(function (d, i) {
	                  return i;
	                }).showLastValue(false);
	                _d2.default.select('#' + trend.id_selector + '-aggregate-sparkline svg').datum(_underscore2.default.map(trend.history, function (curValue, index) {
	                  return { x: index, y: curValue };
	                })).call(chart);
	                return chart;
	              }, _this2),
	              callback: function callback(graph) {
	                _nvd2.default.utils.windowResize(function () {
	                  var parent = (0, _jquery2.default)('#' + trend.id_selector + '-aggregate-sparkline');
	                  var width = parent.width();
	                  var height = parent.height();
	                  graph.width(width).height(height);

	                  _d2.default.select('#' + trend.id_selector + '-aggregate-sparkline svg').attr('width', width).attr('height', height).transition().duration(0).call(graph);
	                });
	              }
	            });
	          }
	          var current = trend.history[trend.history.length - 1];
	          current = (0, _utility.deArray)(current, _d2.default.median);
	          var el = (0, _jquery2.default)('#' + trend.id_selector + '-aggregate-bullet-svg').get(0);
	          _this2.aggBullets[trend.id_selector] = new _ErrorBulletWidget2.default(el, {
	            result: {
	              current: Math.round(current * 10000) / 10000
	            },
	            trend: trend
	          }).render();
	          var dotSelector = '#' + trend.id_selector + '-aggregate-dot';
	          if (!trend.incompleteThreshold) {
	            if ((0, _utility.failValue)(current, trend.warning, trend.fail)) {
	              (0, _jquery2.default)(dotSelector).attr('class', 'fail');
	            } else if ((0, _utility.warningValue)(current, trend.warning, trend.fail)) {
	              (0, _jquery2.default)(dotSelector).attr('class', 'bad');
	            }
	          }
	        }, this);
	      }, this));

	      var statusBar = new _StatusBarWidget2.default(this.statusBarEl, {
	        numSuccess: this.numSuccess,
	        numBad: this.numBad,
	        numFail: this.numFail,
	        numIncomplete: this.numIncomplete
	      });
	      statusBar.render();
	    }
	  }]);

	  return InfoPane;
	}(_VisComponent3.default);

	exports.default = InfoPane;

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_43__;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _statusBarWidget = __webpack_require__(45);

	var _statusBarWidget2 = _interopRequireDefault(_statusBarWidget);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var StatusBarWidget = function (_VisComponent) {
	  _inherits(StatusBarWidget, _VisComponent);

	  function StatusBarWidget(el, settings) {
	    _classCallCheck(this, StatusBarWidget);

	    var _this = _possibleConstructorReturn(this, (StatusBarWidget.__proto__ || Object.getPrototypeOf(StatusBarWidget)).call(this, el));

	    _this.$el = (0, _jquery2.default)(_this.el);

	    _this.numSuccess = settings.numSuccess || 0;
	    _this.numBad = settings.numBad || 0;
	    _this.numFail = settings.numFail || 0;
	    _this.numIncomplete = settings.numIncomplete || 0;
	    (0, _jquery2.default)(window).on('resize', _underscore2.default.bind(_this.createChart, _this));
	    return _this;
	  }

	  _createClass(StatusBarWidget, [{
	    key: 'createChart',
	    value: function createChart() {
	      var total = this.numSuccess + this.numBad + this.numFail + this.numIncomplete;
	      if (total <= 0) {
	        return;
	      }

	      var svg = _d2.default.select('.status-bar-chart svg');
	      svg.html('');
	      var curWidth = svg.style('width').slice(0, -2);
	      var unitWidth = curWidth / total;
	      var badStart = unitWidth * this.numSuccess;
	      var failStart = badStart + unitWidth * this.numBad;
	      var incompleteStart = failStart + unitWidth * this.numFail;

	      var successGroup = svg.append('g');
	      successGroup.append('rect').attr('x', 0).attr('width', unitWidth * this.numSuccess).attr('height', '100%').attr('class', 'success');

	      var badGroup = svg.append('g');
	      badGroup.append('rect').attr('x', badStart).attr('width', unitWidth * this.numBad).attr('height', '100%').attr('class', 'bad');

	      var failGroup = svg.append('g');
	      failGroup.append('rect').attr('x', failStart).attr('width', unitWidth * this.numFail).attr('height', '100%').attr('class', 'fail');

	      var incompleteGroup = svg.append('g');
	      incompleteGroup.append('rect').attr('x', incompleteStart).attr('width', unitWidth * this.numIncomplete).attr('height', '100%').attr('class', 'incomplete');
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.$el.html((0, _statusBarWidget2.default)());
	      this.createChart();
	    }
	  }]);

	  return StatusBarWidget;
	}(_VisComponent3.default);

	exports.default = StatusBarWidget;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(46);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"status-bar-chart\"><svg></svg></div>");;return buf.join("");
	}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(47).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ }),
/* 47 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _nvd = __webpack_require__(43);

	var _nvd2 = _interopRequireDefault(_nvd);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _utility = __webpack_require__(49);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ErrorBulletWidget = function (_VisComponent) {
	  _inherits(ErrorBulletWidget, _VisComponent);

	  function ErrorBulletWidget(el, settings) {
	    _classCallCheck(this, ErrorBulletWidget);

	    var _this = _possibleConstructorReturn(this, (ErrorBulletWidget.__proto__ || Object.getPrototypeOf(ErrorBulletWidget)).call(this, el));

	    _this.result = settings.result;
	    _this.trend = settings.trend;
	    if (_this.result === undefined) {
	      console.error('No result passed to error bullet.');
	    }
	    if (_this.trend === undefined) {
	      console.error('No trend passed to error bullet.');
	    }
	    return _this;
	  }

	  _createClass(ErrorBulletWidget, [{
	    key: 'chartData',
	    value: function chartData() {
	      return {
	        ranges: this.trend.incompleteThreshold ? [0, 0, this.trend.max] : [this.trend.warning, this.trend.fail, this.trend.max],
	        measures: [Math.round(Math.min(this.result.current, this.trend.max) * 10000) / 10000],
	        markerLines: []
	      };
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      _nvd2.default.addGraph({
	        generate: _underscore2.default.bind(function () {
	          var chart = _nvd2.default.models.bulletChart().margin({ top: 5, right: 20, bottom: 20, left: 10 });
	          chart.color((0, _utility.computeColor)(this.trend, this.result.current));
	          // d3.select('[id=\'' + this.el.id + '-svg\']')
	          _d2.default.select(this.el).datum(this.chartData()).call(chart);
	          chart.bullet.dispatch.on('elementMouseover.tooltip', null);
	          chart.bullet.dispatch.on('elementMouseover.tooltip', _underscore2.default.bind(function (evt) {
	            evt['series'] = {
	              key: 'Current value',
	              value: Math.round(this.result.current * 10000) / 10000,
	              color: chart.color()
	            };
	            chart.tooltip.data(evt).hidden(false);
	          }, this));
	          return chart;
	        }, this),
	        callback: _underscore2.default.bind(function (graph) {
	          _nvd2.default.utils.windowResize(_underscore2.default.bind(function () {
	            var parent = (0, _jquery2.default)(this.el.parentNode);
	            var width = parent.width();
	            var height = parent.height();
	            graph.width(width).height(height);

	            _d2.default.select(this.el).attr('width', width).attr('height', height).transition().duration(0).call(graph);
	          }, this));
	        }, this)
	      });
	    }
	  }]);

	  return ErrorBulletWidget;
	}(_VisComponent3.default);

	exports.default = ErrorBulletWidget;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.deArray = exports.computeColor = exports.standardRound = exports.sanitizeSelector = exports.warningValue = exports.failValue = undefined;

	var _md = __webpack_require__(50);

	var _md2 = _interopRequireDefault(_md);

	var _colors = __webpack_require__(51);

	var _colors2 = _interopRequireDefault(_colors);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var failValue = exports.failValue = function failValue(value, warning, fail, lower_is_better) {
	  if (lower_is_better === undefined || lower_is_better === null) {
	    lower_is_better = warning < fail;
	  }
	  if (lower_is_better) {
	    return value >= fail;
	  } else {
	    return value <= fail;
	  }
	};

	var warningValue = exports.warningValue = function warningValue(value, warning, fail, lower_is_better) {
	  if (lower_is_better === undefined || lower_is_better === null) {
	    lower_is_better = warning < fail;
	  }
	  if (lower_is_better) {
	    return value >= warning;
	  } else {
	    return value <= warning;
	  }
	};

	var sanitizeSelector = exports.sanitizeSelector = function sanitizeSelector(input) {
	  // Prefix with an '_' as selectors can't start with numbers.
	  return '_' + (0, _md2.default)(input);
	};

	var standardRound = exports.standardRound = function standardRound(input) {
	  return Math.round(input * 10000) / 10000;
	};

	var computeColor = exports.computeColor = function computeColor(trend, value) {
	  if (trend.incompleteThreshold) {
	    return _colors2.default.incomplete;
	  } else {
	    if (failValue(value, trend.warning, trend.fail, trend.lower_is_better)) {
	      return _colors2.default.fail;
	    } else if (warningValue(value, trend.warning, trend.fail, trend.lower_is_better)) {
	      return _colors2.default.bad;
	    } else {
	      return _colors2.default.good;
	    }
	  }
	};

	var deArray = exports.deArray = function deArray(values, reducer) {
	  if (Array.isArray(values)) {
	    return reducer(values);
	  } else {
	    return values;
	  }
	};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_50__;

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var colors = {
	  fail: 'rgb(204, 0, 0)',
	  bad: 'rgb(241, 194, 50)',
	  good: 'rgb(147, 196, 125)',
	  incomplete: 'rgb(28, 106, 133)'
	};

	exports.default = colors;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(46);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (Math, aggTrends, producerLink, sparklinesExist, undefined) {
	buf.push("<table class=\"table table-responsive table-compact\"><thead class=\"result-labels\"><th colspan=\"2\"><div class=\"agg-label-header\">");
	if ( producerLink)
	{
	buf.push("<a" + (jade.attr("href", producerLink, true, true)) + " title=\"Aggregate metrics over key metric values\">Aggregate Metric</a>");
	}
	else
	{
	buf.push("<abbr title=\"Aggregate metrics over key metric values\">Aggregate Metric</abbr>");
	}
	buf.push("</div></th>");
	if ( sparklinesExist)
	{
	buf.push("<th><div class=\"agg-sparkline-header\"><abbr title=\"Saved aggregate metric values from recent submissions on the same branch\">Last 7 Days</abbr></div></th>");
	}
	buf.push("<th colspan=\"2\"><div class=\"agg-bullet-header\">Computed Value</div></th></thead><tbody></tbody>");
	// iterate aggTrends
	;(function(){
	  var $$obj = aggTrends;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var aggTrend = $$obj[$index];

	var idSelector = aggTrend.id_selector
	buf.push("<tr" + (jade.attr("id", "" + (idSelector) + "-aggregate-container", true, true)) + " class=\"info-section-chart\"><td class=\"agg-status-dot\"><svg class=\"statusDot\"><circle" + (jade.attr("id", "" + (idSelector) + "-aggregate-dot", true, true)) + " r=\"10\" cx=\"10\" cy=\"10\" class=\"none\"></circle></svg></td><td><div class=\"agg-label\">");
	if ( aggTrend.synth)
	{
	buf.push("<abbr" + (jade.attr("title", "" + (aggTrend.title) + "", true, true)) + ">*" + (jade.escape((jade_interp = aggTrend.display_name) == null ? '' : jade_interp)) + "</abbr>");
	}
	else
	{
	buf.push("<abbr" + (jade.attr("title", "" + (aggTrend.title) + "", true, true)) + ">" + (jade.escape((jade_interp = aggTrend.display_name) == null ? '' : jade_interp)) + "</abbr>");
	}
	buf.push("</div></td>");
	if ( sparklinesExist)
	{
	buf.push("<td><div" + (jade.attr("id", "" + (idSelector) + "-aggregate-sparkline", true, true)) + " class=\"agg-sparkline\"><svg></svg></div></td>");
	}
	buf.push("<td><div class=\"agg-value\">" + (jade.escape((jade_interp = Math.round(aggTrend.history[aggTrend.history.length-1] * 10000) / 10000) == null ? '' : jade_interp)) + "</div></td><td><div" + (jade.attr("id", "" + (idSelector) + "-aggregate-bullet", true, true)) + " class=\"agg-bullet\"><svg" + (jade.attr("id", "" + (idSelector) + "-aggregate-bullet-svg", true, true)) + "></svg></div></td></tr>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var aggTrend = $$obj[$index];

	var idSelector = aggTrend.id_selector
	buf.push("<tr" + (jade.attr("id", "" + (idSelector) + "-aggregate-container", true, true)) + " class=\"info-section-chart\"><td class=\"agg-status-dot\"><svg class=\"statusDot\"><circle" + (jade.attr("id", "" + (idSelector) + "-aggregate-dot", true, true)) + " r=\"10\" cx=\"10\" cy=\"10\" class=\"none\"></circle></svg></td><td><div class=\"agg-label\">");
	if ( aggTrend.synth)
	{
	buf.push("<abbr" + (jade.attr("title", "" + (aggTrend.title) + "", true, true)) + ">*" + (jade.escape((jade_interp = aggTrend.display_name) == null ? '' : jade_interp)) + "</abbr>");
	}
	else
	{
	buf.push("<abbr" + (jade.attr("title", "" + (aggTrend.title) + "", true, true)) + ">" + (jade.escape((jade_interp = aggTrend.display_name) == null ? '' : jade_interp)) + "</abbr>");
	}
	buf.push("</div></td>");
	if ( sparklinesExist)
	{
	buf.push("<td><div" + (jade.attr("id", "" + (idSelector) + "-aggregate-sparkline", true, true)) + " class=\"agg-sparkline\"><svg></svg></div></td>");
	}
	buf.push("<td><div class=\"agg-value\">" + (jade.escape((jade_interp = Math.round(aggTrend.history[aggTrend.history.length-1] * 10000) / 10000) == null ? '' : jade_interp)) + "</div></td><td><div" + (jade.attr("id", "" + (idSelector) + "-aggregate-bullet", true, true)) + " class=\"agg-bullet\"><svg" + (jade.attr("id", "" + (idSelector) + "-aggregate-bullet-svg", true, true)) + "></svg></div></td></tr>");
	    }

	  }
	}).call(this);

	buf.push("</table>");}.call(this,"Math" in locals_for_with?locals_for_with.Math:typeof Math!=="undefined"?Math:undefined,"aggTrends" in locals_for_with?locals_for_with.aggTrends:typeof aggTrends!=="undefined"?aggTrends:undefined,"producerLink" in locals_for_with?locals_for_with.producerLink:typeof producerLink!=="undefined"?producerLink:undefined,"sparklinesExist" in locals_for_with?locals_for_with.sparklinesExist:typeof sparklinesExist!=="undefined"?sparklinesExist:undefined,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _nvd = __webpack_require__(43);

	var _nvd2 = _interopRequireDefault(_nvd);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _utility = __webpack_require__(49);

	var _trendPane = __webpack_require__(54);

	var _trendPane2 = _interopRequireDefault(_trendPane);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TrendPane = function (_VisComponent) {
	  _inherits(TrendPane, _VisComponent);

	  function TrendPane(el, settings) {
	    _classCallCheck(this, TrendPane);

	    var _this = _possibleConstructorReturn(this, (TrendPane.__proto__ || Object.getPrototypeOf(TrendPane)).call(this, el));

	    _this.$el = (0, _jquery2.default)(_this.el);

	    _this.bins = settings.bins || 10;
	    _this.trendMap = settings.trendMap;
	    _this.hists = _this._calculateHistograms(settings.trendValuesByDataset, settings.histogram_max_x);
	    return _this;
	  }

	  _createClass(TrendPane, [{
	    key: '_calculateHistograms',
	    value: function _calculateHistograms(trends, maxX) {
	      var _this2 = this;

	      var bins = this.bins;
	      var byTrend = _underscore2.default.groupBy(trends, 'trend');

	      var min = _underscore2.default.reduce(trends, function (memo, num) {
	        var current = (0, _utility.deArray)(num.current, _d2.default.min);
	        return Math.min(memo, current);
	      }, 0); // we want 0 to be the min

	      var maxXSet = !_underscore2.default.isNaN(parseFloat(maxX));
	      var max = void 0;
	      var binWidth = void 0;
	      if (maxXSet) {
	        // We have a maximum set, put everything beyond this max
	        // in the same 'Beyond' bin.
	        max = parseFloat(maxX);
	        binWidth = (max - min) / (bins - 1);
	      } else {
	        max = _underscore2.default.reduce(trends, function (memo, num) {
	          return Math.max(memo, (0, _utility.deArray)(num.current, _d2.default.max));
	        }, 0);
	        binWidth = (max - min) / bins;
	      }

	      var hists = _underscore2.default.map(byTrend, function (element, key) {
	        var el = { trend: _this2.trendMap[key].display_name };
	        el['values'] = _underscore2.default.countBy(_underscore2.default.map(element, function (value) {
	          var current = (0, _utility.deArray)(value.current, _d2.default.median);
	          var res = Math.floor(current / binWidth);
	          if (maxXSet) {
	            if (res > bins - 1) {
	              res = bins - 1;
	            }
	          } else {
	            if (res > bins) {
	              res = bins;
	            }
	          }
	          return res;
	        }), function (num) {
	          return num;
	        });
	        return el;
	      }, this);

	      hists = _underscore2.default.indexBy(hists, 'trend');
	      this.xLabels = [];
	      this.xLabels.push(binWidth / 2);
	      for (var i = 1; i < bins; ++i) {
	        this.xLabels.push(this.xLabels[i - 1] + binWidth);
	      }
	      this.xLabels = _underscore2.default.map(this.xLabels, function (value) {
	        return value.toFixed(1);
	      });
	      if (maxXSet) {
	        this.xLabels[this.xLabels.length - 1] = 'Beyond';
	      }
	      return hists;
	    }
	  }, {
	    key: 'getChartData',
	    value: function getChartData() {
	      // Prepare the data for plotting
	      var plotData = [];
	      var trends = _underscore2.default.keys(this.hists);
	      for (var i = 0; i < trends.length; ++i) {
	        var trend = trends[i];
	        var curData = { key: trend.toUpperCase() };
	        curData.values = [];
	        for (var j = 0; j < this.bins; ++j) {
	          curData.values.push({ x: this.xLabels[j], y: this.hists[trend].values[j] || 0 });
	        }
	        plotData.push(curData);
	      }
	      return plotData;
	    }
	  }, {
	    key: 'createChart',
	    value: function createChart() {
	      _nvd2.default.addGraph({
	        generate: _underscore2.default.bind(function () {
	          var parent = (0, _jquery2.default)('.trend-pane');
	          var width = parent.width();
	          var height = parent.height();
	          var chart = _nvd2.default.models.multiBarChart().reduceXTicks(false).width(width).height(height).stacked(false);
	          chart.xAxis.axisLabel('Key metric values (bin center)');
	          chart.xAxis.tickValues(this.xLabels);
	          chart.yAxis.axisLabel('Number of Runs');
	          chart.yAxis.tickFormat(_d2.default.format('d'));
	          chart.tooltip.enabled(false);

	          var svg = _d2.default.select('.trend-chart svg').datum(this.getChartData());
	          svg.transition().duration(0).call(chart);
	          return chart;
	        }, this),
	        callback: function callback(graph) {
	          _nvd2.default.utils.windowResize(function () {
	            var parent = (0, _jquery2.default)('.trend-pane');
	            var width = parent.width();
	            var height = parent.height();
	            graph.width(width).height(height);

	            _d2.default.select('.trend-chart svg').attr('width', width).attr('height', height).transition().duration(0).call(graph);
	          });
	        }
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      this.$el.html((0, _trendPane2.default)());
	      this.createChart();
	    }
	  }]);

	  return TrendPane;
	}(_VisComponent3.default);

	exports.default = TrendPane;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(46);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"trend-chart\"><svg></svg></div>");;return buf.join("");
	}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _ValueWidget = __webpack_require__(56);

	var _ValueWidget2 = _interopRequireDefault(_ValueWidget);

	var _utility = __webpack_require__(49);

	var _tablePane = __webpack_require__(58);

	var _tablePane2 = _interopRequireDefault(_tablePane);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ResultTablePane = function (_VisComponent) {
	  _inherits(ResultTablePane, _VisComponent);

	  function ResultTablePane(el, settings) {
	    _classCallCheck(this, ResultTablePane);

	    var _this = _possibleConstructorReturn(this, (ResultTablePane.__proto__ || Object.getPrototypeOf(ResultTablePane)).call(this, el));

	    _this.$el = (0, _jquery2.default)(_this.el);

	    _this.results = settings.trendValuesByDataset;
	    _this.trends = settings.trends;
	    _this.trendMap = settings.trendMap;
	    _this.datasetMap = settings.datasetMap || {};
	    _this.trajectoryMap = settings.trajectoryMap || {};
	    _this.datasetLabelMap = settings.datasetLabelMap || {};
	    _this.producerLink = settings.producer_link || null;
	    if (_this.results === undefined) {
	      return _possibleConstructorReturn(_this);
	    }
	    // Default sort order is alphabetical by dataset name.
	    _this.sortOrder = {
	      dataset: true,
	      order: 1
	    };
	    return _this;
	  }

	  _createClass(ResultTablePane, [{
	    key: 'render',
	    value: function render() {
	      if (this.results === undefined) {
	        return;
	      }
	      var resultsByDatasetIdThenTrend = {};
	      _underscore2.default.each(this.results, _underscore2.default.bind(function (result) {
	        result.dataset_id_selector = (0, _utility.sanitizeSelector)(result.dataset);
	        this.datasetMap[result.dataset_id_selector] = this.datasetMap[result.dataset];
	        this.trajectoryMap[result.dataset_id_selector] = this.trajectoryMap[result.dataset];
	        this.datasetLabelMap[result.dataset_id_selector] = this.datasetLabelMap[result.dataset];
	        if (!_underscore2.default.has(resultsByDatasetIdThenTrend, result.dataset_id_selector)) {
	          resultsByDatasetIdThenTrend[result.dataset_id_selector] = {};
	        }
	        if (Array.isArray(result.current)) {
	          resultsByDatasetIdThenTrend[result.dataset_id_selector][result.trend] = _d2.default.median(result.current);
	        } else {
	          resultsByDatasetIdThenTrend[result.dataset_id_selector][result.trend] = result.current;
	        }
	      }, this));

	      this.results.sort(_underscore2.default.bind(function () {
	        if (!this.sortOrder.dataset) {
	          return _underscore2.default.bind(function (a, b) {
	            // Sort all datasets by the selected trend column and direction
	            var trendA = resultsByDatasetIdThenTrend[a.dataset_id_selector][this.sortOrder.trend];
	            var trendB = resultsByDatasetIdThenTrend[b.dataset_id_selector][this.sortOrder.trend];
	            if (trendB === undefined) {
	              return -1;
	            }
	            if (trendA === undefined) {
	              return 1;
	            }
	            return this.sortOrder.order * (trendA - trendB);
	          }, this);
	        } else {
	          return _underscore2.default.bind(function (a, b) {
	            if (this.sortOrder.order > 0) {
	              return a.dataset.localeCompare(b.dataset);
	            } else {
	              return b.dataset.localeCompare(a.dataset);
	            }
	          }, this);
	        }
	      }, this)());

	      // The order of the datasets determines the order the rows are printed.
	      var resultsByDatasetId = _underscore2.default.groupBy(this.results, function (result) {
	        return result.dataset_id_selector;
	      });

	      this.$el.html((0, _tablePane2.default)({
	        resultsByDatasetId: resultsByDatasetId,
	        trends: this.trends,
	        datasetMap: this.datasetMap,
	        trajectoryMap: this.trajectoryMap,
	        datasetLabelMap: this.datasetLabelMap,
	        producerLink: this.producerLink,
	        sortOrder: this.sortOrder
	      })).promise().done(_underscore2.default.bind(function () {
	        _underscore2.default.each(this.results, function (result) {
	          var trend = this.trendMap[result.trend];
	          var resultDivSelector = '#' + result.dataset_id_selector + '-' + trend.id_selector;
	          // Render value widgets.
	          var el = (0, _jquery2.default)(resultDivSelector + '-valueWidget-svg').get(0);
	          var valueWidget = new _ValueWidget2.default(el, {
	            result: result,
	            trend: trend
	          });
	          valueWidget.render();

	          // Activate callback for valueWidget if specified.
	          if (typeof result.callback === 'function') {
	            (0, _jquery2.default)(resultDivSelector).css('cursor', 'pointer').click(result.callback);
	          } else if (result.link) {
	            (0, _jquery2.default)(resultDivSelector).css('cursor', 'pointer').click(function () {
	              if (result.link) {
	                window.location = result.link;
	              }
	            });
	          }
	        }, this);

	        _underscore2.default.each(this.datasetMap, function (value, key) {
	          if (typeof value === 'function') {
	            (0, _jquery2.default)('#' + key + '-link').click(value);
	          }
	        });

	        _underscore2.default.each(this.trajectoryMap, function (value, key) {
	          if (typeof value === 'function') {
	            (0, _jquery2.default)('#' + key + '-trajectory-link').click(value);
	          }
	        });

	        _underscore2.default.each(this.trends, function (trend) {
	          // Order by the trend column clicked.
	          (0, _jquery2.default)('#' + trend.id_selector + '-trend-col-header').click(_underscore2.default.bind(function () {
	            this.sortOrder = {
	              trend: trend.name,
	              order: this.sortOrder.order * -1
	            };
	            this.render();
	          }, this));
	        }, this);

	        (0, _jquery2.default)('#dataset-col-header').click(_underscore2.default.bind(function () {
	          this.sortOrder = {
	            dataset: true,
	            order: this.sortOrder.order * -1
	          };
	          this.render();
	        }, this));
	      }, this));
	    }
	  }]);

	  return ResultTablePane;
	}(_VisComponent3.default);

	exports.default = ResultTablePane;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _ErrorBulletWidget = __webpack_require__(48);

	var _ErrorBulletWidget2 = _interopRequireDefault(_ErrorBulletWidget);

	var _BoxAndWhiskerWidget = __webpack_require__(57);

	var _BoxAndWhiskerWidget2 = _interopRequireDefault(_BoxAndWhiskerWidget);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ValueWidget = function (_VisComponent) {
	  _inherits(ValueWidget, _VisComponent);

	  function ValueWidget(el, settings) {
	    _classCallCheck(this, ValueWidget);

	    var _this = _possibleConstructorReturn(this, (ValueWidget.__proto__ || Object.getPrototypeOf(ValueWidget)).call(this, el));

	    _this.settings = settings;
	    if (Array.isArray(settings.result.current)) {
	      if (settings.result.current.length > 1) {
	        _this.Type = _BoxAndWhiskerWidget2.default;
	      } else {
	        settings.result.current = settings.result.current[0];
	        _this.Type = _ErrorBulletWidget2.default;
	      }
	    } else {
	      _this.Type = _ErrorBulletWidget2.default;
	    }
	    return _this;
	  }

	  _createClass(ValueWidget, [{
	    key: 'render',
	    value: function render() {
	      var widget = new this.Type(this.el, this.settings);
	      widget.render();
	    }
	  }]);

	  return ValueWidget;
	}(_VisComponent3.default);

	exports.default = ValueWidget;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _underscore = __webpack_require__(41);

	var _underscore2 = _interopRequireDefault(_underscore);

	var _d = __webpack_require__(8);

	var _d2 = _interopRequireDefault(_d);

	var _jquery = __webpack_require__(13);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _colors = __webpack_require__(51);

	var _colors2 = _interopRequireDefault(_colors);

	var _utility = __webpack_require__(49);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BoxAndWhiskerWidget = function (_VisComponent) {
	  _inherits(BoxAndWhiskerWidget, _VisComponent);

	  function BoxAndWhiskerWidget(el, settings) {
	    _classCallCheck(this, BoxAndWhiskerWidget);

	    var _this = _possibleConstructorReturn(this, (BoxAndWhiskerWidget.__proto__ || Object.getPrototypeOf(BoxAndWhiskerWidget)).call(this, el));

	    _this.showScales = settings.showScales !== false;
	    _this.current = settings.result.current;
	    _this.trend = settings.trend;
	    _this.currentValues = _this.current.sort(_d2.default.ascending);
	    _this.median = _d2.default.median(_this.currentValues);
	    _this.outOfBounds = _this.median <= 0 || _this.median >= _this.trend.max;
	    (0, _jquery2.default)(window).resize(_underscore2.default.bind(_this.render, _this));
	    return _this;
	  }

	  _createClass(BoxAndWhiskerWidget, [{
	    key: 'chartData',
	    value: function chartData() {}
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      var toolTipDiv = _d2.default.select('body').append('div').attr('class', 'tdash-tooltip').style('opacity', 0);

	      var svg = _d2.default.select(this.el).html('').attr('width', '100%').attr('height', '100%');

	      // An IQR factor for determining outliers is a good rule of thumb. See
	      // https://en.wikipedia.org/wiki/Box_plot for further explanation.
	      var iqrFactor = 1.5;
	      var min = 0;
	      var max = this.trend.max;
	      var margin = { top: 10, right: 20, bottom: 10, left: 10 };
	      var w = svg[0][0].clientWidth - margin.left - margin.right;
	      var h = svg[0][0].clientHeight - margin.top - margin.bottom;

	      svg.style('padding-left', margin.left).style('padding-right', margin.right);

	      var q1 = _d2.default.quantile(this.currentValues, 0.25);
	      var q3 = _d2.default.quantile(this.currentValues, 0.75);
	      var iqr = q3 - q1;
	      var outlierRange = iqr * iqrFactor;

	      var x = _d2.default.scale.linear().domain([min, max]).range([0, w]);

	      if (this.showScales) {
	        var xAxis = _d2.default.svg.axis().tickSize(1).ticks(5).orient('bottom').scale(x);
	        svg.append('g').attr('transform', 'translate(0,30)').call(xAxis);
	      }

	      if (this.outOfBounds) {
	        svg.append('rect').attr('x', -margin.left).attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom).attr('stroke', _colors2.default.fail).attr('stroke-width', 3).attr('fill-opacity', 0);
	      }

	      var quantiles = [_d2.default.quantile(this.currentValues, 0.05), _d2.default.quantile(this.currentValues, 0.25), _d2.default.quantile(this.currentValues, 0.50), _d2.default.quantile(this.currentValues, 0.75), _d2.default.quantile(this.currentValues, 0.95)];

	      var outliers = _underscore2.default.filter(this.currentValues, function (val) {
	        return val < q1 - outlierRange || val > q3 + outlierRange;
	      });

	      // Setup tooltip
	      svg.on('mouseover', function (d) {
	        toolTipDiv.transition().duration(200).style('opacity', 1.0);
	        var cells = [['Min', (0, _utility.standardRound)(_this2.currentValues[0])], ['5th %ile', (0, _utility.standardRound)(quantiles[0])], ['25th %ile', (0, _utility.standardRound)(quantiles[1])], ['Median', (0, _utility.standardRound)(_this2.median)], ['75th %ile', (0, _utility.standardRound)(quantiles[3])], ['95th %ile', (0, _utility.standardRound)(quantiles[4])], ['Max', (0, _utility.standardRound)(_this2.currentValues[_this2.currentValues.length - 1])], ['# of Samples', _this2.currentValues.length]];
	        if (outliers.length > 0) {
	          // Add in a blank row to separate Outliers.
	          cells.push(['&nbsp', '&nbsp']);
	          cells.push(['Outliers', _underscore2.default.map(outliers, _utility.standardRound).join(', ')]);
	        }
	        var toolTipHtml = '<table style="border-collapse: separate; border-spacing: 10px 2px;">';
	        _underscore2.default.each(cells, function (cell) {
	          toolTipHtml += '<tr><td>' + cell[0] + '</td><td>' + cell[1] + '</td></tr>';
	        });
	        toolTipHtml += '</table>';
	        toolTipDiv.html(toolTipHtml).style('left', _d2.default.event.pageX + 'px').style('top', _d2.default.event.pageY - 28 + 'px');
	      }).on('mouseout', function (d) {
	        toolTipDiv.transition().duration(200).style('opacity', 0);
	      });

	      svg = svg.append('g');

	      var vals = svg.selectAll('circle').data(outliers).enter().append('circle').on('mouseover', function (d) {
	        toolTipDiv.transition().duration(200).style('opacity', 0.9);
	        toolTipDiv.html('Outlier: ' + d.toString()).style('left', _d2.default.event.pageX + 'px').style('top', _d2.default.event.pageY - 28 + 'px');
	      }).on('mouseout', function (d) {
	        toolTipDiv.transition().duration(200).style('opacity', 0);
	      });

	      vals.attr('cx', function (d, i) {
	        return d / max * w;
	      }).attr('cy', h / 2).attr('r', 3).attr('stroke', 'black').attr('stroke-width', 1).attr('fill', 'white');

	      var qtrGroup = svg.append('g');

	      var qtr = qtrGroup.selectAll('rect').data([{ q1: q1, q3: q3 }]).enter().append('rect');

	      qtr.attr('x', function (d, i) {
	        return d.q1 / max * w;
	      }).attr('y', h / 4).attr('width', function (d, i) {
	        return (d.q3 - d.q1) / max * w;
	      }).attr('height', h / 2).attr('fill', (0, _utility.computeColor)(this.trend, this.median)).attr('stroke', 'black').attr('stroke-width', 1).attr('class', 'qtr');

	      // Draw the whisker marks
	      var markGroup = svg.append('g');
	      var marks = markGroup.selectAll('rect').data([quantiles[0], quantiles[2], quantiles[4]]).enter().append('rect');
	      marks.attr('x', function (d, i) {
	        return d / max * w;
	      }).attr('y', h / 4).attr('width', 2).attr('height', h / 2);

	      // Draw the horizontal lines that extend the whiskers
	      var horGroup = svg.append('g');
	      var hor = horGroup.selectAll('rect').data([{ start: quantiles[0], end: quantiles[1] }, { start: quantiles[3], end: quantiles[4] }]).enter().append('rect');
	      hor.attr('x', function (d, i) {
	        return d.start / max * w;
	      }).attr('y', h / 2).attr('height', 2).attr('width', function (d, i) {
	        return (d.end - d.start) / max * w;
	      });
	    }
	  }]);

	  return BoxAndWhiskerWidget;
	}(_VisComponent3.default);

	exports.default = BoxAndWhiskerWidget;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(46);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (datasetLabelMap, datasetMap, producerLink, resultsByDatasetId, sortOrder, trends, undefined) {
	buf.push("<table class=\"table table-striped table-hover table-responsive table-compact\"><thead class=\"result-labels\"><tr class=\"key-metrics-row\"><td></td><td" + (jade.attr("colspan", trends.length, true, true)) + " id=\"key-metrics-title\">");
	if ( producerLink)
	{
	buf.push("<a" + (jade.attr("href", producerLink, true, true)) + ">Key Metrics</a>");
	}
	else
	{
	buf.push("Key Metrics");
	}
	buf.push("</td></tr><tr><td><div id=\"dataset-col-header\" class=\"trend-col-header-sortable\">Dataset<svg class=\"sort-column-icon\">");
	if ( !sortOrder || !sortOrder.dataset)
	{
	buf.push("<polygon points=\"4,6 12,6 8,14\"></polygon>");
	}
	else
	{
	if ( sortOrder.order === 1)
	{
	buf.push("<polygon points=\"4,14 12,14 8,6\" class=\"active\"></polygon>");
	}
	else
	{
	buf.push("<polygon points=\"4,6 12,6 8,14\" class=\"active\"></polygon>");
	}
	}
	buf.push("</svg></div></td>");
	// iterate trends
	;(function(){
	  var $$obj = trends;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var trend = $$obj[$index];

	buf.push("<td><div" + (jade.attr("id", "" + (trend.id_selector) + "-trend-col-header", true, true)) + " class=\"trend-col-header-sortable\"><abbr" + (jade.attr("title", "" + (trend.title) + "", true, true)) + ">" + (jade.escape((jade_interp = trend.display_name) == null ? '' : jade_interp)) + "</abbr><svg class=\"sort-column-icon\">");
	if ( !sortOrder || sortOrder.trend !== trend.name)
	{
	buf.push("<polygon points=\"4,6 12,6 8,14\"></polygon>");
	}
	else
	{
	if ( sortOrder.order === 1)
	{
	buf.push("<polygon points=\"4,14 12,14 8,6\" class=\"active\"></polygon>");
	}
	else
	{
	buf.push("<polygon points=\"4,6 12,6 8,14\" class=\"active\"></polygon>");
	}
	}
	buf.push("</svg></div></td>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var trend = $$obj[$index];

	buf.push("<td><div" + (jade.attr("id", "" + (trend.id_selector) + "-trend-col-header", true, true)) + " class=\"trend-col-header-sortable\"><abbr" + (jade.attr("title", "" + (trend.title) + "", true, true)) + ">" + (jade.escape((jade_interp = trend.display_name) == null ? '' : jade_interp)) + "</abbr><svg class=\"sort-column-icon\">");
	if ( !sortOrder || sortOrder.trend !== trend.name)
	{
	buf.push("<polygon points=\"4,6 12,6 8,14\"></polygon>");
	}
	else
	{
	if ( sortOrder.order === 1)
	{
	buf.push("<polygon points=\"4,14 12,14 8,6\" class=\"active\"></polygon>");
	}
	else
	{
	buf.push("<polygon points=\"4,6 12,6 8,14\" class=\"active\"></polygon>");
	}
	}
	buf.push("</svg></div></td>");
	    }

	  }
	}).call(this);

	buf.push("</tr></thead><tbody>");
	// iterate resultsByDatasetId
	;(function(){
	  var $$obj = resultsByDatasetId;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var resultSet = $$obj[$index];

	buf.push("<tr><td" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-name", true, true)) + " class=\"dataset-name\">");
	if ( typeof(datasetMap[resultSet[0].dataset]) === 'string')
	{
	buf.push("<a" + (jade.attr("href", "" + (datasetMap[resultSet[0].dataset]) + "", true, true)) + ">" + (jade.escape((jade_interp = resultSet[0].dataset) == null ? '' : jade_interp)) + "</a>");
	}
	else if ( typeof(datasetMap[resultSet[0].dataset]) === 'function')
	{
	buf.push("<a href=\"javascript:;\"" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-link", true, true)) + ">" + (jade.escape((jade_interp = resultSet[0].dataset) == null ? '' : jade_interp)) + "</a>");
	}
	else
	{
	buf.push("" + (jade.escape((jade_interp = resultSet[0].dataset) == null ? '' : jade_interp)) + "");
	}
	if ( typeof(datasetLabelMap[resultSet[0].dataset_id_selector]) === 'string')
	{
	buf.push("<div" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-label", true, true)) + " class=\"dataset-label\">" + (jade.escape((jade_interp = datasetLabelMap[resultSet[0].dataset_id_selector]) == null ? '' : jade_interp)) + "</div>");
	}
	buf.push("</td>");
	// iterate trends
	;(function(){
	  var $$obj = trends;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var trend = $$obj[$index];

	buf.push("<td" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "", true, true)) + " class=\"valueWidget-container\"><div" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget", true, true)) + " class=\"valueWidget\"><svg" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget-svg", true, true)) + "></svg></div></td>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var trend = $$obj[$index];

	buf.push("<td" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "", true, true)) + " class=\"valueWidget-container\"><div" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget", true, true)) + " class=\"valueWidget\"><svg" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget-svg", true, true)) + "></svg></div></td>");
	    }

	  }
	}).call(this);

	buf.push("</tr>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var resultSet = $$obj[$index];

	buf.push("<tr><td" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-name", true, true)) + " class=\"dataset-name\">");
	if ( typeof(datasetMap[resultSet[0].dataset]) === 'string')
	{
	buf.push("<a" + (jade.attr("href", "" + (datasetMap[resultSet[0].dataset]) + "", true, true)) + ">" + (jade.escape((jade_interp = resultSet[0].dataset) == null ? '' : jade_interp)) + "</a>");
	}
	else if ( typeof(datasetMap[resultSet[0].dataset]) === 'function')
	{
	buf.push("<a href=\"javascript:;\"" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-link", true, true)) + ">" + (jade.escape((jade_interp = resultSet[0].dataset) == null ? '' : jade_interp)) + "</a>");
	}
	else
	{
	buf.push("" + (jade.escape((jade_interp = resultSet[0].dataset) == null ? '' : jade_interp)) + "");
	}
	if ( typeof(datasetLabelMap[resultSet[0].dataset_id_selector]) === 'string')
	{
	buf.push("<div" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-label", true, true)) + " class=\"dataset-label\">" + (jade.escape((jade_interp = datasetLabelMap[resultSet[0].dataset_id_selector]) == null ? '' : jade_interp)) + "</div>");
	}
	buf.push("</td>");
	// iterate trends
	;(function(){
	  var $$obj = trends;
	  if ('number' == typeof $$obj.length) {

	    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
	      var trend = $$obj[$index];

	buf.push("<td" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "", true, true)) + " class=\"valueWidget-container\"><div" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget", true, true)) + " class=\"valueWidget\"><svg" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget-svg", true, true)) + "></svg></div></td>");
	    }

	  } else {
	    var $$l = 0;
	    for (var $index in $$obj) {
	      $$l++;      var trend = $$obj[$index];

	buf.push("<td" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "", true, true)) + " class=\"valueWidget-container\"><div" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget", true, true)) + " class=\"valueWidget\"><svg" + (jade.attr("id", "" + (resultSet[0].dataset_id_selector) + "-" + (trend.id_selector) + "-valueWidget-svg", true, true)) + "></svg></div></td>");
	    }

	  }
	}).call(this);

	buf.push("</tr>");
	    }

	  }
	}).call(this);

	buf.push("</tbody></table>");}.call(this,"datasetLabelMap" in locals_for_with?locals_for_with.datasetLabelMap:typeof datasetLabelMap!=="undefined"?datasetLabelMap:undefined,"datasetMap" in locals_for_with?locals_for_with.datasetMap:typeof datasetMap!=="undefined"?datasetMap:undefined,"producerLink" in locals_for_with?locals_for_with.producerLink:typeof producerLink!=="undefined"?producerLink:undefined,"resultsByDatasetId" in locals_for_with?locals_for_with.resultsByDatasetId:typeof resultsByDatasetId!=="undefined"?resultsByDatasetId:undefined,"sortOrder" in locals_for_with?locals_for_with.sortOrder:typeof sortOrder!=="undefined"?sortOrder:undefined,"trends" in locals_for_with?locals_for_with.trends:typeof trends!=="undefined"?trends:undefined,"undefined" in locals_for_with?locals_for_with.undefined: false?undefined:undefined));;return buf.join("");
	}

/***/ }),
/* 59 */
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

	var _topInfoBar = __webpack_require__(60);

	var _topInfoBar2 = _interopRequireDefault(_topInfoBar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TopInfoBar = function (_VisComponent) {
	  _inherits(TopInfoBar, _VisComponent);

	  function TopInfoBar(el, settings) {
	    _classCallCheck(this, TopInfoBar);

	    var _this = _possibleConstructorReturn(this, (TopInfoBar.__proto__ || Object.getPrototypeOf(TopInfoBar)).call(this, el));

	    _this.$el = (0, _jquery2.default)(_this.el);

	    _this.name = settings.name || 'Ground Truth';
	    _this.branch = settings.branch || 'No branch set';
	    _this.day = settings.day || _this.getToday();
	    _this.submissionUuid = settings.submission_uuid;
	    _this.helpLink = settings.help_link;
	    return _this;
	  }

	  _createClass(TopInfoBar, [{
	    key: 'render',
	    value: function render() {
	      this.$el.html((0, _topInfoBar2.default)({
	        name: this.name,
	        branch: this.branch,
	        day: this.day,
	        uuid: this.submissionUuid,
	        helpLink: this.helpLink
	      }));
	    }
	  }]);

	  return TopInfoBar;
	}(_VisComponent3.default);

	exports.default = TopInfoBar;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(46);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;
	;var locals_for_with = (locals || {});(function (branch, day, helpLink, name, uuid) {
	buf.push("<div class=\"info-title info-name\">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</div><div class=\"info-branch\">" + (jade.escape((jade_interp = branch) == null ? '' : jade_interp)) + "</div><div class=\"info-submission\"><div class=\"info-date\">" + (jade.escape((jade_interp = day) == null ? '' : jade_interp)) + "</div>");
	if ( uuid)
	{
	buf.push("<div class=\"info-uuid\">" + (jade.escape((jade_interp = uuid) == null ? '' : jade_interp)) + "</div>");
	}
	buf.push("</div><div class=\"info-help\"><a" + (jade.attr("href", helpLink, true, true)) + " class=\"help\">Help</a>");
	if ( uuid)
	{
	buf.push("<div class=\"dropdown\"><button id=\"dLabel\" data-toggle=\"dropdown\" class=\"btn btn-default dropdown-toggle\"><Dropdown>csv</Dropdown><span class=\"caret\"></span></button><ul class=\"dropdown-menu dropdown-menu-right\"><li class=\"csv-link\"><a" + (jade.attr("href", "/tracker/submission/csv?submissionUuid=" + (uuid) + "", true, true)) + ">Current key metrics</a></li><li class=\"csv-link\"><a" + (jade.attr("href", "/tracker/submission/csv?submissionUuid=" + (uuid) + "&keyMetricsOnly=false", true, true)) + ">Current all metrics</a></li><li class=\"csv-link\"><a" + (jade.attr("href", "/tracker/submission/csv?submissionUuid=" + (uuid) + "&daysInterval=7", true, true)) + ">Last 7 days key metrics</a></li><li class=\"csv-link\"><a" + (jade.attr("href", "/tracker/submission/csv?submissionUuid=" + (uuid) + "&daysInterval=7&keyMetricsOnly=false", true, true)) + ">Last 7 days all metrics</a></li></ul></div>");
	}
	buf.push("</div>");}.call(this,"branch" in locals_for_with?locals_for_with.branch:typeof branch!=="undefined"?branch:undefined,"day" in locals_for_with?locals_for_with.day:typeof day!=="undefined"?day:undefined,"helpLink" in locals_for_with?locals_for_with.helpLink:typeof helpLink!=="undefined"?helpLink:undefined,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined,"uuid" in locals_for_with?locals_for_with.uuid:typeof uuid!=="undefined"?uuid:undefined));;return buf.join("");
	}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(46);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"midas-dashboard container-fluid trackerdash\"><div class=\"top-info-bar row\"></div><div class=\"overview-panel row\"><div class=\"info-pane col-md-6\"><div class=\"info-title\">Ground Truth Performance</div></div><div class=\"trend-pane col-md-6\"><div class=\"trend-graph\">Graph goes here</div></div></div><div class=\"status-bar-widget row\"></div><div class=\"result-table-panel row\"><div class=\"result-table-pane col-md-12\"></div></div></div>");;return buf.join("");
	}

/***/ })
/******/ ])
});
;