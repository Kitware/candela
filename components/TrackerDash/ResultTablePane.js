import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';

import ValueWidget from './ValueWidget';
import { sanitizeSelector } from './utility.js';

import tablePane from './templates/tablePane.jade';
import VisComponent from '../../VisComponent';

class ResultTablePane extends VisComponent {
  constructor (el, settings) {
    super(el);
    this.$el = $(this.el);

    this.results = settings.trendValuesByDataset;
    this.trends = settings.trends;
    this.trendMap = settings.trendMap;
    this.datasetMap = settings.datasetMap || {};
    this.trajectoryMap = settings.trajectoryMap || {};
    this.datasetLabelMap = settings.datasetLabelMap || {};
    this.producerLink = settings.producer_link || null;
    if (this.results === undefined) {
      return;
    }
    // Default sort order is alphabetical by dataset name.
    this.sortOrder = {
      dataset: true,
      order: 1
    };
  }

  render () {
    if (this.results === undefined) {
      return;
    }
    const resultsByDatasetIdThenTrend = {};
    _.each(this.results, _.bind(function (result) {
      result.dataset_id_selector = sanitizeSelector(result.dataset);
      this.datasetMap[result.dataset_id_selector] = this.datasetMap[result.dataset];
      this.trajectoryMap[result.dataset_id_selector] = this.trajectoryMap[result.dataset];
      this.datasetLabelMap[result.dataset_id_selector] = this.datasetLabelMap[result.dataset];
      if (!_.has(resultsByDatasetIdThenTrend, result.dataset_id_selector)) {
        resultsByDatasetIdThenTrend[result.dataset_id_selector] = {};
      }
      if (Array.isArray(result.current)) {
        resultsByDatasetIdThenTrend[result.dataset_id_selector][result.trend] = median(result.current);
      } else {
        resultsByDatasetIdThenTrend[result.dataset_id_selector][result.trend] = result.current;
      }
    }, this));

    this.results.sort((_.bind(function () {
      if (!this.sortOrder.dataset) {
        return _.bind(function (a, b) {
          // Sort all datasets by the selected trend column and direction
          const trendA = resultsByDatasetIdThenTrend[a.dataset_id_selector][this.sortOrder.trend];
          const trendB = resultsByDatasetIdThenTrend[b.dataset_id_selector][this.sortOrder.trend];
          if (trendB === undefined) {
            return -1;
          }
          if (trendA === undefined) {
            return 1;
          }
          return this.sortOrder.order * (trendA - trendB);
        }, this);
      } else {
        return _.bind(function (a, b) {
          if (this.sortOrder.order > 0) {
            return a.dataset.localeCompare(b.dataset);
          } else {
            return b.dataset.localeCompare(a.dataset);
          }
        }, this);
      }
    }, this))());

    // The order of the datasets determines the order the rows are printed.
    const resultsByDatasetId = _.groupBy(this.results, function (result) {
      return result.dataset_id_selector;
    });

    this.$el.html(tablePane({
      resultsByDatasetId: resultsByDatasetId,
      trends: this.trends,
      datasetMap: this.datasetMap,
      trajectoryMap: this.trajectoryMap,
      datasetLabelMap: this.datasetLabelMap,
      producerLink: this.producerLink,
      sortOrder: this.sortOrder
    })).promise().done(_.bind(function () {
      _.each(this.results, function (result) {
        const trend = this.trendMap[result.trend];
        const resultDivSelector = `#${result.dataset_id_selector}-${trend.id_selector}`;
        // Render value widgets.
        const el = $(`${resultDivSelector}-valueWidget-svg`).get(0);
        let valueWidget = new ValueWidget(el, {
          result: result,
          trend: trend
        });
        valueWidget.render();

        // Activate callback for valueWidget if specified.
        if (typeof result.callback === 'function') {
          $(resultDivSelector)
            .css('cursor', 'pointer')
            .click(result.callback);
        } else if (result.link) {
          $(resultDivSelector)
            .css('cursor', 'pointer')
            .click(function () {
              if (result.link) {
                window.location = result.link;
              }
            });
        }
      }, this);

      _.each(this.datasetMap, function (value, key) {
        if (typeof value === 'function') {
          $('#' + key + '-link').click(value);
        }
      });

      _.each(this.trajectoryMap, function (value, key) {
        if (typeof value === 'function') {
          $('#' + key + '-trajectory-link').click(value);
        }
      });

      _.each(this.trends, function (trend) {
        // Order by the trend column clicked.
        $('#' + trend.id_selector + '-trend-col-header').click(_.bind(function () {
          this.sortOrder = {
            trend: trend.name,
            order: this.sortOrder.order * -1
          };
          this.render();
        }, this));
      }, this);

      $('#dataset-col-header').click(_.bind(function () {
        this.sortOrder = {
          dataset: true,
          order: this.sortOrder.order * -1
        };
        this.render();
      }, this));
    }, this));
  }
}

export default ResultTablePane;
