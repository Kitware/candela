import Underscore from 'underscore';
import d3 from 'd3';
import SettingsPanel from '../SettingsPanel';
import DatasetSettings from '../DatasetSettings';
import myTemplate from './template.html';
import libraryFileIcon from '../../../images/light/library.svg';
import privateFileIcon from '../../../images/light/file_private.svg';
import publicFileIcon from '../../../images/light/file_public.svg';
import warningIcon from '../../../images/warning.svg';
import './style.scss';
let girder = window.girder;

const SUPPORTED_FORMATS = {
  'text/csv': 'csv',
  'text/tsv': 'csv',
  'text/json': 'json'
};

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
  attachLibraryListeners: function () {
    // Listeners for existing dataset sections
    this.$el.find('#girderLink').on('click', () => {
      window.mainPage.router.openUserDirectoriesInGirder();
    });

    this.$el.find('#loginLink2').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });

    this.$el.find('#registerLink2').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });

    // Listeners for new datset sections
    let self = this;
    this.$el.find('#uploadFile').on('change', function () {
      // this refers to the DOM element
      if (this.files.length > 0) {
        self.fileToUpload = Promise.resolve(this.files[0]);
        // TODO: start sniffing the first bytes of the file using
        // FileReader so that we can display LibreOffice-style
        // CSV import controls, or a widget to construct a
        // JSONPath selector
      } else {
        delete self.fileToUpload;
      }
      self.updateNewDatasetSections();
    });

    this.$el.find('#uploadButton').on('click', () => {
      window.alert('todo');
    });

    this.$el.find('#createLink').on('keyup', Underscore.debounce(function () {
      // this refers to the DOM element
      if (this.value) {
        // Validate the girder item ID (TODO: support other link types)
        self.linkToCreate = window.mainPage.girderRequest({
          path: 'item/' + this.value,
          type: 'GET'
        }).then(item => {
          if (!item || item['_modelType'] !== 'item') {
            return {
              errorMessage: '"' + this.value + '" is not a valid Girder item ID'
            };
          } else {
            return item;
          }
        }).catch(item => {
          return {
            errorMessage: '"' + this.value + '" is not a valid Girder item ID'
          };
        });
      } else {
        delete this.linkToCreate;
      }
      self.updateNewDatasetSections();
    }, 600));

    this.$el.find('#createLinkButton').on('click', () => {
      let itemId = this.$el.find('#createLink').val();
      window.mainPage.girderRequest({
        path: 'item/' + itemId + '/dataset',
        method: 'POST'
      }).then(datasetItem => {
        window.mainPage.getProject().then(project => {
          return project.setDataset(itemId, this.index);
        }).then(() => {
          window.mainPage.widgetPanels.toggleWidget({
            hashName: 'DatasetView' + this.index
          }, true);
          window.mainPage.overlay.closeOverlay();
        });
      });
    });
  },
  updateNewDatasetSections: function () {
    // Start out with all hideable form elements hidden
    this.$el.find('.newDatasetHideable').hide();

    // Set up the upload interface
    // Start with the button disabled
    this.$el.find('#uploadButton').prop('disabled', true);
    if (this.fileToUpload) {
      // Show the spinner while we wait for file sniffing to finish
      // (TODO: currently we don't do any sniffing, so
      // this should resolve immediately)
      this.$el.find('#uploadSpinner').show();

      this.fileToUpload.then(fileObj => {
        this.$el.find('#uploadSpinner').hide();
        let readyToUpload = false;
        if (fileObj.type in SUPPORTED_FORMATS) {
          readyToUpload = true;
          // TODO: show the appropriate advanced settings section
          // and perform additional validation
          this.$el.find('#' + SUPPORTED_FORMATS[fileObj.type] +
            'UploadControls').show();
          this.$el.find('#uploadFile').removeClass('invalid');
        } else {
          this.$el.find('#uploadFile').addClass('invalid');
          this.$el.find('#uploadFileFormatHelp').show();
        }
        this.$el.find('#uploadButton')
          .prop('disabled', !readyToUpload);
      }).catch(fileObj => {
        this.$el.find('#uploadSpinner').hide();
        this.$el.find('#uploadFile').addClass('invalid');
        // TODO: if file sniffing fails, show a more
        // relevant error message
        this.$el.find('#uploadFileFormatHelp').show();
      });
    }

    // Set up the link interface
    // Start with the button disabled
    this.$el.find('#createLinkButton').prop('disabled', true);
    if (this.linkToCreate !== undefined) {
      // Show the spinner while we wait for link validation to finish
      this.$el.find('#linkSpinner').show();

      this.linkToCreate.then(linkResponse => {
        let errorMessage = null;
        if (!linkResponse) {
          errorMessage = 'Could not validate link';
        } else if ('errorMessage' in linkResponse) {
          errorMessage = linkResponse.errorMessage;
        }

        this.$el.find('#linkSpinner').hide();
        if (errorMessage !== null) {
          this.$el.find('#createLink').addClass('invalid');
          this.$el.find('#badLinkHelpText').text(errorMessage);
          this.$el.find('#badLinkHelp').show();
          this.$el.find('#createLinkHelp').show();
        } else {
          this.$el.find('#createLink').removeClass('invalid');
          this.$el.find('#createLinkButton').prop('disabled', false);
        }
      });
    }
  },
  updateExistingDatasetSections: function () {
    // Start off with every hideable section hidden
    this.$el.find('.hideable').hide();

    // Get the set of datasets in the public library
    window.mainPage.girderRequest({
      path: 'resource/lookup?path=/collection/Resonant Laboratory Library/Data',
      type: 'GET'
    }).then(folder => {
      this.getFolderContents(folder, 'datasetLibrary', libraryFileIcon);
    }).catch(() => {
    }); // fail silently

    if (window.mainPage.currentUser.isLoggedIn()) {
      // The user is logged in

      // Get the set of the user's private datasets
      window.mainPage.girderRequest({
        path: 'folder/anonymousAccess/privateFolder',
        type: 'GET'
      }).then(folder => {
        this.getFolderContents(folder, 'privateDatasets', privateFileIcon);
      }).catch(() => {
      }); // fail silently

      // Get the set of the user's public projects
      window.mainPage.girderRequest({
        path: 'folder/anonymousAccess/publicFolder',
        type: 'GET'
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
  render: function () {
    DatasetSettings.prototype.updateBlurb.apply(this, []);
    // We use our own subtemplate, so only call
    // the grandparent superclass render function
    SettingsPanel.prototype.render.apply(this, arguments);
    if (!this.addedSubTemplate) {
      this.$el.find('#subclassContent').html(myTemplate);
      this.addedSubTemplate = true;

      // Only attach event listeners once
      this.attachLibraryListeners();
    }

    this.updateNewDatasetSections();
    this.updateExistingDatasetSections();
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
      this.$el.find('#' + divId + 'Section').show();
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
        window.mainPage.getProject().then(project => {
          return project.setDataset(d.get('_id'), this.index);
        }).then(() => {
          window.mainPage.widgetPanels.toggleWidget({
            hashName: 'DatasetView' + this.index
          }, true);
          window.mainPage.overlay.closeOverlay();
        });
      });
  }
});

export default DatasetLibrary;
