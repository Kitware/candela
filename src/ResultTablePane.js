import Backbone from 'backbone';
import _ from 'underscore';
import $ from 'jquery';

import { ErrorBulletWidget } from './ErrorBulletWidget';

import tablePane from '../templates/tablePane';

export let ResultTablePane = Backbone.View.extend({
  el: '.result-table-pane',

  initialize: function (settings) {
    this.results = settings.trendValuesByDataset;
    this.trends = settings.trends || {};
    this.datasetMap = settings.datasetMap || {};
    this.trajectoryMap = settings.trajectoryMap || {};
    this.datasetLabelMap = settings.datasetLabelMap || {};
    this.trendAbbreviationMap = settings.trendAbbreviationMap;
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
      result.id = result.dataset.replace(/\./g, '_');
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
      datasetLabelMap: this.datasetLabelMap
    })).promise().done(_.bind(function () {
      _.each(this.results, function (result) {
        var resultDivSelector = '#' + result.id + '-' +
          (this.trendAbbreviationMap[result.trend] || result.trend)
          .toLowerCase().replace(' ', '_');
        // change color of circle
        if (result.warning > result.fail) {
          // Lower values are better.
          if (result.current < result.fail) {
            $(resultDivSelector + ' svg.statusDot').find('circle')
              .attr('class', 'fail');
          } else if (result.current < result.warning) {
            $(resultDivSelector + ' svg.statusDot').find('circle')
              .attr('class', 'bad');
          }
        } else {
          if (result.current > result.fail) {
            $(resultDivSelector + ' svg.statusDot').find('circle')
              .attr('class', 'fail');
          } else if (result.current > result.warning) {
            $(resultDivSelector + ' svg.statusDot').find('circle')
              .attr('class', 'bad');
          }
        }
        // render bullets
        let errorBullet = new ErrorBulletWidget({
          el: resultDivSelector + '-bullet',
          result: result
        });
        errorBullet.render();

        // activate callback for bullet if specified
        if (typeof result.callback === 'function') {
          $(resultDivSelector)
            .css('cursor', 'pointer')
            .click(result.callback);
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
