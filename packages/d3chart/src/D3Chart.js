import { VisComponent } from '@candela/core';
import { InitSize } from '@candela/size';

import { select } from 'd3-selection';
import 'd3-transition';

import { Margin } from './Margin';

class D3ChartImpl {
  constructor (that) {
    this.that = that;

    this.svg = select(this.that.el)
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

  init () {
    this.svg.attr('width', this.that.width)
      .attr('height', this.that.height);

    const margin = this.that.margin.get();

    this.left.attr('transform', `translate(0,${margin.top})`);
    this.bottom.attr('transform', `translate(${margin.left},${this.that.height - margin.bottom})`);
    this.right.attr('transform', `translate(${this.that.width - margin.right},${margin.top})`);
    this.top.attr('transform', `translate(${margin.left},0)`);
    this.plot.attr('transform', `translate(${margin.left},${margin.top})`);
  }
}

export const D3Chart = Base => class extends Margin(InitSize(Base)) {
  constructor () {
    super(...arguments);
    if (!this.d3chart) {
      this.d3chart = new D3ChartImpl(this);
    }
  }
};

export class Swatches extends D3Chart(VisComponent) {
  constructor (el, options) {
    super(el, options);

    this.width = options.width;
    this.height = options.height;
    this.margin.set(options.margin);
    this.d3chart.init();

    const margin = this.margin.get();

    this.d3chart.left.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.left)
      .attr('height', this.height - margin.bottom - margin.top)
      .style('stroke', 'black')
      .style('fill', 'red');

    this.d3chart.bottom.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.bottom)
      .style('stroke', 'black')
      .style('fill', 'green');

    this.d3chart.right.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', margin.right)
      .attr('height', this.height - margin.bottom - margin.top)
      .style('stroke', 'black')
      .style('fill', 'cyan');

    this.d3chart.top.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width - margin.left - margin.right)
      .attr('height', margin.top)
      .style('stroke', 'black')
      .style('fill', 'yellow');

    this.d3chart.plot.append('rect')
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
