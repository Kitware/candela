import test from 'tape';

import candela from '..';

const componentList = [
  'Histogram',
  'ParallelCoordinates',
  'ScatterPlot',
  'ScatterPlotMatrix'
];

function componentExists (t, cd, name) {
  const component = cd.components[name];

  t.ok(component, `candela.components.${name} exists`);
  t.equal(typeof component, 'function', `candela.components.${name} is a function`);
}

function structureTests (t, cd) {
  t.ok(cd, 'candela exists');

  t.ok(cd.VisComponent, 'candela.VisComponent exists');

  t.ok(cd.VisComponent.VisComponent, 'candela.VisComponent.VisComponent exists');
  t.equal(typeof cd.VisComponent.VisComponent, 'function', 'candela.VisComponent.VisComponent is a function');

  t.ok(cd.components, 'candela.components exists');

  t.equal(Object.keys(cd.components).length, componentList.length, `candela.components contains ${componentList.length} components`);

  componentList.forEach(name => {
    componentExists(t, cd, name);
  });
}

test('Structure and content of exported Candela library object', t => {
  structureTests(t, candela);
  t.end();
});

test('Structure and content of unminified Candela library file', t => {
  try {
    let candelaBuilt = require('../../../build/candela/candela.js');
    t.ok(candelaBuilt, 'The built candela.js file exists');

    if (candelaBuilt) {
      structureTests(t, candelaBuilt);
    }
  } catch (e) {
    t.skip('Built candela.js file does not exist');
  }

  t.end();
});
