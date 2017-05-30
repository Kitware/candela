import imageTest from '../../../util/imageTest';

imageTest({
  name: 'bulletchart',
  url: 'http://localhost:28000/examples/bullet',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
