/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    d3 = require('d3'),
    jQuery = require('jquery');

var SingleVisualizationView = Backbone.View.extend({
    render: function (template) {
        var self = this;
        
        self.$el.html('<div>TODO!</div>');
    }
});

module.exports = SingleVisualizationView;