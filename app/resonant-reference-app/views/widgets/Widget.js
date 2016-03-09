import Backbone from 'backbone';

import okayIcon from '../../images/okay.svg';
import warningIcon from '../../images/warning.svg';

let Widget = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.hidden = false;
    self.new = false;
    self.friendlyName = 'ERROR! Abstract Widget!';
    self.hashName = '';
  },
  getIndicatorSpan: function () {
    let self = this;
    return self.$el.parent().find('span.indicators')[0];
  }
});

Widget.okayIcon = okayIcon;
Widget.warningIcon = warningIcon;

module.exports = Widget;
