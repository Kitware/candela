import Widget from '../Widget';
import myTemplate from './template.html';

let SingleDatasetView = Widget.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'Dataset';
    self.hashName = 'singleDatasetView';
    
    self.listenTo(window.toolchain, 'rra:changeDatasets', self.render);
  },
  handleStatusClick: function () {
    window.layout.overlay.render('datasetLibrary');
  },
  render: function () {
    let self = this;
    
    // Get the dataset in the toolchain (if there is one)
    let dataset = window.toolchain.get('meta');
    if (dataset) {
      dataset = dataset.datasets;
      if (dataset) {
        dataset = dataset.at(0);
      }
    }
    
    self.$el.html(myTemplate);
    self.$el.find('button.switchDataset')
      .on('click', function () {
        window.layout.overlay.render('datasetLibrary');
      });

    if (!dataset) {
      self.$el.find('textarea.dataContents')
        .val(''); // .prop('disabled', true);
      self.$el.find('button.switchDataset')
        .text('Choose a dataset');
      self.statusIcon = Widget.warningIcon;
      self.statusText = 'No file loaded';
    } else {
      dataset.loadData(function (rawData) {
        self.$el.find('textarea.dataContents').val(rawData);
        //  .prop('disabled', '');
      });
      self.$el.find('button.switchDataset')
        .text('Switch datasets');
      self.statusIcon = Widget.okayIcon;
      self.statusText = dataset.get('name');
    }
    // TODO: allow the user to edit the data (convert
    // to in-browser dataset)... for now, always disable
    // the textarea
    self.$el.find('textarea.dataContents').prop('disabled', true);
    
    self.renderStatus();
  }
});

export default SingleDatasetView;
