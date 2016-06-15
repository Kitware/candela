import d3 from 'd3';
import Geo from '../Geo';
import VisComponent from '../../VisComponent';
import { minmax } from '../../util';

export default class GeoDots extends VisComponent {
  static get options () {
    return [
      {
        name: 'data',
        type: 'table',
        format: 'objectlist'
      },
      {
        name: 'latitude',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number']
        }
      },
      {
        name: 'longitude',
        type: 'string',
        format: 'text',
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number']
        }
      },
      {
        name: 'color',
        type: 'string',
        format: 'text',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['string', 'date', 'number', 'integer', 'boolean']
        }
      },
      {
        name: 'size',
        type: 'string',
        format: 'text',
        optional: true,
        domain: {
          mode: 'field',
          from: 'data',
          fieldTypes: ['number', 'integer', 'boolean']
        }
      }
    ];
  }

  constructor (el, options) {
    super(el);

    let sizeTransform = 5;
    if (options.size) {
      const range = minmax(options.data.map(d => d[options.size]));
      const scale = d3.scale.linear()
        .domain([range.min, range.max])
        .range([3, 19]);

      sizeTransform = d => scale(d[options.size]);
    }

    let fillTransform = 'red';
    let strokeTransform = 'darkred';
    if (options.color && options.data.length > 0) {
      let fillScale, strokeScale;

      const type = typeof options.data[0][options.color];
      if (type === undefined || type === 'string') {
        fillScale = d3.scale.category10();
        strokeScale = 'black';
      } else {
        const range = minmax(options.data.map(d => d[options.color]));

        const red = d3.rgb('#ef6a62');
        const blue = d3.rgb('#67a9cf');
        const darkred = red.darker();
        const darkblue = blue.darker();

        fillScale = d3.scale.linear()
          .domain([range.min, range.max])
          .range([red, blue]);

        strokeScale = d3.scale.linear()
          .domain([range.min, range.max])
          .range([darkred, darkblue]);
      }

      fillTransform = d => fillScale(d[options.color]);
      if (strokeScale === 'black') {
        strokeTransform = 'black';
      } else {
        strokeTransform = d => strokeScale(d[options.color]);
      }
    }

    // TODO(choudhury): don't mutate the options object directly.
    options.layers = [
      {
        type: 'osm'
      },
      {
        type: 'feature',
        features: [
          {
            name: 'feature1',
            type: 'point',
            x: options.longitude,
            y: options.latitude,
            style: {
              radius: sizeTransform,
              fillColor: fillTransform,
              strokeColor: strokeTransform
            },
            data: options.data
          }
        ]
      }
    ];

    const center = {
      x: options.longitude || 0.0,
      y: options.latitude || 0.0
    };

    const map_options = Object.assign({
      map: {
        zoom: options.zoom || 1,
        center: center
      }
    }, options);

    this.geojs = new Geo(this.el, map_options);
  }

  render () {
    this.geojs.render();
  }
}
