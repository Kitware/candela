/*globals require, module*/
/*jshint devel:true, browser:true*/

var Backbone = require('backbone'),
    accordionStyle = require('./accordionhorz.css'),
    myTemplate = require('./template.html'),
    myStyles = require('./style.css'),
    d3 = require('d3'),
    collapseIcon = require('../../../assets/images/collapse.svg'),
    expandIcon = require('../../../assets/images/expand.svg');

var ToolsView = Backbone.View.extend({
    initialize : function () {
        var self = this;
        self.listenTo(self.model, 'change', self.render);
        self.$el.html(myTemplate);
        self.views = {};
    },
    render : function () {
        var self = this,
            tools = d3.entries(self.model.get('tools'));
        
        // Only show tools that aren't hidden
        tools = tools.filter(function (d) {
            return !d.value.hidden;
        });
        
        // Patch on a temporary flag as to
        // which sections are expanded
        var hashes = location.hash.split('#');
        tools.forEach(function (d) {
            d.targeted = hashes.indexOf(d.key) !== -1;
        });
        
        // Create sections for each tool
        var sections = d3.select(self.el)
            .select('article')
            .selectAll('section')
            .data(tools, function (d) {
                return d.key;
            });
        
        var sectionsEnter = sections.enter().append('section');
        
        // Remove each view object when views are removed
        sections.exit().each(function (d) {
            delete self.views[d.key];
        }).remove();
        
        sections.attr('id', function (d) {
            return d.key;
        }).attr('class', function (d) {
            return d.targeted ? 'targeted' : null;
        });
        
        // We need a header/handle for each section
        var handlesEnter = sectionsEnter.append('h2').append('a');
        sections.selectAll('h2').selectAll('a')
            .on('click', function (d) {
                self.toggle(d.key);
            });
        
        handlesEnter.append('img');
        sections.selectAll('h2').selectAll('a').selectAll('img')
            .attr('src', function (d) {
                // TODO: why isn't the icon changing?
                if (d.targeted) {
                    return collapseIcon;
                } else {
                    return expandIcon;
                }
            });
        
        handlesEnter.append('span');
        sections.selectAll('h2').selectAll('a').selectAll('span')
            .text(function (d) {
                return d.value.friendlyName;
            });
        
        // Finally, a div (that will scroll)
        // to contain the view
        sectionsEnter.append('div').attr({
            id : function (d) { return d.key + 'Container'; },
            class : 'content'
        });
        
        // Distribute the space for each section
        var expandedSections = hashes.length - 1;
        var collapsedSections = tools.length - expandedSections;
        var style = 'calc((100% - (0.5em + ' +
            '2.5*' + collapsedSections + 'em + ' +
            '0.5*' + expandedSections + 'em)) / ' +
            expandedSections + ')';
        
        self.$el.find('section')
            .css('width', '');
        
        self.$el.find('section.targeted')
            .css('width', style);
        
        // Now let's embed the actual view
        sectionsEnter.each(function (d) {
            var model = d.value.model;
            model = self.model.getCurrentToolchain().get(model);
            
            var newView = new d.value.view({
                el : '#' + d.key + 'Container',
                model : model
            });
            
            self.views[d.key] = newView;
        });
        
        // Finally, get all our views to render
        var view;
        for (view in self.views) {
        if (self.views.hasOwnProperty(view)) {
            self.views[view].render();
        }
        }
    },
    toggle : function (key) {
        var self = this,
            hashes = location.hash.split('#'),
            index = hashes.indexOf(key);
        
        if (index === -1) {
            // Toggle on; add this view
            hashes.push(key);
        } else {
            // Toggle off; collapse this view
            hashes.splice(index, 1);
        }
        location.hash = hashes.join('#');
        self.render();
    }
});

module.exports = ToolsView;