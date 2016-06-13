/* globals emit */
function map () { // eslint-disable-line no-unused-vars
  var keys = this;
  for (var key in keys) {
    // Create a dict containing counts for all possible data type interpretations
    var value = keys[key];
    var counters = {};

    /** First determine and count the value's native type **/
    var nativeType = typeof value;
    if (nativeType === 'number') {
      if (Math.floor(value) === value) {
        nativeType = 'integer';
      }
    } else if (value instanceof Date) {
      nativeType = 'date';
    } else if (value === undefined) {
      nativeType = 'undefined';
    } else if (value === null) {
      nativeType = 'null';
    }

    // store the counts
    counters[nativeType] = {
      native: {
        count: 1
      }
    };
    // store the mins and maxes if relevant
    if (nativeType === 'integer' || nativeType === 'number' ||
        nativeType === 'string' || nativeType === 'date') {
      counters[nativeType].native.lowBound = value;
      counters[nativeType].native.highBound = value;
    }

    /** Next determine and count its potential coerced types **/
    if (nativeType !== 'string') {
      var strValue = String(value);
      if (strValue !== '[object Object]') {
        // this value can be meaningfully coerced to a string (and isn't already one)
        counters['string'] = {
          potential: {
            count: 1,
            lowBound: strValue,
            highBound: strValue
          }
        };
      }
    }
    if (nativeType !== 'number' && nativeType !== 'integer') {
      var numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        // this value can be coerced to a number (and isn't already one)
        // is it an integer?
        if (Math.floor(numValue) === numValue) {
          counters['integer'] = {
            potential: {
              count: 1,
              lowBound: numValue,
              highBound: numValue
            }
          };
        } else {
          counters['number'] = {
            potential: {
              count: 1,
              lowBound: numValue,
              highBound: numValue
            }
          };
        }
      }
    }
    if (nativeType !== 'date') {
      var dateValue = new Date(value);
      if (!isNaN(dateValue)) {
        // this value can be coerced into a date (and isn't already one)
        counters['date'] = {
          potential: {
            count: 1,
            lowBound: dateValue,
            highBound: dateValue
          }
        };
      }
    }
    if (nativeType !== 'boolean') {
      // anything can be coerced into a boolean
      counters['boolean'] = {
        potential: {
          count: 1
        }
      };
    }
    emit(key, counters);
  }
}
