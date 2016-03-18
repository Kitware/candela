import Backbone from 'backbone';
import myTemplate from './template.html';

import './header.css';

let Header = Backbone.View.extend({
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

export default Header;
