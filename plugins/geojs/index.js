import candela from 'candela';

import Geo from './Geo';
import GeoDots from './GeoDots';

const components = {
  Geo,
  GeoDots
};

Object.entries(components).forEach((entry) => candela.register(entry[1], entry[0]));
