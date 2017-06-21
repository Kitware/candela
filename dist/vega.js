(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("candela"), require("candela/VisComponent"), require("candela/plugins/mixin/VegaChart"), require("candela/plugins/mixin/Events"));
	else if(typeof define === 'function' && define.amd)
		define(["candela", "candela/VisComponent", "candela/plugins/mixin/VegaChart", "candela/plugins/mixin/Events"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("candela"), require("candela/VisComponent"), require("candela/plugins/mixin/VegaChart"), require("candela/plugins/mixin/Events"));
	else
		root["candela"] = factory(root["candela"], root["candela/VisComponent"], root["candela/plugins/mixin/VegaChart"], root["candela/plugins/mixin/Events"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_71__, __WEBPACK_EXTERNAL_MODULE_84__) {
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

	var _BarChart = __webpack_require__(70);

	var _BarChart2 = _interopRequireDefault(_BarChart);

	var _BoxPlot = __webpack_require__(73);

	var _BoxPlot2 = _interopRequireDefault(_BoxPlot);

	var _BulletChart = __webpack_require__(75);

	var _BulletChart2 = _interopRequireDefault(_BulletChart);

	var _GanttChart = __webpack_require__(77);

	var _GanttChart2 = _interopRequireDefault(_GanttChart);

	var _Heatmap = __webpack_require__(79);

	var _Heatmap2 = _interopRequireDefault(_Heatmap);

	var _Histogram = __webpack_require__(81);

	var _Histogram2 = _interopRequireDefault(_Histogram);

	var _LineChart = __webpack_require__(83);

	var _LineChart2 = _interopRequireDefault(_LineChart);

	var _ScatterPlot = __webpack_require__(86);

	var _ScatterPlot2 = _interopRequireDefault(_ScatterPlot);

	var _ScatterPlotMatrix = __webpack_require__(88);

	var _ScatterPlotMatrix2 = _interopRequireDefault(_ScatterPlotMatrix);

	var _SurvivalPlot = __webpack_require__(90);

	var _SurvivalPlot2 = _interopRequireDefault(_SurvivalPlot);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var components = {
	  BarChart: _BarChart2.default,
	  BoxPlot: _BoxPlot2.default,
	  BulletChart: _BulletChart2.default,
	  GanttChart: _GanttChart2.default,
	  Heatmap: _Heatmap2.default,
	  Histogram: _Histogram2.default,
	  LineChart: _LineChart2.default,
	  ScatterPlot: _ScatterPlot2.default,
	  ScatterPlotMatrix: _ScatterPlotMatrix2.default,
	  SurvivalPlot: _SurvivalPlot2.default
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
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
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
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(72);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BarChart = function (_VegaChart) {
	  _inherits(BarChart, _VegaChart);

	  function BarChart() {
	    _classCallCheck(this, BarChart);

	    return _possibleConstructorReturn(this, (BarChart.__proto__ || Object.getPrototypeOf(BarChart)).apply(this, arguments));
	  }

	  _createClass(BarChart, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'x',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'y',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number', 'integer', 'boolean']
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
	        name: 'hover',
	        type: 'string_list',
	        format: 'string_list',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  return BarChart;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = BarChart;

/***/ }),
/* 71 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_71__;

/***/ }),
/* 72 */
/***/ (function(module, exports) {

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
			],
			[
				"xAxis.title",
				[
					"@get",
					"x"
				]
			],
			[
				"yAxis.title",
				[
					"@get",
					"y"
				]
			],
			[
				"hover",
				[
					[
						"@get",
						"x"
					],
					[
						"@get",
						"y"
					]
				]
			],
			[
				"padding",
				"strict"
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
				"padding"
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
					"name": "data",
					"values": [
						"@get",
						"data"
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
					"nice": false,
					"round": true,
					"domain": {
						"data": "data",
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
						"data": "data",
						"field": [
							"@get",
							"y"
						]
					}
				},
				[
					"@colorScale",
					{
						"name": "color",
						"data": "data",
						"values": [
							"@get",
							"data"
						],
						"field": [
							"@get",
							"color"
						]
					}
				]
			],
			"legends": [
				"@if",
				[
					"@get",
					"color"
				],
				[
					{
						"fill": "color",
						"title": [
							"@get",
							"color"
						],
						"properties": {
							"symbols": {
								"strokeWidth": {
									"value": 0
								}
							}
						}
					}
				],
				[]
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
					],
					"properties": {
						"labels": {
							"text": {
								"template": "{{datum.data | truncate:25}}"
							},
							"angle": {
								"value": 270
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
						"data": "data"
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
						"update": [
							"@if",
							[
								"@get",
								"color"
							],
							{
								"fill": {
									"scale": "color",
									"field": [
										"@get",
										"color"
									]
								}
							},
							{
								"fill": {
									"scale": "color",
									"value": 0
								}
							}
						],
						"hover": {
							"fill": {
								"value": "red"
							}
						}
					}
				},
				{
					"type": "group",
					"marks": [
						"@map",
						[
							"@get",
							"hover"
						],
						"h",
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
												"d[",
												[
													"@get",
													"x"
												],
												"]"
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
												"d[",
												[
													"@get",
													"y"
												],
												"]"
											]
										],
										"offset": [
											"@add",
											-5,
											[
												"@mult",
												-15,
												[
													"@get",
													"index"
												]
											]
										]
									},
									"text": {
										"template": [
											"@join",
											"",
											[
												[
													"@get",
													"h"
												],
												": ",
												"{{d['",
												[
													"@get",
													"h"
												],
												"']}}"
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
			]
		}
	];

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(74);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BoxPlot = function (_VegaChart) {
	  _inherits(BoxPlot, _VegaChart);

	  function BoxPlot() {
	    _classCallCheck(this, BoxPlot);

	    return _possibleConstructorReturn(this, (BoxPlot.__proto__ || Object.getPrototypeOf(BoxPlot)).apply(this, arguments));
	  }

	  _createClass(BoxPlot, null, [{
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
	          fieldTypes: ['date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'group',
	        type: 'string',
	        format: 'text',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  return BoxPlot;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = BoxPlot;

/***/ }),
/* 74 */
/***/ (function(module, exports) {

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
				"vertical"
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
			],
			[
				"padding",
				"strict"
			]
		],
		[
			"@merge",
			[
				"@axis",
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
						"data": [
							"@get",
							"data"
						],
						"field": [
							"@get",
							"fields.0"
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
				"@axis",
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
						"data": [
							"@get",
							"data"
						],
						"field": [
							"@get",
							"group"
						],
						"points": true,
						"padding": 1,
						"domain": {
							"data": "table",
							"field": "name",
							"sort": true
						},
						"properties": {
							"labels": {
								"text": {
									"template": "{{datum.data | truncate:25}}"
								},
								"angle": {
									"value": [
										"@if",
										[
											"@get",
											"horiz"
										],
										0,
										270
									]
								},
								"align": {
									"value": [
										"@if",
										[
											"@get",
											"horiz"
										],
										"left",
										"right"
									]
								},
								"baseline": {
									"value": "middle"
								}
							}
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
					"padding"
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
							"data"
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

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(76);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var BulletChart = function (_VegaChart) {
	  _inherits(BulletChart, _VegaChart);

	  function BulletChart() {
	    _classCallCheck(this, BulletChart);

	    return _possibleConstructorReturn(this, (BulletChart.__proto__ || Object.getPrototypeOf(BulletChart)).apply(this, arguments));
	  }

	  _createClass(BulletChart, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'value',
	        type: 'number',
	        format: 'number'
	      }, {
	        name: 'title',
	        type: 'string',
	        format: 'text',
	        optional: true
	      }, {
	        name: 'subtitle',
	        type: 'string',
	        format: 'text',
	        optional: true
	      }, {
	        name: 'markers',
	        type: 'number_list',
	        format: 'number_list',
	        optional: true
	      }, {
	        name: 'ranges',
	        type: 'table',
	        format: 'objectlist',
	        optional: true
	      }];
	    }
	  }]);

	  return BulletChart;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = BulletChart;

/***/ }),
/* 76 */
/***/ (function(module, exports) {

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
				"title",
				""
			],
			[
				"subtitle",
				""
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
			],
			[
				"padding",
				"strict"
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
				"padding"
			],
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
					"range": "height",
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
								"field": "data"
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
								"field": "data"
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

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(78);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var GanttChart = function (_VegaChart) {
	  _inherits(GanttChart, _VegaChart);

	  function GanttChart() {
	    _classCallCheck(this, GanttChart);

	    return _possibleConstructorReturn(this, (GanttChart.__proto__ || Object.getPrototypeOf(GanttChart)).apply(this, arguments));
	  }

	  _createClass(GanttChart, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'label',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'level',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'start',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'end',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  return GanttChart;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = GanttChart;

/***/ }),
/* 78 */
/***/ (function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"width",
				700
			],
			[
				"height",
				600
			],
			[
				"padding",
				"strict"
			]
		],
		[
			"@merge",
			[
				"@axis",
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
									{
										"data": "data",
										"field": [
											"start",
											"end"
										]
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
					"padding"
				],
				"data": [
					{
						"name": "data",
						"values": [
							"@get",
							"data"
						],
						"transform": [
							{
								"type": "formula",
								"field": "label",
								"expr": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"label"
										],
										"']"
									]
								]
							},
							{
								"type": "formula",
								"field": "level",
								"expr": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"level"
										],
										"']"
									]
								]
							},
							{
								"type": "formula",
								"field": "start",
								"expr": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"start"
										],
										"']"
									]
								]
							},
							{
								"type": "formula",
								"field": "end",
								"expr": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"end"
										],
										"']"
									]
								]
							}
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
								"start",
								"end"
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
									"field": "start"
								},
								"x2": {
									"scale": "x",
									"field": "end"
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
			}
		]
	];

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(80);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Heatmap = function (_VegaChart) {
	  _inherits(Heatmap, _VegaChart);

	  function Heatmap() {
	    _classCallCheck(this, Heatmap);

	    return _possibleConstructorReturn(this, (Heatmap.__proto__ || Object.getPrototypeOf(Heatmap)).apply(this, arguments));
	  }

	  _createClass(Heatmap, null, [{
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
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'fields',
	        type: 'string_list',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'sort',
	        type: 'string',
	        format: 'text',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  return Heatmap;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = Heatmap;

/***/ }),
/* 80 */
/***/ (function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"id",
				"_id"
			],
			[
				"fields",
				[]
			],
			[
				"sort",
				[
					"@get",
					"id"
				]
			],
			[
				"padding",
				"strict"
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
				"padding"
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
			"data": [
				{
					"name": "data",
					"values": [
						"@get",
						"data"
					],
					"transform": [
						{
							"type": "formula",
							"field": "index",
							"expr": [
								"@join",
								"",
								[
									"datum['",
									[
										"@get",
										"id"
									],
									"']"
								]
							]
						},
						{
							"type": "rank",
							"field": [
								"@get",
								"sort"
							]
						}
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
				"@merge",
				[
					{
						"name": "x",
						"type": "ordinal",
						"domain": {
							"data": "fields",
							"field": "data"
						},
						"range": "width",
						"round": false
					},
					{
						"name": "y",
						"type": "ordinal",
						"domain": {
							"data": "data",
							"field": "index",
							"sort": {
								"field": [
									"@if",
									[
										"@isStringField",
										[
											"@get",
											"data"
										],
										[
											"@get",
											"sort"
										]
									],
									"rank",
									[
										"@get",
										"sort"
									]
								],
								"op": "mean"
							}
						},
						"range": "height",
						"round": false
					}
				],
				[
					"@map",
					[
						"@get",
						"fields"
					],
					"field",
					[
						"@colorScale",
						{
							"name": [
								"@get",
								"field"
							],
							"data": "data",
							"values": [
								"@get",
								"data"
							],
							"field": [
								"@get",
								"field"
							]
						}
					]
				]
			],
			"axes": [
				{
					"type": "x",
					"scale": "x"
				},
				[
					"@if",
					[
						"@eq",
						[
							"@get",
							"id"
						],
						"_id"
					],
					{
						"type": "y",
						"scale": "y",
						"properties": {
							"labels": {
								"text": {
									"value": ""
								}
							}
						}
					},
					{
						"type": "y",
						"scale": "y"
					}
				]
			],
			"marks": [
				"@merge",
				[
					"@map",
					[
						"@get",
						"fields"
					],
					"field",
					{
						"type": "rect",
						"from": {
							"data": "data"
						},
						"properties": {
							"enter": {
								"x": {
									"scale": "x",
									"value": [
										"@get",
										"field"
									]
								},
								"width": {
									"scale": "x",
									"band": true,
									"offset": 1
								},
								"y": {
									"scale": "y",
									"field": "index"
								},
								"height": {
									"scale": "y",
									"band": true,
									"offset": 1
								}
							},
							"update": {
								"fill": {
									"scale": [
										"@get",
										"field"
									],
									"field": [
										"@get",
										"field"
									]
								}
							},
							"hover": {
								"fill": {
									"value": "yellow"
								}
							}
						}
					}
				],
				[
					{
						"type": "group",
						"marks": [
							"@map",
							[
								"@get",
								"fields"
							],
							"h",
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
											"value": [
												"@get",
												"h"
											]
										},
										"dy": {
											"scale": "x",
											"band": true,
											"mult": 0.5
										},
										"y": {
											"scale": "y",
											"signal": "d.index",
											"offset": -5
										},
										"angle": {
											"value": 270
										},
										"align": {
											"value": "left"
										},
										"baseline": {
											"value": "middle"
										},
										"text": {
											"template": [
												"@join",
												"",
												[
													[
														"@get",
														"h"
													],
													": ",
													"{{d['",
													[
														"@get",
														"h"
													],
													"']}}"
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
				]
			]
		}
	];

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(82);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Histogram = function (_VegaChart) {
	  _inherits(Histogram, _VegaChart);

	  function Histogram() {
	    _classCallCheck(this, Histogram);

	    return _possibleConstructorReturn(this, (Histogram.__proto__ || Object.getPrototypeOf(Histogram)).apply(this, arguments));
	  }

	  _createClass(Histogram, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'bin',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'aggregate',
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

	  return Histogram;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = Histogram;

/***/ }),
/* 82 */
/***/ (function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"bin",
				"value"
			],
			[
				"width",
				800
			],
			[
				"height",
				500
			],
			[
				"xAxis.title",
				[
					"@get",
					"bin"
				]
			],
			[
				"yAxis.title",
				[
					"@if",
					[
						"@get",
						"aggregate"
					],
					[
						"@join",
						"",
						[
							"Sum of ",
							[
								"@get",
								"aggregate"
							]
						]
					],
					"Count"
				]
			],
			[
				"padding",
				"strict"
			]
		],
		[
			"@let",
			[
				[
					"discrete",
					[
						"@or",
						[
							"@get",
							"discrete"
						],
						[
							"@isStringField",
							[
								"@get",
								"data"
							],
							[
								"@get",
								"bin"
							]
						]
					]
				]
			],
			[
				"@merge",
				[
					"@axis",
					[
						"@merge",
						[
							"@get",
							"xAxis"
						],
						[
							"@if",
							[
								"@get",
								"discrete"
							],
							{
								"axis": "x",
								"size": [
									"@get",
									"width"
								],
								"type": "ordinal",
								"data": [
									"@get",
									"data"
								],
								"field": [
									"@get",
									"bin"
								],
								"pan": false,
								"zoom": false,
								"nice": true,
								"round": true,
								"domain": {
									"data": "series",
									"field": "bin",
									"sort": true
								},
								"properties": {
									"labels": {
										"text": {
											"template": "{{datum.data | truncate:25}}"
										},
										"angle": {
											"value": 270
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
								"axis": "x",
								"size": [
									"@get",
									"width"
								],
								"type": "linear",
								"data": [
									"@get",
									"data"
								],
								"field": [
									"@get",
									"bin"
								],
								"pan": true,
								"zoom": true,
								"nice": false,
								"round": false,
								"domain": {
									"data": "series",
									"field": [
										"bin_start",
										"bin_end"
									]
								}
							}
						]
					]
				],
				[
					"@axis",
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
							"data": [
								"@get",
								"data"
							],
							"field": [
								"@get",
								"aggregate"
							],
							"zero": true,
							"pan": false,
							"zoom": false,
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
						"padding"
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
								"data"
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
										],
										"field": "bin"
									},
									{
										"type": "aggregate",
										"groupby": [
											"bin"
										],
										"summarize": [
											[
												"@if",
												[
													"@get",
													"aggregate"
												],
												{
													"field": [
														"@get",
														"aggregate"
													],
													"ops": [
														"sum"
													],
													"as": [
														"count"
													]
												},
												{
													"field": "*",
													"ops": [
														"count"
													]
												}
											]
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
											"start": "bin_start",
											"mid": "bin",
											"end": "bin_end"
										},
										"maxbins": [
											"@get",
											"maxBins",
											20
										]
									},
									{
										"type": "aggregate",
										"groupby": [
											"bin_start",
											"bin",
											"bin_end"
										],
										"summarize": [
											[
												"@if",
												[
													"@get",
													"aggregate"
												],
												{
													"field": [
														"@get",
														"aggregate"
													],
													"ops": [
														"sum"
													],
													"as": [
														"count"
													]
												},
												{
													"field": "*",
													"ops": [
														"count"
													]
												}
											]
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
										"update": [
											"@merge",
											[
												"@if",
												[
													"@get",
													"discrete"
												],
												{
													"x": {
														"scale": "x",
														"field": "bin",
														"offset": 1
													},
													"width": {
														"scale": "x",
														"band": true,
														"offset": -1
													}
												},
												{
													"x": {
														"scale": "x",
														"field": "bin_start",
														"offset": 1
													},
													"x2": {
														"scale": "x",
														"field": "bin_end"
													}
												}
											],
											{
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
											}
										],
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
										"update": [
											"@merge",
											[
												"@if",
												[
													"@get",
													"discrete"
												],
												{
													"dx": {
														"scale": "x",
														"band": true,
														"mult": 0.5
													},
													"text": {
														"template": [
															"@get",
															"tooltip",
															"{{d.bin}}: {{d.count}}"
														]
													}
												},
												{
													"text": {
														"template": [
															"@get",
															"tooltip",
															"{{d.count}}"
														]
													}
												}
											],
											{
												"x": {
													"scale": "x",
													"signal": "d.bin"
												},
												"y": {
													"scale": "y",
													"signal": "d.count",
													"offset": -5
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
										]
									}
								}
							]
						}
					]
				}
			]
		]
	];

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _Events2 = __webpack_require__(84);

	var _Events3 = _interopRequireDefault(_Events2);

	var _VegaChart = __webpack_require__(71);

	var _VegaChart2 = _interopRequireDefault(_VegaChart);

	var _spec = __webpack_require__(85);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LineChart = function (_Events) {
	  _inherits(LineChart, _Events);

	  _createClass(LineChart, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'x',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'y',
	        type: 'string_list',
	        format: 'string_list',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'hover',
	        type: 'string_list',
	        format: 'string_list',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  function LineChart() {
	    var _ref;

	    _classCallCheck(this, LineChart);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    // Attach a listener to the chart.
	    var _this = _possibleConstructorReturn(this, (_ref = LineChart.__proto__ || Object.getPrototypeOf(LineChart)).call.apply(_ref, [this].concat(args)));

	    _this.chart.then(function (chart) {
	      chart.on('click', function (event, item) {
	        if (item && item.mark.marktype === 'symbol') {
	          var datum = Object.assign({}, item.datum);
	          delete datum._id;
	          delete datum._prev;

	          _this.emit('click', datum, item);
	        }
	      });
	    });
	    return _this;
	  }

	  return LineChart;
	}((0, _Events3.default)((0, _VegaChart2.default)(_VisComponent2.default, _spec2.default)));

	exports.default = LineChart;

/***/ }),
/* 84 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_84__;

/***/ }),
/* 85 */
/***/ (function(module, exports) {

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
			],
			[
				"hover",
				[
					"@merge",
					[
						[
							"@get",
							"x"
						]
					],
					[
						"@get",
						"y"
					]
				]
			],
			[
				"pointSize",
				25
			],
			[
				"xAxis.title",
				[
					"@get",
					"x"
				]
			],
			[
				"yAxis.title",
				[
					"@join",
					", ",
					[
						"@get",
						"y"
					]
				]
			],
			[
				"padding",
				"strict"
			]
		],
		[
			"@let",
			[
				[
					"legend",
					[
						"@gt",
						[
							"@length",
							[
								"@get",
								"y"
							]
						],
						1
					]
				]
			],
			[
				"@merge",
				[
					"@axis",
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
							"data": [
								"@get",
								"data"
							],
							"field": [
								"@get",
								"x"
							],
							"domain": [
								"@get",
								"xAxis.domain",
								{
									"fields": [
										{
											"data": "data",
											"field": "x"
										}
									]
								}
							]
						}
					]
				],
				[
					"@axis",
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
							"data": [
								"@get",
								"data"
							],
							"field": [
								"@get",
								"y.0"
							],
							"domain": [
								"@get",
								"yAxis.domain",
								{
									"fields": [
										{
											"data": "data",
											"field": [
												"@get",
												"y"
											]
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
						"padding"
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
							"name": "data",
							"values": [
								"@get",
								"data"
							],
							"transform": [
								{
									"type": "sort",
									"by": [
										"@get",
										"x"
									]
								},
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
												"x",
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
												"y",
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
								"@get",
								"y"
							],
							"range": "category10"
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
								"stroke": "color",
								"title": [
									"@get",
									"color"
								]
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
								"@map",
								[
									"@get",
									"y"
								],
								"yfield",
								{
									"type": "line",
									"from": {
										"data": "data"
									},
									"properties": {
										"update": {
											"x": {
												"scale": "x",
												"field": "x"
											},
											"y": {
												"scale": "y",
												"field": [
													"@get",
													"yfield"
												]
											},
											"stroke": {
												"scale": "color",
												"value": [
													"@get",
													"yfield"
												]
											},
											"strokeWidth": {
												"value": 2
											}
										}
									}
								},
								{
									"type": "symbol",
									"from": {
										"data": "data"
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
											"shape": {
												"value": "circle"
											},
											"fill": {
												"scale": "color",
												"value": [
													"@get",
													"yfield"
												]
											},
											"opacity": {
												"value": [
													"@if",
													[
														"@get",
														"showPoints"
													],
													1,
													0
												]
											},
											"size": {
												"value": [
													"@add",
													0,
													[
														"@get",
														"pointSize"
													]
												]
											}
										}
									}
								},
								{
									"type": "group",
									"marks": [
										"@map",
										[
											"@get",
											"hover"
										],
										"h",
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
														"offset": [
															"@add",
															-15,
															[
																"@mult",
																-15,
																[
																	"@get",
																	"index"
																]
															]
														]
													},
													"text": {
														"template": [
															"@join",
															"",
															[
																[
																	"@get",
																	"h"
																],
																": ",
																"{{d['",
																[
																	"@get",
																	"h"
																],
																"']}}"
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
							]
						}
					]
				}
			]
		]
	];

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(87);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ScatterPlot = function (_VegaChart) {
	  _inherits(ScatterPlot, _VegaChart);

	  function ScatterPlot() {
	    _classCallCheck(this, ScatterPlot);

	    return _possibleConstructorReturn(this, (ScatterPlot.__proto__ || Object.getPrototypeOf(ScatterPlot)).apply(this, arguments));
	  }

	  _createClass(ScatterPlot, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'x',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        name: 'y',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['date', 'number', 'integer', 'boolean']
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
	      }, {
	        name: 'shape',
	        type: 'string',
	        format: 'text',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
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
	        name: 'hover',
	        type: 'string_list',
	        format: 'string_list',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  return ScatterPlot;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = ScatterPlot;

/***/ }),
/* 87 */
/***/ (function(module, exports) {

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
			],
			[
				"hover",
				[
					[
						"@get",
						"x"
					],
					[
						"@get",
						"y"
					]
				]
			],
			[
				"xAxis.title",
				[
					"@get",
					"x"
				]
			],
			[
				"yAxis.title",
				[
					"@get",
					"y"
				]
			],
			[
				"opacity",
				0.01
			],
			[
				"padding",
				"strict"
			]
		],
		[
			"@let",
			[
				[
					"legend",
					[
						"@and",
						[
							"@get",
							"legend"
						],
						[
							"@or",
							[
								"@get",
								"color"
							],
							[
								"@get",
								"shape"
							],
							[
								"@get",
								"size"
							]
						]
					]
				]
			],
			[
				"@merge",
				[
					"@axis",
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
							"data": [
								"@get",
								"data"
							],
							"field": [
								"@get",
								"x"
							],
							"domain": [
								"@get",
								"xAxis.domain",
								{
									"fields": [
										{
											"data": "data",
											"field": "x"
										}
									]
								}
							]
						}
					]
				],
				[
					"@axis",
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
							"data": [
								"@get",
								"data"
							],
							"field": [
								"@get",
								"y"
							],
							"domain": [
								"@get",
								"yAxis.domain",
								{
									"fields": [
										{
											"data": "data",
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
						"padding"
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
							"name": "data",
							"values": [
								"@get",
								"data"
							],
							"transform": [
								{
									"type": "formula",
									"field": "color",
									"expr": [
										[
											"@if",
											[
												"@get",
												"color"
											],
											[
												"@join",
												"",
												[
													"datum['",
													[
														"@get",
														"color"
													],
													"']"
												]
											],
											"0"
										]
									]
								},
								{
									"type": "formula",
									"field": "shape",
									"expr": [
										[
											"@if",
											[
												"@get",
												"shape"
											],
											[
												"@join",
												"",
												[
													"datum['",
													[
														"@get",
														"shape"
													],
													"']"
												]
											],
											"0"
										]
									]
								},
								{
									"type": "formula",
									"field": "size",
									"expr": [
										[
											"@if",
											[
												"@get",
												"size"
											],
											[
												"@join",
												"",
												[
													"datum['",
													[
														"@get",
														"size"
													],
													"']"
												]
											],
											"0"
										]
									]
								},
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
												"x",
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
												"y",
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
						[
							"@colorScale",
							{
								"name": "color",
								"data": "data",
								"values": [
									"@get",
									"data"
								],
								"field": [
									"@get",
									"color"
								]
							}
						],
						{
							"name": "size",
							"type": "linear",
							"domain": {
								"data": "data",
								"field": "size"
							},
							"range": [
								[
									"@if",
									[
										"@get",
										"size"
									],
									9,
									100
								],
								361
							],
							"round": true,
							"nice": false,
							"zero": false
						},
						{
							"name": "shape",
							"type": "ordinal",
							"domain": {
								"data": "data",
								"field": "shape",
								"sort": true
							},
							"range": "shapes"
						}
					],
					"legends": [
						"@map",
						[
							[
								"@if",
								[
									"@get",
									"color"
								],
								{
									"stroke": "color",
									"title": [
										"@get",
										"color"
									]
								},
								null
							],
							[
								"@if",
								[
									"@get",
									"shape"
								],
								{
									"shape": "shape",
									"title": [
										"@get",
										"shape"
									]
								},
								null
							],
							[
								"@if",
								[
									"@get",
									"size"
								],
								{
									"size": "size",
									"title": [
										"@get",
										"size"
									]
								},
								null
							]
						],
						"d",
						[
							"@get",
							"d"
						]
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
									"type": "symbol",
									"from": {
										"data": "data"
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
												"field": "color"
											},
											"shape": {
												"scale": "shape",
												"field": "shape"
											},
											"fill": {
												"scale": "color",
												"field": "color"
											},
											"fillOpacity": {
												"value": [
													"@get",
													"opacity"
												]
											},
											"strokeWidth": {
												"value": 2
											},
											"size": {
												"scale": "size",
												"field": "size"
											}
										}
									}
								},
								{
									"type": "group",
									"marks": [
										"@map",
										[
											"@get",
											"hover"
										],
										"h",
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
														"offset": [
															"@add",
															-15,
															[
																"@mult",
																-15,
																[
																	"@get",
																	"index"
																]
															]
														]
													},
													"text": {
														"template": [
															"@join",
															"",
															[
																[
																	"@get",
																	"h"
																],
																": ",
																"{{d['",
																[
																	"@get",
																	"h"
																],
																"']}}"
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
							]
						}
					]
				}
			]
		]
	];

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(89);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ScatterPlotMatrix = function (_VegaChart) {
	  _inherits(ScatterPlotMatrix, _VegaChart);

	  function ScatterPlotMatrix() {
	    _classCallCheck(this, ScatterPlotMatrix);

	    return _possibleConstructorReturn(this, (ScatterPlotMatrix.__proto__ || Object.getPrototypeOf(ScatterPlotMatrix)).apply(this, arguments));
	  }

	  _createClass(ScatterPlotMatrix, null, [{
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
	          fieldTypes: ['number', 'integer', 'boolean']
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
	      }];
	    }
	  }]);

	  return ScatterPlotMatrix;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = ScatterPlotMatrix;

/***/ }),
/* 89 */
/***/ (function(module, exports) {

	module.exports = [
		"@defaults",
		[
			[
				"padding",
				"strict"
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
				"padding"
			],
			"data": [
				{
					"name": "data",
					"values": [
						"@get",
						"data"
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
				[
					"@colorScale",
					{
						"name": "color",
						"data": "data",
						"values": [
							"@get",
							"data"
						],
						"field": [
							"@get",
							"color"
						]
					}
				]
			],
			"legends": [
				"@if",
				[
					"@get",
					"color"
				],
				[
					{
						"fill": "color",
						"title": [
							"@get",
							"color"
						]
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
											"color"
										],
										{
											"scale": "color",
											"field": [
												"@get",
												"color"
											]
										},
										{
											"scale": "color",
											"value": 0
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
							"dx": {
								"scale": "gy",
								"band": true,
								"mult": -0.5
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
								"value": "center"
							},
							"baseline": {
								"value": "bottom"
							},
							"angle": {
								"value": 270
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
							"dx": {
								"scale": "gx",
								"band": true,
								"mult": 0.5
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
								"value": "center"
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

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent = __webpack_require__(6);

	var _VisComponent2 = _interopRequireDefault(_VisComponent);

	var _VegaChart2 = __webpack_require__(71);

	var _VegaChart3 = _interopRequireDefault(_VegaChart2);

	var _spec = __webpack_require__(91);

	var _spec2 = _interopRequireDefault(_spec);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SurvivalPlot = function (_VegaChart) {
	  _inherits(SurvivalPlot, _VegaChart);

	  _createClass(SurvivalPlot, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        name: 'data',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        name: 'time',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['number', 'integer']
	        }
	      }, {
	        name: 'censor',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['integer', 'boolean']
	        }
	      }, {
	        name: 'group',
	        type: 'string',
	        format: 'text',
	        optional: true,
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }];
	    }
	  }]);

	  function SurvivalPlot(el, options) {
	    _classCallCheck(this, SurvivalPlot);

	    // Sort the events by time.
	    var _this = _possibleConstructorReturn(this, (SurvivalPlot.__proto__ || Object.getPrototypeOf(SurvivalPlot)).call(this, el, options));

	    options.data.sort(function (x, y) {
	      return x[options.time] - y[options.time];
	    });

	    // If there is no 'group' parameter, fake one up.
	    if (!options.group) {
	      options.group = 'group';
	      options.data.forEach(function (d) {
	        return d.group = 0;
	      });
	    }

	    // Collect the grouping values, and count how many belong to each group.
	    var groups = {};
	    options.data.forEach(function (d) {
	      var key = d[options.group];
	      if (!groups[key]) {
	        groups[key] = {
	          survivors: 1
	        };
	      }

	      groups[key].survivors++;
	    });

	    // Append a dummy value to the start of the dataset, one per group.
	    var dummies = Object.keys(groups).map(function (g) {
	      var x = {
	        time: 0
	      };

	      x[options.group] = g;

	      return x;
	    });
	    options.data = [].concat(_toConsumableArray(dummies), _toConsumableArray(options.data));

	    // Compute the number of survivors at each event. A patient is assumed to
	    // have not survived, unless the reason for the event is "right censoring"
	    // (aka, censor == 1).
	    options.data.forEach(function (d) {
	      if (d[options.censor] !== 0) {
	        groups[d[options.group]].survivors--;
	      }
	      d.survivors = groups[d[options.group]].survivors;
	    });

	    _this.chart.then(function (chart) {
	      var data = chart.data('table');
	      data.remove(function () {
	        return true;
	      });
	      data.insert(options.data);

	      chart.update();
	    });
	    return _this;
	  }

	  return SurvivalPlot;
	}((0, _VegaChart3.default)(_VisComponent2.default, _spec2.default));

	exports.default = SurvivalPlot;

/***/ }),
/* 91 */
/***/ (function(module, exports) {

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
				"padding",
				30
			],
			[
				"tickSize",
				6
			],
			[
				"strokeWidth",
				2
			],
			[
				"legend",
				true
			],
			[
				"legendTitle",
				"Legend"
			],
			[
				"time",
				"time"
			],
			[
				"censor",
				"censor"
			],
			[
				"xAxis.title",
				[
					"@get",
					"time"
				]
			],
			[
				"yAxis.title",
				"survivors"
			]
		],
		[
			"@merge",
			[
				"@axis",
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
						"data": [
							"@get",
							"data"
						],
						"field": [
							"@get",
							"time"
						],
						"domain": {
							"fields": [
								{
									"data": "table",
									"field": [
										"@get",
										"time"
									]
								}
							]
						},
						"pan": true,
						"zoom": true
					}
				]
			],
			[
				"@axis",
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
						"data": [
							"@get",
							"data"
						],
						"field": "survivors",
						"domain": {
							"fields": [
								{
									"data": "table",
									"field": "survivors"
								}
							]
						},
						"pan": true,
						"zoom": true
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
					"padding"
				],
				"data": [
					{
						"name": "table",
						"values": [
							"@get",
							"data"
						]
					},
					{
						"name": "censored",
						"source": "table",
						"transform": [
							{
								"type": "sort",
								"by": [
									[
										"@get",
										"time"
									]
								]
							},
							{
								"type": "filter",
								"test": [
									"@join",
									"",
									[
										"datum['",
										[
											"@get",
											"censor"
										],
										"'] == 0"
									]
								]
							}
						]
					}
				],
				"scales": [
					{
						"name": "color",
						"type": "ordinal",
						"domain": {
							"data": "table",
							"field": [
								"@get",
								"group"
							]
						},
						"range": "category10"
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
							"stroke": "color",
							"title": [
								"@get",
								"legendTitle"
							]
						}
					],
					null
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
									"data": "censored"
								},
								"properties": {
									"enter": {
										"fill": {
											"scale": "color",
											"field": [
												"@get",
												"group"
											]
										}
									},
									"update": {
										"x": {
											"scale": "x",
											"field": [
												"@get",
												"time"
											],
											"offset": [
												"@mult",
												-0.5,
												[
													"@get",
													"strokeWidth"
												]
											]
										},
										"x2": {
											"scale": "x",
											"field": [
												"@get",
												"time"
											],
											"offset": [
												"@mult",
												0.5,
												[
													"@get",
													"strokeWidth"
												]
											]
										},
										"y": {
											"scale": "y",
											"field": "survivors",
											"offset": [
												"@mult",
												-0.5,
												[
													"@get",
													"tickSize"
												]
											]
										},
										"y2": {
											"scale": "y",
											"field": "survivors",
											"offset": [
												"@mult",
												0.5,
												[
													"@get",
													"tickSize"
												]
											]
										}
									}
								}
							},
							{
								"type": "rect",
								"from": {
									"data": "censored"
								},
								"properties": {
									"enter": {
										"fill": {
											"scale": "color",
											"field": [
												"@get",
												"group"
											]
										}
									},
									"update": {
										"x": {
											"scale": "x",
											"field": [
												"@get",
												"time"
											],
											"offset": [
												"@mult",
												-0.5,
												[
													"@get",
													"tickSize"
												]
											]
										},
										"x2": {
											"scale": "x",
											"field": [
												"@get",
												"time"
											],
											"offset": [
												"@mult",
												0.5,
												[
													"@get",
													"tickSize"
												]
											]
										},
										"y": {
											"scale": "y",
											"field": "survivors",
											"offset": [
												"@mult",
												-0.5,
												[
													"@get",
													"strokeWidth"
												]
											]
										},
										"y2": {
											"scale": "y",
											"field": "survivors",
											"offset": [
												"@mult",
												0.5,
												[
													"@get",
													"strokeWidth"
												]
											]
										}
									}
								}
							}
						]
					},
					{
						"type": "group",
						"from": {
							"data": "table",
							"transform": [
								{
									"type": "facet",
									"groupby": [
										[
											"@get",
											"group"
										]
									]
								}
							]
						},
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
								"type": "line",
								"properties": {
									"enter": {
										"stroke": {
											"scale": "color",
											"field": [
												"@get",
												"group"
											]
										},
										"strokeWidth": {
											"value": [
												"@get",
												"strokeWidth"
											]
										}
									},
									"update": {
										"interpolate": {
											"value": "step-after"
										},
										"x": {
											"scale": "x",
											"field": [
												"@get",
												"time"
											]
										},
										"y": {
											"scale": "y",
											"field": "survivors"
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

/***/ })
/******/ ])
});
;