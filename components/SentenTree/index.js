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
      },
      {
        name: 'graphs',
        description: 'The number of graphs to compute and render.',
        type: 'integer',
        format: 'integer',
        default: 3
      }
    ];
  }

  constructor (el, {data, id = null, text = 'text', count = 'count', graphs = 3}) {
    super(el);

    // Transform input data into correct form.
    this.data = data.map((d, i) => ({
      id: id ? d[id] : i,
      text: d[text],
      count: d[count] !== undefined ? d[count] : 1
    }));

    const model = new SentenTreeBuilder()
      .buildModel(this.data);

    this.vis = new SentenTreeVis(el)
      .data(model.getRenderedGraphs(graphs));
  }

  render () {}
}
