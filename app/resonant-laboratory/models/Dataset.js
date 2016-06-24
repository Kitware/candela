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
  }
  get overviewHistogram () {
    if (!this.cachedPromises.overviewHistogram) {
      this.cachedPromises.overviewHistogram = this.restRequest({
        path: 'dataset/getHistograms',
        type: 'POST',
        data: {
          binSettings: this.model.getBinSettings(),
          cache: true
        }
      }, 'rl:loadedHistogram');
    }
    return this.cachedPromises.overviewHistogram;
  }
  get filteredHistogram () {
    if (!this.cachedPromises.filteredHistogram) {
      this.cachedPromises.filteredHistogram = this.restRequest({
        path: 'dataset/getHistograms',
        type: 'POST',
        data: {
          binSettings: this.model.getBinSettings(),
          filter: this.filter,
          cache: true
        }
      }, 'rl:loadedHistogram');
    }
    return this.cachedPromises.filteredHistogram;
  }
  get pageHistogram () {
    if (!this.cachedPromises.pageHistogram) {
      this.cachedPromises.pageHistogram = this.restRequest({
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
    }
    return this.cachedPromises.pageHistogram;
  }
  get currentDataPage () {
    if (!this.cachedPromises.currentDataPage) {
      this.cachedPromises.currentDataPage = this.restRequest({
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
      promise.then(() => {
        this.model.trigger(successEvent);
      });
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
  fetch: function () {
    // Calling fetch() on a dataset may necessitate more than a
    // simple metadata update...
    let fetchPromise = MetadataItem.prototype.fetch.apply(this, arguments);
    let promiseChain = fetchPromise;

    // Is the schema out of date?
    let meta = this.getMeta();
    let girderUpdate = this.get('updated');
    // TODO: do database items update their girder 'updated' flag
    // when the database is modified? If not, we may need a deeper
    // check...
    if (!meta || !meta.lastUpdated || !girderUpdate ||
      new Date(meta.lastUpdated) < new Date(girderUpdate)) {
      // With an out-of-date schema, we should trash any cached
      // histograms, and re-run schema inference
      promiseChain = promiseChain.then(() => {
        return this.restRequest({
          path: 'dataset/inferSchema',
          type: 'POST'
        });
      });
    }

    promiseChain.then(() => {
      // Refresh the histograms and current page of data;
      // it's not a big deal if the parameters haven't changed,
      // as the most expensive bits (the overview and filtered
      // histograms) will be cached on the server
      this.cache.cachedPromises = {};

      return Promise.all([
        this.cache.overviewHistogram,
        this.cache.filteredHistogram,
        this.cache.pageHistogram,
        this.cache.currentDataPage
      ]);
    });

    return fetchPromise;
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
      Object.keys(attrSpec).forEach(dataType => {
        if (attrSpec.native === true &&
            ATTRIBUTE_GENERALITY[dataType] > ATTRIBUTE_GENERALITY[attrType]) {
          attrType = dataType;
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
