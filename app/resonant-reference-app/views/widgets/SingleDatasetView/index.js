import d3 from 'd3';
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
    
    // Get the dataset in the toolchain (if there is one)
    let dataset = window.toolchain.get('meta');
    if (dataset) {
      dataset = dataset.datasets;
      if (dataset) {
        dataset = dataset.at(0);
      }
    }
    
    let name = dataset ? dataset.get('name') : 'No file loaded';
    
    let handle = d3.select(self.getIndicatorSpan());
    
    handle.on('click', function () {
      d3.event.stopPropagation();
      window.layout.overlay.render('datasetLibrary');
    });
    handle.text(name);
    
    let handleIcon = handle.selectAll('img').data([0]);
    handleIcon.enter().append('img');
    
    self.$el.html(myTemplate);
    self.$el.find('button.switchDataset')
      .on('click', function () {
        window.layout.overlay.render('datasetLibrary');
      });

    if (!dataset) {
      self.$el.find('textarea.dataContents')
        .val('').prop('disabled', true);
      self.$el.find('button.switchDataset')
        .text('Choose a dataset');
      handleIcon.attr('src', Widget.warningIcon);
    } else {
      dataset.loadData(function (rawData) {
        self.$el.find('textarea.dataContents')
          .prop('disabled', '').val(rawData);
      });
      self.$el.find('button.switchDataset')
        .text('Switch datasets');
      handleIcon.attr('src', Widget.okayIcon);
    }
  }
});

export default SingleDatasetView;
