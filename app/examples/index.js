import candela from './../../src/candela';
import mainContent from './index.jade';
import visContent from './vis.jade';
import 'javascript-detect-element-resize/detect-element-resize';
import './index.styl';
import iris from './data/iris.json';
import stocks from './data/stocks.csv';
import dl from 'datalib';
import visualizations from './visualizations.json';

let datasets = {
  iris,
  stocks: dl.read(stocks, {type: 'csv'})
};
let visMap = {};
visualizations.forEach(v => {
  visMap[v.hash] = v;
});

function showPage () {
  let pageId = 'main';
  if (window.location.hash.length > 1) {
    pageId = window.location.hash.slice(1);
  }
  if (pageId === 'main') {
    document.getElementsByTagName('body')[0].innerHTML = mainContent({
      visualizations
    });
  } else {
    let properties = visMap[pageId];
    document.getElementsByTagName('body')[0].innerHTML = visContent(
      properties
    );
    let el = document.getElementById('vis-element');
    if (!Array.isArray(properties.options.data)) {
      properties.options.data = datasets[properties.options.data];
    }
    let vis = new candela.components[properties.component](
      el,
      properties.options
    );
    vis.render();
    window.addResizeListener(el, () => vis.render());
  }
}

window.addEventListener('load', () => {
  showPage();
  window.addEventListener('hashchange', showPage, false);
});
