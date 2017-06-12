import candela from 'candela';
import 'candela/dist/vega.min.js';

import { stocks } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.Histogram, {
    data: stocks,
    bin: 'date'
  });
};
