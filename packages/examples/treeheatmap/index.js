import { TreeHeatmap } from '@candela/treeheatmap';
import { heatmap } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(TreeHeatmap, {
    data: heatmap,
    scale: 'column'
  });
  vis.render();
};
