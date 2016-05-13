import MetadataItem from './MetadataItem';
import { Set } from '../shims/SetOps.js';
let girder = window.girder;

let UserPreferences = MetadataItem.extend({
  /*
    resetToDefaults doesn't work unless defaults
    is a function. If defaults are a simple object,
    changes to the model mutate the defaults object.
  */
  defaults: () => {
    return {
      name: 'rl_preferences',
      description: `
Contains your preferences for the Resonant Laboratory application. If
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
    this.listenTo(window.mainPage.currentUser, 'rl:login',
      this.adoptScratchProjects);
    this.listenTo(window.mainPage, 'rl:createProject',
      this.claimProject);
  },
  claimProject: function () {
    if (!window.mainPage.currentUser.isLoggedIn()) {
      // Because we created this project while not logged in,
      // store the project's ID in window.localStorage so that we
      // can claim "ownership" when we log in / visit this page again
      // (of course, this is easy to hack, but that's the assumption
      // with public scratch space)
      let scratchProjects = window.localStorage.getItem('scratchProjects');
      if (!scratchProjects) {
        scratchProjects = [];
      } else {
        scratchProjects = JSON.parse(scratchProjects);
      }
      scratchProjects.push(window.mainPage.project.getId());
      window.localStorage.setItem('scratchProjects',
        JSON.stringify(scratchProjects));
    }
  },
  adoptScratchProjects: function () {
    if (!window.mainPage.currentUser.isLoggedIn()) {
      return;
    }
    // Attempt to adopt any projects that this browser
    // created in the public scratch space into the
    // now-logged-in user's Private folder

    let scratchProjects = window.localStorage.getItem('scratchProjects');

    if (scratchProjects) {
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'item/adoptScratchItems',
          data: {
            'ids': scratchProjects // already JSON.stringified
          },
          error: reject,
          type: 'PUT'
        }).done(resolve).error(reject);
      }).then(successfulAdoptions => {
        // Now we need to adopt any datasets that these projects refer to
        let datasetIds = new Set();
        successfulAdoptions.forEach(adoptedProject => {
          if (adoptedProject.meta && adoptedProject.meta.datasets) {
            adoptedProject.meta.datasets.forEach(datasetId => {
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
          window.localStorage.clear('scratchProjects');
        }).then(() => {
          window.mainPage.currentUser.trigger('rl:updateLibrary');
          // In addition to changing the user's library, the current
          // project will (pretty much always) have just changed
          // as well
          if (window.mainPage.project) {
            window.mainPage.project.updateStatus();
          }
        });
      }).catch(() => {
        // For now, silently ignore failures to adopt projects
        window.localStorage.clear('scratchProjects');
      });
    }
  },
  hasSeenTip: function (tip) {
    let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
    return this.getMeta('seenTips')[tipId] === true;
  },
  hasSeenAllTips: function (tips) {
    let seenTips = this.getMeta('seenTips');
    for (let tip of tips) {
      let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
      if (seenTips[tipId] !== true) {
        return false;
      }
    }
    return true;
  },
  observeTip: function (tip) {
    let seenTips = this.getMeta('seenTips');
    // Make the id a valid / nice mongo id
    let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
    seenTips[tipId] = true;

    this.setMeta('seenTips', seenTips);
    this.trigger('rl:observeTips');
    this.save();
  },
  forgetTips: function (tips) {
    let seenTips = this.getMeta('seenTips');
    for (let tip of tips) {
      let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
      delete seenTips[tipId];
    }
    this.setMeta('seenTips', seenTips);
    this.trigger('rl:observeTips');
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
    window.localStorage.removeItem('scratchProjects');
  },
  levelUp: function (achievement) {
    let achievements = this.getMeta('achievements');
    if (achievements[achievement] !== true) {
      achievements[achievement] = true;
      this.setMeta('achievements', achievements);
      this.save().catch(() => {
      }); // fail silently
      this.trigger('rl:levelUp');
    }
  }
});

export default UserPreferences;
