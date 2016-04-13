import MetadataItem from './MetadataItem';

let girder = window.girder;

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
        achievements: {}
      }
    };
  },
  addListeners: function () {
    let self = this;
    self.listenTo(window.mainPage.currentUser, 'rra:login',
      self.adoptScratchToolchains);
    self.listenTo(window.mainPage, 'rra:createToolchain',
      self.claimToolchain);
  },
  claimToolchain: function () {
    if (!window.mainPage.currentUser.isLoggedIn()) {
      // Because we created this toolchain while not logged in,
      // store the toolchain's ID in localStorage so that we
      // can claim "ownership" when we log in / visit this page again
      // (of course, this is easy to hack, but that's the assumption
      // with public scratch space)
      let scratchToolchains = window.localStorage.getItem('scratchToolchains');
      if (!scratchToolchains) {
        scratchToolchains = [];
      } else {
        scratchToolchains = JSON.parse(scratchToolchains);
      }
      scratchToolchains.push(window.mainPage.toolchain.getId());
      window.localStorage.setItem('scratchToolchains',
        JSON.stringify(scratchToolchains));
    }
  },
  adoptScratchToolchains: function () {
    if (!window.mainPage.currentUser.isLoggedIn()) {
      return;
    }
    // Attempt to adopt any toolchains that this browser
    // created in the public scratch space into the
    // now-logged-in user's Private folder
    
    let scratchToolchains = window.localStorage.getItem('scratchToolchains');
    
    if (scratchToolchains) {
      Promise.resolve(girder.restRequest({
        path: 'item/adoptScratchItems',
        data: {
          'ids': scratchToolchains // already JSON.stringified
        },
        type: 'PUT'
      })).then(() => {
        window.mainPage.currentUser.trigger('rra:updateLibrary');
        // In addition to changing the library, the current
        // toolchain will (pretty much always) have just changed
        // as well
        if (window.mainPage.toolchain) {
          window.mainPage.toolchain.updateStatus();
        }
      });
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
    self.adoptScratchToolchains();
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
