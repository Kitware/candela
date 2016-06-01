# [candela](../..#readme).[components](..#readme).LineUp

A [LineUp](http://www.caleydo.org/tools/lineup/) table ranking visualization.

**extends** [VisComponent](../../VisComponent#readme)

### new LineUp(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option     | Type   | Description  |
| :--------  | :----- | :----------- |
| data       | [Table](../..#table) | The data table. |
| fields     | Array of String | A list of fields that will be shown on the LineUp view.  The list determines the order of the fields.  If not supplied, all fields from the data are shown. |
| stacked    | Boolean | Whether to display grouped measures as a stacked bar (default false). |
| histograms | Boolean | Whether to display histograms in the headers of each measure (default true). |
| animation  | Boolean | Whether to animate transitions when the scoring metric changes (default true). |
