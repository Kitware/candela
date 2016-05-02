import imageTest from '../../../util/imageTest';

imageTest({
  name: 'gantt',
  url: 'http://localhost:38000/examples/#gantt',
  selector: '#vis-element',
  threshold: 0.001
});
