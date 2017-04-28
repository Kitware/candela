import showComponent from '../util/showComponent';
import Geo from '../../../components/Geo';

window.onload = () => {
  showComponent(Geo, {
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
            name: 'feature1',
            type: 'point',
            x: 'a',
            y: 'b',
            data: [
              {id: 0, a: -87.578, b: 41.838, c: 3},
              {id: 1, a: -87.644, b: 41.702, c: 3},
              {id: 2, a: -87.693, b: 41.617, c: 3},
              {id: 3, a: -87.708, b: 41.953, c: 3},
              {id: 4, a: -87.700, b: 41.747, c: 3},
              {id: 5, a: -87.555, b: 41.806, c: 3},
              {id: 6, a: -87.335, b: 42.039, c: 3},
              {id: 7, a: -87.313, b: 41.615, c: 3}
            ]
          }
        ]
      }
    ]
  });
};
