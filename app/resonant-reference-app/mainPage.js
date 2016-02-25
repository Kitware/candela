/*globals require, module*/
/*jshint devel:true, browser:true*/

var jQuery = require('jquery'),
    myTemplate = require('./core_views/mainPage/mainPage.html'),
    myStyles = require('./core_views/mainPage/mainPage.css'),
    formStyles = require('./css_extras/pure-css-custom-form-elements/style.css'),
    tooltipStyles = require('./css_extras/tooltip/tooltip.css'),
    Overlay = require('./core_views/overlay/overlay.js'),
    UserView = require('./core_views/user/user.js'),
    ToolsView = require('./core_views/tools/tools.js');

function renderEverything() {
    window.overlay.render();
    window.userView.render();
    window.toolsView.render();
}

jQuery('body').append(myTemplate);

var User = require('./core_models/user');
window.user = new User();

window.overlay = new Overlay({
    el : '#Overlay'
});
window.userView = new UserView({
    model : window.user,
    el : '#UserView'
});
window.toolsView = new ToolsView({
    model : window.user,
    el : '#ToolsView'
});

jQuery(window).on('hashchange', renderEverything);
window.onresize = renderEverything;
renderEverything();