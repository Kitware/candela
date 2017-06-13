.. _scatterplot:

===================
    ScatterPlot
===================

A scatterplot. This visualization will plot values at specified **x** and **y**
positions. Additional fields may determine the **color**, **size**, and **shape**
of the plotted points.

This component can be found in the ``candela/dist/vega.js`` plugin bundle.

When including this bundle in your project, be sure the following packages
appear in your ``package.json``'s ``dependencies`` field:

.. code-block:: json

  {
    "datalib": "^1.7.3",
    "strip-json-comments-loader": "0.0.2",
    "vega": "^2.4.2"
  }

Example
=======

.. raw:: html

    <div id="scatterplot-example"></div>
    <script type="text/javascript" >
      var el = document.getElementById('scatterplot-example');

      var data = [];
      for (var d = 0; d < 10; d += 1) data.push({a: d, b: d});

      var vis = new candela.components.ScatterPlot(el, {
        data: data, x: 'a', y: 'b',
        width: 700, height: 400});
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
          b: d
        });
      }

      var vis = new candela.components.ScatterPlot(el, {
        data: data,
        x: 'a',
        y: 'b',
        width: 700,
        height: 400
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [{'a': d, 'b': d} for d in range(10)]

    pycandela.components.ScatterPlot(
        data=data, x='a', y='b', width=700, height=400)

**R**

.. code-block:: r

    library(candela)

    candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')

Options
=======

data (:ref:`Table <table>`)
    The data table.

x (String)
    The x axis field. Must contain numeric data. See :ref:`axis scales`.

y (String)
    The y axis field. Must contain numeric data. See :ref:`axis scales`.

size (String)
    The field used to size the points.

shape (String)
    The field used to determine the shape of each point.

color (String)
    The field used to color the points. See :ref:`color scales`.

hover (Array of String)
    The fields to display on hover.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
