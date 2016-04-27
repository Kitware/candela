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
    jQuery('#toolchainSettingsMenuItem > p')
      .text(window.mainPage.toolchain.get('name') + ' settings...');
    jQuery('#toolchainSettingsMenuItem').on('click', () => {
      window.mainPage.overlay.render('ToolchainSettings');
    });
    
    if (window.mainPage.currentUser.isLoggedIn()) {
      jQuery('#loginMenuItem > p').text('Log Out');
      jQuery('#loginMenuItem').on('click', () => {
        window.mainPage.currentUser.authenticate(false)
          .then(() => {
            window.mainPage.overlay.render('StartingScreen');
          });
      });
    } else {
      jQuery('#loginMenuItem > p').text('Log In');
      jQuery('#loginMenuItem').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });
    }
  }
});

export default HamburgerMenu;
