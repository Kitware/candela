import VisComponent from '../../VisComponent';
import * as d3 from 'd3';
import { getElementSize } from '../../util';

export default class TreeHeatmap extends VisComponent {
  static get options () {
    return [
      {
        id: 'data',
        name: 'Data table',
        description: 'The data table.',
        type: 'table',
        format: 'objectlist'
      },
      {
        id: 'idColumn',
        name: 'Identifier column',
        description: 'A column with unique identifiers. If not set, the ' +
          'visualization will use a column with an empty name, or a column ' +
          'named "_" or "_id".',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'scale',
        name: 'Color scale',
        description: 'Color the data values with a global scale, ' +
          'scale each row or column separately, or use a -1 to 1 ' +
          'color scale suitable for a correlation matrix.',
        type: 'string',
        format: 'text',
        domain: ['global', 'row', 'column', 'correlation'],
        default: 'global'
      },
      {
        id: 'clusterRows',
        name: 'Cluster rows',
        description: 'Order the rows by hierarchical cluster linkage.',
        type: 'boolean',
        format: 'boolean',
        default: true
      },
      {
        id: 'clusterColumns',
        name: 'Cluster columns',
        description: 'Order the columns by hierarchical cluster linkage.',
        type: 'boolean',
        format: 'boolean',
        default: true
      },
      {
        id: 'thresholdMode',
        name: 'Threshold mode',
        description: 'Use the threshold value to display only certain cells.',
        type: 'string',
        format: 'text',
        domain: ['none', 'greater than', 'less than', 'absolute value greater than'],
        default: 'none'
      },
      {
        id: 'threshold',
        name: 'Threshold value',
        description: 'The value to threshold by.',
        type: 'number',
        format: 'number',
        default: 0
      },
      {
        id: 'removeEmpty',
        name: 'Remove empty rows and columns',
        description: 'Remove rows and columns that are entirely filtered out ' +
          'by the threshold. Clustering by rows and columns will not be used.',
        type: 'boolean',
        format: 'boolean',
        default: false
      }
    ];
  }

  constructor (el, options) {
    super(el);
    options = options || {};
    this.data = options.data;
    this.scale = options.scale || 'global';
    this.clusterRows = options.clusterRows === undefined ? true : options.clusterRows;
    this.clusterColumns = options.clusterColumns === undefined ? true : options.clusterColumns;
    this.idColumn = options.idColumn;
    this.thresholdMode = options.thresholdMode || 'none';
    this.threshold = options.threshold || 0;
    this.removeEmpty = options.removeEmpty === undefined ? false : options.removeEmpty;
    this.width = options.width;
    this.height = options.height;
  }

  render () {
    d3.select(this.el).selectAll('*').remove();

    if (this.data === undefined || this.data.length === 0) {
      return;
    }

    let size = getElementSize(this.el);
    let width = this.width || size.width || 400;
    let height = this.height || size.height || 400;
    let treeHeight = 100;
    let labelHeight = 100;
    let clusterRows = this.clusterRows;
    let clusterColumns = this.clusterColumns;

    // removeEmpty setting disables clusterings
    if (this.removeEmpty) {
      clusterRows = false;
      clusterColumns = false;
    }
    let xStart = clusterRows ? treeHeight : 0;
    let yStart = clusterColumns ? treeHeight : 0;
    let colSize = width - xStart - labelHeight;
    let rowSize = height - yStart - labelHeight;

    let keys = Object.keys(this.data[0]);
    let idColumn = this.idColumn;
    if (idColumn === undefined) {
      idColumn = keys.includes('_id') ? '_id' : idColumn;
      idColumn = keys.includes('_') ? '_' : idColumn;
      idColumn = keys.includes('') ? '' : idColumn;
    }
    if (idColumn === undefined) {
      console.log('TreeHeatmap: No suitable idColumn found.');
      return;
    }

    let rows = [];
    let reachedMetadata = false;
    this.data.forEach(row => {
      let id = '' + row[idColumn];
      if (id === '_child1') {
        reachedMetadata = true;
      }
      if (!id.startsWith('_') && !reachedMetadata) {
        rows.push({name: id});
      }
    });

    let columns = null;
    columns = [];
    keys.forEach(k => {
      if (k !== '' && !k.startsWith('_')) {
        columns.push({name: k});
      }
    });

    let content = [];
    let rowLinks = [];
    let metadataRows = {};
    let originalDataRows = {};
    reachedMetadata = false;
    this.data.forEach(row => {
      let id = '' + row[idColumn];
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
      content.push(columns.map(col => +row[col.name]));
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

    let colLinks = [];
    if (clusterColumns) {
      columns.forEach(col => {
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

    let opacity = () => 1;
    if (this.thresholdMode === 'less than') {
      opacity = d => d.value < this.threshold ? 1 : 0;
    } else if (this.thresholdMode === 'greater than') {
      opacity = d => d.value > this.threshold ? 1 : 0;
    } else if (this.thresholdMode === 'absolute value greater than') {
      opacity = d => Math.abs(d.value) > this.threshold ? 1 : 0;
    }

    // Use opacity function to filter rows and columns
    if (this.removeEmpty) {
      for (let r = 0; r < rows.length; r += 1) {
        for (let c = 0; c < columns.length; c += 1) {
          if (rows[r].name !== columns[c].name && opacity({value: content[r][c]})) {
            rows[r].visible = true;
            columns[c].visible = true;
          }
        }
      }
      for (let r = rows.length - 1; r >= 0; r -= 1) {
        if (!rows[r].visible) {
          rows.splice(r, 1);
          content.splice(r, 1);
        }
      }
      for (let c = columns.length - 1; c >= 0; c -= 1) {
        if (!columns[c].visible) {
          columns.splice(c, 1);
          content.forEach(row => row.splice(c, 1));
        }
      }
    }

    let sortedRows = rows.slice().sort((a, b) => a.name.localeCompare(b.name));
    let sortedCols = columns.slice().sort((a, b) => a.name.localeCompare(b.name));

    let vis = d3.select(this.el).append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px');

    vis.append('clipPath').attr('id', 'clip-rect')
      .append('rect')
      .attr('x', xStart)
      .attr('y', yStart)
      .attr('width', colSize)
      .attr('height', rowSize);

    let rectGroup = vis.append('g').attr('clip-path', 'url(#clip-rect)');

    vis.append('clipPath').attr('id', 'clip-row-labels')
      .append('rect')
      .attr('x', xStart + colSize)
      .attr('y', yStart)
      .attr('width', labelHeight)
      .attr('height', rowSize);

    let rowLabelGroup = vis.append('g').attr('clip-path', 'url(#clip-row-labels)');

    vis.append('clipPath').attr('id', 'clip-col-labels')
      .append('rect')
      .attr('x', xStart)
      .attr('y', yStart + rowSize)
      .attr('width', colSize)
      .attr('height', labelHeight);

    let colLabelGroup = vis.append('g').attr('clip-path', 'url(#clip-col-labels)');

    let distance = d => d.distance;

    let xScale = d3.scaleLinear().domain([0, content[0].length]).range([xStart, xStart + colSize]);
    let yScale = d3.scaleLinear().domain([0, content.length]).range([yStart, yStart + rowSize]);

    let tree = function (orientation, links, leaves, x, y, width, height, duration) {
      let numLeaves = leaves.length;
      let linkMap = {};
      for (let leaf = 0; leaf < numLeaves; leaf += 1) {
        leaves[leaf].size = 1;
        leaves[leaf].distance = 0;
        linkMap[leaf] = leaves[leaf];
      }
      for (let link = 0; link < links.length; link += 1) {
        linkMap[links[link].cluster] = links[link];
      }
      let finalCluster = links[links.length - 1] || {};
      finalCluster.offset = 0;
      finalCluster.parent = finalCluster;
      for (let link = links.length - 1; link >= 0; link -= 1) {
        let linkObject = links[link];
        let child1 = linkMap[linkObject.child1];
        let child2 = linkMap[linkObject.child2];
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
      let distanceExtent = [0, distance(finalCluster)];
      let distanceScale = d3.scaleLinear().domain(distanceExtent).range([y + height, y]);
      let treeScale = d3.scaleLinear().domain([0, numLeaves]).range([x, x + width]);
      let axis1 = 'y';
      let axis2 = 'x';
      if (orientation === 'vertical') {
        axis1 = 'x';
        axis2 = 'y';
      }

      vis.append('clipPath').attr('id', 'clip-' + orientation)
        .append('rect')
        .attr('x', orientation === 'horizontal' ? x : y)
        .attr('y', orientation === 'horizontal' ? y : x)
        .attr('width', orientation === 'horizontal' ? width : height)
        .attr('height', orientation === 'horizontal' ? height : width);

      let group = vis.append('g')
        .attr('class', orientation)
        .attr('clip-path', 'url(#clip-' + orientation + ')');

      group.selectAll('.tree-links').data(links)
        .enter()
        .append('path')
        .attr('class', 'tree-links')
        .style('fill-opacity', 0)
        .style('stroke', 'black');

      let reverseLinks = links.slice().reverse();

      let line = d3.line();
      if (orientation === 'horizontal') {
        line.x(d => d[1]).y(d => d[0]);
      }

      function update (duration) {
        links.forEach(d => {
          d.lines = [
            [distanceScale(distance(linkMap[d.child1])), treeScale(linkMap[d.child1].pos)],
            [distanceScale(distance(d)), treeScale(linkMap[d.child1].pos)],
            [distanceScale(distance(d)), treeScale(linkMap[d.child2].pos)],
            [distanceScale(distance(linkMap[d.child2])), treeScale(linkMap[d.child2].pos)]
          ];
        });

        group.selectAll('.tree-links')
          .data(links)
          // .transition().duration(duration)
          .attr('d', d => line(d.lines));

        group.selectAll('.tree-select')
          .data(reverseLinks)
          // .transition().duration(duration)
          .attr(axis1, d => distanceScale(distance(d)))
          .attr(axis2, d => treeScale(d.offset))
          .attr(axis1 === 'x' ? 'width' : 'height', d => distanceScale(0) - distanceScale(distance(d)))
          .attr(axis2 === 'x' ? 'width' : 'height', d => treeScale(d.offset + d.size) - treeScale(d.offset));

        vis.selectAll('.datum')
          .data(rectData)
          // .transition().duration(duration)
          .attr('x', d => xScale(d.colIndex))
          .attr('y', d => yScale(d.rowIndex))
          .attr('width', d => xScale(d.colIndex + 1) - xScale(d.colIndex))
          .attr('height', d => yScale(d.rowIndex + 1) - yScale(d.rowIndex));

        rowLabelGroup.selectAll('.row-label')
          .data(rows)
          // .transition().duration(duration)
          .attr('y', d => yScale(d.pos));

        colLabelGroup.selectAll('.col-label')
          .data(columns)
          // .transition().duration(duration)
          .attr('transform', d => 'translate(' + xScale(d.pos) + ',' + (yStart + rowSize) + ')');
      }

      group.selectAll('.tree-select').data(reverseLinks).enter()
        .append('rect')
        .attr('class', 'tree-select')
        .style('fill', 'steelblue')
        .style('fill-opacity', 0)
        .on('mouseover', function () { d3.select(this).style('fill-opacity', 0.4); })
        .on('mouseout', function () { d3.select(this).style('fill-opacity', 0); })
        .on('click', d => {
          treeScale.domain([d.offset, d.offset + d.size]);
          distanceScale.domain([0, distance(d.parent.parent)]);
          (orientation === 'horizontal' ? xScale : yScale).domain([d.offset, d.offset + d.size]);
          update(duration);
        });

      update(0);
    };

    let rectData = [];

    if (clusterRows && rows.length > 1) {
      tree('vertical', rowLinks, rows, yStart, 0, rowSize, treeHeight, 1000);
    } else {
      rows.forEach((row) => {
        let i = sortedRows.indexOf(row);
        row.offset = i;
        row.pos = i + 0.5;
      });
    }
    if (clusterColumns && columns.length > 1) {
      tree('horizontal', colLinks, columns, xStart, 0, colSize, treeHeight, 1000);
    } else {
      columns.forEach((col) => {
        let i = sortedCols.indexOf(col);
        col.offset = i;
        col.pos = i + 0.5;
      });
    }

    for (let row = 0; row < content.length; row += 1) {
      for (let col = 0; col < content[row].length; col += 1) {
        rectData.push({
          value: content[row][col],
          rowIndex: rows[row].offset,
          colIndex: columns[col].offset
        });
      }
    }

    let colColor = [];
    for (let col = 0; col < content[0].length; col += 1) {
      colColor[columns[col].offset] = d3.scaleLinear().domain(d3.extent(content, d => d[col])).range(['white', 'steelblue']);
    }

    let rowColor = [];
    for (let row = 0; row < content.length; row += 1) {
      rowColor[rows[row].offset] = d3.scaleLinear().domain(d3.extent(content[row])).range(['white', 'steelblue']);
    }

    let globalMin = d3.min(content, d => d3.min(d));
    let globalMax = d3.max(content, d => d3.max(d));
    let globalColor = d3.scaleLinear().domain([globalMin, globalMax]).range(['white', 'steelblue']);

    let corrColor = d3.scaleLinear().domain([-1, 0, 1]).range(['red', 'white', 'green']);

    let color = d => globalColor(d.value);
    if (this.scale === 'row') {
      color = d => rowColor[d.rowIndex](d.value);
    } else if (this.scale === 'column') {
      color = d => colColor[d.colIndex](d.value);
    } else if (this.scale === 'correlation') {
      color = d => corrColor(d.value);
    }

    rectGroup.selectAll('.datum')
      .data(rectData)
      .enter()
      .append('rect')
      .attr('class', 'datum')
      .attr('fill', color)
      .attr('x', d => xScale(d.colIndex))
      .attr('y', d => yScale(d.rowIndex))
      .attr('opacity', this.removeEmpty ? d => 1 : opacity)
      .attr('width', d => xScale(d.colIndex + 1) - xScale(d.colIndex))
      .attr('height', d => yScale(d.rowIndex + 1) - yScale(d.rowIndex));

    rowLabelGroup.selectAll('.row-label')
      .data(rows)
      .enter()
      .append('text')
      .attr('class', 'row-label')
      .text(d => d.name)
      .attr('color', 'black')
      .attr('font-size', '10px')
      .attr('alignment-baseline', 'middle')
      .attr('x', xStart + colSize)
      .attr('y', d => yScale(d.pos));

    colLabelGroup.selectAll('.col-label')
      .data(columns)
      .enter()
      .append('g')
      .attr('transform', d => 'translate(' + xScale(d.pos) + ',' + (yStart + rowSize) + ')')
      .attr('class', 'col-label')
      .append('text')
      .text(d => d.name)
      .attr('color', 'black')
      .attr('font-size', '10px')
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'end')
      .attr('alignment-baseline', 'middle');
  }
}
