import MetadataItem from './MetadataItem';
import datalib from 'datalib';
import dictCompare from '../shims/dictCompare.js';

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
    window.mainPage.loadedDatasets[this.getId()] = this;

    this.rawCache = null;
    this.parsedCache = null;
    let meta = this.getMeta();

    this.listenTo(this, 'rl:swapId', this.swapId);

    let fileTypePromise;
    if (meta.fileType) {
      fileTypePromise = Promise.resolve(meta.fileType);
    } else {
      fileTypePromise = this.inferFileType();
    }

    let attributePromise;
    if (meta.attributes) {
      attributePromise = Promise.resolve(meta.attributes);
    } else {
      attributePromise = this.inferAttributes();
    }

    let prevFileType = this.getMeta('fileType');
    let prevAttributes = this.getMeta('attributes');

    Promise.all([fileTypePromise, attributePromise]).then(() => {
      // Don't call save() if nothing changed
      if (this.getMeta('fileType') !== prevFileType ||
          !dictCompare(this.getMeta('attributes'), prevAttributes)) {
        this.save().then(() => {
          this.trigger('rl:changeType');
          this.trigger('rl:changeSpec');
        }).catch(errorObj => {
          throw errorObj;
        });
      }
    });
  },
  swapId: function (newData) {
    window.mainPage.loadedDatasets[newData._id] = window.mainPage.loadedDatasets[newData._oldId];
    delete window.mainPage.loadedDatasets[newData._oldId];
    window.mainPage.loadedDatasets[newData._id].set(newData);
  },
  drop: function () {
    this.dropped = true;
    this.stopListening();
    delete window.mainPage.loadedDatasets[this.getId()];
  },
  save: function () {
    // It's possible for a dataset to be dropped from a collection
    // (e.g. it's replaced with a copy). In this case, we want to
    // stop all future attempts to save any changes to the dropped
    // dataset)
    if (this.dropped) {
      return Promise.resolve();
    } else {
      return MetadataItem.prototype.save.apply(this).catch(this.saveFailure);
    }
  },
  saveFailure: function (errorObj) {
    window.mainPage.trigger('rl:error', errorObj);
  },
  loadData: function (cache = true) {
    // TODO: support more file formats / non-Girder
    // files (e.g. pasted browser data)
    if (cache && this.rawCache !== null) {
      return Promise.resolve(this.rawCache);
    } else {
      const cacheData = data => this.rawCache = data;

      const databaseQuery = girder.restRequest({
        path: `item/${this.getId()}/database/select`,
        type: 'GET',
        dataType: 'json'
      });

      return databaseQuery.then(resp => {
        return JSON.stringify(resp.data);
      }, () => {
        console.log('hello');
        return girder.restRequest({
          path: 'item/' + this.getId() + '/download',
          type: 'GET',
          error: null,
          dataType: 'text'
        });
      })
      .then(cacheData, () => this.rawCache = null);
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
  parse: function (cache = true) {
    if (cache && this.parsedCache !== null) {
      return Promise.resolve(this.parsedCache);
    } else {
      let parsedData;
      return this.loadData().then(rawData => {
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
        return parsedData;
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
    return fileType;
  },
  setFileType: function (fileType) {
    this.setMeta('fileType', fileType);
    return this.save().then(() => {
      this.trigger('rl:changeType');
    });
  },
  inferAttributes: function () {
    return this.parse().then(data => {
      let attributes;
      if (data === null) {
        attributes = {};
      } else {
        attributes = datalib.type.all(data);
      }
      this.setMeta('attributes', attributes);
      return attributes;
    });
  },
  setAttribute: function (attrName, dataType) {
    let attributes = this.getMeta('attributes');
    attributes[attrName] = dataType;
    this.setMeta('attributes', attributes);
    return this.save().then(() => {
      this.trigger('rl:changeSpec');
    });
  }
});

Dataset.COMPATIBLE_TYPES = COMPATIBLE_TYPES;
Dataset.VALID_EXTENSIONS = VALID_EXTENSIONS;
export default Dataset;
