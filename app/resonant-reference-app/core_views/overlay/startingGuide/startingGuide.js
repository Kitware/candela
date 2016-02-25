/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    jQuery = require('jquery'),
    myTemplate = require('./template.html'),
    myStyles = require('./style.css');

var StartingGuide = Backbone.View.extend({
    render : function () {
        var self = this;
        self.$el.html(myTemplate);
        
        jQuery('#startingGuide button').on('click', function () {
            if (this.textContent === 'Start With Data') {
                location.href = '#singleDatasetView';
                window.overlay.render('datasetLibrary');
            } else {
                location.href = '#singleVisualizationView';
                window.overlay.render('visualizationLibrary');
            }
        });
    }
});

module.exports = StartingGuide;