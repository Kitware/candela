import Backbone from 'backbone';

import okayIcon from '../../images/okay.svg';
import spinnerIcon from '../../images/spinner.gif';
import warningIcon from '../../images/warning.svg';
import infoIcon from '../../images/info.svg';
import newInfoIcon from '../../images/newInfo.svg';

let Widget = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.hidden = false;
    self.friendlyName = 'ERROR! Abstract Widget!';
    self.hashName = '';
    self.statusIcon = null;
    self.statusText = '';
  },
  renderStatus: function () {
    let self = this;
    let status = self.$el.parent().find('span.indicators');
    if (self.handleStatusClick) {
      status.on('click', function (event) {
        event.stopPropagation();
        self.handleStatusClick();
      });
    }
    status.find('span.indicatorText').text(self.statusText);
    if (self.statusIcon) {
      status.find('span.indicatorIcons > img')
        .show()
        .attr('src', self.statusIcon);
    } else {
      status.find('span.indicatorIcons > img').hide();
    }
  }
});

Widget.okayIcon = okayIcon;
Widget.spinnerIcon = spinnerIcon;
Widget.warningIcon = warningIcon;
Widget.infoIcon = warningIcon;
Widget.newInfoIcon = warningIcon;

module.exports = Widget;
