import test from 'tape-catch';

import candela from 'candela';
import * as candelaStar from 'candela';

import { content as mixinContent } from 'candela/plugins/mixin/test/exports';
import { content as geojsContent } from 'candela/plugins/geojs/test/exports';
import { content as gloContent } from 'candela/plugins/glo/test/exports';
import { content as lineupContent } from 'candela/plugins/lineup/test/exports';
import { content as onsetContent } from 'candela/plugins/onset/test/exports';
import { content as sententreeContent } from 'candela/plugins/sententree/test/exports';
import { content as similaritygraphContent } from 'candela/plugins/similaritygraph/test/exports';
import { content as trackerdashContent } from 'candela/plugins/trackerdash/test/exports';
import { content as treeheatmapContent } from 'candela/plugins/treeheatmap/test/exports';
import { content as upsetContent } from 'candela/plugins/upset/test/exports';
import { content as vegaContent } from 'candela/plugins/vega/test/exports';

const requireBuilt = require.context('candela/dist', false, /\.js$/);

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

  let count = 9;
  if (opts.default) {
    t.ok(cd.default, 'candela.default exists');
    count += 1;
  } else {
    t.equal(cd.default, undefined, 'candela.default does not exist');
  }

  t.equal(Object.keys(cd).length, count, 'candela contains no other members');
}

test('Structure and content of default exported Candela library object', t => {
  structureTests(t, candela, {
    empty: true,
    default: false
  });
  t.end();
});

test('Structure and content of non-default exported Candela library object', t => {
  structureTests(t, candelaStar, {
    empty: true,
    default: true
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
const options = {
  empty: false,
  default: true
};
testBundle('candela-all.js', 'Structure and content of unminified Candela library file', structureTests, options);
testBundle('candela-all.min.js', 'Structure and content of minified Candela library file', structureTests, options);
