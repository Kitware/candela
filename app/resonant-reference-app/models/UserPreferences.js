import MetadataItem from './MetadataItem';
import SetOps from '../shims/SetOps';

let UserPreferences = MetadataItem.extend({
  /*
    resetToDefaults doesn't work unless defaults
    is a function. If defaults are a simple object,
    changes to the model mutate the defaults object.
  */
  defaults: () => {
    return {
      name: 'rra_preferences',
      description: `
Contains your preferences for the Reference application. If
you move or delete this item, your preferences will be lost.`,
      meta: {
        recentToolchains: [],
        achievements: {}
      }
    };
  },
  initialize: function () {
    let self = this;
    self.collectScratchToolchains();
  },
  collectScratchToolchains: function () {
    let self = this;
    let recentToolchains = new Set(self.getMeta('recentToolchains'));
    let scratchToolchains = window.localStorage.getItem('scratchToolchains');
    if (scratchToolchains) {
      scratchToolchains = new Set(JSON.parse(scratchToolchains));
      scratchToolchains = SetOps.intersection(recentToolchains, scratchToolchains);
      self.setMeta('recentToolchains', Array.from(scratchToolchains));
    }
  },
  resetToDefaults: function () {
    let self = this;
    // The user has logged out, or some other authentication
    // problem is going on. This sets the app to the initial
    // empty state as if no one is logged in
    self.clear({
      silent: true
    });
    self.set(self.defaults);
    self.collectScratchToolchains();
  },
  addRecentToolchain: function (id) {
    let self = this;
    let recentToolchains = self.getMeta('recentToolchains');
    
    let oldIndex = recentToolchains.indexOf(id);
    if (oldIndex !== -1) {
      recentToolchains.splice(oldIndex, 1);
    }
    
    recentToolchains.unshift(id);
    while (recentToolchains.length > 5) {
      recentToolchains.pop();
    }
    
    self.setMeta('recentToolchains', recentToolchains);
    if (self.getId()) {
      self.save();
    } else {
      // Until the user logs in, store the ids of their
      // scratch toolchains in localStorage
      window.localStorage.setItem('scratchToolchains',
        JSON.stringify(recentToolchains));
    }
  },
  levelUp: function (achievement) {
    let self = this;
    let achievements = self.getMeta('achievements');
    if (achievements[achievement] !== true) {
      achievements[achievement] = true;
      self.setMeta('achievements', achievements);
      self.save();
      self.trigger('rra:levelUp');
    }
  }
});

export default UserPreferences;
