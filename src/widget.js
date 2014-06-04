(function ($) {

    $.fn.trackerdash = function( options ) {
        var settings = $.extend({
            el: this.selector
        }, options );
        var app = new trackerdash.App(settings);
        return this;
    };

}( jQuery ));
