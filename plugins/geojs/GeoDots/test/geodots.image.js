import imageTest from '../../../../test/util/imageTest';

imageTest({
  name: 'geodots',
  url: 'http://localhost:28000/examples/geodotsblank',
  selector: '#vis-element',
  threshold: 0.001
});
