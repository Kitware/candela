# [candela](../..#readme).[components](..#readme).Histogram

A histogram. The **bin** option specifies which field to summarize. By default,
each record in the **data** table will contribute 1 to the bin's total.
Specifying an **aggregate** field will instead add up that field's value for
the each bin.

**extends** [VisComponent](../../VisComponent#readme)

### new Histogram(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| bin       | String | The field to summarize. See [Axis Scales](../../#axis-scales). |
| aggregate | String | An optional field to aggregate per bin. Must contain numeric data. See [Axis Scales](../../#axis-scales). |
