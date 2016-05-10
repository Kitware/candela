export default (a, b) => {
  if (!(a instanceof Object) ||
    !(b instanceof Object)) {
    return false;
  }
  let aKeys = Object.keys(a);
  let bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (let aKey of aKeys) {
    if (!b.hasOwnProperty(aKey) || a[aKey] !== b[aKey]) {
      return false;
    }
  }
  return true;
};
