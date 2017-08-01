.. _treeheatmap:

===================
    TreeHeatmap
===================

A heatmap with optional hierarchies attached to the rows and columns.

This component can be found in the ``candela/plugins/treeheatmap`` plugin.

Example
=======

.. raw:: html

    <div id="treeheatmap-example" style="width:600px;height:600px"></div>
    <script type="text/javascript" >
      var el = document.getElementById('treeheatmap-example');

      d3.json('_static/heatmap.json', function (error, data) {
        var vis = new candela.components.TreeHeatmap(el, {
          data: data,
          scale: 'column'
        });
        vis.render();
      });
    </script>

The examples below assume you have downloaded the `example data <_static/heatmap.json>`_.

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela/dist/candela.min.js"></script>
    <div id="vis" style="width:600px;height:600px"></div>
    <script type="text/javascript" >
      var el = document.getElementById('vis');

      d3.json('heatmap.json', function (error, data) {
        var vis = new candela.components.TreeHeatmap(el, {
          data: data,
          scale: 'column'
        });
        vis.render();
      });
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela
    import json

    data = json.load(open('heatmap.json'))

    pycandela.components.TreeHeatmap(data=data, scale='column')

**R**

.. code-block:: r

    library(candela)
    library(jsonlite)

    fname <- 'heatmap.json'
    s <- readChar(fname, file.info(fname)$size)
    data <- fromJSON(s)

    candela('TreeHeatmap', data=data, scale='column')

Options
=======

data (:ref:`Table <table>`)
    The data table.

idColumn (String)
    A column with unique identifiers. If not set, the visualization will use a
    column with an empty name, or a column named "_" or "_id" if it exists.

scale (String)
    Specify whether to color the data values with a global scale ("global"),
    scale each row or column separately ("row" or "column"), or use a -1 to 1
    color scale suitable for a correlation matrix ("correlation").
    The view uses a global scale if this parameter is not specified.

clusterRows (Boolean)
    If set to true, orders the rows by hierarchical cluster linkage. This option
    requires specially-defined columns named "_cluster", "_child1", "_child2",
    "_distance", and "_size" to define the clustering of the rows.
    See the `heatmap <https://github.com/Kitware/pysciencedock/blob/master/pysciencedock/statistics/heatmap.py>`_
    analysis in `pysciencedock <https://github.com/Kitware/pysciencedock>`_ for
    an example of how to create the appropriate hierarchy columns.

clusterColumns (Boolean)
    If set to true, orders the columns by hierarchical cluster linkage. this
    option requires specially-defined rows named "_cluster", "_child1",
    "_child2", "_distance", and "_size" to define the clustering of the columns.
    See the `heatmap <https://github.com/Kitware/pysciencedock/blob/master/pysciencedock/statistics/heatmap.py>`_
    analysis in `pysciencedock <https://github.com/Kitware/pysciencedock>`_ for
    an example of how to create the appropriate hierarchy rows.

threshold (Number)
    The value to threshold by according to the threshold mode.

thresholdMode (String)
    If set, uses the threshold value to display only certain cells in the
    table. Valid values are "none" (no thresholding), "greater than"
    (show values greater than the threshold), "less than" (show values less
    than the threshold), or "absolute value greater than" (show only values
    whose absolute value is greater than the threshold. If set to anything other
    than "none", the threshold parameter must also be set.

removeEmpty (Boolean)
    If true, removes rows and columns that are entirely filtered out by the
    threshold. Clustering by rows and columns will not be used if this flag is
    set.
