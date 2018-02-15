import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'linechart-points',
  extraBaselines: [
    'linechart-points-circle',
    'linechart-points-circle2'
  ],
  url: 'http://localhost:28000/examples/line-points',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.002
});
