import Backbone from 'backbone';
import jQuery from 'jquery';

import collapseIcon from '../../images/collapse.svg';
import expandIcon from '../../images/expand.svg';
import okayIcon from '../../images/okay.svg';
import spinnerIcon from '../../images/spinner.gif';
import warningIcon from '../../images/warning.svg';
import infoIcon from '../../images/info.svg';
import newInfoIcon from '../../images/newInfo.svg';

let Widget = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.friendlyName = 'ERROR! Abstract Widget!';
    self.hashName = '';
    self.statusText = {
      text: ''
    };
    self.icons = [{
      src: function () {
        return self.isTargeted() ? collapseIcon : expandIcon;
      },
      title: function () {
        return self.isTargeted() ? 'Collapse Panel' : 'Expand Panel';
      },
      onclick: function () {
        self.panel.toggle();
      }
    }];
    self.panel = null;
  },
  isTargeted: function () {
    let self = this;
    return window.location.hash.split('#').indexOf(self.hashName) !== -1;
  },
  setPanel: function (panel) {
    let self = this;
    self.panel = panel;
    self.setElement(jQuery('#' + self.hashName + 'Container')[0]);
  },
  renderIndicators: function () {
    let self = this;
    self.panel.renderIndicators();
  }
});

Widget.collapseIcon = okayIcon;
Widget.expandIcon = okayIcon;
Widget.okayIcon = okayIcon;
Widget.spinnerIcon = spinnerIcon;
Widget.warningIcon = warningIcon;
Widget.infoIcon = infoIcon;
Widget.newInfoIcon = newInfoIcon;

module.exports = Widget;
