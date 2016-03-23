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
      fields: [options.field],
      group: options.group,
      orient: 'vertical',
      xAxis: {
        title: options.group || ''
      },
      yAxis: {
        title: options.field
      }
    });
  }

  render () {
    this.chart.update();
  }
}
