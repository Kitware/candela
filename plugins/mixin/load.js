import candela from 'candela';

import * as mixins from '.';

Object.entries(mixins).forEach((entry) => candela.registerMixin(entry[1], entry[0]));
