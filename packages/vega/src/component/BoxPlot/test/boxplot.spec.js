import { select } from 'd3-selection';
import test from 'tape-catch';

import BoxPlot from '..';

test('BoxPlot component', t => {
  const data = [...Array(20).keys()].map(i => ({
    a: `Field ${i % 3}`,
    b: i,
    c: i * i
  }));
  const width = 400;
  const height = 450;
  const fields = ['b', 'c'];

  let el = document.createElement('div');
  let vis = new BoxPlot(el, {
    data,
    fields,
    x: 'a',
    width,
    height,
    renderer: 'svg'
  });
  vis.render();

  const titles = select(vis.el)
    .selectAll('.mark-text.role-title')
    .selectAll('text')
    .nodes()
    .map((el) => el.textContent);

  t.deepEqual(titles, fields, 'Section titles should match requested fields');

  const labels = select(vis.el)
    .select('.mark-group.role-column-footer.column_footer')
    .select('.mark-text.role-axis-label')
    .selectAll('text')
    .nodes()
    .map((el) => el.textContent);

  t.deepEqual(labels, [0, 1, 2].map(i => `Field ${i}`), 'x-axis labels should match categorical field names');

  const layers = [0, 1, 2, 3].map(i => select(vis.el)
    .select(`.role-mark.child_layer_${i}_marks`)
    .selectAll('*')
    .nodes()
    .length);

  t.ok(layers.every(x => x === 3), 'Plot has correct number of boxplot marks');

  t.end();
});
