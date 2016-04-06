# [candela](../..#readme).[components](..#readme).Line

A line chart. The chart plots a line for each specified **y** field
against a single **x** field.

**extends** [VisComponent](../../VisComponent#readme)

### new Line(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| x         | String | The field containing x-coordinates for the lines. The field must contain date or numeric data. |
| y         | Array of String | The fields containing y-coordinates for the lines. The fields must contain date or numeric data. |
