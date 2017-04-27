import html from './index.jade';
import './index.styl';

export default function showComponent (Component, options) {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-container')
    .appendChild(document.createElement('div'));
  el.setAttribute('id', 'vis-element');
  el.setAttribute('class', 'vis-full');

  let vis = new Component(el, options);
  vis.render();

  return vis;
}
