# [candela](../..#readme).[components](..#readme).Box

A boxplot. The visualization takes a set of measures (**fields**) and produces
a boxplot of each one. The optional **group** field will partition the data
into groups with matching value and make a boxplot (or set of boxplots)
for each group.

**extends** [VisComponent](../../VisComponent#readme)

### new Box(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option    | Type   | Description  |
| :-------- | :----- | :----------- |
| width     | Number | Width of the chart in pixels. See [Sizing](../../#sizing). |
| height    | Number | Height of the chart in pixels. See [Sizing](../../#sizing). |
| renderer  | String | Whether to render in "svg" or "canvas" mode (default "canvas"). |
| data      | [Table](../..#table) | The data table. |
| fields    | Array of String | The fields to use as measurements. The visualization will produce a boxplot for each field. Must contain numeric or temporal data. See [Axis Scales](../../#axis-scales). Axis type will be chosen by the inferred value of the first field in the array. |
| group     | String | The optional field to group by. Defaults to all records being placed in a single group. See [Axis Scales](../../#axis-scales). |
