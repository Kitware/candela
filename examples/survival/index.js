import candela from 'candela';
import 'candela/plugins/vega/load';

import { hmohiv } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.SurvivalPlot, {
    data: hmohiv,
    time: 'time',
    censor: 'censor',
    group: 'drug',
    width: 625,
    height: 540,
    padding: {
      left: 45,
      right: 130,
      top: 20,
      bottom: 40
    },
    xAxis: {
      title: 'days'
    },
    legend: true,
    legendTitle: 'Drug',
    renderer: 'svg'
  });
};
