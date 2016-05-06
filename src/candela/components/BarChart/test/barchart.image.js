import imageTest from '../../../util/imageTest';

imageTest({
  name: 'barchart',
  url: 'http://localhost:28000/examples/#bar',
  selector: '#vis-element',
  threshold: 0.001
});
