function reduce (key, values) {  // eslint-disable-line no-unused-vars
  var counters = {};
  values.forEach(function (counts) {
    var dataType; // e.g. "integer", "string", ...
    var countType;  // e.g. "native", "potential", ...
    for (dataType in counts) {
      if (counts.hasOwnProperty(dataType)) {
        if (!counters.hasOwnProperty(dataType)) {
          counters[dataType] = {};
        }
        for (countType in counts[dataType]) {
          if (counts[dataType].hasOwnProperty(countType)) {
            if (!counters[dataType].hasOwnProperty(countType)) {
              // We haven't seen this count yet; initialize it with
              // a zero count, and low/high bounds if relevant
              counters[dataType][countType] = {
                count: 0
              };
              if (dataType === 'integer' || dataType === 'number' ||
                  dataType === 'string' || dataType === 'date') {
                counters[dataType][countType].lowBound = counts[dataType][countType].lowBound;
                counters[dataType][countType].highBound = counts[dataType][countType].highBound;
              }
            }
            // Add the count, and update the low/high bounds
            counters[dataType][countType].count += counts[dataType][countType].count;
            if (dataType === 'integer' || dataType === 'number' ||
                dataType === 'string' || dataType === 'date') {
              if (counts[dataType][countType].lowBound < counters[dataType][countType].lowBound) {
                counters[dataType][countType].lowBound = counts[dataType][countType].lowBound;
              }
              if (counts[dataType][countType].highBound > counters[dataType][countType].highBound) {
                counters[dataType][countType].highBound = counts[dataType][countType].highBound;
              }
            }
          }
        }
      }
    }
  });

  return counters;
}
