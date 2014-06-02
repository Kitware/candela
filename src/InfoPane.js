trackerdash.views.InfoPane = Backbone.View.extend({
    el: '.info-pane',

    initialize: function (settings) {
        this.branch = settings.branch || 'master';
        this.day = settings.day || this.getToday();
        this.totalDatasets = settings.totalDatasets || 0;
        this.ranTracks = settings.ranTracks || 0;
        this.totalTracks = settings.totalTracks || 0;
        this.success = settings.success || 0;
        this.bad = settings.bad || 0;
        this.fail = settings.fail || 0;
        this.ranDatasets = this.success + this.bad + this.fail;
        this.render();
    },

    getToday: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd<10) {
            dd='0'+dd;
        }

        if(mm<10) {
            mm='0'+mm;
        }

        return yyyy + '/' + mm + '/' + dd;
    },

    render: function () {
        this.$el.html(jade.templates.infoPane({
            branch: this.branch,
            day: this.day,
            ranDatasets: this.ranDatasets,
            totalDatasets: this.totalDatasets,
            ranTracks: this.ranTracks,
            totalTracks: this.totalTracks,
            success: this.success,
            bad: this.bad,
            fail: this.fail
        }));

        new trackerdash.views.StatusBarWidget({});
    }
});
