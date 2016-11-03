import Backbone from 'node/backbone';
// import d3 from 'node/d3';
import myTemplate from './template.html';

let AchievementLibrary = Backbone.View.extend({
  render: function () {
    this.$el.html(myTemplate);
  }
});

export default AchievementLibrary;
