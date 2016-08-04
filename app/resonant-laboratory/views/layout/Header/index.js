// import d3 from 'd3';
import jQuery from 'jquery';
// import Underscore from 'underscore';
import Backbone from 'backbone';
import myTemplate from './template.html';

import loadingIcon from '../../../images/spinner.gif';

import datasetIcon from '../../../images/dataset.svg';
import matchingIcon from '../../../images/matching.svg';
import visualizationIcon from '../../../images/scatterplot.svg';

import addDatasetIcon from '../../../images/addDataset.svg';
import addVisualizationIcon from '../../../images/addVisualization.svg';

import publicIcon from '../../../images/public.svg';
import privateIcon from '../../../images/private.svg';
import libraryIcon from '../../../images/library.svg';
import scratchSpaceIcon from '../../../images/scratchSpace.svg';

let ICONS = {
  'DatasetView': datasetIcon,
  'MatchingView': matchingIcon,
  'VisualizationView': visualizationIcon,
  'AddDataset': addDatasetIcon,
  'AddVisualization': addVisualizationIcon,
  'PublicUser': publicIcon,
  'PrivateUser': privateIcon,
  'PublicLibrary': libraryIcon,
  'PublicScratch': scratchSpaceIcon
};

import tips from './tips.json';

import './header.scss';

let Header = Backbone.View.extend({
  addListeners: function () {
    this.listenTo(window.mainPage.currentUser, 'rl:logout', this.render);
    this.listenTo(window.mainPage.currentUser, 'rl:login', this.render);

    this.listenTo(window.mainPage, 'rl:changeProject',
      this.attachProjectListeners);

    this.listenTo(window.mainPage.widgetPanels, 'rl:updateWidgetSpecs',
      this.render);

    this.listenTo(window.mainPage.currentUser.preferences,
      'rl:observeTips', this.render);
    this.listenTo(window.mainPage.currentUser.preferences,
      'rl:levelUp', this.notifyLevelUp);
  },
  attachProjectListeners: function () {
    if (window.mainPage.project) {
      this.listenTo(window.mainPage.project,
        'rl:changeDatasets', this.render);
      this.listenTo(window.mainPage.project,
        'rl:changeVisualizations', this.render);
      this.listenTo(window.mainPage.project,
        'rl:changeStatus', this.render);
      this.listenTo(window.mainPage.project,
        'rl:rename', this.render);
    }
    this.render();
  },
  render: function () {
    if (!this.templateAdded) {
      // Add the template and wire up all the default
      // button events
      this.$el.html(myTemplate);
      jQuery('#aboutResLabHeaderButton').on('click', () => {
        window.mainPage.overlay.render('AboutResonantLab');
      });
      jQuery('#hamburgerButton').on('click', () => {
        window.mainPage.overlay.render('HamburgerMenu');
      });
      jQuery('#achievementsButton').on('click', () => {
        window.mainPage.overlay.render('AchievementLibrary');
      });
      jQuery('#helpButton').on('click', () => {
        window.mainPage.helpLayer.showTips(tips);
      });
      jQuery('#projectVisibilityButton')
        .on('click', () => {
          window.mainPage.overlay.render('ProjectSettings');
        });
      jQuery('#projectName').on('focus', function () {
        // this refers to the DOM element
        this.value = this.textContent;
        // We patch on .value to the element to pretend it's
        // a real input (contenteditable stretches better)
      });
      jQuery('#projectName').on('blur', function () {
        // this refers to the DOM element
        if (this.value !== this.textContent) {
          if (this.textContent.length === 0) {
            this.textContent = this.value;
          } else {
            this.value = this.textContent;
            window.mainPage.project.rename(this.textContent);
          }
        }
      });
      jQuery('#projectName').on('keydown', function (event) {
        // this refers to the DOM element
        let key = event.keyCode || event.charCode;
        if (key === 13 || key === 27) {
          jQuery(this).blur();
          // Workaround for webkit's bug
          window.getSelection().removeAllRanges();
        }
      });
      this.templateAdded = true;
    }

    // Only make the icon yellow if there's a tip
    // that the user hasn't seen that is visible
    // on the screen
    let visibleTips = tips.filter(tip => {
      return jQuery(tip.selector).size() > 0;
    });
    if (window.mainPage.currentUser.preferences
        .hasSeenAllTips(visibleTips)) {
      jQuery('#helpButton').removeClass('new');
    } else {
      jQuery('#helpButton').addClass('new');
    }

    if (window.mainPage.project) {
      // Render information about the project
      jQuery('#projectHeader, #projectIcons').show();

      let projectStatus = window.mainPage.project.status;
      if (projectStatus.visibility === null) {
        jQuery('#projectVisibilityButton')
          .attr('src', loadingIcon);
      } else {
        jQuery('#projectVisibilityButton')
          .attr('src', ICONS[projectStatus.visibility]);
      }

      jQuery('#projectName').text(window.mainPage.project.get('name'));

      /*
      // TODO: When we support mutliple datasets / visualizations,
      // we can use icons in the header to manage them.
      // Uncomment this section to add them

      // Set up all the widget icons
      let widgetIcons = window.mainPage.project.getAllWidgetSpecs();

      // Insert / append the icons to add additional datasets / visualizations
      widgetIcons.unshift({
        widgetType: 'AddDataset'
      });
      widgetIcons.push({
        widgetType: 'AddVisualization'
      });

      let widgetButtons = d3.select(this.el).select('#projectIcons')
        .selectAll('img.headerButton').data(widgetIcons);
      widgetButtons.enter().append('img')
        .attr('class', (d) => {
          return d.widgetType + ' headerButton';
        });
      widgetButtons.exit().remove();
      widgetButtons.attr('src', (d) => {
        return ICONS[d.widgetType];
      }).attr('title', d => {
        return tips.find(tip => {
          return tip.selector === 'img.' + d.widgetType + '.headerButton';
        }).message;
      }).on('click', (d) => {
        if (d.widgetType === 'AddDataset') {
          window.mainPage.overlay.render('DatasetLibrary');
        } else if (d.widgetType === 'AddVisualization') {
          window.mainPage.overlay.render('VisualizationLibrary');
        } else {
          window.mainPage.widgetPanels.toggleWidget(d, true);
        }
      });
      */
    } else {
      // We're in an empty state with no project loaded
      // (an overlay should be showing, so don't sweat the toolbar)
      jQuery('#projectHeader, #projectIcons').hide();
    }
  },
  notifyLevelUp: function () {
    // TODO
    console.log('level up!');
  }
});

export default Header;
