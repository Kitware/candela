import Backbone from 'backbone';
import myTemplate from './template.html';

let MappingView = Backbone.View.extend({
  initialize: function () {
    this.$el.html(myTemplate);
  },
  render: function () {
    this.$el.html("<b>Hello</b>");
  }
});

export default MappingView;
