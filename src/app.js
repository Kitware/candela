import Backbone from 'backbone';
import _ from 'underscore';

require('bootstrap-webpack');
require('nvd3/build/nv.d3.min.css');
require('../styles/main.styl');

import { InfoPane } from './InfoPane';
import { TrendPane } from './TrendPane';
import { ResultTablePane } from './ResultTablePane';
import { TopInfoBar } from './TopInfoBar';
import { sanitizeSelector } from './utility.js';

import layout from '../templates/layout';

export let dash = Backbone.View.extend({
  el: 'body',

  initialize: function (settings) {
    /**
     * Calculate an percentile value from an array of numbers sorted in
     * numerically increasing order, p should be a ratio percentile,
     * e.g. 50th percentile is p = 0.5.
     */
    function calcPercentile (arr, p) {
      if (arr.length === 0) return 0;
      if (typeof p !== 'number') throw new TypeError('p must be a number');
      if (p <= 0) return arr[0];
      if (p >= 1) return arr[arr.length - 1];

      let index = Math.round(p * arr.length) - 1;
      // Ind may be below 0, in this case the closest value is the 0th index.
      index = index < 0 ? 0 : index;
      return arr[index];
    }

    /**
     * Synthesize aggregate metrics from the supplied trend values, which will
     * result in a percentile value per trend.
     */
    function getAggTrends (trendMap, trendValuesByDataset, percentile) {
      const byTrend = _.groupBy(trendValuesByDataset, 'trend');
      const trends = _.keys(byTrend);
      let aggTrends = [];
      for (let i = 0; i < trends.length; ++i) {
        let aggTrend = _.clone(trendMap[trends[i]]);
        let trendVals = _.chain(byTrend[aggTrend.name])
                         .pluck('current')
                         .sortBy((num) => { return num; })
                         .value();
        aggTrend.history = [calcPercentile(trendVals, percentile / 100)];
        aggTrend.title = 'Default of ' + percentile + ' percentile key metric value (' + aggTrend.name + ')'
        aggTrends.push(aggTrend);
      }
      return aggTrends;
    }

    /**
     * Creates a valid display_name and id_selector per trend,
     * create a mouseover title property, and determines if the threshold
     * is correctly defined.
     */
    function sanitizeTrend (trend) {
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
    }

    /**
     * Ensures that an aggregate metric has a max value set, as a fallback
     * it will be set to the last value in the history.
     */
    function sanitizeAggregateThreshold (aggTrend) {
      if (_.isNaN(parseFloat(aggTrend.max))) {
        aggTrend.max = aggTrend.history[aggTrend.history.length-1];
        if (!aggTrend.incompleteThreshold) {
          aggTrend.incompleteThreshold = true;
          aggTrend.title += ' & Incomplete threshold definition';
        }
      }
      return aggTrend;
    }

    // Perform all the data munging at the outset so that it is consistent
    // as it gets passed down throughout the application.

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
        var syntheticTrend = sanitizeTrend({
          name: trendValue.trend,
          synth: true,
          max: trendValue.current
        });
        settings.trendMap[syntheticTrend.name] = syntheticTrend;
        settings.trends.push(syntheticTrend);
      } else {
        var trend = settings.trendMap[trendValue.trend];
        if (trend.synth && trend.max < trendValue.current) {
          trend.max = trendValue.current;
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
    var percentile = 50.0;
    var aggTrends = settings.agg_trends || getAggTrends(settings.trendMap, settings.trendValuesByDataset, percentile);
    settings.aggTrends = _.chain(aggTrends)
                          .map(sanitizeTrend)
                          .map(sanitizeAggregateThreshold)
                          .sortBy('display_name')
                          .value();

    this.trackData = settings;
    delete this.trackData.el;
    this.render();
  },

  render: function () {
    this.$el.html(layout());
    let topInfoBar = new TopInfoBar(this.trackData);
    let infoPane = new InfoPane(this.trackData);
    let trendPane = new TrendPane(this.trackData);
    let resultPane = new ResultTablePane(this.trackData);
    topInfoBar.render();
    infoPane.render();
    trendPane.render();
    resultPane.render();
  }

});
