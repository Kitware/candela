import candela from 'candela';
import 'candela/plugins/vega/load';

import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.Histogram, {
    data: iris,
    bin: 'sepalLength',
    width: 735,
    height: 540,
    padding: {
      left: 45,
      right: 20,
      top: 20,
      bottom: 40
    },
    renderer: 'svg'
  });
};
