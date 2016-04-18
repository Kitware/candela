import d3 from 'd3';
import jQuery from 'jquery';
import Underscore from 'underscore';
import Backbone from 'backbone';
import myTemplate from './template.html';

import loadingIcon from '../../../images/spinner.gif';

import editableIcon from '../../../images/canEdit.svg';
import uneditableIcon from '../../../images/cantEdit.svg';

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
  initialize: function () {
    let self = this;

    self.listenTo(window.mainPage.currentUser, 'rra:logout', self.render);
    self.listenTo(window.mainPage.currentUser, 'rra:login', self.render);

    self.listenTo(window.mainPage, 'rra:changeToolchain',
      self.newToolchainResponse);

    self.listenTo(window.mainPage.userPreferences,
      'rra:levelUp', self.notifyLevelUp);
  },
  newToolchainResponse: function () {
    let self = this;
    if (window.mainPage.toolchain) {
      self.listenTo(window.mainPage.toolchain,
        'rra:changeStatus', self.render);
      self.listenTo(window.mainPage.toolchain,
        'rra:rename', self.render);
    }
    self.render();
  },
  render: Underscore.debounce(function () {
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
      jQuery('#toolchainLocationButton')
        .on('click', () => {
          window.mainPage.overlay.render('ToolchainSettings');
        });
      jQuery('#toolchainName').on('change', function () {
        window.mainPage.toolchain.rename(this.value);
      });
      self.templateAdded = true;
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
      if (toolchainStatus.editable === true) {
        jQuery('#toolchainEditabilityButton')
          .attr('src', editableIcon);
      } else {
        jQuery('#toolchainEditabilityButton')
          .attr('src', uneditableIcon);
      }

      jQuery('#toolchainName').val(window.mainPage.toolchain.get('name'));
      
      // Set up all the widget icons
      let widgetIcons = window.mainPage.toolchain.getAllWidgetSpecs();
      
      // Prepend and append adding buttons
      /* widgetIcons.unshift({
        widgetType: 'AddDataset'
      });
      widgetIcons.push({
        widgetType: 'AddVisualization'
      })*/
      
      let widgetButtons = d3.select(self.el).select('#toolchainIcons')
        .selectAll('img.headerButton').data(widgetIcons);
      widgetButtons.enter().append('img')
        .attr('class', 'headerButton');
      widgetButtons.exit().remove();
      widgetButtons.attr('src', (d) => {
        return ICONS[d.widgetType];
      }).on('click', (d) => {
        if (d.widgetType === 'AddDataset') {
          // TODO: add a dataset
        } else if (d.widgetType === 'AddVisualization') {
          // TODO: add a visualization
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
    // let self = this;
  }
});

export default Header;
