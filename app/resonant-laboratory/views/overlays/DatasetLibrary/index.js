import SettingsPanel from '../SettingsPanel';
import DatasetSettings from '../DatasetSettings';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';
import libraryFileIcon from '../../../images/light/library.svg';
import privateFileIcon from '../../../images/light/file_private.svg';
import publicFileIcon from '../../../images/light/file_public.svg';
import warningIcon from '../../../images/warning.svg';
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

      jQuery('#girderLink').on('click', () => {
        window.mainPage.router.openUserDirectoriesInGirder();
      });

      jQuery('#loginLink2').on('click', () => {
        window.mainPage.overlay.render('LoginView');
      });

      jQuery('#registerLink2').on('click', () => {
        window.mainPage.overlay.render('RegisterView');
      });

      this.addedSubTemplate = true;
    }

    // Start off with every section hidden
    jQuery('.hideable').hide();

    // Get the set of datasets in the public library
    new Promise((resolve, reject) => {
      girder.restRequest({
        path: 'resource/lookup?path=/collection/Resonant Laboratory Library/Data',
        type: 'GET',
        error: reject
      }).done(resolve).error(reject);
    }).then(folder => {
      this.getFolderContents(folder, 'datasetLibrary', libraryFileIcon);
    }).catch(() => {
    }); // fail silently

    if (window.mainPage.currentUser.isLoggedIn()) {
      // The user is logged in

      // Get the set of the user's private datasets
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'folder/anonymousAccess/privateFolder',
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }).then(folder => {
        this.getFolderContents(folder, 'privateDatasets', privateFileIcon);
      }).catch(() => {
      }); // fail silently

      // Get the set of the user's public projects
      new Promise((resolve, reject) => {
        girder.restRequest({
          path: 'folder/anonymousAccess/publicFolder',
          type: 'GET',
          error: reject
        }).done(resolve).error(reject);
      }).then(folder => {
        this.getFolderContents(folder, 'publicDatasets', publicFileIcon);
      }).catch(() => {
        // fail silently
      });
    } else {
      // The user is logged out
      // TODO: get the set of scratch datasets
      // "belonging" to this user
    }
  },
  getFolderContents: function (folder, divId, icon) {
    let projects = new girder.collections.ItemCollection();
    projects.altUrl = 'item';
    projects.pageLimit = 100;
    projects.fetch({
      folderId: folder._id
    });
    projects.on('reset', (items) => {
      this.renderDatasets(items, divId, icon);
    });
  },
  renderDatasets: function (items, divId, icon) {
    let datasetModels = items.models.filter(d => {
      let meta = d.get('meta');
      return meta && meta.rlab && meta.rlab.itemType && meta.rlab.itemType === 'dataset';
    });

    if (datasetModels.length > 0) {
      jQuery('#' + divId).show();
      jQuery('#' + divId + 'Divider').show();
      jQuery('#' + divId + 'Header').show();
      jQuery('#' + divId + 'Explanation').show();
    }

    let libraryButtons = d3.select('#' + divId)
      .selectAll('.circleButton')
      .data(datasetModels, d => {
        return d.id + d.name();
      });

    let libraryButtonsEnter = libraryButtons.enter().append('div');
    libraryButtons.exit().remove();
    libraryButtons.attr('class', (d) => {
      if (window.mainPage.project &&
        d.id === window.mainPage.project.getId()) {
        return 'current circleButton';
      } else {
        return 'circleButton';
      }
    });

    libraryButtonsEnter.append('img')
      .attr('class', 'projectGlyph');
    libraryButtons.selectAll('img.projectGlyph')
      .attr('src', icon);

    libraryButtonsEnter.append('img')
      .attr('class', 'badge')
      .style('display', 'none');
    window.mainPage.versionNumber.then(appVersion => {
      libraryButtons.selectAll('img.badge')
        .attr('src', warningIcon)
        .style('display', d => {
          if (d.attributes.meta.rlab.versionNumber === appVersion) {
            return 'none';
          } else {
            return 'block';
          }
        })
        .attr('title', d => {
          return 'This dataset was created with version ' + d.attributes.meta.rlab.versionNumber +
            ' of Resonant Laboratory.\nYou are currently using version ' + appVersion;
        });
    });

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
  }
});

export default DatasetLibrary;
