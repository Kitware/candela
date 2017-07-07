import candela from 'candela';
import 'candela/plugins/vega/load';

import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.Heatmap, {
    data: iris,
    fields: [
      'sepalLength',
      'sepalWidth',
      'petalLength',
      'petalWidth',
      'species'
    ],
    sort: 'petalLength',
    width: 700,
    height: 500,
    padding: {
      top: 20,
      bottom: 80,
      left: 80,
      right: 20
    },
    renderer: 'svg'
  });
};
