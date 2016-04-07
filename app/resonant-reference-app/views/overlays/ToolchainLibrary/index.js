import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import privateImage from '../../../images/light/file_private.svg';
import publicImage from '../../../images/light/file_public.svg';
import privateIcon from '../../../images/private.svg';
import publicIcon from '../../../images/public.svg';
import '../../../shims/copyToClipboard.js';
let girder = window.girder;

let ToolchainLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    
    if (!self.addedTemplate) {
      self.$el.html(myTemplate);
      self.addedTemplate = true;
    }
    
    // Start off with every section hidden
    // (I know, this is dumb, but girder's
    // collections have no way of detecting
    // errors when you try to fetch() them)
    jQuery('.hideable').hide();
    
    // Set up the settings part of the dialog
    jQuery('#toolchainSettings, #toolchainSettingsHeader').show();
    
    jQuery('#copyLinkButton').on('click', () => {
      window.copyTextToClipboard(window.location.href);
    });
    
    jQuery('#toolchainName').val(window.mainPage.toolchain.get('name'));
    jQuery('#toolchainName').on('keyup', function () {
      // Short debounce
      if (self.keyupTimeout) {
        window.clearTimeout(self.keyupTimeout);
      }
      self.keyupTimeout = window.setTimeout(() => {
        window.mainPage.toolchain.rename(this.value);
        // This will trigger a re-render, making the
        // text field lose focus...
        // TODO: To make this smoother, I should probably
        // break up the global re-render when the toolchain
        // changes for more specific, localized effects
        window.setTimeout(() => {
          this.focus();
        }, 1000);
      }, 1000);
    });
       
    let isPublic = window.mainPage.toolchain.isPublic;
    if (isPublic === undefined) {
      jQuery('#saveAsControls').show();
      jQuery('#visibilityControls').hide();
    } else {
      jQuery('#saveAsControls').hide();
      jQuery('#visibilityControls').show();
      if (isPublic === true) {
        jQuery('#visibilityIcon').attr('src', publicIcon);
        jQuery('#publicVisibility').prop('checked', true);
      } else {
        jQuery('#visibilityIcon').attr('src', privateIcon);
        jQuery('#privateVisibility').prop('checked', true);
      }
    }
    jQuery('input[name="toolchainVisibility"]').on('change', function () {
      window.mainPage.toolchain.togglePublic();
    });
    
    jQuery('#saveAsButton').on('click', function () {
      window.mainPage.toolchain.create();
    });
    
    jQuery('#deleteButton').on('click', function () {
      window.mainPage.toolchain.destroy({
        success: () => {
          window.mainPage.openToolchain(null);
        }
      });
    });
    
    jQuery('#newButton').on('click', function () {
      window.mainPage.openToolchain(null);
    });
    
    // Get the set of toolchains in the library
    girder.restRequest({
      path: 'resource/lookup?path=/collection/ReferenceApp/Toolchains',
      type: 'GET',
      error: null
    }).done(function (folder) {
      self.renderFolderContents(folder, 'toolchainLibrary', libImage);
    });
    
    // Get the set of the user's private toolchains
    girder.restRequest({
      path: 'folder/privateFolder',
      type: 'GET',
      error: null
    }).done(function (folder) {
      self.renderFolderContents(folder, 'privateToolchains', privateImage);
    });
    
    // Get the set of the user's public toolchains
    girder.restRequest({
      path: 'folder/publicFolder',
      type: 'GET',
      error: null
    }).done(function (folder) {
      self.renderFolderContents(folder, 'publicToolchains', publicImage);
    });
  },
  renderFolderContents: function (folder, divId, image) {
    let toolchains = new girder.collections.ItemCollection();
    toolchains.altUrl = 'item';
    toolchains.pageLimit = 100;
    toolchains.fetch({
      folderId: folder._id
    });
    toolchains.on('reset', function (items) {
      let toolchainModels = items.models.filter(function (d) {
        if (!d.attributes || !d.attributes.meta) {
          return false;
        }
        return d.attributes.meta.datasets &&
          d.attributes.meta.mappings &&
          d.attributes.meta.visualizations;
      });
      
      if (toolchainModels.length > 0) {
        jQuery('#' + divId).show();
        jQuery('#' + divId + 'Header').show();
      }
      
      let libraryButtons = d3.select('#' + divId)
        .selectAll('.circleButton')
        .data(toolchainModels);

      let libraryButtonsEnter = libraryButtons.enter().append('div')
        .attr('class', (d) => {
          if (d.id === window.mainPage.toolchain.getId()) {
            return 'current circleButton';
          } else {
            return 'circleButton';
          }
        });
      libraryButtons.exit().remove();

      libraryButtonsEnter.append('img');
      libraryButtons.selectAll('img')
        .attr('src', image);

      libraryButtonsEnter.append('span');
      libraryButtons.selectAll('span')
        .text(function (d) {
          return d.name();
        });

      d3.select('#' + divId).selectAll('.circleButton')
        .on('click', function (d) {
          window.mainPage.openToolchain(d.id);
        });
    });
  }
});

export default ToolchainLibrary;
