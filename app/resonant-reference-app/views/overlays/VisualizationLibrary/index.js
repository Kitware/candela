import Backbone from 'backbone';
import myTemplate from './template.html';
import libImage from '../../../images/library.svg';
import candela from './../../../../../src';

let VisualizationLibrary = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    
    // TODO: populate with available visualizations
    // (see issue #12)
    
    console.log(candela.components);
  }
});

export default VisualizationLibrary;
