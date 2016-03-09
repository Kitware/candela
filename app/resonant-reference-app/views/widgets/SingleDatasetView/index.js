import Widget from '../Widget';
import myTemplate from './template.html';

let SingleDatasetView = Widget.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'Dataset';
    self.hashName = 'singleDatasetView';
    
    self.listenTo(window.toolchain, 'rra:changeDatasets', self.render);
  },
  render: function () {
    let self = this;
    
    self.$el.html(myTemplate);
    self.$el.find('button.switchDataset')
      .on('click', function () {
        window.layout.overlay.render('datasetLibrary');
      });
    
    let dataset = window.toolchain.get('meta');
    if (dataset) {
      dataset = dataset.datasets;
      if (dataset) {
        dataset = dataset.at(0);
      }
    }

    if (!dataset) {
      self.$el.find('button.switchDataset')
        .text('Choose a dataset');
      self.$el.find('div.fileName')
        .text('No file loaded.');
    } else {
      self.$el.find('button.switchDataset')
        .text('Switch datasets');
      self.$el.find('div.fileName')
        .text(dataset.get('name'));
    }
  }
});

export default SingleDatasetView;
