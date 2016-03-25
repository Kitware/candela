let girder = window.girder;

let User = girder.models.UserModel.extend({
  initialize: function () {
    let self = this;
    self.authenticate();
  },
  authenticate: function () {
    let self = this;
    girder.restRequest({
      path: 'user/authentication',
      error: function () {
        self.clear({
          silent: true
        }).set({});
        self.authToken = undefined;
        self.trigger('logout');
      }
    }).done(function (resp) {
      if (resp === null) {
        self.clear({
          silent: true
        }).set({});
        self.authToken = undefined;
      } else {
        self.clear({
          silent: true
        }).set(resp.user);
        self.authToken = resp.authToken;
      }
    });
  }
});

export default User;
