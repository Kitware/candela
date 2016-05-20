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
    if (meta.schema && meta.lastUpdated && girderUpdate &&
      new Date(meta.lastUpdated) >= new Date(girderUpdate)) {
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
    if (attrSpec.coerceToType) {
      // The user has specified a data type
      return attrSpec.coerceToType;
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
  getHistogram: function (includeExcluded) {
    let schema = this.getMeta('schema');
    let excludeAttributes = this.getMeta('excludeAttributes') || [];
    let filters = this.getMeta('filters') || [];
    let parameters = {
      categoricalAttrs: [],
      quantitativeAttrs: {}
    };
    // Assemble the parameters for which attributes we want to see
    // (and provide the bin settings for quantitative attributes)
    for (let attrName of Object.keys(schema)) {
      if (!includeExcluded && excludeAttributes.indexOf(attrName) !== -1) {
        continue;
      }
      let attrSpec = schema[attrName];
      if (this.getAttributeInterpretation(attrSpec) === 'categorical') {
        parameters.categoricalAttrs.push(attrName);
      } else if (this.getAttributeInterpretation(attrSpec) === 'quantitative') {
        // Our schema should tell us the lowest / highest values
        // for this attribute as a number...
        if (!attrSpec.stats.number) {
          // Even though we want to interpret this value as quantitative,
          // we can't (yet) figure out how to ask for min and max values...

          // TODO: what about other potentially quantitative values (like dates?
          // the server will probably auto-infer that these are strings...)

          // For now, as a fallback, we'll add this as a categorical query,
          // but this could be bad for performance (probably lots of "categories"
          // if it's really quantitative). This may also cause some UI confusion...
          parameters.categoricalAttrs.push(attrName);
          continue;
        }
        let desiredType = this.getAttributeType(attrSpec);
        let result = {
          binCount: BIN_COUNT,
          min: this.coerceValue(attrSpec.stats.number.min, desiredType),
          max: this.coerceValue(attrSpec.stats.number.max, desiredType)
        };
        // TODO: there are probably more intelligent things we can
        // do with binCount based on the data type...
        if (desiredType === 'boolean') {
          result.binCount = 2;
        }
        if (result.min === result.max) {
          // Shoot... there's really only one value for this attribute
          // after all. So it's really categorical, even if we want it to be
          // quantitative (at least as far as the histogram calculations
          // are concerned)
          parameters.categoricalAttrs.push(attrName);
        } else {
          parameters.quantitativeAttrs[attrName] = result;
        }
      }
    }
    // Add the filters if there are any
    if (filters && filters.length > 0) {
      parameters.filters = filters;
    }
    // Format the parameters for the endpoint...
    parameters.categoricalAttrs = parameters.categoricalAttrs.join(',');
    parameters.quantitativeAttrs = JSON.stringify(parameters.quantitativeAttrs);
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
  getSpec: function (includeExcluded = false) {
    let schema = this.getMeta('schema') || {};
    let excludeAttributes = this.getMeta('excludeAttributes') || [];
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
        let schema = this.getMeta('schema');
        if (rawData === null || !schema) {
          this.parsedCache = parsedData = null;
        } else {
          try {
            parsedData = JSON.parse(rawData);
            // If that was successful, we can pretty-print the raw data...
            this.rawCache = JSON.stringify(parsedData, null, '  ');

            // Okay, now we need to coerce data types (and deliberately remove
            // attributes if necessary)
            let excludeAttributes = this.getMeta('excludeAttributes') || [];
            parsedData.forEach(dataItem => {
              for (let attrName of Object.keys(dataItem)) {
                if (excludeAttributes.indexOf(attrName) !== -1) {
                  delete dataItem[attrName];
                } else {
                  let dataType = this.getAttributeType(schema[attrName]);
                  dataItem[attrName] = this.coerceValue(dataItem[attrName], dataType);
                }
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
      let excludedAttributes = this.getMeta('excludeAttributes') || [];
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
          if (existingSchema[attrName].coerceToType) {
            newSchema[attrName].coerceToType = existingSchema[attrName].coerceToType;
          }
          if (existingSchema[attrName].interpretation) {
            newSchema[attrName].interpretation = existingSchema[attrName].interpretation;
          }
        }
      }
      // Store the new schema
      this.setMeta('schema', newSchema);
      // Store the new excludeAttributes
      this.setMeta('excludeAttributes', excludeAttributes);
      // Store the current time
      this.setMeta('lastUpdated', new Date().toISOString());
      // Now that we have the schema, update the summaryHistogram
      return this.getHistogram(true).then(histogram => {
        this.setMeta('summaryHistogram', histogram);
      });
    }).then(() => {
      return this.save();
    });
  },
  includeAttribute: function (attrName, include) {
    let excludeAttributes = this.getMeta('excludeAttributes') || [];
    let attrIndex = excludeAttributes.indexOf(attrName);
    if (include === true) {
      if (attrIndex !== -1) {
        excludeAttributes.splice(attrIndex, 1);
      }
    } else {
      if (attrIndex === -1) {
        excludeAttributes.push(attrName);
      }
    }
    this.setMeta('excludeAttributes', excludeAttributes);

    // With the updated attribute exclusions, update the histogram
    return this.getHistogram(false).then(histogram => {
      this.setMeta('currentHistogram', histogram);
      this.trigger('rl:changeSpec');
      return this.save();
    });
  },
  setFilters: function (filters) {
    if (filters) {
      this.setMeta('filters', filters);
    } else {
      this.unsetMeta('filters');
    }
    // TODO: validate that the filters make sense in terms of the schema

    // With the new filters (or lack thereof), update the histogram
    return this.getHistogram(false).then(histogram => {
      this.setMeta('currentHistogram', histogram);
      this.trigger('rl:updateFilters');
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

Dataset.DEFAULT_INTERPRETATIONS = DEFAULT_INTERPRETATIONS;
Dataset.DuplicateDatasetError = DuplicateDatasetError;
export default Dataset;
