/* globals emit, params, coerceValue */

// This script is kind of sloppy, but to use this code with mongodb's
// mapreduce, the map script must contain exactly one function. Because of
// this, these two lines are appended in datasetItem.py (as params can vary,
// and there's no way to pass in parameters to these functions):
// function map () {
//  var params = {...}

function findBin (attrName, value) {
  var coerceToType = params.binSettings[attrName].coerceToType;
  var interpretation = params.binSettings[attrName].interpretation;

  if (coerceToType === 'object') {
    // coerceToType is 'object', or in other words, con't coerce.
    // For the sake of the histograms, force 'object' coercions
    // into a string (will probably yield '[object Object]') even
    // though the data will be passed in Resonant Lab unchanged.
    value = String(value);
  } else {
    value = coerceValue(value, coerceToType);
  }

  // Is the value a special value (always emit the bin)?
  if (value === undefined || value === 'undefined') {
    return 'undefined';
  } else if (value === null || value === 'null') {
    return 'null';
  } else if (typeof value === 'number' && isNaN(value)) {
    return 'NaN';
  } else if (value === Infinity) {
    return 'Infinity';
  } else if (value === -Infinity) {
    return '-Infinity';
  } else if (value === '') {
    return '"" (empty string)';
  } else if (params.binSettings[attrName].specialBins.indexOf(value) !== -1) {
    return value;
  }

  // Okay, how should we bin things?
  // WARNING: similar logic exists in views/widgets/DatasetView/comboScale.js
  // changes here should also be adapted there.
  if (interpretation === 'ordinal') {
    if (coerceToType === 'integer' || coerceToType === 'number') {
      var binIndex = Math.floor(params.binSettings[attrName].numBins *
                                (value - params.binSettings[attrName].lowBound) /
                                (params.binSettings[attrName].highBound -
                                  params.binSettings[attrName].lowBound));
      return params.binSettings[attrName].humanBins[binIndex];
    } else if (coerceToType === 'string') {
      // TODO: ordinal binning of strings (lexographic)
      return value;
    } else if (coerceToType === 'date') {
      // TODO: ordinal binning of dates
      return value;
    }
  } else {
    // Just return all the categorical values... the reduce phase
    // takes care of binning these
    return value;
  }
}

var dataRow = this;
emit('__passedFilters__', {
  histogram: [{
    count: 1,
    label: 'count'
  }]
});
var attrName;
for (attrName in dataRow) {
  if (dataRow.hasOwnProperty(attrName)) {
    var value = dataRow[attrName];
    // This is a funky way to wrap up the histogram...
    // the outer layer has to do with the fact that mongodb
    // reduce functions can't output an array. The array, of course,
    // is an ordered list of bins... in the map case, there's only
    // one bin to emit. The object inside is the way bins are returned
    // in the output.
    emit(attrName, {
      histogram: [{
        count: 1,
        label: findBin(attrName, value)
      }]
    });
  }
}

// }
