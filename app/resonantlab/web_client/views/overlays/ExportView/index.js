import Backbone from 'node/backbone';
import closeIcon from '../../../images/close.svg';
import downloadIcon from '../../../images/light/download.svg';
import myTemplate from './template.jade';

let candelaLib = require('raw!../../../../../build/candela/candela.js');

let ExportView = Backbone.View.extend({
  events: {
    'click #closeOverlay': function (event) {
      window.mainPage.overlay.closeOverlay();
    },

    'click div.exportOptions .circleButton': function (event) {
      let format = event.currentTarget.getAttribute('data-format');
      let download = this.el.getElementsByClassName('download-anchor')[0];
      download.setAttribute('download', 'chart.' + format);
      let vis = this.model.get('vis');

      if (format === 'html') {
        let script = '\n\n' +
          'var visClass = candela.components.' + vis.spec.name + ';\n' +
          'var el = document.createElement(visClass.container || "div");\n' +
          'document.body.appendChild(el);\n' +
          'var vis = new visClass(el, ' + JSON.stringify(vis.options) + ');\n' +
          'vis.render();\n';

        let text = '<body><script>' + candelaLib + script + '</script></body>';
        let data = new window.Blob([text], {type: 'text/plain'});
        let textFile = window.URL.createObjectURL(data);
        download.setAttribute('href', textFile);
        download.click();
        window.mainPage.overlay.closeOverlay();
      } else {
        vis.component.serialize(format).then(value => {
          download.setAttribute('href', value);
          download.click();
          window.mainPage.overlay.closeOverlay();
        });
      }
    }
  },

  render: function () {
    this.$el.html(myTemplate({
      closeIcon,
      downloadIcon,
      vis: this.model.get('vis')
    }));
  }
});

export default ExportView;
