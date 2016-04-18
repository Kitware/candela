let girder = window.girder;

let ResetPasswordView = girder.views.ResetPasswordView.extend({
  initialize: function () {
    let self = this;
    window.mainPage.overlay.addCloseListeners();
    self.listenToOnce(girder.events, 'g:alert', () => {
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
    let self = this;
    girder.views.ResetPasswordView.prototype.render.apply(self, arguments);
      
    self.$el.find('button.close, .modal-footer > a')
      .on('click', function () {
        if (window.mainPage.toolchain) {
          window.mainPage.overlay.render(null);
        } else {
          window.mainPage.overlay.render('StartingScreen');
        }
      });
    
    self.$el.find('a.g-login-link').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });
    
    self.$el.find('a.g-register-link').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });
  }
});

export default ResetPasswordView;
