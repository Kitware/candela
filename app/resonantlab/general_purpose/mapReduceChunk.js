/* globals map, reduce */

// This helper function maps a small chunk of raw data objects
// and reduces them; python handles the chunking problem,
// and passes chunks to this script (it stitches the specific
// map and reduce functions to the top of this file via string concatenation).
// The python script can then call reduce directly on the results
// of multiple mapReduceChunk calls

var chunk;
var counter = -1;  // eslint-disable-line no-unused-vars

function emit (key, obj) { // eslint-disable-line no-unused-vars
  if (!chunk.hasOwnProperty(key)) {
    chunk[key] = [];
  }
  chunk[key].push(obj);
}

function mapReduceChunk (objects, initialChunk) { // eslint-disable-line no-unused-vars
  chunk = {};
  var i;
  if (initialChunk) {
    for (i in initialChunk) {
      if (initialChunk.hasOwnProperty(i)) {
        emit(i, initialChunk[i]);
      }
    }
  }
  for (i = 0; i < objects.length; i += 1) {
    map.call(objects[i]);
  }
  for (i in chunk) {
    if (chunk.hasOwnProperty(i)) {
      chunk[i] = reduce(i, chunk[i]);
    }
  }
  return chunk;
}
