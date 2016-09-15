===================
    ScatterPlot
===================

A scatterplot. This visualization will plot values at specified **x** and **y**
positions. Additional fields may determine the **color**, **size**, and **shape**
of the plotted points.

* **el** is the DOM element that will contain the visualization.

* **options** is an object with the following fields:

Example:

**ES2015/Webpack**

.. code-block:: js

    import ScatterPlot from candela.components.ScatterPlot

    var el = document.createElement('div');
    document.body.appendChild(el);
    var vis = new ScatterPlot(el, {data: [{a:1,b:1},{a:2,b:2}], x: 'a', y: 'b'});
    vis.render();

**ES5**

.. code-block:: js

    var el = document.createElement('div');
    document.body.appendChild(el);
    var vis = new candela.components.ScatterPlot(el, {data: [{a:1,b:1},{a:2,b:2}], x: 'a', y: 'b'});
    vis.render();

**Python**

.. code-block:: python

    import candela
    candela.ScatterPlot(data=list(dict(a=1,b=1),dict(a=2,b=2)), x='a', y='b')

**R**

.. code-block:: r

    library(candela)
    candela('ScatterPlot', data=mtcars, x='mpg', y='wt', color='disp')


width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in "svg" or "canvas" mode (default "canvas").

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
