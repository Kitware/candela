import Backbone from 'backbone';
// import d3 from 'd3';
import myTemplate from './template.html';

let DatasetSettings = Backbone.View.extend({
  initialize: function () {
    this.listenTo(window.mainPage.project, 'rl:changeDatasets', () => {
      this.render();
    });
  },
  render: function () {
    let self = this;
    if (!this.addedTemplate) {
      this.$el.html(myTemplate);
      this.addedTemplate = true;
    }

    // Update the paging parameters
    let datasetObj = window.mainPage.project.getDataset(0);
    let limitInput = this.$el.find('#limitInput');
    limitInput.val(datasetObj.cache.page.limit);
    this.$el.find('#limitButton').on('click', () => {
      self.$el.find('#totalPages').text('...');
      datasetObj.setLimit(parseInt(limitInput.val(), 10));
    });
    datasetObj.cache.filteredHistogram.then(histogram => {
      let count = Math.min(histogram.__passedFilters__[0].count,
        datasetObj.cache.page.limit);
      self.$el.find('#totalPages').text(count);
    });
  }
});

export default DatasetSettings;
