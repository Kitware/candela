import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'scatterplotmatrix',
  extraBaselines: [
    'scatterplotmatrix-circle',
    'scatterplotmatrix-circle2'
  ],
  url: 'http://localhost:28000/examples/scattermatrix',
  selector: '#vis-element',
  delay: 4000,
  threshold: 0.001
});
