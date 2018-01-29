import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'scatterplotmatrix',
  extraBaselines: ['scatterplotmatrix-circle'],
  url: 'http://localhost:28000/examples/scattermatrix',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
