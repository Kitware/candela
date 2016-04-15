# [candela](../..#readme).[components](..#readme).UpSet

An [UpSet](http://www.caleydo.org/tools/upset/) set visualization.

UpSet interprets binary columns (i.e. columns with a literal `"0"` or `"1"`
in every row) as sets. Any field in the `sets` option will be interpreted in
this way. Since most data is not arranged in binary columns, the visualization
also supports arbitrary categorical fields with the `fields` option.
Each field specified in this list will first be preprocessed into a collection
of 0/1 columns that are then passed to UpSet.

For example, suppose the data table is:

| id | f1 | f2 |
| :-- | :-- | :-- |
| n1 | 1 | x |
| n2 | 0 | x |
| n3 | 0 | y |

You could create an UpSet visualization with the following options:

```js
new UpSet({
  data: data,
  id: 'id',
  sets: ['f1'],
  fields: ['f2']
});
```

This would preprocess the `f2` field into `f2 x` and `f2 y` sets as follows
and make them available to UpSet:

| id | f1 | f2 x | f2 y |
| :-- | :-- | :-- | :-- |
| n1 | 1 | 1 | 0 |
| n2 | 0 | 1 | 0 |
| n3 | 0 | 0 | 1 |

**extends** [VisComponent](../../VisComponent#readme)

### new UpSet(el, options)

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

| Option     | Type   | Description  |
| :--------  | :----- | :----------- |
| data       | [Table](../..#table) | The data table. |
| id         | String | A field containing unique ids for each record. |
| sets       | Array of String | A list of fields containing 0/1 set membership information which will be populated in the UpSet view. |
| fields     | Array of String | A list of categorical fields that will be translated into collections of 0/1 sets for every distinct value in each field and populated in the UpSet view. |
