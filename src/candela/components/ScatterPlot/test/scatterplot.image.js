import imageTest from '../../../util/imageTest';

imageTest({
  name: 'scatterplot',
  url: 'http://localhost:28000/examples/#scatter',
  selector: '#vis-element',
  threshold: 0.001
});
