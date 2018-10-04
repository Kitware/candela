import { VisComponent } from '@candela/core';
import VegaView from '../../mixin/VegaView';

export default class ScatterPlot extends VegaView(VisComponent) {
  static get options () {
    return [
      {
        id: 'data',
        name: 'Data table',
        type: 'table'
      },
      {
        id: 'x',
        name: 'X',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'xType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'quantitative',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'y',
        name: 'Y',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'yType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'quantitative',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'color',
        name: 'Color',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'colorType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'nominal',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'size',
        name: 'Size',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number', 'integer', 'boolean']
        }
      },
      {
        id: 'sizeType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'quantitative',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'shape',
        name: 'Shape',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'shapeType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'nominal',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'filled',
        name: 'Fill shapes',
        type: 'boolean',
        optional: true,
        default: true
      }
    ];
  }

  generateSpec () {
    let spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
      description: 'A generic Vega-lite chart built by Candela.',
      data: {
        values: this.options.data || []
      },
      width: this.getWidth(200),
      height: this.getHeight(200),
      mark: 'point',
      config: {
        mark: {filled: this.options.filled === undefined ? true : this.options.filled}
      },
      encoding: {
        tooltip: super.tooltipSpec()
      }
    };

    if (this.options.x && this.options.y) {
      spec.selection = {
        grid: {
          type: 'interval', bind: 'scales'
        }
      };
    }

    for (let e of ['x', 'y', 'size', 'color', 'shape']) {
      if (this.options[e]) {
        const defaultType = ['x', 'y', 'size'].indexOf(e) >= 0 ? 'quantitative' : 'nominal';
        spec.encoding[e] = {
          field: this.options[e],
          type: this.options[e + 'Type'] || defaultType
        };
      }
    }

    if (this.options.xScale) {
      spec.encoding.x.scale = this.options.xScale;
    }

    if (this.options.yScale) {
      spec.encoding.y.scale = this.options.yScale;
    }

    if (this.options.xAxis) {
      spec.encoding.x.axis = this.options.xAxis;
    }

    if (this.options.yAxis) {
      spec.encoding.y.axis = this.options.yAxis;
    }

    return spec;
  }
}
