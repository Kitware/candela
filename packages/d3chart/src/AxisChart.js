import { axisLeft, axisBottom } from 'd3-axis';

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

    const bounds = this.margin.bounds('plot');

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
        const margin = this.margin.get();
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
    const leftBounds = this.margin.bounds('left');
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
    const bottomBounds = this.margin.bounds('bottom');
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
