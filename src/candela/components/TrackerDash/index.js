import $ from 'jquery';
import _ from 'underscore';
import * as d3 from 'd3';

require('bootstrap-webpack');
require('nvd3/build/nv.d3.min.css');
require('./styles/main.styl');

import InfoPane from './InfoPane';
import TrendPane from './TrendPane';
import ResultTablePane from './ResultTablePane';
import TopInfoBar from './TopInfoBar';
import { sanitizeSelector, deArray } from './utility.js';

import layout from './templates/layout.jade';

import VisComponent from '../../VisComponent';

//  Calculate an percentile value from an array of numbers sorted in numerically
//  increasing order, p should be a ratio percentile, e.g. 50th percentile is p
//  = 0.5.
const calcPercentile = (arr, p) => {
  if (arr.length === 0) return 0;
  if (typeof p !== 'number') throw new TypeError('p must be a number');
  if (p <= 0) return arr[0];
  if (p >= 1) return arr[arr.length - 1];

  let index = Math.round(p * arr.length) - 1;
  // Ind may be below 0, in this case the closest value is the 0th index.
  index = index < 0 ? 0 : index;
  return arr[index];
};

// Synthesize aggregate metrics from the supplied trend values, which will
// result in a percentile value per trend if an aggregate metric isn't already
// supplied for the trend.
const synthesizeMissingAggTrends = (aggTrends, trendMap, trendValuesByDataset, percentile) => {
  const byTrend = _.groupBy(trendValuesByDataset, 'trend');
  const trends = _.keys(byTrend);
  if (!aggTrends) {
    aggTrends = [];
  }
  const aggTrendsByTrendName = _.indexBy(aggTrends, 'trend_name');
  for (let i = 0; i < trends.length; i++) {
    if (!_.has(aggTrendsByTrendName, trends[i])) {
      const aggTrend = _.clone(trendMap[trends[i]]);
      const trendVals = _.chain(byTrend[aggTrend.name])
        .pluck('current')
        .map((value) => {
          return deArray(value, d3.median);
        })
      // '+' converts values to numeric for a numeric sort.
        .sortBy((num) => { return +num; })
        .value();
      aggTrend.history = [calcPercentile(trendVals, percentile / 100)];
      aggTrend.title = `Default of ${percentile} percentile key metric value (${aggTrend.name}), No saved aggregate metrics for trend`;
      aggTrend.synth = true;
      aggTrends.push(aggTrend);
    }
  }
  return aggTrends;
};

// Creates a valid display_name and id_selector per trend, create a mouseover
// title property, and determines if the threshold is correctly defined.
const sanitizeTrend = (trend) => {
  if (!trend.abbreviation) {
    trend.display_name = trend.name;
    if (!trend.title) {
      trend.title = 'No abbreviation defined';
    }
  } else {
    trend.display_name = trend.abbreviation;
    if (!trend.title) {
      trend.title = trend.name;
    }
  }
  if (!_.has(trend, 'warning') || !_.has(trend, 'fail')) {
    trend.incompleteThreshold = true;
    trend.title += ' & Incomplete threshold definition';
  }
  trend.id_selector = sanitizeSelector(trend.display_name);
  return trend;
};

/**
 * Ensures that an aggregate metric has a max value set, as a fallback
 * it will be set to the last value in the history.
 */
const sanitizeAggregateThreshold = (aggTrend) => {
  if (_.isNaN(parseFloat(aggTrend.max))) {
    aggTrend.max = aggTrend.history[aggTrend.history.length - 1];
    if (!aggTrend.incompleteThreshold) {
      aggTrend.incompleteThreshold = true;
      aggTrend.title += ' & Incomplete threshold definition';
    }
  }
  return aggTrend;
};

class TrackerDash extends VisComponent {
  constructor (el, settings) {
    super(el);

    this.$el = $(this.el);

    // Perform all the data munging at the outset so that it is consistent as it
    // gets passed down throughout the application.

    if (!settings.trends) {
      settings.trends = [];
    }
    // trendMap maps full trend name to a sanitized trend object.
    settings.trendMap = {};
    _.each(settings.trends, function (trend) {
      settings.trendMap[trend.name] = sanitizeTrend(trend);
    });
    // Create trends for any scalars that don't supply them, setting
    // the max as the max input value for that trend.
    _.each(settings.trendValuesByDataset, function (trendValue) {
      if (!_.has(settings.trendMap, trendValue.trend)) {
        const current = deArray(trendValue.current, d3.median);
        const syntheticTrend = sanitizeTrend({
          name: trendValue.trend,
          synth: true,
          max: current
        });
        settings.trendMap[syntheticTrend.name] = syntheticTrend;
        settings.trends.push(syntheticTrend);
      } else {
        const current = deArray(trendValue.current, d3.median);
        const trend = settings.trendMap[trendValue.trend];
        if (trend.synth && trend.max < current) {
          trend.max = current;
        }
      }
    });

    // Sort trends now that they have display_name property.
    settings.trends = _.sortBy(settings.trends, 'display_name');
    // Order the individual trend dataset values by trend display_name.
    settings.trendValuesByDataset = _.sortBy(settings.trendValuesByDataset, function (val) {
      return settings.trendMap[val.trend].display_name;
    });

    // Generate aggregate trends if needed.
    const percentile = 50.0;
    const aggTrends = synthesizeMissingAggTrends(settings.agg_trends, settings.trendMap, settings.trendValuesByDataset, percentile);
    settings.aggTrends = _.chain(aggTrends)
      .map(sanitizeTrend)
      .map(sanitizeAggregateThreshold)
      .sortBy('display_name')
      .value();

    this.trackData = settings;
    delete this.trackData.el;

    this.$el.html(layout());
    this.topInfoBar = new TopInfoBar(this.$el.find('.top-info-bar').get(0), this.trackData);
    this.infoPane = new InfoPane(this.$el.find('.info-pane').get(0), this.$el.find('.status-bar-widget').get(0), this.trackData);
    this.trendPane = new TrendPane(this.$el.find('.trend-pane').get(0), this.trackData);
    this.resultPane = new ResultTablePane(this.$el.find('.result-table-pane').get(0), this.trackData);

    this.render();
  }

  render () {
    this.topInfoBar.render();
    this.infoPane.render();
    this.trendPane.render();
    this.resultPane.render();
  }
}

export default TrackerDash;
