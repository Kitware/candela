import imageTest from '../../../../util/imageTest';

imageTest({
  name: 'scatterplot',
  url: 'http://localhost:28000/examples/scatter',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
