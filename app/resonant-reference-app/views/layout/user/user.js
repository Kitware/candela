import Backbone from 'backbone';
import myTemplate from './template.html';

import './user.css';

let UserView = Backbone.View.extend({
  render: function () {
    let self = this;
    self.$el.html(myTemplate);
    // TODO: change the top bar based on
    // logged in status, etc

    // TODO: show menu on clicking
    // gear, allowing users to show/hide
    // specific tools
  }
});

module.exports = UserView;
