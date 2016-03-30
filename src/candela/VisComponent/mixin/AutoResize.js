import 'javascript-detect-element-resize/detect-element-resize';
import Events from './Events';

let AutoResize = Base => class extends Events(Base) {
  constructor (...args) {
    super(...args);

    window.addResizeListener(this.el, () => {
      const style = window.getComputedStyle(this.el);
      const width = window.parseInt(style.getPropertyValue('width'));
      const height = window.parseInt(style.getPropertyValue('height'));

      this.emit('resize', width, height, this);
    });
  }
};

export default AutoResize;
