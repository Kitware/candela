import { Dummy } from './components/Dummy';
import $ from 'jquery';

function dummy () {
  let el = document.getElementById('raw');

  let data = [
    {
      text: 'one, two',
      color: 'blue'
    },

    {
      text: 'buckle my shoe',
      color: 'green'
    }
  ];

  let vis = new Dummy(el, data);

  window.setTimeout(() => {
    data = [
      {
        text: 'three, four',
        color: 'red'
      },

      {
        text: 'open the door',
        color: 'chartreuse'
      }
    ];

    vis.refresh(data);
  }, 1000);
}

import indexContent from './jade/index.jade';
import './styl/index.styl';

window.onload = () => {
  $('body').html(indexContent());

  dummy();
};
