class VisualizationComponent {
  constructor (div, data) {
    this.div = div;
  }

  refresh (data) {
    throw new Error('"refresh() is pure abstract"');
  }
}

export { VisualizationComponent };
