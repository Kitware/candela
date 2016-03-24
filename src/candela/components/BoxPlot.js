import vcharts from '../../vcharts/src';

export default class BoxPlot {
  static get options () {
    return [
      {name: 'values', type: 'table'},
      {name: 'field', type: 'string'},
      {name: 'group', type: 'string'}
    ];
  }

  constructor (el, data, options) {
    this.chart = vcharts.chart('box', {
      el: el,
      values: data,
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
