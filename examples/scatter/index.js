import candela from 'candela';
import 'candela/plugins/vega/load';

import showComponent from '../util/showComponent';
import { iris } from '../datasets';

window.onload = () => {
  showComponent(candela.components.ScatterPlot, {
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
