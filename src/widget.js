(function ($) {

    $.fn.trackerdash = function( options ) {
        var app = new trackerdash.App(options);
        return this;
    };

}( jQuery ));
