/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    d3 = require('d3'),
    jQuery = require('jquery'),
    myTemplate = require('./template.html');

var SingleDatasetView = Backbone.View.extend({
    initialize : function () {
        var self = this;
        self.$el.html(myTemplate);
        self.$el.find('button.switchDataset')
                .on('click', function () {
                    window.overlay.render('datasetLibrary');
                });
    },
    render: function () {
        var self = this,
            dataset = self.model.at(0);
        
        if (!dataset) {
            self.$el.find('button.switchDataset')
                .text('Choose a dataset');
        } else {
            self.$el.find('button.switchDataset')
                .text('Switch datasets');
        }
    }
});

module.exports = SingleDatasetView;