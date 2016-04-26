export default class VisComponent {
  constructor (el) {
    if (!el) {
      throw new Error('"el" is a required argument');
    }

    this.el = el;
  }

  render () {
    throw new Error('"refresh() is pure abstract"');
  }
}
