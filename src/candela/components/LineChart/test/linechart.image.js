import imageTest from '../../../util/imageTest';

imageTest({
  name: 'linechart',
  url: 'http://localhost:28000/examples/line',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
