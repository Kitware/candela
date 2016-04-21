import Backbone from 'backbone';
import jQuery from 'jquery';
import myTemplate from './template.html';
import './style.css';

let StartingGuide = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);

    jQuery('#startingGuide button').on('click', function () {
      if (this.textContent === 'Start With Data') {
        window.mainPage.overlay.render('DatasetLibrary');
      } else {
        window.mainPage.overlay.render('VisualizationLibrary');
      }
    });
  }
});

export default StartingGuide;
