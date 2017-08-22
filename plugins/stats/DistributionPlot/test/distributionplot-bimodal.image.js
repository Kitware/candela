import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'distributionplot-bimodal',
  url: 'http://localhost:28000/examples/distribution-bimodal',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
