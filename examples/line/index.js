import candela from 'candela';
import 'candela/dist/vega.min.js';

import { msft } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.LineChart, {
    data: msft,
    x: 'date',
    y: ['price'],
    width: 735,
    height: 535,
    hoverSize: 50,
    padding: {
      top: 20,
      bottom: 45,
      left: 45,
      right: 20
    },
    renderer: 'svg'
  });
};
