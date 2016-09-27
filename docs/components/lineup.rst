.. _lineup_comp:

==============
    LineUp
==============

A `LineUp <http://www.caleydo.org/tools/lineup/>`_ table ranking visualization.

Example
=======

.. raw:: html

    <div id="lineup-example"></div>
    <script type="text/javascript" >
        var el = document.getElementById('lineup-example');

        var data = [];
        for (var d = 0; d < 10; d += 1) data.push({a: d, b: 10 - d, name: d});

        var vis = new candela.components.LineUp(el, {
          data: data, fields: ['a', 'b']});
        vis.render();
    </script>

**ES6/Webpack**

.. code-block:: js

    import LineUp from candela.components.LineUp

    let el = document.createElement('div');
    document.body.appendChild(el);

    let data = [];
    for (var d = 0; d < 10; d += 1) data.push({a: d, b: 10 - d, name: d});

    let vis = new LineUp(el, {data: data, fields: ['a', 'b']});
    vis.render();

**ES5**

.. code-block:: js

    var el = document.createElement('div')
    document.body.appendChild(el);

    var data = [];
    for (var d = 0; d < 10; d += 1) data.push({a: d, b: 10 - d, name: d});

    var vis = new candela.components.LineUp(el, {
      data: data, fields: ['a', 'b']});
    vis.render();

**Python**

.. code-block:: python

    import candela

    data = [{'a': d, 'b': 10 - d, 'name': d} for d in range(10)]

    candela.components.LineUp(data=data, fields=['a', 'b'])

**R**

.. code-block:: r

    library(candela)

    candela('LineUp', data=mtcars, fields=c('_row', 'mpg', 'wt', 'disp'))

Options
=======

data (:ref:`Table <table>`)
    The data table.

fields (Array of String)
    A list of fields that will be shown on the LineUp view.  The list determines
    the order of the fields.  If not supplied, all fields from the data are
    shown.

stacked (Boolean)
    Whether to display grouped measures as a stacked bar (default false).

histograms (Boolean)
    Whether to display histograms in the headers of each measure (default true).

animation (Boolean)
    Whether to animate transitions when the scoring metric changes (default
    true).
