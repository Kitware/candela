import { heatmap } from '../util/datasets';
import showComponent from '../util/showComponent';
import TreeHeatmap from '../../../components/TreeHeatmap';

window.onload = () => {
  showComponent(TreeHeatmap, 'div', {
    data: heatmap
  });
};
