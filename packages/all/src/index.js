import * as core from '@candela/core';
import * as events from '@candela/events';
import * as geojs from '@candela/geojs';
import * as glo from '@candela/glo';
import * as lineup from '@candela/lineup';
import * as onset from '@candela/onset';
import * as sententree from '@candela/sententree';
import * as similaritygraph from '@candela/similaritygraph';
import * as size from '@candela/size';
import * as stats from '@candela/stats';
import * as treeheatmap from '@candela/treeheatmap';
import * as upset from '@candela/upset';
import * as vega from '@candela/vega';

function load (obj, target) {
  for (let prop in obj) {
    target[prop] = obj[prop];
  }
}

// Collect all candela components into a single object.
let components = {};
for (let bundle of [geojs, glo, lineup, onset, sententree, similaritygraph, stats, treeheatmap, upset]) {
  load(bundle, components);
}
for (let component in vega) {
  if (vega[component] !== vega.VegaView) {
    components[component] = vega[component]
  }
}

// Collect all candela mixings into a single object.
let mixins = {};
for (let bundle of [events, size]) {
  load(bundle, mixins);
}
mixins.VegaView = vega.VegaView;

let VisComponent = core.VisComponent;

// Export everything, both as default...
export default {
  VisComponent,
  components,
  mixins
};

// ...and non-default.
export {
  VisComponent,
  components,
  mixins
};
