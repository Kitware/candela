import Backbone from 'backbone';
import ToolchainLibrary from '../ToolchainLibrary';
import myTemplate from './template.html';

let StartingScreen = Backbone.View.extend({
  initialize: function () {
    this.listenTo(window.mainPage.currentUser, 'rra:login', this.render);
    this.listenTo(window.mainPage.currentUser, 'rra:logout', this.render);
  },
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      this.$el.find('#startWithVisButton').on('click', () => {
        // TODO: load the stock library toolchain
        // from the vis library instead of the vis itthis
        window.mainPage.overlay.render('VisualizationLibrary');
      });

      this.$el.find('#startWithDataButton').on('click', () => {
        // TODO: load the stock library toolchain
        // from the dataset library instead of the dataset itthis
        window.mainPage.overlay.render('DatasetLibrary');
      });

      this.$el.find('#emptyToolchainButton').on('click', () => {
        window.mainPage.newToolchain();
        window.mainPage.overlay.render(null);
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

      this.library = new ToolchainLibrary({
        el: '#libraryChunk',
        keepOpenOnSelect: false
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

    this.library.render();
  }
});

export default StartingScreen;
