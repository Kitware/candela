import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'distributionplot',
  extraBaselines: ['distributionplot-circle'],
  url: 'http://localhost:28000/examples/distribution',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
