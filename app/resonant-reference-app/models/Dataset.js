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
    this.rawCache = null;
    this.parsedCache = null;
    let meta = this.getMeta();
    if (!meta.fileType) {
      this.inferFileType();
    }
    if (!meta.attributes) {
      this.inferAttributes();
    }
  },
  loadData: function (callback, cache = true) {
    // TODO: support more file formats / non-Girder
    // files (e.g. pasted browser data)
    if (cache && this.rawCache !== null) {
      callback(this.rawCache);
    } else {
      Promise.resolve(girder.restRequest({
        path: 'item/' + this.getId() + '/download',
        type: 'GET',
        error: null,
        dataType: 'text'
      })).then((data) => {
        if (cache) {
          this.rawCache = data;
        }
        callback(data);
      }).catch(() => {
        this.rawCache = null;
        callback(null);
      });
    }
  },
  getSpec: function () {
    let meta = this.getMeta();
    let spec = {
      name: this.name()
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
    if (cache && this.parsedCache !== null) {
      callback(this.parsedCache);
    } else {
      let parsedData;
      this.loadData(rawData => {
        if (rawData === null) {
          this.parsedCache = parsedData = null;
        } else {
          let meta = this.getMeta();
          let formatPrefs = {
            type: meta.fileType
          };
          if (meta.attributes) {
            formatPrefs.parse = meta.attributes;
          } else {
            formatPrefs.parse = 'auto';
          }
          
          try {
            parsedData = datalib.read(rawData, formatPrefs);
          } catch (e) {
            parsedData = null;
          }

          if (cache) {
            this.parsedCache = parsedData;
          }
        }
        callback(parsedData);
      });
    }
  },
  inferFileType: function () {
    let fileType = this.get('name');
    if (fileType === undefined || fileType.indexOf('.') === -1) {
      fileType = 'txt';
    } else {
      fileType = fileType.split('.');
      fileType = fileType[fileType.length - 1];
    }
    this.setMeta('fileType', fileType);
    this.save().then(() => {
      this.trigger('rra:changeType');
    });
  },
  setFileType: function (fileType) {
    this.setMeta('fileType', fileType);
    this.save().then(() => {
      this.trigger('rra:changeType');
    });
  },
  inferAttributes: function () {
    this.getParsed(data => {
      if (data === null) {
        this.setMeta('attributes', {});
      } else {
        this.setMeta('attributes', datalib.type.all(data));
      }
      this.save().then(() => {
        this.trigger('rra:changeSpec')
      });
    });
  },
  setAttribute: function (attrName, dataType) {
    let attributes = this.getMeta('attributes');
    attributes[attrName] = dataType;
    this.setMeta('attributes', attributes);
    this.save().then(() => {
      this.trigger('rra:changeSpec')
    });
  }
});

Dataset.COMPATIBLE_TYPES = COMPATIBLE_TYPES;
Dataset.VALID_EXTENSIONS = VALID_EXTENSIONS;
Dataset.Collection = Backbone.Collection.extend({
  model: Dataset
});
export default Dataset;
