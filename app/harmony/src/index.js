import vcharts from 'vcharts';

window.onload = () => {
  let chart = vcharts.chart('bar', {
    el: 'body',
    values: [[0, 5], [1, 7], [2, 8], [3, 3], [4, 10]],
    x: '0',
    y: '1'
  });
  window.onresize = () => chart.update();
};
