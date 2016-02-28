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
    this.allValues = _.sortBy(this.allValues, function (el) { return el; });
    this.totalMedian = this.allValues[Math.floor(this.allValues.length / 2)];
    this.totalMedian = Math.round(this.totalMedian * 10000) / 10000;
    this.ranDatasets = this.numSuccess + this.numBad + this.numFail;
    this.agg_trends = settings.agg_trends;
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
            var chart = nv.models.sparklinePlus()
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
