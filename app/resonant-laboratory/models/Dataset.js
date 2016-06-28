import MetadataItem from './MetadataItem';

let DEFAULT_INTERPRETATIONS = {
  'undefined': 'ignore',
  'null': 'ignore',
  boolean: 'categorical',
  integer: 'ordinal',
  number: 'ordinal',
  date: 'categorical',
  string: 'categorical',
  object: 'ignore'
};

let ATTRIBUTE_GENERALITY = {
  'undefined': 0,
  'null': 1,
  'boolean': 2,
  'date': 2,
  'integer': 3,
  'number': 4,
  'string': 5,
  'object': 6
};

class DatasetCache {
  constructor (model) {
    this.model = model;
  }
  get cachedPromises () {
    if (!this._cachedPromises) {
      this._cachedPromises = {};
    }
    return this._cachedPromises;
  }
  set cachedPromises (value) {
    this._cachedPromises = value;
  }
  get filter () {
    if (!this._filter) {
      this._filter = {};
    }
    return this._filter;
  }
  set filter (value) {
    this._filter = value;
    // Invalidate filteredHistogram, pageHistogram, and currentDataPage
    delete this.cachedPromises.filteredHistogram;
    delete this.cachedPromises.pageHistogram;
    delete this.cachedPromises.currentDataPage;
    this.model.trigger('rl:invalidatedHistograms');
  }
  get page () {
    if (!this._page) {
      this._page = {
        offset: 0,
        limit: 50
      };
    }
    return this._page;
  }
  set page (value) {
    this._page = value;
    // Invalidate pageHistogram and currentDataPage
    delete this.cachedPromises.pageHistogram;
    delete this.cachedPromises.currentDataPage;
    this.model.trigger('rl:invalidatedHistograms');
  }
  get schema () {
    // Do we have the schema already in our metadata,
    // and TODO: is it current (check the file's updated flag
    // in girder, or check the last time the mongodb was modified)
    /* let meta = this.model.getMeta();
    let girderUpdate = this.model.get('updated');
    if (!meta || !meta.lastUpdated || !girderUpdate ||
      new Date(meta.lastUpdated) < new Date(girderUpdate)) {
      // With an out-of-date schema, we should trash any cached
      // histograms, and re-run schema inference
      delete meta['schema'];
      delete this.cachedPromises.schema;
    }*/

    if (!this.cachedPromises.schema) {
      let metaSchema = this.model.getMeta('schema');
      if (metaSchema) {
        // We already have up-to-date schema information in the metadata
        this.cachedPromises.schema = Promise.resolve(metaSchema);
      } else {
        // Actually hit the endpoint that does a pass to infer
        // the (potentially new) schema. This invalidates any histograms
        // or data that we have
        this.cachedPromises = {};
        this.cachedPromises.schema = this.restRequest({
          path: 'dataset/inferSchema',
          type: 'POST',
          data: {
            binSettings: this.model.getBinSettings(),
            cache: true
          }
        });

        // Store the new schema, the time that we updated it,
        // and save those changes
        this.cachedPromises.schema.then(newSchema => {
          this.model.setMeta('lastUpdated', new Date());
          return this.model.save();
          // Technically, we could / will get this from
          // a fetch, but a separate call would be a little redundant
          // this.model.setMeta('schema', newSchema);
        }).then(() => {
          this.model.trigger('rl:updatedSchema');
        });
      }
    }
    return this.cachedPromises.schema;
  }
  get overviewHistogram () {
    if (!this.cachedPromises.overviewHistogram) {
      this.cachedPromises.overviewHistogram = this.cachedPromises.schema.then(() => {
        return this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: this.model.getBinSettings(),
            cache: true
          }
        }, 'rl:loadedHistogram');
      });
    }
    return this.cachedPromises.overviewHistogram;
  }
  get filteredHistogram () {
    if (!this.cachedPromises.filteredHistogram) {
      this.cachedPromises.filteredHistogram = this.cachedPromises.schema.then(() => {
        return this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: this.model.getBinSettings(),
            filter: this.filter,
            cache: true
          }
        }, 'rl:loadedHistogram');
      });
    }
    return this.cachedPromises.filteredHistogram;
  }
  get pageHistogram () {
    if (!this.cachedPromises.pageHistogram) {
      this.cachedPromises.pageHistogram = this.cachedPromises.schema.then(() => {
        return this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: this.model.getBinSettings(),
            filter: this.filter,
            limit: this.page.limit,
            offset: this.page.offset
            // Don't cache the page histograms on the server
          }
        }, 'rl:loadedHistogram');
      });
    }
    return this.cachedPromises.pageHistogram;
  }
  get currentDataPage () {
    if (!this.cachedPromises.currentDataPage) {
      this.cachedPromises.currentDataPage = this.cachedPromises.schema.then(() => {
        return this.restRequest({
          path: 'dataset/getData',
          type: 'GET',
          data: {
            filter: this.filter,
            limit: this.page.limit,
            offset: this.page.offset
            // TODO: optimization: supply the fields option based on which
            // fields are actually in use in the visualization
          }
        }, 'rl:loadedData');
      });
    }
    return this.cachedPromises.currentDataPage;
  }
  restRequest (parameters, successEvent) {
    if (!this.model.getId()) {
      // We still haven't synced our basic info with the
      // server yet... so leave the value as null
      return null;
    } else {
      let promise = this.model.restRequest(parameters);
      if (successEvent) {
        promise.then(() => {
          this.model.trigger(successEvent);
        });
      }
      return promise;
    }
  }
}

let Dataset = MetadataItem.extend({
  initialize: function () {
    // Backbone.extend doesn't respect
    // getters and setters, so we split
    // all the cached information out into
    // its own non-Backbone cache class
    this.cache = new DatasetCache(this);
    this.dropped = false;
  },
  save: function () {
    // It's possible for a dataset to be dropped from the project
    // but someone is still hanging on to a reference to this
    // object. In this case, we want to prevent any future
    // attempts to save any changes
    if (this.dropped) {
      return Promise.resolve();
    } else {
      return MetadataItem.prototype.save.apply(this);
    }
  },
  inferAttributeInterpretation: function (attrName) {
    let attrSpec = this.getMeta('schema')[attrName];
    if (attrSpec.interpretation) {
      // The user has specified an interpretation
      return attrSpec.interpretation;
    } else {
      // Go with the default interpretation for the attribute type
      return DEFAULT_INTERPRETATIONS[this.inferAttributeType(attrName)];
    }
  },
  inferAttributeType: function (attrName) {
    let attrSpec = this.getMeta('schema')[attrName];
    if (attrSpec.coerceToType) {
      // The user has specified a data type
      return attrSpec.coerceToType;
    } else {
      // The user hasn't specified a type; go with the
      // most frequently observed native type in the dataset
      let attrType = 'undefined';
      let encounteredNative = false;
      Object.keys(attrSpec).forEach(dataType => {
        if (encounteredNative === false && attrSpec[dataType].native === true) {
          // No matter what, keep a native value over a non-native one
          attrType = dataType;
          encounteredNative = true;
        }
        if (ATTRIBUTE_GENERALITY[dataType] > ATTRIBUTE_GENERALITY[attrType]) {
          // Update if we haven't encountered a native value, or if
          // this type is also native
          if (encounteredNative === false || attrSpec[dataType].native === true) {
            attrType = dataType;
          }
        }
      });
      return attrType;
    }
  },
  getBinSettings: function (ignoreFilters) {
    let binSettings = {};
    let schema = this.getMeta('schema') || {};
    // Assemble the parameters for how we want to see each attribute.
    // For now, other than attempting to auto-infer type and interpretation,
    // we rely on the default behavior
    Object.keys(schema).forEach(attrName => {
      binSettings[attrName] = {
        coerceToType: this.inferAttributeType(attrName),
        interpretation: this.inferAttributeInterpretation(attrName)
      };
    });
    return binSettings;
  },
  getTypeSpec: function () {
    let schema = this.getMeta('schema') || {};
    let result = {
      name: this.get('name'),
      attributes: {}
    };
    Object.keys(schema).forEach(attrName => {
      result.attributes[attrName] = this.inferAttributeType(attrName);
    });
    return result;
  },
  setAttributeType: function (attrName, dataType) {
    let schema = this.getMeta('schema');
    schema[attrName].coerceToType = dataType;
    this.setMeta('schema', schema);

    return this.save();
  },
  setAttributeInterpretation: function (attrName, interpretation) {
    let schema = this.getMeta('schema');
    schema[attrName].interpretation = interpretation;
    this.setMeta('schema', schema);

    return this.save();
  }
});

Dataset.DEFAULT_INTERPRETATIONS = DEFAULT_INTERPRETATIONS;
export default Dataset;
