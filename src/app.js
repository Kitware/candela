import Backbone from 'backbone';
import _ from 'underscore';

require('bootstrap-webpack');
require('nvd3/build/nv.d3.min.css');
require('../styles/main.styl');

import { InfoPane } from './InfoPane';
import { TrendPane } from './TrendPane';
import { ResultTablePane } from './ResultTablePane';
import { TopInfoBar } from './TopInfoBar';

import layout from '../templates/layout';

export let dash = Backbone.View.extend({
  el: 'body',

  initialize: function (settings) {
    settings.trendAbbreviationMap = {};
    _.each(settings.trends, function (trend) {
      settings.trendAbbreviationMap[trend.name] = trend.abbreviation;
    });
    this.trackData = settings;
    delete this.trackData.el;
    this.render();
  },

  render: function () {
    this.$el.html(layout());
    let topInfoBar = new TopInfoBar(this.trackData);
    let infoPane = new InfoPane(this.trackData);
    let trendPane = new TrendPane(this.trackData);
    let resultPane = new ResultTablePane(this.trackData);
    topInfoBar.render();
    infoPane.render();
    trendPane.render();
    resultPane.render();
  }

});
