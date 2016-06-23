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

let Dataset = MetadataItem.extend({
  initialize: function (filter, page) {
    this.cache = null;
    this.overviewHistogram = null;
    this.filteredHistogram = null;
    this.pageHistogram = null;
    this.dropped = false;
    this.filter = filter || {};
    this.page = page || {
      offset: 0,
      limit: 50
    };
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

    // Issue calls to get (or retrieve the cached) overview
    // histogram, filtered histogram, and page histogram
    this.overviewHistogram = null;
    this.filteredHistogram = null;
    this.pageHistogram = null;
    // Finally, cache the current page
    this.cache = null;

    let binSettings = this.getBinSettings();

    promiseChain.then(() => {
      return Promise.all([
        this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: binSettings,
            cache: true
          }
        }),
        this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: binSettings,
            filter: this.filter,
            cache: true
          }
        }),
        this.restRequest({
          path: 'dataset/getHistograms',
          type: 'POST',
          data: {
            binSettings: binSettings,
            filter: this.filter,
            limit: this.page.limit,
            offset: this.page.offset
          }
        }),
        this.restRequest({
          path: 'dataset/getData',
          type: 'GET',
          data: {
            binSettings: binSettings,
            filter: this.filter,
            limit: this.page.limit,
            offset: this.page.offset
            // TODO: supply the fields option based on which
            // fields are actually in use in the visualization
          }
        })
      ]).then(results => {
        this.overviewHistogram = results[0];
        this.filteredHistogram = results[1];
        this.pageHistogram = results[2];
        this.cache = results[3];
        this.trigger('rl:loadedData');
      });
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
      return DEFAULT_INTERPRETATIONS[this.inferAttributeType(attrSpec)];
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
      for (let dataType of Object.keys(attrSpec.stats)) {
        if (attrSpec.native === true &&
            ATTRIBUTE_GENERALITY[dataType] > ATTRIBUTE_GENERALITY[attrType]) {
          attrType = dataType;
        }
      }
      return attrType;
    }
  },
  getBinSettings: function (ignoreFilters) {
    let binSettings = {};
    let schema = this.getMeta('schema');
    // Assemble the parameters for how we want to see each attribute.
    // For now, other than attempting to auto-infer type and interpretation,
    // we rely on the default behavior
    for (let attrName of Object.keys(schema)) {
      binSettings[attrName] = {
        coerceToType: this.inferAttributeType(attrName),
        interpretation: this.inferAttributeInterpretation(attrName)
      };
    }
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
