import { ScatterPlot } from '@candela/vega';
import showComponent from '../util/showComponent';
import { iris } from '../datasets';

window.onload = () => {
  showComponent(ScatterPlot, {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    colorType: 'quantitative',
    shape: 'species',
    filled: false,
    width: 620,
    height: 500,
    renderer: 'svg'
  });
};
