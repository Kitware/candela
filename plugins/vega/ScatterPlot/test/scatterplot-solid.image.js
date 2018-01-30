import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'scatterplot-solid',
  extraBaselines: ['scatterplot-solid-circle'],
  url: 'http://localhost:28000/examples/scatter-solid',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
