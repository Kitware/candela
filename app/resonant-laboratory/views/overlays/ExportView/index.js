import Backbone from 'backbone';
import closeIcon from '../../../images/close.svg';
import libraryIcon from '../../../images/library.svg';
import myTemplate from './template.jade';

let ExportView = Backbone.View.extend({
  events: {
    'click div.exportOptions .circleButton': function (event) {
      let format = event.currentTarget.getAttribute('data-format');
      let download = this.el.getElementsByClassName('download-anchor')[0];

      this.model.get('vis').component.serialize().then(value => {
        download.setAttribute('download', 'chart.' + format);
        download.setAttribute('href', value);
        download.click();
      });
    }
  },

  render: function () {
    this.$el.html(myTemplate({
      closeIcon,
      libraryIcon,
      vis: this.model.get('vis')
    }));
  }
});

export default ExportView;
