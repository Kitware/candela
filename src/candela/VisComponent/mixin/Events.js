import telegraph from 'telegraph-events';

let Events = Base => class extends Base {
  constructor (...args) {
    super(...args);
    telegraph(this);
  }
};

export default Events;
