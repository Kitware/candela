import { BarChart } from '@candela/vega';

console.log('BarChart', BarChart);

import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(BarChart, {
    data: [
      {id: 0, a: 1, b: 3, c: 3},
      {id: 1, a: 10, b: 4, c: 3},
      {id: 2, a: 7, b: 6, c: 3},
      {id: 3, a: 4, b: 2, c: 3},
      {id: 4, a: 5, b: 5, c: 3},
      {id: 5, a: 7, b: 6, c: 3},
      {id: 6, a: 2, b: 9, c: 3},
      {id: 7, a: 5, b: 7, c: 3}
    ],
    x: 'id',
    y: 'a',
    color: 'b',
    width: 625,
    height: 540,
    renderer: 'svg'
  });
};
