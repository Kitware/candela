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
      }
    ];
  }

  constructor (el, options) {
    super(el, options);

    // Sort the events by time, and capture the total number of events.
    options.data.sort((x, y) => x.time - y.time);
    let surv = options.data.length;

    // Append a dummy value to the start of the dataset.
    options.data = [{time: 0}, ...options.data];

    // Compute the number of survivors at each event. A patient is assumed to
    // have not survived, unless the reason for the event is "right censoring"
    // (aka, censor == 1).
    options.data.forEach(d => {
      if (d.censor !== 0) {
        surv--;
      }
      d.survivors = surv;
    });
  }
}
