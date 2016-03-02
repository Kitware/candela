import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';
import nv from 'nvd3';

import { StatusBarWidget } from './StatusBarWidget';
import { ErrorBulletWidget } from './ErrorBulletWidget';

import infoPane from '../templates/infoPane';

export let InfoPane = Backbone.View.extend({
  el: '.info-pane',

  initialize: function (settings) {
    this.percentile = settings.percentile || 95;
    this.name = settings.name || 'Ground Truth';
    this.branch = settings.branch || 'master';
    this.day = settings.day || this.getToday();
    this.totalDatasets = settings.totalDatasets || 0;
    this.warning = settings.warning || 3;
    this.fail = settings.fail || 4;
    this.max = settings.max || 5;
    this.aggregate_metric_name = settings.aggregate_metric_name || '95th percentile RMSE';

    this.numSuccess = 0;
    this.numBad = 0;
    this.numFail = 0;
    this.allValues = [];
    _.each(settings.percentErrorByDataset, _.bind(function (dataset) {
      this.allValues.push(dataset.current);
      if (dataset.current >= dataset.fail) {
        this.numFail++;
      } else if (dataset.current >= dataset.warning) {
        this.numBad++;
      } else {
        this.numSuccess++;
      }
    }, this));
    this.ranDatasets = this.numSuccess + this.numBad + this.numFail;
    this.agg_trends = settings.agg_trends || this._getAggTrends(settings);
  },

  _percentile: function (arr, p) {
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
  },

  _getAggTrends: function (settings) {
    const byAlgorithm = _.groupBy(settings.percentErrorByDataset, 'algorithm');
    const algorithms = _.keys(byAlgorithm);
    let aggTrends = {};
    for (let i = 0; i < algorithms.length; ++i) {
      let algorithm = algorithms[i];
      aggTrends[algorithm] = _.map(byAlgorithm[algorithm], (value) => {
        return value.current;
      });
      aggTrends[algorithm] = _.sortBy(aggTrends[algorithm], (num) => {
        return num;
      });
      aggTrends[algorithm] = [this._percentile(aggTrends[algorithm], this.percentile / 100)];
    }
    return aggTrends;
  },

  getToday: function () {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;  // January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    return yyyy + '/' + mm + '/' + dd;
  },

  render: function () {
    this.$el.html(infoPane({
      name: this.name,
      branch: this.branch,
      day: this.day,
      ranDatasets: this.ranDatasets,
      numSuccess: this.numSuccess,
      numBad: this.numBad,
      numFail: this.numFail,
      totalMedian: this.totalMedian,
      algorithms: Object.keys(this.agg_trends),
      aggTrends: this.agg_trends,
      aggregate_metric_name: this.aggregate_metric_name
    })).promise().done(_.bind(function () {
      this.aggBullets = {};
      _.each(this.agg_trends, (value, key, list) => {
        nv.addGraph({
          generate: _.bind(function () {
            let parent = $('#' + key + '-aggregate-sparkline');
            let width = parent.width();
            let height = parent.height();
            let chart = nv.models.sparklinePlus()
              .margin({right: 40})
              .height(height)
              .width(width)
              .x(function (d, i) { return i; })
              .showLastValue(false);
            d3.select('#' + key + '-aggregate-sparkline svg')
              .datum(_.map(value, (curValue, index) => {
                return {x: index, y: curValue};
              }))
              .call(chart);
            return chart;
          }, this),
          callback: function (graph) {
            nv.utils.windowResize(function () {
              let parent = $('#' + key + '-aggregate-sparkline');
              let width = parent.width();
              let height = parent.height();
              graph.width(width).height(height);

              d3.select('#' + key + '-aggregate-sparkline svg')
                .attr('width', width)
                .attr('height', height)
                .transition().duration(0)
                .call(graph);
            });
          }
        });
        this.aggBullets[key] = new ErrorBulletWidget({
          el: '#' + key + '-aggregate-bullet',
          result: {
            warning: this.warning,
            fail: this.fail,
            max: this.max,
            current: value[value.length - 1]
          }
        }).render();
        let dotSelector = '#' + key + '-aggregate-dot';
        let current = value[value.length - 1];
        if (current > this.fail) {
          $(dotSelector).attr('class', 'fail');
        } else if (current > this.warning) {
          $(dotSelector).attr('class', 'bad');
        }
      });
    }, this));

    let statusBar = new StatusBarWidget({
      numSuccess: this.numSuccess,
      numBad: this.numBad,
      numFail: this.numFail
    });
    statusBar.render();
  }
});
