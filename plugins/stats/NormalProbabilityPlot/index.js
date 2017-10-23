import ScatterPlot from '../../vega/ScatterPlot';

const rankit = (n) => (i) => {
  const a = n <= 10 ? 3.0 / 8.0 : 0.5;
  return phi_inv((i - a) / (n + 1 - 2 * a));
};

const phi_inv = (p) => Math.sqrt(2) * erf_inv(2 * p - 1);

const erf_inv = (x) => {
  const a = (8 * (Math.PI - 3)) / (3 * Math.PI * (4 - Math.PI));
  const two_over_pi_a = 2 / (Math.PI * a);
  const log_one_minus_x_squared = Math.log(1 - sq(x));

  return Math.sign(x) * Math.sqrt(Math.sqrt(sq(two_over_pi_a + log_one_minus_x_squared / 2) - log_one_minus_x_squared / a) - (two_over_pi_a + log_one_minus_x_squared / 2));
};

const sq = (x) => x * x;

const xformData = opts => {
  const data = [...opts.data];
  data.sort((a, b) => a - b);

  const rankit_func = rankit(data.length);

  const newData = data.map((d, i) => ({
    value: d,
    rankit: rankit_func(i)
  }));

  const ret = Object.assign({}, opts, {
    data: newData,
    x: 'rankit',
    xScale: {
      zero: false
    },
    y: 'value',
    yScale: {
      zero: false
    }
  });

  return ret;
};

export default class NormalProbabilityPlot extends ScatterPlot {
  constructor (el, options) {
    super(el, xformData(options));
  }
}
