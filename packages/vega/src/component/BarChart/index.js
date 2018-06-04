import { VisComponent } from '@candela/core';
import VegaView from '../../mixin/VegaView';

export default class BarChart extends VegaView(VisComponent) {
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
        default: 'nominal',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'y',
        name: 'Y',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'yType',
        name: ' ',
        type: 'string',
        default: 'quantitative',
        domain: ['quantitative', 'temporal', 'nominal', 'ordinal']
      },
      {
        id: 'aggregate',
        name: 'Aggregate',
        type: 'string',
        optional: true,
        default: 'sum',
        domain: ['sum', 'count', 'mean', 'median', 'min', 'max']
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
        default: 'nominal',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      }
    ];
  }

  generateSpec () {
    let spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
      description: 'A bar chart built by Candela.',
      data: {
        values: this.options.data || []
      },
      width: this.getWidth(200),
      height: this.getHeight(200),
      mark: 'bar',
      encoding: {
        tooltip: super.tooltipSpec()
      }
    };

    if (this.options.x && this.options.y) {
      spec.selection = {
        grid: {
          type: 'interval', bind: 'scales', encodings: ['y']
        }
      };
    }

    spec.encoding.y = {
      aggregate: this.options.aggregate || 'sum'
    };
    if (this.options.y) {
      spec.encoding.y.field = this.options.y;
      spec.encoding.y.type = this.options.yType || 'quantitative';
    }

    for (let e of ['x', 'color']) {
      if (this.options[e]) {
        spec.encoding[e] = {
          field: this.options[e],
          type: this.options[e + 'Type'] || 'nominal'
        };
      }
    }
    return spec;
  }
}
