import showComponent from '../util/showComponent';

import '../../examples/index.styl';

window.onload = () => {
  showComponent('ParallelCoordinates', 'canvas', {
    dataRoot: 'nba-heatmaps',
    fields: [
      'games',
      'age',
      'free throw percent',
      'minutes',
      'versatility index'
    ],
    width: 540,
    height: 360
  });
};
