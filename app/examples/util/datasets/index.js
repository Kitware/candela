import dl from 'datalib';
import iris from './iris.json';
import msft_raw from './msft.csv';
import simpsons_raw from './simpsons.csv';
import simpsons_alternate_raw from './simpsons-alternate.csv';
import stocks_raw from './stocks.csv';

function readCSV (raw) {
  return dl.read(raw, {
    type: 'csv',
    parse: 'auto'
  });
}

const msft = readCSV(msft_raw);
const simpsons = readCSV(simpsons_raw);
const simpsons_alternate = readCSV(simpsons_alternate_raw);
const stocks = readCSV(stocks_raw);

export {
  iris,
  msft,
  simpsons,
  simpsons_alternate,
  stocks
};
