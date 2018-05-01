import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'scatterplot',
  extraBaselines: [
    'scatterplot-circle',
    'scatterplot-circle2'
  ],
  url: 'http://localhost:28000/examples/scatter',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
