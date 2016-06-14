import candela from './../../src/candela';
import mainContent from './index.jade';
import visContent from './vis.jade';
import 'javascript-detect-element-resize/detect-element-resize';
import './index.styl';
import iris from './data/iris.json';
import stocks from './data/stocks.csv';
import msft from './data/msft.csv';
import simpsons from './data/simpsons.csv';
import simpsonsAlt from './data/simpsons-alternate.csv';
import dl from 'datalib';
import visualizations from './visualizations.json';

let datasets = {
  iris,
  stocks: dl.read(stocks, {type: 'csv', parse: 'auto'}),
  msft: dl.read(msft, {type: 'csv', parse: 'auto'}),
  simpsons: dl.read(simpsons, {type: 'csv', parse: 'auto'}),
  'simpsons-alternate': dl.read(simpsonsAlt, {type: 'csv', parse: 'auto'})
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

    if (properties.template) {
      let customTemplate;
      switch (properties.template) {
        case 'resize-full':
          customTemplate = require('./custom/resize-full/index.jade');
          document.getElementsByTagName('body')[0].innerHTML = customTemplate(properties);
          require('./custom/resize-full/index.js');
          break;

        case 'resize-table':
          customTemplate = require('./custom/resize-table/index.jade');
          document.getElementsByTagName('body')[0].innerHTML = customTemplate(properties);
          require('./custom/resize-table/index.js');
          break;

        case 'resize-matrix':
          customTemplate = require('./custom/resize-matrix/index.jade');
          document.getElementsByTagName('body')[0].innerHTML = customTemplate(properties);
          require('./custom/resize-matrix/index.js');
          break;

        case 'dynamic-linechart':
          customTemplate = require('./custom/dynamic-linechart/index.jade');
          document.getElementsByTagName('body')[0].innerHTML = customTemplate(properties);
          require('./custom/dynamic-linechart/index.js');
          break;

        default:
          console.log(`unregistered custom example: ${properties.template}`);
          break;
      }
    } else {
      document.getElementsByTagName('body')[0].innerHTML = visContent(properties);
      let el = document.getElementById('vis-container')
        .appendChild(document.createElement(properties.elementType || 'div'));
      el.setAttribute('id', 'vis-element');
      el.className = 'vis-full';
      if (!Array.isArray(properties.options.data)) {
        properties.options.data = datasets[properties.options.data];
      }
      let vis = new candela.components[properties.component](el, properties.options);

      // Attempt serialize() before render().
      if (vis.serialize) {
        vis.serialize('png').then(() => {
          throw new Error('serialize() should not be allowed before render()');
        }).catch(msg => {
          console.log('Yay! serialize() was correctly rejected with the message: ' + msg);
        });
      }

      vis.render();

      // Create download links for serializable charts
      let download = document.getElementById('download-link');
      let serialize = document.getElementById('serialize-links');
      vis.serializationFormats.forEach(format => {
        let element = document.createElement('button');
        element.innerHTML = format;
        element.addEventListener('click', () => {
          vis.serialize(format).then(value => {
            download.setAttribute('download', 'chart.' + format);
            download.setAttribute('href', value);
            download.click();
          });
        }, false);
        serialize.appendChild(element);
      });

      window.addResizeListener(el, () => vis.render());
    }
  }
}

window.addEventListener('load', () => {
  showPage();
  window.addEventListener('hashchange', showPage, false);
});
