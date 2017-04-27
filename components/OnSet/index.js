import d3 from 'onset/node_modules/d3';
import { unique } from 'datalib';
import onset from 'onset';
import VisComponent from '../../VisComponent';

export default class OnSet extends VisComponent {
  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'id',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        name: 'sets',
        type: 'string_list',
        format: 'string_list',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['integer', 'boolean']
        }
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
      }
    ];
  }

  constructor (el, options) {
    super(el);
    this.options = options;
  }

  render () {
    if (!this.options.id || (!this.options.sets && !this.options.fields)) {
      return;
    }

    d3.select(this.el).html(onset.template);

    // Swizzle the data into what OnSet expects (csv of form id,set1,set2,...)
    let data = [];
    this.options.data.forEach(d => {
      data.push([d[this.options.id]]);
    });

    // Add 0/1 sets.
    if (this.options.sets) {
      const membershipVals = ['1', 'yes', 'true'];
      this.options.data.forEach((d, i) => {
        this.options.sets.forEach(s => {
          const strVal = ('' + d[s]).toLowerCase();
          if (membershipVals.indexOf(strVal) !== -1) {
            data[i].push(s);
          }
        });
      });
    }

    // Add sets derived from general fields.
    // A set is defined by records sharing a field value.
    if (this.options.fields) {
      this.options.fields.forEach(field => {
        let distinct = unique(this.options.data, d => d[field]);
        this.options.data.forEach((d, i) => {
          distinct.forEach(v => {
            if (v === d[field]) {
              data[i].push(field + ' ' + v);
            }
          });
        });
      });
    }

    let csvData = '';
    if (this.options.rowSets) {
      data.forEach(d => {
        csvData += d.join(',') + '\n';
      });
    } else {
      let sets = {};
      data.forEach(d => {
        d.forEach((s, i) => {
          if (i === 0) {
            return;
          }
          if (sets[s] === undefined) {
            sets[s] = [s];
          }
          sets[s].push(d[0]);
        });
      });
      Object.keys(sets).forEach(s => {
        csvData += sets[s].join(',') + '\n';
      });
    }

    window.sessionStorage.setItem('datatype', 'custom');
    window.sessionStorage.setItem('data', csvData);

    onset.main();
  }
}
