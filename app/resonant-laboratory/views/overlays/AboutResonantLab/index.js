import Backbone from 'backbone';
import myTemplate from './template.html';

import './style.css';

let AboutResonantLab = Backbone.View.extend({
  render: function () {
    if (!this.addedTemplate) {
      this.$el.html(myTemplate);

      this.addedTemplate = true;
    }
  }
});

export default AboutResonantLab;
