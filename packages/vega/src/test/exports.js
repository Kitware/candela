import { exportTest } from 'candela/test/util/exportTest';

export const content = [
  'BarChart',
  'BoxPlot',
  'GanttChart',
  'Histogram',
  'LineChart',
  'ScatterPlot',
  'ScatterPlotMatrix'
];

exportTest('vega', content);
