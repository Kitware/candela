.. _vega_templates:

Vega templates
==============

A Vega template is a JSON-serializable JavaScript object which translates
into a Vega specification when instantiated with a given set of options.
This enables a single specification to build Vega visualizations with a
variety of data sources and other customization options.

The central mechanic to a Vega template is ``@``-prefixed expressions that
signal the template engine to perform custom logic. The result of that
logic is injected into the result at the place that the expression occurs.
An ``@``-expression takes the following form: ::

    ["@op", arg, arg, ...]

This is not unlike a basic Scheme-like language. In general, the arguments
are first evaluated, then custom logic is performed using built-in JavaScript
functions implementing the various operations. The returned values of these
functions determine what data is injected into the template at that location.

get
---

Syntax: ::

    ["@get", name]

Retrieves the value of the option ``name``. The ``name`` may refer to a nested
value using dot-notation.

Example: ::

    transform(
      {"value": ["@get", "a.b"]},
      {a: {b: 4}}
    )
    ===
    {"value": 4}

.. _let:

let
---

Syntax: ::

    ["@let", [[name, value], [name, value], ...], body]

Evaluates ``body`` with a set of defined values. This overrides any prior
values of the specified names.

Example: ::

    transform(
      [
        "@let",
        [["a", 1], ["b", 2]],
        {"a": ["@get", "a"], "b": ["@get", "b"]}
      ],
      {b: 5}
    )
    ===
    {a: 1, b: 2}

defaults
--------

Syntax: ::

    ["@defaults", [[name, value], [name, value], ...], body]

Evaluates ``body`` with a set of default option values.
This behaves exactly like :ref:`let`, except that
if ``name`` was provided as an option, the
provided value is not overridden.

Example: ::

    transform(
      [
        "@defaults",
        [["a", 1], ["b", 2]],
        {"a": ["@get", "a"], "b": ["@get", "b"]}
      ],
      {b: 5}
    )
    ===
    {a: 1, b: 5}

map
---

Syntax: ::

    ["@map", array, item_name, body]

Evaluates ``body`` once for each item in ``array``, binding the current item
to ``item_name``. All non-null resulting values are concatenated into the
output array.

Example: ::

    transform(["@map", [1, 2, 3], "d", {a: ["@get", "d"]}])
    ===
    [{"a": 1}, {"a": 2}, {"a": 3}]

if
--

Syntax: ::

    ["@if", condition, then_clause, else_clause]

Evaluates the ``condition``. If the result is truthy in the JavaScript sense,
the ``then_clause`` is evaluated and the result is placed in the template,
otherwise the ``else_clause`` is evaluated and used.

Example: ::

    transform(["@if", false, 10, 20])
    ===
    20

eq, lt, gt
----------

Syntax: ::

    ["@eq", a, b]
    ["@lt", a, b]
    ["@gt", a, b]

Evaluates to ``true`` or ``false`` depending on the
result of JavaScript equality (``a === b``), less than (``a < b``), or greater
than (``a > b``).

Example: ::

    transform(["@lt", 10, 20])
    ===
    true

and, or
-------

Syntax: ::

    ["@and", arg, arg, ...]
    ["@or", arg, arg, ...]

Evaluates the logical AND or OR of the arguments.

Example: ::

    transform(["@and", true, true, false])
    ===
    false

length
------

Syntax: ::

    ["@length", obj]

Retrieves the ``.length`` property of ``obj`` if it is an Array or String.

Example: ::

    transform([["@length", "abc"], ["@length", [1, 2, 3, 4]])
    ===
    [3, 4]

mult, add
---------

Syntax: ::

    ["@mult", arg, arg, ...]
    ["@add", arg, arg, ...]

Computes the product or sum of a set of numbers.

Example: ::

    transform(["@mult", 3, 2, 4])
    ===
    24

join
----

Syntax: ::

    ["@join", separator, array]

Joins the ``array`` of Strings into a single string separated by a ``separator``.

Example: ::

    transform(["@join", ":", ["a", "b", "c"]])
    ===
    "a:b:c"

merge
-----

Syntax: ::

    ["@merge", a, b]

Merges the value of ``b`` into the value of ``a``.
If ``a`` and ``b`` (or corresponding sub-objects of ``a`` and ``b``) are objects,
the keys in the result will be the union of keys in ``a`` and ``b``.
If a matching key is found in both ``a`` and ``b``, the values
are recursively merged. If ``a`` and ``b``
(or corresponding sub-objects of ``a`` and ``b``) are arrays, the arrays are
concatenated with ``b``'s values following ``a``'s.

Example: ::

    transform(
      {
        "concatenate": ["@merge", [1, 2], [3]],
        "merge_keys": ["@merge", {"a": 1}, {"b": 2}]
      }
    )
    ===
    {
      "concatenate": [1, 2, 3],
      "merge_keys": {"a": 1, "b": 2}
    }

colorScale
----------

Syntax: ::

    ["@colorScale", options]

Creates a Vega Scale appropriate for coloring data elements by values in a
certain field. The ``options`` argument is an object with the following properties:

name (String)
    The name to give the scale.

values (:ref:`Table <table>`)
    The data table to be colored by the scale.

field (String)
    The field to be colored by the scale.

axis
----

Syntax: ::

    ["@axis", options]

Creates a horizontal or vertical axis for a Vega visualization.
This includes a Vega Scale component and Axis component, as well as
a set of Signals if the axis is to enable interactive pan and zoom.
The ``options`` argument is an object with the following properties:

axis (String)
    The type of axis, either ``"x"`` (horizontal) or ``"y"`` (vertical).

data (:ref:`Table <table>`)
    The data table represented by the axis.

field (String)
    The field of the data represented by the axis.

pan (Boolean)
    If ``true``, enables axis panning through drag events.

zoom (Boolean)
    If ``true``, enables axis zooming through scroll events.

The following options are passed through to the Vega Scale:
points, zero, nice, round, padding, domain. All are optional except the domain.
The following options are passed through to the Vega Axis:
grid, title, properties. All of these are optional.

isStringField
-------------

Syntax: ::

    ["@isStringField", array, field]

Returns ``true`` if the first element of ``array`` is an object with a key named
``field`` which holds a string. This is a convenience for writing conditional
code in Vega specifications depending on whether data contains string or
numeric values.

Example: ::

    transform(
      [
        "@isStringField",
        [{"a": "hi", "b": 1}, {"a": "there", "b": 2}],
        "a"
      ]
    )
    ===
    true

orient
------

Syntax: ::

    ["@orient", direction, obj]

Orients a Vega Mark object to a direction. This operation assumes the
incoming object is oriented horizontally.

**direction** Either ``"horizontal"`` (the object is returned unchanged),
or ``"vertical"`` (the object's x, y, width, and height properties are swapped).

**obj** A Vega Mark object.

Example: ::

    transform(
      [
        "@orient",
        "vertical",
        {
          "x": {"value": 10},
          "y": {"value": 20},
          "width": {"value": 40}
        }
      ]
    )
    ===
    {
      "y": {"value": 10},
      "x": {"value": 20},
      "height": {"value": 40}
    }
