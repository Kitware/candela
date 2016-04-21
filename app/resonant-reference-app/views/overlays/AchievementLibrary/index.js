import Backbone from 'backbone';
// import d3 from 'd3';
import myTemplate from './template.html';

let AchievementLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
  }
});

export default AchievementLibrary;
