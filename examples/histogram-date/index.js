import candela from 'candela';
import 'candela-vega';

import { stocks } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.Histogram, {
    data: stocks,
    bin: 'date'
  });
};
