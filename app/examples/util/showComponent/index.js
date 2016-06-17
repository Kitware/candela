import candela from '../../../../src/candela';
import html from './index.jade';
import './index.styl';

export default function showComponent (which, elementType, options) {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-container')
  .appendChild(document.createElement(elementType));
  el.setAttribute('id', 'vis-element');
  el.className = 'vis-full';

  let vis = new candela.components[which](el, options);
  vis.render();
}
