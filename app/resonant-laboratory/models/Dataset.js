import MetadataItem from './MetadataItem';

let girder = window.girder;

let DEFAULT_INTERPRETATIONS = {
  'undefined': 'ignore',
  boolean: 'categorical',
  integer: 'quantitative',
  number: 'quantitative',
  date: 'categorical',
  string: 'categorical',
  object: 'ignore'
};

let BIN_COUNT = 10;

function DuplicateDatasetError (message) {
  this.name = 'DuplicateDatasetError';
  this.message = message;
  this.stack = (new Error()).stack;
}
DuplicateDatasetError.prototype = Object.create(Error.prototype);

let Dataset = MetadataItem.extend({
  initialize: function () {
    if (window.mainPage.loadedDatasets[this.getId()]) {
      throw new DuplicateDatasetError();
    }
    window.mainPage.loadedDatasets[this.getId()] = this;

    // If any of this initialization stuff ends up
    // saving a copy of this item, we'll get our
    // id swapped from under us...
    this.listenTo(this, 'rl:swapId', this.swapId);

    this.rawCache = null;
    this.parsedCache = null;
    let meta = this.getMeta();

    let schemaPromise;

    let girderUpdate = this.get('updated');
    // TODO: do database items update their girder 'updated' flag
    // when the database is modified? If not, we may need a deeper
    // check...
    if (meta.schema && meta.last_updated && girderUpdate &&
      new Date(meta.last_updated) >= new Date(girderUpdate)) {
      // We can just use the cached schema
      schemaPromise = Promise.resolve(meta.schema);
    } else {
      // We need to run schema inference...
      schemaPromise = this.inferSchema();
    }

    schemaPromise.then(schema => {
      // Now that we know the schema, if we have filters,
      // we should validate and reapply them
      return this.setFilters(meta.filters);
    }).then();
  },
  getAttributeInterpretation: function (attrSpec) {
    if (attrSpec.interpretation) {
      // The user has specified an interpretation
      return attrSpec.interpretation;
    } else {
      // Go with the default interpretation for the attribute type
      return DEFAULT_INTERPRETATIONS[this.getAttributeType(attrSpec)];
    }
  },
  getAttributeType: function (attrSpec) {
    if (attrSpec.coerce_to_type) {
      // The user has specified a data type
      return attrSpec.coerce_to_type;
    } else {
      // The user hasn't specified a type; go with the
      // most frequently observed type in the dataset
      let maxCount = 0;
      let attrType = 'undefined';
      for (let dataType of Object.keys(attrSpec.stats)) {
        if (attrSpec.stats[dataType].count >= maxCount) {
          maxCount = attrSpec.stats[dataType].count;
          attrType = dataType;
        }
      }
      return attrType;
    }
  },
  getCategoricalAttributes: function (includeExcluded = false) {
    let schema = this.getMeta('schema');
    let excludeAttributes = this.getMeta('exclude_attributes') || [];
    let attrs = [];
    for (let attrName of Object.keys(schema)) {
      if (!includeExcluded && excludeAttributes.indexOf(attrName) !== -1) {
        continue;
      }
      let attrSpec = schema[attrName];
      if (this.getAttributeInterpretation(attrSpec) === 'categorical') {
        attrs.push(attrName);
      }
    }
    return attrs;
  },
  getQuantitativeAttributes: function (includeExcluded = false) {
    let schema = this.getMeta('schema');
    let excludeAttributes = this.getMeta('exclude_attributes') || [];
    let attrs = {};
    for (let attrName of Object.keys(schema)) {
      if (!includeExcluded && excludeAttributes.indexOf(attrName) !== -1) {
        continue;
      }
      let attrSpec = schema[attrName];
      if (this.getAttributeInterpretation(attrSpec) === 'quantitative') {
        // Our schema should tell us the lowest / highest values
        // for this attribute as a number or as a string...
        // TODO: also do coercion on the server?
        if (!attrSpec.stats.number && !attrSpec.stats.string) {
          // Even though we want to interpret this value as
          // quantitative, we can't (yet) figure out how
          // to ask for min and max values...
          continue;
        }
        let result = {
          binCount: BIN_COUNT
        };
        let desiredType = this.getAttributeType(attrSpec);
        if (attrSpec.stats.number) {
          result.min = this.coerceValue(attrSpec.stats.number.min, desiredType);
          result.max = this.coerceValue(attrSpec.stats.number.max, desiredType);
        }
        if (attrSpec.stats.string) {
          let lowString = this.coerceValue(attrSpec.stats.number.min, desiredType);
          let highString = this.coerceValue(attrSpec.stats.number.max, desiredType);
          if (!attrSpec.stats.number) {
            result.min = lowString;
            result.max = highString;
          } else {
            result.min = lowString < result.min ? lowString : result.min;
            result.max = highString > result.max ? highString : result.max;
          }
        }
        attrs[attrName] = result;
      }
    }
    return attrs;
  },
  getSpec: function (includeExcluded = false) {
    let schema = this.getMeta('schema') || {};
    let excludeAttributes = this.getMeta('exclude_attributes') || [];
    let spec = {
      name: this.name(),
      attributes: {}
    };
    for (let attrName of Object.keys(schema)) {
      if (!includeExcluded && excludeAttributes.indexOf(attrName) !== -1) {
        continue;
      }
      spec.attributes[attrName] = this.getAttributeType(schema[attrName]);
    }
    return spec;
  },
  getHistogram: function (filters) {
    let parameters = {
      categoricalAttrs: this.getCategoricalAttributes(true).join(','),
      quantitativeAttrs: JSON.stringify(this.getQuantitativeAttributes(true)),
      filters: filters
    };
    return new Promise((resolve, reject) => {
      girder.restRequest({
        path: 'item/' + this.getId() + '/getHistograms',
        type: 'GET',
        data: parameters,
        error: reject,
        dataType: 'json'
      }).done(resolve).error(reject);
    });
  },
  setFilters: function (filters) {
    if (filters) {
      this.setMeta('filters', filters);
      // TODO: validate that the filters make sense in terms of the schema

      // With the new filters, update the histogram
      return this.getHistogram(filters).then((histogram) => {
        this.set('cached_histogram', histogram);
        this.trigger('rl:updateFilters');
        return this.save();
      });
    } else {
      // We want to clear the filters...
      this.unsetMeta('filters');
      // The cached_histogram is the same as the summary histogram
      this.setMeta('cached_histogram', this.getMeta('summary_histogram'));
      this.trigger('rl:updateFilters');
      return this.save();
    }
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
      return MetadataItem.prototype.save.apply(this).catch(errorObj => {
        window.mainPage.trigger('rl:error', errorObj);
      });
    }
  },
  loadData: function (cache = true) {
    // TODO: support more file formats / non-Girder
    // files (e.g. pasted browser data)
    if (cache && this.rawCache !== null) {
      return Promise.resolve(this.rawCache);
    } else {
      let parameters = {
        format: 'dict',
        filters: this.getMeta('filters'),
        fields: Object.keys(this.getSpec().attributes)
      };
      return new Promise((resolve, reject) => {
        girder.restRequest({
          path: `item/${this.getId()}/filterData`,
          type: 'GET',
          dataType: 'text',
          error: reject,
          data: parameters
        }).done(resolve).error(reject);
      }).then(data => {
        this.rawCache = data;
      }).catch((e) => {
        window.mainPage.trigger('rl:error', e);
      });
    }
  },
  coerceValue: function (value, dataType) {
    if (dataType === 'undefined') {
      return undefined;
    } else if (dataType === 'boolean') {
      return !!value;
    } else if (dataType === 'integer') {
      return parseInt(String(value).replace(/[^0-9\.]+/g, ''));
    } else if (dataType === 'number') {
      return parseFloat(String(value).replace(/[^0-9\.]+/g, ''));
    } else if (dataType === 'date') {
      return new Date(value);
    } else if (dataType === 'string') {
      return String(value);
    } else if (dataType === 'object') {
      // TODO: should I be doing something else?
      return value;
    } else {
      throw new Error('Unknown data type: ' + dataType);
    }
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
          let schema = this.getMeta('schema');

          try {
            parsedData = JSON.parse(rawData);
            // If that was successful, we can pretty-print the raw data...
            this.rawCache = JSON.stringify(parsedData, null, '  ');

            // Okay, now we need to coerce data types...
            parsedData.forEach(dataItem => {
              for (let attrName of Object.keys(dataItem)) {
                let dataType = this.getAttributeType(schema[attrName]);
                dataItem[attrName] = this.coerceValue(dataItem[attrName], dataType);
              }
            });
          } catch (e) {
            parsedData = null;
            if (!(e instanceof SyntaxError)) {
              window.mainPage.trigger('rl:error', e);
            }
          }

          if (cache) {
            this.parsedCache = parsedData;
          }
        }
        return parsedData;
      });
    }
  },
  inferSchema: function () {
    return new Promise((resolve, reject) => {
      girder.restRequest({
        path: `item/${this.getId()}/inferSchema`,
        type: 'GET',
        dataType: 'json',
        error: reject
      }).done(resolve).error(reject);
    }).then(stats => {
      // Keep any user preferences for attributes
      // (e.g. forced types / interpretations / excluded attributes)
      let existingSchema = this.getMeta('schema') || {};
      let excludedAttributes = this.getMeta('exclude_attributes') || [];
      let newSchema = {};
      let excludeAttributes = [];
      for (let attrName of Object.keys(stats)) {
        newSchema[attrName] = {
          stats: stats[attrName]
        };
        if (excludedAttributes.indexOf(attrName) !== -1) {
          excludeAttributes.push(attrName);
        }
        if (existingSchema[attrName]) {
          if (existingSchema[attrName].coerce_to_type) {
            newSchema[attrName].coerce_to_type = existingSchema[attrName].coerce_to_type;
          }
          if (existingSchema[attrName].interpretation) {
            newSchema[attrName].interpretation = existingSchema[attrName].interpretation;
          }
        }
      }
      // Store the new schema
      this.setMeta('schema', newSchema);
      // Store the new exclude_attributes
      this.setMeta('exclude_attributes', excludeAttributes);
      // Store the current time
      this.setMeta('last_updated', new Date().toISOString());
      // Now that we have the schema, update the summary_histogram
      return this.getHistogram().then(histogram => {
        this.setMeta('summary_histogram', histogram);
      });
    }).then(() => {
      return this.save();
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

Dataset.DuplicateDatasetError = DuplicateDatasetError;
export default Dataset;
