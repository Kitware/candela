import { getElementSize } from '../../vega/src/util';

let InitSize = Base => class extends Base {
  constructor (...args) {
    super(...args);

    const size = getElementSize(this.el);
    this.width = size.width;
    this.height = size.height;
  }
};

export default InitSize;
