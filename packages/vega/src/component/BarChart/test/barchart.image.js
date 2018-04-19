import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'barchart',
  extraBaselines: [
    'barchart-circle',
    'barchart-circle2'
  ],
  url: 'http://localhost:28000/examples/bar',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
