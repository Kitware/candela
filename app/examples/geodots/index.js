import showComponent from '../util/showComponent';
import GeoDots from '../../../components/GeoDots';

window.onload = () => {
  showComponent(GeoDots, {
    zoom: 10,
    center: {
      longitude: -87.6194,
      latitude: 41.867516
    },
    longitude: 'longitude',
    latitude: 'latitude',
    data: [
      {id: 10, longitude: -20, latitude: 10, c: 'A'},
      {id: 0, longitude: -87.578, latitude: 41.838, c: 'B'},
      {id: 1, longitude: -87.644, latitude: 41.702, c: 'A'},
      {id: 2, longitude: -87.693, latitude: 41.617, c: 'B'},
      {id: 3, longitude: -87.708, latitude: 41.953, c: 'A'},
      {id: 4, longitude: -87.700, latitude: 41.747, c: 'B'},
      {id: 5, longitude: -87.555, latitude: 41.806, c: 'A'},
      {id: 6, longitude: -87.335, latitude: 42.039, c: 'B'},
      {id: 7, longitude: -87.313, latitude: 41.615, c: 'C'}
    ]
  });
};
