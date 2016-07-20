import { hmohiv } from '../util/datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('SurvivalPlot', 'div', {
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
    renderer: 'svg'
  });
};
