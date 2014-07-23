trackerdash.views.ResultTablePane = Backbone.View.extend({
    el: '.result-table-pane',

    initialize: function (settings) {
        this.results = settings.percentErrorByDataset;
        this.datasetMap = settings.datasetMap || {};
        this.trajectoryMap = settings.trajectoryMap || {};
        if (this.results === undefined) {
            console.error('No error percentages defined.');
        }
        this.render();
    },

    render: function () {

        // dots in names confound css selectors
        _.each(this.results, _.bind(function (result) {
            result.id = result.dataset.replace(/\./g, "_");
            this.datasetMap[result.id] = this.datasetMap[result.dataset];
            this.trajectoryMap[result.id] = this.trajectoryMap[result.dataset];
        }, this));

        var resultsByDatasetId = _.groupBy(this.results, function (result) {
            return result.id;
        });

        this.$el.html(jade.templates.tablePane({
            resultsByDatasetId: resultsByDatasetId,
            datasetMap: this.datasetMap,
            trajectoryMap: this.trajectoryMap
        }));

        this.$el.promise().done(_.bind(function () {

            _.each(this.results, function (result) {

                var resultDivSelector = '#' + result.id + '-' + result.metric;
                // change color of circle
                if (result.current > result.fail) {
                  $(resultDivSelector + ' svg.statusDot').find('circle')
                    .attr('class', 'fail');
                } else if (result.current > result.warning) {
                  $(resultDivSelector + ' svg.statusDot').find('circle')
                    .attr('class', 'bad');
                }

                // render bullets
                new trackerdash.views.ErrorBulletWidget({
                    el: resultDivSelector + ' svg.bullet',
                    result: result
                });

                // activate callback for bullet if specified
                if (typeof(result.callback) === 'function') {
                  $(resultDivSelector)
                    .css('cursor', 'pointer')
                    .click(result.callback);
                }
            });

            _.each(this.datasetMap, function (value, key) {
                if (typeof(value) === 'function') {
                    $('#' + key + '-link').click(value);
                }
            });

            _.each(this.trajectoryMap, function (value, key) {
                if (typeof(value) === 'function') {
                    $('#' + key + '-trajectory-link').click(value);
                }
            });

        }, this));
    }

});
