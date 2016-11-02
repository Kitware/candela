import GirderLoginView from 'girder/views/layout/LoginView';
import girderEvents from 'girder/events';

let LoginView = GirderLoginView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girderEvents, 'g:login.success', () => {
      window.mainPage.currentUser.authenticate()
        .then(window.mainPage.overlay.closeOverlay);
    });
  },
  render: function () {
    GirderLoginView.prototype.render.apply(this, arguments);

    this.$el.find('button.close, .modal-footer > a')
      .on('click', window.mainPage.overlay.closeOverlay);

    this.$el.find('a.g-register-link').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });

    this.$el.find('a.g-forgot-password').on('click', () => {
      window.mainPage.overlay.render('ResetPasswordView');
    });
  }
});

export default LoginView;
