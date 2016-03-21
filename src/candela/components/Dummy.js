import { VisualizationComponent } from '..';

var d3 = require('d3');

export default class Dummy extends VisualizationComponent {
  constructor (el, data) {
    super(el);

    d3.select(this.el)
      .append('ul');

    this._data = data || [];
  }

  render () {
    let d = d3.select(this.el)
      .select('ul')
      .selectAll('li')
      .data(this._data);

    d.enter()
      .append('li');

    d.exit()
      .remove();

    d.text((d) => d.text)
      .style('color', (d) => d.color);
  }

  data (newData) {
    this._data = newData;
  }
}
