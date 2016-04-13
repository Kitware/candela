import UserPreferences from './UserPreferences';
let girder = window.girder;

let User = girder.models.UserModel.extend({
  initialize: function () {
    let self = this;
    self.loggedIn = false;
    self.preferences = new UserPreferences();
    self.listenTo(self, 'rra:logout', self.handleUpdate);
    self.listenTo(self, 'rra:login', self.handleUpdate);
    self.authenticate();
  },
  addListeners: function () {
    let self = this;
    self.preferences.addListeners();
  },
  authenticate: function (login) {
    let self = this;

    if (login !== false) {
      login = true;
    }

    return Promise.resolve(girder.restRequest({
      path: 'user/authentication',
      error: () => {
        self.finishLogout();
      },
      type: login ? 'GET' : 'DELETE'
    })).then(function (resp) {
      if (resp === null || login === false) {
        self.finishLogout();
      } else {
        self.loggedIn = true;
        self.clear({
          silent: true
        }).set(resp.user);
        self.authToken = resp.authToken;
        self.trigger('rra:login');
        girder.events.trigger('g:login');
      }
    }).catch(function (errorObj) {
      if (errorObj.statusText === 'Unauthorized') {
        // We don't yet have the appropriate
        // HTTP headers... so keep us logged out
        self.finishLogout();
      } else {
        // Something else happened
        window.mainPage.trigger('rra:error', errorObj);
      }
    });
  },
  finishLogout: function () {
    let self = this;
    let wasLoggedIn = self.loggedIn;
    self.loggedIn = false;
    self.clear({
      silent: true
    }).set({});
    self.authToken = undefined;
    if (wasLoggedIn) {
      self.trigger('rra:logout');
      // Girder uses g:login for both log in and log out
      girder.events.trigger('g:login');
    }
  },
  handleUpdate: function () {
    let self = this;

    if (self.loggedIn === false) {
      // Not logged in; clear all the preferences
      self.preferences.resetToDefaults();
    } else {
      // We're logged in! First, let's see if
      // the user already has preferences stored
      self.preferences.fetch()
        .catch((errorObj) => {
          window.mainPage.trigger('rra:error', errorObj);
        });
    }
  },
  isLoggedIn: function () {
    let self = this;
    return self.loggedIn;
  }
});

export default User;
