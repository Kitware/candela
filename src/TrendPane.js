trackerdash.views.TrendPane = Backbone.View.extend({
    el: '.trend-pane',

    initialize: function (settings) {
        this.success = settings.success || [5, 2, 2, 5, 9];
        this.bad = settings.bad || [2, 1, 2, 3, 0];
        this.fail = settings.fail || [2, 6, 2, 2, 0];
        this.render();
    },

    getChartData: function () {

        // Prepare the data for plotting
        for (var i = 0; i < this.success.length; ++i) {
            this.success[i] = {x: i, y: this.success[i]};
            this.bad[i] = {x: i, y: this.bad[i]};
            this.fail[i] = {x: i, y: this.fail[i]};
        }

        return [{
            values: this.success,
            key: 'Success',
            color: 'rgb(147, 196, 125)'
        },
        {
            values: this.bad,
            key: 'Bad',
            color: 'rgb(241, 194, 50)'
        },
        {
            values: this.fail,
            key: 'Fail',
            color: 'rgb(204, 0, 0)'
        }];
    },

    createChart: function () {
        nv.addGraph(_.bind(function() {
            var chart = nv.models.lineChart()
              .useInteractiveGuideline(true)
              ;

            chart.xAxis
              .axisLabel('Time (Days)')
              .tickFormat(d3.format(',r'))
              ;

            chart.yAxis
              .axisLabel('Number of Runs')
              .tickFormat(d3.format(',r'))
              ;

            d3.select('.trend-chart svg')
              .datum(this.getChartData())
              .transition().duration(500)
              .call(chart)
              ;

            nv.utils.windowResize(chart.update);

            return chart;
        }, this));
    },

    render: function () {
        this.$el.html(jade.templates.trendPane());
        this.createChart();
    }
});
