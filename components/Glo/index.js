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

import VisComponent from '../../VisComponent';

export default class Glo extends VisComponent {
  constructor (el, options) {
    super(el);

    console.log('Glo.constructor()');
  }

  render () {
    const GLO = window.GLO;

    console.log('Glo.render()');
    console.log('GLO object', GLO);
  }
}
