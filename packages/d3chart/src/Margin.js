class MarginImpl {
  constructor (that) {
    this.that = that;

    this.margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };
  }

  get () {
    return {...this.margin};
  }

  set (m) {
    let mm = {...m};
    for (let key in mm) {
      if (!(key in this.margin)) {
        delete mm[key];
      }
    }

    this.margin = {
      ...this.margin,
      ...mm
    };

    return this;
  }

  bounds (region) {
    const margin = this.get();
    const width = this.that.width;
    const height = this.that.height;
    let bounds;

    switch (region) {
      case 'left':
        bounds = {
          x: 0,
          y: margin.top,
          width: margin.left,
          height: height - margin.top - margin.bottom
        };
        break;

      case 'right':
        bounds = {
          x: width - margin.right,
          y: margin.top,
          width: margin.right,
          height: height - margin.top - margin.bottom
        };
        break;

      case 'top':
        bounds = {
          x: margin.left,
          y: 0,
          width: width - margin.left - margin.right,
          height: margin.top
        };
        break;

      case 'bottom':
        bounds = {
          x: margin.left,
          y: height - margin.bottom,
          width: width - margin.left - margin.right,
          height: margin.bottom
        };
        break;

      case 'plot':
        bounds = {
          x: margin.left,
          y: margin.top,
          width: width - margin.left - margin.right,
          height: height - margin.top - margin.bottom
        };
        break;

      default:
        throw new Error(`illegal region identifier: "${region}"`);
    }

    return bounds;
  }
}

export const Margin = Base => class extends Base {
  constructor () {
    super(...arguments);
    if (!this.margin) {
      this.margin = new MarginImpl(this);
    }
  }
};
