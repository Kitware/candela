import showComponent from '../util/showComponent';
import BulletChart from '../../../components/BulletChart';

window.onload = () => {
  showComponent(BulletChart, {
    value: 0.2,
    title: 'Error',
    subtitle: '% dev from ground truth',
    markers: [0.05],
    ranges: [
      {
        min: 0.0,
        max: 0.1,
        background: 'lightgray',
        foreground: 'rgb(102,191,103)'
      },
      {
        min: 0.1,
        max: 0.75,
        background: 'darkgray',
        foreground: 'rgb(255,179,24)'
      },
      {
        min: 0.75,
        max: 1.0,
        background: 'dimgray',
        foreground: 'rgb(228,0,0)'
      }
    ],
    width: 630,
    height: 550,
    padding: {
      left: 150,
      right: 20,
      top: 20,
      bottom: 30
    },
    renderer: 'svg'
  });
};
