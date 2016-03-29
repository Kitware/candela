import test from 'tape';

import VisComponent from '..';
import Events from '../mixin/Events';

test('Events mixin for VisComponent', t => {
  t.plan(5);

  let EventedVisComponent = class extends Events(VisComponent) {
    constructor (el, options) {
      super(el);

      this.options = options;
    }

    render () {
      this.value = this.options.value;
    }

    emitEvent () {
      this.emit('foobar', this.value);
    }
  };

  const el = 'I am a fake element';
  const options = {
    value: 42
  };

  let v = new EventedVisComponent(el, options);

  // Make sure the mixin mixed in.
  t.ok(v.emit, 'Component has emit() method from mixin');
  t.ok(v.on, 'Component has on() method from mixin');

  // Make sure the mixin didn't disrupt the constructor.
  t.equal(el, v.el, 'VisComponent constructor executed');

  // Make sure the mixin didn't disrupt the render() method.
  v.render();
  t.equal(v.value, options.value);

  // Make sure we can catch triggered events from the component.
  v.on('foobar', value => t.equal(value, options.value, 'Event is emitted properly'));
  v.emitEvent();
});
