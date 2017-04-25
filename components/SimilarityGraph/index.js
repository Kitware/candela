import VisComponent from '../../VisComponent';

import d3 from 'd3';
import cola from 'webcola';

export default class SimilarityGraph extends VisComponent {
  constructor (el, {data, threshold = 0, linkDistance = 100, id = 'id', color, size = 10, width = 960, height = 540}) {
    super(el);
    this.data = data;

    // Empty the top-level div.
    d3.select(this.el)
      .selectAll('*').remove();

    // Construct an SVG element inside the top-level div.
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', height);
    this.el.appendChild(this.svg);

    // Construct a function that returns the needed size - either a constant
    // supplied in the `size` parameter, or a lookup function that pulls it from
    // the data table.
    const sizeFunc = d => typeof size === 'string' ? d[size] : size;

    // Construct lookup function for the color field.
    const colormap = d3.scale.category10();
    const colorFunc = color ? d => colormap(d[color]) : () => 'rgb(31, 119, 180)';

    // Get the width and height of the SVG element. This is necessary here in
    // case non-pixel measures like '100%' were passed to the component.
    const bbox = this.svg.getBBox();
    const w = bbox.width;
    const h = bbox.height;

    // Initialize the cola object.
    this.cola = cola.d3adaptor()
      .linkDistance(linkDistance)
      .size([w, h]);

    // Compute the graph.
    //
    // Create a list of nodes.
    const nodes = this.nodes = this.data.map(d => ({
      id: d[id],
      color: colorFunc(d),
      width: 2 * sizeFunc(d),
      height: 2 * sizeFunc(d),
      size: sizeFunc(d)
    }));

    // Construct an index map into the nodes list.
    let idxmap = {};
    nodes.forEach((node, i) => idxmap[node.id] = i);

    // Create a list of links by using a nested forEach to cull out the links
    // that don't have enough strength.
    this.links = [];
    this.data.forEach(a => this.data.forEach(b => {
      if (a[id] !== b[id] && a[b[id]] >= threshold) {
        this.links.push({
          source: idxmap[a[id]],
          target: idxmap[b[id]]
        });
      }
    }));

    // Create a D3 selection for the links, and initialize it with some line
    // elements.
    this.linkSelection = d3.select(this.svg)
      .selectAll('line.link')
      .data(this.links);

    this.linkSelection.enter()
      .append('line')
      .classed('link', true)
      .attr('stroke-width', 1)
      .attr('stroke', 'gray');

    // Create a D3 selection for the nodes, and initialize it with some circle
    // elements.
    this.nodeSelection = d3.select(this.svg)
      .selectAll('circle.node')
      .data(this.nodes);

    this.nodeSelection.enter()
      .append('circle')
      .classed('node', true)
      .attr('r', d => d.size)
      .style('stroke', 'black')
      .style('fill', d => d.color)
      .style('cursor', 'crosshair')
      .call(this.cola.drag);

    // Create a D3 selection for node labels.
    this.labelSelection = d3.select(this.svg)
      .selectAll('text.label')
      .data(this.nodes);

    const that = this;
    this.labelSelection.enter()
      .append('text')
      .classed('label', true)
      .text(d => d.id)
      .each(function (d, i) {
        const bbox = this.getBBox();
        that.nodes[i].height += bbox.height;
      })
      .style('cursor', 'crosshair')
      .call(this.cola.drag);

    this.cola.on('tick', (...args) => {
      this.nodeSelection
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      this.labelSelection
        .attr('x', function (d) {
          const bbox = this.getBBox();
          return d.x - 0.5 * bbox.width;
        })
        .attr('y', function (d) {
          const bbox = this.getBBox();
          return d.y + bbox.height + 0.5 * d.size;
        });

      this.linkSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
    });

    this.cola.avoidOverlaps(true)
      .nodes(this.nodes)
      .links(this.links)
      .start(10, 15, 20);
  }

  render () {}

  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'id',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'integer', 'number']
        }
      },
      {
        name: 'color',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        name: 'size',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number', 'integer']
        }
      },
      {
        name: 'size',
        type: 'number',
        format: 'number',
        default: 10
      },
      {
        name: 'threshold',
        type: 'number',
        format: 'number',
        default: 0
      }
    ];
  }
}
