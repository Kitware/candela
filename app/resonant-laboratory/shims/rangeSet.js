// These functions define operations on lists of ranges,
// including comparison, union, and intersection. Each range
// can have a lowBound, a highBound, both, or neither (where
// a lowBound or highBound is undefined, that range is unbounded).
// Note that lowBound and highBound do not need to be numbers;
// an arbitrary comparator may be supplied.

function defaultComparator (a, b) {
  if (a < b) {
    return -1;
  } else if (a === b) {
    return 0;
  } else {
    return 1;
  }
}

function compareHighBounds (a, b, comparator = defaultComparator) {
  if (!('highBound' in a)) {
    if (!('highBound' in b)) {
      // neither range is high-bounded
      return 0;
    } else {
      // b is high-bounded, but a is not
      return 1;
    }
  } else {
    if (!('highBound' in b)) {
      // a is high-bounded, but b is not
      return -1;
    } else {
      // which high boundary is higher?
      return comparator(a.highBound, b.highBound);
    }
  }
}

function compareLowBounds (a, b, comparator = defaultComparator) {
  if (!('lowBound' in a)) {
    if (!('lowBound' in b)) {
      // neither range is low-bounded
      return 0;
    } else {
      // b is low-bounded, but a is not
      return -1;
    }
  } else {
    if (!('lowBound' in b)) {
      // a is low-bounded, but b is not
      return 1;
    } else {
      // Which low boundary is lower?
      return comparator(a.lowBound, b.lowBound);
    }
  }
}

function compareRanges (a, b, comparator = defaultComparator) {
  // Compare lowBounds first, then highBounds.
  // Where a bound is missing, the range is open-ended
  // (we don't use Infinity because a and b might not
  // be numbers)
  let comp = compareLowBounds(a, b, comparator);
  if (comp === 0) {
    comp = compareHighBounds(a, b, comparator);
  }
  return comp;
}

function mostExtremeValue (values, direction,
  comparator = defaultComparator, excludeUnbounded = false) {
  let result = null;
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] === null) {
      // ignore null
      continue;
    } else if (values[i] === undefined) {
      if (excludeUnbounded) {
        continue;
      } else {
        // found an unbounded range; return our proxy for Infinity (undefined)
        return undefined;
      }
    } else if (result === null) {
      // first regular value encountered
      result = values[i];
    } else {
      let comp = comparator(values[i], result);
      if (direction === '>' && comp > 0) {
        // encountered a higher value; replace result
        result = values[i];
      } else if (direction === '<' && comp < 0) {
        // encountered a lower value; replace result
        result = values[i];
      }
    }
  }
  return result;
}

function copyRangeList (list) {
  let result = [];
  list.forEach((range, index) => {
    result.push({});
    if ('lowBound' in range) {
      result[index].lowBound = range.lowBound;
    }
    if ('highBound' in range) {
      result[index].highBound = range.highBound;
    }
  });
  return result;
}

function cleanRangeList (list, comparator = defaultComparator) {
  list = copyRangeList(list).sort(d => compareRanges(d, comparator));
  let indicesToTrash = [];

  for (let i = 0; i < list.length; i += 1) {
    let range = list[i];

    // Throw away any invalid ranges
    if ('highBound' in range && 'lowBound' in range &&
        comparator(range.highBound, range.lowBound) < 0) {
      indicesToTrash.push(i);
    }

    // Merge any overlapping ranges
    if (i > 0) {
      let lastRange = list[i - 1];
      if (!('highBound' in lastRange) || !('lowBound' in range) ||
          comparator(lastRange.highBound, range.lowBound) >= 0) {
        lastRange.highBound = mostExtremeValue(
          [lastRange.highBound, range.highBound], '>', comparator);
        lastRange.lowBound = mostExtremeValue(
          [lastRange.lowBound, range.lowBound], '<', comparator);
        // remove spurious undefined values
        if (lastRange.highBound === undefined) {
          delete lastRange.highBound;
        }
        if (lastRange.lowBound === undefined) {
          delete lastRange.lowBound;
        }
        indicesToTrash.push(i);
      }
    }
  }

  indicesToTrash.reverse().forEach(i => {
    list.splice(i, 1);
  });

  return list;
}

function rangeUnion (list1, list2, comparator = defaultComparator) {
  const IGNORE_RANGE = {
    lowBound: null,
    highBound: null
  };

  let result = [];
  list1 = cleanRangeList(list1);
  list2 = cleanRangeList(list2);

  let r = 0;
  let i1 = 0;
  let i2 = 0;

  while (i1 < list1.length || i2 < list2.length) {
    let l1 = i1 < list1.length ? list1[i1] : IGNORE_RANGE;
    let l2 = i2 < list2.length ? list2[i2] : IGNORE_RANGE;

    if (r >= result.length) {
      // We need to add a new range
      let newBin = {};
      let low = mostExtremeValue([l1.lowBound, l2.lowBound], '<', comparator);
      if (low !== undefined) {
        newBin.lowBound = low;
      }
      let high = mostExtremeValue([l1.highBound, l2.highBound], '>', comparator);
      if (high !== undefined) {
        newBin.highBound = high;
      }
      result.push(newBin);
      i1 += 1;
      i2 += 1;
      continue;
    }

    // If the current range is already high-unbounded,
    // we can terminate early
    if (!('highBound' in result[r])) {
      break;
    }

    // See if either range can be merged into the current one
    let mergedOne = false;
    if (l1 !== IGNORE_RANGE && (!('lowBound' in l1) ||
        comparator(l1.lowBound, result[r].highBound) <= 0)) {
      // The lower range intersects the current one; merge it
      result[r].highBound = mostExtremeValue(
        [result[r].highBound, list1[i1].highBound], '>', comparator);
      i1 += 1;
      mergedOne = true;
    }
    if (l2 !== IGNORE_RANGE && l2.lowBound <= result[r].highBound) {
      // The higher range intersects the current one; merge it
      result[r].highBound = mostExtremeValue(
        [result[r].highBound, list2[i2].highBound], '>', comparator);
      i2 += 1;
      mergedOne = true;
    }

    if (!mergedOne) {
      // Okay, we couldn't merge either range. This means
      // that we need to add a distinct range on the next
      // pass
      r += 1;
    }
  }

  return result;
}

function rangeIntersection (list1, list2, comparator = defaultComparator) {
  let result = [];
  list1 = cleanRangeList(list1);
  list2 = cleanRangeList(list2);
  // TODO: there's probably a more efficient way to do this...
  list1.forEach(l1 => {
    list2.forEach(l2 => {
      let newRange = {
        lowBound: mostExtremeValue([l1.lowBound, l2.lowBound], '>', comparator, true),
        highBound: mostExtremeValue([l1.highBound, l2.highBound], '<', comparator, true)
      };
      if (newRange.lowBound === null) {
        delete newRange.lowBound;
      }
      if (newRange.highBound === null) {
        delete newRange.highBound;
      }
      result.push(newRange);
    });
  });

  return cleanRangeList(result);
}

function rangeSubtract (list1, list2, comparator = defaultComparator) {
  list1 = cleanRangeList(list1);
  list2 = cleanRangeList(list2);

  let result = [];
  let i1 = 0;
  let i2 = 0;

  while (i1 < list1.length) {
    let l1 = list1[i1];
    if (i2 >= list2.length) {
      // Nothing left to subtract
      result.push(l1);
      i1 += 1;
      continue;
    }

    // Okay, we're going to assume that we're going
    // to keep l1, with some potential modifications...
    // including splitting. So construct a temporary
    // list of the new ranges that we're about to add
    let newRanges = [{}];
    if ('lowBound' in l1) {
      newRanges[0].lowBound = l1.lowBound;
    }
    if ('highBound' in l1) {
      newRanges[0].highBound = l1.highBound;
    }

    // Now go through the second list that will hack
    // up the stuff in newRanges
    list2.forEach(l2 => {
      let indicesToTrash = [];
      newRanges.forEach((newRange, index) => {
        // First, a corner case: if the range to subtract is
        // entirely inside the original range, we need to
        // split the original range
        if ('lowBound' in l2 && 'highBound' in l2 &&
            (!('lowBound' in newRange) ||
              comparator(l2.lowBound, newRange.lowBound) > 0) &&
            (!('highBound' in newRange) ||
              comparator(l2.highBound, newRange.highBound) < 0)) {
          let temp = {
            lowBound: l2.highBound
          };
          if ('highBound' in newRange) {
            temp.highBound = newRange.highBound;
          }
          newRanges.push(temp);
          newRange.highBound = l2.lowBound;
        } else {
          // Next, the regular case: chop off the ends of newRange

          // Try to chop off newRange's low bound
          if (compareLowBounds(l2, newRange) <= 0) {
            // l2's lowBound is below newRange's lowBound.
            // What's it going to do specifically?
            if (compareHighBounds(l2, newRange) >= 0) {
              // l2 kills off newRange entirely
              indicesToTrash.push(index);
            } else if (!('lowBound' in newRange) ||
                         comparator(l2.highBound, newRange.lowBound) > 0) {
              // l2 just chops off newRange's bottom bound
              newRange.lowBound = l2.highBound;
            }
          }

          // Try to chop off newRange's high bound
          if (compareHighBounds(l2, newRange) >= 0) {
            // l2's highBound is above newRange's highBound,
            // and we already know that its lowBound is above
            // newRange's lowBound... so there's only a chance
            // to chop:
            if (!('highBound' in newRange) ||
                  comparator(l2.lowBound, newRange.highBound) < 0) {
              newRange.highBound = l2.lowBound;
            }
          }
        }
      });
      indicesToTrash.reverse().forEach(i => {
        newRanges.splice(i, 1);
      });
    });

    result = result.concat(newRanges);
    i1 += 1;
  }

  return result;
}

export default {
  mostExtremeValue,
  compareRanges,
  cleanRangeList,
  rangeUnion,
  rangeIntersection,
  rangeSubtract
};
