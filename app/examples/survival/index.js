import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('SurvivalPlot', 'div', {
    data: [
      {
        ID: 1,
        time: 1,
        age: 5,
        censor: 1,
        survivors: 4
      },
      {
        ID: 2,
        time: 2,
        age: 6,
        censor: 0,
        survivors: 4
      },
      {
        ID: 3,
        time: 3,
        age: 8,
        censor: 1,
        survivors: 3
      },
      {
        ID: 4,
        time: 4,
        age: 3,
        censor: 1,
        survivors: 2
      },
      {
        ID: 5,
        time: 5,
        age: 22,
        censor: 1,
        survivors: 1
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
