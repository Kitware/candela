import { TreeHeatmap } from '@candela/treeheatmap';
import { heatmap } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  const vis = showComponent(TreeHeatmap, {
    data: heatmap,
    scale: 'column'
  });
  vis.render();
};
