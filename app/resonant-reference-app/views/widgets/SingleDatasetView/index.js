import Widget from '../Widget';
import myTemplate from './template.html';

import loadingHelpTemplate from './loadingHelpTemplate.html';
import successHelpTemplate from './successHelpTemplate.html';
import noDataLoadedTemplate from './noDataLoadedTemplate.html';
import infoTemplate from './infoTemplate.html';

let SingleDatasetView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);
    self.friendlyName = 'Dataset';
    self.hashName = 'singleDatasetView';
    
    self.statusText.onclick = function () {
      window.layout.overlay.render('datasetLibrary');
    };
    self.statusText.title = 'Click to select a different dataset.';
    
    self.infoHint = true;
    self.icons.splice(0, 0, {
      src: function () {
        return self.infoHint ? Widget.newInfoIcon : Widget.infoIcon;
      },
      onclick: function () {
        self.renderInfoScreen();
      }
    });
    
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
      },
      title: function () {
        if (self.ok === null) {
          return 'The dataset hasn\'t finished loading yet';
        } else if (self.ok === true) {
          return 'The dataset appears to have loaded correctly';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: function () {
        self.renderHelpScreen();
      }
    });
    
    self.listenTo(window.toolchain, 'rra:changeDatasets', self.render);
  },
  renderInfoScreen: function () {
    let self = this;
    self.infoHint = false;
    self.renderIndicators();
    
    window.layout.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    let self = this;
    self.infoHint = false;
    
    let message;
    if (self.ok === null) {
      message = loadingHelpTemplate;
    } else if (self.ok === true) {
      message = successHelpTemplate;
    } else {
      let meta = window.toolchain.get('meta');
      
      if (!meta || !meta.visualizations || !meta.visualizations[0]) {
        message = noDataLoadedTemplate;
      }
    }
    
    window.layout.overlay.render(message);
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
