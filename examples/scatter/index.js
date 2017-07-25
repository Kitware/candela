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
    colorType: 'quantitative',
    shape: 'species',
    filled: false,
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
