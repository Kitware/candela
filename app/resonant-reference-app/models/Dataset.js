import Backbone from 'backbone';
import MetadataItem from './MetadataItem';
import datalib from 'datalib';

let girder = window.girder;

let COMPATIBLE_TYPES = {
  boolean: ['boolean'],
  integer: ['integer', 'boolean'],
  number: ['number', 'integer', 'boolean'],
  date: ['date'],
  string: ['string', 'date', 'number', 'integer', 'boolean'],
  'string_list': ['string_list']
};

let VALID_EXTENSIONS = [
  'csv',
  'tsv',
  'json'
];

let Dataset = MetadataItem.extend({
  initialize: function () {
    let self = this;
    self.rawCache = null;
    self.parsedCache = null;
    let meta = this.getMeta();
    if (!meta.fileType) {
      self.inferFileType();
    }
    if (!meta.attributes) {
      self.inferAttributes();
    }
  },
  loadData: function (callback, cache = true) {
    let self = this;
    // TODO: support more file formats / non-Girder
    // files (e.g. pasted browser data)
    if (cache && self.rawCache !== null) {
      callback(self.rawCache);
    } else {
      girder.restRequest({
        path: 'item/' + self.id + '/download',
        type: 'GET',
        error: null,
        dataType: 'text'
      }).done(function (data) {
        if (cache) {
          self.rawCache = data;
        }
        callback(data);
      });
    }
  },
  getSpec: function () {
    let self = this;
    let meta = self.getMeta();
    let spec = {
      name: self.name()
    };
    if (!meta.attributes) {
      // We haven't inferred the attributes yet...
      spec.attributes = {};
    } else {
      spec.attributes = meta.attributes;
    }
    return spec;
  },
  getParsed: function (callback, cache = true) {
    let self = this;
    if (cache && self.parsedCache !== null) {
      callback(self.parsedCache);
    } else {
      self.loadData(function (rawData) {
        let meta = self.getMeta();
        let formatPrefs = {
          type: meta.fileType
        };
        if (meta.attributes) {
          formatPrefs.parse = meta.attributes;
        } else {
          formatPrefs.parse = 'auto';
        }
        let parsedData;

        try {
          parsedData = datalib.read(rawData, formatPrefs);
        } catch (e) {
          parsedData = null;
        }

        if (cache) {
          self.parsedCache = parsedData;
        }
        callback(parsedData);
      });
    }
  },
  inferFileType: function () {
    let self = this;
    let fileType = self.get('name');
    if (fileType === undefined || fileType.indexOf('.') === -1) {
      fileType = 'txt';
    } else {
      fileType = fileType.split('.');
      fileType = fileType[fileType.length - 1];
    }
    self.setMeta('fileType', fileType);
    self.save();
  },
  inferAttributes: function () {
    let self = this;
    self.getParsed(function (data) {
      if (data === null) {
        self.setMeta('attributes', {});
      } else {
        self.setMeta('attributes', datalib.type.all(data));
      }
      self.save();
      self.trigger('rra:changeSpec');
    });
  },
  setAttribute: function (attrName, dataType) {
    let self = this;
    let attributes = self.getMeta('attributes');
    attributes[attrName] = dataType;
    self.setMeta('attributes', attributes);
    self.save();
    self.trigger('rra:changeSpec');
  }
});

Dataset.COMPATIBLE_TYPES = COMPATIBLE_TYPES;
Dataset.VALID_EXTENSIONS = VALID_EXTENSIONS;
Dataset.Collection = Backbone.Collection.extend({
  model: Dataset
});
export default Dataset;
