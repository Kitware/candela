import vcharts from '../../vcharts/src';

export default class BoxPlot {
  static get spec () {
    return {
      options: [
        {
          name: 'data',
          type: 'table',
          format: 'objectlist'
        },
        {
          name: 'fields',
          type: 'string_list',
          format: 'string_list',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        },
        {
          name: 'group',
          type: 'string',
          format: 'text',
          domain: {
            mode: 'field',
            from: 'data',
            fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
          }
        }
      ]
    };
  }

  constructor (el, options) {
    this.chart = vcharts.chart('box', {
      el: el,
      values: options.data,
      fields: options.fields,
      group: options.group,
      orient: 'vertical',
      xAxis: {
        title: options.group || ''
      },
      yAxis: {
        title: 'Value'
      }
    });
  }

  render () {
    this.chart.update();
  }
}
