let girder = window.girder;

let RegisterView = girder.views.RegisterView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girder.events, 'g:login', () => {
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
    girder.views.RegisterView.prototype.render.apply(this, arguments);
      
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
  }
});

export default RegisterView;
