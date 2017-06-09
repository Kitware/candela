import candela from 'candela';

import AutoResize from './AutoResize';
import Events from './Events';
import InitSize from './InitSize';
import Resize from './Resize';
import VegaChart from './VegaChart';

const mixins = [
  AutoResize,
  Events,
  InitSize,
  Resize,
  VegaChart
];

mixins.forEach(mixin => candela.registerMixin(mixin));
