import d3 from 'glo/node_modules/d3';
import GLO from 'glo';

import VisComponent from '../../VisComponent';

const colorNodes = (glo, field, type) => {
  glo.glo.node_attr({
    [field]: type
  });

  glo.glo.color_nodes_by(field);
};

export default class Glo extends VisComponent {
  constructor (el, {nodes, edges, nodeAttr, edgeAttr, width = 960, height = 540}) {
    super(el);

    // Empty the top-level div.
    d3.select(this.el)
      .selectAll('*')
      .remove();

    // Construct and append an SVG element to the top-level div.
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', height);
    this.el.appendChild(this.svg);

    // Construct a GLO object.
    this.glo = new GLO.GLO(d3.select(this.svg))
      .nodes(nodes)
      .edges(edges);
  }

  render () {
    this.glo.draw();
  }

  colorNodesDiscrete (field) {
    colorNodes(this, field, 'discrete');
  }

  colorNodesContinuous(field) {
    colorNodes(this, field, 'continuous');
  }

  colorNodesDefault () {
    this.glo.color_nodes_by_constant();
  }

  sizeNodes (field) {
    this.glo.node_attr({
      [field]: 'continuous'
    });

    this.glo.size_nodes_by(field);
  }

  sizeNodesDefault () {
    this.glo.size_nodes_by_constant();
  }

  distributeNodes(axis, attr = null) {
    if (attr === null) {
      this.glo.evenly_distribute_nodes_on(axis);
    } else {
      this.glo.evenly_distribute_nodes_on(axis, {
        by: attr
      });
    }
  }

  positionNodes(axis, value) {
    this.glo.node_attr({
      [value]: 'continuous'
    });

    this.glo.position_nodes_on(axis, value);
  }

  forceDirected () {
    this.glo.apply_force_directed_algorithm_to_nodes();
  }

  showEdges () {
    this.glo.show_all_edges();
  }

  hideEdges () {
    this.glo.hide_edges();
  }

  fadeEdges () {
    this.glo.show_edges_as_faded();
  }

  solidEdges () {
    this.hideEdges();
    this.showEdges();
  }

  incidentEdges () {
    this.glo.show_incident_edges();
  }

  curvedEdges () {
    this.glo.display_edges_as_curved_lines();
  }

  straightEdges () {
    this.glo.display_edges_as_straight_lines();
  }
}
