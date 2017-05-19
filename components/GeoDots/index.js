import d3 from 'geojs/node_modules/d3';
import Geo from '../Geo';
import VisComponent from '../../VisComponent';
import { minmax } from '../../util';

const computeSizeTransform = (data, sizeField) => {
  let sizeTransform = 5;
  if (sizeField) {
    const range = minmax(data.map(d => d[sizeField]));
    const scale = d3.scale.linear()
      .domain([range.min, range.max])
      .range([3, 19]);

    sizeTransform = d => scale(d[sizeField]);
  }

  return sizeTransform;
};

const computeColorTransforms = (data, color) => {
  let fillTransform = 'red';
  let strokeTransform = 'darkred';
  if (color && data.length > 0) {
    let fillScale, strokeScale;

    const type = typeof data[0][color];
    if (type === undefined || type === 'string') {
      fillScale = d3.scale.category10();
      strokeScale = 'black';
    } else {
      const range = minmax(data.map(d => d[color]));

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

    fillTransform = d => fillScale(d[color]);
    if (strokeScale === 'black') {
      strokeTransform = 'black';
    } else {
      strokeTransform = d => strokeScale(d[color]);
    }
  }

  return {
    fillTransform,
    strokeTransform
  };
};

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

    let width = options.width || 600;
    let height = options.height || 600;

    el.style.width = width + 'px';
    el.style.height = height + 'px';

    const sizeTransform = computeSizeTransform(options.data, options.size);
    const { fillTransform, strokeTransform } = computeColorTransforms(options.data, options.color);

    // TODO(choudhury): don't mutate the options object directly.
    options.layers = [];
    if (options.tileUrl !== null) {
      options.layers.push({
        type: 'osm',
        url: options.tileUrl
      });
    }

    options.layers.push({
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
    });

    options.center = options.center || {};
    const center = {
      x: options.center.longitude || 0.0,
      y: options.center.latitude || 0.0
    };

    const map_options = Object.assign({
      map: {
        zoom: options.zoom,
        center: center
      }
    }, options);

    this.geojs = new Geo(this.el, map_options);
    this.options = options;
  }

  render () {
    this.geojs.render();
  }

  update (options) {
    let points = this.geojs.layers[1];

    let changed = new Set();
    ['longitude', 'latitude', 'color', 'size'].forEach(opt => {
      if (options[opt]) {
        changed.add(opt);
        this.options[opt] = options[opt];
      }
    });

    if (changed.has('longitude') || changed.has('latitude')) {
      points.position(d => ({
        x: d[this.options.longitude],
        y: d[this.options.latitude]
      }));
    }

    if (changed.has('size')) {
      points.style('radius', computeSizeTransform(this.options.data, this.options.size));
    }

    if (changed.has('color')) {
      const { fillTransform, strokeTransform } = computeColorTransforms(this.options.data, this.options.color);
      points.style('fillColor', fillTransform)
        .style('strokeColor', strokeTransform);
    }

    if (changed.size > 0) {
      points.modified();
    }
  }
}
