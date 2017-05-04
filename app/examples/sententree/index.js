import { goal } from '../util/datasets';
import showComponent from '../util/showComponent';
import SentenTree from '../../../components/SentenTree';

window.onload = () => {
  showComponent(SentenTree, {
    data: goal,
    id: 'id',
    text: 'text',
    count: 'count',
    graphs: 3
  });
};
