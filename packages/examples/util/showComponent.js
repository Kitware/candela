import './index.styl';

const showComponent = (Component, options) => {
  const div = document.createElement('div');
  div.setAttribute('id', 'vis-element');

  document.body.appendChild(div);

  let vis = new Component(div, options);
  vis.render();
  return vis;
};

export default showComponent;
