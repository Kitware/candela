import candela from './../../src/candela';
import AutoResize from './../../src/candela/VisComponent/mixin/AutoResize';
import indexContent from './index.jade';
import './index.styl';

function showPage () {
  [...document.getElementsByClassName('page')].forEach(el => {
    el.classList.add('hidden');
  });
  let pageId = 'main';
  if (window.location.hash.length > 1) {
    pageId = window.location.hash.slice(1);
  }
  document.getElementById(pageId).classList.remove('hidden');
}

window.addEventListener('load', () => {
  document.getElementsByTagName('body')[0].innerHTML = indexContent();
  showPage();
  window.addEventListener('hashchange', showPage, false);

  let data = [];
  for (let i = 0; i < 100; i += 1) {
    data.push({x: Math.random(), y: Math.random()});
  }

  [...document.getElementsByClassName('vis-element')].forEach(el => {
    let vis = new (AutoResize(candela.components.Scatter))(
      el,
      {
        data,
        x: 'x',
        y: 'y'
      }
    );
    vis.render();

    vis.on('resize', (w, h, me) => {
      console.log(`resize event: ${w}, ${h}`);
      me.render();
    });
  });

  window.setInterval(() => {
    document.getElementById('containing-table').style.width = (500 + Math.floor(Math.random() * 500)) + 'px';
  }, 1000);
});
