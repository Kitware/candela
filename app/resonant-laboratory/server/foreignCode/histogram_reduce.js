function reduce (attrName, allCounts) {  // eslint-disable-line no-unused-vars
  var counters = {};
  allCounts.forEach(function (binCounts) {
    var bin;
    for (bin in binCounts) {
      if (binCounts.hasOwnProperty(bin)) {
        if (!counters.hasOwnProperty(bin)) {
          counters[bin] = 0;
        }
        counters[bin] += binCounts[bin];
      }
    }
  });
  return counters;
}
