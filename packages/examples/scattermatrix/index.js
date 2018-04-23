import { ScatterPlotMatrix } from '@candela/vega';
import showComponent from '../util/showComponent';
import { iris } from '../datasets';

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
    width: 500,
    height: 500,
    renderer: 'svg'
  });
};
