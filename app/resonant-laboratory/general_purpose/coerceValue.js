function coerceValue (value, coerceToType) {
  // What type should we coerce this value to?
  if (!coerceToType) {
    // No type specified - this is a magic
    // mode that bins by native data type
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
    // TODO: apply smarter date coercion in the vein of the stuff below

    /* if (typeof value === 'integer') {
      var digits = Math.log10(value);
      if (value > 999 && value < 3000) {
        // An integer with the above range is probably a year
        dateValue = new Date(value, 0, 0);
      } else if (digits >= 9 && digits <= 15) {
        // Most millisecond date values should be between 9 and 15 digits
        // (this will miss some dates in 1969/1970, and beyond 5000AD and 1000BC)
        dateValue = new Date(value);
      }
    } else if (typeof value === 'string') {
      // Try to convert from a string
      dateValue = new Date(value);
    } */
    value = new Date(value);
  }
  // Otherwise, coerceToType is 'object' - default
  // behavior is simply to pass the value through unchanged

  return value;
}

var es6exports = { // eslint-disable-line no-unused-vars
  coerceValue: coerceValue
};
