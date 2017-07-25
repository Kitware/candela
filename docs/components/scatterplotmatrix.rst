=========================
    ScatterPlotMatrix
=========================

A scatterplot matrix. This visualization will display a scatterplot for every
pair of specified **fields**, arranged in a grid. Additional fields
may determine the **size**, **color**, and **shape** of the points.

This component can be found in the ``candela/plugins/vega`` plugin.

Example
=======

.. raw:: html

    <div id="scatterplotmatrix-example"></div>
    <script type="text/javascript" >
        var el = document.getElementById('scatterplotmatrix-example');

        var data = [];
        for (var d = 0; d < 10; d += 1) data.push({a: d, b: 10 - d, name: d});

        var vis = new candela.components.ScatterPlotMatrix(el, {
          data: data, fields: ['a', 'b']});
        vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela/dist/candela.min.js"></script>
    <script>
      var el = document.createElement('div')
      document.body.appendChild(el);

      var data = [];
      for (var d = 0; d < 10; d += 1) {
        data.push({
          a: d,
          b: 10 - d,
          name: d
        });
      }

      var vis = new candela.components.ScatterPlotMatrix(el, {
        data: data,
        fields: ['a', 'b']
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [{'a': d, 'b': 10 - d, 'name': d} for d in range(10)]

    pycandela.components.ScatterPlotMatrix(data=data, fields=['a', 'b'])

**R**

.. code-block:: r

    library(candela)

    candela('ScatterPlotMatrix', data=mtcars, fields=c('mpg', 'wt', 'disp'))

Options
=======

data (:ref:`Table <table>`)
    The data table.

fields (Array of String)
    The fields to use as axes in the scatterplot matrix. Specifying N fields
    will generate an N-by-N matrix of scatterplots.

color (String)
    The field used to color the points.

colorType (String)
    The `data type`_ for the ``color`` field. The default is ``"nominal"``.

size (String)
    The field used to size the points.

sizeType (String)
    The `data type`_ for the ``size`` field. The default is ``"quantitative"``.

shape (String)
    The field used to set the shape of the points.

shapeType (String)
    The `data type`_ for the ``shape`` field. The default is ``"nominal"``.

filled (String)
    Whether to fill the points or just draw the outline. The default is ``true``.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).

.. _data type: https://vega.github.io/vega-lite/docs/encoding.html#data-type
