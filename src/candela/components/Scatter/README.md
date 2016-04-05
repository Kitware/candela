# [candela](../..#readme).[components](..#readme).Scatter

A scatterplot. This visualization will plot values at specified **x** and **y**
positions. Additional fields may determine the **color**, **size**, and **shape**
of the plotted points.

**extends** [VisComponent](../../VisComponent#readme)

### new Scatter(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| x         | String | The x axis field. Must contain numeric data. See [Axis Scales](../../#axis-scales). |
| y         | String | The y axis field. Must contain numeric data. See [Axis Scales](../../#axis-scales). |
| size      | String | The field used to size the points. |
| shape     | String | The field used to determine the shape of each point. |
| color     | String | The field used to color the points. See [Color Scales](../../#color-scales). |
| hover     | Array of String | The fields to display on hover. |
