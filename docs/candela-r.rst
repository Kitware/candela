=====================
    Candela R API
=====================

The Candela R library enables the use of interactive Candela visualizations
from `R Studio <https://www.rstudio.com/>`_ by exposing Candela as
`htmlwidgets <http://www.htmlwidgets.org/>`_.

.. function:: candela(name, ...)

    Creates a widget representing the Candela visualization specified by
    the given options. `name` is the name of the Candela component,
    such as ``"ScatterPlot"``. For a full list of components and their options,
    see :ref:`components_list`.

    If a data frame is passed as an option, it is automatically converted
    to a list of records of the form ``[{"a": 1, "b": "foo"}, {"a": 2, "b": "baz"}]``
    before being sent to the Candela visualization.
