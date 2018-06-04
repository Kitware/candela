import { VisComponent } from '@candela/core';
import VegaView from '../../mixin/VegaView';

export default class BoxPlot extends VegaView(VisComponent) {
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
    // repeat: 'row' does not currently work with vegalite box-plot.
    // Get around this by transorming the data so we don't need repeat.
    // See https://github.com/vega/vega-lite/issues/2655
    var origData = this.options.data || [];
    var fields = this.options.fields || [];
    var data = [];
    origData.forEach((d) => {
      fields.forEach((f) => {
        var dd = {};
        dd.__field = f;
        dd.__value = d[f];
        dd[this.options.color] = d[this.options.color];
        dd[this.options.x] = d[this.options.x];
        data.push(dd);
      });
    });

    let spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
      description: 'A bar chart built by Candela.',
      data: {
        values: data
      },
      width: this.getWidth(200),
      height: this.getHeight(200),
      mark: 'box-plot'
    };

    spec.encoding.y = {
      field: '__value',
      type: 'quantitative',
      axis: {title: ''}
    };

    spec.encoding.column = {
      field: '__field',
      type: 'nominal',
      header: {title: ''}
    };

    spec.encoding.x = {
      field: this.options.x || '',
      type: this.options.xType || 'nominal'
    };

    spec.encoding.color = {
      field: this.options.color || '',
      type: this.options.colorType || 'nominal'
    };

    return spec;
  }
}
