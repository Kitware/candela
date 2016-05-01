import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

import { ErrorBulletWidget } from './ErrorBulletWidget';
import { failValue, warningValue, sanitizeSelector } from './utility.js';

import tablePane from '../templates/tablePane';

export let ResultTablePane = Backbone.View.extend({
  el: '.result-table-pane',

  initialize: function (settings) {
    this.results = settings.trendValuesByDataset;
    this.trends = settings.trends;
    this.trendMap = settings.trendMap;
    this.datasetMap = settings.datasetMap || {};
    this.trajectoryMap = settings.trajectoryMap || {};
    this.datasetLabelMap = settings.datasetLabelMap || {};
    this.producerLink = settings.producer_link || null;
    if (this.results === undefined) {
      return;
    }
  },

  render: function () {
    if (this.results === undefined) {
      return;
    }
    // dots in names confound css selectors
    this.results.sort(function (a, b) {
      return a.dataset.localeCompare(b.dataset);
    });
    _.each(this.results, _.bind(function (result) {
      result.id = sanitizeSelector(result.dataset);
      this.datasetMap[result.id] = this.datasetMap[result.dataset];
      this.trajectoryMap[result.id] = this.trajectoryMap[result.dataset];
      this.datasetLabelMap[result.id] = this.datasetLabelMap[result.dataset];
    }, this));

    var resultsByDatasetId = _.groupBy(this.results, function (result) {
      return result.id;
    });

    this.$el.html(tablePane({
      resultsByDatasetId: resultsByDatasetId,
      trends: this.trends,
      datasetMap: this.datasetMap,
      trajectoryMap: this.trajectoryMap,
      datasetLabelMap: this.datasetLabelMap,
      producerLink: this.producerLink
    })).promise().done(_.bind(function () {
      _.each(this.results, function (result) {
        var trend = this.trendMap[result.trend];
        var resultDivSelector = '#' + result.id + '-' + trend.id_selector;
        // change color of circle
        if (!trend.incomplete) {
          if (failValue(result.current, trend.warning, trend.fail)) {
            $(resultDivSelector + ' svg.statusDot').find('circle')
              .attr('class', 'fail');
          } else if (warningValue(result.current, trend.warning, trend.fail)) {
            $(resultDivSelector + ' svg.statusDot').find('circle')
              .attr('class', 'bad');
          }
        }
        // render bullets
        let errorBullet = new ErrorBulletWidget({
          el: resultDivSelector + '-bullet',
          result: result,
          trend: trend
        });
        errorBullet.render();

        // activate callback for bullet if specified
        if (typeof result.callback === 'function') {
          $(resultDivSelector)
            .css('cursor', 'pointer')
            .click(result.callback);
        } else if (result.link) {
          $(resultDivSelector)
            .css('cursor', 'pointer')
            .click(function () {
              if (result.link) {
                window.location = result.link;
              }
            });
        }
      }, this);

      _.each(this.datasetMap, function (value, key) {
        if (typeof value === 'function') {
          $('#' + key + '-link').click(value);
        }
      });

      _.each(this.trajectoryMap, function (value, key) {
        if (typeof value === 'function') {
          $('#' + key + '-trajectory-link').click(value);
        }
      });
    }, this));
  }
});
