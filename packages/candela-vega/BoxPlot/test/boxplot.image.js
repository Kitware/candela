import imageTest from '../../../../util/imageTest';

imageTest({
  name: 'boxplot',
  url: 'http://localhost:28000/examples/box',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
