import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('BoxPlot', 'div', {
    data: iris,
    fields: [
      'sepalLength',
      'sepalWidth'
    ],
    group: 'species',
    boxSize: 0.5,
    capSize: 0.25,
    width: 750,
    height: 450,
    padding: {
      left: 30,
      right: 20,
      top: 20,
      bottom: 130
    },
    renderer: 'svg'
  });
};
