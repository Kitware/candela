/*globals require, module*/

var Backbone = require('backbone');

var Visualization = Backbone.Model.extend({
    defaults : {
        name : 'Error: this model is abstract',
        attrs : {}
    }
});

module.exports = Visualization;