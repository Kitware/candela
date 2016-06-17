import imageTest from '../../../util/imageTest';

imageTest({
  name: 'scatterplotmatrix',
  url: 'http://localhost:28000/examples/scattermatrix',
  selector: '#vis-element',
  threshold: 0.001
});
