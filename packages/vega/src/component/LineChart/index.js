import { VisComponent } from '@candela/core';
import VegaView from '../../mixin/VegaView';

export default class LineChart extends VegaView(VisComponent) {
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
        id: 'xType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'quantitative',
        domain: ['quantitative', 'nominal', 'temporal', 'ordinal']
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
        optional: true,
        default: 'quantitative',
        domain: ['quantitative', 'nominal', 'temporal', 'ordinal']
      },
      {
        id: 'series',
        name: 'Series',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean', 'string']
        }
      },
      {
        id: 'seriesType',
        name: ' ',
        type: 'string',
        optional: true,
        default: 'nominal',
        domain: ['quantitative', 'nominal', 'temporal', 'ordinal']
      },
      {
        id: 'colorSeries',
        name: 'Color series',
        type: 'boolean',
        optional: true,
        default: true
      },
      {
        id: 'showPoints',
        name: 'Show points',
        type: 'boolean',
        optional: true,
        default: false
      }
    ];
  }

  generateSpec () {
    let spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
      description: 'A line chart built by Candela.',
      data: {
        values: this.options.data || []
      },
      width: this.getWidth(200),
      height: this.getHeight(200),
      mark: 'line',
      encoding: {}
    };

    if (this.options.x && this.options.y) {
      spec.selection = {
        grid: {
          type: 'interval', bind: 'scales'
        }
      };
    }

    if (this.options.x) {
      spec.encoding.x = {
        field: this.options.x,
        type: this.options.xType || 'quantitative'
      };
      if (this.options.xScale) {
        spec.encoding.x.scale = this.options.xScale;
      }
    }

    if (this.options.y) {
      spec.encoding.y = {
        field: this.options.y,
        type: this.options.yType || 'quantitative'
      };
      if (this.options.yScale) {
        spec.encoding.y.scale = this.options.yScale;
      }
    }

    if (this.options.series) {
      const seriesSpec = {
        field: this.options.series,
        type: this.options.seriesType || 'nominal'
      };
      if (this.options.colorSeries === undefined ? true : this.options.colorSeries) {
        spec.encoding.color = seriesSpec;
      } else {
        spec.encoding.detail = seriesSpec;
      }
    }

    if (this.options.showPoints) {
      spec.config = {overlay: {line: true}};
    }

    return spec;
  }
}
