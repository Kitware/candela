import Backbone from 'backbone';

var Router = Backbone.Router.extend({
  routes: {
    'toolchain/:toolchain/*widgets': 'loadToolchain',
    '*widgets': 'defaultRoute'
  },
  initialize: function () {
    let self = this;
    self.on('loadToolchain', function (id, widgets) {
      window.mainPage.openToolchain(id, widgets);
    });
    self.on('defaultRoute', function (widgets) {
      window.mainPage.openToolchain(undefined, widgets);
    });

    Backbone.history.start();
  },
  storeInitialRoute: function () {
    let self = this;
    if (window.location.hash.length === 0) {
      self.initialToolchainId = undefined;
      self.initialWidgets = [];
    } else {
      let hashChunks = window.location.hash.substr(1).split('/');
      if (hashChunks.length < 2) {
        self.initialToolchainId = undefined;
        self.initialWidgets = hashChunks[0].split('&');
      } else {
        self.initialToolchainId = hashChunks[1];
        if (hashChunks.length === 2) {
          self.initialWidgets = [];
        } else {
          self.initialWidgets = hashChunks[2].split('&');
        }
      }
    }
  },
  clearInitials: function () {
    let self = this;
    self.initialToolchainId = undefined;
    self.initialWidgets = [];
  },
  getCurrentWidgets: function () {
    if (window.location.hash.length === 0) {
      return [];
    }
    let hashChunks = window.location.hash.substr(1).split('/');
    if (hashChunks.length === 0) {
      return [];
    } else {
      return hashChunks[hashChunks.length - 1].split('&');
    }
  },
  minimizeWidget: function (widgetName) {
    let self = this;
    let currentWidgets = self.getCurrentWidgets();
    let widgetIndex = currentWidgets.indexOf(widgetName);
    if (widgetIndex === -1) {
      return;
    }
    currentWidgets.splice(widgetIndex, 1);
    window.location.hash = self.composeHash(currentWidgets);
    window.mainPage.render();
  },
  expandWidget: function (widgetName) {
    let self = this;
    let currentWidgets = self.getCurrentWidgets();
    if (currentWidgets.indexOf(widgetName) !== -1) {
      return;
    }
    currentWidgets.push(widgetName);
    window.location.hash = self.composeHash(currentWidgets);
    window.mainPage.render();
  },
  composeHash: function (widgets) {
    // Clean the list of widgets to only contain
    // the ones that the current preferences/toolchain
    // allow
    let leftWidgetNames = window.mainPage.userPreferences
      .getMeta('leftWidgets');
    let toolchainWidgetNames = window.mainPage.toolchain
      .getMeta('preferredWidgets');
    let rightWidgetNames = window.mainPage.userPreferences
      .getMeta('rightWidgets');

    // Stitch together the list of widgets from
    // the user preferences and from the
    // currently open toolchain
    let widgetNames = leftWidgetNames
      .concat(toolchainWidgetNames)
      .concat(rightWidgetNames);

    // Ignore any hashes that aren't visible
    widgets = widgets.filter((d) => {
      return widgetNames.indexOf(d) !== -1;
    });

    let newHash = '#';
    let toolchainId = window.mainPage.toolchain.getId();
    if (toolchainId !== undefined) {
      newHash += 'toolchain/' + toolchainId + '/';
    }
    newHash += widgets.join('&');
    return newHash;
  },
  setWidgets: function (widgets) {
    let self = this;
    // Get the widgets that are already in the URL
    let hashes = self.getCurrentWidgets();

    // Set the new URL
    window.location.hash = self.composeHash(widgets);

    // Compare the list of widgets; any mismatch means a re-render
    if (hashes.length !== widgets.length) {
      window.mainPage.render();
      return;
    }

    for (let i = 0; i < widgets.length; i += 1) {
      if (widgets.indexOf(hashes[i]) === -1 ||
        hashes.indexOf(widgets[i]) === -1) {
        window.mainPage.render();
        return;
      }
    }
  },
  cleanHash: function () {
    let self = this;
    window.location.hash = self.composeHash(self.getCurrentWidgets());
  }
});

export default Router;
