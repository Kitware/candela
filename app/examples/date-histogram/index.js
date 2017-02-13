import { stocks } from '../util/datasets';
import showComponent from '../util/showComponent';
import Histogram from '../../../components/Histogram';

window.onload = () => {
  showComponent(Histogram, 'div', {
    data: stocks,
    bin: 'date'
  });
};
