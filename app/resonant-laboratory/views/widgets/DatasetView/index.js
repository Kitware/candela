import Underscore from 'underscore';
import d3 from 'd3';
import ace from 'brace';
import 'brace/theme/textmate';
import Widget from '../Widget';
import Dataset from '../../../models/Dataset';
import myTemplate from './template.html';
import makeValidId from '../../../shims/makeValidId.js';
import './style.css';

let STATUS = {
  NO_DATA: 0,
  SUCCESS: 1,
  CANT_LOAD: 2,
  CANT_PARSE: 3,
  LOADING: 4,
  NO_ATTRIBUTES: 5
};

let DATA_TYPES = d3.keys(Dataset.DEFAULT_INTERPRETATIONS);
let DATA_INTERPRETATIONS = [...new Set(d3.values(Dataset.DEFAULT_INTERPRETATIONS))];

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

    this.listenTo(window.mainPage, 'rl:changeProject',
      this.handleNewProject);
    this.handleNewProject();
  },
  handleNewProject: function () {
    this.$el.html('');
    this.status = STATUS.NO_DATA;

    this.listenTo(window.mainPage.project, 'rl:changeDatasets',
      this.render);
  },
  renderInfoScreen: function () {
    window.mainPage.helpLayer.showTips(this.getDefaultTips());
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
    let datasets = window.mainPage.project.getMeta('datasets');
    let dataset;
    let schema;
    if (datasets && datasets[0] && window.mainPage.loadedDatasets[datasets[0]]) {
      dataset = window.mainPage.loadedDatasets[datasets[0]];
      schema = dataset.getMeta('schema') || {};
    } else {
      schema = {};
    }
    let attrOrder = Object.keys(schema);
    // TODO: this is technically cheating; relying on the order
    // of the dict entries to preserve the order on screen

    let attributes = d3.select(this.el).select('#attributeSettings')
      .selectAll('li.attribute')
      .data(attrOrder, d => d);
    let attributesEnter = attributes.enter().append('li')
      .attr('class', 'attribute');
    attributes.exit().remove();

    let attributeSettingsEnter = attributesEnter.append('div')
      .attr('class', 'attributeSettings');
    let attributeSettings = attributes.selectAll('div');

    // Checkbox to enable the attribute
    attributeSettingsEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'include');
    attributeSettings.selectAll('input.include')
      .attr('id', d => makeValidId(d + 'include'));

    attributeSettingsEnter.append('label')
      .attr('class', 'include');
    attributeSettings.selectAll('label.include')
      .attr('for', d => makeValidId(d + 'include'))
      .text(d => d);

    // Flexbox spacer
    attributeSettingsEnter.append('div')
      .attr('class', 'flexspacer');

    // Data type select menu
    attributeSettingsEnter.append('select')
      .attr('class', 'dataType');
    let typeMenuOptions = attributeSettings
      .selectAll('select.dataType').selectAll('option')
      .data(DATA_TYPES);
    typeMenuOptions.enter().append('option');
    typeMenuOptions.attr('value', d => d)
      .text(d => d);
    attributeSettings.selectAll('select.dataType')
      .property('value', d => dataset.getAttributeType(schema[d]));

    // Data interpretation select menu
    attributeSettingsEnter.append('select')
      .attr('class', 'interpretation');
    let interpretationMenuOptions = attributeSettings
      .selectAll('select.interpretation').selectAll('option')
      .data(DATA_INTERPRETATIONS);
    interpretationMenuOptions.enter().append('option');
    interpretationMenuOptions.attr('value', d => d)
      .text(d => d);
    attributeSettings.selectAll('select.interpretation')
      .property('value', d => dataset.getAttributeInterpretation(schema[d]));

    // Histogram bar container for the whole attribute
    attributeSettingsEnter.append('div')
      .attr('class', 'histogramBarContainer');

    // TODO: show attribute size

    // Expander checkbox (for collapsible list)
    attributesEnter.append('label')
      .attr('class', 'expand');
    attributes.selectAll('label.expand')
      .attr('for', d => makeValidId(d + 'expand'))
      .text('');

    attributesEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'expand');
    attributes.selectAll('input.expand')
      .attr('id', d => makeValidId(d + 'expand'));

    attributesEnter.append('ul').append('li').text('test');
  },
  render: Underscore.debounce(function () {
    if (!this.canRender()) {
      return;
    }

    if (!this.addedTemplate) {
      this.$el.html(myTemplate);
      this.editor = ace.edit('editor');
      this.editor.setOptions({
        fontFamily: 'Cutive Mono, Courier, Monospace',
        fontSize: '10pt'
      });
      this.editor.setTheme('ace/theme/textmate');
      this.editor.$blockScrolling = Infinity;
      this.editor.setReadOnly(true);
      this.addedTemplate = true;
    }

    // Get the dataset in the project (if there is one)
    let dataset = window.mainPage.project.getMeta('datasets');
    if (dataset) {
      dataset = window.mainPage.loadedDatasets[dataset[0]];
    }

    if (!dataset) {
      this.renderPreview('');
      this.$el.find('#attributeSettings').html('');
      this.status = STATUS.NO_DATA;
      this.statusText.text = 'No file loaded';
      this.renderIndicators();
    } else {
      this.status = STATUS.LOADING;
      this.statusText.text = 'Loading...';
      this.renderIndicators();

      this.renderAttributeSettings();

      dataset.parse().then(parsedData => {
        let rawData = dataset.rawCache;
        if (rawData === null) {
          this.renderPreview('');
          this.status = STATUS.CANT_LOAD;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else if (parsedData === null) {
          this.renderPreview(rawData);
          this.status = STATUS.CANT_PARSE;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else if (Object.keys(dataset.getMeta('schema') || {}).length === 0) {
          this.renderPreview(rawData);
          this.status = STATUS.NO_ATTRIBUTES;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else {
          this.renderPreview(rawData);
          this.status = STATUS.SUCCESS;
          this.statusText.text = dataset.get('name');
          this.renderIndicators();
        }
      });
    }
  }, 300),
  renderPreview: function (previewText) {
    if (this.editor) {
      this.editor.setValue(previewText);
    }
  }
});

export default DatasetView;
