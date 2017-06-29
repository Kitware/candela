import test from 'tape-catch';

import candela from '../..';
import { contentTests } from '../exportTest';

import { content as mixinContent } from '../../plugins/mixin/test/exports';
import { content as geojsContent } from '../../plugins/geojs/test/exports';
import { content as gloContent } from '../../plugins/glo/test/exports';
import { content as lineupContent } from '../../plugins/lineup/test/exports';
import { content as onsetContent } from '../../plugins/onset/test/exports';
import { content as sententreeContent } from '../../plugins/sententree/test/exports';
import { content as similaritygraphContent } from '../../plugins/similaritygraph/test/exports';
import { content as trackerdashContent } from '../../plugins/trackerdash/test/exports';
import { content as treeheatmapContent } from '../../plugins/treeheatmap/test/exports';
import { content as upsetContent } from '../../plugins/upset/test/exports';
import { content as vegaContent } from '../../plugins/vega/test/exports';

const requireBuilt = require.context('../../dist', false, /\.js$/);

function structureTests (t, cd, opts) {
  t.ok(cd, 'candela exists');

  t.ok(cd.components, 'candela.components exists');
  t.equal(typeof cd.components, 'object', 'candela.components is an object');

  if (opts.empty) {
    t.equal(Object.keys(cd.components).length, 0, 'candela.components is empty');
  } else {
    const allPluginContent = [
      geojsContent,
      gloContent,
      lineupContent,
      onsetContent,
      sententreeContent,
      similaritygraphContent,
      trackerdashContent,
      treeheatmapContent,
      upsetContent,
      vegaContent
    ];

    const count = allPluginContent.map(c => c.length).reduce((x, y) => x + y);
    allPluginContent.forEach(content => {
      content.forEach(item => {
        t.ok(cd.components[item], `candela.components.${item} exists`);
        t.equal(typeof cd.components[item], 'function', `candela.components.${item} is a function`);
      });
    });

    t.equal(Object.keys(cd.components).length, count, 'candela.components contains no other items');
  }

  t.ok(cd.register, 'candela.register exists');
  t.equal(typeof cd.register, 'function', 'candela.register is a function');

  t.ok(cd.unregister, 'candela.unregister exists');
  t.equal(typeof cd.unregister, 'function', 'candela.unregister is a function');

  t.ok(cd.unregisterAll, 'candela.unregisterAll exists');
  t.equal(typeof cd.unregisterAll, 'function', 'candela.unregisterAll is a function');

  t.ok(cd.mixins, 'candela.mixins exists');
  t.equal(typeof cd.mixins, 'object', 'candela.mixins is an object');

  if (opts.empty) {
    t.equal(Object.keys(cd.mixins).length, 0, 'candela.mixins is empty');
  } else {
    mixinContent.forEach(mixin => {
      t.ok(cd.mixins[mixin], `candela.mixins.${mixin} exists`);
      t.equal(typeof cd.mixins[mixin], 'function', `candela.mixins.${mixin} is a function`);
    });

    t.equal(Object.keys(cd.mixins).length, mixinContent.length, 'candela.mixins contains no other items');
  }

  t.ok(cd.registerMixin, 'candela.registerMixin exists');
  t.equal(typeof cd.registerMixin, 'function', 'candela.registerMixin is a function');

  t.ok(cd.unregisterMixin, 'candela.unregisterMixin exists');
  t.equal(typeof cd.unregisterMixin, 'function', 'candela.unregisterMixin is a function');

  t.ok(cd.unregisterMixinAll, 'candela.unregisterMixinAll exists');
  t.equal(typeof cd.unregisterMixinAll, 'function', 'candela.unregisterMixinAll is a function');

  t.ok(cd.VisComponent, 'candela.VisComponent exists');
  t.equal(typeof cd.VisComponent, 'function', 'candela.VisComponent is a function');

  t.equal(Object.keys(cd).length, 9, 'candela contains no other members');
}

test('Structure and content of exported Candela library object', t => {
  structureTests(t, candela, {
    empty: true
  });
  t.end();
});

const testBundle = (bundle, title, runTests, opts) => {
  test(title, t => {
    let built = requireBuilt(`./${bundle}`);
    if (built) {
      t.ok(built, `The bundle ${bundle} exists`);
      runTests(t, built, opts);
    } else {
      t.fail(`Bundle file ${bundle} does not exist (run \`npm run build\` to build it)`);
    }

    t.end();
  });
};

// Use the structureTest() function above to verify the contents of the
// candela-all[.min].js file.
testBundle('candela-all.js', 'Structure and content of unminified Candela library file', structureTests, {empty: false});
testBundle('candela-all.min.js', 'Structure and content of minified Candela library file', structureTests, {empty: false});
