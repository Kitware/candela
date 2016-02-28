import Backbone from 'backbone';
import _ from 'underscore';
import d3 from 'd3';
import nv from 'nvd3';
import $ from 'jquery';

export let ErrorBulletWidget = Backbone.View.extend({

  initialize: function (settings) {
    this.result = settings.result;
    if (this.result === undefined) {
      console.error('No result passed to error bullet.');
    }
  },

  chartData: function () {
    return {
      ranges: [this.result.warning, this.result.fail, this.result.max],
      measures: [Math.min(this.result.current, this.result.max)]
    };
  },

  createChart: function () {
    nv.addGraph({
      generate: _.bind(function () {
        let chart = nv.models.bulletChart()
          .margin({top: 5, right: 20, bottom: 20, left: 25});
        if (this.result.current > this.result.fail) {
          chart.color('rgb(204, 0, 0)');
        } else if (this.result.current > this.result.warning) {
          chart.color('rgb(241, 194, 50)');
        } else {
          chart.color('rgb(147, 196, 125)');
        }
        d3.select('#' + this.el.id + ' svg')
          .datum(this.chartData())
          .call(chart);
        chart.bullet.dispatch.on('elementMouseover.tooltip', null);
        chart.bullet.dispatch.on('elementMouseover.tooltip', _.bind(function (evt) {
          evt['series'] = {
            key: 'Current value',
            value: this.result.current,
            color: chart.color()
          };
          chart.tooltip.data(evt).hidden(false);
        }, this));
        return chart;
      }, this),
      callback: _.bind(function (graph) {
        nv.utils.windowResize(_.bind(function () {
          let parent = $('#' + this.el.id);
          let width = parent.width();
          let height = parent.height();
          graph.width(width).height(height);

          d3.select('#' + this.el.id + ' svg')
            .attr('width', width)
            .attr('height', height)
            .transition().duration(0)
            .call(graph);
        }, this));
      }, this)
    });
  },

  render: function () {
    this.createChart();
  }

});
