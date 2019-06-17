import { axisLeft, axisBottom } from 'd3-axis';

import { D3Chart } from './D3Chart';

const scaleFuncMap = {
  left: axisLeft,
  bottom: axisBottom
};

function getLabelOffset (dir, bounds) {
  switch (dir) {
    case 'left':
      return {
        rotate: 'rotate(-90)',
        x: -bounds.height / 2,
        y: -40
      };

    case 'bottom':
      return {
        x: bounds.width / 2,
        y: 40
      };

    default:
      throw new Error(`illegal direction parameter: "${dir}"`);
  }
}

class AxesImpl {
  constructor (that) {
    this.that = that;

    this.scale = {
      left: null,
      bottom: null
    };

    this.axis = {
      left: null,
      bottom: null
    };

    this.group = {
      left: null,
      bottom: null
    };
  }

  setScale (direction, scale) {
    const scaleFunc = scaleFuncMap[direction];

    const bounds = this.that.margin.bounds('plot');

    if (direction === 'left' || direction === 'right') {
      scale.range([bounds.height, 0]);
    } else {
      scale.range([0, bounds.width]);
    }

    this.scale[direction] = scale;

    let axis = this.group[direction];
    if (!axis) {
      axis = this.group[direction] = this.that.d3chart[direction].append('g');
      axis.append('text')
        .attr('fill', '#000')
        .style('font-size', '11pt')
        .style('font-weight', 'bold');

      if (direction === 'left') {
        const margin = this.that.margin.get();
        axis.attr('transform', `translate(${margin.left},0)`);
      }
    } else {
      axis.selectAll('*').remove();
    }

    axis.call(this.axis[direction] = scaleFunc(scale));

    return this;
  }

  getAxis (dir) {
    return this.axis[dir];
  }

  getScale (dir) {
    return this.scale[dir];
  }

  setLabel (dir, label) {
    const bounds = this.that.margin.bounds(dir);
    const text = this.group[dir].select('text');
    const offset = getLabelOffset(dir, bounds);

    text.attr('transform', offset.rotate ? offset.rotate : null)
      .attr('x', offset.x)
      .attr('y', offset.y)
      .text(label);

    return this;
  }

  renderAxis (dir) {
    this.group[dir].call(this.axis[dir]);
    return this;
  }
}

export const Axes = Base => class extends D3Chart(Base) {
  constructor () {
    super(...arguments);
    this.axes = new AxesImpl(this);
  }
};
