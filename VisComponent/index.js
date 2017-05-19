import { select } from 'd3-selection';

export default class VisComponent {
  constructor (el) {
    if (!el) {
      throw new Error('"el" is a required argument');
    }

    this.el = el;
  }

  render () {
    throw new Error('"render() is pure abstract"');
  }

  update () {}

  destroy () {
    this.empty();
  }

  empty () {
    select(this.el)
      .selectAll('*')
      .remove();
  }

  get serializationFormats () {
    return [];
  }
}
