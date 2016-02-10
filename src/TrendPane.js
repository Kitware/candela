import Backbone from 'backbone';
import _ from 'underscore';
import nv from 'nvd3';
import d3 from 'd3';

import trendPane from '../templates/trendPane';

export let TrendPane = Backbone.View.extend({
  el: '.trend-pane',

  initialize: function (settings) {
    this.success = [];
    this.bad = [];
    this.fail = [];
    this.xLabels = [];
    _.each(settings.trend, _.bind(function (curTrend) {
      this.success.push(curTrend.success);
      this.bad.push(curTrend.bad);
      this.fail.push(curTrend.fail);
      this.xLabels.push(curTrend.date);
    }, this));
  },

  getChartData: function () {
    // Prepare the data for plotting
    for (var i = 0; i < this.success.length; ++i) {
      this.success[i] = {x: i, y: this.success[i]};
      this.bad[i] = {x: i, y: this.bad[i]};
      this.fail[i] = {x: i, y: this.fail[i]};
    }

    // Return the chart data
    return [{
      values: this.success,
      key: 'Success',
      color: 'rgb(147, 196, 125)'
    }, {
      values: this.bad,
      key: 'Bad',
      color: 'rgb(241, 194, 50)'
    }, {
      values: this.fail,
      key: 'Fail',
      color: 'rgb(204, 0, 0)'
    }];
  },

  createChart: function () {
    nv.addGraph(_.bind(function () {
      var chart = nv.models.lineChart().useInteractiveGuideline(true);
      chart.xAxis
           .axisLabel('Date')
           .tickFormat(_.bind(function (d) { return this.xLabels[d].slice(5); }, this));
      chart.yAxis
           .axisLabel('Number of Runs')
           .tickFormat(d3.format(',r'));
      d3.select('.trend-chart svg')
           .datum(this.getChartData())
           .transition().duration(500)
           .call(chart);

      nv.utils.windowResize(chart.update);

      return chart;
    }, this));
  },

  render: function () {
    this.$el.html(trendPane());
    this.createChart();
  }
});
