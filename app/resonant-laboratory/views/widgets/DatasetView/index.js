import Underscore from 'underscore';
import d3 from 'd3';
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
  constructAttributeLookupTable: function () {
    let datasets = window.mainPage.project.getMeta('datasets');
    let lookupTable = {
      attributes: {},
      bins: {},
      highestCount: 0
    };

    if (datasets && datasets[0] && window.mainPage.loadedDatasets[datasets[0]]) {
      lookupTable.dataset = window.mainPage.loadedDatasets[datasets[0]];
      let schema = lookupTable.dataset.getMeta('schema') || {};
      let summaryHistogram = lookupTable.dataset.getMeta('summaryHistogram') || {};
      let currentHistogram = lookupTable.dataset.getMeta('currentHistogram') || {};
      let excludeAttributes = lookupTable.dataset.getMeta('excludeAttributes') || [];

      for (let attrName of Object.keys(schema)) {
        let summary = summaryHistogram[attrName] || [];
        let current = currentHistogram[attrName] || [];

        // Get all the relevant info for the attribute itself
        let attrInfo = {
          included: excludeAttributes.indexOf(attrName) === -1,
          dataType: lookupTable.dataset.getAttributeType(schema[attrName]),
          interpretation: lookupTable.dataset.getAttributeInterpretation(schema[attrName]),
          summaryCount: 0,
          currentCount: 0,
          binOrder: []
        };
        lookupTable.attributes[attrName] = attrInfo;

        // Get all the relevant info for the bins (and count up the total
        // for the attribute while we're at it)
        let keyIntoAll = {};
        summary.forEach((d, i) => {
          attrInfo.summaryCount += d.count;
          let bin = {
            index: i,
            attrName: attrName,
            interpretation: lookupTable.attributes[attrName].interpretation,
            summaryCount: d.count,
            currentCount: 0
          };
          if (d.lowBound || d.highBound) {
            bin.sortKey = d.lowBound;
            bin.range = {
              lowBound: d.lowBound,
              highBound: d.highBound
            };
            bin.humanLabel = '[' + d.lowBound + ', ' + d.highBound + ')';
          } else {
            bin.sortKey = d._id;
            bin.humanLabel = d._id;
          }
          bin.key = attrName + bin.sortKey;
          lookupTable.bins[bin.key] = bin;
          keyIntoAll[d._id] = bin.key;
          lookupTable.attributes[attrName].binOrder.push(bin.key);
        });
        current.forEach(d => {
          if (!keyIntoAll[d._id]) {
            window.mainPage.trigger('rl:error', 'Encountered a current bin that ' +
              'does not have a corresponding summary bin: ' + JSON.stringify(d));
          }
          attrInfo.currentCount += d.count;
          lookupTable.bins[keyIntoAll[d._id]].currentCount = d.count;
        });
        // Make sure the bins are in order for each attribute
        lookupTable.attributes[attrName].binOrder.sort((a, b) => {
          return lookupTable.bins[a].sortKey - lookupTable.bins[b].sortKey;
        });
        // Keep track of the highest count for the scale
        // to be consistent across all bars
        lookupTable.highestCount = Math.max(attrInfo.summaryCount, lookupTable.highestCount);
      }
    }
    return lookupTable;
  },
  renderAttributeSettings: function () {
    let lookupTable = this.constructAttributeLookupTable();
    let attrOrder = Object.keys(lookupTable.attributes);
    // TODO: this is technically cheating; relying on the order
    // of the dict entries to preserve the order on screen

    if (attrOrder.length === 0) {
      this.$el.find('#attributeSettings').html('');
      return;
    }

    let attributes = d3.select(this.el).select('#attributeSettings')
      .selectAll('li.attribute')
      .data(attrOrder, d => d);
    let attributesEnter = attributes.enter().append('li')
      .attr('class', 'attribute');
    attributes.exit().remove();

    let attributeSettingsEnter = attributesEnter.append('div')
      .attr('class', 'attributeSettings');
    let attributeSettings = attributes.selectAll('div');

    // Checkbox to include the attribute
    attributeSettingsEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'include')
      .on('change', function (d) {
        // this refers to the DOM element
        lookupTable.dataset.includeAttribute(d, this.checked);
      });
    attributeSettings.selectAll('input.include')
      .attr('id', d => makeValidId(d + 'include'))
      .property('checked', d => lookupTable.attributes[d].included);

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
      .attr('class', 'dataType')
      .on('change', function (d) {
        // this refers to the DOM element
        lookupTable.dataset.setAttributeType(d, this.value);
      });
    let typeMenuOptions = attributeSettings
      .selectAll('select.dataType').selectAll('option')
      .data(DATA_TYPES);
    typeMenuOptions.enter().append('option');
    typeMenuOptions.attr('value', d => d)
      .text(d => d);
    attributeSettings.selectAll('select.dataType')
      .property('value', d => lookupTable.attributes[d].dataType);

    // Data interpretation select menu
    attributeSettingsEnter.append('select')
      .attr('class', 'interpretation')
      .on('change', function (d) {
        // this refers to the DOM element
        lookupTable.dataset.setAttributeInterpretation(d, this.value);
      });
    let interpretationMenuOptions = attributeSettings
      .selectAll('select.interpretation').selectAll('option')
      .data(DATA_INTERPRETATIONS);
    interpretationMenuOptions.enter().append('option');
    interpretationMenuOptions.attr('value', d => d)
      .text(d => d);
    attributeSettings.selectAll('select.interpretation')
      .property('value', d => lookupTable.attributes[d].interpretation);

    // Histogram bar container for the whole attribute
    let attributeBarsEnter = attributeSettingsEnter.append('div')
      .attr('class', 'histogramBarContainer');

    // Now that we have at least one bar on the page, we can
    // figure out what the scale is
    let barSize = attributeSettings.select('div.histogramBarContainer')
      .node().getBoundingClientRect();
    let barScale = d3.scale.linear().domain([0, lookupTable.highestCount])
      .range([0, barSize.width]);

    // Bar for the summary count
    attributeBarsEnter.append('div')
      .attr('class', 'summary');
    attributeSettings.selectAll('div.histogramBarContainer')
      .selectAll('div.summary')
      .style('width', d => barScale(lookupTable.attributes[d].summaryCount) + 'px');

    // Bar for the current count
    attributeBarsEnter.append('div')
      .attr('class', 'current');
    attributeSettings.selectAll('div.histogramBarContainer')
      .selectAll('div.current')
      .style('width', d => barScale(lookupTable.attributes[d].currentCount) + 'px');

    // Expander checkbox (for collapsible list)
    attributesEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'expand');
    attributes.selectAll('input.expand')
      .attr('id', d => makeValidId(d + 'expand'));

    // Containers for the bins
    attributesEnter.append('ul');
    let bins = attributes.selectAll('ul').selectAll('li.binSettings')
      .data(d => lookupTable.attributes[d].binOrder,
            d => d);
    let binsEnter = bins.enter().append('li')
      .attr('class', 'binSettings');
    bins.exit().remove();
    bins.order();
    bins.attr('class', d => {
      if (lookupTable.bins[d].range) {
        return 'quantitative binSettings';
      } else {
        return 'categorical binSettings';
      }
    });

    // Flexbox spacer
    binsEnter.append('div')
      .attr('class', 'flexspacer');

    // Bin label
    binsEnter.append('label')
      .attr('class', 'include');
    bins.selectAll('label.include')
      .attr('for', d => makeValidId(d + 'include'))
      .text(d => lookupTable.bins[d].humanLabel);

    // Bin checkbox
    binsEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'include')
      .on('click', function (d) {
        // this refers to the DOM element
        let bin = lookupTable.bins[d];
        if (bin.range === undefined) {
          // categorical value is the same as the sortKey
          lookupTable.dataset.includeValue(bin.attrName, bin.sortKey, this.checked);
        } else {
          lookupTable.dataset.includeRange(bin.attrName, bin.range, this.checked);
        }
      });
    bins.selectAll('input.include')
      .attr('id', d => makeValidId(d + 'include'))
      .property('checked', function (d) {
        // this refers to the DOM element
        let bin = lookupTable.bins[d];
        if (bin.range === undefined) {
          // categorical value is the same as the sortKey
          return lookupTable.dataset.isValueIncluded(bin.attrName, bin.sortKey);
        } else {
          let included = lookupTable.dataset.isRangeIncluded(bin.attrName, bin.range);
          if (included === null) {
            this.indeterminate = true;
            return true;
          } else {
            return included;
          }
        }
      });

    // Bin histogram bar container
    let binBarsEnter = binsEnter.append('div')
      .attr('class', 'histogramBarContainer');

    // Bar for the summary count
    binBarsEnter.append('div')
      .attr('class', 'summary');
    bins.selectAll('div.histogramBarContainer')
      .selectAll('div.summary')
      .style('width', d => barScale(lookupTable.bins[d].summaryCount) + 'px');

    // Bar for the current count
    binBarsEnter.append('div')
      .attr('class', 'current');
    bins.selectAll('div.histogramBarContainer')
      .selectAll('div.current')
      .style('width', d => barScale(lookupTable.bins[d].currentCount) + 'px');
  },
  render: Underscore.debounce(function () {
    if (!this.canRender()) {
      return;
    }

    if (!this.addedTemplate) {
      this.$el.html(myTemplate);
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
        if (dataset.rawCache === null) {
          this.status = STATUS.CANT_LOAD;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else if (parsedData === null) {
          this.status = STATUS.CANT_PARSE;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else if (Object.keys(dataset.getMeta('schema') || {}).length === 0) {
          this.status = STATUS.NO_ATTRIBUTES;
          this.statusText.text = 'ERROR';
          this.renderIndicators();
        } else {
          this.status = STATUS.SUCCESS;
          this.statusText.text = dataset.get('name');
          this.renderIndicators();
        }
      });
    }
  }, 300)
});

export default DatasetView;
