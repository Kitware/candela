===============
    Heatmap
===============

A heatmap of a table. The heatmap displays a grid of rectangular patches for
a set of **fields** in the **data** table using a separate color scale
for each field. An optional **id** field is used to name the records,
and the records can be ordered using a **sort** field.

Example
=======

.. raw:: html

    <div id="heatmap-example"></div>
    <script type="text/javascript" >
        var el = document.getElementById('heatmap-example');

        var data = [];
        for (var d = 0; d < 10; d += 1) data.push({a: d, b: 10 - d, name: d});

        var vis = new candela.components.Heatmap(el, {
          data: data, fields: ['a', 'b'], id: 'name',
          width: 700, height: 400});
        vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela"></script>
    <script>
    var el = document.createElement('div')
    document.body.appendChild(el);

    var data = [];
    for (var d = 0; d < 10; d += 1) data.push({a: d, b: 10 - d, name: d});

    var vis = new candela.components.Heatmap(el, {
      data: data, fields: ['a', 'b'], id: 'name',
      width: 700, height: 400});
    vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import candela

    data = [{'a': d, 'b': 10 - d, 'name': d} for d in range(10)]

    candela.components.Heatmap(
        data=data, fields=['a', 'b'], id='name', width=700, height=400)

**R**

.. code-block:: r

    library(candela)

    candela('Heatmap', data=mtcars, fields=c('mpg', 'wt', 'disp'), id='_row')

Options
=======

data (:ref:`Table <table>`)
    The data table.

fields (Array of String)
    The fields to display in the heatmap. Numeric and date fields are colored
    with gradient color scales, while string fields are colored with categorical
    color scales.

sort (String)
    An optional field used to sort the records.

id (String)
    An optional field used to label the records. Must be a unique value for each
    record. If unset, uses an auto-generated `_id` field.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
