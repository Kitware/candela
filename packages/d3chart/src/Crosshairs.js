import { Margin } from './Margin';

class CrosshairsImpl {
  constructor (that) {
    this.that = that;

    this.target = null;
    this.crosshairX = null;
    this.crosshairY = null;
  }

  init () {
    const that = this.that;

    const plotBounds = that.margin.bounds('plot');
    this.target = that.plot.append('rect', ':first-child')
      .classed('crosshairs-target', true)
      .attr('width', plotBounds.width)
      .attr('height', plotBounds.height)
      .style('opacity', 0.0);

    const g = that.plot.append('g')
      .classed('crosshairs', true)
      .style('pointer-events', 'none');

    this.crosshairX = g.append('line')
      .classed('crosshair-x', true)
      .style('opacity', 0)
      .style('stroke', 'lightgray')
      .attr('x1', 0)
      .attr('x2', plotBounds.width);

    this.crosshairY = g.append('line')
      .classed('crosshair-y', true)
      .style('opacity', 0)
      .style('stroke', 'lightgray')
      .attr('y1', 0)
      .attr('y2', plotBounds.height);

    this.target.on('mouseover.crosshairs', () => {
      this.show();
    }).on('mousemove.crosshairs', () => {
      const mouse = this.mouseCoords();
      this.setPosition(mouse.x, mouse.y);
    }).on('mouseout.crosshairs', () => {
      this.hide();
    });
  }

  mouseCoords () {
    const event = window.event;
    if (event) {
      const bbox = this.target.node().getBoundingClientRect();
      return {
        x: event.pageX - bbox.left,
        y: event.pageY - bbox.top
      };
    }
  }

  setPosition (x, y) {
    this.crosshairX.attr('y1', y)
      .attr('y2', y);

    this.crosshairY.attr('x1', x)
      .attr('x2', x);

    return this;
  }

  show () {
    this.crosshairX.style('opacity', 1);
    this.crosshairY.style('opacity', 1);

    return this;
  }

  hide () {
    this.crosshairX.style('opacity', 0);
    this.crosshairY.style('opacity', 0);

    return this;
  }
}

export const Crosshairs = Base => class extends Margin(Base) {
  constructor () {
    super(...arguments);
    if (!this.crosshairs) {
      this.crosshairs = new CrosshairsImpl(this);
    }
  }
};
