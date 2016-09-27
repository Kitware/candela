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
