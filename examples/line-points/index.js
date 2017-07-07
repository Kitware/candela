import candela from 'candela';
import 'candela/plugins/vega/load';

import { msft } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  let vis = showComponent(candela.components.LineChart, {
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
    showPoints: true,
    pointSize: 25,
    renderer: 'svg'
  });

  vis.on('click', (d, item) => console.log(d, item));
};
