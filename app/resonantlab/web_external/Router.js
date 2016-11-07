import Backbone from 'girder_plugins/resonantlab/node/backbone';
import SetOps, {Set} from './shims/SetOps';
import 'girder_plugins/resonantlab/node/jquery-deparam';

var Router = Backbone.Router.extend({
  routes: {
    'project/:project/:params': 'handleRoute',
    'project/:project': 'handleRoute',
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
    this.on('route:handleRoute', this.handleRoute);
    this.on('route:emptyRoute', this.emptyRoute);
    this.on('route:defaultRoute', this.defaultRoute);
    Backbone.history.start();
  },
  emptyRoute: function () {
    if (!this.initialRoute) {
      // This is the first url we've come to;
      // because we have nothing better to go
      // on, we'll start with no project and
      // no widget
      this.initialRoute = {
        projectId: null,
        params: {
          widgets: new Set()
        }
      };
    } else {
      this.handleRoute(null, {
        widgets: new Set()
      });
    }
  },
  defaultRoute: function () {
    // Bad url; nuke whatever weird crap
    // is in the URL, and treat it like an empty one
    this.navigate('', {
      replace: true,
      trigger: false
    });
    this.emptyRoute();

    // TODO: We should probably display a nicer error
    // like Github's this-is-not-the-page-you-were-
    // looking-for 404 screen
  },
  handleRoute: function (projectId, params) {
    if (!this.initialRoute) {
      // Store the preferred route; our first time through,
      // there won't be a project or widgetPanels to work with
      this.initialRoute = {
        projectId: projectId,
        params: params
      };
    } else if (window.mainPage) {
      // We've actually navigated
      let currentId = window.mainPage.project ? window.mainPage.project.getId() : null;
      let currentWidgets = window.mainPage.widgetPanels ? window.mainPage.widgetPanels.expandedWidgets : new Set();

      let changedProject = projectId !== currentId;
      let changedWidgets = SetOps.symmetric_difference(
        params.widgets, currentWidgets).size > 0;

      if (changedProject && changedWidgets) {
        // We've been given a specific project URL, and we're also
        // overriding whatever widgets it saved last time it was open
        window.mainPage.switchProject(projectId)
          .then(() => {
            window.mainPage.widgetPanels.setWidgets(params.widgets);
            window.mainPage.overlay.closeOverlay();
          });
      } else if (changedProject) {
        // The user didn't change the widgets that were
        // open. As we're switching to a new project,
        // use whatever widgets that project had open
        // the last time it was saved
        window.mainPage.switchProject(projectId)
          .then(() => {
            window.mainPage.widgetPanels.setWidgets(
              window.mainPage.project.getMeta('preferredWidgets'));
            window.mainPage.overlay.closeOverlay();
          });
      } else if (changedWidgets) {
        // We're only changing which widgets should be open
        window.mainPage.widgetPanels.setWidgets(params.widgets);
        window.mainPage.overlay.closeOverlay();
      }
    }
  },
  applyInitialRoute: function () {
    // We wait to apply the initial route until
    // after the whole DOM has been set up
    window.mainPage.switchProject(this.initialRoute.projectId)
      .then(() => {
        window.mainPage.widgetPanels.setWidgets(this.initialRoute
          .params.widgets);
        if (this.initialRoute.projectId) {
          // The user specified which project they want in
          // the URL, so don't bother them with a dialog asking
          // them to pick one
          window.mainPage.overlay.closeOverlay();
        }
      });
  },
  addListeners: function () {
    // Listen to events that signal that the url needs to be updated
    this.listenTo(window.mainPage, 'rl:changeProject', this.updateUrl);
    this.listenTo(window.mainPage.widgetPanels,
      'rl:navigateWidgets', this.updateUrl);
  },
  constructFragment: function (projectId, widgets) {
    let fragment = 'project/' + projectId;
    if (widgets.size > 0) {
      fragment += '/' + encodeURIComponent(JSON.stringify({
        widgets: [...widgets]
      }));
    }
    return fragment;
  },
  updateUrl: function () {
    if (!window.mainPage ||
      window.mainPage.project === undefined ||
      !window.mainPage.widgetPanels) {
      // We haven't actually set up our
      // important pieces yet, so don't
      // mess with the URL
      return;
    }
    if (window.mainPage.project === null) {
      // There is no project loaded, so clear the URL
      this.navigate('', {
        trigger: true
      });
      return;
    } else {
      let projectId = window.mainPage.project.getId();
      let widgets = window.mainPage.widgetPanels.expandedWidgets;
      this.navigate(this.constructFragment(projectId, widgets), {
        trigger: true
      });
    }
  },
  openProjectInGirder: function () {
    let url = 'girder#folder/' + window.mainPage.project.get('folderId');
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
