import { NormalProbabilityPlot } from '@candela/stats';
import showComponent from '../util/showComponent';
import { gaussian } from '../datasets';

window.onload = () => {
  showComponent(NormalProbabilityPlot, {
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
