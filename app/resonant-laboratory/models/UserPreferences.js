import MetadataItem from './MetadataItem';
import { Set } from '../shims/SetOps.js';

let UserPreferences = MetadataItem.extend({
  /*
    resetToDefaults doesn't work unless defaults
    is a function. If defaults are a simple object,
    changes to the model mutate the defaults object.
  */
  defaults: () => {
    return {
      name: 'Resonant Laboratory Preferences',
      description: `
Contains your preferences for the Resonant Laboratory application. If
you move or delete this item, your preferences will be lost.`,
      meta: {
        rlab: {
          seenTips: {},
          achievements: {}
        }
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
  fetch: function () {
    return MetadataItem.prototype.fetch.apply(this, arguments)
      .catch(() => {
        // Fallback: attempt to retrieve the user's preferences from localStorage
        this.setMeta('seenTips', window.localStorage.getItem('seenTips') || {});
        this.setMeta('achievements', window.localStorage.getItem('achievements') || {});
      });
  },
  save: function () {
    return MetadataItem.prototype.save.apply(this, arguments)
      .catch(() => {
        // Fallback: store the user's preferences in localStorage
        let seenTips = this.getMeta('seenTips') || {};
        window.localStorage.setItem('seenTips', JSON.stringify(seenTips));
        let achievements = this.getMeta('achievements') || {};
        window.localStorage.setItem('achievements', JSON.stringify(achievements));
      });
  },
  addListeners: function () {
    this.listenTo(window.mainPage.currentUser, 'rl:login',
      this.adoptScratchProjects);
    this.stopListening(window.mainPage, 'rl:createProject');
    this.listenTo(window.mainPage, 'rl:createProject',
      this.claimProject);
    this.stopListening(window.mainPage, 'rl:changeProject');
    this.listenTo(window.mainPage, 'rl:changeProject',
      this.addProjectListeners);
    this.addProjectListeners();
  },
  addProjectListeners: function () {
    if (window.mainPage.project) {
      this.stopListening(window.mainPage.project, 'rl:swappedId');
      this.listenTo(window.mainPage.project, 'rl:swappedId',
        this.handleCopiedProject);
      this.stopListening(window.mainPage.project, 'rl:swappedDatasetId');
      this.listenTo(window.mainPage.project, 'rl:swappedDatasetId',
        this.handleCopiedDataset);
    }
  },
  handleCopiedProject: function () {
    // Once we know the change in status (e.g. the ID can swap if a copy is
    // made), display a notification about where the project was moved.
    // Because we're now working on a copy, we should also fire the project
    // creation event
    window.mainPage.project.updateStatus();
    window.mainPage.project.cache.status.then(status => {
      let notification = 'You are now working on a copy of this project in ';
      if (status.visibility === 'PublicScratch') {
        notification += 'the public scratch space. Log in to take ownership of this project.';
      } else if (status.visibility === 'PrivateUser') {
        notification += 'your Private folder.';
      } else {
        window.mainPage.trigger('rl:error', new Error('Project copied to an unknown location.'));
      }
      window.mainPage.notificationLayer.displayNotification(notification);
      window.mainPage.trigger('rl:createProject');
    });
  },
  handleCopiedDataset: function () {
    // TODO: display a notification, like the one for the copied project
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
  updateScratchProjects: function (validatedProjects) {
    window.localStorage.setItem('scratchProjects',
      JSON.stringify(validatedProjects.map(d => d['_id'])));
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
      let attemptedAdoptions = JSON.parse(scratchProjects).length;
      window.mainPage.girderRequest({
        path: 'item/anonymousAccess/adoptScratchItems',
        data: {
          'ids': scratchProjects // already JSON.stringified
        },
        type: 'PUT'
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
        window.mainPage.notificationLayer.displayNotification(
          'Moved ' + successfulAdoptions.length + ' of ' +
          attemptedAdoptions + ' projects that you ' +
          'were working on when you were logged out ' +
          'to your Private folder',
          successfulAdoptions.length === attemptedAdoptions ? undefined : 'error');
        window.localStorage.clear('scratchProjects');

        datasetIds = [...datasetIds];
        attemptedAdoptions = datasetIds.length;

        window.mainPage.girderRequest({
          path: 'item/anonymousAccess/adoptScratchItems',
          data: {
            'ids': JSON.stringify(datasetIds)
          },
          type: 'PUT'
        }).then(successfulAdoptions => {
          window.mainPage.notificationLayer.displayNotification(
            'Moved ' + successfulAdoptions.length + ' of ' +
            attemptedAdoptions + ' datasets that you ' +
            'were working on when you were logged out ' +
            'to your Private folder',
            successfulAdoptions.length === attemptedAdoptions ? undefined : 'error');
          window.mainPage.currentUser.trigger('rl:updateLibrary');
          // In addition to changing the user's library, the current
          // project will (pretty much always) have just changed
          // as well
          if (window.mainPage.project) {
            window.mainPage.project.updateStatus();
          }
        }).catch(() => {
          window.mainPage.notificationLayer.displayNotification(
            'Could not restore datasets from when you were logged out', 'error');
        });
      }).catch(() => {
        window.localStorage.clear('scratchProjects');
        window.mainPage.notificationLayer.displayNotification(
          'Could not restore projects from when you were logged out', 'error');
      });
    }
  },
  hasSeenTip: function (tip) {
    let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
    return this.getMeta('seenTips')[tipId] === true;
  },
  hasSeenAllTips: function (tips) {
    let seenTips = this.getMeta('seenTips') || {};
    for (let tip of tips) {
      let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
      if (seenTips[tipId] !== true) {
        return false;
      }
    }
    return true;
  },
  observeTip: function (tip) {
    let seenTips = this.getMeta('seenTips') || {};
    // Make the id a valid / nice mongo id
    let tipId = tip.selector.replace(/[^a-zA-Z\d]/g, '').toLowerCase();
    seenTips[tipId] = true;

    this.setMeta('seenTips', seenTips);
    this.trigger('rl:observeTips');
    this.save();
  },
  forgetTips: function (tips) {
    let seenTips = this.getMeta('seenTips') || {};
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
    let achievements = this.getMeta('achievements') || {};
    if (achievements[achievement] !== true) {
      achievements[achievement] = true;
      this.setMeta('achievements', achievements);
      this.save(); // fail silently
      this.trigger('rl:levelUp');
    }
  }
});

export default UserPreferences;
