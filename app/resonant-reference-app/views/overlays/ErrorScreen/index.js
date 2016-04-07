import Backbone from 'backbone';
import myTemplate from './template.html';
let girder = window.girder;

let ErrorScreen = Backbone.View.extend({
  render: function () {
    let self = this;
    
    if (!self.addedTemplate) {
      self.$el.html(myTemplate);
      self.addedTemplate = true;
    }
  }
});

export default ErrorScreen;
