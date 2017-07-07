================
    BarChart
================

A bar chart. The **x** field should contain a distinct value for each bar, while
the **y** field will correspond to the height of each bar.

This component can be found in the ``candela/plugins/vega`` plugin.

Example
=======

.. raw:: html

    <div id="barchart-example"></div>
    <script type="text/javascript" >
      var el = document.getElementById('barchart-example'), data = [];
      for (var d = 0; d < 10; d += 1) data.push({a: d, b: d});
      var vis = new candela.components.BarChart(el, {
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

      var vis = new candela.components.BarChart(el, {
        data: data,
        x: 'a',
        y: 'b'
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [{'a': d, 'b': d} for d in range(10)]

    pycandela.components.BarChart(data=data, x='a', y='b')

**R**

.. code-block:: r

    library(candela)

    candela('BarChart', data=mtcars, x='mpg', y='wt', color='disp')

Options
=======

data (:ref:`Table <table>`)
    The data table.

x (String)
    The x axis (bar position) field. Must contain numeric data. See :ref:`axis scales`.

y (String)
    The y axis (bar height) field. Must contain numeric data. See :ref:`axis scales`.

color (String)
    The field used to color the bars. See :ref:`color scales`.

hover (Array of String)
    The fields to display on hover.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
