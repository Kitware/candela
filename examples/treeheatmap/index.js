import candela from 'candela';
import 'candela/dist/treeheatmap.min.js';

import { heatmap } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  const vis = showComponent(candela.components.TreeHeatmap, {
    data: heatmap,
    scale: 'column'
  });
  vis.render();
};
