import { LineChart } from '@candela/vega';
import { stocks } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(LineChart, {
    data: stocks,
    x: 'date',
    xType: 'temporal',
    y: 'price',
    series: 'symbol',
    colorSeries: true,
    width: 600,
    height: 400,
    renderer: 'svg'
  });
};
