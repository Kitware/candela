import Resize from './Resize';
import InitSize from './InitSize';

let AutoResize = Base => class extends Resize(InitSize(Base)) {
  constructor (...args) {
    super(...args);

    this.on('resize', (w, h) => {
      this.width = w;
      this.height = h;

      this.render();
    });
  }
};

export default AutoResize;
