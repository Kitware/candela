import { ScatterPlot } from '@candela/vega';
import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(ScatterPlot, {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    colorType: 'quantitative',
    shape: 'species',
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
