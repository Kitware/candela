=================
    LineChart
=================

A line chart. The chart plots a line for the **y** field against a single
**x** field, optionally splitting into multiple lines using the **series** field.

This component can be found in the ``candela/plugins/vega`` plugin.

Example
=======

.. raw:: html

    <div id="linechart-example"></div>
    <script type="text/javascript" >
      var el = document.getElementById('linechart-example');

      var data = [];
      for (var d = 0; d < 10; d += 1) data.push({a: d, b: d});

      var vis = new candela.components.LineChart(el, {
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

      var vis = new candela.components.LineChart(el, {
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

    pycandela.components.LineChart(
        data=data, x='a', y='b', width=700, height=400)

**R**

.. code-block:: r

    library(candela)

    candela('LineChart', data=mtcars, x='mpg', y='wt', color='disp')

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

series (String)
    The optional field used to separate the data into multiple lines.

seriesType (String)
    The `data type`_ for the ``series`` field. The default is ``"nominal"``.

colorSeries (Boolean)
    Whether to color the different series and show a legend. The default is ``true``.

showPoints (Boolean)
    Whether to overlay points on the lines. The default is ``false``.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).

.. _data type: https://vega.github.io/vega-lite/docs/encoding.html#data-type
