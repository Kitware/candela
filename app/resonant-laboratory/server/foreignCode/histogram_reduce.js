/* globals attrName, allCounts, params */

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
// function reduce (attrName, allCounts) {
//  var params = {...}
var counters = {};

// Before we go counting values that we see in the data
// (including special values that may or may not get a
// bin in the results, depending on whether they exist),
// we want to initialize all of our human bins to zero,
// so that there aren't weird gaps in ordinal histograms
params.binSettings[attrName].humanBins.forEach(function (bin) {
  counters[bin] = 0;
});

// Okay, now count everything
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
//  return counters;
// }
