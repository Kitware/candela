import Underscore from 'underscore';
import d3 from 'd3';
import jQuery from 'jquery';
import ace from 'brace';
import 'brace/theme/textmate';
import Widget from '../Widget';
import Dataset from '../../../models/Dataset';
import myTemplate from './template.html';
import './style.css';

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
    this.statusText.title = 'Select a different dataset.';

    this.icons.splice(0, 0, {
      src: () => {
        return window.mainPage.currentUser.preferences
          .hasSeenAllTips(this.getDefaultTips()) ? Widget.infoIcon : Widget.newInfoIcon;
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
          return "The dataset hasn't finished loading yet";
        } else if (this.status === STATUS.SUCCESS) {
          return 'The dataset appears to have loaded correctly';
        } else {
          return "Something isn't quite right; click for details";
        }
      },
      onclick: () => {
        this.renderInfoScreen();
      }
    });

    this.listenTo(window.mainPage, 'rra:changeProject',
      this.handleNewProject);
    this.handleNewProject();
  },
  handleNewProject: function () {
    this.$el.html('');
    this.status = STATUS.NO_DATA;

    this.listenTo(window.mainPage.project, 'rra:changeDatasets',
      this.render);
    this.listenTo(window.mainPage.project, 'rra:changeMatchings',
      this.renderAttributeSettings);
  },
  renderInfoScreen: function () {
    window.mainPage.helpLayer.setTips(this.getDefaultTips());
    window.mainPage.helpLayer.show();
  },
  renderHelpScreen: function () {
    if (this.status === STATUS.NO_DATA) {
      window.mainPage.overlay.renderUserErrorScreen('You have not chosen a dataset yet. Click <a onclick="window.mainPage.overlay.render(\'DatasetLibrary\')">here</a> to choose one.');
    } else if (this.status === STATUS.SUCCESS) {
      window.mainPage.overlay.renderSuccessScreen('The dataset appears to have loaded correctly.');
    } else if (this.status === STATUS.CANT_LOAD) {
      window.mainPage.overlay.renderErrorScreen('The dataset could not be loaded; there is a good chance that there is a permissions problem.');
    } else if (this.status === STATUS.CANT_PARSE) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data; you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    } else if (this.status === STATUS.NO_ATTRIBUTES) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data. Specifically, we\'re having trouble understanding the dataset attributes (usually column headers); you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    }
  },
  renderAttributeSettings: function () {
    if (!this.canRender()) {
      return;
    }

    let datasets = window.mainPage.project.getMeta('datasets');
    let dataset;
    let attrs;
    if (datasets && datasets[0] && window.mainPage.loadedDatasets[datasets[0]]) {
      dataset = window.mainPage.loadedDatasets[datasets[0]];
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
  render: Underscore.debounce(function () {
    if (!this.canRender()) {
      return;
    }

    // Get the dataset in the project (if there is one)
    let dataset = window.mainPage.project.getMeta('datasets');
    if (dataset) {
      dataset = window.mainPage.loadedDatasets[dataset[0]];
    }

    this.$el.html(myTemplate);

    this.renderAttributeSettings();

    let editor = ace.edit('editor');
    editor.setOptions({
      fontFamily: 'Cutive Mono, Courier, Monospace',
      fontSize: '10pt'
    });
    editor.setTheme('ace/theme/textmate');
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

      dataset.parse().then(parsedData => {
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
  }, 300)
});

export default DatasetView;
