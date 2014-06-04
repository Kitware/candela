trackerdash.App = Backbone.View.extend({
    el: 'body',

    initialize: function (settings) {
        this.trackData = settings;
        delete this.trackData.el;
        this.render();
    },

    render: function () {
        this.$el.html(jade.templates.layout());
        new trackerdash.views.InfoPane(this.trackData);
        new trackerdash.views.TrendPane(this.trackData);
        new trackerdash.views.ResultTablePane(this.trackData);
    }
});
