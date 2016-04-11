import d3 from 'd3';
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
    if (!this.options.id || !this.options.sets) {
      return;
    }

    d3.select(this.el).html(template);

    // Swizzle the data into what UpSet expects (array of arrays)
    let data = [];
    let header = [this.options.id];
    this.options.sets.forEach(s => header.push(s));
    data.push(header);
    this.options.data.forEach(d => {
      data.push(header.map(h => '' + d[h]));
    });

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
            end: this.options.sets.length
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
