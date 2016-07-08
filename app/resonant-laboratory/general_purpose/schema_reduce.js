function reduce (key, values) {  // eslint-disable-line no-unused-vars
  var counters = {};
  values.forEach(function (counts) {
    var dataType;
    for (dataType in counts) {
      if (counts.hasOwnProperty(dataType)) {
        if (!counters.hasOwnProperty(dataType)) {
          counters[dataType] = {
            native: false,
            count: 0
          };
          if (dataType === 'integer' || dataType === 'number' ||
              dataType === 'string' || dataType === 'date') {
            counters[dataType].lowBound = counts[dataType].lowBound;
            counters[dataType].highBound = counts[dataType].highBound;
          }
        }
        // Update the native flag, add the count, and update the low/high bounds
        counters[dataType].native = counters[dataType].native || !!counts[dataType].native;
        counters[dataType].count += counts[dataType].count;
        if (dataType === 'integer' || dataType === 'number' ||
            dataType === 'string' || dataType === 'date') {
          if (counts[dataType].lowBound < counters[dataType].lowBound) {
            counters[dataType].lowBound = counts[dataType].lowBound;
          }
          if (counts[dataType].highBound > counters[dataType].highBound) {
            counters[dataType].highBound = counts[dataType].highBound;
          }
        }
      }
    }
  });

  return counters;
}
