import { ScatterPlot } from '@candela/vega';

const xformData = opts => {
  const data = [...opts.data];
  data.sort((a, b) => a - b);

  const newData = data.map((d, i) => ({
    value: d,
    index: i
  }));

  const ret = Object.assign({}, opts, {
    data: newData,
    x: 'index',
    y: 'value',
    yScale: {
      zero: false
    }
  });

  return ret;
};

export default class DistributionPlot extends ScatterPlot {
  constructor (el, options) {
    super(el, xformData(options));
  }
}
