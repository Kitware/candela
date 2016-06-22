import imageTest from '../../../util/imageTest';

imageTest({
  name: 'lineup',
  url: 'http://localhost:28000/examples/lineup',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.001
});
