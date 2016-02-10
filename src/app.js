import Backbone from 'backbone';

import { InfoPane } from './InfoPane';
import { TrendPane } from './TrendPane';
import { ResultTablePane } from './ResultTablePane';

import layout from '../templates/layout';

export let App = Backbone.View.extend({
  el: 'body',

  initialize: function (settings) {
    this.trackData = settings;
    delete this.trackData.el;
    this.render();
  },

  render: function () {
    this.$el.html(layout());
    let infoPane = new InfoPane(this.trackData);
    let trendPane = new TrendPane(this.trackData);
    let resultPane = new ResultTablePane(this.trackData);
    infoPane.render();
    trendPane.render();
    resultPane.render();
  }

});
