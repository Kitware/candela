/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    jQuery = require('jquery'),
    d3 = require('d3'),
    myTemplate = require('./template.html'),
    library = require('./visualizationLibrary.json'),
    libImage = require('../../../assets/images/library.svg'),
    candela = require('../../../../../dist/candela/candela.js');

var VisualizationLibrary = Backbone.View.extend({
    render : function () {
        var self = this;
        self.$el.html(myTemplate);
        
        // TODO: populate with available visualizations
        // (see issue #12)
    }
});

module.exports = VisualizationLibrary;
