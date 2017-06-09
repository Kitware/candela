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

function structureTests (t, cd) {
  t.ok(cd, 'candela exists');

  t.ok(cd.components, 'candela.components exists');
  t.equal(typeof cd.components, 'object', 'candela.components is an object');

  t.ok(cd.register, 'candela.register exists');
  t.equal(typeof cd.register, 'function', 'candela.register is a function');

  t.ok(cd.unregister, 'candela.unregister exists');
  t.equal(typeof cd.unregister, 'function', 'candela.unregister is a function');

  t.ok(cd.unregisterAll, 'candela.unregisterAll exists');
  t.equal(typeof cd.unregisterAll, 'function', 'candela.unregisterAll is a function');

  t.ok(cd.mixins, 'candela.mixins exists');
  t.equal(typeof cd.mixins, 'object', 'candela.mixins is an object');

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
  structureTests(t, candela);
  t.end();
});

const testBundle = (bundle, title, cond, runTests) => {
  test(title, t => {
    if (cond) {
      candela.unregisterAll();
      candela.unregisterMixinAll();

      let built = requireBuilt(`./${bundle}`);
      t.ok(built, `The bundle ${bundle} exists`);
      runTests(t, built);
    } else {
      t.fail(`Bundle file ${bundle} does not exist (run \`npm run build\` to build it)`);
    }

    t.end();
  });
};

// Use the structureTest() function above to verify the contents of the
// candela[.min].js file.
testBundle('candela.js', 'Structure and content of unminified Candela library file', CANDELA_JS, structureTests);
testBundle('candela.min.js', 'Structure and content of minified Candela library file', CANDELA_MIN_JS, structureTests);

// Test the mixin bundle using the utility function contentTests().
const mixinContentTests = (t) => {
  contentTests(t, candela.mixins, mixinContent, 'candela.mixins');
}
testBundle('mixin.js', 'Structure and content of unminified Candela mixin library file', MIXIN_JS, mixinContentTests);
testBundle('mixin.min.js', 'Structure and content of minified Candela mixin library file', MIXIN_MIN_JS, mixinContentTests);

// Create an abstraction to generate component bundle tests.
const contentTestGenerator = (content) => (t) => contentTests(t, candela.components, content, 'candela.components');

// Test geojs bundle.
testBundle('geojs.js', 'Structure and content of unminified Candela geojs library file', MIXIN_JS, contentTestGenerator(geojsContent));
testBundle('geojs.min.js', 'Structure and content of minified Candela geojs library file', MIXIN_MIN_JS, contentTestGenerator(geojsContent));

// Test glo bundle.
testBundle('glo.js', 'Structure and content of unminified Candela glo library file', GLO_JS, contentTestGenerator(gloContent));
testBundle('glo.min.js', 'Structure and content of minified Candela glo library file', GLO_MIN_JS, contentTestGenerator(gloContent));

// Test lineup bundle.
testBundle('lineup.js', 'Structure and content of unminified Candela lineup library file', LINEUP_JS, contentTestGenerator(lineupContent));
testBundle('lineup.min.js', 'Structure and content of minified Candela lineup library file', LINEUP_MIN_JS, contentTestGenerator(lineupContent));

// Test onset bundle.
testBundle('onset.js', 'Structure and content of unminified Candela onset library file', ONSET_JS, contentTestGenerator(onsetContent));
testBundle('onset.min.js', 'Structure and content of minified Candela onset library file', ONSET_MIN_JS, contentTestGenerator(onsetContent));

// Test sententree bundle.
testBundle('sententree.js', 'Structure and content of unminified Candela sententree library file', SENTENTREE_JS, contentTestGenerator(sententreeContent));
testBundle('sententree.min.js', 'Structure and content of minified Candela sententree library file', SENTENTREE_MIN_JS, contentTestGenerator(sententreeContent));

// Test similaritygraph bundle.
testBundle('similaritygraph.js', 'Structure and content of unminified Candela similaritygraph library file', SIMILARITYGRAPH_JS, contentTestGenerator(similaritygraphContent));
testBundle('similaritygraph.min.js', 'Structure and content of minified Candela similaritygraph library file', SIMILARITYGRAPH_MIN_JS, contentTestGenerator(similaritygraphContent));

// Test trackerdash bundle.
testBundle('trackerdash.js', 'Structure and content of unminified Candela trackerdash library file', TRACKERDASH_JS, contentTestGenerator(trackerdashContent));
testBundle('trackerdash.min.js', 'Structure and content of minified Candela trackerdash library file', TRACKERDASH_MIN_JS, contentTestGenerator(trackerdashContent));

// Test treeheatmap bundle.
testBundle('treeheatmap.js', 'Structure and content of unminified Candela treeheatmap library file', TREEHEATMAP_JS, contentTestGenerator(treeheatmapContent));
testBundle('treeheatmap.min.js', 'Structure and content of minified Candela treeheatmap library file', TREEHEATMAP_MIN_JS, contentTestGenerator(treeheatmapContent));

// Test upset bundle.
testBundle('upset.js', 'Structure and content of unminified Candela upset library file', UPSET_JS, contentTestGenerator(upsetContent));
testBundle('upset.min.js', 'Structure and content of minified Candela upset library file', UPSET_MIN_JS, contentTestGenerator(upsetContent));

// Test vega bundle.
testBundle('vega.js', 'Structure and content of unminified Candela vega library file', VEGA_JS, contentTestGenerator(vegaContent));
testBundle('vega.min.js', 'Structure and content of minified Candela vega library file', VEGA_MIN_JS, contentTestGenerator(vegaContent));
