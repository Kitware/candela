import { BoxPlot } from '@candela/vega';
import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(BoxPlot, {
    data: iris,
    fields: [
      'sepalLength',
      'sepalWidth'
    ],
    x: 'species',
    width: 400,
    height: 450,
    renderer: 'svg'
  });
};
