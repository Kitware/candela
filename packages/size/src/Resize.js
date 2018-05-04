import WatchElementResize from 'watch-element-resize';
import { Events } from '@candela/events';

let Resize = Base => class extends Events(Base) {
  constructor (...args) {
    super(...args);

    const watch = new WatchElementResize(this.el);
    watch.on('resize', evt => {
      this.emit('resize', evt.element.offset.width, evt.element.offset.height);
    });
  }
};

export default Resize;
