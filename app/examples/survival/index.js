import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('SurvivalPlot', 'div', {
    data: [
      {
        time: 4,
        drug: 'A',
        censor: 1
      },
      {
        time: 16,
        drug: 'B',
        censor: 0
      },
      {
        time: 8,
        drug: 'A',
        censor: 0
      },
      {
        time: 42,
        drug: 'B',
        censor: 1
      },
      {
        time: 23,
        drug: 'A',
        censor: 0
      },
      {
        time: 15,
        drug: 'B',
        censor: 1
      }
    ],
    time: 'time',
    censor: 'censor',
    group: 'drug',
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
