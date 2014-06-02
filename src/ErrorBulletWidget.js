trackerdash.views.ErrorBulletWidget = Backbone.View.extend({

    initialize: function (settings) {
        this.ranges = settings.ranges || [5, 10, 25];
        this.measures = settings.measures || [7];
        this.markers = settings.markers || [11];
        this.render();
        $(window).on("resize", _.bind(this.createChart, this));
    },

    getChartData: function () {
        return {
            "ranges": this.ranges,
            "measures": this.measures,
            "markers": this.markers,
        };
    },

    createChart: function () {
        nv.addGraph(_.bind(function() {
            var chart = nv.models.bulletChart();
            chart.margin({top: 5, right: 20, bottom: 20, left: 20});

            d3.select(this.el)
              .datum(this.getChartData())
              .transition().duration(200)
              .call(chart)
            ;

            return chart;
        }, this));
    },

    render: function () {
        this.createChart();
    }

});
