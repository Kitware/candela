import jQuery from 'jquery';
import d3 from 'd3';
import Backbone from 'backbone';
import template from './template.html';

import './style.css';

let HamburgerMenu = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(template);
    
    // Main menu items
    jQuery('#manageToolchainsMenuItem').on('click', () => {
      window.mainPage.overlay.render('ToolchainLibrary');
    });
    
    // List of all the tools available to the user
    let toolList = Object.keys(window.mainPage.ICONS);
    // TODO: sort by difficulty

    let tools = d3.select(self.el).select('#toolSettings').selectAll('tr')
      .data(toolList);

    let toolsEnter = tools.enter().append('tr');

    let toolNameEnter = toolsEnter.append('td')
      .attr('class', 'tool')
      .on('click', (d) => {
        window.mainPage.widgetPanels.open(d);
        window.mainPage.overlay.render(null);
      });
    toolNameEnter.append('img').attr('src', (d) => {
      return window.mainPage.ICONS[d];
    });
    toolNameEnter.append('p').text((d) => d);

    let leftIcons = window.mainPage.userPreferences.getMeta('leftIcons');
    let toolchainIcons = window.mainPage.toolchain.getMeta('requiredIcons');
    let rightIcons = window.mainPage.userPreferences.getMeta('rightIcons');

    let toolControl = toolsEnter.append('td')
      .attr('class', 'control');
    toolControl.append('input')
      .attr('id', (d) => d + 'checkBox')
      .attr('type', 'checkbox')
      .property('checked', (d) => {
        return leftIcons.indexOf(d) !== -1 ||
          toolchainIcons.indexOf(d) !== -1 ||
          rightIcons.indexOf(d) !== -1;
      })
      .property('disabled', (d) => {
        return toolchainIcons.indexOf(d) !== -1;
      });
    toolControl.append('label')
      .attr('for', (d) => d + 'checkBox');
  }
});

export default HamburgerMenu;
