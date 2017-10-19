import VisComponent from 'candela/VisComponent';
import VegaView from 'candela/plugins/mixin/VegaView';

export default class GanttChart extends VegaView(VisComponent) {
  static get options () {
    return [
      {
        id: 'data',
        name: 'Data table',
        type: 'table'
      },
      {
        id: 'label',
        name: 'Label',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'level',
        name: 'Level',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'start',
        name: 'Start',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'end',
        name: 'End',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        id: 'type',
        name: ' ',
        type: 'string',
        default: 'quantitative',
        domain: ['nominal', 'quantitative', 'temporal', 'ordinal']
      },
      {
        id: 'tickCount',
        name: 'Tick count',
        type: 'number',
        default: 5
      },
      {
        id: 'axisTitle',
        name: 'Axis title',
        type: 'string',
        default: ''
      }
    ];
  }

  generateSpec () {
    let spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
      description: 'A Gantt chart built by Candela.',
      data: {
        values: this.options.data || []
      },
      width: this.getWidth(200),
      height: this.getHeight(200),
      mark: 'rect',
      encoding: {
        x: {
          field: this.options.start || '',
          type: this.options.type || 'quantitative',
          axis: {
            grid: false,
            tickCount: this.options.tickCount || 5,
            title: this.options.axisTitle || ''
          }
        },
        x2: {
          field: this.options.end || '',
          type: this.options.type || 'quantitative'
        },
        y: {
          field: this.options.label || '',
          type: 'nominal',
          axis: {
            grid: true,
            title: ''
          },
          sort: {
            field: '_id'
          }
        },
        color: {
          field: this.options.level || '',
          legend: null,
          type: 'nominal',
          scale: {
            range: [
              '#1f77b4',
              '#aec7e8'
            ]
          }
        }
      }
    };

    return spec;
  }
}
