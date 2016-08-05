import d3 from 'd3';
import Backbone from 'backbone';
import template from './template.html';
import './style.scss';

let SettingsPanel = Backbone.View.extend({
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(template);
      this.addedTemplate = true;
    }

    // Sneaky way to add / remove / update the blurb
    let blurbs = [];
    if (this.blurb) {
      blurbs.push(this.blurb);
    }
    let blurbElements = d3.select(this.el).select('#rightChunk')
      .selectAll('p.blurb').data(blurbs, d => d);
    blurbElements.enter().insert('p', ':first-child')
      .attr('class', 'blurb');
    blurbElements.exit().remove();
    blurbElements.text(d => d);

    // Hide / show login links + wire their events
    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#loginLinks').hide();
    } else {
      this.$el.find('#loginLinks').show();
      this.$el.find('a#loginLink').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      this.$el.find('a#registerLink').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });
    }

    // Render the side menu (this.getSideMenu() should be
    // set by subclasses)
    let sideMenus = d3.select('#leftChunk').selectAll('div.sideMenu')
      .data(this.getSideMenu(), d => d.rootPanel);
    let sideMenusEnter = sideMenus.enter().append('div')
      .attr('class', 'sideMenu');
    sideMenus.exit().remove();

    sideMenusEnter.append('h1');
    sideMenus.selectAll('h1')
      .text(d => d.title)
      .on('click', d => {
        // Clicking the title brings people back
        // out of whatever submenu may have been focused
        window.mainPage.overlay.render(d.rootPanel);
      });

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
    }).text(d => {
      return typeof d.text === 'function' ? d.text() : d.text;
    }).on('click', d => {
      let clickable = typeof d.enabled === 'function' ? d.enabled() : d.enabled;
      if (clickable !== false) {
        d.onclick(d);
      }
    });
  }
});

export default SettingsPanel;
