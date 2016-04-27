import d3 from 'd3';
import jQuery from 'jquery';
import Underscore from 'underscore';
import Backbone from 'backbone';
import myTemplate from './template.html';

import loadingIcon from '../../../images/spinner.gif';

import infoIcon from '../../../images/info.svg';
import newInfoIcon from '../../../images/newInfo.svg';

import datasetIcon from '../../../images/dataset.svg';
import mappingIcon from '../../../images/mapping.svg';
import visualizationIcon from '../../../images/scatterplot.svg';

import addDatasetIcon from '../../../images/addDataset.svg';
import addVisualizationIcon from '../../../images/addVisualization.svg';

import publicIcon from '../../../images/public.svg';
import privateIcon from '../../../images/private.svg';
import libraryIcon from '../../../images/library.svg';
import scratchSpaceIcon from '../../../images/scratchSpace.svg';

let ICONS = {
  'DatasetView': datasetIcon,
  'MappingView': mappingIcon,
  'VisualizationView': visualizationIcon,
  'AddDataset': addDatasetIcon,
  'AddVisualization': addVisualizationIcon,
  'PublicUser': publicIcon,
  'PrivateUser': privateIcon,
  'PublicLibrary': libraryIcon,
  'PublicScratch': scratchSpaceIcon
};

import './header.css';

let Header = Backbone.View.extend({
  addListeners: function () {
    this.listenTo(window.mainPage.currentUser, 'rra:logout', this.render);
    this.listenTo(window.mainPage.currentUser, 'rra:login', this.render);

    this.listenTo(window.mainPage, 'rra:changeToolchain',
      this.newToolchainResponse);

    this.listenTo(window.mainPage.widgetPanels, 'rra:updateWidgetSpecs',
      this.render);

    this.listenTo(window.mainPage.currentUser.preferences,
      'rra:observeTips', this.render);
    this.listenTo(window.mainPage.currentUser.preferences,
      'rra:levelUp', this.notifyLevelUp);
  },
  newToolchainResponse: function () {
    if (window.mainPage.toolchain) {
      this.listenTo(window.mainPage.toolchain,
        'rra:changeDatasets', this.render);
      this.listenTo(window.mainPage.toolchain,
        'rra:changeVisualizations', this.render);
      this.listenTo(window.mainPage.toolchain,
        'rra:changeStatus', this.render);
      this.listenTo(window.mainPage.toolchain,
        'rra:rename', this.render);
    }
    this.render();
  },
  getVisibleTips: function () {
    let tips = {
      '#hamburgerButton': 'Main Menu',
      '#helpButton': `
Show these tips. This is blue when there are new tips that you 
haven't seen yet.` /*,
      '#achievementsButton': `
Your achievements. Click this to see what you've accomplished,
and what you still haven't tried.`*/
    };
    
    if (window.mainPage.toolchain) {
      tips['#toolchainLocationButton'] = `
Indicates who can see the toolchain you're working on. Click
to change its settings.`;
      
      tips['#toolchainName'] = 'Click to rename this toolchain';
      
      if (window.mainPage.toolchain.getMeta('datasets').length === 0) {
        tips['img.AddDataset.headerButton'] =
          'Click to add a dataset to this toolchain';
      } else {
        tips['img.DatasetView.headerButton'] =
          'Click to see/change the datasets in this toolchain';
      }
      
      tips['img.MappingView.headerButton'] = `
Click to manage the connections between the datasets 
and the visualizations in this toolchain`;
      
      if (window.mainPage.toolchain.getMeta('visualizations').length === 0) {
        tips['img.AddVisualization.headerButton'] =
          'Step 2: Click to add a visualization to this toolchain';
      } else {
        tips['img.VisualizationView.headerButton'] =
          'Click to explore the visualizations in this toolchain';
      }
    }
    
    return tips;
  },
  render: Underscore.debounce(function () {
    if (!this.templateAdded) {
      // Add the template and wire up all the default
      // button events
      this.$el.html(myTemplate);
      jQuery('#hamburgerButton').on('click', () => {
        window.mainPage.overlay.render('HamburgerMenu');
      });
      jQuery('#achievementsButton').on('click', () => {
        window.mainPage.overlay.render('AchievementLibrary');
      });
      jQuery('#helpButton').on('click', () => {
        window.mainPage.helpLayer.setTips(this.getVisibleTips());
        window.mainPage.helpLayer.show();
      });
      jQuery('#toolchainLocationButton')
        .on('click', () => {
          window.mainPage.overlay.render('ToolchainSettings');
        });
      jQuery('#toolchainName').on('focus', function () {
        // this refers to the DOM element
        this.value = this.textContent;
        // We patch on .value to the element to pretend it's
        // a real input (contenteditable stretches better)
      });
      jQuery('#toolchainName').on('blur', function () {
        if (this.value !== this.textContent) {
          this.value = this.textContent;
          window.mainPage.toolchain.rename(this.textContent);
        }
      });
      this.templateAdded = true;
    }
    
    // TODO: don't check for tips that won't be visible
    // (e.g. add/remove datasets, visualizations)
    if (window.mainPage.currentUser.preferences
        .hasSeenAllTips(this.getVisibleTips())) {
      jQuery('#helpButton').attr('src', infoIcon);
    } else {
      jQuery('#helpButton').attr('src', newInfoIcon);
    }

    if (window.mainPage.toolchain) {
      // Render information about the toolchain
      jQuery('#toolchainHeader, #toolchainIcons').show();

      let toolchainStatus = window.mainPage.toolchain.status;
      if (toolchainStatus.location === null) {
        jQuery('#toolchainLocationButton')
          .attr('src', loadingIcon);
      } else {
        jQuery('#toolchainLocationButton')
          .attr('src', ICONS[toolchainStatus.location]);
      }

      jQuery('#toolchainName').text(window.mainPage.toolchain.get('name'));

      // Set up all the widget icons
      let widgetIcons = window.mainPage.toolchain.getAllWidgetSpecs();

      // Prepend and append the buttons for adding stuff
      // (TODO: *always* include these when multiple datasets /
      // multiple visualizations are supported)
      if (window.mainPage.toolchain.getMeta('datasets').length === 0) {
        widgetIcons.unshift({
          widgetType: 'AddDataset'
        });
      }
      if (window.mainPage.toolchain.getMeta('visualizations').length === 0) {
        widgetIcons.push({
          widgetType: 'AddVisualization'
        })
      }

      let widgetButtons = d3.select(this.el).select('#toolchainIcons')
        .selectAll('img.headerButton').data(widgetIcons);
      widgetButtons.enter().append('img')
        .attr('class', (d) => {
          return d.widgetType + ' headerButton';
        });
      widgetButtons.exit().remove();
      widgetButtons.attr('src', (d) => {
        return ICONS[d.widgetType];
      }).on('click', (d) => {
        if (d.widgetType === 'AddDataset') {
          window.mainPage.overlay.render('DatasetLibrary');
        } else if (d.widgetType === 'AddVisualization') {
          window.mainPage.overlay.render('VisualizationLibrary');
        } else {
          window.mainPage.widgetPanels.toggleWidget(d, true);
        }
      });
    } else {
      // We're in an empty state with no toolchain loaded
      // (an overlay should be showing, so don't sweat the toolbar)
      jQuery('#toolchainHeader, #toolchainIcons').hide();
    }
  }, 300),
  notifyLevelUp: function () {
    // TODO
    console.log('level up!');
  }
});

export default Header;
