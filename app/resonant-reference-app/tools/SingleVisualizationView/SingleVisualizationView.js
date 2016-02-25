/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    d3 = require('d3'),
    jQuery = require('jquery'),
    myTemplate = require('./template.html'),
    candela = require('../../../../dist/candela/candela.js');

var SingleVisualizationView = Backbone.View.extend({
    render: function () {
        var self = this;
        
        self.$el.html(myTemplate);
        
        var vis = new candela.default.components.Scatter('.visualization', {
          data: [
            {
              x: 1,
              y: 1
            },
            {
              x: 3,
              y: 8
            }
          ]
        });
    }
});

module.exports = SingleVisualizationView;