# [candela](../..#readme).[components](..#readme).ScatterMatrix

A scatterplot matrix. This visualization will display a scatterplot for every
pair of specified **fields**, arranged in a grid. An additional field
may determine the **color** of the points.

**extends** [VisComponent](../../VisComponent#readme)

### new ScatterMatrix(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| fields    | Array of String | The fields to use as axes in the scatterplot matrix. Specifying N fields will generate an N-by-N matrix of scatterplots. The fields must contain numeric data. See [Axis Scales](../../#axis-scales). |
| color     | String | The field used to color the points. See [Color Scales](../../#color-scales). |
