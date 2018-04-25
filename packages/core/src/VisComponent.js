export default class VisComponent {
  constructor (el) {
    if (!el) {
      throw new Error('"el" is a required argument');
    }

    this.el = el;
  }

  render () {
    throw new Error('render() is pure abstract');
  }

  update () {
    return Promise.resolve(this);
  }

  destroy () {
    this.empty();
  }

  empty () {
    while(this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  }

  get serializationFormats () {
    return [];
  }
}
