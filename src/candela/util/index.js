export function getElementSize (el) {
  const style = window.getComputedStyle(el, null);
  const width = window.parseInt(style.getPropertyValue('width'));
  const height = window.parseInt(style.getPropertyValue('height'));

  return {
    width,
    height
  };
}
