/* globals emit */
function map () { // eslint-disable-line no-unused-vars
  var keys = this;
  for (var key in keys) {
    var value = keys[key];
    var dataType = typeof value;

    var dataTypes = {};
    dataTypes[dataType] = {
      count: 1
    };
    if (dataType === 'number') {
      dataTypes[dataType].min = value;
      dataTypes[dataType].max = value;
    }
    emit(key, dataTypes);
  }
}
