import { select } from 'd3-selection';
import 'd3-transition';

export const Tooltip = Base => class extends Base {
  constructor () {
    super(...arguments);

    this._tooltip = {};
  }

  initTooltip (options = {}) {
    this._tooltip.tooltip = select(this.el)
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
  }

  tooltip () {
    return this._tooltip.tooltip;
  }

  showTT () {
    this.tooltip()
      .style('opacity', 1);
  }

  hideTT () {
    this.tooltip()
      .style('opacity', 0);
  }
};
