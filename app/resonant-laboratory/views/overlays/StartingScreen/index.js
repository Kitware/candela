import Backbone from 'backbone';
import myTemplate from './template.html';
import './style.scss';

let StartingScreen = Backbone.View.extend({
  initialize: function () {
    this.listenTo(window.mainPage.currentUser, 'rl:login', this.render);
    this.listenTo(window.mainPage.currentUser, 'rl:logout', this.render);
  },
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      this.$el.find('#startWithVisButton').on('click', () => {
        // TODO: load the stock library project
        // from the vis library instead of the vis itthis
        window.mainPage.overlay.render('VisualizationLibrary');
      });

      this.$el.find('#startWithDataButton').on('click', () => {
        // TODO: load the stock library project
        // from the dataset library instead of the dataset itthis
        window.mainPage.overlay.render('DatasetLibrary');
      });

      this.$el.find('#emptyProjectButton').on('click', () => {
        window.mainPage.newProject()
          .then(() => {
            window.mainPage.overlay.closeOverlay();
            window.mainPage.widgetPanels.closeWidgets();
          });
      });

      this.$el.find('a#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      this.$el.find('a#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.$el.find('a#logoutLink').on('click', () => {
        window.mainPage.currentUser.authenticate(false);
      });

      this.addedTemplate = true;
    }

    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#loginLinks').hide();
      this.$el.find('#logoutLinks').show();
    } else {
      this.$el.find('#loginLinks').show();
      this.$el.find('#logoutLinks').hide();
    }
  }
});

export default StartingScreen;
