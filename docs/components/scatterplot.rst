.. _scatterplot:

===================
    ScatterPlot
===================

A scatterplot. This visualization will plot values at specified **x** and **y**
positions. Additional fields may determine the **color**, **size**, and **shape**
of the plotted points.

This component can be found in the ``candela/plugins/vega`` plugin.

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
    <script src="//unpkg.com/candela/dist/candela.min.js"></script>
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
    The x axis field.

xType (String)
    The `data type`_ for the ``x`` field. The default is ``"quantitative"``.

y (String)
    The y axis field.

yType (String)
    The `data type`_ for the ``y`` field. The default is ``"quantitative"``.

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
