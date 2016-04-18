let girder = window.girder;

let LoginView = girder.views.LoginView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girder.events, 'g:login.success', () => {
      window.mainPage.currentUser.authenticate()
        .then(() => {
          if (window.toolchain) {
            window.mainPage.overlay.render(null);
          } else {
            window.mainPage.overlay.render('StartingScreen');
          }
        });
    });
  },
  render: function () {
    girder.views.LoginView.prototype.render.apply(this, arguments);

    this.$el.find('button.close, .modal-footer > a')
      .on('click', () => {
        if (window.mainPage.toolchain) {
          window.mainPage.overlay.render(null);
        } else {
          window.mainPage.overlay.render('StartingScreen');
        }
      });

    this.$el.find('a.g-register-link').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });

    this.$el.find('a.g-forgot-password').on('click', () => {
      window.mainPage.overlay.render('ResetPasswordView');
    });
  }
});

export default LoginView;
