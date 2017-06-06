import './index.styl';

const showComponent = (Component, options) => {
  const div = document.createElement('div');
  div.setAttribute('id', 'vis-element');

  document.body.appendChild(div);

  return new Component(div, options);
};

export default showComponent;
