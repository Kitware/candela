/*globals require, module*/

var Backbone = require('backbone'),
    d3 = require('d3');

var LOCATION_TYPES = {
    PASTED_BROWSER : 0,
    LOCAL_FILE : 1,
    PUBLIC_GIRDER : 2,
    PRIVATE_GIRDER : 3,
    LIBRARY : 4,
    EXTERNALLY_LINKED : 5
};

var DATA_TYPES = {
    BOOLEAN : 'Boolean',
    NUMBER : 'Number',
    STRING : 'String',
    DATE : 'Date',
    LIST : 'List',
    DICT : 'Dict',
    POINTER : 'Pointer',
    LAT_LON : 'Lat/Lon'
};

var Dataset = Backbone.Model.extend({
    defaults : {
        name : 'Empty dataset',
        attrs : {},
        contents : '',
        locationType : LOCATION_TYPES.PASTED_BROWSER
    },
    getData : function () {
        var self = this;
        // TODO
        return d3.csv.parse(self.get('contents'));
    },
    getFormat : function () {
        var self = this;
        // TODO
        return 'csv';
    },
    getDescription : function () {
        // TODO
    },
    getMetadata : function () {
        // TODO
    }
});

Dataset.DATA_TYPES = DATA_TYPES;
Dataset.LOCATION_TYPES = LOCATION_TYPES;
module.exports = Dataset;