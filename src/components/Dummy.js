import VisualizationComponent from './../resplendent';

var d3 = require('d3');

class Dummy extends VisualizationComponent {
  constructor (el, data) {
    super(el);

    d3.select(this.el)
      .append('ul');

    if (data) {
      this.refresh(data);
    }
  }

  refresh (data) {
    let d = d3.select(this.el)
      .select('ul')
      .selectAll('li')
      .data(data);

    d.enter()
      .append('li');

    d.text((d) => d.text)
      .style('color', (d) => d.color);
  }
}

export default Dummy;
