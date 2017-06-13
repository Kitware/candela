.. _onset_comp:

=============
    OnSet
=============

An `OnSet <http://www.cc.gatech.edu/gvu/ii/setvis/>`_ set visualization.

OnSet interprets binary columns (i.e. columns with a literal ``"0"`` or ``"1"``,
``"true"`` or ``"false"``, ``"yes"`` or ``"no"`` in every row) as sets.
Any field in the **sets** option will be interpreted in
this way. Since most data is not arranged in binary columns, the visualization
also supports arbitrary categorical fields with the **fields** option.
Each field specified in this list will first be preprocessed into a collection
sets, one for each field value, with the name ``"<fieldName> <value>"``.

For example, suppose the data table is: ::

    [
      {"id": "n1", "f1": 1, "f2": "x"},
      {"id": "n2", "f1": 0, "f2": "x"},
      {"id": "n3", "f1": 0, "f2": "y"}
    ]

You could create an OnSet visualization with the following options: ::

    new OnSet({
      data: data,
      id: 'id',
      sets: ['f1'],
      fields: ['f2']
    });

This would preprocess the ``f2`` field into ``f2 x`` and ``f2 y`` sets as follows
and make them available to OnSet: ::

    f1: n1
    f2 x: n1, n2
    f2 y: n3

If the ``rowSets`` option is set to ``true``, the set membership is transposed
and the sets become: ::

    n1: f1, f2 x
    n2: f2 x
    n3: f2 y

This component can be found in the ``candela/dist/onset.js`` plugin bundle.

Options
=======

data (:ref:`Table <table>`)
    The data table.

id (String)
    A field containing unique ids for each record.

sets (Array of String)
    A list of fields containing 0/1 set membership information which will be
    populated in the OnSet view.

fields (Array of String)
    A list of categorical fields that will be translated into collections of 0/1
    sets for every distinct value in each field and populated in the OnSet view.

rowSets (Boolean)
    If ``false``, treat the columns as sets, if ``true``, treat the rows as
    sets. Default is ``false``.
