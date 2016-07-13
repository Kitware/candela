/* globals emit, coerceValue */
function map () { // eslint-disable-line no-unused-vars
  var keys = this;
  for (var key in keys) {
    // Create a dict containing counts for all possible data type interpretations
    var value = keys[key];
    var counters = {};

    /** First determine and count the value's "native" type **/
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
      native: true,
      count: 1
    };
    // counters[nativeType][map._dummy] = 1;
    // store the mins and maxes if relevant
    if (nativeType === 'integer' || nativeType === 'number' || nativeType === 'date') {
      counters[nativeType].lowBound = value;
      counters[nativeType].highBound = value;
    }

    /** Next determine and count its potential coerced types **/
    if (nativeType !== 'string') {
      var strValue = coerceValue(value, 'string');
      if (strValue !== '[object Object]') {
        // this value can be meaningfully coerced to a string (and isn't already one)
        counters['string'] = {
          count: 1
        };
      }
    }
    if (nativeType !== 'number' && nativeType !== 'integer') {
      var numValue = coerceValue(value, 'number');
      if (!isNaN(numValue)) {
        // this value can be coerced to a number (and isn't already one)

        // is it an integer?
        if (Math.floor(numValue) === numValue) {
          numValue = Math.floor(numValue);
          counters['integer'] = {
            count: 1,
            lowBound: numValue,
            highBound: numValue
          };
        }
        // count that we saw this as a potential number
        // (integers will be counted twice)
        counters['number'] = {
          count: 1,
          lowBound: numValue,
          highBound: numValue
        };
      }
    }
    if (nativeType !== 'date') {
      var dateValue = coerceValue(value, 'date');

      if (dateValue && !isNaN(dateValue)) {
        // this value can be coerced into a date (and isn't already one)
        counters['date'] = {
          count: 1,
          lowBound: dateValue,
          highBound: dateValue
        };
      }
    }
    if (nativeType !== 'boolean') {
      // anything can be coerced into a boolean using
      // !!value. We'll allow fancier conversions in the
      // future, but those will only apply to the histogram
      // calculations and client-side type coercion
      counters['boolean'] = {
        count: 1
      };
    }
    emit(key, counters);
  }
}
