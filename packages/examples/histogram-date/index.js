import { Histogram } from '@candela/vega';
import { stocks } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(Histogram, {
    data: stocks,
    x: 'date',
    xType: 'temporal',
    width: 500,
    height: 400
  });
};
