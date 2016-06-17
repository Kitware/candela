import { stocks } from '../util/datasets';
import showComponent from '../util/showComponent';

import '../../examples/index.styl';

window.onload = () => {
  showComponent('Histogram', 'div', {
    data: stocks,
    bin: 'date'
  });
};
