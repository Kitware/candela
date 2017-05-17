import { select } from 'd3-selection';

export default class VisComponent {
  constructor (el) {
    if (!el) {
      throw new Error('"el" is a required argument');
    }

    this.el = el;
  }

  empty () {
    select(this.el)
      .selectAll('*')
      .remove();
  }

  render () {
    throw new Error('"render() is pure abstract"');
  }

  get serializationFormats () {
    return [];
  }
}
