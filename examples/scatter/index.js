import candela from 'candela';
import 'candela-scatterplot';

import { iris } from '../datasets';

window.onload = () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const vis = new candela.components.ScatterPlot(div, {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    shape: 'species',
    width: 620,
    height: 500,
    padding: {
      top: 20,
      bottom: 80,
      left: 50,
      right: 130
    },
    renderer: 'svg'
  });
};
