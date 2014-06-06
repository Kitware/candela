trackerdash.views.ResultTablePane = Backbone.View.extend({
    el: '.result-table-pane',

    initialize: function (settings) {
        this.results = settings.percentErrorByDataset;
        if (this.results === undefined) {
            console.error('No error percentages defined.');
        }
        this.render();
    },

    render: function () {

        _.each(this.results, function (result) {
            result.id = result.dataset.replace(".","_");
        });

        var resultsByDataset = _.groupBy(this.results, function (result) {
            return result.dataset;
        });

        this.$el.html(jade.templates.tablePane({
            resultsByDataset: resultsByDataset
        }));

        this.$el.promise().done(_.bind(function () {
            _.each(this.results, function (result) {
                new trackerdash.views.ErrorBulletWidget({
                    el: '#' + result.id + '-' + result.metric + ' svg',
                    result: result
                });
            });
        }, this));
    }

});
