import candela from 'candela';
import 'candela/plugins/vega/load';

import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.Histogram, {
    data: iris,
    x: 'sepalLength',
    color: 'species',
    width: 650,
    height: 540,
    renderer: 'svg'
  });
};
