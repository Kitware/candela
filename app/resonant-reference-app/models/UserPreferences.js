import MetadataItem from './MetadataItem';
import {
  Set
}
from '../shims/SetOps.js';
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
        showHelp: false,
        seenTips: {},
        achievements: {}
      }
    };
  },
  initialize: function () {
    let seenTips = window.localStorage.getItem('seenTips');
    if (seenTips) {
      this.setMeta('seenTips', JSON.parse(seenTips));
    }
    let achievements = window.localStorage.getItem('achievements');
    if (achievements) {
      this.setMeta('achievements', JSON.parse(achievements));
    }
  },
  save: function () {
    return MetadataItem.prototype.save.apply(this, arguments)
      .catch(() => {
        // Fallback: store the user's preferences in localStorage
        let seenTips = this.getMeta('seenTips');
        if (seenTips) {
          window.localStorage.setItem('seenTips', JSON.stringify(seenTips));
        }
        let achievements = this.getMeta('achievements');
        if (achievements) {
          window.localStorage.setItem('achievements', JSON.stringify(achievements));
        }
      });
  },
  addListeners: function () {
    this.listenTo(window.mainPage.currentUser, 'rra:login',
      this.adoptScratchToolchains);
    this.listenTo(window.mainPage, 'rra:createToolchain',
      this.claimToolchain);
  },
  claimToolchain: function () {
    if (!window.mainPage.currentUser.isLoggedIn()) {
      // Because we created this toolchain while not logged in,
      // store the toolchain's ID in window.localStorage so that we
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
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'item/adoptScratchItems',
          data: {
            'ids': scratchToolchains // already JSON.stringified
          },
          error: reject,
          type: 'PUT'
        }).done(resolve).error(reject);
      }).then(successfulAdoptions => {
        // Now we need to adopt any datasets that these toolchains refer to
        let datasetIds = new Set();
        successfulAdoptions.forEach(adoptedToolchain => {
          if (adoptedToolchain.meta && adoptedToolchain.meta.datasets) {
            adoptedToolchain.meta.datasets.forEach(datasetId => {
              datasetIds.add(datasetId);
            });
          }
        });

        new Promise((resolve, reject) => {
          girder.restRequest({
            path: 'item/adoptScratchItems',
            data: {
              'ids': JSON.stringify([...datasetIds])
            },
            error: reject,
            type: 'PUT'
          });
        }).catch(() => {
          // For now, silently ignore failures to adopt datasets
          window.localStorage.clear('scratchToolchains');
        }).then(() => {
          window.mainPage.currentUser.trigger('rra:updateLibrary');
          // In addition to changing the user's library, the current
          // toolchain will (pretty much always) have just changed
          // as well
          if (window.mainPage.toolchain) {
            window.mainPage.toolchain.updateStatus();
          }
        });
      }).catch(() => {
        // For now, silently ignore failures to adopt toolchains
        window.localStorage.clear('scratchToolchains');
      });
    }
  },
  hasSeenAllTips: function (tips) {
    let seenTips = this.getMeta('seenTips');
    for (let selector of Object.keys(tips)) {
      let tipId = selector + tips[selector];
      // Make the id a valid / nice mongo id
      tipId = tipId.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
      if (seenTips[tipId] !== true) {
        return false;
      }
    }
    return true;
  },
  observeTips: function (tips) {
    let seenTips = this.getMeta('seenTips');
    for (let selector of Object.keys(tips)) {
      let tipId = tips[selector].tipId;
      // Make the id a valid / nice mongo id
      tipId = tipId.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
      seenTips[tipId] = true;
    };
    this.setMeta('seenTips', seenTips);
    this.trigger('rra:observeTips');
    this.save();
  },
  resetToDefaults: function () {
    // The user has logged out, or some other authentication
    // problem is going on. This sets the app to the initial
    // empty state as if no one is logged in
    this.clear({
      silent: true
    });
    this.set(this.defaults());
    window.localStorage.removeItem('seenTips');
    window.localStorage.removeItem('achievements');
    window.localStorage.removeItem('scratchToolchains');
  },
  levelUp: function (achievement) {
    let achievements = this.getMeta('achievements');
    if (achievements[achievement] !== true) {
      achievements[achievement] = true;
      this.setMeta('achievements', achievements);
      this.save().catch(() => {}); // fail silently
      this.trigger('rra:levelUp');
    }
  }
});

export default UserPreferences;
