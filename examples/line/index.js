import candela from 'candela';
import 'candela/plugins/vega/load';

import { stocks } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.LineChart, {
    data: stocks,
    x: 'date',
    xType: 'temporal',
    y: 'price',
    series: 'symbol',
    colorSeries: true,
    width: 735,
    height: 535,
    renderer: 'svg'
  });
};
