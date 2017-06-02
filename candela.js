import VisComponent from './VisComponent';

let components = {};

const registerComponent = (name, component) => {
  if (components.hasOwnProperty(name)) {
    throw new Error('fatal: component "' + name + '" already exists');
  }

  components[name] = component;
}

module.exports = {
  components,
  registerComponent,
  VisComponent: {
    VisComponent
  }
};
