import { iris } from '../util/datasets';
import showComponent from '../util/showComponent';
import Histogram from '../../../components/Histogram';

window.onload = () => {
  showComponent(Histogram, {
    data: iris,
    bin: 'sepalLength',
    width: 735,
    height: 540,
    padding: {
      left: 45,
      right: 20,
      top: 20,
      bottom: 40
    },
    renderer: 'svg'
  });
};
