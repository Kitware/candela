import _ from 'underscore';

export function getElementSize (el) {
  const style = window.getComputedStyle(el, null);
  const width = window.parseInt(style.getPropertyValue('width'));
  const height = window.parseInt(style.getPropertyValue('height'));

  return {
    width,
    height
  };
}

export function deepCopy (o) {
  if (_.isUndefined(o)) {
    return undefined;
  }
  return JSON.parse(JSON.stringify(o));
}

export function concat (...lists) {
  return [].concat(...lists);
}
