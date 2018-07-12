export const Crosshairs = Base => class extends Base {
  initCrosshairs () {
    const plotBounds = this.marginBounds('plot');
    this.target = this.plot.append('rect', ':first-child')
      .classed('crosshairs-target', true)
      .attr('width', plotBounds.width)
      .attr('height', plotBounds.height)
      .style('opacity', 0.0);

    const g = this.plot.append('g')
      .classed('crosshairs', true)
      .style('pointer-events', 'none');

    const horz = this.bottomScale() || this.topScale();
    const vert = this.leftScale() || this.rightScale();

    this.crosshairX = g.append('line')
      .classed('crosshair-x', true)
      .style('opacity', 0)
      .style('stroke', 'lightgray')
      .attr('x1', horz.range()[0])
      .attr('x2', horz.range()[1]);

    this.crosshairY = g.append('line')
      .classed('crosshair-y', true)
      .style('opacity', 0)
      .style('stroke', 'lightgray')
      .attr('y1', vert.range()[0])
      .attr('y2', vert.range()[1]);

    this.target.on('mouseover.crosshairs', () => {
      this.show();
    }).on('mousemove.crosshairs', () => {
      const mouse = this.mouseCoords();
      this.update(mouse.x, mouse.y);
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

  update (x, y) {
    this.crosshairX.attr('y1', y)
      .attr('y2', y);

    this.crosshairY.attr('x1', x)
      .attr('x2', x);
  }

  show () {
    this.crosshairX.style('opacity', 1);
    this.crosshairY.style('opacity', 1);
  }

  hide () {
    this.crosshairX.style('opacity', 0);
    this.crosshairY.style('opacity', 0);
  }
};
