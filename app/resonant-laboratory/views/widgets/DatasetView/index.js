import Underscore from 'underscore';
import d3 from 'd3';
import Widget from '../Widget';
import myTemplate from './template.html';
import rewrap from '../../../shims/svgTextWrap.js';
import './style.css';

import seekFirst from '../../../images/seekFirst.svg';
import seekPrev from '../../../images/seekPrev.svg';
import seekNext from '../../../images/seekNext.svg';
import seekLast from '../../../images/seekLast.svg';
import pageSettings from '../../../images/gear.svg';
import tablePreviewIcon from '../../../images/table.svg';
import tableSwitchIcon from '../../../images/switch.svg';
import histogramPreviewIcon from '../../../images/histogram.svg';

let ICONS = {
  seekFirst,
  seekPrev,
  seekNext,
  seekLast,
  pageSettings,
  tablePreviewIcon,
  tableSwitchIcon,
  histogramPreviewIcon
};

let STATUS = {
  NO_DATA: 0,
  SUCCESS: 1,
  CANT_LOAD: 2,
  LOADING: 3,
  NO_ATTRIBUTES: 4
};

let DatasetView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);

    this.showTable = true;

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
        count: pageCount
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
  renderHistograms: function (datasetDetails) {
    this.$el.find('#emptyDatasetState, #tablePreview').hide();
    this.$el.find('#datasetOverview, #histogramPreview').show();
    this.renderOverview(datasetDetails);
    // TODO
  },
  renderTable: function (datasetDetails) {
    this.$el.find('#emptyDatasetState, #histogramPreview').hide();
    this.$el.find('#datasetOverview, #tablePreview').show();
    this.renderOverview(datasetDetails);

    let headerOrder = Object.keys(datasetDetails.schema);

    let headers = d3.select(this.el).select('#tablePreview thead tr')
      .selectAll('th').data([''].concat(headerOrder));
    headers.enter().append('th');
    headers.exit().remove();
    headers.text(d => d);

    let rows = d3.select(this.el).select('#tablePreview tbody')
      .selectAll('tr').data(datasetDetails.currentDataPage);
    rows.enter().append('tr');
    rows.exit().remove();

    let cells = rows.selectAll('td').data((d, i) => {
      let row = [datasetDetails.datasetObj.cache.page.offset + i + 1];
      headerOrder.forEach(attr => {
        row.push(d[attr]);
      });
      return row;
    });
    cells.enter().append('td');
    cells.exit().remove();
    cells.text(d => d);
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
      this.addedTemplate = true;
    }

    // Get some general settings to help the rendering process
    this.layout = {
      emSize: parseFloat(this.$el.css('font-size'))
    };
    this.layout.sectionHeight = 6 * this.layout.emSize;

    // Get the dataset in the project (if there is one)
    // TODO: get the dataset assigned to this widget
    let datasetObj;
    if (window.mainPage.project) {
      let datasets = window.mainPage.project.getMeta('datasets');
      if (datasets && datasets.length > 0) {
        datasetObj = window.mainPage.loadedDatasets[datasets[0].dataset];
      }
    }

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
