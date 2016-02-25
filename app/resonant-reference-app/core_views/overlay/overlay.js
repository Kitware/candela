/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    d3 = require('d3'),
    jQuery = require('jquery'),
    myStyles = require('./overlay.css');

var templates = {
    startup : require('./startingGuide/startingGuide.js'),
    datasetLibrary : require('./datasetLibrary/datasetLibrary.js'),
    visualizationLibrary : require('./visualizationLibrary/visualizationLibrary.js')
};

var Overlay = Backbone.View.extend({
    initialize: function () {
        var self = this;
        
        if (location.hash === '') {
            self.render('startup');
        } else {
            self.render(null);
        }
    },
    render: function (template) {
        var self = this;
        
        if (template === undefined) {
            // we're just re-rendering, not switching
            template = self.template;
        } else {
            // because we're switching, save the setting
            // for next time we just re-render
            self.template = template;
        }
        
        if (template !== null) {
            self.$el.html('');
            
            var temp = new templates[template]();
            self.el.appendChild(temp.el);
            temp.render();
            
            d3.select(self.el)
                .style('display', 'block')
                .style('opacity', 0.0)
                .transition().duration(400)
                .style('opacity', 1.0);
            
            jQuery(window).on('keyup', function (e) {
                if (e.keyCode === 27) {
                    // Escape pressed
                    self.render(null);
                }
            });
        } else {
            jQuery(window).off('keyup');
            d3.select(self.el)
                .style('opacity', 1.0)
                .transition().duration(400)
                .style('opacity', 0.0);
            window.setTimeout(function () {
                d3.select(self.el)
                    .style('display', 'none');
                self.el.innerHTML = "";
            }, 500);
        }
    }
});

module.exports = Overlay;