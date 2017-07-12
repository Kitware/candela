import VisComponent from 'candela/VisComponent';
import VegaView from 'candela/plugins/mixin/VegaView';

export default class Histogram extends VegaView(VisComponent) {
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
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'maxBins',
        name: 'Maximum number of bins',
        type: 'number',
        default: 10
      },
      {
        id: 'y',
        name: 'Y',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'aggregate',
        name: 'Aggregate',
        type: 'string',
        optional: true,
        domain: ['count', 'mean', 'sum', 'median', 'min', 'max']
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
      description: 'A histogram built by Candela.',
      data: {
        values: this.options.data || []
      },
      width: this.options.width === undefined ? 200 : this.options.width,
      height: this.options.height === undefined ? 200 : this.options.height,
      mark: 'bar',
      encoding: {}
    };

    if (this.options.x) {
      spec.selection = {
        grid: {
          type: 'interval', bind: 'scales', encodings: ['x']
        }
      };
    }

    if (this.options.x) {
      spec.encoding.x = {
        field: this.options.x,
        type: this.options.xType || 'quantitative',
        bin: {maxbins: this.options.maxBins || 10}
      };
    }

    spec.encoding.y = {
      aggregate: this.options.aggregate || 'count'
    };
    if (this.options.y) {
      spec.encoding.y.field = this.options.y;
      spec.encoding.y.type = this.options.yType || 'quantitative';
    }

    if (this.options.color) {
      spec.encoding.color = {
        field: this.options.color,
        type: this.options.colorType || 'nominal'
      };
    }

    return spec;
  }
}
