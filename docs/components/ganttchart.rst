==================
    GanttChart
==================

A Gantt chart. The **data** table must contain two numeric fields, **start** and
**end**, which specify the start and end of horizontal bars. A **label** field
can specify the name of each item.

Example
=======

.. raw:: html

    <div id="ganttchart-example"></div>
    <script type="text/javascript" >
      var el = document.getElementById('ganttchart-example');
      var data = [
        {name: 'Do this', level: 1, start: 0, end: 5},
        {name: 'This part 1', level: 2, start: 0, end: 3},
        {name: 'This part 2', level: 2, start: 3, end: 5},
        {name: 'Then that', level: 1, start: 5, end: 15},
        {name: 'That part 1', level: 2, start: 5, end: 10},
        {name: 'That part 2', level: 2, start: 10, end: 15}
      ];
      var vis = new candela.components.GanttChart(el, {
        data: data, label: 'name',
        start: 'start', end: 'end', level: 'level',
        width: 700, height: 200
      });
      vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela"></script>
    <script>
      var el = document.createElement('div')
      document.body.appendChild(el);

      var data = [
        {name: 'Do this', level: 1, start: 0, end: 5},
        {name: 'This part 1', level: 2, start: 0, end: 3},
        {name: 'This part 2', level: 2, start: 3, end: 5},
        {name: 'Then that', level: 1, start: 5, end: 15},
        {name: 'That part 1', level: 2, start: 5, end: 10},
        {name: 'That part 2', level: 2, start: 10, end: 15}
      ];
      var vis = new candela.components.GanttChart(el, {
        data: data, label: 'name',
        start: 'start', end: 'end', level: 'level',
        width: 700, height: 200
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import candela

    data = [
        dict(name='Do this', level=1, start=0, end=5),
        dict(name='This part 1', level=2, start=0, end=3),
        dict(name='This part 2', level=2, start=3, end=5),
        dict(name='Then that', level=1, start=5, end=15),
        dict(name='That part 1', level=2, start=5, end=10),
        dict(name='That part 2', level=2, start=10, end=15)
    ];
    candela.components.GanttChart(
        data=data, label='name',
        start='start', end='end', level='level',
        width=700, height=200
    )

**R**

.. code-block:: r

    library(candela)

    data <- list(
        list(name='Do this', level=1, start=0, end=5),
        list(name='This part 1', level=2, start=0, end=3),
        list(name='This part 2', level=2, start=3, end=5),
        list(name='Then that', level=1, start=5, end=15),
        list(name='That part 1', level=2, start=5, end=10),
        list(name='That part 2', level=2, start=10, end=15))

    candela('GanttChart',
        data=data, label='name',
        start='start', end='end', level='level',
        width=700, height=200)

Options
=======

data (:ref:`Table <table>`)
    The data table.

label (String)
    The field used to label each task.

start (String)
    The field representing the start of each task. Must be numeric.

end (String)
    The field representing the end of each task. Must be numeric.

level (String)
    The string used as the level for hierarchical items. Currently supports two
    unique values, the first value encountered will be level 1 which is rendered
    more prominently, and the second value will be level 2.

width (Number)
    Width of the chart in pixels. See :ref:`sizing`.

height (Number)
    Height of the chart in pixels. See :ref:`sizing`.

renderer (String)
    Whether to render in ``"svg"`` or ``"canvas"`` mode (default ``"canvas"``).
