import imageTest from './imageTest';

imageTest({
  name: 'barchart',
  dir: 'barchart',
  extraBaselines: [
    'barchart-circle',
    'barchart-circle2'
  ],
  url: 'http://localhost:28000/bar',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'boxplot',
  dir: 'boxplot',
  extraBaselines: ['boxplot-circle'],
  url: 'http://localhost:28000/box',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'ganttchart',
  dir: 'ganttchart',
  extraBaselines: ['ganttchart-circle'],
  url: 'http://localhost:28000/gantt',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.005
});

imageTest({
  name: 'histogram',
  dir: 'histogram',
  extraBaselines: ['histogram-circle'],
  url: 'http://localhost:28000/histogram',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.005
});

imageTest({
  name: 'linechart',
  dir: 'linechart',
  extraBaselines: ['linechart-circle'],
  url: 'http://localhost:28000/line',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'linechart-points',
  dir: 'linechart',
  extraBaselines: [
    'linechart-points-circle',
    'linechart-points-circle2'
  ],
  url: 'http://localhost:28000/line-points',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.002
});

imageTest({
  name: 'scatterplot',
  dir: 'scatterplot',
  extraBaselines: [
    'scatterplot-circle',
    'scatterplot-circle2'
  ],
  url: 'http://localhost:28000/scatter',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'scatterplot-solid',
  dir: 'scatterplot',
  extraBaselines: ['scatterplot-solid-circle'],
  url: 'http://localhost:28000/scatter-solid',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'scatterplotmatrix',
  dir: 'scatterplotmatrix',
  extraBaselines: [
    'scatterplotmatrix-circle',
    'scatterplotmatrix-circle2'
  ],
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
  extraBaselines: ['lineup-circle'],
  url: 'http://localhost:28000/lineup',
  selector: '#vis-element',
  delay: 2000,
  threshold: 0.001
});

imageTest({
  name: 'distributionplot',
  dir: 'distributionplot',
  extraBaselines: ['distributionplot-circle'],
  url: 'http://localhost:28000/distribution',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'distributionplot-bimodal',
  dir: 'distributionplot',
  extraBaselines: ['distributionplot-bimodal-circle'],
  url: 'http://localhost:28000/distribution-bimodal',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'normalprobabilityplot',
  dir: 'normalprobabilityplot',
  extraBaselines: ['normalprobabilityplot-circle'],
  url: 'http://localhost:28000/normalprobability',
  selector: '#vis-element',
  delay: 1000,
  threshold: 0.001
});

imageTest({
  name: 'normalprobabilityplot-bimodal',
  dir: 'normalprobabilityplot',
  extraBaselines: ['normalprobabilityplot-bimodal-circle'],
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
