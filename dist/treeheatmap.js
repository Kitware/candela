(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3-selection"), require("candela"), require("candela/VisComponent"), require("candela/util"), require("d3-array"), require("d3-scale"), require("d3-shape"), require("d3-transition"));
	else if(typeof define === 'function' && define.amd)
		define(["d3-selection", "candela", "candela/VisComponent", "candela/util", "d3-array", "d3-scale", "d3-shape", "d3-transition"], factory);
	else if(typeof exports === 'object')
		exports["candela"] = factory(require("d3-selection"), require("candela"), require("candela/VisComponent"), require("candela/util"), require("d3-array"), require("d3-scale"), require("d3-shape"), require("d3-transition"));
	else
		root["candela"] = factory(root["d3-selection"], root["candela"], root["candela/VisComponent"], root["candela/util"], root["d3-array"], root["d3-scale"], root["d3-shape"], root["d3-transition"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_63__, __WEBPACK_EXTERNAL_MODULE_64__, __WEBPACK_EXTERNAL_MODULE_65__, __WEBPACK_EXTERNAL_MODULE_66__) {
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

	var _TreeHeatmap = __webpack_require__(62);

	var _TreeHeatmap2 = _interopRequireDefault(_TreeHeatmap);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_candela2.default.register(_TreeHeatmap2.default, 'TreeHeatmap');

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }),

/***/ 62:
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _VisComponent2 = __webpack_require__(6);

	var _VisComponent3 = _interopRequireDefault(_VisComponent2);

	var _util = __webpack_require__(9);

	var _d3Array = __webpack_require__(63);

	var _d3Scale = __webpack_require__(64);

	var _d3Selection = __webpack_require__(2);

	var _d3Shape = __webpack_require__(65);

	__webpack_require__(66);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var TreeHeatmap = function (_VisComponent) {
	  _inherits(TreeHeatmap, _VisComponent);

	  _createClass(TreeHeatmap, null, [{
	    key: 'options',
	    get: function get() {
	      return [{
	        id: 'data',
	        name: 'Data table',
	        description: 'The data table.',
	        type: 'table',
	        format: 'objectlist'
	      }, {
	        id: 'idColumn',
	        name: 'Identifier column',
	        description: 'A column with unique identifiers. If not set, the ' + 'visualization will use a column with an empty name, or a column ' + 'named "_" or "_id".',
	        type: 'string',
	        format: 'text',
	        domain: {
	          mode: 'field',
	          from: 'data',
	          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
	        }
	      }, {
	        id: 'scale',
	        name: 'Color scale',
	        description: 'Color the data values with a global scale, ' + 'scale each row or column separately, or use a -1 to 1 ' + 'color scale suitable for a correlation matrix.',
	        type: 'string',
	        format: 'text',
	        domain: ['global', 'row', 'column', 'correlation'],
	        default: 'global'
	      }, {
	        id: 'clusterRows',
	        name: 'Cluster rows',
	        description: 'Order the rows by hierarchical cluster linkage.',
	        type: 'boolean',
	        format: 'boolean',
	        default: true
	      }, {
	        id: 'clusterColumns',
	        name: 'Cluster columns',
	        description: 'Order the columns by hierarchical cluster linkage.',
	        type: 'boolean',
	        format: 'boolean',
	        default: true
	      }, {
	        id: 'thresholdMode',
	        name: 'Threshold mode',
	        description: 'Use the threshold value to display only certain cells.',
	        type: 'string',
	        format: 'text',
	        domain: ['none', 'greater than', 'less than', 'absolute value greater than'],
	        default: 'none'
	      }, {
	        id: 'threshold',
	        name: 'Threshold value',
	        description: 'The value to threshold by.',
	        type: 'number',
	        format: 'number',
	        default: 0
	      }, {
	        id: 'removeEmpty',
	        name: 'Remove empty rows and columns',
	        description: 'Remove rows and columns that are entirely filtered out ' + 'by the threshold. Clustering by rows and columns will not be used.',
	        type: 'boolean',
	        format: 'boolean',
	        default: false
	      }];
	    }
	  }]);

	  function TreeHeatmap(el, options) {
	    _classCallCheck(this, TreeHeatmap);

	    var _this = _possibleConstructorReturn(this, (TreeHeatmap.__proto__ || Object.getPrototypeOf(TreeHeatmap)).call(this, el));

	    options = options || {};
	    _this.data = options.data;
	    _this.scale = options.scale || 'global';
	    _this.clusterRows = options.clusterRows === undefined ? true : options.clusterRows;
	    _this.clusterColumns = options.clusterColumns === undefined ? true : options.clusterColumns;
	    _this.idColumn = options.idColumn;
	    _this.thresholdMode = options.thresholdMode || 'none';
	    _this.threshold = options.threshold || 0;
	    _this.removeEmpty = options.removeEmpty === undefined ? false : options.removeEmpty;
	    _this.width = options.width;
	    _this.height = options.height;
	    return _this;
	  }

	  _createClass(TreeHeatmap, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      this.empty();

	      if (this.data === undefined || this.data.length === 0) {
	        return;
	      }

	      var size = (0, _util.getElementSize)(this.el);
	      var width = this.width || size.width || 400;
	      var height = this.height || size.height || 400;
	      var treeHeight = 100;
	      var labelHeight = 100;
	      var clusterRows = this.clusterRows;
	      var clusterColumns = this.clusterColumns;

	      // removeEmpty setting disables clusterings
	      if (this.removeEmpty) {
	        clusterRows = false;
	        clusterColumns = false;
	      }
	      var xStart = clusterRows ? treeHeight : 0;
	      var yStart = clusterColumns ? treeHeight : 0;
	      var colSize = width - xStart - labelHeight;
	      var rowSize = height - yStart - labelHeight;

	      var keys = Object.keys(this.data[0]);
	      var idColumn = this.idColumn;
	      if (idColumn === undefined) {
	        idColumn = keys.includes('_id') ? '_id' : idColumn;
	        idColumn = keys.includes('_') ? '_' : idColumn;
	        idColumn = keys.includes('') ? '' : idColumn;
	      }
	      if (idColumn === undefined) {
	        throw new Error('TreeHeatmap: No suitable idColumn found.');
	      }

	      var rows = [];
	      var reachedMetadata = false;
	      this.data.forEach(function (row) {
	        var id = '' + row[idColumn];
	        if (id === '_child1') {
	          reachedMetadata = true;
	        }
	        if (!id.startsWith('_') && !reachedMetadata) {
	          rows.push({ name: id });
	        }
	      });

	      var columns = null;
	      columns = [];
	      keys.forEach(function (k) {
	        if (k !== '' && !k.startsWith('_')) {
	          columns.push({ name: k });
	        }
	      });

	      var content = [];
	      var rowLinks = [];
	      var metadataRows = {};
	      var originalDataRows = {};
	      reachedMetadata = false;
	      this.data.forEach(function (row) {
	        var id = '' + row[idColumn];
	        if (id === '_child1') {
	          reachedMetadata = true;
	        }
	        if (id.startsWith('_')) {
	          metadataRows[id] = row;
	          return;
	        } else if (reachedMetadata) {
	          originalDataRows[id] = row;
	          return;
	        }
	        content.push(columns.map(function (col) {
	          return +row[col.name];
	        }));
	        if (clusterRows && +row._cluster >= 0) {
	          rowLinks.push({
	            cluster: +row._cluster,
	            child1: +row._child1,
	            child2: +row._child2,
	            distance: +row._distance,
	            size: +row._size
	          });
	        }
	      });

	      var colLinks = [];
	      if (clusterColumns) {
	        columns.forEach(function (col) {
	          if (metadataRows._cluster && +metadataRows._cluster[col.name] >= 0) {
	            colLinks.push({
	              cluster: +metadataRows._cluster[col.name],
	              child1: +metadataRows._child1[col.name],
	              child2: +metadataRows._child2[col.name],
	              distance: +metadataRows._distance[col.name],
	              size: +metadataRows._size[col.name]
	            });
	          }
	        });
	      }

	      var opacity = function opacity() {
	        return 1;
	      };
	      if (this.thresholdMode === 'less than') {
	        opacity = function opacity(d) {
	          return d.value < _this2.threshold ? 1 : 0;
	        };
	      } else if (this.thresholdMode === 'greater than') {
	        opacity = function opacity(d) {
	          return d.value > _this2.threshold ? 1 : 0;
	        };
	      } else if (this.thresholdMode === 'absolute value greater than') {
	        opacity = function opacity(d) {
	          return Math.abs(d.value) > _this2.threshold ? 1 : 0;
	        };
	      }

	      // Use opacity function to filter rows and columns
	      if (this.removeEmpty) {
	        for (var r = 0; r < rows.length; r += 1) {
	          for (var c = 0; c < columns.length; c += 1) {
	            if (rows[r].name !== columns[c].name && opacity({ value: content[r][c] })) {
	              rows[r].visible = true;
	              columns[c].visible = true;
	            }
	          }
	        }
	        for (var _r = rows.length - 1; _r >= 0; _r -= 1) {
	          if (!rows[_r].visible) {
	            rows.splice(_r, 1);
	            content.splice(_r, 1);
	          }
	        }

	        var _loop = function _loop(_c) {
	          if (!columns[_c].visible) {
	            columns.splice(_c, 1);
	            content.forEach(function (row) {
	              return row.splice(_c, 1);
	            });
	          }
	        };

	        for (var _c = columns.length - 1; _c >= 0; _c -= 1) {
	          _loop(_c);
	        }
	      }

	      var sortedRows = rows.slice().sort(function (a, b) {
	        return a.name.localeCompare(b.name);
	      });
	      var sortedCols = columns.slice().sort(function (a, b) {
	        return a.name.localeCompare(b.name);
	      });

	      var vis = (0, _d3Selection.select)(this.el).append('svg').attr('width', width + 'px').attr('height', height + 'px');

	      vis.append('clipPath').attr('id', 'clip-rect').append('rect').attr('x', xStart).attr('y', yStart).attr('width', colSize).attr('height', rowSize);

	      var rectGroup = vis.append('g').attr('clip-path', 'url(#clip-rect)');

	      vis.append('clipPath').attr('id', 'clip-row-labels').append('rect').attr('x', xStart + colSize).attr('y', yStart).attr('width', labelHeight).attr('height', rowSize);

	      var rowLabelGroup = vis.append('g').attr('clip-path', 'url(#clip-row-labels)');

	      vis.append('clipPath').attr('id', 'clip-col-labels').append('rect').attr('x', xStart).attr('y', yStart + rowSize).attr('width', colSize).attr('height', labelHeight);

	      var colLabelGroup = vis.append('g').attr('clip-path', 'url(#clip-col-labels)');

	      var distance = function distance(d) {
	        return d.distance;
	      };

	      var xScale = (0, _d3Scale.scaleLinear)().domain([0, content[0].length]).range([xStart, xStart + colSize]);
	      var yScale = (0, _d3Scale.scaleLinear)().domain([0, content.length]).range([yStart, yStart + rowSize]);

	      var tree = function tree(orientation, links, leaves, x, y, width, height, duration) {
	        var numLeaves = leaves.length;
	        var linkMap = {};
	        for (var leaf = 0; leaf < numLeaves; leaf += 1) {
	          leaves[leaf].size = 1;
	          leaves[leaf].distance = 0;
	          linkMap[leaf] = leaves[leaf];
	        }
	        for (var link = 0; link < links.length; link += 1) {
	          linkMap[links[link].cluster] = links[link];
	        }
	        var finalCluster = links[links.length - 1] || {};
	        finalCluster.offset = 0;
	        finalCluster.parent = finalCluster;
	        for (var _link = links.length - 1; _link >= 0; _link -= 1) {
	          var linkObject = links[_link];
	          var child1 = linkMap[linkObject.child1];
	          var child2 = linkMap[linkObject.child2];
	          linkObject.pos = linkObject.offset + child1.size;
	          child1.offset = linkObject.offset;
	          child1.parent = linkObject;
	          if (child1.size === 1) {
	            child1.pos = child1.offset + 0.5;
	          }
	          child2.offset = linkObject.offset + child1.size;
	          child2.parent = linkObject;
	          if (child2.size === 1) {
	            child2.pos = child2.offset + 0.5;
	          }
	        }
	        var distanceExtent = [0, distance(finalCluster)];
	        var distanceScale = (0, _d3Scale.scaleLinear)().domain(distanceExtent).range([y + height, y]);
	        var treeScale = (0, _d3Scale.scaleLinear)().domain([0, numLeaves]).range([x, x + width]);
	        var axis1 = 'y';
	        var axis2 = 'x';
	        if (orientation === 'vertical') {
	          axis1 = 'x';
	          axis2 = 'y';
	        }

	        vis.append('clipPath').attr('id', 'clip-' + orientation).append('rect').attr('x', orientation === 'horizontal' ? x : y).attr('y', orientation === 'horizontal' ? y : x).attr('width', orientation === 'horizontal' ? width : height).attr('height', orientation === 'horizontal' ? height : width);

	        var group = vis.append('g').attr('class', orientation).attr('clip-path', 'url(#clip-' + orientation + ')');

	        group.selectAll('.tree-links').data(links).enter().append('path').attr('class', 'tree-links').style('fill-opacity', 0).style('stroke', 'black');

	        var reverseLinks = links.slice().reverse();

	        var line = (0, _d3Shape.line)();
	        if (orientation === 'horizontal') {
	          line.x(function (d) {
	            return d[1];
	          }).y(function (d) {
	            return d[0];
	          });
	        }

	        function update(duration) {
	          links.forEach(function (d) {
	            d.lines = [[distanceScale(distance(linkMap[d.child1])), treeScale(linkMap[d.child1].pos)], [distanceScale(distance(d)), treeScale(linkMap[d.child1].pos)], [distanceScale(distance(d)), treeScale(linkMap[d.child2].pos)], [distanceScale(distance(linkMap[d.child2])), treeScale(linkMap[d.child2].pos)]];
	          });

	          var treeLinks = group.selectAll('.tree-links').data(links);
	          if (duration > 0) {
	            treeLinks = treeLinks.transition().duration(duration);
	          }
	          treeLinks.attr('d', function (d) {
	            return line(d.lines);
	          });

	          var treeSelect = group.selectAll('.tree-select').data(reverseLinks);
	          if (duration > 0) {
	            treeSelect = treeSelect.transition().duration(duration);
	          }
	          treeSelect.attr(axis1, function (d) {
	            return distanceScale(distance(d));
	          }).attr(axis2, function (d) {
	            return treeScale(d.offset);
	          }).attr(axis1 === 'x' ? 'width' : 'height', function (d) {
	            return distanceScale(0) - distanceScale(distance(d));
	          }).attr(axis2 === 'x' ? 'width' : 'height', function (d) {
	            return treeScale(d.offset + d.size) - treeScale(d.offset);
	          });

	          var rect = vis.selectAll('.datum').data(rectData);
	          if (duration > 0) {
	            rect = rect.transition().duration(duration);
	          }
	          rect.attr('x', function (d) {
	            return xScale(d.colIndex);
	          }).attr('y', function (d) {
	            return yScale(d.rowIndex);
	          }).attr('width', function (d) {
	            return xScale(d.colIndex + 1) - xScale(d.colIndex);
	          }).attr('height', function (d) {
	            return yScale(d.rowIndex + 1) - yScale(d.rowIndex);
	          });

	          var rowLabel = rowLabelGroup.selectAll('.row-label').data(rows);
	          if (duration > 0) {
	            rowLabel = rowLabel.transition().duration(duration);
	          }
	          rowLabel.attr('y', function (d) {
	            return yScale(d.pos);
	          });

	          var colLabel = colLabelGroup.selectAll('.col-label').data(columns);
	          if (duration > 0) {
	            colLabel = colLabel.transition().duration(duration);
	          }
	          colLabel.attr('transform', function (d) {
	            return 'translate(' + xScale(d.pos) + ',' + (yStart + rowSize) + ')';
	          });
	        }

	        group.selectAll('.tree-select').data(reverseLinks).enter().append('rect').attr('class', 'tree-select').style('fill', 'steelblue').style('fill-opacity', 0).on('mouseover', function () {
	          (0, _d3Selection.select)(this).style('fill-opacity', 0.4);
	        }).on('mouseout', function () {
	          (0, _d3Selection.select)(this).style('fill-opacity', 0);
	        }).on('click', function (d) {
	          treeScale.domain([d.offset, d.offset + d.size]);
	          distanceScale.domain([0, distance(d.parent.parent)]);
	          (orientation === 'horizontal' ? xScale : yScale).domain([d.offset, d.offset + d.size]);
	          update(duration);
	        });

	        update(0);
	      };

	      var rectData = [];

	      if (clusterRows && rows.length > 1) {
	        tree('vertical', rowLinks, rows, yStart, 0, rowSize, treeHeight, 1000);
	      } else {
	        rows.forEach(function (row) {
	          var i = sortedRows.indexOf(row);
	          row.offset = i;
	          row.pos = i + 0.5;
	        });
	      }
	      if (clusterColumns && columns.length > 1) {
	        tree('horizontal', colLinks, columns, xStart, 0, colSize, treeHeight, 1000);
	      } else {
	        columns.forEach(function (col) {
	          var i = sortedCols.indexOf(col);
	          col.offset = i;
	          col.pos = i + 0.5;
	        });
	      }

	      for (var row = 0; row < content.length; row += 1) {
	        for (var col = 0; col < content[row].length; col += 1) {
	          rectData.push({
	            value: content[row][col],
	            rowIndex: rows[row].offset,
	            colIndex: columns[col].offset
	          });
	        }
	      }

	      var colColor = [];

	      var _loop2 = function _loop2(_col) {
	        colColor[columns[_col].offset] = (0, _d3Scale.scaleLinear)().domain((0, _d3Array.extent)(content, function (d) {
	          return d[_col];
	        })).range(['white', 'steelblue']);
	      };

	      for (var _col = 0; _col < content[0].length; _col += 1) {
	        _loop2(_col);
	      }

	      var rowColor = [];
	      for (var _row = 0; _row < content.length; _row += 1) {
	        rowColor[rows[_row].offset] = (0, _d3Scale.scaleLinear)().domain((0, _d3Array.extent)(content[_row])).range(['white', 'steelblue']);
	      }

	      var globalMin = (0, _d3Array.min)(content, function (d) {
	        return (0, _d3Array.min)(d);
	      });
	      var globalMax = (0, _d3Array.max)(content, function (d) {
	        return (0, _d3Array.max)(d);
	      });
	      var globalColor = (0, _d3Scale.scaleLinear)().domain([globalMin, globalMax]).range(['white', 'steelblue']);

	      var corrColor = (0, _d3Scale.scaleLinear)().domain([-1, 0, 1]).range(['red', 'white', 'green']);

	      var color = function color(d) {
	        return globalColor(d.value);
	      };
	      if (this.scale === 'row') {
	        color = function color(d) {
	          return rowColor[d.rowIndex](d.value);
	        };
	      } else if (this.scale === 'column') {
	        color = function color(d) {
	          return colColor[d.colIndex](d.value);
	        };
	      } else if (this.scale === 'correlation') {
	        color = function color(d) {
	          return corrColor(d.value);
	        };
	      }

	      rectGroup.selectAll('.datum').data(rectData).enter().append('rect').attr('class', 'datum').attr('fill', color).attr('x', function (d) {
	        return xScale(d.colIndex);
	      }).attr('y', function (d) {
	        return yScale(d.rowIndex);
	      }).attr('opacity', this.removeEmpty ? function (d) {
	        return 1;
	      } : opacity).attr('width', function (d) {
	        return xScale(d.colIndex + 1) - xScale(d.colIndex);
	      }).attr('height', function (d) {
	        return yScale(d.rowIndex + 1) - yScale(d.rowIndex);
	      });

	      rowLabelGroup.selectAll('.row-label').data(rows).enter().append('text').attr('class', 'row-label').text(function (d) {
	        return d.name;
	      }).attr('color', 'black').attr('font-size', '10px').attr('alignment-baseline', 'middle').attr('x', xStart + colSize).attr('y', function (d) {
	        return yScale(d.pos);
	      });

	      colLabelGroup.selectAll('.col-label').data(columns).enter().append('g').attr('transform', function (d) {
	        return 'translate(' + xScale(d.pos) + ',' + (yStart + rowSize) + ')';
	      }).attr('class', 'col-label').append('text').text(function (d) {
	        return d.name;
	      }).attr('color', 'black').attr('font-size', '10px').attr('transform', 'rotate(-90)').attr('text-anchor', 'end').attr('alignment-baseline', 'middle');
	    }
	  }]);

	  return TreeHeatmap;
	}(_VisComponent3.default);

	exports.default = TreeHeatmap;

/***/ }),

/***/ 63:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_63__;

/***/ }),

/***/ 64:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_64__;

/***/ }),

/***/ 65:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_65__;

/***/ }),

/***/ 66:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_66__;

/***/ })

/******/ })
});
;