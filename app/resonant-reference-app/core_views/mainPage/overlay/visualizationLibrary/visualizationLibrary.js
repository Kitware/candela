/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    jQuery = require('jquery'),
    d3 = require('d3'),
    myTemplate = require('./template.html'),
    library = require('./visualizationLibrary.json'),
    libImage = require('../../../../assets/images/library.svg');

var DatasetLibrary = Backbone.View.extend({
    render : function () {
        var self = this;
        self.$el.html(myTemplate);
        
        var libraryButtons = d3.select('div.visualizationLibrary')
            .selectAll('.circleButton')
            .data(library);
        
        var libraryButtonsEnter = libraryButtons.enter().append('div')
            .attr('class', 'circleButton');
        libraryButtons.exit().remove();

        libraryButtonsEnter.append('img');
        libraryButtons.selectAll('img')
            .attr('src', libImage);
        
        libraryButtonsEnter.append('span');
        libraryButtons.selectAll('span')
            .text(function (d) { return d; });

        d3.select('div.libraryInterface').selectAll('.circleButton')
            .on('click', function (d) {
                // TODO
                window.overlay.render(null);
            });
    }
});

module.exports = DatasetLibrary;