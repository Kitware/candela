export function getElementSize (el) {
  const style = window.getComputedStyle(el, null);
  const width = window.parseInt(style.getPropertyValue('width'));
  const height = window.parseInt(style.getPropertyValue('height'));

  return {
    width,
    height
  };
}

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
