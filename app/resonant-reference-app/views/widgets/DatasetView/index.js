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
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);
    this.friendlyName = 'Dataset';

    this.statusText.onclick = () => {
      window.mainPage.overlay.render('DatasetLibrary');
    };
    this.statusText.title = 'Click to select a different dataset.';

    this.newInfo = true;
    this.icons.splice(0, 0, {
      src: () => {
        return this.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: () => {
        return 'About this panel';
      },
      onclick: () => {
        this.renderInfoScreen();
      }
    });

    this.status = STATUS.NO_DATA;
    this.icons.splice(0, 0, {
      src: () => {
        if (this.status === STATUS.LOADING) {
          return Widget.spinnerIcon;
        } else if (this.status === STATUS.SUCCESS) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: () => {
        if (this.status === STATUS.LOADING) {
          return 'The dataset hasn\'t finished loading yet';
        } else if (this.status === STATUS.SUCCESS) {
          return 'The dataset appears to have loaded correctly';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: () => {
        this.renderHelpScreen();
      }
    });

    this.listenTo(window.mainPage.toolchain, 'rra:changeDatasets',
                  this.render);
    this.listenTo(window.mainPage.toolchain, 'rra:changeMappings',
                  this.renderAttributeSettings);
  },
  renderInfoScreen: function () {
    this.newInfo = false;
    this.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    let screen;
    if (this.status === STATUS.NO_DATA) {
      screen = this.getErrorScreen(`
You have not chosen a dataset yet. Click 
<a onclick="window.mainPage.overlay.render('DatasetLibrary')">
here</a> to choose one.`);
    } else if (this.status === STATUS.SUCCESS) {
      screen = this.getSuccessScreen(`
The dataset appears to have loaded correctly.`);
    } else if (this.status === STATUS.CANT_LOAD) {
      screen = this.getErrorScreen(`
The dataset could not be loaded; there is a good chance
that there is a permissions problem.`);
    } else if (this.status === STATUS.CANT_PARSE) {
      screen = this.getErrorScreen(`
There was a problem parsing the data; you'll probably need to
<a>edit</a> or <a>reshape</a> the data in order to use it.`);
    } else if (this.status === STATUS.NO_ATTRIBUTES) {
      screen = this.getErrorScreen(`
There was a problem parsing the data. Specifically, we're having
trouble understanding the dataset attributes (usually column headers);
you'll probably need to
<a>edit</a> or <a>reshape</a> the data in order to use it.`);
    }

    window.mainPage.overlay.render(screen);
  },
  renderAttributeSettings: function () {
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

    let cells = d3.select(this.el).select('#attributeSettings')
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
    // Get the dataset in the toolchain (if there is one)
    let dataset = window.mainPage.toolchain.getMeta('datasets');
    if (dataset) {
      dataset = dataset.at(0);
    }
    
    this.$el.html(myTemplate);

    // Temporarily force the scroll bars so we
    // account for their size
    /* this.$el.css('overflow', 'scroll');
    let bounds = {
      width: this.el.clientWidth,
      height: this.el.clientHeight
    };
    this.$el.find('#attributeSettings')
      .css('width', bounds.width + 'px')
      .css('height', '75px');
    this.$el.find('#editor')
      .css('width', bounds.width + 'px')
      .css('height', (bounds.height - 75) + 'px');
    this.$el.css('overflow', '');*/

    this.renderAttributeSettings();

    let editor = ace.edit('editor');
    editor.setOptions({
      fontFamily: 'Cutive Mono, Courier, Monospace',
      fontSize: '10pt'
    });
    editor.setTheme('ace/theme/clouds');
    editor.$blockScrolling = Infinity;

    if (!dataset) {
      editor.setValue('');
      this.status = STATUS.NO_DATA;
      this.statusText.text = 'No file loaded';
      this.renderIndicators();
    } else {
      this.status = STATUS.LOADING;
      this.statusText.text = 'Loading...';
      this.renderIndicators();

      dataset.getParsed(parsedData => {
        let rawData = dataset.rawCache;
        let spec = dataset.getSpec();
        if (rawData === null) {
          editor.setValue('');
          this.status = STATUS.CANT_LOAD;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else if (parsedData === null) {
          editor.setValue(rawData);
          this.status = STATUS.CANT_PARSE;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else if (Object.keys(spec.attributes).length === 0) {
          editor.setValue(rawData);
          this.status = STATUS.NO_ATTRIBUTES;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else {
          editor.setValue(rawData);
          this.status = STATUS.SUCCESS;
          this.statusText.text = dataset.get('name');
          this.renderIndicators();
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
