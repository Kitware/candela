import dl from 'datalib';
import msft_raw from '../../examples/data/msft.csv';
import showComponent from '../util/showComponent';

import '../../examples/index.styl';

const msft = dl.read(msft_raw, {
  type: 'csv',
  parse: 'auto'
});

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
