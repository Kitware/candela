import candela from 'candela';
import 'candela/plugins/vega/load';

import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.BoxPlot, {
    data: iris,
    fields: [
      'sepalLength',
      'sepalWidth'
    ],
    x: 'species',
    width: 400,
    height: 450,
    renderer: 'svg'
  });
};
