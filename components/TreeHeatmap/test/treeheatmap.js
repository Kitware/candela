import test from 'tape-catch';
import TreeHeatmap from '..';


test('TreeHeatmap component ', t => {
  let el = document.createElement('div');
  let vis = new TreeHeatmap(el);
  vis.render();
  t.equal(el.childNodes.length, 0, 'empty options should do nothing');

  vis = new TreeHeatmap(el, {data: []});
  vis.render();
  t.equal(el.childNodes.length, 0, 'empty data should do nothing');

  vis = new TreeHeatmap(el, {data: [{}]});
  vis.render();
  t.equal(el.childNodes.length, 0, 'no idColumn should do nothing');

  vis = new TreeHeatmap(el, {data: [{_id: 0}]});
  vis.render();
  t.equal(el.childNodes.length, 1, 'single row should produce something');

  vis = new TreeHeatmap(el, {data: [{_id: 0}, {_id: 1}]});
  vis.render();
  t.equal(el.childNodes.length, 1, 'two rows should produce something');

  t.end();
});
