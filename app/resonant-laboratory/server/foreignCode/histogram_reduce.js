/* globals attrName, allHistograms, params */

/*
TODO: For now, we keep the first m categorical values that we encounter,
and throw the rest into an "other" bin.

Instead, we *SHOULD* count the top m-most frequent values...:
Pass #1:
  Run Heavy Hitters (sometimes aka "Misra-Gries" or just "Frequent Items"):
    - Value k was seen *at least* c times
    - Guaranteed to give values in the top p% most frequent items (but not
      guaranteed to give *all* values in the top p%... e.g. if all values
      are unique - think IDs - then every value will be in the top p%)
  And keep a Count-Min Sketch:
    - Value k was seen *at most* c times
... after the first pass, we should show the uncertainty in the visualization
Pass #2:
  Using the results of pass #1 (convenience idea: uncertain results will be cached in
    item metadata from the last time we hit the endpoint), we can get
    exact counts because we know which values to count a priori. We could (should)
    probably do stage 2 in in the map phase, because we already know the bins
*/

// This script is kind of sloppy, but to use this code with mongodb's
// mapreduce, the reduce script must contain exactly one function. Because of
// this, these two lines are appended in datasetItem.py (as params can vary,
// and there's no way to pass in parameters to these functions):
// function reduce (attrName, allHistograms) {
//  var params = {...}
var histogram = [];
var specialBins = {};
var binLookup = {};

var binSettings = params.binSettings[attrName];
if (binSettings === undefined) {
  binSettings = {
    humanBins: [],
    specialBins: ['count'],
    numBins: 0
  };
}

// Initialize all of our human bins to zero,
// so that there aren't weird gaps in ordinal histograms
binSettings.humanBins.forEach(function (label) {
  binLookup[label] = histogram.length;
  histogram.push({
    label: label,
    count: 0
  });
});

// Count everything
allHistograms.forEach(function (wrappedHistogram) {
  wrappedHistogram.histogram.forEach(function (bin) {
    if (binLookup.hasOwnProperty(bin.label)) {
      // We already have a bin for this value
      histogram[binLookup[bin.label]].count += bin.count;
    } else if (binSettings.specialBins.indexOf(bin.label) !== -1) {
      // This is a special bin; always count these
      if (!specialBins.hasOwnProperty(bin.label)) {
        specialBins[bin.label] = {
          label: bin.label,
          count: 0
        };
      }
      specialBins[bin.label].count += bin.count;
    } else {
      // This is a regular value that we don't have a bin for. Do we have space?
      if (histogram.length < binSettings.numBins) {
        // We still have room; create a new bin
        // TODO: do the fancier stuff outlined at the top of this file
        binLookup[bin.label] = histogram.length;
        histogram.push({
          label: bin.label,
          count: bin.count
        });
      } else {
        // Okay, there's no room left. Add a count to the special "other" bin
        if (!(specialBins.hasOwnProperty('other'))) {
          specialBins['other'] = {
            label: 'other',
            count: 0
          };
        }
        specialBins.other.count += bin.count;
      }
    }
  });
});

// Okay, add the special bins on to the end of the regular ones
// (starting with "other" if it exists)
if (specialBins.hasOwnProperty('other')) {
  histogram.push(specialBins.other);
  delete specialBins.other;
}
var bin;
for (bin in specialBins) {
  if (specialBins.hasOwnProperty(bin)) {
    histogram.push(specialBins[bin]);
  }
}

// datasetItem.py also stitches this on...
// mongo can't return an array, so we wrap it in an object
//  return {histogram: histogram};
// }
