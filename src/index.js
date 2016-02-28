import { dash as Dash } from './app';

window.onload = () => {
  let newDiv = document.createElement('div');
  newDiv.setAttribute('class', 'dash-container');
  document.body.appendChild(newDiv);
  const app = new Dash({
    el: '.dash-container',
    name: 'Beta Ground Truth',
    day: '2014-06-03',
    branch: 'master',
    warning: 0.4,
    fail: 0.7,
    max: 1.0,
    metric_name: 'RMSE euclids distance',
    aggregate_metric_name: '94th percentile RMSE',
    agg_trends: {
      'ALGA': [0.4, 0.5, 0.6, 0.8, 1.2, 0.55, 0.2],
      'ALGASBR': [0.4, 0.6, 0.6, 0.8, 1.2, 4, 5],
      'ALGC': [0.1, 0.1, 0.2, 0.3, 1.5, 1.55, 0.2],
      'ALGD-ONLINE': [0.4, 0.5, 0.6, 0.8, 2.2, 3.1415, 0.2]
    },
    totalDatasets: 15,
    totalDistance: 1243,
    percentErrorByDataset: [{
      dataset: 'dataset0.jpg',
      algorithm: 'alga',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset0.jpg',
      algorithm: 'sm',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset0.jpg',
      algorithm: 'ba',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset1',
      algorithm: 'alga',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset1',
      algorithm: 'sm',
      length: 300,
      mean: 15,
      current: 14,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset1',
      algorithm: 'ba',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset2',
      algorithm: 'alga',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset2',
      algorithm: 'sm',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset2',
      algorithm: 'ba',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset3',
      algorithm: 'alga',
      length: 300,
      mean: 11,
      current: 28,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset3',
      algorithm: 'sm',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 50
    }, {
      dataset: 'dataset3',
      algorithm: 'ba',
      length: 300,
      mean: 11,
      current: 5,
      target: 7,
      warning: 10,
      fail: 25,
      max: 27,
      callback: function () { console.log('dataset3-ba'); }
    }, {
      dataset: 'dataset3',
      algorithm: 'com',
      length: 300,
      mean: 11,
      current: 38,
      target: 7,
      warning: 10,
      fail: 25,
      max: 25,
      callback: function () { console.log('dataset3-com'); }
    }, {
      dataset: 'dataset2',
      algorithm: 'com',
      length: 300,
      mean: 11,
      current: 3,
      target: 7,
      warning: 10,
      fail: 25,
      max: 27,
      callback: function () { console.log('dataset2-com'); }
    }],
    datasetLabelMap: {
      'dataset2': 'rotation',
      'dataset1': 'label'
    },
    datasetMap: {
      'dataset3': 'http://www.trackerdash.com',
      'dataset2': function () { console.log('dataset 2'); }
    },
    trajectoryMap: {
      'dataset0.jpg': function () { console.log('dataset 0 -- trajectory'); },
      'dataset1': 'https://github.com'
    },
    algorithms: [{
      name: 'Visual-Inertial Odometry',
      abbreviation: 'ALGA'
    }, {
      name: 'ALGB (Pose Graph)',
      abbreviation: 'SM'
    }, {
      name: 'Bundle Adjustment',
      abbreviation: 'BA'
    }, {
      name: 'Concurrent Odometry and Mapping',
      abbreviation: 'ALGC'
    }]
  });
  app.render();
};
