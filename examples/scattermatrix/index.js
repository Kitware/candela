import candela from 'candela';
import 'candela-scatterplotmatrix';

import { iris } from '../datasets';

window.onload = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const vis = new candela.components.ScatterPlotMatrix(div, {
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
