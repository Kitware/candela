import VisComponent from './VisComponent';

let components = {};

const register = (component, name) => {
  if (name === undefined) {
    name = component.name;
  }

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

let mixins = {};

const registerMixin = (mixin, name) => {
  if (name === undefined) {
    name = mixin.name;
  }

  if (mixins.hasOwnProperty(name)) {
    throw new Error('fatal: mixin "' + name + '" already exists');
  }

  mixins[name] = mixin;
};

const unregisterMixin = (name) => {
  if (mixins.hasOwnProperty(name)) {
    delete mixins[name];
  }
};

const unregisterMixinAll = () => {
  Object.keys(mixins).forEach(unregisterMixin);
};

module.exports = {
  components,
  register,
  unregister,
  unregisterAll,
  mixins,
  registerMixin,
  unregisterMixin,
  unregisterMixinAll,
  VisComponent
};
