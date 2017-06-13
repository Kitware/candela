=========================
    ScatterPlotMatrix
=========================

A scatterplot matrix. This visualization will display a scatterplot for every
pair of specified **fields**, arranged in a grid. An additional field
may determine the **color** of the points.

This component can be found in the ``candela/dist/vega.js`` plugin bundle.

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
    <script src="//unpkg.com/candela"></script>
    <script src="//unpkg.com/candela/dist/vega.min.js"></script>
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
    will generate an N-by-N matrix of scatterplots. The fields must contain
    numeric data. See :ref:`axis scales`.

color (String)
    The field used to color the points. See :ref:`color scales`.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
