# [candela](../..#readme).[components](..#readme).UpSet

An [UpSet](http://www.caleydo.org/tools/upset/) set visualization.

**extends** [VisComponent](../../VisComponent#readme)

### new UpSet(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option     | Type   | Description  |
| :--------  | :----- | :----------- |
| data       | [Table](../..#table) | The data table. |
| id         | String | A field containing unique ids for each record. |
| sets       | Array of String | A list of fields containing 0/1 set membership information which will be populated in the UpSet view. |
