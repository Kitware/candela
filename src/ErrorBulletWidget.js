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
            "ranges":
                [50, this.result.fail, this.result.warning, this.result.target],
            "measures": [this.result.current],
            "markers": [this.result.target, this.result.mean],
            "rangeLabels": ['', 'Failing', 'Warning', 'Target'],
            "measureLabels": ['Current Error %'],
            "markerLabels": ['Target Error %', 'Mean Error %']
        };
    },

    createChart: function () {
        nv.addGraph(_.bind(function() {
            var chart = nv.models.bulletChart()
              .orient('right')
              .margin({top: 5, right: 20, bottom: 20, left: 20});

            if (this.result.current > this.result.fail) {
                chart.color('rgb(204, 0, 0)');
            } else if (this.result.current > this.result.warning) {
                chart.color('rgb(241, 194, 50)');
            }

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
