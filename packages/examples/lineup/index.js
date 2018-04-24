import { LineUp } from '@candela/lineup';
import { iris } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(LineUp, {
    data: iris,
    fields: [
      'species',
      'petalLength',
      'petalWidth',
      'sepalLength',
      'sepalWidth'
    ],
    stacked: true,
    animation: true,
    histograms: true
  });
};
