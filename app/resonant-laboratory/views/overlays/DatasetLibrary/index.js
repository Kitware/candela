import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import privateImage from '../../../images/light/file_private.svg';
import publicImage from '../../../images/light/file_public.svg';
let girder = window.girder;

let DatasetLibrary = Backbone.View.extend({
  render: function () {
    this.$el.html(myTemplate);

    // Start off with every section hidden
    // (I know, this is dumb, but girder's
    // collections have no way of detecting
    // errors when you try to fetch() them)
    jQuery('.hideable').hide();

    new Promise((resolve, reject) => {
      girder.restRequest({
        path: 'resource/lookup?path=/collection/ResonantLaboratory/Data',
        type: 'GET',
        error: reject
      }).done(resolve).error(reject);
    }).then(folder => {
      this.renderFolderContents(folder, 'datasetLibrary', libImage);
    }).catch(() => {}); // fail silently

    // Only show the per-account datasets if the user is logged in
    if (window.mainPage.currentUser.isLoggedIn()) {
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'folder/anonymousAccess/privateFolder',
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }).then(folder => {
        this.renderFolderContents(folder, 'privateDatasets', privateImage);
      }).catch(() => {}); // fail silently

      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'folder/anonymousAccess/publicFolder',
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }).then(folder => {
        this.renderFolderContents(folder, 'publicDatasets', publicImage);
      }).catch(() => {}); // fail silently
    }
  },
  renderFolderContents: function (folder, divId, image) {
    let datasets = new girder.collections.ItemCollection();
    datasets.altUrl = 'item';
    datasets.pageLimit = 100;
    datasets.fetch({
      folderId: folder._id
    });
    datasets.on('reset', function (items) {
      let datasetModels = items.models.filter(d => {
        // Assume it's a dataset unless we can identify
        // it as something else... TODO: do something smarter?
        if (d.name() === 'Resonant Laboratory Preferences') {
          // this is a preferences item
          return false;
        }
        let meta = d.get('meta');
        if (meta && meta.datasets) {
          // this is a project
          return false;
        }
        return true;
      });

      if (datasetModels.length > 0) {
        jQuery('#' + divId).show();
        jQuery('#' + divId + 'Header').show();
      }

      let libraryButtons = d3.select('#' + divId)
        .selectAll('.circleButton')
        .data(datasetModels);

      let datasetIds = window.mainPage.project ? window.mainPage.project.getDatasetIds() : [];

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
        .text(d => d.name());

      d3.select('#' + divId).selectAll('.circleButton')
        .on('click', d => {
          if (window.mainPage.project) {
            // We already have a project loaded, so
            // swap it in (TODO: load multiple datasets)
            window.mainPage.project.setDataset(d._id);
            window.mainPage.widgetPanels.toggleWidget({
              hashName: 'DatasetView0'
            }, true);
            window.mainPage.overlay.closeOverlay();
          } else {
            // No project is loaded, so create an empty
            // project with this dataset
            window.mainPage.newProject().then(() => {
              window.mainPage.project.setDataset(d._id);
              window.mainPage.widgetPanels.toggleWidget({
                hashName: 'DatasetView0'
              }, true);
              window.mainPage.overlay.closeOverlay();
            });
          }
        });
    });
  }
});

export default DatasetLibrary;
