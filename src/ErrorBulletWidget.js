import Backbone from 'backbone';
import _ from 'underscore';
import d3 from 'd3';
import nv from 'nvd3';
import $ from 'jquery';

import colors from './colors.js';

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
      measures: [Math.round(Math.min(this.result.current, this.result.max) * 10000) / 10000]
    };
  },

  render: function () {
    nv.addGraph({
      generate: _.bind(function () {
        let chart = nv.models.bulletChart()
          .margin({top: 5, right: 20, bottom: 20, left: 25});
        if (this.result.current > this.result.fail) {
          chart.color(colors.fail);
        } else if (this.result.current > this.result.warning) {
          chart.color(colors.bad);
        } else {
          chart.color(colors.good);
        }
        d3.select('[id=\'' + this.el.id + '-svg\']')
          .datum(this.chartData())
          .call(chart);
        chart.bullet.dispatch.on('elementMouseover.tooltip', null);
        chart.bullet.dispatch.on('elementMouseover.tooltip', _.bind(function (evt) {
          evt['series'] = {
            key: 'Current value',
            value: Math.round(this.result.current * 10000) / 10000,
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

          d3.select('[id=\'' + this.el.id + '-svg\']')
            .attr('width', width)
            .attr('height', height)
            .transition().duration(0)
            .call(graph);
        }, this));
      }, this)
    });
  }

});
