import VisComponent from 'candela/VisComponent';
import VegaView from 'candela/plugins/mixin/VegaView';

export default class VegaLite extends VegaView(VisComponent) {
  static get options () {
    return [
      {
        id: 'data',
        name: 'Data table',
        type: 'table'
      },
      {
        id: 'mark',
        name: 'Mark',
        type: 'string',
        default: 'point',
        domain: ['point', 'circle', 'square', 'text', 'tick', 'bar', 'rectangle', 'line', 'area']
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
        default: 'quantitative',
        domain: ['quantitative', 'temporal', 'ordinal', 'nominal']
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
        default: 'quantitative',
        domain: ['quantitative', 'temporal', 'ordinal', 'nominal']
      },
      {
        id: 'size',
        name: 'Size',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'sizeType',
        name: ' ',
        type: 'string',
        default: 'quantitative',
        domain: ['quantitative', 'temporal', 'ordinal', 'nominal']
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
        default: 'nominal',
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
        default: 'nominal',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'row',
        name: 'Row',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'rowType',
        name: ' ',
        type: 'string',
        default: 'nominal',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'column',
        name: 'Column',
        type: 'string',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'columnType',
        name: ' ',
        type: 'string',
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
      description: 'A scatterplot built by Candela.',
      data: {
        values: this.options.data || []
      },
      width: this.options.width === undefined ? 200 : this.options.width,
      height: this.options.height === undefined ? 200 : this.options.height,
      mark: this.options.mark || 'bar',
      config: {
        mark: {filled: this.options.filled === undefined ? true : this.options.filled}
      },
      encoding: {}
    };

    if (this.options.x && this.options.y) {
      spec.selection = {
        grid: {
          type: 'interval', bind: 'scales'
        }
      };
    }

    for (let e of ['x', 'y', 'size', 'color', 'shape', 'row', 'column']) {
      if (this.options[e]) {
        const defaultType = ['x', 'y', 'size'].indexOf(e) >= 0 ? 'quantitative' : 'nominal';
        spec.encoding[e] = {
          field: this.options[e],
          type: this.options[e + 'Type'] || defaultType
        };
      }
    }

    return spec;
  }
}
