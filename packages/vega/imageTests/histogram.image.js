import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'histogram',
  extraBaselines: ['histogram-circle'],
  url: 'http://localhost:28000/examples/histogram',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.005
});
