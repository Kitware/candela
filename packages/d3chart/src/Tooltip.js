import { select } from 'd3-selection';
import 'd3-transition';

class TooltipImpl {
  constructor (that) {
    this.that = that;
    this.tooltip = null;
  }

  init (options = {}) {
    this.tooltip = select(this.that.el)
      .append('div')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('text-align', options.textAlign || 'center')
      .style('width', options.width || '80px')
      .style('height', options.height || '30px')
      .style('padding', '2px')
      .style('font', options.font || '12px sans-serif')
      .style('background', options.background || 'lightgreen')
      .style('border', '0px')
      .style('border-radius', '8px')
      .style('pointer-events', 'none');

    return this.that;
  }

  show () {
    this.tooltip.style('opacity', 1);
    return this;
  }

  hide () {
    this.tooltip.style('opacity', 0);
    return this;
  }

  setX (x) {
    this.tooltip.style('left', `${x}px`);
    return this;
  }

  setY (y) {
    this.tooltip.style('top', `${y}px`);
    return this;
  }

  setPosition (x, y) {
    this.setX(x)
      .setY(y);

    return this;
  }
}

export const Tooltip = Base => class extends Base {
  constructor () {
    super(...arguments);
    if (!this.tooltip) {
      this.tooltip = new TooltipImpl(this);
    }
  }
};
