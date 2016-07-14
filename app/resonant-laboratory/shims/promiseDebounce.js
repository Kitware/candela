// Helper to debounce a function that returns a promise
// (it doesn't make sense to wait when a promise is coming back anyway)

function promiseDebounce (func, duration) {
  return function () {
    if (func._debouncedPromise === undefined) {
      func._debouncedPromise = func.apply(this, arguments);
      window.setTimeout(() => {
        delete func._debouncedPromise;
      }, duration);
    }
    return func._debouncedPromise;
  };
}
export default promiseDebounce;
