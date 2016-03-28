import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import Dataset from '../../../models/Dataset';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import privateImage from '../../../images/light/file_private.svg';
import publicImage from '../../../images/light/file_public.svg';
let girder = window.girder;

let DatasetLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    
    // Start off with every section hidden
    // (I know, this is dumb, but girder's
    // collections have no way of detecting
    // errors when you try to fetch() them)
    jQuery('.hideable').hide();

    girder.restRequest({
      path: 'resource/lookup?path=/collection/ReferenceApp/Data',
      type: 'GET',
      error: null
    }).done(function (folder) {
      self.renderFolderContents(folder, 'datasetLibrary', libImage);
    });

    girder.restRequest({
      path: 'folder/privateFolder',
      type: 'GET',
      error: null
    }).done(function (folder) {
      self.renderFolderContents(folder, 'privateDatasets', privateImage);
    });
    
    girder.restRequest({
      path: 'folder/publicFolder',
      type: 'GET',
      error: null
    }).done(function (folder) {
      self.renderFolderContents(folder, 'publicDatasets', publicImage);
    });
  },
  renderFolderContents: function (folder, divId, image) {
    let datasets = new girder.collections.ItemCollection();
    datasets.altUrl = 'item';
    datasets.pageLimit = 100;
    datasets.fetch({
      folderId: folder._id
    });
    datasets.on('reset', function (items) {
      let datasetModels = items.models.filter(function (d) {
        let ext = d.name();
        if (ext) {
          ext = ext.split('.');
          ext = ext[ext.length - 1].toLowerCase();
        } else {
          return false;
        }
        return Dataset.VALID_EXTENSIONS.indexOf(ext) !== -1;
      });
      if (datasetModels.length > 0) {
        jQuery('#' + divId).show();
        jQuery('#' + divId + 'Header').show();
      }

      let libraryButtons = d3.select('#' + divId)
        .selectAll('.circleButton')
        .data(datasetModels);
      
      let datasetIds = window.mainPage.toolchain.getDatasetIds();
      
      let libraryButtonsEnter = libraryButtons.enter().append('div')
        .attr('class', (d) => {
          if (datasetIds.indexOf(d.id) !== -1) {
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
          window.mainPage.toolchain.setDataset(d);
          window.mainPage.toolchain.openWidget('DatasetView');
          window.mainPage.router.expandWidget('DatasetView');
          window.mainPage.overlay.render(null);
        });
    });
  }
});

export default DatasetLibrary;
