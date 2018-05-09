import { SentenTree } from '@candela/sententree';
import { goal } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(SentenTree, {
    data: goal,
    id: 'id',
    text: 'text',
    count: 'count',
    graphs: 3
  });
};
