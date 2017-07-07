var context;
context = require.context('../plugins', true, /^((?!image).)*\.js$/);
context.keys().forEach(function (key) {
  // This function avoids importing the micropackage importers at this point,
  // since the JavaScript runtime seems to "cache" packages, so the registration
  // actions in these micropackages will not be repeated when the testing module
  // imports them later.
  var splits = key.split('/');
  if (!(splits.length === 3 && splits[2] === 'load.js')) {
    context(key);
  }
});

context = require.context('../util', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);

context = require.context('../VisComponent', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);
