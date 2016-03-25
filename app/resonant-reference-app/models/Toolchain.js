import Backbone from 'backbone';
import MetadataItem from './MetadataItem';
import Dataset from './Dataset';

/*
    A Toolchain represents a user's saved session;
    it includes specific datasets, with specific
    mappings to specific visualizations (in the future,
    this may also include faceting settings, etc).
    
    Though behind the scenes we're making room for multiple
    datasets and multiple visualizations,
    for now, toolchains are expected to only contain one
    dataset and one visualization. Any more are ignored
    by the currently implemented views.
*/

let Toolchain = MetadataItem.extend({
  defaults: {
    name: 'Untitled Toolchain',
    meta: {
      datasets: [],
      mappings: [],
      visualizations: []
    }
  },
  initialize: function () {
    let self = this;

    let DatasetCollection = Backbone.Collection.extend({
      model: Dataset
    });

    let meta = self.getMeta();
    meta.datasets = new DatasetCollection(meta.datasets);

    // Forward events from dataset changes
    self.listenTo(meta.datasets, 'rra:changeSpec', function () {
      self.validateMappings();
    });

    self.setMeta(meta);
  },
  isEmpty: function () {
    let self = this;
    let meta = self.getMeta();
    return meta.datasets.length === 0 &&
      meta.visualizations.length === 0 &&
      meta.mappings.length === 0;
  },
  setDataset: function (newDataset, index = 0) {
    let self = this;
    // Need to convert the raw girder.ItemModel
    // (when we add it to meta.datasets, it gets
    // auto-converted to our Dataset model)
    newDataset = newDataset.toJSON();

    let meta = self.getMeta();
    if (newDataset.exampleToolchain &&
      meta.visualizations.length === 0) {
      // The user is starting off with this dataset;
      // we want to load up the example visualization and
      // the mappings that go with it
      self.setToolchain(newDataset.exampleToolchain);
    } else {
      // Okay, we're actually swapping
      // in a different dataset
      if (index >= meta.datasets.length) {
        meta.datasets.push(newDataset);
        self.setMeta(meta);
      } else {
        let oldDataset = meta.datasets.at(index);
        if (oldDataset.get('_id') === newDataset['_id']) {
          return;
        }
        meta.datasets.remove(oldDataset);
        meta.datasets.add(newDataset, {
          at: index
        });
        // Swapping in a new dataset invalidates the mappings
        meta.mappings = [];
        self.setMeta(meta);
      }
      self.save();
      self.trigger('rra:changeDatasets');
      self.trigger('rra:changeMappings');
    }
  },
  setVisualization: function (newVisualization, index = 0) {
    let self = this;
    let meta = self.getMeta();
    if (newVisualization.exampleToolchain &&
      meta.datasets.length === 0) {
      // The user is starting off with this visualization;
      // we want to load up the example dataset and
      // the mappings that goes with it
      self.setToolchain(newVisualization.exampleToolchain);
    } else {
      if (index >= meta.visualizations.length) {
        meta.visualizations.push(newVisualization);
        self.set('meta', meta);
      } else {
        if (meta.visualizations[index].name === newVisualization.name) {
          return;
        }
        meta.visualizations[index] = newVisualization;
        // Swapping in a new dataset invalidates the mappings
        meta.mappings = [];
        self.setMeta(meta);
      }
      self.save();
      self.trigger('rra:changeVisualizations');
      self.trigger('rra:changeMappings');
    }
  },
  shapeDataForVis: function (callback, index = 0) {
    let self = this;
    let meta = self.getMeta();

    // TODO: use the mapping to transform
    // the parsed data into the shape that
    // the visualization expects
    let dataset = meta.datasets.at(0);
    if (!dataset) {
      callback([]);
    } else {
      dataset.getParsed(callback);
    }
  },
  getVisOptions: function (index = 0) {
    let self = this;
    let mappings = self.getMeta('mappings');
    let options = {};

    mappings.forEach((mapping) => {
      options[mapping.visAttribute] = mapping.dataAttribute;
    });
    return options;
  },
  validateMappings: function () {
    let self = this;
    let meta = self.getMeta();

    // Go through all the mappings and make sure that:
    // 1. The data types are still compatible
    //    (trash them if they're not)
    // 2. TODO: Other things we should check?
    let indicesToTrash = [];
    for (let [index, mapping] of meta.mappings.entries()) {
      let dataType = meta.datasets.at(mapping.dataIndex)
        .getSpec().attributes[mapping.dataAttribute];

      let possibleTypes = [];
      for (let optionSpec of meta.visualizations[mapping.visIndex].options) {
        if (optionSpec.name === mapping.visAttribute) {
          possibleTypes = Dataset.COMPATIBLE_TYPES[optionSpec.type];
          break;
        }
      }

      if (possibleTypes.indexOf(dataType) === -1) {
        indicesToTrash.push(index);
      }
    }

    for (let index of indicesToTrash) {
      meta.mappings.splice(index, 1);
    }

    if (indicesToTrash.length > 0) {
      self.setMeta(meta);
      self.save();
      self.trigger('rra:changeMappings');
    }
  },
  addMapping: function (mapping) {
    let self = this;
    let meta = self.getMeta();

    // TODO: For now, I assume that vis nodes
    // can only accept one edge at a time. Replace
    // a vis mapping if one exists.
    let addedMapping = false;
    for (let [index, m] of meta.mappings.entries()) {
      if (mapping.visIndex === m.visIndex &&
        mapping.visAttribute === m.visAttribute) {
        meta.mappings[index] = mapping;
        addedMapping = true;
        break;
      }
    }

    if (!addedMapping) {
      meta.mappings.push(mapping);
    }

    self.setMeta(meta);
    self.save();
    self.trigger('rra:changeMappings');
  },
  removeMapping: function (mapping) {
    let self = this;
    let meta = self.getMeta();

    let mappingToSplice = null;
    for (let [index, m] of meta.mappings.entries()) {
      if (mapping.visIndex === m.visIndex &&
        mapping.visAttribute === m.visAttribute &&
        mapping.dataIndex === m.dataIndex &&
        mapping.dataAttribute === m.dataAttribute) {
        mappingToSplice = index;
        break;
      }
    }
    if (mappingToSplice !== null) {
      meta.mappings.splice(mappingToSplice, 1);
    }

    self.setMeta(meta);
    self.save();
    self.trigger('rra:changeMappings');
  }
});

export default Toolchain;
