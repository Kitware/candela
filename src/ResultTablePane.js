trackerdash.views.ResultTablePane = Backbone.View.extend({
    el: '.result-table-pane',

    initialize: function (settings) {
        this.results = settings.percentErrorByDataset;
        this.datasetMap = settings.datasetMap;
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
        }, this));

        var resultsByDatasetId = _.groupBy(this.results, function (result) {
            return result.id;
        });

        this.$el.html(jade.templates.tablePane({
            resultsByDatasetId: resultsByDatasetId,
            datasetMap: this.datasetMap
        }));

        this.$el.promise().done(_.bind(function () {

            _.each(this.results, function (result) {

                // render bullets
                new trackerdash.views.ErrorBulletWidget({
                    el: '#' + result.id + '-' + result.metric + ' svg',
                    result: result
                });

                // activate callback for bullet if specified
                if (typeof(result.callback) === 'function') {
                  $('#' + result.id + '-' + result.metric)
                    .css('cursor', 'pointer')
                    .click(result.callback);
                }
            });

            _.each(this.datasetMap, function (value, key) {
                if (typeof(value) === 'function') {
                    $('#' + key + '-link').click(value);
                }
            });

        }, this));
    }

});
