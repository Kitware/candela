import VisComponent from 'candela/VisComponent';
import Events from 'candela/plugins/mixin/Events';
import VegaChart from 'candela/plugins/mixin/VegaChart';

import spec from './spec.json';

export default class LineChart extends Events(VegaChart(VisComponent, spec)) {
  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'x',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        name: 'y',
        type: 'string_list',
        format: 'string_list',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['date', 'number', 'integer', 'boolean']
        }
      },
      {
        name: 'hover',
        type: 'string_list',
        format: 'string_list',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      }
    ];
  }

  constructor (...args) {
    super(...args);

    // Attach a listener to the chart.
    this.chart.then(chart => {
      chart.on('click', (event, item) => {
        if (item && item.mark.marktype === 'symbol') {
          const datum = Object.assign({}, item.datum);
          delete datum._id;
          delete datum._prev;

          this.emit('click', datum, item);
        }
      });
    });
  }
}
