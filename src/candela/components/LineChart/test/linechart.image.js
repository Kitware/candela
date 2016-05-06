import imageTest from '../../../util/imageTest';

imageTest({
  name: 'linechart',
  url: 'http://localhost:28000/examples/#line',
  selector: '#vis-element',
  threshold: 0.001
});
