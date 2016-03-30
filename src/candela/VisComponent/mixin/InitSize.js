let InitSize = Base => class extends Base {
  constructor (...args) {
    super(...args);

    const style = window.getComputedStyle(this.el);
    this.width = window.parseInt(style.getPropertyValue('width'));
    this.height = window.parseInt(style.getPropertyValue('height'));
  }
};

export default InitSize;
