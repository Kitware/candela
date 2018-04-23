import { LineChart } from '@candela/vega';
import { msft } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(LineChart, {
    data: msft,
    x: 'date',
    xType: 'temporal',
    y: 'price',
    width: 600,
    height: 400,
    showPoints: true,
    renderer: 'svg'
  });

  vis.on('click', (d, item) => console.log(d, item));
};
