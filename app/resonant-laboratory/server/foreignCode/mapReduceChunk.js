/* globals map, reduce */

// This helper function maps a small chunk of raw data objects
// and reduces them; python handles the chunking problem,
// and passes chunks to this script (it stitches the specific
// map and reduce functions to the top of this file via string concatenation).
// The python script can then call reduce directly on the results
// of multiple mapReduceChunk calls

var chunk = [];

function emit (obj) { // eslint-disable-line no-unused-vars
  chunk.push(obj);
}

function mapReduceChunk (objects) { // eslint-disable-line no-unused-vars
  objects.forEach(function (obj) {
    map(obj);
  });
  return reduce(chunk);
}
