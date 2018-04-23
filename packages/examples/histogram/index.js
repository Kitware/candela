import { Histogram } from '@candela/vega';
import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(Histogram, {
    data: iris,
    x: 'sepalLength',
    color: 'species',
    width: 650,
    height: 540,
    renderer: 'svg'
  });
};
