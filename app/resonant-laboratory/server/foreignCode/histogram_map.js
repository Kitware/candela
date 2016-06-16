/* globals emit, params */

// This script is kind of sloppy, but to use this code with mongodb's
// mapreduce, the map script must contain exactly one function. Because of
// this, these two lines are appended in datasetItem.py (as params can vary,
// and there's no way to pass in parameters to these functions):
// function map () {
//  var params = {...}

function filterRow (dataRow, expression) {
  // TODO: this is NOT the place to do row filtering!
  // We *should* let mongo handle the filtering, or
  // do the filtering in the assetstore...?
  if (expression === undefined) {
    expression = params['filter'];
  }
  var expType = typeof expression;
  if (expType === 'string') {
    if (dataRow.hasOwnProperty(expression)) {
      return dataRow[expression];
    } else {
      return expression;
    }
  } else if (expType === 'object' &&
             (expression.left !== undefined) &&
             (expression.operator !== undefined) &&
             (expression.right !== undefined)) {
    var left = filterRow(dataRow, expression.left);
    var right = filterRow(dataRow, expression.right);
    if (expression.operator === 'eq') {
      return left === right; // || (isNaN(left) && isNaN(right));
    } else if (expression.operator === 'ne') {
      return left !== right; // && !(isNaN(left) && isNaN(right));
    } else if (expression.operator === 'lt') {
      return left < right;
    } else if (expression.operator === 'lte') {
      return left <= right;
    } else if (expression.operator === 'gt') {
      return left > right;
    } else if (expression.operator === 'gte') {
      return left >= right;
    } else if (expression.operator === 'in') {
      return right.indexOf(left) !== -1;
    } else if (expression.operator === 'notin') {
      return right.indexOf(left) === -1;
    } else if (expression.operator === 'and') {
      return left && right;
    } else if (expression.operator === 'or') {
      return left || right;
    } else {
      throw new Error('Unknown operator: ' + expression.operator);
    }
  } else {
    return expression;
  }
}

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
if (filterRow(dataRow)) {
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
}

// }
