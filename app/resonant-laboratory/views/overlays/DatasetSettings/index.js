import d3 from 'd3';
import Underscore from 'underscore';
import SettingsPanel from '../SettingsPanel';
import canEditIcon from '../../../images/canEdit.svg';
import cantEditIcon from '../../../images/cantEdit.svg';
import privateIcon from '../../../images/private.svg';
import publicIcon from '../../../images/public.svg';
import libraryIcon from '../../../images/library.svg';
import scratchIcon from '../../../images/scratchSpace.svg';
import myTemplate from './template.html';
import './style.scss';

let visibilityIcons = {
  PublicUser: publicIcon,
  PrivateUser: privateIcon,
  PublicLibrary: libraryIcon,
  PublicScratch: scratchIcon
};
let visibilityLabels = {
  PublicUser: 'Others can see this dataset',
  PrivateUser: 'This dataset is private',
  PublicLibrary: 'This is a dataset in our library of examples',
  PublicScratch: 'Others can see and edit this dataset'
};

let DatasetSettings = SettingsPanel.extend({
  initialize: function () {
    SettingsPanel.prototype.initialize.apply(this, arguments);
    // TODO: need to be more clever in initializing this dialog
    // when we have support for multiple datasets
    this.index = 0;

    this.listenTo(window.mainPage, 'rl:changeProject', () => {
      this.attachProjectListeners();
    });
    this.attachProjectListeners();
  },
  attachProjectListeners: function () {
    if (window.mainPage.project) {
      this.stopListening(window.mainPage.project, 'rl:changeDatasets');
      this.listenTo(window.mainPage.project, 'rl:changeDatasets', () => {
        this.attachDatasetListeners();
      });
    }
    this.render();
  },
  attachDatasetListeners: function () {
    this.getDataset().then(dataset => {
      if (dataset) {
        this.stopListening(dataset, 'rl:updateStatus');
        this.listenTo(dataset, 'rl:updateStatus', () => {
          this.render();
        });
      }
    });
  },
  getSideMenu: function () {
    return [
      {
        title: 'Dataset Settings',
        rootPanel: 'DatasetSettings',
        items: [
          {
            text: 'Delete dataset',
            onclick: () => {
              let datasetObj = this.getDataset();
              let currentOverlay = window.mainPage.overlay.template;
              window.mainPage.overlay.confirmDialog('Are you sure you want ' +
                'to delete the "' + datasetObj.get('name') + '" dataset?')
                .then(() => {
                  window.mainPage.project.removeDataset(datasetObj.index)
                    .then(() => {
                      return datasetObj.destroy()
                        .then(() => {
                          window.mainPage.overlay.render(currentOverlay);
                        }).catch((errorObj) => {
                          if (errorObj.statusText === 'Unauthorized') {
                            if (window.mainPage.currentUser.isLoggedIn()) {
                              window.mainPage.overlay.renderErrorScreen(`You don\'t
              have the necessary permissions to delete that dataset.`);
                            } else {
                              window.mainPage.overlay.renderErrorScreen(`Sorry, you
              can\'t delete datasets unless you log in.`);
                            }
                          } else {
                            // Something else happened
                            window.mainPage.trigger('rl:error', errorObj);
                          }
                        });
                    });
                }).catch(() => {
                  window.mainPage.overlay.render(currentOverlay);
                });
            },
            enabled: () => { return !!(this.getDataset()); }
          },
          {
            text: 'Remove from project',
            onclick: () => {
              let index = this.getDataset().index;
              window.mainPage.project.removeDataset(index);
            },
            enabled: () => { return !!(this.getDataset()); }
          },
          {
            text: () => {
              if (window.mainPage.project) {
                if (window.mainPage.project.getDataset(this.index)) {
                  return 'Switch to a different dataset';
                } else {
                  return 'Add a dataset to the project';
                }
              } else {
                return 'Open a dataset in a new project';
              }
            },
            onclick: () => {
              window.mainPage.overlay.render('DatasetLibrary');
            }
          }
        ]
      }
    ];
  },
  getDataset: function () {
    if (window.mainPage.project) {
      return window.mainPage.project.getDataset(this.index);
    } else {
      return undefined;
    }
  },
  updateBlurb: function () {
    if (!this.getDataset()) {
      this.blurb = 'No dataset selected.';
    } else {
      delete this.blurb;
    }
  },
  attachSettingsListeners: function (datasetObj) {
    // Main settings
    this.$el.find('#datasetName').on('keyup',
      Underscore.debounce(function () {
        // this refers to the DOM element
        datasetObj.rename(this.value).then(() => {
          datasetObj.updateStatus();
        });
      }, 300));

    this.$el.find('#publicVisibility, #privateVisibility')
      .on('change', function () {
        // this refers to the DOM element
        /*
          The togglePublic endpoint is smart enough to do the right thing
          (except we need to give it a hint if the user is copying a library
          dataset directly to their public folder)
        */
        datasetObj.restRequest({
          path: 'anonymousAccess/togglePublic',
          type: 'POST',
          data: {
            makePublic: this.value === 'PublicUser'
          }
        }).then(() => {
          datasetObj.updateStatus();
        });
      });

    // Page settings
    this.$el.find('#limitButton')
      .off('click')
      .on('click', () => {
        this.$el.find('#totalPages').text('...');
        datasetObj.setLimit(parseInt(this.$el.find('#limitInput').val(), 10));
      });

    // Filter settings
    // TODO
  },
  updateMainSettings: function (datasetObj) {
    // Initially show the spinner
    // while the status is being fetched
    this.$el.find('#datasetSettingsSpinner').show();
    datasetObj.cache.status.then(status => {
      // Now hide the spinner
      this.$el.find('#datasetSettingsSpinner').hide();

      // Update the dialog with the latest info
      this.$el.find('#datasetName')
        .val(datasetObj.get('name'));

      this.$el.find('#datasetSize')
        .text(d3.format('s')(status.size).toUpperCase() + 'B');

      this.$el.find('#datasetLocation')
        .text(status.path)
        .attr('href', 'girder#item/' + datasetObj.getId());

      if (status.editable) {
        this.$el.find('#editabilityIcon')
          .attr('src', canEditIcon)
          .attr('title', 'You can edit this project');
      } else {
        this.$el.find('#editabilityIcon')
          .attr('src', cantEditIcon)
          .attr('title', 'You can\'t edit this project');
      }

      this.$el.find('#visibilityIcon')
        .attr('src', visibilityIcons[status.visibility])
        .attr('title', visibilityLabels[status.visibility]);

      this.$el.find('input[name="projectVisibility"][value="' + status.visibility + '"]')
        .prop('checked', true);
      if (window.mainPage.currentUser.isLoggedIn()) {
        this.$el.find('#scratchVisibility, #libraryVisibility')
          .prop('disabled', true);
        this.$el.find('#publicVisibility, #privateVisibility')
          .prop('disabled', '');
      } else {
        this.$el.find('#scratchVisibility, #publicVisibility, #privateVisibility, #libraryVisibility')
          .prop('disabled', true);
      }
    });
  },
  updatePageSettings: function (datasetObj) {
    // Update the paging parameters
    this.$el.find('#limitInput').val(datasetObj.cache.page.limit);
    datasetObj.cache.filteredHistogram.then(histogram => {
      let count = Math.min(histogram.__passedFilters__[0].count,
        datasetObj.cache.page.limit);
      this.$el.find('#totalPages').text(count);
    });
  },
  updateFilterSettings: function (datasetObj) {
    // TODO: list active filters
  },
  render: function () {
    this.updateBlurb();
    SettingsPanel.prototype.render.apply(this, arguments);

    this.getDataset(0).then(datasetObj => {
      if (!datasetObj) {
        // Clear out the template; the blurb will suffice
        this.addedSubTemplate = false;
        this.$el.find('#subclassContent').html('');
      } else {
        if (!this.addedSubTemplate) {
          this.$el.find('#subclassContent').html(myTemplate);
          this.addedSubTemplate = true;

          // Only attach event listeners once
          this.attachSettingsListeners(datasetObj);
        }

        this.updateMainSettings(datasetObj);
        this.updatePageSettings(datasetObj);
        this.updateFilterSettings(datasetObj);
      }
    });
  }
});

export default DatasetSettings;
