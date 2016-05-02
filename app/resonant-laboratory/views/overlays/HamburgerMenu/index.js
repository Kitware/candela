import jQuery from 'jquery';
// import d3 from 'd3';
import Backbone from 'backbone';
import template from './template.html';

import './style.css';

let HamburgerMenu = Backbone.View.extend({
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(template);
      this.addedTemplate = true;
    }
    
    // Main menu items
    jQuery('#projectSettingsMenuItem > p')
      .text(window.mainPage.project.get('name') + ' settings...');
    jQuery('#projectSettingsMenuItem').on('click', () => {
      window.mainPage.overlay.render('ProjectSettings');
    });
    
    jQuery('#closeProjectMenuItem').on('click', () => {
      window.mainPage.switchProject(null).then(() => {
        window.mainPage.overlay.render('StartingScreen');
      });
    });
    
    if (window.mainPage.currentUser.isLoggedIn()) {
      jQuery('#loginText').text('Log Out ' +
        window.mainPage.currentUser.get('firstName') + ' ' +
        window.mainPage.currentUser.get('lastName'));
      jQuery('#loginMenuItem').on('click', () => {
        window.mainPage.currentUser.authenticate(false)
          .then(() => {
            window.mainPage.overlay.render('StartingScreen');
          });
      });
    } else {
      jQuery('#loginText').text('Log In');
      jQuery('#loginMenuItem').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });
    }
  }
});

export default HamburgerMenu;
