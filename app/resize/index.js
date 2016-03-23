import candela from './../../src/candela';
import indexContent from './index.jade';
import 'javascript-detect-element-resize/detect-element-resize';
import './index.styl';

function showPage () {
  [...document.getElementsByClassName('page')].forEach((el) => {
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

  [...document.getElementsByClassName('vis-element')].forEach((el) => {
    let vis = new candela.components.Scatter(
      el,
      data,
      {
        x: 'x',
        y: 'y'
      }
    );
    vis.render();
    window.addResizeListener(el, () => vis.render());
  });

  window.setInterval(() => {
    document.getElementById('containing-table').style.width = (500 + Math.floor(Math.random() * 500)) + 'px';
  }, 1000);
});
