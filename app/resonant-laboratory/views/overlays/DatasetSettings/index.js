import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import myTemplate from './template.html';

let DatasetSettings = Backbone.View.extend({
  render: function () {
    this.$el.html(myTemplate);
  }
});

export default DatasetSettings;
