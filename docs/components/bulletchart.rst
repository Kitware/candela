===================
    BulletChart
===================

A bullet chart based on the
`description by Perceptual Edge <http://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf>`_.
The visualization takes a numeric **value** and plots it on a one-dimensional
plot against comparison **markers** and background color **ranges**.

This component can be found in the ``candela/plugins/vega`` plugin.

Example
=======

.. raw:: html

    <div id="bulletchart-example"></div>
    <script type="text/javascript" >
      var el = document.getElementById('bulletchart-example');
      var vis = new candela.components.BulletChart(el, {
        value: 0.8,
        title: 'My measurement',
        subtitle: '... it is really important',
        ranges: [
          { min: 0, max: 0.2, foreground: 'gray', background: 'red' },
          { min: 0.2, max: 0.7, foreground: 'gray', background: 'yellow' },
          { min: 0.7, max: 1, foreground: 'gray', background: 'green' }
        ],
        width: 700,
        height: 100
      });
      vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela/dist/candela-all.min.js"></script>
    <script>
      var el = document.createElement('div')
      document.body.appendChild(el);

      var vis = new candela.components.BulletChart(el, {
        value: 0.8,
        title: 'My measurement',
        subtitle: '... it is really important',
        ranges: [
          { min: 0, max: 0.2, foreground: 'gray', background: 'red' },
          { min: 0.2, max: 0.7, foreground: 'gray', background: 'yellow' },
          { min: 0.7, max: 1, foreground: 'gray', background: 'green' }
        ],
        width: 700,
        height: 100
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    pycandela.components.BulletChart(
        value=0.8,
        title='My measurement',
        subtitle='... it is really important',
        ranges=[
            dict(min=0, max=0.2, foreground='gray', background='red'),
            dict(min=0.2, max=0.7, foreground='gray', background='yellow'),
            dict(min=0.7, max=1, foreground='gray', background='green')
        ],
        width=700,
        height=100
    )

**R**

.. code-block:: r

    library(candela)

    candela('BulletChart',
      value=0.8,
      title='My measurement',
      subtitle='... it is really important',
      ranges=data.frame(
        min=c(0, .2, .7), max=c(.2, .7, 1),
        foreground=c('gray', 'gray', 'gray'),
        background=c('red', 'yellow', 'green')),
      width=700,
      height=100
    )

Options
=======

value (Number)
    The value to plot in the bullet chart.

title (String)
    The title to show to the left of the chart.

subtitle (String)
    An optional subtitle to display below the title.

markers (Array of Number)
    Comparative markers to display as vertical lines.

ranges (Array of :ref:`Range <range>`)
    Background ranges to display under the chart.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).

.. _range:

Range specification
-------------------

A range represents a visual range of an axis with background and foreground colors.
It consists of an object with the following fields:

min (Number)
    The minimum value of the range.

max (Number)
    The maximum value of the range.

background (String)
    The background color of the range.

foreground (String)
    The color of values and markers that fall in this range (default: ``"black"``).
