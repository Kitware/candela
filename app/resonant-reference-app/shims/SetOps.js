// Some quick ugly patches for nicer set operation syntax.
// TODO: find a library that does this better, or wait for
// native ES6 support

export default {
  union: function (a, b) {
    return new Set([...a, ...b]);
  },
  intersection: function (a, b) {
    return new Set([...a].filter(x => b.has(x)));
  },
  difference: function (a, b) {
    return new Set([...a].filter(x => !b.has(x)));
  },
  symmetric_difference: function (a, b) {
    let result = new Set([...a]);
    for (let v of b) {
      if (result.has(v)) {
        result.delete(v);
      } else {
        result.add(v);
      }
    }
    return result;
  }
};
