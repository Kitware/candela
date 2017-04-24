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
containing a value identifying it into a color category, and a **size** field,
which is either a number (in pixels) for the radius of each node, or a string
identifying a field in **data** that contains the radius for each node.
**threshold** is a numeric value specifying the minimum value for a link
strength to appear in the graph.

Example
=======

.. raw:: html

    <svg id="similaritygraph-example" width="700" height="700"></svg>
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
      var el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
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

    data = [{'a': d, 'b': d} for d in range(10)]

    pycandela.components.BarChart(data=data, x='a', y='b')

**R**

.. code-block:: r

    library(candela)

    candela('BarChart', data=mtcars, x='mpg', y='wt', color='disp')

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
