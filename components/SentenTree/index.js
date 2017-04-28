import VisComponent from '../../VisComponent';
import { SentenTreeBuilder,
         SentenTreeVis } from 'sententree/dist/SentenTree';

export default class SentenTree extends VisComponent {
  static get options () {
    return [
      {
        name: 'data',
        description: 'The data table.',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'id',
        description: 'The field containing the identifier of each row.',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'integer', 'number']
        }
      },
      {
        name: 'text',
        description: 'The field containing the text sample.',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string']
        }
      },
      {
        name: 'count',
        description: 'The field containing the count for each text sample.',
        type: 'string',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['integer']
        }
      }
    ];
  }

  constructor (el, {data, graphs = 3}) {
    super(el);

    const model = new SentenTreeBuilder()
      .buildModel(data);

    this.vis = new SentenTreeVis(el)
      .data(model.getRenderedGraphs(graphs));
  }

  render () {}
}
