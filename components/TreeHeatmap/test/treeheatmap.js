import test from 'tape-catch';
import TreeHeatmap from '..';

test('TreeHeatmap component ', t => {
  t.equal(TreeHeatmap.options[0].type, 'table');

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

  vis = new TreeHeatmap(el, {data: [{_id: 0, a: 0}]});
  vis.render();
  t.equal(el.childNodes.length, 1, 'single row and column should produce something');
  console.log(el.innerHTML);
  let single = document.createElement('div');
  single.innerHTML = '<svg width="400px" height="400px"><clipPath id="clip-rect"><rect x="100" y="100" width="200" height="200"></rect></clipPath><g clip-path="url(#clip-rect)"><rect class="datum" fill="rgb(255, 255, 255)" x="100" y="100" opacity="1" width="200" height="200"></rect></g><clipPath id="clip-row-labels"><rect x="300" y="100" width="100" height="200"></rect></clipPath><g clip-path="url(#clip-row-labels)"><text class="row-label" color="black" font-size="10px" alignment-baseline="middle" x="300" y="200">0</text></g><clipPath id="clip-col-labels"><rect x="100" y="300" width="200" height="100"></rect></clipPath><g clip-path="url(#clip-col-labels)"><g transform="translate(200,300)" class="col-label"><text color="black" font-size="10px" transform="rotate(-90)" text-anchor="end" alignment-baseline="middle">a</text></g></g></svg>';
  t.ok(el.isEqualNode(single), 'single row and column produce the right graphics');

  vis = new TreeHeatmap(el, {
    data: [
      {_id: 0, a: 0, b: 1, _cluster: 2, _child1: 0, _child2: 1, _distance: 0.5, _size: 2},
      {_id: 1, a: 1, b: 0},
      {_id: '_cluster', a: 2},
      {_id: '_child1', a: 0},
      {_id: '_child2', a: 1},
      {_id: '_distance', a: 0.5},
      {_id: '_size', a: 2}
    ]});
  vis.render();
  t.equal(el.childNodes.length, 1, 'two rows and columns should produce something');
  console.log(el.innerHTML);
  let two = document.createElement('div');
  two.innerHTML = '<svg width="400px" height="400px"><clipPath id="clip-rect"><rect x="100" y="100" width="200" height="200"></rect></clipPath><g clip-path="url(#clip-rect)"><rect class="datum" fill="rgb(255, 255, 255)" x="100" y="100" opacity="1" width="100" height="100"></rect><rect class="datum" fill="rgb(70, 130, 180)" x="200" y="100" opacity="1" width="100" height="100"></rect><rect class="datum" fill="rgb(70, 130, 180)" x="100" y="200" opacity="1" width="100" height="100"></rect><rect class="datum" fill="rgb(255, 255, 255)" x="200" y="200" opacity="1" width="100" height="100"></rect></g><clipPath id="clip-row-labels"><rect x="300" y="100" width="100" height="200"></rect></clipPath><g clip-path="url(#clip-row-labels)"><text class="row-label" color="black" font-size="10px" alignment-baseline="middle" x="300" y="150">0</text><text class="row-label" color="black" font-size="10px" alignment-baseline="middle" x="300" y="250">1</text></g><clipPath id="clip-col-labels"><rect x="100" y="300" width="200" height="100"></rect></clipPath><g clip-path="url(#clip-col-labels)"><g transform="translate(150,300)" class="col-label"><text color="black" font-size="10px" transform="rotate(-90)" text-anchor="end" alignment-baseline="middle">a</text></g><g transform="translate(250,300)" class="col-label"><text color="black" font-size="10px" transform="rotate(-90)" text-anchor="end" alignment-baseline="middle">b</text></g></g><clipPath id="clip-vertical"><rect x="0" y="100" width="100" height="200"></rect></clipPath><g class="vertical" clip-path="url(#clip-vertical)"><path class="tree-links" d="M100,150L0,150L0,250L100,250" style="fill-opacity: 0; stroke: #000000;"></path><rect class="tree-select" x="0" y="100" width="100" height="200" style="fill: #4682b4; fill-opacity: 0;"></rect></g><clipPath id="clip-horizontal"><rect x="100" y="0" width="200" height="100"></rect></clipPath><g class="horizontal" clip-path="url(#clip-horizontal)"><path class="tree-links" d="M150,100L150,0L250,0L250,100" style="fill-opacity: 0; stroke: #000000;"></path><rect class="tree-select" y="0" x="100" height="100" width="200" style="fill: #4682b4; fill-opacity: 0;"></rect></g></svg>';
  t.ok(el.isEqualNode(two), 'two rows and columns produce the right graphics');

  t.end();
});
