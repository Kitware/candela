let girder = window.girder;

let ResetPasswordView = girder.views.ResetPasswordView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girder.events, 'g:alert',
      window.mainPage.overlay.closeOverlay);
  },
  render: function () {
    girder.views.ResetPasswordView.prototype.render.apply(this, arguments);

    this.$el.find('button.close, .modal-footer > a')
      .on('click', window.mainPage.overlay.closeOverlay);

    this.$el.find('a.g-login-link').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });

    this.$el.find('a.g-register-link').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });
  }
});

export default ResetPasswordView;
