import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'normalprobabilityplot-bimodal',
  extraBaselines: ['normalprobabilityplot-bimodal-circle'],
  url: 'http://localhost:28000/examples/normalprobability-bimodal',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
