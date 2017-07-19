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
    this.el = select(this.el).node();
    this.options = args[1];
    this.content = document.createElement('div');
    this.content.style.display = 'block';
    this.el.appendChild(this.content);
  }

  generateSpec () {
    return {};
  }

  update (options) {
    Object.assign(this.options, options);
    return Promise.resolve(this.view);
  }

  getWidth (defaultWidth) {
    if (this.options && this.options.width !== undefined) {
      return this.options.width;
    }
    if (this.width !== undefined && this.width !== 0) {
      return this.width;
    }
    const clientWidth = getElementSize(this.el).width;
    if (clientWidth !== 0) {
      return clientWidth;
    }
    return defaultWidth;
  }

  getHeight (defaultHeight) {
    if (this.options && this.options.height !== undefined) {
      return this.options.height;
    }
    if (this.height !== undefined && this.height !== 0) {
      return this.height;
    }
    const clientHeight = getElementSize(this.el).height;
    if (clientHeight !== 0) {
      return clientHeight;
    }
    return defaultHeight;
  }

  _resizeContent (spec, size) {
    if (spec.spec) {
      spec.spec.width = size.width;
      spec.spec.height = size.height;
    } else {
      spec.width = size.width;
      spec.height = size.height;
    }
    let vegaSpec = spec;
    if (spec.$schema && schemaParser(spec.$schema).library === 'vega-lite') {
      vegaSpec = vegaLiteCompile(spec).spec;
    }
    this.view = new View(parse(vegaSpec))
      .renderer(this.options.renderer || 'canvas')
      .initialize(this.content)
      .hover()
      .run();
    vegaTooltip(this.view);
    return {
      width: window.parseInt(this.content.firstChild.getAttribute('width')),
      height: window.parseInt(this.content.firstChild.getAttribute('height'))
    };
  }

  render () {
    let spec = this.generateSpec();

    // The Vega or Vega-Lite spec width and height do not account for
    // space of axes, legends, etc. by default, and the "fit" autosize setting
    // is not currently supported in Vega-Lite.
    //
    // So here we render a few times to determine the relationship of cell
    // width/height and final width/height. It is assumed that it is a linear
    // relationship, with a non-unit slope to account for repeated cells.

    let intendedSize = {width: spec.width, height: spec.height};
    if (spec.spec) {
      intendedSize = {width: spec.spec.width, height: spec.spec.height};
    }

    this.el.removeChild(this.content);

    let size1 = this._resizeContent(spec, {width: 100, height: 100});
    let size2 = this._resizeContent(spec, {width: 200, height: 200});

    let widthSlope = (size2.width - size1.width) / 100;
    let heightSlope = (size2.height - size1.height) / 100;
    let widthIntercept = size1.width - widthSlope * 100;
    let heightIntercept = size1.height - heightSlope * 100;

    this._resizeContent(spec, {
      width: (intendedSize.width - widthIntercept) / widthSlope,
      height: (intendedSize.height - heightIntercept) / heightSlope
    });

    this.content.firstChild.style.display = 'block';
    this.el.appendChild(this.content);

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
