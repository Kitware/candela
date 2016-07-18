import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('SurvivalPlot', 'div', {
    data: [
      {
        ID: 1,
        time: 5,
        drug: 0,
        censor: 1
      },
      {
        ID: 2,
        time: 6,
        drug: 1,
        censor: 0
      },
      {
        ID: 3,
        time: 8,
        drug: 1,
        censor: 1
      },
      {
        ID: 4,
        time: 3,
        drug: 1,
        censor: 1
      },
      {
        ID: 5,
        time: 22,
        drug: 0,
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
