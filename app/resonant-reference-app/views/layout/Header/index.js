import d3 from 'd3';
import jQuery from 'jquery';
import Backbone from 'backbone';
import myTemplate from './template.html';

import publicIcon from '../../../images/public.svg';
import privateIcon from '../../../images/private.svg';

import './header.css';

let Header = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.listenTo(window.mainPage.userPreferences,
      'rra:levelUp', self.notifyLevelUp);
  },
  render: function () {
    let self = this;

    if (!self.templateAdded) {
      // Add the template and wire up all the default
      // button events
      self.$el.html(myTemplate);
      jQuery('#hamburgerButton').on('click', () => {
        window.mainPage.overlay.render('HamburgerMenu');
      });
      jQuery('#achievementsButton').on('click', () => {
        window.mainPage.overlay.render('AchievementLibrary');
      });
      jQuery('#toolchainButton').on('click', () => {
        window.mainPage.overlay.render('ToolchainLibrary');
      });
      self.templateAdded = true;
    }
    
    // Set up all the icons on the left side
    let leftIcons = window.mainPage.userPreferences.getMeta('leftIcons');

    let leftButtons = d3.select(self.el).select('#leftButtons')
      .selectAll('img.headerButton').data(leftIcons);
    leftButtons.enter().append('img')
      .attr('class', 'headerButton');
    leftButtons.exit().remove();
    leftButtons.attr('src', (d) => window.mainPage.ICONS[d])
      .on('click', (d) => {
        window.mainPage.widgetPanels.open(d);
      });
    
    // Set up all the toolchain icons
    let toolchainIcons = window.mainPage.toolchain.getMeta('requiredIcons');

    let toolchainButtons = d3.select(self.el).select('#toolchainIcons')
      .selectAll('img.headerButton').data(toolchainIcons);
    toolchainButtons.enter().append('img')
      .attr('class', 'headerButton');
    toolchainButtons.exit().remove();
    toolchainButtons.attr('src', (d) => window.mainPage.ICONS[d])
      .on('click', (d) => {
        window.mainPage.widgetPanels.open(d);
      });
    
    let isPublic = window.mainPage.toolchain.isPublic;
    let indicator = jQuery('#toolchainVisibilityIndicator');
    if (isPublic === true) {
      indicator.show();
      indicator.attr('src', publicIcon);
    } else if (isPublic === false) {
      indicator.show();
      indicator.attr('src', privateIcon);
    } else {
      indicator.hide();
    }
    
    indicator = jQuery('#toolchainSaveIndicator');
    if (window.mainPage.toolchain.getId() === undefined) {
      indicator.show();
    } else {
      indicator.hide();
    }
    
    // Set up all the icons on the right side
    let rightIcons = window.mainPage.userPreferences.getMeta('rightIcons');
    
    let rightButtons = d3.select(self.el).select('#rightButtons')
      .selectAll('img.headerButton').data(rightIcons);
    rightButtons.enter().append('img')
      .attr('class', 'headerButton');
    rightButtons.exit().remove();
    leftButtons.attr('src', (d) => window.mainPage.ICONS[d])
      .on('click', (d) => {
        window.mainPage.widgetPanels.open(d);
      });
  },
  notifyLevelUp: function () {
    // TODO
    console.log('level up!');
    // let self = this;
  }
});

export default Header;
