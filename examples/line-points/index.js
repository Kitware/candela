import candela from 'candela';
import 'candela/plugins/vega/load';

import { msft } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  let vis = showComponent(candela.components.LineChart, {
    data: msft,
    x: 'date',
    xType: 'temporal',
    y: 'price',
    width: 600,
    height: 400,
    showPoints: true,
    renderer: 'svg'
  });

  vis.on('click', (d, item) => console.log(d, item));
};
