import html from './index.jade';
import './index.styl';

export default function showComponent (Component, elementType, options) {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-container')
  .appendChild(document.createElement(elementType));
  el.setAttribute('id', 'vis-element');
  el.className = 'vis-full';

  let vis = new Component(el, options);
  vis.render();

  return vis;
}
