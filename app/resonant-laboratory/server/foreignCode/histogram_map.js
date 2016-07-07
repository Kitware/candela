/* globals emit, params */

// This script is kind of sloppy, but to use this code with mongodb's
// mapreduce, the map script must contain exactly one function. Because of
// this, these two lines are appended in datasetItem.py (as params can vary,
// and there's no way to pass in parameters to these functions):
// function map () {
//  var params = {...}

function findBin (attrName, value) {
  var coerceToType = params.binSettings[attrName].coerceToType;
  var interpretation = params.binSettings[attrName].interpretation;
  // What type should we coerce this value to?
  if (coerceToType === null) {
    // Bin by native data type
    if (parseFloat(value) === parseInt(value)) {
      value = 'integer';
    } else {
      value = typeof value;
    }
  } else if (coerceToType === 'boolean') {
    value = !!value;
  } else if (coerceToType === 'integer') {
    value = parseInt(value);
  } else if (coerceToType === 'number') {
    value = parseFloat(value);
  } else if (coerceToType === 'string') {
    value = String(value);
  } else if (coerceToType === 'date') {
    // TODO: add fancier coercion logic (see
    // server/schema_map.js)
    value = new Date(value);
  } else {
    // coerceToType is 'object' or some other kind of passthrough.
    // for the sake of the histograms, force it to a string (even
    // though the data will be passed in Resonant Lab unchanged)
    value = String(value);
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
