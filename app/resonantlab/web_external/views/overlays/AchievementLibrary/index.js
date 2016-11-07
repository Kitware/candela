import Backbone from 'girder_plugins/resonantlab/node/backbone';
// import d3 from 'girder_plugins/resonantlab/node/d3';
import myTemplate from './template.html';

let AchievementLibrary = Backbone.View.extend({
  render: function () {
    this.$el.html(myTemplate);
  }
});

export default AchievementLibrary;
