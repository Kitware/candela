import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('SurvivalPlot', 'div', {
    data: [
      {
        time: 4,
        censor: 1
      },
      {
        time: 16,
        censor: 0
      },
      {
        time: 8,
        censor: 0
      },
      {
        time: 42,
        censor: 1
      },
      {
        time: 23,
        censor: 0
      },
      {
        time: 15,
        censor: 1
      }
    ],
    time: 'time',
    censor: 'censor',
    width: 625,
    height: 540,
    padding: {
      left: 45,
      right: 130,
      top: 20,
      bottom: 40
    },
    renderer: 'svg'
  });
};
