/* globals emit, params */

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
  return 'test';
}

function map () { // eslint-disable-line no-unused-vars
  var dataRow = this;
  if (!filterRow(dataRow)) {
    return;
  }
  for (var attrName in dataRow) {
    var value = dataRow[attrName];
    var result = {};
    result[findBin(attrName, value)] = 1;
    emit(attrName, result);
  }
}
