import telegraph from 'telegraph-events';

export default class VisualizationComponent {
  constructor (el) {
    if (!el) {
      throw new Error('"el" is a required argument');
    }

    this.el = el;

    telegraph(this);
  }

  render () {
    throw new Error('"refresh() is pure abstract"');
  }
}
