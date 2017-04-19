import html from './index.jade';
import './index.styl';

const createDOMElement = (eltType) => {
  let ret = null;
  switch (eltType) {
  case 'svg':
    ret = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    break;

  default:
    ret = document.createElement(eltType);
  }

  return ret;
};

export default function showComponent (Component, elementType, options) {
  document.body.innerHTML = html();

  let el = document.getElementById('vis-container')
    .appendChild(createDOMElement(elementType));
  el.setAttribute('id', 'vis-element');
  el.setAttribute('class', 'vis-full');

  let vis = new Component(el, options);
  vis.render();

  return vis;
}
