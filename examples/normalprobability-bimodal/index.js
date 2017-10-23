import candela from 'candela';
import 'candela/plugins/stats/load';

import showComponent from '../util/showComponent';
import { gaussian } from '../datasets';

window.onload = () => {
  showComponent(candela.components.NormalProbabilityPlot, {
    data: gaussian.map(x => x.bimodal),
    xAxis: {
      tickCount: 12
    },
    yAxis: {
      tickCount: 9
    },
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
