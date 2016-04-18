import Backbone from 'backbone';
import SetOps from './shims/SetOps';
import 'jquery-deparam';

var Router = Backbone.Router.extend({
  routes: {
    'toolchain/:toolchain/:params': 'handleRoute',
    'toolchain/:toolchain': 'handleRoute',
    '': 'emptyRoute',
    '*notFound': 'defaultRoute'
  },
  _extractParameters: function (route, fragment) {
    // Fancy URL cleaning / standardization
    let result = route.exec(fragment).slice(1, -1);

    // A valid URL will have one or two chunks,
    // and the second should be a URI encoded JSON object
    // with a widgets property that is a Set of strings
    if (result.length === 1) {
      result.push({
        widgets: new Set([])
      });
    } else if (result.length === 2) {
      result[1] = JSON.parse(decodeURIComponent(result[1]));
      if (result[1].widgets === undefined) {
        result[1].widgets = new Set([]);
      } else {
        result[1].widgets = new Set(result[1].widgets);
      }
    }
    return result;
  },
  initialize: function () {
    let self = this;

    self.on('route:handleRoute', self.handleRoute);
    self.on('route:emptyRoute', self.emptyRoute);
    self.on('route:defaultRoute', self.defaultRoute);
    Backbone.history.start();
  },
  emptyRoute: function () {
    let self = this;

    if (!self.initialRoute) {
      // This is the first url we've come to;
      // because we have nothing better to go
      // on, we'll start with no toolchain and
      // no widget
      self.initialRoute = {
        toolchainId: null,
        params: {
          widgets: new Set()
        }
      };
    } else {
      self.handleRoute(null, {
        widgets: new Set()
      });
    }
  },
  defaultRoute: function () {
    let self = this;
    // Bad url; nuke whatever weird crap
    // is in the URL, and treat it like an empty one
    self.navigate('', {
      replace: true,
      trigger: false
    });
    self.emptyRoute();

    // TODO: We should probably display a nicer error
    // like Github's this-is-not-the-page-you-were-
    // looking-for 404 screen
  },
  handleRoute: function (toolchainId, params) {
    let self = this;

    if (!self.initialRoute) {
      // Store the preferred route; our first time through,
      // there won't be a toolchain or widgetPanels to work with
      self.initialRoute = {
        toolchainId: toolchainId,
        params: params
      };
    } else if (window.mainPage) {
      // We've actually navigated
      let currentId = window.mainPage.toolchain ? window.mainPage.toolchain.getId() : null;
      let currentWidgets = window.mainPage.widgetPanels ? window.mainPage.widgetPanels.expandedWidgets : new Set();

      let changedToolchain = toolchainId !== currentId;
      let changedWidgets = SetOps.symmetric_difference(
        params.widgets, currentWidgets).size > 0;

      if (changedToolchain && changedWidgets) {
        // We've been given a specific toolchain URL, and we're also
        // overriding whatever widgets it saved last time it was open
        window.mainPage.switchToolchain(toolchainId)
          .then(() => {
            window.mainPage.widgetPanels.setWidgets(params.widgets);
          });
      } else if (changedToolchain) {
        // The user didn't change the widgets that were
        // open. As we're switching to a new toolchain,
        // use whatever widgets that toolchain had open
        // the last time it was saved
        window.mainPage.switchToolchain(toolchainId)
          .then(() => {
            window.mainPage.widgetPanels.setWidgets(
              window.mainPage.toolchain.getMeta('preferredWidgets'));
          });
      } else if (changedWidgets) {
        // We're only changing which widgets should be open
        window.mainPage.widgetPanels.setWidgets(params.widgets);
      }
    }
  },
  applyInitialRoute: function () {
    let self = this;
    // We wait to apply the initial route until
    // after the whole DOM has been set up
    window.mainPage.switchToolchain(self.initialRoute.toolchainId)
      .then(() => {
        window.mainPage.widgetPanels.setWidgets(self.initialRoute
          .params.widgets);
        if (self.initialRoute.toolchainId) {
          // The user specified which toolchain they want in
          // the URL, so don't bother them with a dialog asking
          // them to pick one
          window.mainPage.overlay.render(null);
        }
      });
  },
  addListeners: function () {
    let self = this;
    // Listen to events that signal that the url needs to be updated
    self.listenTo(window.mainPage, 'rra:changeToolchain', self.updateUrl);
    self.listenTo(window.mainPage.widgetPanels,
      'rra:navigateWidgets', self.updateUrl);
  },
  constructFragment: function (toolchainId, widgets) {
    let fragment = 'toolchain/' + toolchainId;
    if (widgets.size > 0) {
      fragment += '/' + encodeURIComponent(JSON.stringify({
        widgets: [...widgets]
      }));
    }
    return fragment;
  },
  updateUrl: function () {
    let self = this;
    if (!window.mainPage ||
      window.mainPage.toolchain === undefined ||
      !window.mainPage.widgetPanels) {
      // We haven't actually set up our
      // important pieces yet, so don't
      // mess with the URL
      return;
    }
    if (window.mainPage.toolchain === null) {
      // There is no toolchain loaded, so clear the URL
      self.navigate('', {
        trigger: true
      });
      return;
    } else {
      let toolchainId = window.mainPage.toolchain.getId();
      let widgets = window.mainPage.widgetPanels.expandedWidgets;
      self.navigate(self.constructFragment(toolchainId, widgets), {
        trigger: true
      });
    }
  },
  openToolchainInGirder: function () {
    let url = 'girder#folder/' + window.mainPage.toolchain.get('folderId');
    window.open(url, '_blank');
  },
  openUserDirectoriesInGirder: function () {
    if (window.mainPage.currentUser.isLoggedIn()) {
      let url = 'girder#user/' + window.mainPage.currentUser.id;
      window.open(url, '_blank');
    }
  }
});

export default Router;
