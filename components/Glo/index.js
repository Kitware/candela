import 'glo/js/namespace';
import 'glo/js/coordinates.js';
import 'glo/js/node_group.js';
import 'glo/js/canvas.js';
import 'glo/js/node_generation.js';
import 'glo/js/edge_generation.js';
import 'glo/js/helpers.js';
import 'glo/js/glo.js';
import 'glo/js/api.js';
import 'glo/js/techniques.js';
import 'glo/js/figures.js';

import * as d3 from 'd3';

import VisComponent from '../../VisComponent';

export default class Glo extends VisComponent {
  constructor (el, {nodes, edges, width = 960, height = 540}) {
    super(el);

    // Empty the top-level div.
    d3.select(this.el)
      .selectAll('*')
      .remove();

    // Construct and append an SVG element to the top-level div.
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', height);
    this.el.appendChild(this.svg);

    // Construct a GLO object.
    this.glo = new GLO.GLO(d3.select(this.svg))
      .nodes(nodes)
      .edges(edges)
      .draw();

    console.log('Glo.constructor()');
    console.log('this.glo', this.glo);
  }

  render () {
    console.log('Glo.render()');
    console.log('GLO object', GLO);
  }
}
