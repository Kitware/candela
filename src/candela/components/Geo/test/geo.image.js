import imageTest from '../../../util/imageTest';

imageTest({
  name: 'geo',
  url: 'http://localhost:28000/examples/#geo',
  selector: '#vis-element',
  threshold: 0.001
});