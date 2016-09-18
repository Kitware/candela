==========================
    Candela Python API
==========================

The Candela Python library enables the use of interactive Candela
visualizations within `Jupyter <http://jupyter.org/>`_ notebooks.

.. py:function:: candela.components.ComponentName(**options)

    Creates an object representing the Candela visualization specified by
    the given `options`. `ComponentName` is the name of the Candela component,
    such as ScatterPlot. For a full list of components and their options,
    see :ref:`components_list`.

    If a pandas DataFrame is passed as an option, it is automatically converted
    to a list of records of the form ``[{"a": 1, "b": "foo"}, {"a": 2, "b": "baz"}]``
    before being sent to the Candela visualization.

To display a component, simply refer to the visualization, without assignment,
as the last statement in a notebook cell. You may also explicitly
display the visualization from anywhere within a cell using ``vis.display()``.
