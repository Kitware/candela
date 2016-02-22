import vcharts from '../external/vcharts/src';

export default class ScatterMatrix {
  static get options () {
    return [
      {name: 'data', type: 'table'},
      {name: 'fields', type: 'string_list'},
      {name: 'color', type: 'string'}
    ];
  }

  constructor (el, options) {
    let chart = vcharts.chart('xymatrix', {
      el: el,
      values: options.data,
      fields: options.fields,
      color: {
        field: options.color
      }
    });
    window.onresize = () => chart.update();
  }
}
