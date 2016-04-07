import d3 from 'd3';
import jQuery from 'jquery';
import ace from 'brace';
import 'brace/theme/clouds';
import Widget from '../Widget';
import Dataset from '../../../models/Dataset';
import myTemplate from './template.html';
import './style.css';

import infoTemplate from './infoTemplate.html';

let STATUS = {
  NO_DATA: 0,
  SUCCESS: 1,
  CANT_LOAD: 2,
  CANT_PARSE: 3,
  LOADING: 4,
  NO_ATTRIBUTES: 5
};

let DatasetView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);
    self.friendlyName = 'Dataset';
    self.hashName = 'DatasetView';

    self.statusText.onclick = function () {
      window.mainPage.overlay.render('DatasetLibrary');
    };
    self.statusText.title = 'Click to select a different dataset.';

    self.newInfo = true;
    self.icons.splice(0, 0, {
      src: function () {
        return self.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: function () {
        return 'About this panel';
      },
      onclick: function () {
        self.renderInfoScreen();
      }
    });

    self.status = STATUS.NO_DATA;
    self.icons.splice(0, 0, {
      src: function () {
        if (self.status === STATUS.LOADING) {
          return Widget.spinnerIcon;
        } else if (self.status === STATUS.SUCCESS) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: function () {
        if (self.status === STATUS.LOADING) {
          return 'The dataset hasn\'t finished loading yet';
        } else if (self.status === STATUS.SUCCESS) {
          return 'The dataset appears to have loaded correctly';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: function () {
        self.renderHelpScreen();
      }
    });

    self.listenTo(window.mainPage.toolchain, 'rra:changeDatasets',
                  self.render);
    self.listenTo(window.mainPage.toolchain, 'rra:changeMappings',
                  self.renderAttributeSettings);
  },
  renderInfoScreen: function () {
    let self = this;
    self.newInfo = false;
    self.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    let self = this;
    let screen;
    if (self.status === STATUS.NO_DATA) {
      screen = self.getErrorScreen(`
You have not chosen a dataset yet. Click 
<a onclick="window.mainPage.overlay.render('DatasetLibrary')">
here</a> to choose one.`);
    } else if (self.status === STATUS.SUCCESS) {
      screen = self.getSuccessScreen(`
The dataset appears to have loaded correctly.`);
    } else if (self.status === STATUS.CANT_LOAD) {
      screen = self.getErrorScreen(`
The dataset could not be loaded; there is a good chance
that there is a permissions problem.`);
    } else if (self.status === STATUS.CANT_PARSE) {
      screen = self.getErrorScreen(`
There was a problem parsing the data; you'll probably need to
<a>edit</a> or <a>reshape</a> the data in order to use it.`);
    } else if (self.status === STATUS.NO_ATTRIBUTES) {
      screen = self.getErrorScreen(`
There was a problem parsing the data. Specifically, we're having
trouble understanding the dataset attributes (usually column headers);
you'll probably need to
<a>edit</a> or <a>reshape</a> the data in order to use it.`);
    }

    window.mainPage.overlay.render(screen);
  },
  renderAttributeSettings: function () {
    let self = this;
    let datasets = window.mainPage.toolchain.getMeta('datasets');
    let dataset;
    let attrs;
    if (datasets && datasets.at(0)) {
      dataset = datasets.at(0);
      attrs = dataset.getSpec().attributes;
    } else {
      attrs = {};
    }
    let attrOrder = Object.keys(attrs);
    // TODO: this is technically cheating; relying on the order
    // of the dict entries to preserve the order on screen

    let cells = d3.select(self.el).select('#attributeSettings')
      .selectAll('div.cell')
      .data(attrOrder, d => d + attrs[d]);
    let cellsEnter = cells.enter().append('div')
      .attr('class', 'cell');
    cells.exit().remove();

    cellsEnter.append('span');
    cells.selectAll('span').text(d => d);

    cellsEnter.append('select');
    let typeMenuOptions = cells.selectAll('select').selectAll('option')
      .data(d3.keys(Dataset.COMPATIBLE_TYPES));
    typeMenuOptions.enter().append('option');
    typeMenuOptions.attr('value', d => d)
      .text(d => d);

    cells.selectAll('select')
      .property('value', d => attrs[d])
      .on('change', d => {
        let newType = jQuery(d3.event.target).val();
        dataset.setAttribute(d, newType);
      });
  },
  render: function () {
    let self = this;

    // Get the dataset in the toolchain (if there is one)
    let dataset = window.mainPage.toolchain.getMeta('datasets');
    if (dataset) {
      dataset = dataset.at(0);
    }

    self.$el.html(myTemplate);

    // Temporarily force the scroll bars so we
    // account for their size
    /* self.$el.css('overflow', 'scroll');
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
    self.$el.css('overflow', '');*/

    self.renderAttributeSettings();

    let editor = ace.edit('editor');
    editor.setOptions({
      fontFamily: 'Cutive Mono, Courier, Monospace',
      fontSize: '10pt'
    });
    editor.setTheme('ace/theme/clouds');
    editor.$blockScrolling = Infinity;

    if (!dataset) {
      editor.setValue('');
      self.status = STATUS.NO_DATA;
      self.statusText.text = 'No file loaded';
      self.renderIndicators();
    } else {
      self.status = STATUS.LOADING;
      self.statusText.text = 'Loading...';
      self.renderIndicators();

      dataset.getParsed(function (parsedData) {
        let rawData = dataset.rawCache;
        let spec = dataset.getSpec();
        if (rawData === null) {
          editor.setValue('');
          self.status = STATUS.CANT_LOAD;
          self.statusText.text = 'ERROR';
          self.renderIndicators();
        } else if (parsedData === null) {
          editor.setValue(rawData);
          self.status = STATUS.CANT_PARSE;
          self.statusText.text = 'ERROR';
          self.renderIndicators();
        } else if (Object.keys(spec.attributes).length === 0) {
          editor.setValue(rawData);
          self.status = STATUS.NO_ATTRIBUTES;
          self.statusText.text = 'ERROR';
          self.renderIndicators();
        } else {
          editor.setValue(rawData);
          self.status = STATUS.SUCCESS;
          self.statusText.text = dataset.get('name');
          self.renderIndicators();
        }
      });
    }
    // TODO: allow the user to edit the data (convert
    // to in-browser dataset)... for now, always disable
    // the textarea
    editor.setReadOnly(true);
  }
});

export default DatasetView;
