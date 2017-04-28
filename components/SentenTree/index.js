import VisComponent from '../../VisComponent';
import { SentenTreeBuilder,
         SentenTreeVis } from 'sententree/dist/SentenTree';

export default class SentenTree extends VisComponent {
  constructor (el, {data, graphs = 3}) {
    super(el);

    const model = new SentenTreeBuilder()
      .buildModel(data);

    this.vis = new SentenTreeVis(el)
      .data(model.getRenderedGraphs(graphs));
  }

  render () {}
}
