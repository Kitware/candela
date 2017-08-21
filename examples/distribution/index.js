import candela from 'candela';
import 'candela/plugins/stats/load';

import showComponent from '../util/showComponent';
import { iris } from '../datasets';

window.onload = () => {
  showComponent(candela.components.DistributionPlot, {
    data: iris.map(x => x.sepalLength),
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
