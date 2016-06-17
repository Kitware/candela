import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';

import '../../examples/index.styl';

window.onload = () => {
  showComponent('LineUp', 'div', {
    data: iris,
    fields: [
      'species',
      'petalLength',
      'petalWidth',
      'sepalLength',
      'sepalWidth'
    ],
    stacked: true,
    animation: true,
    histograms: true
  });
};
