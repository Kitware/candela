import Backbone from 'backbone';
import Toolchain from './Toolchain.js';

let Toolchains = Backbone.Collection.extend({
  initialize: function () {
    // Start out with one toolchain
    let self = this;
    self.push(new Toolchain());
  },
  model: Toolchain
});

/*
    A UserModel describes the current user's
    achievements (aka available tools),
    preferences (which tools are available),
    and saved toolchains.
    
    For now, no specific toolchain saving
    is supported; all interactions that the
    user performs are autosaved in the first
    toolchain (any others are ignored).
    
    In the future, this will likely also include
    authentication / profile information.
*/
let User = Backbone.Model.extend({
  defaults: {
    /*
        If the user has gained access to a view,
        it should exist in this dictionary
        (though it may be hidden because it
        has been replaced by a more advanced
        tool, or per the user's preferences)
    */
    tools: {
      'singleDatasetView': {
        friendlyName: 'Dataset',
        model: 'datasets',
        view: require('../views/widgets/SingleDatasetView/SingleDatasetView.js'),
        hidden: false,
        new: false
      },
      'singleVisualizationView': {
        friendlyName: 'Visualization',
        model: 'visualizations',
        view: require('../views/widgets/SingleVisualizationView/SingleVisualizationView.js'),
        hidden: false,
        new: false
      }
    },
    /*
        The toolchains collection contains
        all the user's saved sessions
        (e.g. specific datasets, with specific
        matchings, to specific visualizations)
    */
    toolchains: new Toolchains(),
    currentToolchain: 0
  },
  set: function (attributes, options) {
    /*
        This will almost always be called by
        functions without access to our local
        Toolchains collection, so we wrap it up here
    */
    if (attributes.toolchains !== undefined &&
      !(attributes.toolchains instanceof Toolchains)) {
      attributes.toolchains = new Toolchains(attributes.toolchains);
    }
    return Backbone.Model.prototype.set.call(this, attributes, options);
  },
  levelUp: function (toolsToAdd, toolsToHide) {
    /*
        This expects two lists of view names.
        The first contains views that the user
        has just "earned" access to, and the
        second includes names of views that
        have been superseded by more advanced
        equivalents (they will be auto-hidden).
    */
    let self = this;
    let tools = self.get('tools');
    let tool;

    for (tool in tools) {
      if (tools.hasOwnProperty(tool)) {
        tools[tool].new = false;
      }
    }

    toolsToAdd.forEach(function (tool) {
      if (!tools.hasOwnProperty(tool)) {
        tools[tool] = {
          hidden: false,
          new: true
        };
      }
    });

    toolsToHide.forEach(function (tool) {
      tools[tool].hidden = true;
    });
  },
  getCurrentToolchain: function () {
    let self = this;
    let currentChain = self.get('currentToolchain');
    // TODO: support multiple toolchains
    // (for now, currentChain will always be zero)
    return self.get('toolchains').at(currentChain);
  },
  addDataset: function (spec) {
    let self = this;
    let toolchain = self.get('toolchains');
    toolchain.add(spec);
    self.trigger('change');
  }
});

module.exports = User;
