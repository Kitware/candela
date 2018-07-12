export const Margin = Base => class extends Base {
  constructor () {
    super(...arguments);

    this._margin = {
      top: null,
      right: null,
      bottom: null,
      left: null
    };
  }

  margin (m) {
    if (m === undefined) {
      return {...this._margin};
    }

    let mm = {...m};
    for (let key in mm) {
      if (!(key in this._margin)) {
        delete mm[key];
      }
    }

    this._margin = {
      ...this._margin,
      ...mm
    };

    return this;
  }

  marginBounds (region) {
    const margin = this.margin();
    let bounds;

    switch (region) {
      case 'left':
        bounds = {
          x: 0,
          y: margin.top,
          width: margin.left,
          height: this.height - margin.top - margin.bottom
        };
        break;

      case 'right':
        bounds = {
          x: this.width - margin.right,
          y: margin.top,
          width: margin.right,
          height: this.height - margin.top - margin.bottom
        };
        break;

      case 'top':
        bounds = {
          x: margin.left,
          y: 0,
          width: this.width - margin.left - margin.right,
          height: margin.top
        };
        break;

      case 'bottom':
        bounds = {
          x: margin.left,
          y: this.height - margin.bottom,
          width: this.width - margin.left - margin.right,
          height: margin.bottom
        };
        break;

      case 'plot':
        bounds = {
          x: margin.left,
          y: margin.top,
          width: this.width - margin.left - margin.right,
          height: this.height - margin.top - margin.bottom
        };
        break;

      default:
        throw new Error(`illegal region identifier: "${region}"`);
    }

    return bounds;
  }
};
