/*globals require, module*/
/*jshint devel:true, browser:true*/

var jQuery = require('jquery'),
    myTemplate = require('./mainPage.html'),
    myStyles = require('./mainPage.css'),
    formStyles = require('../../css_extras/pure-css-custom-form-elements/style.css'),
    tooltipStyles = require('../../css_extras/tooltip/tooltip.css'),
    Overlay = require('./overlay/overlay.js'),
    UserView = require('./user/user.js'),
    ToolsView = require('./tools/tools.js');

function renderEverything() {
    window.overlay.render();
    window.userView.render();
    window.toolsView.render();
}

jQuery('body').append(myTemplate);

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