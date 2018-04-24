import { LineChart } from '@candela/vega';
import { msft } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  const vis = showComponent(LineChart, {
    data: msft,
    x: 'date',
    xType: 'temporal',
    y: 'price',
    width: 600,
    height: 400,
    showPoints: true,
    renderer: 'svg'
  });
  vis.render();
};
