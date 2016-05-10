import test from 'tape';

import clique from '..';

test('Check for all parts of ES5-compatible clique object', t => {
  t.ok(clique, 'clique exists');

  t.ok(clique.adapter, 'clique.adapter exists');
  t.ok(clique.adapter.Adapter, 'clique.adapter.Adapter exists');
  t.ok(clique.adapter.NodeLinkList, 'clique.adapter.NodeLinkList exists');

  t.ok(clique.model, 'clique.model exists');
  t.ok(clique.model.Graph, 'clique.model.Graph exists');
  t.ok(clique.model.Selection, 'clique.model.Selection exists');

  t.ok(clique.util, 'clique.util exists');

  t.ok(clique.view, 'clique.view exists');
  t.ok(clique.view.Cola, 'clique.view.Cola exists');
  t.ok(clique.view.SelectionInfo, 'clique.view.SelectionInfo exists');
  t.ok(clique.view.LinkInfo, 'clique.view.LinkInfo exists');

  t.end();
});
