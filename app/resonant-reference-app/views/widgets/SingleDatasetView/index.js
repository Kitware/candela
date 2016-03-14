import Widget from '../Widget';
import myTemplate from './template.html';

let SingleDatasetView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);
    self.friendlyName = 'Dataset';
    self.hashName = 'singleDatasetView';
    
    self.ok = null;
    self.icons.splice(0, 0, {
      src: function () {
        if (self.ok === null) {
          return Widget.spinnerIcon;
        } else if (self.ok === true) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      }
    });
    
    self.statusText.onclick = function () {
      window.layout.overlay.render('datasetLibrary');
    };
    
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
      
      self.ok = false;
      self.statusText.text = 'No file loaded';
      self.renderIndicators();
    } else {
      self.ok = null;
      self.statusText.text = 'Loading...';
      self.renderIndicators();
      
      dataset.loadData(function (rawData) {
        self.$el.find('textarea.dataContents').val(rawData);
        //  .prop('disabled', '');
        self.ok = true;
        self.statusText.text = dataset.get('name');
        self.renderIndicators();
      });
      self.$el.find('button.switchDataset')
        .text('Switch datasets');
    }
    // TODO: allow the user to edit the data (convert
    // to in-browser dataset)... for now, always disable
    // the textarea
    self.$el.find('textarea.dataContents').prop('disabled', true);
  }
});

export default SingleDatasetView;
