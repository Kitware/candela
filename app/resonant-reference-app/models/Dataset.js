import d3 from 'd3';

let girder = window.girder;

let DATA_TYPES = {
  BOOLEAN: 'Boolean',
  NUMBER: 'Number',
  STRING: 'String',
  DATE: 'Date',
  LIST: 'List',
  DICT: 'Dict',
  POINTER: 'Pointer',
  LAT_LON: 'Lat/Lon'
};

let Dataset = girder.models.ItemModel.extend({
  initialize: function () {
    let self = this;
    let meta = this.get('meta');
    if (!meta || !meta.spec) {
      self.autoDetermineSpec();
    }
  },
  getParsed: function (callback) {
    let self = this;
    // TODO: support more file formats / non-Girder
    // files (e.g. pasted browser data)
    girder.restRequest({
      path: 'item/' + self.id + '/download',
      type: 'GET',
      error: null,
      dataType: 'text'
    }).done(function (data) {
      callback(d3.csv.parse(data));
    });
  },
  autoDetermineSpec: function () {
    // TODO
  }
});

Dataset.DATA_TYPES = DATA_TYPES;
export default Dataset;
