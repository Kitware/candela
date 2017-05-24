import vega from '../../util/vega';

let VegaChart = (Base, spec) => class extends Base {
  constructor (...args) {
    super(...args);
    this.options = args[1];
    this.chart = vega.parseChart(spec, this.el, this.options);
  }

  render () {
    return this.chart.then(chart => {
      if (this.width) {
        chart = chart.width(this.width);
      }

      if (this.height) {
        chart = chart.height(this.height);
      }

      chart.update();
    });
  }

  update (options) {
    let promise = this.chart;

    Object.assign(this.options, options);

    if (this.options.data) {
      promise = promise.then(chart => {
        return chart.data('data')
          .remove(() => true)
          .insert(this.options.data);
      });
    }

    if (this.options.width) {
      this.width = this.options.width;
    }

    if (this.options.height) {
      this.height = this.options.height;
    }

    return promise;
  }

  destroy () {
    this.empty();
    delete this.chart;
  }

  get serializationFormats () {
    return ['png', 'svg'];
  }

  serialize (format) {
    if (!this.chart) {
      return Promise.reject('The render() method must be called before serialize().');
    }
    return this.chart.then(vobj => {
      return vobj.toImageURL(format);
    });
  }
};

export default VegaChart;
