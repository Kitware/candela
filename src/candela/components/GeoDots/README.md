# [candela](../..#readme).[components](..#readme).GeoDots

A geospatial view with locations marked by dots. The **latitude** and
**longitude** fields should contain lat/long values for each location in the
data.

**extends** [VisComponent](../../VisComponent#readme)

### new GeoDots(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| longitude | String | The longitude field. |
| latitude  | String | The latitude field. |
| zoom      | Integer | The initial zoom level. |
| center    | Object | An object with `longitude` and `latitude` properties specifying the initial center of the map. |
| tileUrl   | String | A tile URL template (see [GeoJS OSM layer options](http://opengeoscience.github.io/geojs/apidocs/geo.osmLayer.html)). Set to `null` to disable the OSM layer completely. |
| data      | [Table](../..#table) | The data table. |
