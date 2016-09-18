==============================
    Candela JavaScript API
==============================

* :ref:`candela.components <components_list>` - The built-in Candela components.
* :ref:`sizing`
* :ref:`matchings`
* :ref:`datatypes`
* :ref:`viscomponent` - The base class and mixins for Candela components.
* :ref:`util` - Candela utility functions.

.. _sizing:

Sizing
======

Components often have a **width** and **height** option, which specify the
width and height of the component in pixels.

.. _matchings:

Field matchings
===============

.. _axis scales:

Axis scales
-----------

Several components have options that relate to the axes of the visualization.
These are commonly called **x** and **y** but may also have more descriptive
names. The component will often automatically detect the type of values in
the field being mapped to an axis and will create an appropriate axis type,
such as evenly-spaced values for string fields and a continuous-ranged axis for
numeric and date fields. Visualizations showing continuous-ranged axes
often allow pan and zoom of the axis by dragging and scrolling in the
visualization area.

.. _color scales:

Color scales
------------

Many Candela components contain a **color** option, which will color the
visual elements by the field specified. When possible, **color** will detect
the type of the column and use an appropriate color scale.
For fields containing string/text values, the visualization will use
a color scale with distinct colors for each unique value.
For fields containing numeric or date values, the visualization will use
a smooth color gradient from low to high values.

.. _datatypes:

Data types
==========

.. _table:

Table
-----

A Candela table is an array of records of the form: ::

    [
      {
        "a": 1,
        "b": "Mark",
        "c": "Jun 1, 2010"
      },
      {
        "a": 2,
        "b": "Andy",
        "c": "Feb 6, 2010"
      },
      {
        "a": 3,
        "b": "Joe",
        "c": "Nov 27, 2010"
      }
    ]

.. _viscomponent:

Visualization components
========================

``VisComponent`` is the base class for Candela visualization components.
This class is intentionally minimal, because there are only a few common
features of all Candela components:

1. Candela components work on the web, so the constructor looks like ``new
   VisComponent(el)``, where ``el`` is (usually) a DOM element. The
   ``VisComponent`` constructor attaches ``el`` to the object, so you can always
   refer to it using ``this.el``.

2. Candela components perform some type of visualization, so they have a
   :ref:`render <render>` method. The base class :ref:`render <render>`
   simply raises an exception.

You can create a concrete visualization component by extending ``VisComponent``.
The following best practices maximize clarity, reusability, and interoperability
of your components (in the rest of this document, imagine that ``Component``
is declared as an extension of ``VisComponent``, such as ``BarChart``):

1. The :ref:`constructor <constructor>` should take an additional parameter
   ``options`` encapsulating all runtime options for the component.

2. The component should report its expected inputs in :js:attr:`Component.options`.

.. _constructor:

.. js:function:: var component = new Component(el, options)

    Constructs a new instance of the Candela component.

    * **el** is a valid container for the visualization. The container will often be
      a DOM element such as ``<div>``, but may need to be another type for certain
      visualizations.

    * **options** is an object containing the initial options for the visualization.
      This includes any data, visual matchings, or other settings pertinent to the
      visualization. Options are specified in the form ``{name: value}``.

    **Note**: The constructor for the abstract superclass is empty. You should use
    the constructor for specific subclasses of ``VisComponent``.

.. _render:

.. js:function:: component.render()

    Renders the component to its container using the current set of options.

    **Note**: The ``VisComponent`` ``render()`` method simply throws
    an exception; if you truly want your component to do nothing when it renders,
    simply redefine the method to be a no-op.

.. js:attribute:: component.serializationFormats

    The ``serializationFormats`` field is a list of strings of supported formats.
    Formats include:

    * ``'png'``: A base64-encoded string for a PNG image. The string may be placed in the
      ``src`` attribute of an ``<img>`` element to show the image.

    * ``'svg'``: A base64-encoded string for an SVG scene. The string may be placed in the
      ``src`` attribute of an ``<img>`` element to show the image.

.. js:function:: component.serialize(format)

    Serializes the component into the specified **format**.

.. js:attribute:: Component.options

    This static property is an array of :ref:`Option specifications <options>`,
    containing a description of the options this visualization accepts. This may
    be used to introspect the component to implement features such as automatic
    UI building.

.. js:attribute:: Component.container

    A static field containing the type of container this visualization can be added to.
    The most common is DOMElement.

.. _options:

Option specification
====================

An option specification describes an input to a visualization as part of the
:js:attr:`Component.options` array.
It is an object containing the following properties:

name (String)
    The name of the option.

type (String)
    The type of the option. Type and format follow
    `Girder Worker types/formats <http://girder-worker.readthedocs.org/en/latest/types-and-formats.html>`_.

format (String)
    The format (specific encoding within a type) of the option.
    Type and format follow
    `Girder Worker types/formats <http://girder-worker.readthedocs.org/en/latest/types-and-formats.html>`_.

domain (:ref:`Domain <domain>`)
    Optional. A restriction on this option’s set of allowed values.

.. _domain:

Domain specification
====================

The domain of an option restricts the set of allowed values for an option. It is
an object with the following properties:

mode (String)
    The domain mode, one of ``'choice'`` or ``'field'``. The ``'choice'``
    mode will allow a fixed set of options set in the ``'from'`` field.
    The ``'field'`` mode will allow a field or list of fields from another
    input. If the option type is ``'string'``, the option is a single field,
    and if the option type is ``'string_list'``,
    the option accepts a list of fields.

from (Array or String)
    If the mode is ``'choice'``, it is an array of strings to use as a
    dropdown. If the mode is ``'field'``, it is the name of the input from
    which to extract fields.

fieldTypes (Array)
    If mode is ``'field'``, this specifies the types of fields to support.
    This array may contain any combination of `datalib's supported field
    types <https://github.com/vega/datalib/wiki/Import#dl_type_infer>`_
    which include ``'string'``, ``'date'``, ``'number'``, ``'integer'``, and
    ``'boolean'``.

.. _util:

Utilities
---------

Candela utility functions.

.. js:function:: util.getElementSize(el)

    Returns an object with the fields ``width`` and ``height`` containing
    the current width and height of the DOM element **el** in pixels.

.. js:attribute:: util.vega
    Utilities for generating Vega specifications.

.. js:function:: util.vega.chart(template, el, options, done)

    Generates a Vega chart based on a **template** instantiated with **options**.

    **template** is the [Vega template](#vega-templates) representing the chart.

    **el** is the DOM element in which to place the Vega visualization.

    **options** is an object of ``{key: value}`` pairs, containing
    the options to use while compiling the template. The options may contain
    arbitrarily nested objects and arrays.

    **done** is a callback function to called when the Vega chart is generated.
    The function takes one argument that is the resulting Vega chart.

.. js:function:: util.vega.transform(template, options)

    Returns the instantiation of a **template** with the given **options**.
    This is the underlying function used by
    :js:func`util.vega.chart` to instantiate its template
    before rendering with the Vega library.

    **template** is the :ref:`Vega template <vega_templates>`.

    **options** is an object of ``{key: value}`` pairs, containing
    the options to use while compiling the template. The options may contain
    arbitrarily nested objects and arrays.
