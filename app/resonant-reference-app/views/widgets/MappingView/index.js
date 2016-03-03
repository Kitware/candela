import Backbone from 'backbone';
import myTemplate from './index.jade';

let MappingView = Backbone.View.extend({
  initialize: function () {
  },
  render: function () {
    this.$el.html(myTemplate());
  }
});

export default MappingView;
