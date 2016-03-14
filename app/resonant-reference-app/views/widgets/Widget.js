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
      text: '',
      onclick: function () {}
    };
    self.icons = [{
      src: function () {
        return self.isTargeted() ? collapseIcon : expandIcon;
      },
      onclick: function () {
        self.pane.toggle();
      }
    }];
    self.pane = null;
  },
  isTargeted: function () {
    let self = this;
    return window.location.hash.split('#').indexOf(self.hashName) !== -1;
  },
  setPane: function (pane) {
    let self = this;
    self.pane = pane;
    self.setElement(jQuery('#' + self.hashName + 'Container')[0]);
  },
  renderIndicators: function () {
    let self = this;
    self.pane.renderIndicators();
  }
});

Widget.collapseIcon = okayIcon;
Widget.expandIcon = okayIcon;
Widget.okayIcon = okayIcon;
Widget.spinnerIcon = spinnerIcon;
Widget.warningIcon = warningIcon;
Widget.infoIcon = warningIcon;
Widget.newInfoIcon = warningIcon;

module.exports = Widget;
