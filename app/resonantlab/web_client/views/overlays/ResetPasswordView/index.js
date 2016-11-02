import GirderResetPasswordView from 'girder/views/layout/ResetPasswordView';
import girderEvents from 'girder/events';

let ResetPasswordView = GirderResetPasswordView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girderEvents, 'g:alert',
      window.mainPage.overlay.closeOverlay);
  },
  render: function () {
    GirderResetPasswordView.prototype.render.apply(this, arguments);

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
