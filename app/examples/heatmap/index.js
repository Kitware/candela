import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';
import Heatmap from '../../../components/Heatmap';

window.onload = () => {
  showComponent(Heatmap, 'div', {
    data: iris,
    fields: [
      'sepalLength',
      'sepalWidth',
      'petalLength',
      'petalWidth',
      'species'
    ],
    sort: 'petalLength',
    width: 700,
    height: 500,
    padding: {
      top: 20,
      bottom: 80,
      left: 80,
      right: 20
    },
    renderer: 'svg'
  });
};
