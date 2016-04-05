# [candela](../..#readme).[components](..#readme).Gantt

A Gantt chart. The **data** table must contain two numeric fields, **start** and **end**,
which specify the start and end of horizontal bars. A **label** field can specify
the name of each item.

**extends** [VisComponent](../../VisComponent#readme)

### new Gantt(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| label     | String | The field used to label each task. |
| start     | String | The field representing the start of each task. Must be numeric. |
| end       | String | The field representing the end of each task. Must be numeric. |
| level     | String | The string used as the level for hierarchical items. Currently supports two unique values, the first value encountered will be level 1 which is rendered more prominently, and the second value will be level 2. |
