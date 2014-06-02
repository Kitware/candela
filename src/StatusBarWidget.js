trackerdash.views.StatusBarWidget = Backbone.View.extend({
    el: '.status-bar-widget',

    initialize: function (settings) {
        this.success = settings.success || 5;
        this.bad = settings.bad || 3;
        this.fail = settings.fail || 2;
        this.render();
        $(window).on("resize", _.bind(this.createChart, this));
    },

    createChart: function () {

        var total = this.success + this.bad + this.fail,
            successPercent = this.success*100 / total,
            badPercent = this.bad*100 / total,
            failPercent = this.fail*100 / total;

        var svg = d3.select('.status-bar-chart svg');
        var curWidth = svg.style('width').slice(0, -2);
        var curHeight = svg.style('height').slice(0, -2);

        var unitWidth = curWidth / total;
        var badStart = unitWidth * this.success;
        var failStart = badStart + unitWidth * this.bad;

        var textHeight = curHeight/2 + 4;

        var successGroup = svg.append('g');
        successGroup.append('rect')
            .attr('x', 0)
            .attr('width', unitWidth * this.success)
            .attr('height', '100%')
            .attr('class', 'success');
        successGroup.append('text')
            .text(successPercent + '%')
            .attr('x', (unitWidth * this.success)/2)
            .attr('y', textHeight)
            .attr('fill', 'white')
            .attr('class', 'status-bar-label');

        var badGroup = svg.append('g');
        badGroup.append('rect')
            .attr('x', badStart)
            .attr('width', unitWidth * this.bad)
            .attr('height', '100%')
            .attr('class', 'bad');
        badGroup.append('text')
            .text(badPercent + '%')
            .attr('x', badStart + (unitWidth * this.bad)/2)
            .attr('y', textHeight)
            .attr('fill', 'white')
            .attr('class', 'status-bar-label');

        var failGroup = svg.append('g');
        failGroup.append('rect')
            .attr('x', failStart)
            .attr('width', unitWidth * this.fail)
            .attr('height', '100%')
            .attr('class', 'fail');
        failGroup.append('text')
            .text(failPercent + '%')
            .attr('x', failStart + (unitWidth * this.fail)/2)
            .attr('y', textHeight)
            .attr('fill', 'white')
            .attr('class', 'status-bar-label');
    },

    render: function () {
        this.$el.html(jade.templates.statusBarWidget());
        this.createChart();
    }
});
