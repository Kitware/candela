import MetadataItem from './MetadataItem';

let DEFAULT_INTERPRETATIONS = {
  'undefined': 'categorical',
  'null': 'categorical',
  boolean: 'categorical',
  integer: 'ordinal',
  number: 'ordinal',
  date: 'categorical',
  string: 'categorical',
  object: 'categorical'
};

let ATTRIBUTE_GENERALITY = [
  'object',
  'string',
  'number',
  'integer'
];

let FILTER_STATES = {
  NO_FILTERS: 0,
  FILTERED: 1,
  EXCLUDED: 2
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
    this.model.trigger('rl:updatePage');
  }
  get page () {
    if (!this._page) {
      this.page = {
        offset: 0,
        limit: 50
      };
    }
    return this._page;
  }
  set page (value) {
    // Tentatively set the new page until we can
    // validate that the page makes sense
    this._page = value;
    this.validatePage(value);
    // Invalidate pageHistogram and currentDataPage
    delete this.cachedPromises.pageHistogram;
    delete this.cachedPromises.currentDataPage;
    this.model.trigger('rl:updatePage');
  }
  validatePage (value) {
    if (this._cachedPromises && this._cachedPromises.filteredHistogram) {
      // If we can, auto-adjust the page in case it's overshooting
      this._cachedPromises.filteredHistogram.then(filteredHistogram => {
        let maxItems = filteredHistogram.__passedFilters__[0].count;
        if (value.offset + value.limit > maxItems) {
          value.offset = maxItems - value.limit;
          value.limit = maxItems - value.offset;
        }
        value.offset = Math.max(value.offset, 0);
        let changed = value.offset !== this._page.offset || value.limit !== this._page.limit;
        this._page = value;
        if (changed) {
          this.model.trigger('rl:updatePage');
        }
      });
    }
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
          type: 'POST'
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
      this.cachedPromises.overviewHistogram = this.schema.then(schema => {
        return this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: JSON.stringify(this.model.getBinSettings(schema))
            // cache: true
          }
        }, 'rl:loadedHistogram');
      });
    }
    return this.cachedPromises.overviewHistogram;
  }
  get filteredHistogram () {
    if (!this.cachedPromises.filteredHistogram) {
      this.cachedPromises.filteredHistogram = this.schema.then(schema => {
        return this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: JSON.stringify(this.model.getBinSettings(schema)),
            filter: this.filter
            // cache: true
          }
        }, 'rl:loadedHistogram');
      });
    }
    return this.cachedPromises.filteredHistogram;
  }
  get pageHistogram () {
    if (!this.cachedPromises.pageHistogram) {
      this.cachedPromises.pageHistogram = this.schema.then(schema => {
        return this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: JSON.stringify(this.model.getBinSettings(schema)),
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
      this.cachedPromises.currentDataPage = this.schema.then(schema => {
        return this.restRequest({
          path: 'download',
          type: 'GET',
          data: {
            extraParameters: JSON.stringify({
              fileType: this.model.getMeta('format'),
              outputType: 'json',
              offset: this.page.offset,
              limit: this.page.limit
            })
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
  autoDetectAttributeInterpretation: function (schema, attrName) {
    // Go with the default interpretation for the attribute type
    return DEFAULT_INTERPRETATIONS[this.getAttributeType(schema, attrName)];
  },
  getAttributeInterpretation: function (schema, attrName) {
    let attrSpec = schema[attrName];
    if (attrSpec.interpretation) {
      // The user has specified an interpretation
      return attrSpec.interpretation;
    } else {
      // auto-detect the interpretation
      return this.autoDetectAttributeInterpretation(schema, attrName);
    }
  },
  autoDetectAttributeType: function (schema, attrName) {
    let attrSpec = schema[attrName];
    // Find the most specific type that can accomodate all the values
    let attrType = 'object';
    let count = 0;
    for (let dataType of ATTRIBUTE_GENERALITY) {
      if (dataType in attrSpec && attrSpec[dataType].count >= count) {
        attrType = dataType;
        count = attrSpec[dataType].count;
      }
    }
    // TODO: if the histograms are available, use them to infer
    // whether to jump further into booleans (e.g. everything is
    // 0/1, y/n, true/false, etc)
    return attrType;
  },
  getAttributeType: function (schema, attrName) {
    let attrSpec = schema[attrName];
    if (attrSpec.coerceToType) {
      // The user has specified a data type
      return attrSpec.coerceToType;
    } else {
      // auto-detect the data type
      return this.autoDetectAttributeType(schema, attrName);
    }
  },
  getBinSettings: function (schema) {
    let binSettings = {};
    // Assemble the parameters for how we want to see each attribute.
    // For now, other than attempting to auto-infer type and interpretation,
    // we rely on the default behavior
    Object.keys(schema).forEach(attrName => {
      binSettings[attrName] = {
        coerceToType: this.getAttributeType(schema, attrName),
        interpretation: this.getAttributeInterpretation(schema, attrName)
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
      result.attributes[attrName] = this.getAttributeType(schema, attrName);
    });
    return result;
  },
  setAttributeType: function (attrName, dataType) {
    return this.cache.schema.then(schema => {
      if (dataType === null) {
        delete schema[attrName].coerceToType;
      } else {
        schema[attrName].coerceToType = dataType;
      }
      this.setMeta('schema', schema);
      let savePromise = this.save();
      this.cache.cachedPromises = {};
      this.trigger('rl:updatedSchema');
      return savePromise;
    });
  },
  setAttributeInterpretation: function (attrName, interpretation) {
    return this.cache.schema.then(schema => {
      if (interpretation === null) {
        delete schema[attrName].interpretation;
      } else {
        schema[attrName].interpretation = interpretation;
      }
      this.setMeta('schema', schema);
      let savePromise = this.save();
      this.cache.cachedPromises = {};
      this.trigger('rl:updatedSchema');
      return savePromise;
    });
  },
  getFilteredState: function (attrName) {
    // TODO
    return FILTER_STATES.NO_FILTERS;
  },
  setPage: function (offset, limit) {
    this.cache.page = {
      offset,
      limit
    };
  },
  setOffset: function (offset) {
    this.setPage(offset, this.cache.page.limit);
  },
  setLimit: function (limit) {
    this.setPage(this.cache.page.offset, limit);
  },
  seekNext: function () {
    this.setPage(this.cache.page.offset + this.cache.page.limit,
                 this.cache.page.limit);
  },
  seekPrev: function () {
    this.setPage(this.cache.page.offset - this.cache.page.limit,
                 this.cache.page.limit);
  },
  seekFirst: function () {
    this.setPage(0, this.cache.page.limit);
  },
  seekLast: function () {
    this.cache.filteredHistogram.then(filteredHistogram => {
      let lastItem = filteredHistogram.__passedFilters__[0].count;
      this.setPage(lastItem - this.cache.page.limit,
                   this.cache.page.limit);
    });
  }
});

Dataset.DEFAULT_INTERPRETATIONS = DEFAULT_INTERPRETATIONS;
Dataset.FILTER_STATES = FILTER_STATES;
export default Dataset;
