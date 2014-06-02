trackerdash.views.InfoPane = Backbone.View.extend({
    el: '.info-pane',

    initialize: function (settings) {
        this.branch = settings.branch || 'master';
        this.day = settings.day || this.getToday();
        this.totalDatasets = settings.totalDatasets || 0;
        this.ranDistance = settings.ranDistance || 0;
        this.totalDistance = settings.totalDistance || 0;
        this.numSuccess = settings.numSuccess || 0;
        this.numBad = settings.numBad || 0;
        this.numFail = settings.numFail || 0;
        this.ranDatasets = this.numSuccess + this.numBad + this.numFail;
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
            ranDistance: this.ranDistance,
            totalDistance: this.totalDistance,
            numSuccess: this.numSuccess,
            numBad: this.numBad,
            numFail: this.numFail
        }));

        new trackerdash.views.StatusBarWidget({
            numSuccess: this.numSuccess,
            numBad: this.numBad,
            numFail: this.numFail
        });
    }
});
