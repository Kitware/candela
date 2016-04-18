let girder = window.girder;

let ResetPasswordView = girder.views.ResetPasswordView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girder.events, 'g:alert', () => {
      // TODO: display a message that the
      // password reset request was successful
      if (window.toolchain) {
        window.mainPage.overlay.render(null);
      } else {
        window.mainPage.overlay.render('StartingScreen');
      }
    });
  },
  render: function () {
    girder.views.ResetPasswordView.prototype.render.apply(this, arguments);
      
    this.$el.find('button.close, .modal-footer > a')
      .on('click', () => {
        if (window.mainPage.toolchain) {
          window.mainPage.overlay.render(null);
        } else {
          window.mainPage.overlay.render('StartingScreen');
        }
      });
    
    this.$el.find('a.g-login-link').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });
    
    this.$el.find('a.g-register-link').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });
  }
});

export default ResetPasswordView;
