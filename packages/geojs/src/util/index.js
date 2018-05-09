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
