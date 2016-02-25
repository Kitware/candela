/*globals require, module*/
/*jshint devel:true, browser:true*/

var User = require('./core_models/user');
window.user = new User();
require('./core_views/mainPage/mainPage.js');
