import { msft } from '../util/datasets';
import showComponent from '../util/showComponent';

import '../../examples/index.styl';

window.onload = () => {
  showComponent('LineChart', 'div', {
    data: msft,
    x: 'date',
    y: ['price'],
    width: 735,
    height: 535,
    padding: {
      top: 20,
      bottom: 45,
      left: 45,
      right: 20
    },
    renderer: 'svg'
  });
};
