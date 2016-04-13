import Backbone from 'backbone';
import ToolchainLibrary from '../ToolchainLibrary';
import myTemplate from './template.html';

let StartingScreen = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.listenTo(window.mainPage.currentUser, 'rra:login', self.render);
    self.listenTo(window.mainPage.currentUser, 'rra:logout', self.render);
  },
  render: function () {
    let self = this;

    if (!self.addedTemplate) {
      self.$el.html(myTemplate);

      self.$el.find('#startWithVisButton').on('click', () => {
        // TODO: load the stock library toolchain
        // from the vis library instead of the vis itself
        window.mainPage.overlay.render('VisualizationLibrary');
      });

      self.$el.find('#startWithDataButton').on('click', () => {
        // TODO: load the stock library toolchain
        // from the dataset library instead of the dataset itself
        window.mainPage.overlay.render('DatasetLibrary');
      });

      self.$el.find('#emptyToolchainButton').on('click', () => {
        window.mainPage.newToolchain();
        window.mainPage.overlay.render(null);
      });

      self.$el.find('a#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      self.$el.find('a#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      self.$el.find('a#logoutLink').on('click', () => {
        window.mainPage.currentUser.authenticate(false);
      });

      self.library = new ToolchainLibrary({
        el: '#libraryChunk',
        keepOpenOnSelect: false
      });

      self.addedTemplate = true;
    }

    if (window.mainPage.currentUser.isLoggedIn()) {
      self.$el.find('#loginLinks').hide();
      self.$el.find('#logoutLinks').show();
    } else {
      self.$el.find('#loginLinks').show();
      self.$el.find('#logoutLinks').hide();
    }

    self.library.render();
  }
});

export default StartingScreen;
