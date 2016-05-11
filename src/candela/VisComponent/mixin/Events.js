import telegraph from 'telegraph-events';

let Events = Base => class extends Base {
  constructor (...args) {
    super(...args);
    telegraph(this);
  }
};

class Empty {}
export class EventsBase extends Events(Empty);

export default Events;
