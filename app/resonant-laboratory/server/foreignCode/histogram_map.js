/* globals emit, params */

// This script is kind of sloppy, but to use this code with mongodb's
// mapreduce, the map script must contain exactly one function. Because of
// this, these two lines are appended in datasetItem.py (as params can vary,
// and there's no way to pass in parameters to these functions):
// function map () {
//  var params = {...}

function filterRow (dataRow, expression) {
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
  // What type should we coerce this value to?
  if (coerceToType === null) {
    // Bin by native data type
    if (parseFloat(value) === parseInt(value)) {
      value = 'integer';
    } else {
      value = typeof value;
    }
  } else if (coerceToType === 'boolean') {
    // Force the value to this type
    value = !!value;
  } else if (coerceToType === 'integer') {
    value = parseInt(value);
  } else if (coerceToType === 'number') {
    value = parseFloat(value);
  } else if (coerceToType === 'string') {
    value = String(value);
  } else if (coerceToType === 'date') {
    value = new Date(value);
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
  if (params.binSettings[attrName].interpretation === 'ordinal') {
    return 'TODO: ordinal bin';
  } else {
    return value;
  }
}

var dataRow = this;
if (filterRow(dataRow)) {
  var attrName;
  for (attrName in dataRow) {
    if (dataRow.hasOwnProperty(attrName)) {
      var value = dataRow[attrName];
      var result = {};
      result[findBin(attrName, value)] = 1;
      emit(attrName, result);
    }
  }
}

// }
