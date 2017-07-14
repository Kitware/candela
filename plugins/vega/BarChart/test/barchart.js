import { select } from 'd3-selection';
import test from 'tape-catch';

import BarChart from '..';

test('BarChart component', t => {
  t.plan(5);

  const data = [
    {id: 0, a: 1, b: 3, c: 3},
    {id: 1, a: 10, b: 4, c: 3},
    {id: 2, a: 7, b: 6, c: 3},
    {id: 3, a: 4, b: 2, c: 3},
    {id: 4, a: 5, b: 5, c: 3},
    {id: 5, a: 7, b: 6, c: 3},
    {id: 6, a: 2, b: 9, c: 3},
    {id: 7, a: 5, b: 7, c: 3}
  ];

  let el = document.createElement('div');
  let vis = new BarChart(el, {
    data: data,
    x: 'id',
    y: 'a',
    color: 'b',
    width: 625,
    height: 540,
    renderer: 'svg'
  });
  vis.render();

  t.equal(el.childNodes.length, 2, 'VegaViews should have two elements under the top-level div');

  let svg = el.childNodes[0];
  t.equal(svg.nodeName, 'SVG', 'The first element should be an SVG');

  let bars = select(svg)
    .select('g.mark-rect')
    .selectAll('rect');
  t.equal(bars.size(), data.length, 'The number of bars in the chart should equal the number of data items');

  vis.update({
    data: data.concat([{id: 8, a: 10, b: 6, c: 3}])
  })
  .then(() => vis.render())
  .then(() => {
    bars = select(svg)
      .select('g.mark-rect')
      .selectAll('rect');
    t.equal(bars.size(), data.length + 1, 'After data update, the number of bars in the chart should equal the original number of data items, plus one');

    vis.destroy();
    let contents = select(vis.el).selectAll('*');
    t.equal(contents.size(), 0, 'After destroy(), container element should have no children');
  });
});
