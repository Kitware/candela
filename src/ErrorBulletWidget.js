import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';
import d3 from 'd3';
import nv from 'nvd3';

export let ErrorBulletWidget = Backbone.View.extend({

  initialize: function (settings) {
    this.result = settings.result;
    if (this.result === undefined) {
      console.error('No result passed to error bullet.');
    }
    $(window).on('resize', _.bind(this.createChart, this));
  },

  getChartData: function () {
    return {
      'ranges':
        [this.result.max, this.result.fail, this.result.warning, this.result.target],
      'measures': [this.result.current],
      'markers': [this.result.target],
      'rangeLabels': ['', 'Failing', 'Warning', 'Target'],
      'measureLabels': ['Current RMSE (m)'],
      'markerLabels': ['Target RMSE (m)']
    };
  },

  createChart: function () {
    nv.addGraph(_.bind(function () {
      var chart = nv.models.bulletChart()
        .orient('left')
        .margin({top: 5, right: 20, bottom: 20, left: 20});

      if (this.result.current > this.result.fail) {
        chart.color('rgb(204, 0, 0)');
      } else if (this.result.current > this.result.warning) {
        chart.color('rgb(241, 194, 50)');
      } else {
        chart.color('rgb(147, 196, 125)');
      }

      d3.select(this.el)
        .datum(this.getChartData())
        .call(chart);

      return chart;
    }, this));
  },

  render: function () {
    this.createChart();
  }

});
