import _ from 'underscore';
import d3 from 'd3';
import nv from 'nvd3';
import $ from 'jquery';

import { computeColor } from './utility.js';
import VisComponent from '../../VisComponent';

class ErrorBulletWidget extends VisComponent {
  constructor (el, settings) {
    super(el);

    this.result = settings.result;
    this.trend = settings.trend;
    if (this.result === undefined) {
      console.error('No result passed to error bullet.');
    }
    if (this.trend === undefined) {
      console.error('No trend passed to error bullet.');
    }
  }

  chartData () {
    return {
      ranges: this.trend.incompleteThreshold ? [0, 0, this.trend.max] : [this.trend.warning, this.trend.fail, this.trend.max],
      measures: [Math.round(Math.min(this.result.current, this.trend.max) * 10000) / 10000]
    };
  }

  render () {
    nv.addGraph({
      generate: _.bind(function () {
        let chart = nv.models.bulletChart()
          .margin({top: 5, right: 20, bottom: 20, left: 10});
        chart.color(computeColor(this.trend, this.result.current));
        // d3.select('[id=\'' + this.el.id + '-svg\']')
        d3.select(this.el)
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
          let parent = $(this.el.parentNode);
          let width = parent.width();
          let height = parent.height();
          graph.width(width).height(height);

          d3.select(this.el)
            .attr('width', width)
            .attr('height', height)
            .transition().duration(0)
            .call(graph);
        }, this));
      }, this)
    });
  }
}

export default ErrorBulletWidget;
