import SettingsPanel from '../SettingsPanel';
// import d3 from 'd3';
import myTemplate from './template.html';
import './style.scss';

let DatasetSettings = SettingsPanel.extend({
  initialize: function () {
    this.index = 0;
    SettingsPanel.prototype.initialize.apply(this, arguments);
    this.listenTo(window.mainPage.project, 'rl:changeDatasets', () => {
      this.render();
    });
  },
  getSideMenu: function () {
    return [
      {
        title: 'Dataset Settings',
        items: [
          {
            text: 'Delete dataset',
            onclick: () => null,
            enable: () => { return !!(this.getDataset()); }
          },
          {
            text: 'Remove from project',
            onclick: () => null,
            enable: () => { return !!(this.getDataset()); }
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
  render: function () {
    this.updateBlurb();
    SettingsPanel.prototype.render.apply(this, arguments);

    let datasetObj = this.getDataset();

    if (!datasetObj) {
      // Clear out the template; the blurb will suffice
      this.addedSubTemplate = false;
      this.$el.find('#subclassContent').html('');
    } else {
      if (!this.addedSubTemplate) {
        this.$el.find('#subclassContent').html(myTemplate);
        this.addedSubTemplate = true;
      }

      // Update the paging parameters
      let limitInput = this.$el.find('#limitInput');
      limitInput.val(datasetObj.cache.page.limit);
      this.$el.find('#limitButton')
        .off('click')
        .on('click', () => {
          this.$el.find('#totalPages').text('...');
          datasetObj.setLimit(parseInt(limitInput.val(), 10));
        });
      datasetObj.cache.filteredHistogram.then(histogram => {
        let count = Math.min(histogram.__passedFilters__[0].count,
          datasetObj.cache.page.limit);
        this.$el.find('#totalPages').text(count);
      });

      // TODO: list active filters
    }
  }
});

export default DatasetSettings;
