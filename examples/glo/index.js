import candela from 'candela';
import 'candela-glo';

import { lesmis } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  let glo = showComponent(candela.components.Glo, {
    width: '100vw',
    height: '100vh',
    nodes: lesmis.nodes,
    edges: lesmis.edges
  });
  glo.render();

  window.setTimeout(() => {
    glo.positionNodes('rho', 300);
  }, 1000);

  window.setTimeout(() => {
    glo.distributeNodes('theta', 'modularity_class');
  }, 2000);

  window.setTimeout(() => {
    glo.colorNodesDiscrete('modularity_class');
  }, 3000);

  window.setTimeout(() => {
    glo.curvedEdges();
  }, 4000);

  window.setTimeout(() => {
    glo.sizeNodes('degree');
  }, 5000);

  window.setTimeout(() => {
    glo.incidentEdges();
  }, 6000);
};
