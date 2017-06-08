import VisComponent from './VisComponent';

let components = {};

const register = (name, component) => {
  if (components.hasOwnProperty(name)) {
    throw new Error('fatal: component "' + name + '" already exists');
  }

  components[name] = component;
}

const unregister = (name) => {
  if (components.hasOwnProperty(name)) {
    delete components[name];
  }
}

const unregisterAll = () => {
  Object.keys(components).forEach(unregister);
};

module.exports = {
  components,
  register,
  unregister,
  unregisterAll,
  VisComponent
};
