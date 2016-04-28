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
    this.warning = settings.warning || 3;
    this.fail = settings.fail || 4;
    this.max = settings.max || 5;

    this.numSuccess = 0;
    this.numBad = 0;
    this.numFail = 0;
    this.allValues = [];
    _.each(settings.trendValuesByDataset, _.bind(function (dataset) {
      this.allValues.push(dataset.current);
      // TODO probably wrong for reveresed case.
      if (dataset.current >= dataset.fail) {
        this.numFail++;
      } else if (dataset.current >= dataset.warning) {
        this.numBad++;
      } else {
        this.numSuccess++;
      }
    }, this));
    this.ranDatasets = this.numSuccess + this.numBad + this.numFail;
    this.aggTrends = settings.aggTrends;
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
      // Test if any of the aggregate trends have spark line historical data.
      var sparklinesExist = (_.find(this.aggTrends, function (trend) {
         return trend.history && trend.history.length > 1;
      }, this)) !== undefined;
    this.$el.html(infoPane({
      name: this.name,
      branch: this.branch,
      day: this.day,
      ranDatasets: this.ranDatasets,
      numSuccess: this.numSuccess,
      numBad: this.numBad,
      numFail: this.numFail,
      totalMedian: this.totalMedian,
      aggTrends: this.aggTrends,
      sparklinesExist: sparklinesExist
    })).promise().done(_.bind(function () {
      this.aggBullets = {};
      _.each(this.aggTrends, (trend, key, list) => {
        nv.addGraph({
          generate: _.bind(function () {
            let parent = $('#' + trend.id_selector + '-aggregate-sparkline');
            let width = parent.width();
            let height = parent.height();
            let chart = nv.models.sparklinePlus()
              .margin({right: 40})
              .height(height)
              .width(width)
              .x(function (d, i) { return i; })
              .showLastValue(false);
            d3.select('#' + trend.id_selector + '-aggregate-sparkline svg')
              .datum(_.map(trend.history, (curValue, index) => {
                return {x: index, y: curValue};
              }))
              .call(chart);
            return chart;
          }, this),
          callback: function (graph) {
            nv.utils.windowResize(function () {
              let parent = $('#' + trend.id_selector + '-aggregate-sparkline');
              let width = parent.width();
              let height = parent.height();
              graph.width(width).height(height);

              d3.select('#' + trend.id_selector + '-aggregate-sparkline svg')
                .attr('width', width)
                .attr('height', height)
                .transition().duration(0)
                .call(graph);
            });
          }
        });
        let current = trend.history[trend.history.length - 1];
        this.aggBullets[trend.id_selector] = new ErrorBulletWidget({
          el: '#' + trend.id_selector + '-aggregate-bullet',
          result: {
            current: Math.round(current * 10000) / 10000
          },
          trend: trend
        }).render();
        let dotSelector = '#' + trend.id_selector + '-aggregate-dot';
        if (trend.warning > trend.fail) {
          // Lower values are better.
          if (current <= trend.fail) {
            $(dotSelector).attr('class', 'fail');
          } else if (current <= trend.warning) {
            $(dotSelector).attr('class', 'bad');
          }
        } else {
          if (current >= trend.fail) {
            $(dotSelector).attr('class', 'fail');
          } else if (current >= trend.warning) {
            $(dotSelector).attr('class', 'bad');
          }
        }
      }, this);
    }, this));

    let statusBar = new StatusBarWidget({
      numSuccess: this.numSuccess,
      numBad: this.numBad,
      numFail: this.numFail
    });
    statusBar.render();
  }
});
