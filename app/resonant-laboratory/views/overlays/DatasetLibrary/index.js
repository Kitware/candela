import SettingsPanel from '../SettingsPanel';
import DatasetSettings from '../DatasetSettings';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import libImage from '../../../images/light/library.svg';
import privateImage from '../../../images/light/file_private.svg';
import publicImage from '../../../images/light/file_public.svg';
let girder = window.girder;

let DatasetLibrary = DatasetSettings.extend({
  initialize: function () {
    DatasetSettings.prototype.initialize.apply(this, arguments);
    this.listenTo(window.mainPage.currentUser, 'rl:updateLibrary', () => {
      this.render();
    });
  },
  getSideMenu: function () {
    let sideMenu = DatasetSettings.prototype.getSideMenu.apply(this, arguments);
    // Override parts of the menu item from DatasetSettings
    sideMenu[0].items[2].focused = true;
    sideMenu[0].items[2].onclick = () => {
      window.mainPage.overlay.render('DatasetSettings');
    };
    return sideMenu;
  },
  render: function () {
    // We use our own subtemplate, so only call
    // the grandparent superclass render function
    SettingsPanel.prototype.render.apply(this, arguments);
    if (!this.addedSubTemplate) {
      this.$el.find('#subclassContent').html(myTemplate);
      this.addedSubTemplate = true;
    }

    // Start off with every section hidden
    // (I know, this is dumb, but girder's
    // collections have no way of detecting
    // errors when you try to fetch() them)
    jQuery('.hideable').hide();

    new Promise((resolve, reject) => {
      girder.restRequest({
        path: 'resource/lookup?path=/collection/Resonant Laboratory Library/Data',
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
        let meta = d.get('meta');
        return !(!meta || !meta.rlab || !meta.rlab.itemType || meta.rlab.itemType !== 'dataset');
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
          let projectPromise;
          if (window.mainPage.project) {
            projectPromise = Promise.resolve(window.mainPage.project);
          } else {
            // No project is loaded, so create an empty
            // project with this dataset
            projectPromise = window.mainPage.newProject();
          }
          projectPromise.then(project => {
            return project.setDataset(d.get('_id'));
          }).then(() => {
            window.mainPage.widgetPanels.toggleWidget({
              hashName: 'DatasetView0'
            }, true);
            window.mainPage.overlay.closeOverlay();
          });
        });
    });
  }
});

export default DatasetLibrary;
