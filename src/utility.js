import md5 from 'md5';

import colors from './colors.js'

export let failValue = (value, warning, fail) => {
  if (warning > fail) {
    // Lower values are better.
    return (value <= fail);
  } else {
    return (value >= fail);
  }
};

export let warningValue = (value, warning, fail) => {
  if (warning > fail) {
    // Lower values are better.
    return (value <= warning);
  } else {
    return (value >= warning);
  }
};

export let sanitizeSelector = (input) => {
    // Prefix with an '_' as selectors can't start with numbers.
    return '_' + md5(input);
};

export let standardRound = (input) => {
    return Math.round(input * 10000) / 10000
};

export let computeColor = (trend, value) => {
    if (trend.incompleteThreshold) {
      return colors.incomplete;
    } else {
      if (failValue(value,
                    trend.warning,
                    trend.fail)) {
        return colors.fail;
      } else if (warningValue(value,
                              trend.warning,
                              trend.fail)) {
        return colors.bad;
      } else {
        return colors.good;
      }
    }
};

export let deArray = (values, reducer) => {
      if (Array.isArray(values)) {
          return reducer(values);
      } else {
          return values;
      }
};
