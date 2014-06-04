trackerdash.views.ErrorBulletWidget = Backbone.View.extend({

    initialize: function (settings) {
        this.result = settings.result;
        if (this.result === undefined) {
            console.error('No result passed to error bullet.');
        }
        this.render();
        $(window).on("resize", _.bind(this.createChart, this));
    },

    getChartData: function () {
        return {
            "ranges": [this.result.fail, this.result.mean, this.result.warning],
            "measures": [this.result.current],
            "markers": [this.result.target],
            "rangeLabels": ['Failing Range', 'Mean', 'Warning Range'],
            "measureLabels": ['Current Error %'],
            "markerLabels": ['Target Error %']
        };
    },

    createChart: function () {
        nv.addGraph(_.bind(function() {
            var chart = nv.models.bulletChart();
            chart.margin({top: 5, right: 20, bottom: 20, left: 20});

            d3.select(this.el)
              .datum(this.getChartData())
              .transition().duration(100)
              .call(chart)
            ;

            return chart;
        }, this));
    },

    render: function () {
        this.createChart();
    }

});
