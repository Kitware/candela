import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('ScatterPlot', 'div', {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    shape: 'species',
    width: 620,
    height: 500,
    opacity: 0.9,
    padding: {
      top: 20,
      bottom: 80,
      left: 50,
      right: 130
    },
    renderer: 'svg'
  });
};
