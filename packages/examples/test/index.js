import imageTest from './imageTest';

imageTest({
  name: 'barchart',
  dir: 'barchart',
  url: 'http://localhost:28000/bar',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'boxplot',
  dir: 'boxplot',
  url: 'http://localhost:28000/box',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'ganttchart',
  dir: 'ganttchart',
  url: 'http://localhost:28000/gantt',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.005
});

imageTest({
  name: 'histogram',
  dir: 'histogram',
  url: 'http://localhost:28000/histogram',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.005
});

imageTest({
  name: 'linechart',
  dir: 'linechart',
  url: 'http://localhost:28000/line',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'linechart-points',
  dir: 'linechart',
  url: 'http://localhost:28000/line-points',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.002
});

imageTest({
  name: 'scatterplot',
  dir: 'scatterplot',
  url: 'http://localhost:28000/scatter',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'scatterplot-solid',
  dir: 'scatterplot',
  url: 'http://localhost:28000/scatter-solid',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'scatterplotmatrix',
  dir: 'scatterplotmatrix',
  url: 'http://localhost:28000/scattermatrix',
  selector: '#vis-element',
  delay: 4000,
  threshold: 0.001
});

imageTest({
  name: 'geo',
  dir: 'geo',
  url: 'http://localhost:28000/geoblank',
  selector: '#vis-element',
  threshold: 0.001,
  verbose: true
});

imageTest({
  name: 'geodots',
  dir: 'geo',
  url: 'http://localhost:28000/geodotsblank',
  selector: '#vis-element',
  threshold: 0.001
});

imageTest({
  name: 'lineup',
  dir: 'lineup',
  url: 'http://localhost:28000/lineup',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.001
});

imageTest({
  name: 'distributionplot',
  dir: 'distributionplot',
  url: 'http://localhost:28000/distribution',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'distributionplot-bimodal',
  dir: 'distributionplot',
  url: 'http://localhost:28000/distribution-bimodal',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'normalprobabilityplot',
  dir: 'normalprobabilityplot',
  url: 'http://localhost:28000/normalprobability',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'normalprobabilityplot-bimodal',
  dir: 'normalprobabilityplot',
  url: 'http://localhost:28000/normalprobability-bimodal',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

// imageTest({
  // name: 'trackerdash',
  // dir: 'trackerdash',
  // url: 'http://localhost:28000/trackerdash',
  // selector: '.trackerdash',
  // delay: 2000,
  // threshold: 0.02
// });
