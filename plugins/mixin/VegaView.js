import { compile as vegaLiteCompile } from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';
import { vega as vegaTooltip } from 'vega-tooltip';
import 'vega-tooltip/build/vega-tooltip.css';
import { select } from 'd3-selection';
import { getElementSize } from '../../util';
import { parse, View } from 'vega';

let VegaView = (Base) => class extends Base {
  constructor (...args) {
    super(...args);
    this.options = args[1];
  }

  generateSpec () {
    return {};
  }

  update (options) {
    Object.assign(this.options, options);
    return Promise.resolve(this.view);
  }

  render () {
    // Use element size to set size, unless size explicitly specified or
    // element size is zero.
    let el = select(this.el).node();

    const size = getElementSize(el);
    const elWidth = size.width;
    const elHeight = size.height;

    if (elWidth !== 0 && elHeight !== 0) {
      if (this.options.width === undefined) {
        this.options.width = elWidth;
      }
      if (this.options.height === undefined) {
        this.options.height = elHeight;
      }
    }

    let spec = this.generateSpec();

    if (spec.$schema && schemaParser(spec.$schema).library === 'vega-lite') {
      spec = vegaLiteCompile(spec).spec;
    }
    if (this.view) {
      this.view.finalize();
    }
    this.view = new View(parse(spec))
      .renderer(this.options.renderer || 'canvas')
      .initialize(el)
      .hover()
      .run();
    vegaTooltip(this.view);
    return Promise.resolve(this.view);
  }

  destroy () {
    this.view.finalize();
    this.empty();
  }

  get serializationFormats () {
    return ['png', 'svg'];
  }

  serialize (format) {
    if (!this.view) {
      return Promise.reject('The render() method must be called before serialize().');
    }
    return Promise.resolve(this.view.toImageURL(format));
  }
};

export default VegaView;
