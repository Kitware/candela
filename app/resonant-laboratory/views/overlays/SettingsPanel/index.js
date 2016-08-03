import d3 from 'd3';
import Underscore from 'underscore';
import Backbone from 'backbone';
import template from './template.html';
import './style.scss';

let SettingsPanel = Backbone.View.extend({
  initialize: function () {
    this.blurb = this.blurb || '';
    this.sideMenu = this.sideMenu || '';
  },
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(template);
      if (this.blurb) {
        d3.select(this.el).select('#rightChunk')
          .insert('p', ':first-child')
          .text(this.blurb);
      }
      this.addedTemplate = true;
    }

    this.$el.find('a#loginLink').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });

    this.$el.find('a#registerLink').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });

    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#loginLinks').hide();
    } else {
      this.$el.find('#loginLinks').show();
    }

    let sideMenus = d3.select('#leftChunk').selectAll('div.sideMenu')
      .data(this.sideMenu, d => d.title);
    let sideMenusEnter = sideMenus.enter().append('div')
      .attr('class', 'sideMenu');
    sideMenus.exit().remove();

    sideMenusEnter.append('h1');
    sideMenus.selectAll('h1')
      .text(d => d.title);

    let menuItems = sideMenus.selectAll('div.menuItem')
      .data(d => d.items, d2 => d2.text);
    menuItems.enter().append('div')
      .attr('class', 'menuItem');
    menuItems.exit().remove();

    menuItems.attr('class', d => {
      let className = 'menuItem';
      let clickable = typeof d.enabled === 'function' ? d.enabled() : d.enabled;
      if (clickable === false) {
        className += ' disabled';
      } else {
        className += ' clickable';
      }
      let focused = typeof d.focused === 'function' ? d.focused() : d.focused;
      if (focused) {
        className += ' focused';
      }
      return className;
    }).text(d => d.text)
      .on('click', d => d.onclick);
  }
});

export default SettingsPanel;
