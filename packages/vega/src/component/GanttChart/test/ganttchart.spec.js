import { select } from 'd3-selection';
import test from 'tape-catch';

import GanttChart from '..';

test('GanttChart component', t => {
  const data = [
    {name: '1. Algorithms', level: 1, enter: 0, leave: 6},
    {name: 'Algorithm Specification', level: 2, enter: 0, leave: 2},
    {name: 'Algorithm Implementation', level: 2, enter: 1, leave: 6},
    {name: '2. Software Prototype', level: 1, enter: 1, leave: 8},
    {name: 'Support Data Formats', level: 2, enter: 1, leave: 3},
    {name: 'Modular Analyses/Workflows', level: 2, enter: 3, leave: 5},
    {name: 'Web Interface and Mockups', level: 2, enter: 5, leave: 8},
    {name: '3. Evaluation and Team-Building', level: 1, enter: 0, leave: 9},
    {name: 'Data Collection', level: 2, enter: 0, leave: 2},
    {name: 'Algorithmic Evaluation', level: 2, enter: 6, leave: 8},
    {name: 'Usability Evaluation', level: 2, enter: 7, leave: 9},
    {name: 'Final Report', level: 2, enter: 8, leave: 9}
  ];

  let el = document.createElement('div');
  let vis = new GanttChart(el, {
    data,
    start: 'enter',
    end: 'leave',
    label: 'name',
    level: 'level',
    tickCount: 10,
    axisTitle: 'Month',
    width: 500,
    height: 300,
    renderer: 'svg'
  });
  vis.render();

  const bars = select(vis.el)
    .select('.mark-rect.role-mark.marks')
    .selectAll('path')
    .nodes();
  t.equal(bars.length, 12, 'Chart has correct number of bars');

  const labelAxis = select(vis.el)
    .selectAll('.mark-group.role-axis')
    .nodes();

  const labels = select(labelAxis[2])
    .select('.mark-text.role-axis-label')
    .selectAll('text')
    .nodes()
    .map((el) => el.textContent);

  labels.forEach((label, i) => {
    t.deepEqual(label, data[i].name, `Chart has correct label for item ${i}`);
  });

  t.end();
});
