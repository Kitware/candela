# vcharts

Reusable [Vega](http://vega.github.io/vega/) charts.

## Getting Started

### Installation with bower

```
bower install vcharts
```

Setup a scaffold `index.html` with the following contents:

```html
<html>
<head>
  <meta charset="UTF-8">
  <script src="bower_components/d3/d3.min.js"></script>
  <script src="bower_components/vega/vega.min.js"></script>
  <script src="bower_components/vcharts/vcharts.min.js"></script>
</head>
<body>
  <div id="vis"></div>
<script>
vcharts.chart('xy', {
  el: '#vis',
  series: [
    {
      name: 'series1',
      values: [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 3}
      ],
    }
  ]
});
</script>
</body>
```

### Installation with npm

```
npm install vcharts vega d3
```

Setup a scaffold `index.html` with the following contents:

```html
<html>
<head>
  <meta charset="UTF-8">
  <script src="node_modules/d3/d3.min.js"></script>
  <script src="node_modules/vega/vega.min.js"></script>
  <script src="node_modules/vcharts/vcharts.min.js"></script>
</head>
<body>
  <div id="vis"></div>
<script>
vcharts.chart('xy', {
  el: '#vis',
  series: [
    {
      name: 'series1',
      values: [
        {x: 0, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 2},
        {x: 3, y: 3}
      ],
    }
  ]
});
</script>
</body>
```

### View your visualization

Start your favorite local web server:

```
python -m SimpleHTTPServer 8080 .
```

Visit [http://localhost:8080/index.html](http://localhost:8080/index.html).

## API

### vcharts.chart()

Initialize a chart with the call

```js
var chart = vcharts.chart(chartType, options);
```

where *chartType* is one of the supported chart types.

The *options* argument is an object specifying the chart's options.
The following options are available to all charts:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| el        | DOM element or selector string | The container for the visualization. |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| width     | Number | Width of the chart in pixels. |
| height    | Number | Height of the chart in pixels. |

If *width* and/or *height* are not specified, they are computed based on
the width and height of the enclosing element *el*.

### chart.update()

Note that the *width* and *height* options are not
dynamically bound if left unset,
so if the width or height of *el* changes, or has just
been set programmatically, you may need to call `update` either in a
`setTimeout` or `window.resize` callback. The following
will set the *width* and *height* correctly after a DOM update:

```js
var div = $('#mydiv').css('width', '100px').css('height', '400px');

// Width and height will not be picked up yet since the DOM is not updated.
var chart = vcharts.chart(chartType, { el: div.get(0), /* more options */ });

// Refresh width and height here.
setTimeout(function () { chart.update(); }, 1);
```

The following will resize the chart when the window resizes:

```js
var chart = vcharts.chart(chartType, { el: '#mydiv', /* more options */ });

// Update size on window resize.
window.onresize = function () {
    chart.update();
};
```

### vcharts.chart('vega', options)

Generic Vega renderer. The following additional option is supported:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| spec      | Object | The Vega spec to render. |

### vcharts.chart('xy', options)

Plots (x,y) coordinate pairs as points and/or lines. The following
additional options are supported:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| series    | Array of [Series](#series) | The data series to render. |
| xAxis     | [Axis](#axis) | An object describing the *x* axis. |
| yAxis     | [Axis](#axis) | An object describing the *y* axis. |
| tooltip   | String | Mustache-style string template where `d` is the hovered data element, e.g. `'{{d.x}} -- {{d.y}}'`. |

### Series

A series describes the data and visual mappings for a list of x,y coordinates.
Series objects have the following options:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| name      | String | The name of the series to show in the legend. |
| values    | Array  | The array of items in the series. |
| x         | String | X position field. |
| y         | String | Y position field. |
| color     | String | Color as any CSS-compatible color string representation (e.g. `'blue'`, `'#ffffff'`). |
| line      | Boolean | Connect the series with a line (default *true*). |
| point     | Boolean | Render points (default *false*). |
| pointSize | Number | The size of points in square pixels. |
| lineWidth | Number | The width of the line in pixels. |

### Axis

An axis describes how to scale and display an axis. Axis objects have the
following options:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| title     | String | The axis title. |
| type      | String | The mode for axis scale, either `'linear'` (default) or `'time'`. |
| domain    | Array  | Two-element domain for the axis range of the form [*min*, *max*]. Defaults to the range of the data. |
| grid      | Boolean | Show gridlines (default *false*). |
| pan       | Boolean | Allow panning this axis with mouse drags (default *true*). |
| zoom      | Boolean | Allow zooming this axis with mouse wheel or swipe (default *true*). |
| ticks     | Array   | Specific values for tick marks on the axis. |

### vcharts.chart('bullet', options)

Bullet graphs based on the [description by Perceptual Edge](http://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf).
The following additional options are supported:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| value     | Number | The value to display as a solid bar. |
| title     | String | Title to display to the left. |
| subtitle  | String | Subtitle to display below the title. |
| markers   | Array  | Comparative markers to display with the form {value: *Number*}, displayed as a vertical line. |
| ranges    | Array of [Range](#range) | Background ranges to display under the chart. |
| axisFontSize | Number | Font size for axis labels. |
| labelFontSize | Number | Font size for value label. |
| titleFontSize | Number | Font size for title. |
| subtitleFontSize | Number | Font size for subtitle. |

#### Example

```js
vcharts.chart('bullet', {
  el: '#vis',
  value: 0.8,
  title: 'Error',
  subtitle: '% deviation from ground truth',
  markers: [{value: 0.05}],
  ranges: [
    {min: 0, max: 0.1, background: '#eeeeee'},
    {min: 0.1, max: 0.75, background: '#aaaaaa'},
    {min: 0.75, max: 1, background: '#888888'}
  ]
});
```

### Range

A range represents a visual range of an axis with background and foreground colors. Options available are:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| min       | Number | The minimum value of the range. |
| max       | Number | The maximum value of the range. |
| background | String | The background color of the range. |
| foreground | String | The color of values and markers that fall in this range (default: `'black'`). |

### vcharts.chart('bar', options)

Plots a bar chart. The following additional options are supported:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| values    | Array  | The array of items in the series. |
| x         | String | Field used to set the bar x position. |
| y         | String | Field used to set bar height. |
| fill      | String | Fill color for the bars. |
| hover     | String | Fill color when bar is hovered. |
| xAxis     | [Axis](#axis) | An object describing the *x* axis. |
| yAxis     | [Axis](#axis) | An object describing the *y* axis. |
| tooltip   | String | Mustache-style string template where `d` is the hovered data element, e.g. `'{{d.x}} -- {{d.y}}'`. |

### vcharts.chart('histogram', options)

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| values    | Array  | The array of items in the series. |
| bin       | String | Field to use for bin values. |
| discrete  | Boolean | If true, treats values as discrete and makes bins for each unique value. If false, treats values as continuous and makes bins that span the range of the data. |
| maxBins   | Number | The maximum number of bins to use. Unused if discrete is *true*. |
| fill      | String | Fill color for the bars. |
| hover     | String | Fill color when bar is hovered. |
| xAxis     | [Axis](#axis) | An object describing the *x* axis. |
| yAxis     | [Axis](#axis) | An object describing the *y* axis. |
| tooltip   | String | Mustache-style string template where *d* is the hovered bin with the fields *bin* and *count*, e.g. `'Count: {{d.count}}'`. |

### vcharts.chart('xymatrix', options)

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| values    | Array  | The array of items in the series. |
| fields    | Array  | The list of fields to use in the matrix of scatterplots. |
| color.field | String | If set, colors by this field. |
| color.type  | String | If *color.field* is set, specifies the type of scale (e.g. `"ordinal"` or `"linear"`). |
| color.value | String | If set, colors by this constant color. |

### vcharts.chart('box', options)

Statistical box plot based on work by [Jeffrey Heer and Randy Zwitch](https://groups.google.com/forum/#!topic/vega-js/Y1vLxaw9nuA).

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| values    | Array  | The array of items in the series. |
| fields    | Array  | The fields containing the values to summarize in the box plot. |
| group     | String | The field to group by for multiple boxes per field (optional). |
| fill      | String | The fill color for the box. |
| orient    | String | The orientation of the boxes, either `horizontal` or `vertical`. |
| boxSize   | Number | A number from 0 to 1 to specify box size, where a value of 1 makes box widths touch each other, and lower numbers produce spacing between boxes. |
| capSize   | Number | A number from 0 to 1 to specify end cap size, where a value of 1 makes caps widths touch each other, and lower numbers produce spacing between caps. |

### vcharts.chart('gantt', options)

Gantt chart.

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| values    | Array  | The array of items in the Gantt chart. Each object should have the fields *label* (the name of the item), *level* (either 1 for top-level or 2 for secondary), *enter* (the start value), and *leave* (the end value). Each item will be represented by a horizontal bar from *enter* to *leave*. |
| xAxis     | [Axis](#axis) | Attributes for the x (time) axis. |

## Development Build

Clone the repository:

```
git clone https://github.com/XDATA-Year-3/vcharts.git
cd vcharts
```

Build the library:

```
npm run build
```

Run the tests:

```
npm run test
```

## Release Instructions

To release a new verison *x.y.z*, first release to npm:

```bash
export VERSION=x.y.z
npm run test && npm run lint && npm run build # Should run without errors
git checkout -b version-$VERSION
```

Edit `package.json` to set the version to *x.y.z*, then:

```bash
git commit -am "Version bump to $VERSION"
git push -u origin version-$VERSION
```

Create PR on GitHub and merge to master, then:

```bash
git checkout master
git pull
npm run test && npm run lint && npm run build # This should again run without errors.
npm publish
```

Next, release to Bower, which amounts to creating a tag with the appropriate name
that contains the built library, which is normally gitignored.

```bash
git checkout -b bower-$VERSION
git add -f vcharts*
git commit -am "Bower $VERSION release"
git tag $VERSION
git push origin $VERSION
```

Go to GitHub releases page and edit the tag to make it a real GitHub release.

To make a new version of the website:

```bash
git checkout master
npm run build
git branch -D gh-pages
git checkout -b gh-pages
git add -f vcharts*
git add -f node_modules/d3/d3.*
git add -f node_modules/vega/vega.*
git commit -m "Updating website for $VERSION"
git push -f -u origin gh-pages
git checkout master
rm -rf node_modules/
npm install
npm run build
```
