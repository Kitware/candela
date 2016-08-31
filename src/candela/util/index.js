import { keys, type } from 'datalib';

export function getElementSize (el) {
  const style = window.getComputedStyle(el, null);
  const width = window.parseInt(style.getPropertyValue('width'));
  const height = window.parseInt(style.getPropertyValue('height'));

  return {
    width,
    height
  };
}

export function minmax (data) {
  let range = {
    min: null,
    max: null
  };

  if (data.length > 0) {
    range.min = range.max = data[0];

    for (let val of data) {
      if (val < range.min) {
        range.min = val;
      }

      if (val > range.max) {
        range.max = val;
      }
    }
  }

  return range;
}

export function inferAll (data) {
  let fields = keys(data[0]);
  let types = {};
  for (let i = 0; i < fields.length; i += 1) {
    types[fields[i]] = type.infer(data, '[' + fields[i] + ']');
  }
  return types;
}
