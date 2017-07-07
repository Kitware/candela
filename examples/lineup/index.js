import candela from 'candela';
import 'candela/plugins/lineup/load';

import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  const vis = showComponent(candela.components.LineUp, {
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
  vis.render();
};
