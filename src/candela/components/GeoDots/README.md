# [candela](../..#readme).[components](..#readme).GeoDots

A geospatial view with locations marked by dots. The **x** and **y** fields
should contain longitude and latitude values for each location in the data.

**extends** [VisComponent](../../VisComponent#readme)

### new GeoDots(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| x         | Number | The longitude field. |
| y         | Number | The latitude field. |
| data      | [Table](../..#table) | The data table. |
