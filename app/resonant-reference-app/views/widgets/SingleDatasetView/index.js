import d3 from 'd3';
import jQuery from 'jquery';
import ace from 'brace';
import 'brace/theme/monokai';
import Widget from '../Widget';
import Dataset from '../../../models/Dataset';
import myTemplate from './template.html';
import './style.css';

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
    self.listenTo(window.toolchain, 'rra:changeMappings', self.renderAttributeSettings);
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
  renderAttributeSettings: function () {
    let self = this;
    let meta = window.toolchain.get('meta');
    let dataset;
    let attrs;
    if (meta && meta.datasets && meta.datasets.at(0)) {
      dataset = meta.datasets.at(0);
      attrs = dataset.getSpec().attributes;
    } else {
      attrs = {};
    }
    let attrOrder = Object.keys(attrs);
    // TODO: this is technically cheating; relying on the order
    // of the dict entries to preserve the order on screen
    
    let cells = d3.select(self.el).select('#attributeSettings')
      .selectAll('div.cell')
      .data(attrOrder, (d) => d + attrs[d]);
    let cellsEnter = cells.enter().append('div')
      .attr('class', 'cell');
    cells.exit().remove();
    
    cellsEnter.append('span');
    cells.selectAll('span').text((d) => d);
    
    cellsEnter.append('select');
    let typeMenuOptions = cells.selectAll('select').selectAll('option')
      .data(d3.keys(Dataset.COMPATIBLE_TYPES));
    typeMenuOptions.enter().append('option');
    typeMenuOptions.attr('value', (d) => d)
      .text((d) => d);
    
    cells.selectAll('select')
      .property('value', (d) => attrs[d])
      .on('change', (d) => {
        let newType = jQuery(d3.event.target).val();
        dataset.setAttribute(d, newType);
      });
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

    // Temporarily force the scroll bars so we
    // account for their size
    self.$el.css('overflow', 'scroll');
    let bounds = {
      width: self.el.clientWidth,
      height: self.el.clientHeight
    };
    self.$el.find('#attributeSettings')
      .css('width', bounds.width + 'px')
      .css('height', '75px');
    self.$el.find('#editor')
      .css('width', bounds.width + 'px')
      .css('height', (bounds.height - 75) + 'px');
    self.$el.css('overflow', '');
    
    self.renderAttributeSettings();
    
    let editor = ace.edit('editor');
    editor.setTheme('ace/theme/monokai');
    editor.$blockScrolling = Infinity;
    
    if (!dataset) {
      editor.setValue('');
      self.ok = false;
      self.statusText.text = 'No file loaded';
      self.renderIndicators();
    } else {
      self.ok = null;
      self.statusText.text = 'Loading...';
      self.renderIndicators();

      dataset.loadData(function (rawData) {
        editor.setValue(rawData);
        self.ok = true;
        self.statusText.text = dataset.get('name');
        self.renderIndicators();
      });
    }
    // TODO: allow the user to edit the data (convert
    // to in-browser dataset)... for now, always disable
    // the textarea
    editor.setReadOnly(true);
  }
});

export default SingleDatasetView;
