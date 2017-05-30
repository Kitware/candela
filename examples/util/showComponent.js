const showComponent = (Component, options) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  return new Component(div, options);
};

export default showComponent;
