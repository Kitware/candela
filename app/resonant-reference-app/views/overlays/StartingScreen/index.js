import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import privateImage from '../../../images/light/file_private.svg';
import publicImage from '../../../images/light/file_public.svg';
let girder = window.girder;

let StartingScreen = Backbone.View.extend({
  render: function () {
    let self = this;
    
    if (!self.addedTemplate) {
      self.$el.html(myTemplate);
      self.addedTemplate = true;
    }
    
    // Start off with every section hidden
    jQuery('.hideable').hide();
    
    // Set up the default buttons at the top
    jQuery('#startWithVisButton').on('click', () => {
      window.mainPage.overlay.render('VisualizationLibrary');
    });
    jQuery('#startWithDataButton').on('click', () => {
      window.mainPage.overlay.render('DatasetLibrary');
    });
    jQuery('#emptyToolchainButton').on('click', function () {
      window.mainPage.newToolchain();
      window.mainPage.overlay.render(null);
    });
    
    // Get the set of toolchains in the library
    Promise.resolve(girder.restRequest({
      path: 'resource/lookup?path=/collection/ReferenceApp/Toolchains',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.renderFolderContents(folder, 'toolchainLibrary', libImage);
    }).catch(() => {});
    
    // Get the set of the user's private toolchains
    Promise.resolve(girder.restRequest({
      path: 'folder/privateFolder',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.renderFolderContents(folder, 'privateToolchains', privateImage);
    }).catch(() => {});
    
    // Get the set of the user's public toolchains
    Promise.resolve(girder.restRequest({
      path: 'folder/publicFolder',
      type: 'GET',
      error: null
    })).then(function (folder) {
      self.renderFolderContents(folder, 'publicToolchains', publicImage);
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

      let libraryButtonsEnter = libraryButtons.enter().append('div')
        .attr('class', (d) => {
          if (window.mainPage.toolchain &&
              d.id === window.mainPage.toolchain.getId()) {
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
          window.mainPage.switchToolchain(d.id);
          window.mainPage.overlay.render(null);
        });
    });
  }
});

export default StartingScreen;
