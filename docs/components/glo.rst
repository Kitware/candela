=======================
    SimilarityGraph
=======================

An interactive similarity graph. Given a list of entities that encode a
connection strength to the other entities, this component creates a graph with
the entities as the nodes, and a link appearing between nodes whose connection
strength exceeds some threshold.

The **data** table contains a list of objects, each with an **id** field
containing a unique identifier for each entity. Each object should also have a
numeric fields named by the IDs of the other entities, containing a link
strength to each entity. If any entity's link strength is missing, it is
presumed to be 0. Each object may optionally contain a **color** field,
containing a value identifying its color, and a **size** field,
which is either a number (in pixels) for the radius of each node, or a string
identifying a field in **data** that contains a number that will be mapped to
the radius for each node. **threshold** is a numeric value specifying
the minimum value for a link strength to appear in the graph. **linkDistance**
sets the desired length of the links in pixels.

Example
=======

.. raw:: html

    <div id="similaritygraph-example" width="700" height="700"></div>
    <script type="text/javascript" >
      var el = document.getElementById('similaritygraph-example');

      var alphabet = 'abcdefghijklmnopqrstuvwxyz';
      var vowels = 'aeiou'.split('');

      var data = [];
      for (var i = 0; i < 26; i++) {
        var letter = {
          id: alphabet[i],
          size: 10 + i,
          color: vowels.indexOf(alphabet[i]) > 0 ? 'vowel' : 'consonant'
        };

        for (var j = 0; j < 26; j++) {
          letter[alphabet[j]] = Math.abs(j - i);
        }

        data.push(letter);
      }

      var vis = new candela.components.SimilarityGraph(el, {
        data: data,
        size: 'size',
        threshold: 20
      });
      vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="/static/candela.js"></script>
    <script>
      var el = document.createElement('div')
      el.setAttribute('width', 700);
      el.setAttribute('width', 700);

      document.body.appendChild(el);

      var alphabet = 'abcdefghijklmnopqrstuvwxyz';
      var vowels = 'aeiou'.split('');

      var data = [];
      for (var i = 0; i < 26; i++) {
        var letter = {
          id: alphabet[i],
          size: 10 + i,
          color: vowels.indexOf(alphabet[i]) > 0 ? 'vowel' : 'consonant'
        };

        for (var j = 0; j < 26; j++) {
          letter[alphabet[j]] = Math.abs(j - i);
        }

        data.push(letter);
      }

      var vis = new candela.components.SimilarityGraph(el, {
        data: data,
        size: 'size',
        threshold: 20
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [
      {'id': 'A', 'class': 0, 'A': 1.0, 'B': 0.5, 'C': 0.3},
      {'id': 'B', 'class': 1, 'A': 0.5, 'B': 1.0, 'C': 0.2},
      {'id': 'C', 'class': 1, 'A': 0.3, 'B': 0.2, 'C': 1.0}
    ]

    pycandela.components.SimilarityGraph(data=data, id='id', color='class', threshold=0.4)

**R**

.. code-block:: r

    library(candela)

    id = c('A', 'B', 'C')
    class = c(0, 1, 1)
    A = c(1.0, 0.5, 0.3)
    B = c(0.5, 1.0, 0.2)
    C = c(0.3, 0.2, 1.0)
    data = data.frame(id, class, A, B, C)

    candela('SimilarityGraph', data=data, id='id', color='class', threshold=0.4)

Options
=======

data (:ref:`Table <table>`)
    The data table.

id (String)
    The ID field. Can contain any data type, but the value should be unique to
    each data record.

color (String)
    The field used to color the nodes. See :ref:`color scales`.

size (String or Number)
    If a string, the field used to provide the radius for each node; if a
    number, the radius to use for *all* nodes.

threshold (Number)
    The link strength above which a link will appear in the graph.

linkDistance (Number)
    The desired length of each link in pixels.
