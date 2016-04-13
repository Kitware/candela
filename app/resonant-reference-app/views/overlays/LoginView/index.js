let girder = window.girder;

let LoginView = girder.views.LoginView.extend({
  initialize: function () {
    let self = this;
    window.mainPage.overlay.addCloseListeners();
    self.listenToOnce(girder.events, 'g:login.success', () => {
      window.mainPage.currentUser.authenticate();
      window.mainPage.overlay.render(null);
    });
  },
  render: function () {
    let self = this;
    girder.views.LoginView.prototype.render.apply(self, arguments);

    self.$el.find('button.close, .modal-footer > a')
      .on('click', function () {
        if (window.mainPage.toolchain) {
          window.mainPage.overlay.render(null);
        } else {
          window.mainPage.overlay.render('StartingScreen');
        }
      });

    self.$el.find('a.g-register-link').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });

    self.$el.find('a.g-forgot-password').on('click', () => {
      window.mainPage.overlay.render('ResetPasswordView');
    });
  }
});

export default LoginView;
