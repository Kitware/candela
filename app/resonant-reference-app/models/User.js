let girder = window.girder;

let User = girder.models.UserModel.extend({
  initialize: function () {
    let self = this;

    // Check for who is logged in initially
    girder.restRequest({
      path: 'api/v1/user/authentication',
      error: function () {
        self.clear().set(self.defaults);
        self.trigger('rra:changeUser');
      }
    }).done(function (resp) {
      self.set(resp);
      self.trigger('rra:changeUser');
    });
  }
});

/* $('#login').click(function () {
    var loginView = new girder.views.LoginView({
        el: $('#dialog-container')
    });
    loginView.render();
});

$('#register').click(function () {
    var registerView = new girder.views.RegisterView({
        el: $('#dialog-container')
    });
    registerView.render();
});

$('#logout').click(function () {
    girder.restRequest({
        path: 'user/authentication',
        type: 'DELETE'
    }).done(function () {
        girder.currentUser = null;
        girder.events.trigger('g:login');
    });
});

girder.events.on('g:login', function () {
    console.log("g:login");
    if (girder.currentUser) {
        $("#login").addClass("hidden");
        $("#register").addClass("hidden");
        $("#name").removeClass("hidden");
        $("#logout").removeClass("hidden");
        $("#name").text(girder.currentUser.get('firstName') + " " + girder.currentUser.get('lastName'));

        // Do anything else you'd like to do on login.
    } else {
        $("#login").removeClass("hidden");
        $("#register").removeClass("hidden");
        $("#name").addClass("hidden");
        $("#logout").addClass("hidden");

        // Do anything else you'd like to do on logout.
    }
}); */

export default User;
