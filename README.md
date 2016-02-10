## TrackerDash JQuery Plugin

This repository contains a set of JavaScript, Jade, and Stylus files that
compile into a JQuery plugin and an example page. The widget is composed of a
set of backbone views that manage some D3 and NVD3 widgets.

### Build

To build the plugin run the following (this assumes you have
[nodejs](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed):

```
npm install
npm run build
```

### Deployment

To deploy the widget, you will need to copy the contents of `dist` into your app

### Usage

For usage instructions see `src/index.js`.
