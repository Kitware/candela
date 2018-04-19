import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'ganttchart',
  extraBaselines: ['ganttchart-circle'],
  url: 'http://localhost:28000/examples/gantt',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.005
});
