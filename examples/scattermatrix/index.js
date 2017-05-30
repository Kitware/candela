import candela from 'candela';
import 'candela-vega';

import showComponent from '../util/showComponent';
import { iris } from '../datasets';

window.onload = () => {
  showComponent(candela.components.ScatterPlotMatrix, {
    data: iris,
    fields: [
      'petalWidth',
      'petalLength',
      'sepalLength',
      'sepalWidth'
    ],
    color: 'species',
    width: 620,
    height: 550,
    padding: {'left': 55, 'right': 125, 'top': 30, 'bottom': 20},
    renderer: 'svg'
  });
};
