import imageTest from '../../../util/imageTest';

imageTest({
  name: 'geo',
  url: 'http://localhost:28000/examples/geoblank',
  selector: '#vis-element',
  threshold: 0.001,
  verbose: true
});
