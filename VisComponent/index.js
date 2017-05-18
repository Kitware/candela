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

  update () {
    throw new Error('"update() is pure abstract"');
  }

  destroy () {
    throw new Error('"destroy()" is pure abstract"');
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
