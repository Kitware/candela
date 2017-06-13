====================================
    GLO (Graph-Level Operations)
====================================

A `visualization framework <https://github.com/chadstolper/glo>`_ that treats
the data like nodes of a graph, and uses positioning and visual commands to
arrange them into different formats to implement different visualizations.

The **nodes** table contains a list of objects, each with an ``id`` field
containing a unique identifier, along with any other data attributes needed. The
**edges** table contains ``source`` and ``target`` fields referring to ``id``
values from the **nodes** table, an optional ``type`` field reading either
``Undirected`` or ``Directed``, an ``id`` field identifying each edge, and an
optional ``weight`` value. **width** and **height** control the size of the
canvas used for rendering the visualization.

This component can be found in the ``candela/dist/glo.js`` plugin bundle.

When including this bundle in your project, be sure the following packages
appear in your ``package.json``'s ``dependencies`` field:

.. code-block:: json

  {
    "d3": "^3.5.17",
    "exports-loader": "0.6.4",
    "glo": "github:ronichoudhury-work/glo#dist",
    "imports-loader": "0.7.1"
  }

Example
=======

.. raw:: html

    <div id="glo-example" width="200" height="700"></div>
    <script type="text/javascript" >
      var el = document.getElementById('glo-example');

      var alphabet = 'abcdefghijklmnopqrstuvwxyz';
      var vowels = 'aeiou'.split('');

      var nodes = [];
      for (var i = 0; i < 26; i++) {
        var letter = {
          id: i,
          label: alphabet[i],
          vowel: vowels.indexOf(alphabet[i]) > 0 ? 'vowel' : 'consonant'
        };

        for (var j = 0; j < 26; j++) {
          letter[alphabet[j]] = Math.abs(j - i);
        }

        nodes.push(letter);
      }

      var edges = [];
      var counter = 0;
      for (var i = 0; i < 26; i++) {
        for (var j = i + 1; j < 26; j++) {
          if (nodes[i][alphabet[j]] > 20) {
            edges.push({
              source: i,
              target: j,
              type: 'Undirected',
              id: counter++,
              weight: 1
            });
          }
        }
      }

      var vis = new candela.components.Glo(el, {
        nodes: nodes,
        edges: edges,
        width: 700,
        height: 200
      });

      vis.render();

      vis.distributeNodes('x');
      vis.colorNodesDiscrete('vowel');
      vis.curvedEdges();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela.js"></script>
    <script src="//unpkg.com/candela/dist/glo.min.js"></script>
    <script>
      var el = document.createElement('div')
      el.setAttribute('width', 700);
      el.setAttribute('width', 700);

      document.body.appendChild(el);

      var alphabet = 'abcdefghijklmnopqrstuvwxyz';
      var vowels = 'aeiou'.split('');

      var nodes = [];
      for (var i = 0; i < 26; i++) {
        var letter = {
          id: i,
          label: alphabet[i],
          vowel: vowels.indexOf(alphabet[i]) > 0 ? 'vowel' : 'consonant'
        };

        for (var j = 0; j < 26; j++) {
          letter[alphabet[j]] = Math.abs(j - i);
        }

        nodes.push(letter);
      }

      var edges = [];
      var counter = 0;
      for (var i = 0; i < 26; i++) {
        for (var j = i + 1; j < 26; j++) {
          if (nodes[i][alphabet[j]] > 20) {
            edges.push({
              source: i,
              target: j,
              type: 'Undirected',
              id: counter++,
              weight: 1
            });
          }
        }
      }

      var vis = new candela.components.Glo(el, {
        nodes: nodes,
        edges: edges,
        width: 700,
        height: 200
      });

      vis.render();

      vis.distributeNodes('x');
      vis.colorNodesDiscrete('vowel');
      vis.curvedEdges();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [
      {'id': 0, 'label': 'A', 'class': 0},
      {'id': 1, 'label': 'B', 'class': 1},
      {'id': 2, 'label': 'C', 'class': 1}
    ]

    edges = [
      {'id': 0, 'source': 0, 'target': 1},
      {'id': 1, 'source': 0, 'target': 2},
      {'id': 2, 'source': 2, 'target': 1}
    ]

    glo = pycandela.components.Glo(nodes=nodes, edges=edges)
    glo.render()
    glo.distributeNodes('x');
    glo.colorNodesDiscrete('class');
    glo.curvedEdges();

**R**

.. code-block:: r

    library(candela)

    id = c(0, 1, 2)
    label = c('A', 'B', 'C')
    class = c(0, 1, 1)
    nodes = data.frame(id, label, class)

    source = c(0, 0, 2)
    target = c(1, 2, 1)
    edges = data.frame(id, source, target)

    glo = candela('SimilarityGraph', nodes=nodes, edges=edges)
    glo.render()
    glo.distributeNodes('x')
    glo.colorNodesDiscrete('class')
    glo.curvedEdges()

Options
=======

nodes (:ref:`Table <table>`)
    The node table.

edges (:ref:`Table <table>`)
    The edge table.

width (number)
    The width of the drawing area.

height (number)
    The height of the drawing area.

Methods
=======

.. js:function:: colorNodesDiscrete (field)

  :param string field: The field to color by

  Use a categorical colormap to color the nodes by the values in ``field``.

.. js:function:: colorNodesContinuous (field)

  :param string field: The field to color by

  Use a continuous colormap to color the nodes by the values in ``field``.

.. js:function:: colorNodesDefault ()

  Revert the node color to the default state (no colormap).

.. js:function:: sizeNodes (field)

  :param string field: The field to size by

  Size the nodes according to the values in ``field``.

.. js:function:: sizeNodesDefault ()

  Revert the node size to the default state (constant sized).

.. js:function:: distributeNodes (axis[, attr])

  :param axis string: The axis on which to distribute the nodes
  :param attr string: The field to use for grouping the nodes

  Position the nodes evenly along ``axis``, which must be one of ``"x"``,
  ``"y"``, ``"rho"`` (radial axis), or ``"theta"`` (angle axis). If ``attr`` is
  given, the nodes will be partitioned and grouped according to it.

.. js:function:: positionNodes (axis, value)

  :param string axis: The axis on which to distribute the nodes
  :param string|number value: The field to draw position data from, or a
    constant

  Position the nodes along ``axis`` (see :js:func:`distributeNodes`) according
  to the data in ``value``. If ``value`` is a string, it refers to a column of
  data frome the **nodes** table; if it is a number, then all nodes will be
  positioned at that location.

.. js:function:: forceDirected ()

  Apply a force-directed positioning algorithm to the nodes.

.. js:function:: showEdges ()

  Display all edges between nodes.

.. js:function:: hideEdges ()

  Hide all edges between nodes.

.. js:function:: fadeEdges ()

  Render edges using a transparent gray color.

.. js:function:: solidEdges ()

  Render edges using black.

.. js:function:: incidentEdges ()

  Only render edges incident on a node when the mouse pointer is hovering over
  that node.

.. js:function:: curvedEdges ()

  Render edges using curved lines.

.. js:function:: straightEdges ()

  Render edges using straight lines.
