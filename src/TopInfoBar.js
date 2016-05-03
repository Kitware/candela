import Backbone from 'backbone';

import topInfoBar from '../templates/topInfoBar';

export let TopInfoBar = Backbone.View.extend({
  el: '.top-info-bar',

  initialize: function (settings) {
    this.name = settings.name || 'Ground Truth';
    this.branch = settings.branch || 'master';
    this.day = settings.day || this.getToday();
    this.submissionUuid = settings.submission_uuid;
    this.helpLink = settings.help_link || 'https://github.com/Trailmix/RedwoodInternal/wiki/Midas-for-Metrics-Based-Testing#performance-dashboards';
  },

  render: function () {
    this.$el.html(topInfoBar({
      name: this.name,
      branch: this.branch,
      day: this.day,
      uuid: this.submissionUuid,
      helpLink: this.helpLink
    }));
  }

});
