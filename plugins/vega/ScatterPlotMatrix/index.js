import VisComponent from 'candela/VisComponent';
import VegaView from 'candela/plugins/mixin/VegaView';

export default class ScatterPlotMatrix extends VegaView(VisComponent) {
  static get options () {
    return [
      {
        id: 'data',
        name: 'Data table',
        type: 'table'
      },
      {
        id: 'fields',
        name: 'Fields',
        type: 'string_list',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
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
      repeat: {
        row: this.options.fields || [],
        column: this.options.fields || []
      },
      spec: {
        data: {
          values: this.options.data || []
        },
        width: this.getWidth(200),
        height: this.getHeight(200),
        mark: 'point',
        encoding: {
          x: {
            field: {repeat: 'column'},
            type: 'quantitative'
          },
          y: {
            field: {repeat: 'row'},
            type: 'quantitative'
          }
        }
      },
      config: {
        mark: {filled: this.options.filled === undefined ? true : this.options.filled}
      }
    };

    spec.spec.selection = {
      grid: {
        type: 'interval', bind: 'scales'
      }
    };

    for (let e of ['size', 'color', 'shape']) {
      if (this.options[e]) {
        const defaultType = e === 'size' ? 'quantitative' : 'nominal';
        spec.spec.encoding[e] = {
          field: this.options[e],
          type: this.options[e + 'Type'] || defaultType
        };
      }
    }

    return spec;
  }
}
