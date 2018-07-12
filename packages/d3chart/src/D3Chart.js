import { VisComponent } from '@candela/core';
import { InitSize } from '@candela/size';

import { select } from 'd3-selection';
import 'd3-transition';
import { axisLeft, axisBottom } from 'd3-axis';

import { Margin } from './Margin';

export const D3Chart = Base => class extends Margin(InitSize(Base)) {
  constructor () {
    super(...arguments);

    this.svg = select(this.el)
      .append('svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg');

    // A root-level group element.
    this.root = this.svg.append('g');

    // Group elements to represent all four margins of the plot.
    this.left = this.root.append('g')
      .classed('left', true);
    this.bottom = this.root.append('g')
      .classed('bottom', true);
    this.right = this.root.append('g')
      .classed('right', true);
    this.top = this.root.append('g')
      .classed('top', true);

    // The central area where the main plot will go.
    this.plot = this.root.append('g')
      .classed('plot', true);
  }

  initD3Chart () {
    this.svg.attr('width', this.width)
      .attr('height', this.height);

    const margin = this.margin();

    this.left.attr('transform', `translate(0,${margin.top})`);
    this.bottom.attr('transform', `translate(${margin.left},${this.height - margin.bottom})`);
    this.right.attr('transform', `translate(${this.width - margin.right},${margin.top})`);
    this.top.attr('transform', `translate(${margin.left},0)`);
    this.plot.attr('transform', `translate(${margin.left},${margin.top})`);
  }
};

export const Interactive = Base => class extends Base {
  initInteractive () {
    const plotBounds = this.marginBounds('plot');

    const target = this.root.append('rect')
      .classed('interactive-target', true)
      .attr('x', plotBounds.x)
      .attr('y', plotBounds.y)
      .attr('width', plotBounds.width)
      .attr('height', plotBounds.height)
      .style('opacity', 0.0);

    this._interactive = {
      target
    };
  }

  target () {
    return this._interactive.target;
  }

  mouseCoords () {
    const event = window.event;
    if (event) {
      const bbox = this.target().node().getBoundingClientRect();
      return {
        x: event.clientX - bbox.left,
        y: event.clientY - bbox.top
      };
    }
  }
};

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

    const horz = this.bottomAxis() || this.topAxis();
    const vert = this.leftAxis() || this.rightAxis();

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
      })
      .on('mousemove.crosshairs', () => {
        const mouse = this.mouseCoords();
        this.update(mouse.x, mouse.y);
      })
      .on('mouseout.crosshairs', () => {
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

      crosshairY.attr('x1', mouse.x)
        .attr('x2', mouse.x);

      this.emit('crosshairs.move', window.event);
    }).on('mouseout.crosshairs', () => {
      g.selectAll('line')
        .style('opacity', 0);

      this.emit('crosshairs.out');
    });

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

export const AxisChart = Base => class extends Base {
  constructor () {
    super(...arguments);

    this._axes = {
      leftScale: null,
      bottomScale: null,
      leftAxis: null,
      bottomAxis: null,
      leftGroup: null,
      bottomGroup: null
    };
  }

  _setAxis (scale, direction, scaleFunc) {
    const axisProp = `${direction}Axis`;
    const scaleProp = `${direction}Scale`;
    const groupProp = `${direction}Group`;

    const bounds = this.marginBounds('plot');

    if (direction === 'left' || direction === 'right') {
      scale.range([bounds.height, 0]);
    } else {
      scale.range([0, bounds.width]);
    }

    this._axes[scaleProp] = scale;

    let axis = this._axes[groupProp];
    if (!axis) {
      axis = this._axes[groupProp] = this[direction].append('g');
      axis.append('text')
        .attr('fill', '#000')
        .style('font-size', '11pt')
        .style('font-weight', 'bold');

      if (direction === 'left') {
        const margin = this.margin();
        axis.attr('transform', `translate(${margin.left},0)`);
      }
    } else {
      axis.selectAll('*').remove();
    }

    axis.call(this._axes[axisProp] = scaleFunc(scale));
  }

  leftAxis () {
    return this._axes.leftAxis;
  }

  bottomAxis () {
    return this._axes.bottomAxis;
  }

  leftScale (scale) {
    if (scale) {
      this._setAxis(scale, 'left', axisLeft);
      return this;
    } else {
      return this._axes.leftScale;
    }
  }

  bottomScale (scale) {
    if (scale) {
      this._setAxis(scale, 'bottom', axisBottom);
      return this;
    } else {
      return this._axes.bottomScale;
    }
  }

  leftLabel (label) {
    const leftBounds = this.marginBounds('left');
    if (label) {
      this._axes.leftGroup.select('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -leftBounds.height / 2)
        .attr('y', '-40')
        .text(label);
    } else {
      return this._axes.leftLabel;
    }
  }

  bottomLabel (label) {
    const bottomBounds = this.marginBounds('bottom');
    if (label) {
      this._axes.bottomGroup.select('text')
        .attr('x', bottomBounds.width / 2)
        .attr('y', '40')
        .text(label);
    } else {
      return this._axes.bottomLabel;
    }
  }

  renderLeftAxis () {
    this._axes.leftGroup.call(this.leftAxis());
  }

  renderBottomAxis () {
    this._axes.bottomGroup.call(this.bottomAxis());
  }
};

export class Swatches extends D3Chart(VisComponent) {
  constructor (el, options) {
    super(el, options);

    this.width = options.width;
    this.height = options.height;
    this.margin(options.margin)
      .initD3Chart();

    const margin = this.margin();
    console.log(margin);

    this.left.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.left)
      .attr('height', this.height - margin.bottom - margin.top)
      .style('stroke', 'black')
      .style('fill', 'red');

    this.bottom.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'green');

    this.right.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.right)
      .attr('height', this.height - margin.bottom - margin.top)
      .style('stroke', 'black')
      .style('fill', 'cyan');

    this.top.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.top)
      .style('stroke', 'black')
      .style('fill', 'yellow');

    this.plot.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', this.height - margin.top - margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'blue');
  }

  render () {
    console.log('render()');
  }
}
