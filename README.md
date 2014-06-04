## TrackerDash JQuery Plugin

This repository contains a set of JavaScript, Jade, and Stylus files that
compile into a JQuery plugin and an example page. The widget is composed of a
set of backbone views that manage some D3 and NVD3 widgets.

### Build

To build the plugin run the following (this assumes you have
[nodejs](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed):

```
npm install
```

This will run [grunt](http://gruntjs.com/) to compile, concatenate, and minify
the files necessary for the widget for distribution.

### Deployment

To deploy the widget, you need to include the following files in your web
application:

```
bootstrap.min.css
nv.d3.css
trackerdash.min.css
trackerdash.libs.min.js
trackerdash.min.js
```

The library file, `trackerdash.libs.min.js` packages D3, NVD3, Backbone,
Underscore, and JQuery. It is probably best to include this libraries separately
if they are used in other areas of your application.

### Important Changes

The version of `nv.d3.js` included in this repository has been modified from
the original version. The full source of those modification can be found
[here](https://github.com/cpatrick/nvd3). The changes made were to support
reversed bullet charts. Unfortunately, these changes currently break standard
NVD3 bullet charts.
