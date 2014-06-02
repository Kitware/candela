trackerdash.views.ResultTablePane = Backbone.View.extend({
    el: '.result-table-pane',

    initialize: function (settings) {
        this.datasets = settings.dataset || [
            {'name': 'dataset0',
             'alga': {'errorPercent': '10%'},
             'sparse': {'errorPercent': '5%'},
             'ba': {'errorPercent': '4%'},
             'length': '200'},
            {'name': 'dataset1',
             'alga': {'errorPercent': '10%'},
             'sparse': {'errorPercent': '2%'},
             'ba': {'errorPercent': '40%'},
             'length': '431'},
            {'name': 'dataset2',
             'alga': {'errorPercent': '1%'},
             'sparse': {'errorPercent': '11%'},
             'ba': {'errorPercent': '15%'},
             'length': '282'},
            {'name': 'dataset3',
             'alga': {'errorPercent': '11%'},
             'sparse': {'errorPercent': '4%'},
             'ba': {'errorPercent': '1%'},
             'length': '1234'}];
        this.render();
    },

    render: function () {
        this.$el.html(jade.templates.tablePane({
            datasets: this.datasets
        }));

        this.$el.promise().done(_.bind(function () {
            _.each(this.datasets, function (dataset) {
                new trackerdash.views.ErrorBulletWidget({el: '#' + dataset.name + '-alga svg'});
                new trackerdash.views.ErrorBulletWidget({el: '#' + dataset.name + '-sparse svg'});
                new trackerdash.views.ErrorBulletWidget({el: '#' + dataset.name + '-ba svg'});
            });
        }, this));
    }

});
