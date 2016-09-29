About this folder
=================

There's some strange voodoo going on in here; the javascript code in this directory is actually used directly in several places, including (but not limited to):

- in the browser on the client
- on the server via PyExecJS
- inside mongodb's mapreduce engine

As such, it's all ES5, and there's usually a bit of a mess in each file to get it to play nice in each environment. For example, to fake ES6 export statements, you'll see a final

```
var es6exports = { // eslint-disable-line no-unused-vars
  ...
};
```

statement that doesn't do anything in ES5 scenarios (PyExecJS / mongodb), but gets imported via the `exports-loader` in `webpack.config.js` for client-side use. For a simple example, see how `binUtils` is imported and used in `models/Project.js`.

There are also complications to be aware of with regard to how files are stitched together. For example, to use this code with mongodb's mapreduce engine, the map and reduce script strings must contain exactly one function, and there is no way to pass any additional parameters. datasetItem.py gets around this by wrapping code like this:

```
function map () {
  var params = {... stringified parameter object ...};

  ... embedded code ...

}
```

There are also complications because mongodb can't return an array, so you will see seemingly unnecessary wrapping up of arrays in objects. For example, datasetItem.py appends this kind of return statement in reduce functions:

```
return {histogram: histogram};
```
