import candela from 'candela';
import 'candela/plugins/stats/load';

import showComponent from '../util/showComponent';
import { gaussian } from '../datasets';

window.onload = () => {
  showComponent(candela.components.NormalProbabilityPlot, {
    data: gaussian.map(x => x.normal),
    xAxis: {
      tickCount: 11
    },
    yAxis: {
      tickCount: 10
    },
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
