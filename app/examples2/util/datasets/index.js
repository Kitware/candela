import dl from 'datalib';
import iris from './iris.json';
import msft_raw from './msft.csv';

const msft = dl.read(msft_raw, {
  type: 'csv',
  parse: 'auto'
});

export {
  iris,
  msft
};
