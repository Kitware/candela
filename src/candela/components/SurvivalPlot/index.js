import VisComponent from '../../VisComponent';
import VegaChart from '../../VisComponent/mixin/VegaChart';
import spec from './spec.json';

export default class SurvivalPlot extends VegaChart(VisComponent, spec) {
  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'time',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number', 'integer']
        }
      },
      {
        name: 'censor',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['integer', 'boolean']
        }
      },
      {
        name: 'group',
        type: 'string',
        format: 'text',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      }
    ];
  }

  constructor (el, options) {
    super(el, options);

    // Sort the events by time.
    options.data.sort((x, y) => x[options.time] - y[options.time]);

    // If there is no 'group' parameter, fake one up.
    if (!options.group) {
      options.group = 'group';
      options.data.forEach(d => d.group = 0);
    }

    // Collect the grouping values, and count how many belong to each group.
    let groups = {};
    options.data.forEach(d => {
      const key = d[options.group];
      if (!groups[key]) {
        groups[key] = {
          survivors: 1
        };
      }

      groups[key].survivors++;
    });

    // Append a dummy value to the start of the dataset, one per group.
    const dummies = Object.keys(groups).map(g => {
      let x = {
        time: 0
      };

      x[options.group] = g;

      return x;
    });
    options.data = [...dummies, ...options.data];

    // Compute the number of survivors at each event. A patient is assumed to
    // have not survived, unless the reason for the event is "right censoring"
    // (aka, censor == 1).
    options.data.forEach(d => {
      if (d[options.censor] !== 0) {
        groups[d[options.group]].survivors--;
      }
      d.survivors = groups[d[options.group]].survivors;
    });
  }
}
