===============
    BoxPlot
===============

A boxplot. The visualization takes a set of measures (**fields**) and produces
a boxplot of each one. The optional **group** field will partition the data
into groups with matching value and make a boxplot (or set of boxplots)
for each group.

Example
=======

.. raw:: html

    <div id="boxplot-example"></div>
    <script type="text/javascript" >
        var el = document.getElementById('boxplot-example'), data = [];
        for (var d = 0; d < 10; d += 1) data.push({a: d, b: d/2 + 7});
        var vis = new candela.components.BoxPlot(el, {
            data: data, fields: ['a', 'b'],
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
    for (var d = 0; d < 10; d += 1) data.push({a: d, b: d/2 + 7});

    var vis = new candela.components.BoxPlot(el, {data: data, fields: ['a', 'b']});
    vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import candela

    data = [{'a': d, 'b': d/2 + 7} for d in range(10)]

    candela.components.BoxPlot(data=data, fields=['a', 'b'])

**R**

.. code-block:: r

    library(candela)

    candela('BoxPlot', data=mtcars, fields=c('mpg', 'wt', 'disp'))

Options
=======

data (:ref:`Table <table>`)
    The data table.

fields (Array of String)
    The fields to use as measurements. The visualization will produce a boxplot
    for each field. Must contain numeric or temporal data. See :ref:`axis
    scales`. Axis type will be chosen by the inferred value of the first field
    in the array.

group (String)
    The optional field to group by. Defaults to all records being placed in a
    single group. See :ref:`axis scales`.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
