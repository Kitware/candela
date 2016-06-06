import imageTest from '../../../util/imageTest';

imageTest({
  name: 'geodots',
  url: 'http://localhost:28000/examples/#geodots',
  selector: '#vis-element',
  threshold: 0.001,
  verbose: true
});
