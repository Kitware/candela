import _ from 'underscore';
import $ from 'jquery';
import d3 from 'd3';
import nv from 'nvd3';

import StatusBarWidget from './StatusBarWidget';
import ErrorBulletWidget from './ErrorBulletWidget';
import { deArray, failValue, warningValue } from './utility.js';

import infoPane from './templates/infoPane.jade';
import VisComponent from '../../VisComponent';

class InfoPane extends VisComponent {
  constructor (el, statusBarEl, settings) {
    super(el);
    this.$el = $(this.el);

    this.statusBarEl = statusBarEl;

    this.name = settings.name || 'Ground Truth';
    this.branch = settings.branch || 'master';
    this.day = settings.day || this.getToday();
    this.warning = settings.warning || 3;
    this.fail = settings.fail || 4;
    this.max = settings.max || 5;
    this.producerLink = settings.producer_link || null;

    this.numIncomplete = 0;
    this.numSuccess = 0;
    this.numBad = 0;
    this.numFail = 0;
    this.allValues = [];
    this.aggTrends = settings.aggTrends;
    _.each(settings.trendValuesByDataset, _.bind(function (dataset) {
      let current = deArray(dataset.current, d3.median);
      this.allValues.push(current);

      if (settings.trendMap[dataset.trend].incompleteThreshold) {
        this.numIncomplete++;
      } else {
        var failTrend = settings.trendMap[dataset.trend].fail;
        var warningTrend = settings.trendMap[dataset.trend].warning;
        if (failValue(current, warningTrend, failTrend)) {
          this.numFail++;
        } else if (warningValue(current, warningTrend, failTrend)) {
          this.numBad++;
        } else {
          this.numSuccess++;
        }
      }
    }, this));
  }

  getToday () {
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
  }

  render () {
      // Test if any of the aggregate trends have spark line historical data.
      var sparklinesExist = (_.find(this.aggTrends, function (trend) {
        return trend.history && trend.history.length > 1;
      }, this)) !== undefined;
    this.$el.html(infoPane({
      name: this.name,
      branch: this.branch,
      day: this.day,
      aggTrends: this.aggTrends,
      sparklinesExist: sparklinesExist,
      producerLink: this.producerLink
    })).promise().done(_.bind(function () {
      this.aggBullets = {};
      _.each(this.aggTrends, (trend, key, list) => {
        if (trend.history && trend.history.length > 1) {
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
        }
        let current = trend.history[trend.history.length - 1];
        current = deArray(current, d3.median);
        const el = $(`#${trend.id_selector}-aggregate-bullet`).get(0);
        this.aggBullets[trend.id_selector] = new ErrorBulletWidget(el, {
          result: {
            current: Math.round(current * 10000) / 10000
          },
          trend: trend
        }).render();
        let dotSelector = '#' + trend.id_selector + '-aggregate-dot';
        if (!trend.incompleteThreshold) {
          if (failValue(current, trend.warning, trend.fail)) {
              $(dotSelector).attr('class', 'fail');
          } else if (warningValue(current, trend.warning, trend.fail)) {
              $(dotSelector).attr('class', 'bad');
          }
        }
      }, this);
    }, this));

    let statusBar = new StatusBarWidget(this.statusBarEl, {
      numSuccess: this.numSuccess,
      numBad: this.numBad,
      numFail: this.numFail,
      numIncomplete: this.numIncomplete,
    });
    statusBar.render();
  }
}

export default InfoPane;
