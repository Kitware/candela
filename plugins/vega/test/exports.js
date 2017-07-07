import { exportTest } from 'candela/test/util/exportTest';

export const content = [
  'BarChart',
  'BoxPlot',
  'BulletChart',
  'GanttChart',
  'Heatmap',
  'Histogram',
  'LineChart',
  'ScatterPlot',
  'ScatterPlotMatrix',
  'SurvivalPlot'
];

exportTest('vega', content);
