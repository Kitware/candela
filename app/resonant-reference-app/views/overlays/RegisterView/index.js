let girder = window.girder;

let RegisterView = girder.views.RegisterView.extend({
  initialize: function () {
    let self = this;
    window.mainPage.overlay.addCloseListeners();
    self.listenToOnce(girder.events, 'g:login', () => {
      window.mainPage.currentUser.authenticate();
      window.mainPage.overlay.render(null);
    });
  },
  render: function () {
    let self = this;
    girder.views.RegisterView.prototype.render.apply(self, arguments);
      
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
  }
});

export default RegisterView;
