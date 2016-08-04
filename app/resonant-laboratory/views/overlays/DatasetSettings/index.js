import SettingsPanel from '../SettingsPanel';
// import d3 from 'd3';
import myTemplate from './template.html';
import './style.scss';

let DatasetSettings = SettingsPanel.extend({
  initialize: function () {
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
            onclick: () => null
          },
          {
            text: 'Remove from project',
            onclick: () => null
          },
          {
            text: 'Switch to a different dataset',
            onclick: () => {
              window.mainPage.overlay.render('DatasetLibrary');
            }
          }
        ]
      }
    ];
  },
  render: function () {
    SettingsPanel.prototype.render.apply(this, arguments);
    if (!this.addedSubTemplate) {
      this.$el.find('#subclassContent').html(myTemplate);
      this.addedSubTemplate = true;
    }

    let datasetObj = window.mainPage.project.getDataset(0);

    // Update the paging parameters
    let limitInput = this.$el.find('#limitInput');
    limitInput.val(datasetObj.cache.page.limit);
    this.$el.find('#limitButton').on('click', () => {
      this.$el.find('#totalPages').text('...');
      datasetObj.setLimit(parseInt(limitInput.val(), 10));
    });
    datasetObj.cache.filteredHistogram.then(histogram => {
      let count = Math.min(histogram.__passedFilters__[0].count,
        datasetObj.cache.page.limit);
      this.$el.find('#totalPages').text(count);
    });
  }
});

export default DatasetSettings;
