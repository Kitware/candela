import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import canEditIcon from '../../../images/canEdit.svg';
import cantEditIcon from '../../../images/cantEdit.svg';
import libraryFileIcon from '../../../images/light/library.svg';
import privateFileIcon from '../../../images/light/file_private.svg';
import publicFileIcon from '../../../images/light/file_public.svg';
import privateIcon from '../../../images/private.svg';
import publicIcon from '../../../images/public.svg';
import libraryIcon from '../../../images/library.svg';
import scratchIcon from '../../../images/scratchSpace.svg';
import '../../../shims/copyToClipboard.js';
import './style.css';
let girder = window.girder;

let visibilityIcons = {
  UserPublic: publicIcon,
  UserPrivate: privateIcon,
  PublicLibrary: libraryIcon,
  PublicScratch: scratchIcon
};
let visibilityLabels = {
  UserPublic: 'Others can see this toolchain in your Public folder',
  UserPrivate: 'Only you can see this toolchain in your Private folder',
  PublicLibrary: 'This is a toolchain in our library of examples',
  PublicScratch: 'Others can see and edit this toolchain'
};

let ToolchainSettings = Backbone.View.extend({
  handleNewToolchain: function () {
    let self = this;
    // Don't bother re-rendering this view until we have the new toolchain's
    // updated status
    self.listenTo(window.mainPage.toolchain, 'rra:changeStatus', self.render);
  },
  render: function () {
    let self = this;
    
    if (!self.addedTemplate) {
      self.$el.html(myTemplate);
      self.addedTemplate = true;
      
      // Wire up simple events that don't change
      jQuery('#copyLinkButton').on('click', () => {
        window.copyTextToClipboard(window.location.href);
      });

      jQuery('#girderButton').on('click', () => {
        window.mainPage.router.openToolchainInGirder();
      });
      
      jQuery('#saveAsButton').on('click', function () {
        window.mainPage.toolchain.makeCopy();
      });
      
      jQuery('#deleteButton').on('click', function () {
        window.mainPage.toolchain.destroy({
          success: () => {
            window.mainPage.switchToolchain(null);
          }
        });
      });
      
      jQuery('#newButton').on('click', function () {
        window.mainPage.newToolchain();
      });
      
      self.listenTo(window.mainPage.toolchain, 'rra:changeStatus', self.render);
      self.listenTo(window.mainPage, 'rra:changeToolchain', self.handleNewToolchain);
    }
    
    // Start off with every section hidden
    jQuery('.hideable').hide();
    
    // Set up the settings part of the dialog
    jQuery('#toolchainNameField').val(window.mainPage.toolchain.get('name'));
    jQuery('#toolchainNameField').on('keyup',
      Underscore.debounce(function () {
        window.mainPage.toolchain.rename(this.value);
      }, 300));
    
    let status = window.mainPage.toolchain.status;
    
    if (status.editable) {
      jQuery('#editabilityIcon').attr('src', canEditIcon);
      jQuery('#editabilityLabel').text('You can edit this toolchain');
      jQuery('#deleteButton').prop('disabled', '');
    } else {
      jQuery('#editabilityIcon').attr('src', cantEditIcon);
      jQuery('#editabilityLabel').text('You can\'t edit this toolchain');
      jQuery('#deleteButton').prop('disabled', true);
    }
    
    jQuery('#visibilityIcon').attr('src', visibilityIcons[status.location]);
    jQuery('#visibilityLabel').text(visibilityLabels[status.location]);
    jQuery('input[name="toolchainVisibility"][value="' + status.location + '"]')
      .prop('checked', true);
    
    // Get the set of toolchains in the library
    Promise.resolve(girder.restRequest({
      path: 'resource/lookup?path=/collection/ReferenceApp/Toolchains',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.renderFolderContents(folder, 'toolchainLibrary', libraryFileIcon);
    }).catch(() => {});
    
    // Get the set of the user's private toolchains
    Promise.resolve(girder.restRequest({
      path: 'folder/privateFolder',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.renderFolderContents(folder, 'privateToolchains', privateFileIcon);
    }).catch(() => {});
    
    // Get the set of the user's public toolchains
    Promise.resolve(girder.restRequest({
      path: 'folder/publicFolder',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.renderFolderContents(folder, 'publicToolchains', publicFileIcon);
    }).catch(() => {});
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

      let libraryButtonsEnter = libraryButtons.enter().append('div');
      libraryButtons.exit().remove();
      libraryButtons.attr('class', (d) => {
        if (d.id === window.mainPage.toolchain.getId()) {
          return 'current circleButton';
        } else {
          return 'circleButton';
        }
      });

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
          window.mainPage.switchToolchain(d.id);
        });
    });
  }
});

export default ToolchainSettings;
