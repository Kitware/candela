import candela from 'candela';

import * as components from '.';

Object.entries(components).forEach((entry) => candela.register(entry[1], entry[0]));
