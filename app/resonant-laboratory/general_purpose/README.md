About this folder
=================

The stuff in here is strange voodoo; the javascript code in here is actually used directly in several places, including (but not limited to):

- in the browser on the client
- on the server via PyExecJS
- inside mongodb's mapreduce engine

As such, it's all ES5, and there's usually a bit of a mess in each file to get it to play nice in each environment. For example, to fake ES6 export statements, you'll see a final

```
var es6exports = { // eslint-disable-line no-unused-vars
  ...
};
```

statement that doesn't do anything in ES5 scenarios (PyExecJS / mongodb), but gets imported via the `exports-loader` in `webpack.config.js`. You can see an example
of how this gets imported in `views/widgets/DatasetView/comboScale.js`.
