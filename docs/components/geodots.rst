===============
    GeoDots
===============

A geospatial view with locations marked by dots, using `GeoJS
<https://geojs.readthedocs.io>`_. The **latitude** and **longitude** fields
should contain lat/long values for each location in the data.

Example
=======

.. raw:: html

    <div id="geodots-example" style="width: 700px; height: 700px"></div>
    <script type="text/javascript" >
        var el = document.getElementById('geodots-example');
        var data = [
          {lat: 41.702, lng: -87.644, a: 5},
          {lat: 41.617, lng: -87.693, a: 15},
          {lat: 41.715, lng: -87.712, a: 25}
        ];
        var vis = new candela.components.GeoDots(el, {
          zoom: 10,
          center: { longitude: -87.6194, latitude: 41.867516 },
          data: data,
          latitude: 'lat',
          longitude: 'lng',
          size: 'a',
          color: 'a'
        });
        vis.render();
    </script>

**ES6/Webpack**

.. code-block:: js

    import GeoDots from candela.components.GeoDots

    let el = document.createElement('div');
    document.body.appendChild(el);

    let data = [
      {lat: 41.702, lng: -87.644, a: 5},
      {lat: 41.617, lng: -87.693, a: 15},
      {lat: 41.715, lng: -87.712, a: 25}
    ];
    let vis = new GeoDots(el, {
      zoom: 10,
      center: { longitude: -87.6194, latitude: 41.867516 },
      data: data,
      latitude: 'lat',
      longitude: 'lng',
      size: 'a',
      color: 'a'
    });
    vis.render();

**ES5**

.. code-block:: js

    var el = document.createElement('div')
    document.body.appendChild(el);

    var data = [
      {lat: 41.702, lng: -87.644, a: 5},
      {lat: 41.617, lng: -87.693, a: 15},
      {lat: 41.715, lng: -87.712, a: 25}
    ];
    var vis = new candela.components.GeoDots(el, {
      zoom: 10,
      center: { longitude: -87.6194, latitude: 41.867516 },
      data: data,
      latitude: 'lat',
      longitude: 'lng',
      size: 'a',
      color: 'a'
    });
    vis.render();

**Python**

.. code-block:: python

    import candela

    data = [
        dict(lat=41.702, lng=-87.644, a=5),
        dict(lat=41.617, lng=-87.693, a=15),
        dict(lat=41.715, lng=-87.712, a=25)
    ]

    candela.GeoDots(
        zoom=10,
        center=dict(longitude=-87.6194, latitude=41.867516),
        data=data,
        latitude='lat',
        longitude='lng',
        size='a',
        color='a'
    )

**R**

.. code-block:: r

    library(candela)

    data = list(
      list(lat=41.702, lng=-87.644, a=5),
      list(lat=41.617, lng=-87.693, a=15),
      list(lat=41.715, lng=-87.712, a=25))

    candela('GeoDots',
      zoom=10,
      center=list(longitude=-87.6194, latitude=41.867516),
      data=data,
      latitude='lat',
      longitude='lng',
      size='a',
      color='a')

Options
=======

data (:ref:`Table <table>`)
    The data table.

longitude (String)
    The longitude field.

latitude (String)
    The latitude field.

color (String)
    The field to color the points by.

size (String)
    The field to size the points by. The field must contain numeric values.

zoom (Integer)
    The initial zoom level.

center (Object)
    An object with ``longitude`` and ``latitude`` properties specifying the
    initial center of the map.

tileUrl (String)
    A tile URL template (see `GeoJS OSM layer options
    <http://opengeoscience.github.io/geojs/apidocs/geo.osmLayer.html>`_). Set to
    ``null`` to disable the OSM layer completely.
