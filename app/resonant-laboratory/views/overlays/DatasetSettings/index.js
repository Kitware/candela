import Underscore from 'underscore';
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
    this.$el.find('#offsetInput')
      .val(datasetObj.cache.page.offset)
      .on('change', Underscore.debounce(function () {
        // this refers to the DOM element
        self.$el.find('#totalPages').text('...');
        datasetObj.setOffset(parseInt(this.value, 10));
      }, 300));
    this.$el.find('#limitInput')
      .val(datasetObj.cache.page.limit)
      .on('change', Underscore.debounce(function () {
        // this refers to the DOM element
        self.$el.find('#totalPages').text('...');
        datasetObj.setLimit(parseInt(this.value, 10));
      }, 300));
    datasetObj.cache.filteredHistogram.then(histogram => {
      let count = Math.min(histogram.__passedFilters__[0].count,
        datasetObj.cache.page.limit);
      self.$el.find('#totalPages').text(count);
    });
  }
});

export default DatasetSettings;
