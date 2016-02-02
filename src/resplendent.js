class VisualizationComponent {
  constructor (el) {
    this.el = el;
  }

  refresh (data) {
    throw new Error('"refresh() is pure abstract"');
  }
}

export default VisualizationComponent;
