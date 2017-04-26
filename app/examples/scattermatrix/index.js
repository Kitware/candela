import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';
import ScatterPlotMatrix from '../../../components/ScatterPlotMatrix';

window.onload = () => {
  showComponent(ScatterPlotMatrix, {
    data: iris,
    fields: [
      'petalWidth',
      'petalLength',
      'sepalLength',
      'sepalWidth'
    ],
    color: 'species',
    width: 620,
    height: 550,
    padding: {'left': 55, 'right': 125, 'top': 30, 'bottom': 20},
    renderer: 'svg'
  });
};
