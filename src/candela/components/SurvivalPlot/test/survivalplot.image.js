import imageTest from '../../../util/imageTest';

imageTest({
  name: 'survivalplot',
  url: 'http://localhost:28000/examples/survival',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
