trackerdash.views.StatusBarWidget = Backbone.View.extend({
    el: '.status-bar-widget',

    initialize: function (settings) {
        this.numSuccess = settings.numSuccess || 0;
        this.numBad = settings.numBad || 0;
        this.numFail = settings.numFail || 0;
        this.render();
        $(window).on("resize", _.bind(this.createChart, this));
    },

    createChart: function () {



        var total = this.numSuccess + this.numBad + this.numFail;

        if (total <= 0) {
            console.error('StatusBarWidget: Total tracks cannot be <= 0.');
            return;
        }

        var
            successPercent = (this.numSuccess*100 / total).toFixed(2),
            badPercent = (this.numBad*100 / total).toFixed(2),
            failPercent = (this.numFail*100 / total).toFixed(2);

        var svg = d3.select('.status-bar-chart svg');
        var curWidth = svg.style('width').slice(0, -2);
        var curHeight = svg.style('height').slice(0, -2);

        var unitWidth = curWidth / total;
        var badStart = unitWidth * this.numSuccess;
        var failStart = badStart + unitWidth * this.numBad;

        var textHeight = curHeight/2 + 4;

        var successGroup = svg.append('g');
        successGroup.append('rect')
            .attr('x', 0)
            .attr('width', unitWidth * this.numSuccess)
            .attr('height', '100%')
            .attr('class', 'success');
        successGroup.append('text')
            .text(successPercent + '%')
            .attr('x', (unitWidth * this.numSuccess)/2)
            .attr('y', textHeight)
            .attr('fill', 'white')
            .attr('class', 'status-bar-label');

        var badGroup = svg.append('g');
        badGroup.append('rect')
            .attr('x', badStart)
            .attr('width', unitWidth * this.numBad)
            .attr('height', '100%')
            .attr('class', 'bad');
        badGroup.append('text')
            .text(badPercent + '%')
            .attr('x', badStart + (unitWidth * this.numBad)/2)
            .attr('y', textHeight)
            .attr('fill', 'white')
            .attr('class', 'status-bar-label');

        var failGroup = svg.append('g');
        failGroup.append('rect')
            .attr('x', failStart)
            .attr('width', unitWidth * this.numFail)
            .attr('height', '100%')
            .attr('class', 'fail');
        failGroup.append('text')
            .text(failPercent + '%')
            .attr('x', failStart + (unitWidth * this.numFail)/2)
            .attr('y', textHeight)
            .attr('fill', 'white')
            .attr('class', 'status-bar-label');
    },

    render: function () {
        this.$el.html(jade.templates.statusBarWidget());
        this.createChart();
    }
});
