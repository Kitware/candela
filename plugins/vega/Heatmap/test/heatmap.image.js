import imageTest from '../../../../util/imageTest';

imageTest({
  name: 'heatmap',
  extraBaselines: [
    'heatmap-travis'
  ],
  url: 'http://localhost:28000/examples/heatmap',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.001
});
