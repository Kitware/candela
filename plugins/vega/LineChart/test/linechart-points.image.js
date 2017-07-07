import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'linechart-points',
  url: 'http://localhost:28000/examples/line-points',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});
