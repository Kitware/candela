import Glo from '../../../components/Glo';
import { lesmis } from '../util/datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(Glo, {
    nodes: lesmis.nodes,
    edges: lesmis.edges
  });
};
