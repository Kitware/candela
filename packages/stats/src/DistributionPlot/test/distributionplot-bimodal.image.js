import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'distributionplot-bimodal',
  extraBaselines: ['distributionplot-bimodal-circle'],
  url: 'http://localhost:28000/examples/distribution-bimodal',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
