import { stocks } from '../util/datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('Histogram', 'div', {
    data: stocks,
    bin: 'date'
  });
};
