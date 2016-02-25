/*globals require, module*/
/*jshint devel:true, browser:true*/

// require.ensure loads the resources,
// but doesn't actually parse them until
// we say so
require.ensure([
    './index.html',
    './core_views/mainPage/mainPage.js',
    './core_models/user'
], function (require) {
    
    // Set up our models while we wait
    // for the page to load
    var User = require('./core_models/user');
    window.user = new User();
    
    window.onload = function () {
        require('./core_views/mainPage/mainPage.js');
    };
});