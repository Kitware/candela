import candela from 'candela';
import 'candela/plugins/geojs/load';

import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.GeoDots, {
    zoom: 10,
    center: {
      longitude: -87.6194,
      latitude: 41.867516
    },
    tileUrl: null,
    longitude: 'longitude',
    latitude: 'latitude',
    data: [
      {id: 0, longitude: -87.578, latitude: 41.838, c: 3},
      {id: 1, longitude: -87.644, latitude: 41.702, c: 3},
      {id: 2, longitude: -87.693, latitude: 41.617, c: 3},
      {id: 3, longitude: -87.708, latitude: 41.953, c: 3},
      {id: 4, longitude: -87.700, latitude: 41.747, c: 3},
      {id: 5, longitude: -87.555, latitude: 41.806, c: 3},
      {id: 6, longitude: -87.335, latitude: 42.039, c: 3},
      {id: 7, longitude: -87.313, latitude: 41.615, c: 3}
    ]
  });
};
