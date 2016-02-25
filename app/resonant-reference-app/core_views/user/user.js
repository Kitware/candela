/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    myTemplate = require('./template.html'),
    myStyle = require('./user.css');

var UserView = Backbone.View.extend({
    render : function () {
        var self = this;
        self.$el.html(myTemplate);
        // TODO: change the top bar based on
        // logged in status, etc
        
        // TODO: show menu on clicking
        // gear, allowing users to show/hide
        // specific tools
    }
});

module.exports = UserView;