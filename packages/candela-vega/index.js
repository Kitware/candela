import candela from 'candela';

import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';
import ScatterPlotMatrix from './ScatterPlotMatrix';

const components = [
  BarChart,
  ScatterPlot,
  ScatterPlotMatrix
];

components.forEach(entry => candela.registerComponent(entry.name, entry));
