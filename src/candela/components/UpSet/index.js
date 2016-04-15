import d3 from 'd3';
import dl from 'datalib';
import * as upset from 'UpSet';
import template from './template.html';

export default class UpSet {
  static get spec () {
    return {
      options: [
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
      ]
    };
  }

  constructor (el, options) {
    this.el = el;
    this.options = options;
  }

  render () {
    if (!this.options.id || (!this.options.sets && !this.options.fields)) {
      return;
    }

    d3.select(this.el).html(template);

    // Swizzle the data into what UpSet expects (array of arrays)
    let data = [];
    let header = [this.options.id];
    data.push(header);
    this.options.data.forEach(d => {
      data.push([d[this.options.id]]);
    });

    // Add 0/1 sets.
    if (this.options.sets) {
      this.options.sets.forEach(s => header.push(s));
      this.options.data.forEach((d, i) => {
        this.options.sets.forEach(s => {
          data[i + 1].push('' + d[s]);
        });
      });
    }

    // Add sets derived from general fields.
    // A set is defined by records sharing a field value.
    if (this.options.fields) {
      this.options.fields.forEach(field => {
        let distinct = dl.unique(this.options.data, d => d[field]);
        distinct.forEach(v => header.push(field + ' ' + v));
        this.options.data.forEach((d, i) => {
          distinct.forEach(v => {
            data[i + 1].push(v === d[field] ? '1' : '0');
          });
        });
      });
    }

    let datasets = [
      {
        name: 'data',
        data: data,
        header: 0,
        meta: [
          {
            type: 'id',
            index: 0,
            name: 'Name'
          }
        ],
        sets: [
          {
            format: 'binary',
            start: 1,
            end: header.length - 1
          }
        ],
        author: '',
        description: '',
        source: ''
      }
    ];

    upset.UpSet(datasets);
    this.ui = new upset.Ui();
  }
}
