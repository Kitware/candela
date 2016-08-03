import SettingsPanel from '../SettingsPanel';
// import d3 from 'd3';
import myTemplate from './template.html';

let DatasetSettings = SettingsPanel.extend({
  initialize: function () {
    SettingsPanel.prototype.initialize.apply(this, [
      'Dataset Settings',
      'blurb',
      [
        {
          text: 'Save a copy',
          onclick: () => null
        }
      ]
    ]);
    this.listenTo(window.mainPage.project, 'rl:changeDatasets', () => {
      this.render();
    });
  },
  render: function () {
    // First the main container
    if (!this.addedTemplate) {
      // SettingsPnale.render will set this.addedTemplate to true
      SettingsPanel.prototype.render.apply(this, arguments);
      this.$el.find('#subclassContent').html(myTemplate);
    }

    // Update the paging parameters
    let datasetObj = window.mainPage.project.getDataset(0);
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
