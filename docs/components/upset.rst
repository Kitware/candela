.. _upset_comp:

=============
    UpSet
=============

An `UpSet <http://www.caleydo.org/tools/upset/>`_ set visualization.

UpSet interprets binary columns (i.e. columns with a literal ``"0"`` or ``"1"``,
``"true"`` or ``"false"``, ``"yes"`` or ``"no"``
in every row) as sets. Any field in the **sets** option will be interpreted in
this way. Since most data is not arranged in binary columns, the visualization
also supports arbitrary categorical fields with the **fields** option.
Each field specified in this list will first be preprocessed into a collection
of 0/1 columns that are then passed to UpSet.

For example, suppose the data table is: ::

    [
      {"id": "n1", "f1": 1, "f2": "x"},
      {"id": "n2", "f1": 0, "f2": "x"},
      {"id": "n3", "f1": 0, "f2": "y"}
    ]

You could create an UpSet visualization with the following options: ::

    new UpSet({
      data: data,
      id: 'id',
      sets: ['f1'],
      fields: ['f2']
    });

This would preprocess the ``f2`` field into ``f2 x`` and ``f2 y`` sets as follows
and make them available to UpSet: ::

    [
      {"id": "n1", "f1": 1, "f2 x": 1, "f2 y": 0},
      {"id": "n2", "f1": 0, "f2 x": 1, "f2 y": 0},
      {"id": "n3", "f1": 0, "f2 x": 0, "f2 y": 1}
    ]

This component can be found in the ``candela/dist/upset.js`` plugin bundle.

When including this bundle in your project, be sure the following packages
appear in your ``package.json``'s ``dependencies`` field:

.. code-block:: json

  {
    "d3": "^3.5.17",
    "datalib": "^1.7.3",
    "font-awesome-webpack": "0.0.4",
    "html-loader": "^0.4.3",
    "sass-loader": "^6.0.5",
    "UpSet": "git+https://github.com/jeffbaumes/upset#no-global-vars"
  }

Options
=======

data (:ref:`Table <table>`)
    The data table.

id (String)
    A field containing a unique identifier for each record.

fields (Array of String)
    A list of fields that will be shown on the UpSet view. Each value in each field
    will be converted to a set membership 0/1 field before being passed to UpSet.

sets (Array of String)
    A list of fields that will be shown on the UpSet view. Each field is assumed to
    already be a 0/1 set membership field.

metadata (Array of String)
    A list of fields that will be shown as metadata when drilling down to individual
    records. Numeric data will also be shown in summary box plots to the right of
    each set.
