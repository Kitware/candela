import Underscore from 'underscore';
import d3 from 'd3';
import jQuery from 'jquery';
import Widget from '../Widget';
import Menu from '../../overlays/Menu';
import myTemplate from './template.html';
import rewrap from '../../../shims/svgTextWrap.js';
import makeValidId from '../../../shims/makeValidId.js';
import './style.css';

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
  ordinal
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
    dataType: null
  },
  null,
  {
    icon: ICONS.boolean,
    text: 'Boolean',
    dataType: 'boolean'
  },
  {
    icon: ICONS.integer,
    text: 'Integer',
    dataType: 'integer'
  },
  {
    icon: ICONS.number,
    text: 'Number',
    dataType: 'number'
  },
  {
    icon: ICONS.date,
    text: 'Date',
    dataType: 'date'
  },
  {
    icon: ICONS.string,
    text: 'String',
    dataType: 'string'
  },
  {
    icon: ICONS.object,
    text: 'Object (no type coercion)',
    dataType: 'object'
  }
];
let INTERPRETATION_MENU_ITEMS = [
  {
    text: 'Autodetect',
    interpretation: null
  },
  null,
  {
    icon: ICONS.categorical,
    text: 'Categorical',
    interpretation: 'categorical'
  },
  {
    icon: ICONS.ordinal,
    text: 'Ordinal',
    interpretation: 'ordinal'
  }
];

let DatasetView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);

    this.showTable = true;

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
    this.listenTo(window.mainPage.project, 'rl:changeDatasets',
      this.render);

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
      window.mainPage.overlay.renderErrorScreen('The dataset could not be loaded; there is a good chance that there is a permissions problem.');
    } else if (this.status === STATUS.CANT_PARSE) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data; you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    } else if (this.status === STATUS.NO_ATTRIBUTES) {
      window.mainPage.overlay.renderUserErrorScreen('There was a problem parsing the data. Specifically, we\'re having trouble understanding the dataset attributes (usually column headers); you\'ll probably need to <a>edit</a> or <a>reshape</a> the data in order to use it.');
    }
  },
  renderEmptyState: function () {
    this.$el.find('#datasetOverview, #tablePreview, #histogramPreview').hide();
    this.$el.find('#emptyDatasetState').show();
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
        count: Math.min(pageCount, filteredCount)
      }
    ];
    let bars = d3.select(this.el).select('#pagingBars').selectAll('rect.bar')
      .data(barData, d => d.segment);
    bars.enter().append('rect');
    bars.attr('x', d => pageScale(d.start))
      .attr('width', d => pageScale(d.count + d.start) - pageScale(d.start))
      .attr('height', this.layout.emSize)
      .attr('class', d => d.segment + ' bar');
  },
  renderOverview: function (datasetDetails) {
    let overviewCount = datasetDetails.overviewHistogram.__passedFilters__[0].count;
    let filteredCount = datasetDetails.filteredHistogram.__passedFilters__[0].count;
    let pageOffset = datasetDetails.datasetObj.cache.page.offset;
    let pageCount = datasetDetails.datasetObj.cache.page.limit;

    let hasFilters = filteredCount < overviewCount;
    let hasPaging = pageCount < filteredCount;

    // How much horizontal space do we have (factor in padding)?
    let width = this.el.getBoundingClientRect().width -
      2 * this.layout.emSize;

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
    d3Element.selectAll('tspan.overview')
      .text(overviewCount);
    d3Element.selectAll('tspan.filtered')
      .text(filteredCount);
    if (hasPaging) {
      // Use base 1 for the page text labels
      d3Element.selectAll('tspan.page')
        .text((pageOffset + 1) + ' - ' + (pageOffset + pageCount));
    } else {
      d3Element.selectAll('tspan.page')
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
  setupDataTypeMenu: function (element, attrName, datasetDetails) {
    let autoAttrType = datasetDetails.datasetObj
      .autoDetectAttributeType(datasetDetails.schema, attrName);
    let attrType = datasetDetails.datasetObj
      .getAttributeType(datasetDetails.schema, attrName);
    let isAuto = !(datasetDetails.schema[attrName].hasOwnProperty('coerceToType'));
    let filterStyle = isAuto ? null : 'url(#recolorImageTo377eb8)';
    d3.select(element)
      .attr('src', ICONS[attrType])
      .style({
        '-webkit-filter': filterStyle,
        'filter': filterStyle
      }).on('click', () => {
        // Construct the type menu
        TYPE_MENU_ITEMS[0].icon = ICONS[autoAttrType];
        TYPE_MENU_ITEMS.forEach(menuItem => {
          if (menuItem !== null) {
            menuItem.checked = (menuItem.dataType === null && isAuto) ||
              (menuItem.dataType === attrType && !isAuto);
            menuItem.onclick = () => {
              datasetDetails.datasetObj
                .setAttributeType(attrName, menuItem.dataType);
              window.mainPage.overlay.render(null);
            };
          }
        });
        window.mainPage.overlay.render(new Menu({
          targetElement: element,
          items: TYPE_MENU_ITEMS
        }));
      });
  },
  setupInterpretationMenu: function (element, attrName, datasetDetails) {
    let autoInterpretation = datasetDetails.datasetObj
      .autoDetectAttributeInterpretation(datasetDetails.schema, attrName);
    let interpretation = datasetDetails.datasetObj
      .getAttributeInterpretation(datasetDetails.schema, attrName);
    let isAuto = !(datasetDetails.schema[attrName].hasOwnProperty('interpretation'));
    let filterStyle = isAuto ? null : 'url(#recolorImageTo377eb8)';
    d3.select(element)
      .attr('src', ICONS[interpretation])
      .style({
        '-webkit-filter': filterStyle,
        'filter': filterStyle
      }).on('click', () => {
        // Construct the type menu
        INTERPRETATION_MENU_ITEMS[0].icon = ICONS[autoInterpretation];
        INTERPRETATION_MENU_ITEMS.forEach(menuItem => {
          if (menuItem !== null) {
            menuItem.checked = (menuItem.interpretation === null && isAuto) ||
              (menuItem.interpretation === interpretation && !isAuto);
            menuItem.onclick = () => {
              datasetDetails.datasetObj
                .setAttributeInterpretation(attrName, menuItem.interpretation);
              window.mainPage.overlay.render(null);
            };
          }
        });
        window.mainPage.overlay.render(new Menu({
          targetElement: element,
          items: INTERPRETATION_MENU_ITEMS
        }));
      });
  },
  renderHistograms: function (datasetDetails) {
    this.$el.find('#emptyDatasetState, #tablePreview').hide();
    this.$el.find('#datasetOverview, #histogramPreview').show();
    this.renderOverview(datasetDetails);
    // TODO
  },
  renderTable: function (datasetDetails) {
    let self = this;

    this.$el.find('#emptyDatasetState, #histogramPreview').hide();
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

    headers.selectAll('div.headerText').text(d => d);
    headers.selectAll('img.dataTypeMenuIcon').each(function (d) {
      // this refers to the DOM element
      self.setupDataTypeMenu(this, d, datasetDetails);
    });
    headers.selectAll('img.interpretationMenuIcon').each(function (d) {
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
    let datasetObj = window.mainPage.project &&
      window.mainPage.project.getDataset(0);

    if (!datasetObj) {
      this.renderEmptyState();
      this.status = STATUS.NO_DATA;
      this.statusText.text = 'No file loaded';
      this.renderIndicators();
    } else {
      this.status = STATUS.LOADING;
      this.statusText.text = 'Loading...';
      this.renderIndicators();

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
  }, 300)
});

export default DatasetView;
