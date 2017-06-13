===========
    Geo
===========

A geospatial chart using `GeoJS <https://geojs.readthedocs.io>`_.

This component can be found in the ``candela/dist/geojs.js`` plugin bundle.

Example
=======

.. raw:: html

    <div id="geo-example" style="width: 700px; height: 700px"></div>
    <script type="text/javascript" >
        var el = document.getElementById('geo-example');
        var data = [
          {lat: 41.702, lng: -87.644},
          {lat: 41.617, lng: -87.693},
          {lat: 41.715, lng: -87.712}
        ];
        var vis = new candela.components.Geo(el, {
          map: {
            zoom: 10,
            center: { x: -87.6194, y: 41.867516 }
          },
          layers: [
            {
              type: 'osm'
            },
            {
              type: 'feature',
              features: [
                {
                  type: 'point',
                  data: data,
                  x: 'lng',
                  y: 'lat'
                }
              ]
            }
          ]
        });
        vis.render();
    </script>

**JavaScript**

.. code-block:: html

    <body>
    <script src="//unpkg.com/candela"></script>
    <script src="//unpkg.com/candela/dist/geojs.min.js"></script>
    <script>
      var el = document.createElement('div')
      el.style.width = '500px';
      el.style.height = '500px';
      document.body.appendChild(el);

      var data = [
        {lat: 41.702, lng: -87.644},
        {lat: 41.617, lng: -87.693},
        {lat: 41.715, lng: -87.712}
      ];
      var vis = new candela.components.Geo(el, {
        map: {
          zoom: 10,
          center: {
            x: -87.6194,
            y: 41.867516
          }
        },
        layers: [
          {
            type: 'osm'
          },
          {
            type: 'feature',
            features: [
              {
                type: 'point',
                data: data,
                x: 'lng',
                y: 'lat'
              }
            ]
          }
        ]
      });
      vis.render();
    </script>
    </body>

**Python**

.. code-block:: python

    import pycandela

    data = [
        dict(lat=41.702, lng=-87.644),
        dict(lat=41.617, lng=-87.693),
        dict(lat=41.715, lng=-87.712)
    ]

    pycandela.components.Geo(
        map=dict(
            zoom=10,
            center=dict(x=-87.6194, y=41.867516)
        ),
        layers=[
            dict(type='osm'),
            dict(
                type='feature',
                features=[
                    dict(type='point', data=data, x='lng', y='lat')
                ]
            )
        ]
    )

**R**

.. code-block:: r

    library(candela)

    data = list(
      list(lat=41.702, lng=-87.644),
      list(lat=41.617, lng=-87.693),
      list(lat=41.715, lng=-87.712))

    candela('Geo',
      map=list(
        zoom=10,
        center=list(x=-87.6194, y=41.867516)
      ),
      layers=list(
        list(type='osm'),
        list(
          type='feature',
          features=list(
            list(type='point', data=data, x='lng', y='lat')
          )
        )
      )
    )

Options
=======

map (Object)
    Key-value pairs describing `GeoJS map options <http://opengeoscience.github.io/geojs/apidocs/geo.map.html>`_.

layers (Array of :ref:`Layer <layer>`)
    The layers of the map.


.. _layer:

Layer specification
===================

A layer contains key-value pairs describing
`GeoJS layer options <http://opengeoscience.github.io/geojs/apidocs/geo.layer.html>`_.
These options are passed through to GeoJS, with the exception of the ``"features"``
option for a layer with ``type`` set to ``"feature"``. In this case, the
``"features"`` option is an array of :ref:`Feature specifications <feature>`.

.. _feature:

Feature specification
=====================

Each feature is an object with the following properties:

name (String)
    The name of the feature.

type (String)
    The feature type (currently supported: ``"point"``).

data (:ref:`Table <table>`)
    The data table.

x (String)
    The field to use for the feature's ``x`` coordinate.

y (String)
    The field to use for the feature's ``y`` coordinate.
