class VisualizationComponent {
  constructor (div) {
    this.div = div;
  }

  refresh (data) {
    throw new Error('"refresh() is pure abstract"');
  }
}

export default VisualizationComponent;
