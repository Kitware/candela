import Resize from './Resize';

let AutoResize = Base => class extends Resize(Base) {
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
