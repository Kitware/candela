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

    options.data.sort((x, y) => x.time - y.time);

    let surv = options.data.length;
    options.data.forEach(d => {
      d.survivors = surv;
      if (d.censor !== 0) {
        surv--;
      }
    });

    console.log(options.data);
  }
}
