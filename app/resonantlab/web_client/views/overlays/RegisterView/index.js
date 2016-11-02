import GirderRegisterView from 'girder/views/layout/RegisterView';
import girderEvents from 'girder/events';

let RegisterView = GirderRegisterView.extend({
  initialize: function () {
    window.mainPage.overlay.addCloseListeners();
    this.listenToOnce(girderEvents, 'g:login', () => {
      window.mainPage.currentUser.authenticate()
        .then(window.mainPage.overlay.closeOverlay);
    });
  },
  render: function () {
    GirderRegisterView.prototype.render.apply(this, arguments);

    this.$el.find('button.close, .modal-footer > a')
      .on('click', window.mainPage.overlay.closeOverlay);

    this.$el.find('a.g-login-link').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });
  }
});

export default RegisterView;
