import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';
import nv from 'nvd3';
import d3 from 'd3';

import { deArray } from './utility.js';

import trendPane from './templates/trendPane.jade';

export let TrendPane = Backbone.View.extend({
  el: '.trend-pane',

  initialize: function (settings) {
    this.bins = settings.bins || 10;
    this.trendMap = settings.trendMap;
    this.hists = this._calculateHistograms(settings.trendValuesByDataset, settings.histogram_max_x);
  },

  _calculateHistograms: function (trends, maxX) {
    const bins = this.bins;
    const byTrend = _.groupBy(trends, 'trend');

    const min = _.reduce(trends, (memo, num) => {
      let current = deArray(num.current, d3.min);
      return Math.min(memo, current);
    }, 0);  // we want 0 to be the min

    const maxXSet = !_.isNaN(parseFloat(maxX));
    let max;
    let binWidth;
    if (maxXSet) {
      // We have a maximum set, put everything beyond this max
      // in the same 'Beyond' bin.
      max = parseFloat(maxX);
      binWidth = (max - min) / (bins - 1);
    } else {
      max = _.reduce(trends, (memo, num) => {
        return Math.max(memo, deArray(num.current, d3.max));
      }, 0);
      binWidth = (max - min) / bins;
    }

    let hists = _.map(byTrend, (element, key) => {
      let el = {trend: this.trendMap[key].display_name};
      el['values'] = _.countBy(_.map(element, (value) => {
        let current = deArray(value.current, d3.median);
        let res = Math.floor(current / binWidth);
        if (maxXSet) {
          if (res > bins - 1) {
            res = bins - 1;
          }
        } else {
          if (res > bins) {
            res = bins;
          }
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
    if (maxXSet) {
        this.xLabels[this.xLabels.length - 1] = 'Beyond';
    }
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
          .reduceXTicks(false)
          .width(width)
          .height(height)
          .stacked(false);
        chart.xAxis.axisLabel('Key metric values (bin center)');
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
