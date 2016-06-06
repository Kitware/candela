# [candela](../..#readme).[components](..#readme).Geo

A geospatial chart.

**extends** [VisComponent](../../VisComponent#readme)

### new Geo(el, options)

* **el** is the DOM element that will contain the visualization or a map instance.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| geojs     | object | Key-value pairs describing [GeoJS map options](http://opengeoscience.github.io/geojs/apidocs/geo.map.html) |
| baseLayer | object | Key-value pairs describing [GeoJS layer options](http://opengeoscience.github.io/geojs/apidocs/geo.layer.html) for a base layer |
| features  | list(object) | A list of feature specifications for drawing on the map (see below) |

**options.features** is a list of objects, each of which takes the following form:

| Field     | Type   | Description  |
| :-------- | :----- | :----------- |
| name      | string | The name of the feature |
| type      | string | The feature type (current supported: `"point"`) |
| x         | string | The field to use for the feature's `x` coordinate |
| y         | string | The field to use for the feature's `y` coordinate |
| data      | [Table](../..#table) | The data table. |
