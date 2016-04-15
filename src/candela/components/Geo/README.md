# [candela](../..#readme).[components](..#readme).Bar

A bar chart. The **x** field should contain a distinct value for each bar, while
the **y** field will correspond to the height of each bar.

**extends** [VisComponent](../../VisComponent#readme)

### new Bar(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| x         | String | The x axis field. See [Axis Scales](../../#axis-scales). |
| y         | String | The y axis field. Must contain numeric data. See [Axis Scales](../../#axis-scales). |
| color     | String | The color field. See [Color Scales](../../#color-scales). |
| hover     | Array of String | The fields to display on hovering. |
