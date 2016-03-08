import Backbone from 'backbone';

let Widget = Backbone.View.extend({
  initialize: function () {
    let self = this;
    self.hidden = false;
    self.new = false;
    self.friendlyName = 'ERROR! Abstract Widget!';
    self.hashName = '';
  }
});

module.exports = Widget;
