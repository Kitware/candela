function reduce (key, values) {  // eslint-disable-line no-unused-vars
  var dataTypes = {};
  values.forEach(function (value) {
    var dataType;
    for (dataType in value) {
      if (!dataTypes.hasOwnProperty(dataType)) {
        dataTypes[dataType] = {
          count: 0
        };
        if (dataType === 'number') {
          dataTypes[dataType].min = value[dataType].min;
          dataTypes[dataType].max = value[dataType].max;
        }
      }
      dataTypes[dataType].count += value[dataType].count;
      if (dataType === 'number') {
        dataTypes[dataType].min = value[dataType].min < dataTypes[dataType].min ? value[dataType].min : dataTypes[dataType].min;
        dataTypes[dataType].max = value[dataType].max > dataTypes[dataType].max ? value[dataType].max : dataTypes[dataType].max;
      }
    }
  });

  return dataTypes;
}
