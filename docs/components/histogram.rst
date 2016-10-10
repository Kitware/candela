=================
    Histogram
=================

A histogram. The **bin** option specifies which field to summarize. By default,
each record in the **data** table will contribute 1 to the bin's total.
Specifying an **aggregate** field will instead add up that field's value for
the each bin.

Example
=======

.. raw:: html

    <div id="histogram-example"></div>
    <script type="text/javascript" >
        var el = document.getElementById('histogram-example');

        var data = [];
        for (var d = 0; d < 1000; d += 1) {
          data.push({a: Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random())});
        }

        var vis = new candela.components.Histogram(el, {
          data: data, bin: 'a',
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
      for (var d = 0; d < 1000; d += 1) {
        data.push({
          a: Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random())
        });
      }

      var vis = new candela.components.Histogram(el, {
        data: data,
        bin: 'a',
        width: 700,
        height: 400
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import candela
    from random import normalvariate as nv

    data = [{'a': nv(0, 1)} for d in range(1000)]

    candela.Histogram(data=data, bin='a', width=700, height=400)

**R**

.. code-block:: r

    library(candela)

    candela('Histogram', data=mtcars, bin='mpg')

Options
=======

data (:ref:`Table <table>`)
    The data table.

bin (String)
    The field to summarize. See :ref:`axis scales`.

aggregate (String)
    An optional field to aggregate per bin. Must contain numeric data. See
    :ref:`axis scales`.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
