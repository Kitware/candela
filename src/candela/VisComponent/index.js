export default class VisComponent {
  constructor (el, options) {
    if (!el) {
      throw new Error('"el" is a required argument');
    }

    this.el = el;
    this.options = options;
  }

  render () {
    throw new Error('"refresh() is pure abstract"');
  }
}
