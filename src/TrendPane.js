import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import nv from 'nvd3';
import d3 from 'd3';

import trendPane from '../templates/trendPane';

export let TrendPane = Backbone.View.extend({
  el: '.trend-pane',

  initialize: function (settings) {
    this.metric_name = settings.metric_name || 'RMSE Euclidean Distance';
    this.bins = settings.bins || 10;
    this.trendAbbreviationMap = settings.trendAbbreviationMap;
    this.hists = this._calculateHistograms(settings.percentErrorByDataset);
  },

  _calculateHistograms: function (trends) {
    const bins = this.bins;
    const byTrend = _.groupBy(trends, 'trend');

    const min = _.reduce(trends, (memo, num) => {
      return Math.min(memo, num.current);
    }, 0);  // we want 0 to be the min

    const max = _.reduce(trends, (memo, num) => {
      return Math.max(memo, num.current);
    }, 0);

    const binWidth = (max - min) / bins;
    let hists = _.map(byTrend, (element, key) => {
      let el = {trend: this.trendAbbreviationMap[key] || key};
      el['values'] = _.countBy(_.map(element, (value) => {
        let res = Math.floor(value.current / binWidth);
        if (res > bins - 1) {
          res = bins - 1;
        }
        return res;
      }), (num) => { return num; });
      return el;
    }, this);

    hists = _.indexBy(hists, 'trend');
    this.xLabels = [];
    this.xLabels.push(binWidth / 2);
    for (let i = 1; i < bins; ++i) {
      this.xLabels.push(this.xLabels[i - 1] + binWidth);
    }
    this.xLabels = _.map(this.xLabels, (value) => {
      return value.toFixed(1);
    });
    return hists;
  },

  getChartData: function () {
    // Prepare the data for plotting
    let plotData = [];
    const trends = _.keys(this.hists);
    for (let i = 0; i < trends.length; ++i) {
      const trend = trends[i];
      let curData = { key: trend.toUpperCase() };
      curData.values = [];
      for (let j = 0; j < this.bins; ++j) {
        curData.values.push({ x: this.xLabels[j], y: this.hists[trend].values[j] || 0 });
      }
      plotData.push(curData);
    }
    return plotData;
  },

  createChart: function () {
    nv.addGraph({
      generate: _.bind(function () {
        let parent = $('.trend-pane');
        let width = parent.width();
        let height = parent.height();
        let chart = nv.models.multiBarChart()
          .width(width)
          .height(height)
          .stacked(false);
        chart.xAxis.axisLabel(this.metric_name + ' (bin center)');
        chart.xAxis.tickValues(this.xLabels);
        chart.yAxis.axisLabel('Number of Runs');
        chart.yAxis.tickFormat(d3.format('d'));
        chart.tooltip.enabled(false);

        let svg = d3.select('.trend-chart svg').datum(this.getChartData());
        svg.transition().duration(0).call(chart);
        return chart;
      }, this),
      callback: function (graph) {
        nv.utils.windowResize(function () {
          let parent = $('.trend-pane');
          let width = parent.width();
          let height = parent.height();
          graph.width(width).height(height);

          d3.select('.trend-chart svg')
            .attr('width', width)
            .attr('height', height)
            .transition().duration(0)
            .call(graph);
        });
      }
    });
  },

  render: function () {
    this.$el.html(trendPane());
    this.createChart();
  }
});
