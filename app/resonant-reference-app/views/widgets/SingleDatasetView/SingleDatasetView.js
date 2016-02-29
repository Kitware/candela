import Backbone from 'backbone';
import myTemplate from './template.html';

let SingleDatasetView = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.$el.html(myTemplate);
    self.$el.find('button.switchDataset')
      .on('click', function () {
        window.layout.overlay.render('datasetLibrary');
      });
  },
  render: function () {
    let self = this;
    let dataset = self.model.at(0);

    if (!dataset) {
      self.$el.find('button.switchDataset')
        .text('Choose a dataset');
    } else {
      self.$el.find('button.switchDataset')
        .text('Switch datasets');
    }
  }
});

module.exports = SingleDatasetView;
