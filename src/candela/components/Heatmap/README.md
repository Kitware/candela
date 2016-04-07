# [candela](../..#readme).[components](..#readme).Histogram

A heatmap of a table. The heatmap displays a grid of rectangular patches for
a set of **fields** in the **data** table using a separate color scale
for each field. An optional **id** field is used to name the records,
and the records can be ordered using a **sort** field.

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
| fields    | Array of String | The fields to display in the heatmap. Numeric and date fields are colored with gradient color scales, while string fields are colored with categorical color scales. |
| sort      | String | An optional field used to sort the records. |
| id        | String | An optional field used to label the records. Must be a unique value for each record. If unset, uses an auto-generated `_id` field. |
