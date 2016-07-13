/*globals LOCALE_INDEXES*/

var FALSEY_STRINGS = ['0', 'N', 'n'];

function coerceValue (value, coerceToType) {
  // What type should we coerce this value to?
  if (!coerceToType) {
    // No type specified - this is a magic
    // mode that bins by native data type
    if (parseFloat(value) === parseInt(value, 10)) {
      value = 'integer';
    } else {
      value = typeof value;
    }
  } else if (coerceToType === 'boolean') {
    value = !!value && FALSEY_STRINGS.indexOf(value) === -1;
  } else if (coerceToType === 'integer') {
    value = parseInt(value, 10);
  } else if (coerceToType === 'number') {
    value = parseFloat(value);
  } else if (coerceToType === 'string') {
    value = String(value);
  } else if (coerceToType === 'date') {
    value = new Date(value);
    // TODO: apply smarter date coercion in the vein of the stuff below
    /*
    if (coerceToType === 'integer') {
      var digits = Math.log10(value);
      if (value > 999 && value < 3000) {
        // An integer with the above range is probably a year
        value = new Date(value, 0, 0);
      } else if (digits >= 9 && digits <= 15) {
        // Most millisecond date values should be between 9 and 15 digits
        // (this will miss some dates in 1969/1970, and beyond 5000AD and 1000BC)
        value = new Date(value);
      }
    } else { // if (typeof value === 'string') {
      // Try to convert from whatever it is (probably a string)
      value = new Date(value);
    }
    */
  }
  // Otherwise, coerceToType is 'object' - default
  // behavior is simply to pass the value through unchanged

  return value;
}

function formatDate (dateObj, levels) {
  var dateString;
  if (levels.milliseconds === true) {
    return dateObj.getSeconds() + dateObj.getMilliseconds() / 1000;
  } else if (levels.time === true && levels.date === false) {
    return dateObj.toLocaleTimeString();
  } else if (levels.time === true && levels.date === true) {
    return dateObj.toLocaleString();
  } else if (levels.date === true) {
    dateString = dateObj.toLocaleDateString();
  } else {
    dateString = Math.abs(dateObj.getFullYear());
  }
  if (levels.era === true && dateObj.getFullYear() < 0) {
    dateString += ' BCE';
  }
  return dateString;
}

function createBins (coerceToType, numBins, lowBound, highBound, locale) {
  // Create:
  // 1. a list of bins with raw boundary values, plus a human-readable label
  // 2. a dictionary that looks up those bins by its human-readable label
  var sigFigs = 3;
  var bin;
  var bins = [];
  var lookup = {};
  var step;
  var i;

  if (coerceToType !== 'string' && coerceToType !== 'object') {
    lowBound = coerceValue(lowBound, coerceToType);
    highBound = coerceValue(highBound, coerceToType);
    if (highBound === lowBound) {
      // Weird corner case; this really *should* be categorical.
      // Just return one bin for all the values.
      bins = [{
        lowBound: lowBound,
        highBound: highBound,
        label: String(lowBound)
      }];
      lookup = {};
      lookup[lowBound] = 0;
      return {
        bins: bins,
        lookup: lookup
      };
    }
  }

  if (coerceToType === 'integer') {
    // Can't have more bins than integers in the range
    numBins = Math.min(highBound - lowBound, numBins);
  }
  if (coerceToType === 'integer' || coerceToType === 'number') {
    step = (highBound - lowBound) / numBins;
    // Get significant digits in terms of the step value; we know that
    // this will always be enough to distinguish between each boundary value
    var base = Math.log10(Math.abs(step));
    base = Math.floor(base) - (sigFigs - 1);
    base = Math.pow(10, base);
    for (i = 0; i < numBins; i += 1) {
      // Create the bins with raw boundary values
      bin = {
        lowBound: lowBound + i * step,
        highBound: lowBound + (i + 1) * step
      };
      if (coerceToType === 'integer') {
        bin.lowBound = Math.floor(bin.lowBound);
        bin.highBound = Math.floor(bin.highBound);
      }
      // Create the human-readable label for the bin
      bin.label = '[' + (Math.floor(bin.lowBound / base) * base) + ' - ';
      if (i === numBins - 1) {
        bin.label += (Math.ceil(highBound / base) * base) + ']';
      } else {
        bin.label += (Math.floor(bin.highBound / base) * base) + ')';
      }
      // In spite of all that, it's *still* totally possible
      // to wind up with long strings of 0s or 9s as a result
      // of floating point math. So we apply a crazy regex
      // that trims these (plus some boundary logic to keep
      // one 9 if it's 9s, and ignore the last digit that
      // could be anything)
      bin.label = bin.label.replace(/(9?)[09]{5}[09]+\d/g, '$1');
      lookup[bin.label] = bins.length;
      bins.push(bin);
    }
  } else if (coerceToType === 'string' || coerceToType === 'object') {
    // Objects are treated as strings for the sake of binning.

    // Use the locale to get the index definition
    if (!LOCALE_INDEXES.hasOwnProperty(locale)) {
      locale = 'en';
    }
    var index = LOCALE_INDEXES[locale];
    // Can't have more bins than characters in the index
    numBins = Math.min(index.length, numBins);
    var charsPerBin = Math.ceil(index.length / numBins);
    for (i = 0; i < index.length; i += charsPerBin) {
      bin = {
        lowBound: index[i],
        highBound: index[Math.min(index.length - 1, i + charsPerBin)]
      };
      if (bin.lowBound === bin.highBound) {
        bin.label = lowBound;
      } else {
        bin.label = '[' + bin.lowBound + ' - ' + bin.highBound;
        if (i + charsPerBin >= index.length) {
          bin.label += ']';
        } else {
          bin.label += ')';
        }
      }
      lookup[bin.label] = bins.length;
      bins.push(bin);
    }
  } else if (coerceToType === 'boolean') {
    // These are kind of silly, but they'll
    // work because of the >= lowBound check
    bins = [
      {
        lowBound: false,
        highBound: false,
        label: 'false'
      },
      {
        lowBound: true,
        highBound: true,
        label: 'true'
      }
    ];
    lookup = {
      'false': 0,
      'true': 1
    };
  } else if (coerceToType === 'date') {
    var span = highBound - lowBound;
    step = span / numBins;
    // What sort of scale are we dealing with?
    var includeTimeLevels = {
      // only show milliseconds if bins are less than a minute
      milliseconds: step < 60000,
      // only show the time string if bins are at least a minute,
      // and less than a day long
      time: step >= 60000 && step < 86400000,
      // only show the date string if the span covers more than
      // one day, and each bin is less than a decade long
      date: (span >= 86400000 || lowBound.getDate() !== highBound.getDate()) &&
        step < 315360000000,
      // only show the era if lowBound reaches into BCE
      era: lowBound < -62135578800000
    };
    for (i = 0; i < numBins; i += 1) {
      // Create the bins with raw boundary values (the - 0 ensures that
      // we're working with a number, not concatenating a date string).
      bin = {
        lowBound: new Date(Math.floor(lowBound - 0 + i * step)),
        highBound: new Date(Math.floor(lowBound - 0 + (i + 1) * step))
      };
      // Create the human-readable label for the bin
      bin.label = '[' + formatDate(bin.lowBound, includeTimeLevels) + ' - ';
      if (i === numBins - 1) {
        bin.label += formatDate(highBound, includeTimeLevels) + ']';
      } else {
        bin.label += formatDate(bin.highBound, includeTimeLevels) + ')';
      }
      // Because they'll fly around as JSON strings, store the raw bounds in
      // ISO 8601 format, where string comparisons are still valid
      bin.lowBound = bin.lowBound.toISOString();
      bin.highBound = bin.highBound.toISOString();
      lookup[bin.label] = bins.length;
      bins.push(bin);
    }
  } else {
    throw new Error('Can\'t create ordinal bins for type ' + coerceToType);
  }

  return {
    bins: bins,
    lookup: lookup
  };
}

function findBinLabel (value, coerceToType, lowBound, highBound, specialBins, ordinalBins) {
  // Given a value (we assume it's already been coerced into its desired
  // form), find the human-readable label of the bin that the value belongs in

  // In the case that coerceToType is 'object', we still want
  // to stringify it so that we return something hashable
  // (unless there's a custom toString(), we'll get '[object Object]',
  // which, for the purposes of binning, is still just fine)
  if (coerceToType === 'object') {
    value = String(value);
  }

  // Is the value a special value (always emit the value directly)?
  if (value === undefined || value === 'undefined') {
    return 'undefined';
  } else if (value === null || value === 'null') {
    return 'null';
  } else if (isNaN(value)) {
    if (coerceToType === 'number' || coerceToType === 'integer') {
      return 'NaN';
    } else if (value instanceof Date) {
      return 'Invalid Date';
    }
  } else if (value === Infinity) {
    return 'Infinity';
  } else if (value === -Infinity) {
    return '-Infinity';
  } else if (value === '') {
    return '"" (empty string)';
  } else if (specialBins.indexOf(value) !== -1) {
    return value;
  }

  // Because dates have to fly around as JSON strings, we want
  // to use ISO 8601 (where string comparisons are still valid)
  if (value instanceof Date) {
    value = value.toISOString();
  }

  var compare;
  if (coerceToType === 'string') {
    compare = function (a, b) {
      return a.localeCompare(b);
    };
  } else {
    compare = function (a, b) {
      if (a < b) {
        return -1;
      } else if (a === b) {
        return 0;
      } else {
        return 1;
      }
    };
  }

  if (!ordinalBins) {
    // If we're being categorical, just return the value itself.
    // An external step is responsible for preventing too many
    // categorical values (e.g. the reduce step). TODO: if we
    // implement the fancier 2-pass idea in histogram_reduce.js,
    // then we SHOULD do something different here
    return value;
  } else {
    // Find which ordinal bin the value belongs to
    for (var i = 0; i < ordinalBins.length; i += 1) {
      // Does the value fit in this bin?
      if (compare(value, ordinalBins[i].lowBound) >= 0 &&
          compare(value, ordinalBins[i].highBound) < 0) {
        return ordinalBins[i].label;
      }
    }
    // Corner case: the highest value is inclusive
    if (compare(value, ordinalBins[ordinalBins.length - 1].highBound) <= 0) {
      return ordinalBins[ordinalBins.length - 1].label;
    }
    // Okay, the value didn't make it into any of the ordinal bins.
    // The bins must not include the full range of the data.
    return 'other';
  }
}

var es6exports = { // eslint-disable-line no-unused-vars
  coerceValue: coerceValue,
  createBins: createBins,
  findBinLabel: findBinLabel
};
