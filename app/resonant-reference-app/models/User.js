import UserPreferences from './UserPreferences';
let girder = window.girder;

let User = girder.models.UserModel.extend({
  initialize: function () {
    let self = this;
    self.preferences = new UserPreferences();
    self.listenTo(self, 'rra:logout', self.handleUpdate);
    self.listenTo(self, 'rra:login', self.handleUpdate);
    self.authenticate();
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
      if (resp === null) {
        self.finishLogout();
      } else {
        self.clear({
          silent: true
        }).set(resp.user);
        self.authToken = resp.authToken;
        self.trigger('rra:login');
        girder.events.trigger('g:login');
      }
    }).catch(() => {
      self.finishLogout();
    });
  },
  finishLogout: function () {
    let self = this;
    self.clear({
      silent: true
    }).set({});
    self.authToken = undefined;
    self.trigger('rra:logout');
    // Girder uses g:login for both log in and log out
    girder.events.trigger('g:login');
  },
  handleUpdate: function () {
    let self = this;

    if (self.id === undefined) {
      // Not logged in
      self.preferences.resetToDefaults();
    } else {
      // We're logged in! First, let's see if
      // the user already has preferences stored
      self.preferences.fetch({
        error: () => {
          // Okay, they don't. Instead, let's save the
          // current state as their starting preferences
          self.preferences.create();
        }
      });
    }
  }
});

export default User;
