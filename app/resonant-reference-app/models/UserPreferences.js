import MetadataItem from './MetadataItem';
import Toolchain from './Toolchain';

let girder = window.girder;

let WIDGET_STATUS = {
  NOT_EARNED: 0,
  MINIMIZED: 1,
  OPEN: 2,
  REMOVED: 3
};

let UserPreferences = MetadataItem.extend({
  defaults: {
    name: 'rra_preferences',
    description: `
      Contains your preferences for the Reference application. If
      you move or delete this item, your preferences will be lost.`,
    meta: {
      widgets: [
        {
          viewName: 'singleDatasetView',
          status: WIDGET_STATUS.OPEN
        },
        {
          viewName: 'mappingView',
          status: WIDGET_STATUS.OPEN
        },
        {
          viewName: 'singleVisualizationView',
          status: WIDGET_STATUS.OPEN
        }
      ],
      // currentToolchain is either null,
      // or is an item ID
      currentToolchain: null
    }
  },
  initialize: function () {
    let self = this;

    // Start with the empty, default toolchain
    self.toolchain = new Toolchain();
  },
  resetToDefaults: function () {
    let self = this;
    // The user has logged out, or some other authentication
    // problem is going on. This sets the app to the initial
    // empty state as if no one is logged in
    self.girderResource = undefined;
    self.clear({
      silent: true
    });
    self.toolchain = new Toolchain();
    self.set(self.defaults);
    self.trigger('rra:prefsChanged');
  },
  fetchOrCreate: function () {
    let self = this;
    // Get the user's preferences Item in their Private folder
    // (this creates both if they're missing)
    girder.restRequest({
      path: 'user/rraPreferences',
      error: self.resetToDefaults
    }).done(function (resp) {
      if (resp === null) {
        self.resetToDefaults();
      } else {
        if (resp.currentToolchain !== null) {
          // Okay, we *might* want to switch to the
          // last toolchain the user was working on...
          // but if they started working on something and
          // THEN logged in, we don't want to nuke their
          // work
          if (self.toolchain.isEmpty()) {
            self.toolchain = new Toolchain({
              '_id': resp.currentToolchain
            });
            self.toolchain.fetch().done(() => {
              self.trigger('rra:prefsChanged');
            });
          }
        }
        // Override any other existing settings with anything
        // in the user's prefs from the server
        // (does nothing if this is the first time they've
        // logged in... then we just stick with the defaults)
        self.set(resp);
        self.trigger('rra:prefsChanged');
      }
    });
  }
});

export default UserPreferences;
