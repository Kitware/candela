/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    jQuery = require('jquery'),
    d3 = require('d3'),
    myTemplate = require('./template.html'),
    library = require('./visualizationLibrary.json'),
    libImage = require('../../../../assets/images/library.svg'),
    candela = require('../../../../../../dist/candela/candela.js');

var DatasetLibrary = Backbone.View.extend({
    render : function () {
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

module.exports = DatasetLibrary;
