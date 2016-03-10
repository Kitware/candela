import datalib from 'datalib';

let girder = window.girder;

let COMPATIBLE_TYPES = {
  boolean: ['boolean'],
  integer: ['integer', 'boolean'],
  number: ['number', 'integer', 'boolean'],
  date: ['date'],
  string: ['string', 'date', 'number', 'integer', 'boolean']
};

let Dataset = girder.models.ItemModel.extend({
  initialize: function () {
    let self = this;
    self.rawCache = null;
    self.parsedCache = null;
    let meta = this.get('meta');
    if (!meta) {
      meta = {};
      self.set('meta', meta);
    }
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
        path: 'api/v1/item/' + self.id + '/download',
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
    let meta = self.get('meta');
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
        let meta = self.get('meta');
        let formatPrefs = {
          type: meta.fileType
        };
        if (meta.attributes) {
          formatPrefs.parse = meta.attributes;
        } else {
          formatPrefs.parse = 'auto';
        }
        let parsedData = datalib.read(rawData, formatPrefs);
        if (cache) {
          self.parsedCache = parsedData;
        }
        callback(parsedData);
      });
    }
  },
  inferFileType: function () {
    let self = this;
    let fileType = self.name();
    fileType = fileType.split('.');
    fileType = fileType[fileType.length - 1];
    let meta = self.get('meta');
    meta.fileType = fileType;
    this.set('meta', meta);
  },
  inferAttributes: function () {
    let self = this;
    self.getParsed(function (data) {
      let meta = self.get('meta');
      meta.attributes = datalib.type.all(data);
      self.set('meta', meta);
      self.trigger('rra:changeSpec');
    });
  },
  reshapeForVis: function (callback, mapping) {
    // let meta = this.get('meta');
    
    // TODO: use the mapping to transform
    // the parsed data into the shape that
    // the visualization expects
  }
});

Dataset.COMPATIBLE_TYPES = COMPATIBLE_TYPES;
export default Dataset;
