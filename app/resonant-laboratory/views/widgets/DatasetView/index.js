import Underscore from 'underscore';
import d3 from 'd3';
import jQuery from 'jquery';
import ComboScale from './comboScale.js';
import Dataset from '../../../models/Dataset.js';
import Widget from '../Widget';
import Menu from '../../overlays/Menu';
import myTemplate from './template.html';
import histogramTemplate from './histogramTemplate.html';
import rewrap from '../../../shims/svgTextWrap.js';
import makeValidId from '../../../shims/makeValidId.js';
import './style.scss';
import './tablePreview.scss';
import './histogramPreview.scss';

import seekFirst from '../../../images/seekFirst.svg';
import seekPrev from '../../../images/seekPrev.svg';
import seekNext from '../../../images/seekNext.svg';
import seekLast from '../../../images/seekLast.svg';
import tablePreviewIcon from '../../../images/table.svg';
import tableSwitchIcon from '../../../images/switch.svg';
import histogramPreviewIcon from '../../../images/histogram.svg';
import booleanIcon from '../../../images/boolean.svg';
import integerIcon from '../../../images/integer.svg';
import numberIcon from '../../../images/number.svg';
import dateIcon from '../../../images/date.svg';
import stringIcon from '../../../images/string.svg';
import stringListIcon from '../../../images/string_list.svg';
import objectIcon from '../../../images/object.svg';
import categorical from '../../../images/categorical.svg';
import ordinal from '../../../images/ordinal.svg';
import check from '../../../images/check.svg';
import ex from '../../../images/ex.svg';
import dash from '../../../images/dash.svg';

let ICONS = {
  seekFirst,
  seekPrev,
  seekNext,
  seekLast,
  tablePreviewIcon,
  tableSwitchIcon,
  histogramPreviewIcon,
  boolean: booleanIcon,
  integer: integerIcon,
  number: numberIcon,
  date: dateIcon,
  string: stringIcon,
  string_list: stringListIcon,
  object: objectIcon,
  categorical,
  ordinal,
  check,
  ex,
  dash
};

let STATUS = {
  NO_DATA: 0,
  SUCCESS: 1,
  CANT_LOAD: 2,
  LOADING: 3,
  NO_ATTRIBUTES: 4
};

let TYPE_MENU_ITEMS = [
  {
    text: 'Autodetect',
    value: null
  },
  null,
  {
    icon: ICONS.boolean,
    text: 'Boolean',
    value: 'boolean'
  },
  {
    icon: ICONS.integer,
    text: 'Integer',
    value: 'integer'
  },
  {
    icon: ICONS.number,
    text: 'Number',
    value: 'number'
  },
  {
    icon: ICONS.date,
    text: 'Date',
    value: 'date'
  },
  {
    icon: ICONS.string,
    text: 'String',
    value: 'string'
  },
  {
    icon: ICONS.object,
    text: 'Object (no type coercion)',
    value: 'object'
  }
];
let INTERPRETATION_MENU_ITEMS = [
  {
    text: 'Autodetect',
    value: null
  },
  null,
  {
    icon: ICONS.categorical,
    text: 'Categorical',
    value: 'categorical'
  },
  {
    icon: ICONS.ordinal,
    text: 'Ordinal',
    value: 'ordinal'
  }
];

let DatasetView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);

    this.showTable = false;
    this.histogramScales = {};

    this.icons.splice(0, 0, {
      src: Widget.settingsIcon,
      title: 'Dataset filter and paging settings',
      onclick: () => {
        if (window.mainPage.project &&
            window.mainPage.project.getMeta('datasets').length > 0) {
          window.mainPage.overlay.render('DatasetSettings');
        }
      },
      className: () => {
        if (window.mainPage.project &&
            window.mainPage.project.getMeta('datasets').length > 0) {
          return null;
        } else {
          return 'disabled';
        }
      }
    });

    this.icons.splice(0, 0, {
      src: Widget.swapIcon,
      title: 'Click to select a different dataset',
      onclick: () => {
        window.mainPage.overlay.render('DatasetLibrary');
      }
    });

    this.status = STATUS.NO_DATA;
    this.icons.push({
      src: () => {
        if (this.status === STATUS.LOADING) {
          return Widget.spinnerIcon;
        } else if (this.status === STATUS.SUCCESS) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      className: () => {
        if (this.status === STATUS.LOADING) {
          return 'loading';
        } else if (this.status === STATUS.SUCCESS) {
          return 'okay';
        } else {
          return 'warning';
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
      this.attachProjectListeners);
    this.attachProjectListeners();
  },
  attachProjectListeners: function () {
    if (window.mainPage.project) {
      this.stopListening(window.mainPage.project, 'rl:changeDatasets');
      this.listenTo(window.mainPage.project, 'rl:changeDatasets',
        this.render);
    }

    this.render();
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
      window.mainPage.overlay.renderUserErrorScreen('The dataset could not be loaded! You might want to check whether you have the necessary permissions.');
    } else if (this.status === STATUS.CANT_PARSE) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data; you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    } else if (this.status === STATUS.NO_ATTRIBUTES) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data. Specifically, we\'re having trouble understanding the dataset attributes (usually column headers); you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    }
  },
  renderEmptyState: function () {
    this.$el.find('#datasetOverview, #tablePreview, #histogramPreview').hide();
    this.$el.find('#noDatasetState').show();
  },
  renderFilterPie: function (overviewCount, filteredCount, pageOffset, pageCount, radius) {
    // Draw a pie using the left square of space
    // I know, eww: a pie. But in this case,
    // there isn't a distant slice comparison problem,
    // and we want to drive home the "you're working
    // with a subset" connotation.

    // We want to center the filtered slice on the right
    let filteredRadians = 2 * Math.PI * filteredCount / overviewCount;
    let radianScale = d3.scale.linear()
      .domain([0, overviewCount])
      .range([Math.PI / 2 - filteredRadians / 2,
              2.5 * Math.PI - filteredRadians / 2]);
    let pieData = [
      {
        slice: 'overview',
        offset: 0,
        count: overviewCount
      },
      {
        slice: 'filtered',
        offset: 0,
        count: filteredCount
      },
      {
        slice: 'page',
        offset: pageOffset,
        count: Math.min(pageCount, filteredCount)
      }
    ];
    let arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(0)
      .startAngle(d => radianScale(d.offset))
      .endAngle(d => radianScale(d.offset + d.count));
    let pie = d3.select(this.el).select('#filterPie')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');
    let pieSlices = pie.selectAll('path.pieSlice')
      .data(pieData, d => d.slice);
    pieSlices.enter().append('path');
    pieSlices.attr('d', arc)
      .attr('class', d => d.slice + ' pieSlice');
  },
  renderPagingTools: function (datasetObj, filteredCount, pageOffset, pageCount, width) {
    // Align the paging buttons to the center
    this.$el.find('#pagingButtons')
      .attr('transform', 'translate(' + width / 2 + ',0)');

    // Attach their event listeners
    this.$el.find('#pagingButtons image.button').off('click');
    this.$el.find('#seekFirst').on('click', () => {
      datasetObj.seekFirst();
    });
    this.$el.find('#seekPrev').on('click', () => {
      datasetObj.seekPrev();
    });
    this.$el.find('#seekNext').on('click', () => {
      datasetObj.seekNext();
    });
    this.$el.find('#seekLast').on('click', () => {
      datasetObj.seekLast();
    });

    // Align the paging bar group
    this.$el.find('#pagingBars')
      .attr('transform', 'translate(0,' + (2 * this.layout.emSize) + ')');

    // Scale for the bars
    let pageScale = d3.scale.linear()
      .domain([0, filteredCount])
      .range([0, width]);

    // Now draw the bars indicating the size and location of
    // the page within the current filtered set
    let barData = [
      {
        segment: 'filtered',
        start: 0,
        count: filteredCount
      },
      {
        segment: 'page',
        start: pageOffset,
        count: pageCount
      }
    ];
    let bars = d3.select(this.el).select('#pagingBars').selectAll('rect.bar')
      .data(barData, d => d.segment);
    bars.enter().append('rect');
    bars.attr('x', d => pageScale(d.start))
      .attr('width', d => Math.max(pageScale(d.count + d.start) - pageScale(d.start), 0))
      .attr('height', this.layout.emSize)
      .attr('class', d => d.segment + ' bar');
  },
  renderOverview: function (datasetDetails) {
    let overviewCount = datasetDetails.overviewHistogram.__passedFilters__[0].count;
    let filteredCount = datasetDetails.filteredHistogram.__passedFilters__[0].count;
    let pageOffset = datasetDetails.datasetObj.cache.page.offset;
    let pageCount = datasetDetails.datasetObj.cache.page.limit;
    pageCount = Math.min(pageOffset + pageCount, filteredCount) - pageOffset;

    let hasFilters = filteredCount < overviewCount;
    let hasPaging = pageCount < filteredCount;

    // How much horizontal space do we have (factor in padding)?
    let width = Math.max(this.el.getBoundingClientRect().width -
      2 * this.layout.emSize, 0);

    // We start by assuming we are going to be 6ems tall
    let height = 6 * this.layout.emSize;

    // Move the preview switch to the right
    this.$el.find('#previewSwitch').attr('transform',
      'translate(' + (width - this.layout.emSize) + ',' +
      3 * this.layout.emSize + ')');
    let switchOffset = 2 * this.layout.emSize;

    // Flip the switch appropriately
    d3.select(this.el).select('#tableSwitchIcon')
      .attr('transform', this.showTable ? 'scale(1,-1)' : null);

    // Attach the switch event listeners
    this.$el.find('#previewSwitch image.button').off('click');
    this.$el.find('#histogramPreviewIcon').on('click', () => {
      this.showTable = false;
      this.render();
    });
    this.$el.find('#tableSwitchIcon').on('click', () => {
      this.showTable = !this.showTable;
      this.render();
    });
    this.$el.find('#tablePreviewIcon').on('click', () => {
      this.showTable = true;
      this.render();
    });

    // Show + render, or hide the filter pie on the left
    let pieOffset;
    if (hasFilters) {
      this.$el.find('#filterPie').show();
      this.renderFilterPie(overviewCount, filteredCount,
        pageOffset, pageCount, 3 * this.layout.emSize);
      pieOffset = 7 * this.layout.emSize;
    } else {
      this.$el.find('#filterPie').hide();
      pieOffset = 0;
    }

    // Render the paging tools with the space that we have left
    this.renderPagingTools(datasetDetails.datasetObj, filteredCount,
      pageOffset, pageCount, width - pieOffset - switchOffset);

    // Show the relevant explanatory label
    this.$el.find('#labels > text').hide();
    let labelElement;
    if (hasFilters && hasPaging) {
      labelElement = this.$el.find('#hasFiltersAndPaging');
    } else if (hasFilters) {
      labelElement = this.$el.find('#hasFilters');
    } else if (hasPaging) {
      labelElement = this.$el.find('#hasPaging');
    } else {
      labelElement = this.$el.find('#noPagingOrFilters');
    }
    labelElement.show();
    let d3Element = d3.select(labelElement[0]);

    // Update the values in the label
    d3Element.select('tspan.overview')
      .text(overviewCount);
    d3Element.select('tspan.filtered')
      .text(filteredCount);
    if (hasPaging) {
      // Use base 1 for the page text labels
      d3Element.select('tspan.page')
        .text((pageOffset + 1) + ' - ' + (pageOffset + pageCount));
    } else {
      d3Element.select('tspan.page')
        .text(filteredCount);
    }

    // Attempt to fit the label in the 3em of space between
    // the pie and the switch, below the paging buttons + bar
    rewrap(labelElement[0], width - switchOffset - pieOffset);
    let textHeight = labelElement[0].getBoundingClientRect().height;
    if (textHeight <= 3 * this.layout.emSize) {
      // Cool - we fit! Move the text where it belongs
      d3Element.attr('transform', 'translate(' + pieOffset + ',' +
        4.5 * this.layout.emSize + ')');
      // Position the paging tools right at the top
      d3.select('#paging').attr('transform',
        'translate(' + pieOffset + ',0)');
    } else {
      // There isn't enough space, so reflow the text below everything,
      // and boost our total height
      rewrap(labelElement[0], width);
      d3Element.attr('transform', 'translate(0,' +
        7.5 * this.layout.emSize + ')');
      textHeight = labelElement[0].getBoundingClientRect().height;
      height += textHeight + this.layout.emSize;
      // Position the paging tools in the middle
      d3.select('#paging').attr('transform', 'translate(' + pieOffset + ',' +
        (1.5 * this.layout.emSize) + ')');
    }

    // Set the SVG element to the size that we've discovered
    d3.select(this.el).select('svg')
      .attr({
        width: width,
        height: height
      });
  },
  attachMenuToButton: function (element, attrName, datasetDetails,
    items, auto, current, isAuto, successFunc) {
    d3.select(element).on('click', () => {
      // Construct the menu
      items[0].icon = ICONS[auto];
      items.forEach(menuItem => {
        if (menuItem !== null) {
          menuItem.checked = (menuItem.value === null && isAuto) ||
            (menuItem.value === current && !isAuto);
          menuItem.onclick = () => {
            if (menuItem.value === current) {
              // No change was made; just close the menu
              window.mainPage.overlay.render(null);
              return;
            }
            let filteredState = datasetDetails.datasetObj.getFilteredState(attrName);
            if (filteredState === Dataset.FILTER_STATES.NO_FILTERS) {
              // Go ahead and set the attribute right away
              successFunc(menuItem.value);
              window.mainPage.overlay.render(null);
            } else {
              // Confirm that the user wants to clear filters first
              let promiseObj = window.mainPage.overlay.confirmDialog(
                'This will clear the filters on ' + attrName +
                '. Are you sure you want to proceed?');
              promiseObj.then(() => {
                // The user clicked OK
                successFunc(menuItem.value);
              }, () => {}); // Do nothing if the user clicks cancel
            }
          };
        }
      });
      window.mainPage.overlay.render(new Menu({
        targetElement: element,
        items: items
      }));
    });
  },
  setupDataTypeMenu: function (element, attrName, datasetDetails) {
    let autoAttrType = datasetDetails.datasetObj
      .autoDetectAttributeType(datasetDetails.schema, attrName);
    let attrType = datasetDetails.datasetObj
      .getAttributeType(datasetDetails.schema, attrName);
    let isAuto = !(datasetDetails.schema[attrName].hasOwnProperty('coerceToType'));
    let buttonClass = isAuto ? 'dataTypeMenuIcon button' : 'overridden dataTypeMenuIcon button';
    d3.select(element)
      .attr('src', ICONS[attrType])
      .attr('class', buttonClass);
    this.attachMenuToButton(element, attrName, datasetDetails,
      TYPE_MENU_ITEMS, autoAttrType, attrType, isAuto,
      (newDataType) => {
        datasetDetails.datasetObj.setAttributeType(attrName, newDataType);
      });
  },
  setupInterpretationMenu: function (element, attrName, datasetDetails) {
    let autoInterpretation = datasetDetails.datasetObj
      .autoDetectAttributeInterpretation(datasetDetails.schema, attrName);
    let interpretation = datasetDetails.datasetObj
      .getAttributeInterpretation(datasetDetails.schema, attrName);
    let isAuto = !(datasetDetails.schema[attrName].hasOwnProperty('interpretation'));
    let buttonClass = isAuto ? 'interpretationMenuIcon button' : 'overridden interpretationMenuIcon button';
    d3.select(element)
      .attr('src', ICONS[interpretation])
      .attr('class', buttonClass);
    this.attachMenuToButton(element, attrName, datasetDetails,
      INTERPRETATION_MENU_ITEMS, autoInterpretation, interpretation, isAuto,
      (newInterpretation) => {
        datasetDetails.datasetObj.setAttributeInterpretation(attrName, newInterpretation);
      });
  },
  renderIndividualHistogram: function (element, attrName, datasetDetails) {
    let scale = this.histogramScales[attrName];
    let parentWidth = element.parentNode.getBoundingClientRect().width;
    if (scale === undefined) {
      scale = this.histogramScales[attrName] = new ComboScale(
        this, attrName, datasetDetails, parentWidth);
    } else {
      scale.update(attrName, datasetDetails, parentWidth);
    }

    let svg = d3.select(element);
    let width = scale.width;
    let topPadding = 0.5 * this.layout.emSize;
    let height = scale.height + topPadding;

    // Draw the y axis
    let yScale = d3.scale.linear()
      .domain([0, scale.yMax])
      .range([height, topPadding]);
    let yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(Math.min(4, scale.yMax))
      .tickFormat(d3.format('0.3s'));
    let yAxisObj = svg.select('.yAxis')
      .attr('transform', 'translate(' + scale.leftAxisPadding + ',0)')
      .call(yAxis);

    // Move the special buttons into place and attach their events
    svg.select('.selectAllBins')
      .attr('transform', 'translate(' +
        (scale.leftAxisPadding - 0.5 * this.layout.emSize) + ',' +
        (height + this.layout.emSize) + ')');
    svg.select('.selectAll')
      .on('click', () => {
        datasetDetails.datasetObj.clearFilters(attrName);
      });

    // Draw the bin groups
    let labels = scale.overviewHistogram.map(d => d.label);
    let bins = svg.select('.bins').selectAll('.bin')
      .data(labels, d => d);
    let binsEnter = bins.enter().append('g')
      .attr('class', 'bin');
    bins.exit().remove();

    // Move the bins horizontally
    bins.attr('transform', d => {
      let binNo = scale.labelToBin(d, 'overview');
      return 'translate(' + scale.binToPosition(binNo) + ',' + topPadding + ')';
    });

    // Draw one bar for each bin
    binsEnter.append('rect')
      .attr('class', 'overview');
    binsEnter.append('rect')
      .attr('class', 'filtered');
    binsEnter.append('rect')
      .attr('class', 'page');

    // Update each bar
    function drawBars () {
      bins.select('rect.overview')
        .each(function (d) {
          // this refers to the DOM element
          d3.select(this).attr(scale.getBinRect(d, 'overview'));
        });
      bins.select('rect.filtered')
        .each(function (d) {
          // this refers to the DOM element
          d3.select(this).attr(scale.getBinRect(d, 'filtered'));
        });
      bins.select('rect.page')
        .each(function (d) {
          // this refers to the DOM element
          d3.select(this).attr(scale.getBinRect(d, 'page'));
        });
    }
    drawBars();

    // Add the scale adjustment knob (needs a distinct scale instance)
    let knobScale = yScale.copy();
    let knob = svg.select('.yAxisKnob')
      .attr('transform', 'translate(' + scale.leftAxisPadding + ',' +
        knobScale(scale.yMax) + ')');
    knob.call(d3.behavior.drag()
      .origin(() => {
        return { x: 0, y: knobScale(scale.yMax) };
      }).on('drag', () => {
        // the yMax setter automagically prevents bad values...
        scale.yMax = knobScale.invert(d3.event.y);

        // update everything that cares about the y scale:
        // the knob
        knob.attr('transform', 'translate(' + scale.leftAxisPadding + ',' +
          knobScale(scale.yMax) + ')');
        // the axis
        yScale.domain([0, scale.yMax]);
        yAxis.scale(yScale)
          .ticks(Math.min(4, scale.yMax));
        yAxisObj.call(yAxis);
        // and the bars
        drawBars();
      }).on('dragstart', () => {
        svg.style('cursor', 'ns-resize');
      }).on('dragend', () => {
        svg.style('cursor', null);
      }));

    // Add an include / exclude button for each bin
    binsEnter.append('image')
      .attr('class', 'button')
      .attr({
        x: -0.5 * this.layout.emSize,
        y: height + 0.5 * this.layout.emSize,
        width: this.layout.emSize,
        height: this.layout.emSize
      });
    bins.select('image.button')
      .each(function (d) {
        // this refers to the DOM element
        let bin = scale.labelToBin(d, 'overview');
        bin = datasetDetails.overviewHistogram[attrName][bin];
        let status = datasetDetails.datasetObj.getBinStatus(
          datasetDetails.schema, attrName, bin);

        // To add / remove ranges, we might need to provide a comparison
        // function (undefined will just do default comparisons)
        let comparator;
        if (datasetDetails.datasetObj.getAttributeType(
            datasetDetails.schema, attrName) === 'string') {
          comparator = (a, b) => a.localeCompare(b);
        }

        d3.select(this)
          .attr('xlink:href', () => {
            if (status === Dataset.BIN_STATES.INCLUDED) {
              return ICONS.check;
            } else if (status === Dataset.BIN_STATES.EXCLUDED) {
              return ICONS.ex;
            } else {
              return ICONS.dash;
            }
          }).on('click', d => {
            if (status === Dataset.BIN_STATES.INCLUDED) {
              // Remove this bin
              if ('lowBound' in bin && 'highBound' in bin) {
                datasetDetails.datasetObj.removeRange(
                  attrName, bin.lowBound, bin.highBound, comparator);
              } else {
                datasetDetails.datasetObj.removeValue(attrName, bin.label);
              }
            } else {
              // Add this bin
              if ('lowBound' in bin && 'highBound' in bin) {
                datasetDetails.datasetObj.includeRange(
                  attrName, bin.lowBound, bin.highBound, comparator);
              } else {
                datasetDetails.datasetObj.includeValue(attrName, bin.label);
              }
            }
          });
      });
    height += 2 * this.layout.emSize;

    // Add each bin label, and compute the total needed height
    let maxLabelHeight = svg.select('.selectAllBins').select('text')
      .node().getComputedTextLength();
    binsEnter.append('text');
    bins.select('text')
      .text(d => d)
      .attr('transform', 'rotate(90) translate(' + height + ',' +
        (0.35 * this.layout.emSize) + ')')
      .each(function () {
        // this refers to the DOM element
        maxLabelHeight = Math.max(this.getComputedTextLength(), maxLabelHeight);
      });
    height += maxLabelHeight + topPadding;

    svg.attr({
      width: width + 'px',
      height: height + 'px'
    });
  },
  renderHistograms: function (datasetDetails) {
    let self = this;

    this.$el.find('#noDatasetState, #tablePreview').hide();
    this.$el.find('#datasetOverview, #histogramPreview').show();
    this.renderOverview(datasetDetails);

    let container = d3.select(this.el).select('#histogramPreview');

    let attributeOrder = Object.keys(datasetDetails.schema);

    let attributeSections = container.selectAll('.attributeSection')
      .data(attributeOrder, d => d);
    let attributeSectionsEnter = attributeSections.enter().append('div');
    attributeSections.exit().remove();
    attributeSections.attr('class', d => {
      let filteredState = datasetDetails.datasetObj.getFilteredState(d);
      if (filteredState === Dataset.FILTER_STATES.EXCLUDED) {
        return 'excluded attributeSection';
      } else {
        return 'attributeSection';
      }
    });

    // Add a container for the stuff in the header (the stuff
    // that is shown while collapsed)
    let sectionHeadersEnter = attributeSectionsEnter.append('div')
      .attr('class', 'header');
    let sectionTitlesEnter = sectionHeadersEnter.append('div')
      .attr('class', 'title');
    let sectionTitles = attributeSections.select('.header')
      .select('.title');

    // Add an arrow to collapse the section
    sectionTitlesEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'expander');
    sectionTitles.select('input.expander')
      .on('change', function (d) {
        // this refers to the DOM element
        let contentElement = self.$el.find('#' + makeValidId(d + '_histogramContent'));
        if (this.checked) {
          contentElement.removeClass('collapsed');
          // Update that particular histogram
          self.renderIndividualHistogram(contentElement.find('svg')[0], d, datasetDetails);
        } else {
          contentElement.addClass('collapsed');
        }
      });

    // Checkbox that indicates whether to include the attribute in the output
    /*
    sectionTitlesEnter.append('input')
      .attr('type', 'checkbox')
      .attr('class', 'filteredState');
    sectionTitles.select('input.filteredState')
      .attr('id', d => d + '_checkbox')
      .each(function (d) {
        // this refers to the DOM element
        let filteredState = datasetDetails.datasetObj.getFilteredState(d);
        this.checked = filteredState !== Dataset.FILTER_STATES.EXCLUDED;
      }).on('change', function (d) {
        // this refers to the DOM element
        if (this.checked) {
          datasetDetails.datasetObj.includeAttribute(d);
        } else {
          datasetDetails.datasetObj.excludeAttribute(d);
        }
      });
    */

    // Label for the header
    sectionTitlesEnter.append('label');
    sectionTitles.select('label')
      .text(d => d)
      .attr('for', d => d + '_checkbox');

    // Type and interpretation icons / menus
    let sectionButtonsEnter = sectionHeadersEnter.append('div')
      .attr('class', 'buttons');
    let sectionButtons = attributeSections.select('.header')
      .select('.buttons');
    sectionButtonsEnter.append('img')
      .attr('class', 'dataTypeMenuIcon button');
    sectionButtons.select('img.dataTypeMenuIcon').each(function (d) {
      // this refers to the DOM element
      self.setupDataTypeMenu(this, d, datasetDetails);
    });

    sectionButtonsEnter.append('img')
      .attr('class', 'interpretationMenuIcon button');
    sectionButtons.select('img.interpretationMenuIcon').each(function (d) {
      // this refers to the DOM element
      self.setupInterpretationMenu(this, d, datasetDetails);
    });

    // Now for the actual histgoram content (that gets collapsed)
    let contentsEnter = attributeSectionsEnter.append('div')
      .attr('class', 'collapsed content');
    let contents = attributeSections.select('.content')
      .attr('id', d => makeValidId(d + '_histogramContent'));

    contentsEnter.append('svg')
      .html(histogramTemplate);
    contents.select('svg').each(function (d) {
      // this refers to the DOM element
      self.renderIndividualHistogram(this, d, datasetDetails);
    });
  },
  renderTable: function (datasetDetails) {
    let self = this;

    this.$el.find('#noDatasetState, #histogramPreview').hide();
    this.$el.find('#datasetOverview, #tablePreview').show();
    this.renderOverview(datasetDetails);

    // Render the headers
    let headerOrder = Object.keys(datasetDetails.schema);

    let headers = d3.select(this.el).select('#dataTableHeaders')
      .selectAll('div.tableHeader:not(.rowHeader)').data(headerOrder);
    let headersEnter = headers.enter().append('div')
      .attr('class', 'tableHeader');
    headers.exit().remove();
    headers.attr('id', d => makeValidId('tableHeader' + d));

    let fhToolsEnter = headersEnter.append('div').attr('class', 'headerTools');
    fhToolsEnter.append('img').attr('class', 'dataTypeMenuIcon button');
    fhToolsEnter.append('img').attr('class', 'interpretationMenuIcon button');

    headersEnter.append('div').attr('class', 'headerText');

    headers.select('div.headerText').text(d => d);
    headers.select('img.dataTypeMenuIcon').each(function (d) {
      // this refers to the DOM element
      self.setupDataTypeMenu(this, d, datasetDetails);
    });
    headers.select('img.interpretationMenuIcon').each(function (d) {
      // this refers to the DOM element
      self.setupInterpretationMenu(this, d, datasetDetails);
    });

    // Render the data rows
    let rows = d3.select(this.el).select('#dataTable tbody')
      .selectAll('tr').data(datasetDetails.currentDataPage);
    rows.enter().append('tr');
    rows.exit().remove();

    let cells = rows.selectAll('td').data((d, i) => {
      let row = [{
        attr: null,
        value: datasetDetails.datasetObj.cache.page.offset + i + 1
      }];
      headerOrder.forEach(attr => {
        row.push({
          attr,
          value: d[attr]
        });
      });
      return row;
    });
    cells.enter().append('td');
    cells.exit().remove();
    cells.text(d => d.value);

    // Align the header and the first row of data (the
    // rest of the table will respond automatically)
    let firstRow = rows.filter((d, i) => i === 0);
    firstRow.selectAll('td')
      .each(function (d, i) {
        // this refers to the row DOM element
        let rowRect = this.getBoundingClientRect();
        let headerDiv;
        if (i === 0) {
          // There isn't any headerDiv to worry about,
          // instead, set the left padding on #dataTableHeaders
          headerDiv = d3.select('#dataTableHeaders div.rowHeader');
        } else {
          headerDiv = d3.select('#' + makeValidId('tableHeader' + d.attr));
        }
        // Use the larger of the header and the data row
        // to set the width of the column, but ensure that
        // neither gets larger than 7em
        let headerRect = headerDiv.node().getBoundingClientRect();
        let width = headerRect.width + 2 * self.layout.emSize;
        width = Math.max(rowRect.width, width);
        width = Math.min(width, 7 * self.layout.emSize);
        width = width + 'px';
        width = {
          'min-width': width,
          'max-width': width
        };
        headerDiv.style(width);
        d3.select(this).style(width);
      });
  },
  render: Underscore.debounce(function () {
    let widgetIsShowing = Widget.prototype.render.apply(this, arguments);

    if (!this.addedTemplate) {
      this.$el.html(myTemplate);
      // Add the seek icons (webpack has trouble with detecting xlink:href)
      Object.keys(ICONS).forEach(key => {
        d3.select(this.el).select('image#' + key)
          .attr('xlink:href', ICONS[key]);
      });
      // Sync the table header and body horizontal scrolling
      let self = this;
      this.$el.find('#dataTableContainer').on('scroll', function () {
        // this refers to the DOM element
        self.$el.find('#dataTableHeaders').scrollLeft(jQuery(this).scrollLeft());
      });
      this.addedTemplate = true;
    }

    // Get some general settings to help the rendering process
    this.layout = {
      emSize: parseFloat(this.$el.css('font-size'))
    };
    this.layout.sectionHeight = 6 * this.layout.emSize;

    // Get the dataset in the project (if there is one)
    // TODO: get the dataset assigned to this widget
    let datasetPromise;
    if (window.mainPage.project) {
      datasetPromise = window.mainPage.project.getDataset(0);
    } else {
      datasetPromise = Promise.resolve(null);
    }

    this.status = STATUS.LOADING;
    this.statusText.text = 'Loading...';
    this.renderIndicators();

    datasetPromise.then(datasetObj => {
      if (!datasetObj) {
        this.renderEmptyState();
        this.status = STATUS.NO_DATA;
        this.statusText.text = 'No file loaded';
        this.renderIndicators();
      } else {
        Promise.all([datasetObj.cache.schema,
                     datasetObj.cache.overviewHistogram,
                     datasetObj.cache.filteredHistogram,
                     datasetObj.cache.pageHistogram,
                     datasetObj.cache.currentDataPage])
          .then(datasetDetails => {
            // For cleaner code, reshape the array
            // of results into a dict
            let results = {
              datasetObj: datasetObj,
              schema: datasetDetails[0],
              overviewHistogram: datasetDetails[1],
              filteredHistogram: datasetDetails[2],
              pageHistogram: datasetDetails[3],
              currentDataPage: datasetDetails[4]
            };
            if (datasetDetails.indexOf(null) !== -1) {
              this.status = STATUS.CANT_LOAD;
              this.statusText.text = 'ERROR';
              this.renderIndicators();
            } else if (results.schema.length === 0) {
              // The schema has no attributes...
              this.status = STATUS.NO_ATTRIBUTES;
              this.statusText.text = 'ERROR';
              this.renderIndicators();
            } else {
              this.status = STATUS.SUCCESS;
              this.statusText.text = datasetObj.get('name');
              this.renderIndicators();
              if (widgetIsShowing) {
                if (this.showTable) {
                  this.renderTable(results);
                } else {
                  this.renderHistograms(results);
                }
              }
            }
          });
      }
    });
  }, 300)
});

export default DatasetView;
