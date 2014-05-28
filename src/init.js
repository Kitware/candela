/*
 * Some cross-browser globals
 */
if (!window.console) {
    var console = {
        log: function () {},
        error: function () {}
    };
}

// This script must be invoked first to declare the girder namespace
var trackerdash = {
    models: {},
    collections: {},
    views: {}
};
