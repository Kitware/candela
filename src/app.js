import Backbone from 'backbone';
import _ from 'underscore';

require('bootstrap-webpack');
require('nvd3/build/nv.d3.min.css');
require('../styles/main.styl');

import { InfoPane } from './InfoPane';
import { TrendPane } from './TrendPane';
import { ResultTablePane } from './ResultTablePane';
import { TopInfoBar } from './TopInfoBar';

import layout from '../templates/layout';

export let dash = Backbone.View.extend({
  el: 'body',

  initialize: function (settings) {
    /**
     * Calculate an percentile value from an array of
     * numbers sorted in numerically increasing order.
     */
    function calcPercentile (arr, p) {
      if (arr.length === 0) return 0;
      if (typeof p !== 'number') throw new TypeError('p must be a number');
      if (p <= 0) return arr[0];
      if (p >= 1) return arr[arr.length - 1];

      let index = arr.length * p;
      let lower = Math.floor(index);
      let upper = lower + 1;
      let weight = index % 1;

      if (upper >= arr.length) return arr[lower];
      return arr[lower] * (1 - weight) + arr[upper] * weight;
    }
    // TODO add mouseover property for aggregate trends
    // also for the ones coming in

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
     * Create a valid display_name and id_selector per trend.
     */
    function sanitizeTrend (trend) {
      trend.display_name = trend.abbreviation || trend.name;
      trend.id_selector = trend.display_name.toLowerCase()
                                            .replace(/\./g, '_')
                                            .replace(/ /g, '_');
      return trend;
    }

    // Perform all the data munging at the outset so that it is consistent
    // as it gets passed down throughout the application.

    // trendMap maps full trend name to a sanitized trend object.
    settings.trendMap = {};
    _.each(settings.trends, function (trend) {
      settings.trendMap[trend.name] = sanitizeTrend(trend);
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
