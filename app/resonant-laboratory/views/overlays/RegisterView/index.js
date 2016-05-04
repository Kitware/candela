let girder = window.girder;

let RegisterView = girder.views.RegisterView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girder.events, 'g:login', () => {
      window.mainPage.currentUser.authenticate()
        .then(window.mainPage.overlay.closeOverlay);
    });
  },
  render: function () {
    girder.views.RegisterView.prototype.render.apply(this, arguments);

    this.$el.find('button.close, .modal-footer > a')
      .on('click', window.mainPage.overlay.closeOverlay);

    this.$el.find('a.g-login-link').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });
  }
});

export default RegisterView;
