import 'javascript-detect-element-resize/detect-element-resize';
import { Events } from '@candela/events';
import { getElementSize } from '../../vega/src/util';

let Resize = Base => class extends Events(Base) {
  constructor (...args) {
    super(...args);

    window.addResizeListener(this.el, () => {
      const size = getElementSize(this.el);
      this.emit('resize', size.width, size.height, this);
    });
  }
};

export default Resize;
