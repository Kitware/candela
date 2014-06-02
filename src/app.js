trackerdash.App = Backbone.View.extend({
    el: 'body',

    initialize: function (settings) {
        this.render();

        Backbone.history.start({
            pushState: false
        });
    },

    render: function () {
        this.$el.html(jade.templates.layout());
        new trackerdash.views.InfoPane({});
        new trackerdash.views.TrendPane({});
        new trackerdash.views.ResultTablePane({});
    }
});
