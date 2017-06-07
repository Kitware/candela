import test from 'tape-catch';

import candela from 'candela';

const components = [
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

test('Contents of candela-vega micropackage', t => {
  candela.unregisterAll();
  require('candela-vega');

  t.equal(Object.keys(candela.components).length, components.length, `candela-vega exports ${components.length} component${components.length > 1 ? 's' : ''}`);

  components.forEach(comp => {
    t.ok(candela.components[comp], `candela.components.${comp} exists`);
    t.equal(typeof candela.components[comp], 'function', `candela.components.${comp} is a function`);
  });

  t.end();
});
