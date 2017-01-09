import candela from '../../../candela';
import { iris } from '../util/datasets';
import html from './index.jade';

window.onload = () => {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-element');
  let vis = new candela.components.ScatterPlot(el, {
    data: iris,
    x: 'petalLength',
    y: 'petalWidth',
    color: 'sepalLength',
    shape: 'species',
    width: 620,
    height: 500
  });

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
};
