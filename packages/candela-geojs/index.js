import candela from 'candela';

import Geo from './Geo';
import GeoDots from './GeoDots';

const components = [
  Geo,
  GeoDots
];

components.forEach(entry => candela.register(entry));
