## TrackerDash JQuery Plugin

This repository contains a set of JavaScript, Jade, and Stylus files that
compile into a single backbone view and an example page. The widget is
composed of a of backbone views that manage some D3 and NVD3 widgets.

### Build

To build the plugin run the following (this assumes you have
[nodejs](http://nodejs.org/) and [npm](https://www.npmjs.org/) installed):

```
npm install
npm run build
```

### Deployment

To deploy the widget, you will need to copy the contents of `dist` into your
app. This works for midas by running `copy_to_midas.sh`.

### Usage

For example usage see `index.html`. You can run this example app using the
webpack-dev-server by

```
npm run start
```

This will run the webpack-dev-server on all IPs to enable serving from a local
VM, which can be a security vulnerability if served directly from your host machine.
This server should be used for local development only.

The example app by default displays a TRUTH GT type dashboard with trends
and aggregate metrics provided.  The following query parameters can be
added to the URL bar to test alternate input data to the example app, and
can be used in any combination.

 * `imageProcessing` will change the input data to an Image Processing dashboard
 * `omitAggTrends` will remove any defined aggregate metrics, displaying the
default client-side calculate aggregate metrics which are derived from trend values
 * `omitTrends` will remove the trend thresholds and abbreviations, so the trend
values will be displayed without thresholds or abbreviations, and max values are
derived from the trend values
