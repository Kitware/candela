import iris from '../../examples/data/iris.json';
import showComponent from '../util/showComponent';

import '../../examples/index.styl';

window.onload = () => {
  showComponent('ScatterPlot', 'div', {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    shape: 'species',
    width: 620,
    height: 500,
    padding: {
      top: 20,
      bottom: 80,
      left: 50,
      right: 130
    },
    renderer: 'svg'
  });
};
