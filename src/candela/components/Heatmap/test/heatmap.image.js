import imageTest from '../../../util/imageTest';

imageTest({
  name: 'heatmap',
  url: 'http://localhost:28000/examples/heatmap',
  selector: '#vis-element',
  threshold: 0.001
});
