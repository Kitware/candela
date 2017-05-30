import candela from 'candela';

import BarChart from './BarChart';
import BoxPlot from './BoxPlot';
import BulletChart from './BulletChart';
import GanttChart from './GanttChart';
import Heatmap from './Heatmap';
import Histogram from './Histogram';
import ScatterPlot from './ScatterPlot';
import ScatterPlotMatrix from './ScatterPlotMatrix';
import SurvivalPlot from './SurvivalPlot';

const components = [
  BarChart,
  BoxPlot,
  BulletChart,
  GanttChart,
  Heatmap,
  Histogram,
  ScatterPlot,
  ScatterPlotMatrix,
  SurvivalPlot
];

components.forEach(entry => candela.registerComponent(entry.name, entry));
