import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'boxplot',
  extraBaselines: ['boxplot-circle'],
  url: 'http://localhost:28000/examples/box',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
