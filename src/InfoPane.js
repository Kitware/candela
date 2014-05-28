trackerdash.views.InfoPane = Backbone.View.extend({
    el: '.info-pane',

    initialize: function (settings) {
        this.branch = settings.branch || 'master';
        this.ranDatasets = settings.ranDatasets || 0;
        this.totalDatasets = settings.totalDatasets || 0;
        this.ranTracks = settings.ranTracks || 0;
        this.totalTracks = settings.totalTracks || 0;
        this.render();
    },

    render: function () {
        this.$el.html(jade.templates.infoPane({
            branch: this.branch,
            ranDatasets: this.ranDatasets,
            totalDatasets: this.totalDatasets,
            ranTracks: this.ranTracks,
            totalTracks: this.totalTracks
        }));
    }
});
