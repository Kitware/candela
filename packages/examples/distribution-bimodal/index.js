import { DistributionPlot } from '@candela/stats';
import showComponent from '../util/showComponent';
import { gaussian } from '../datasets';

window.onload = () => {
  showComponent(DistributionPlot, {
    data: gaussian.map(x => x.bimodal),
    xAxis: {
      tickCount: 11
    },
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
