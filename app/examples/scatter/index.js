import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';
import ScatterPlot from '../../../components/ScatterPlot';

window.onload = () => {
  showComponent(ScatterPlot, {
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
