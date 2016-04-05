import d3 from 'd3';
import jQuery from 'jquery';
import myTemplate from './template.html';
import Widget from '../Widget';
import './style.css';

import infoTemplate from './infoTemplate.html';

let NODE_MODES = {
  INELIGIBLE: 0,
  WILL_SELECT: 1,
  WILL_CONNECT: 2,
  WILL_DISCONNECT: 3,
  SELECTED: 4
};
let EDGE_MODES = {
  ESTABLISHED: 0,
  ESTABLISHED_SELECTED: 1,
  POTENTIAL: 2,
  PROBABLE: 3
};

let MappingView = Widget.extend({
  initialize: function (options) {
    let self = this;
    Widget.prototype.initialize.apply(self, options);

    self.friendlyName = 'Mapping';
    self.hashName = 'MappingView';

    self.newInfo = true;
    self.icons.splice(0, 0, {
      src: function () {
        return self.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: function () {
        return 'About this panel';
      },
      onclick: function () {
        self.renderInfoScreen();
      }
    });

    self.ok = false;
    self.icons.splice(0, 0, {
      src: function () {
        if (self.ok === true) {
          return Widget.okayIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: function () {
        if (self.ok === true) {
          return 'All the needed mappings have been specified';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: function () {
        self.renderHelpScreen();
      }
    });

    self.selection = null;

    self.listenTo(window.mainPage.toolchain, 'rra:changeMappings', function () {
      self.selection = null;
      self.render();
    });
  },
  renderInfoScreen: function () {
    let self = this;
    self.newInfo = false;
    self.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    let self = this;
    let screen;
    if (self.ok === true) {
      screen = self.getSuccessScreen(`
You've wired up all the connections that the visualization needs.
Well done!`);
    } else {
      let meta = window.mainPage.toolchain.get('meta');
      if (!meta || !meta.visualizations || !meta.visualizations[0] ||
        !meta.datasets || !meta.datasets[0]) {
        screen = self.getErrorScreen(`
You need to choose both a Dataset and a Visualization
in order to connect them together.`);
      } else {
        screen = self.getErrorScreen(`
The visualization needs more connections to data in
order to display anything.`);
      }
    }

    window.mainPage.overlay.render(screen);
  },
  createNodeId: function (d) {
    // Generate a valid ID for the node
    return ('node_' + d.index + d.attrName)
      .replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '');
  },
  createEdgeId: function (d) {
    // Generate a valid ID for the edges
    return ('edge_' + d.source + '_' + d.target)
      .replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '');
  },
  constructLookups: function () {
    let self = this;

    let meta = window.mainPage.toolchain.getMeta();

    let specs = {
      data: [],
      vis: []
    };

    meta.datasets.each(function (d) {
      specs.data.push(d.getSpec());
    });
    meta.visualizations.forEach(function (d) {
      specs.vis.push(d);
    });

    // Reshape the tree into a node/edge tables
    // for easy drawing and interaction
    let nodeLookup = {};
    let nodes = [];
    let edges = [];
    let nodeEdgeLookup = {};

    // Helper functions
    function _createNode(side, groupIndex, attrName, attrType) {
      let newNode = {
        side: side,
        index: groupIndex,
        attrName: attrName,
        type: attrType
      };
      newNode.id = self.createNodeId(newNode);
      nodeLookup[newNode.id] = nodes.length;

      if (self.selection === null) {
        newNode.mode = NODE_MODES.WILL_SELECT;
      } else if (self.selection.id === newNode.id) {
        newNode.mode = NODE_MODES.SELECTED;
      } else if (self.selection.side === newNode.side) {
        // You can always switch to selecting
        // a different node on the same side
        newNode.mode = NODE_MODES.WILL_SELECT;
      } else if (newNode.side === 'vis') {
        // Does the selected data node's type match
        // an of our compatible types?
        if (newNode.type.indexOf(self.selection.baseType) === -1) {
          newNode.mode = NODE_MODES.INELIGIBLE;
        } else {
          newNode.mode = NODE_MODES.WILL_CONNECT;
        }
      } else {
        // Is our type compatible with any of the
        // vis node's types?
        if (self.selection.baseType.indexOf(newNode.type) === -1) {
          newNode.mode = NODE_MODES.INELIGIBLE;
        } else {
          newNode.mode = NODE_MODES.WILL_CONNECT;
        }
      }
      nodes.push(newNode);
      nodeEdgeLookup[newNode.id] = [];
    }

    function _createEdge(established, visIndex, visAttrName, dataIndex, dataAttrName) {
      // Edges always go from data to vis
      let sourceId = self.createNodeId({
        index: dataIndex,
        attrName: dataAttrName
      });
      let targetId = self.createNodeId({
        index: visIndex,
        attrName: visAttrName
      });
      let newEdge = {
        source: nodeLookup[sourceId],
        target: nodeLookup[targetId]
      };
      newEdge.id = self.createEdgeId(newEdge);
      if (established) {
        // These edges already exist
        newEdge.mode = EDGE_MODES.ESTABLISHED;
        if (self.selection !== null) {
          // Special settings for edges attached
          // to the selected node, as well as
          // the nodes on the other end
          if (sourceId === self.selection.id) {
            nodes[nodeLookup[targetId]].mode = NODE_MODES.WILL_DISCONNECT;
            newEdge.mode = EDGE_MODES.ESTABLISHED_SELECTED;
          } else if (targetId === self.selection.id) {
            nodes[nodeLookup[sourceId]].mode = NODE_MODES.WILL_DISCONNECT;
            newEdge.mode = EDGE_MODES.ESTABLISHED_SELECTED;
          }
        }
      } else {
        // Here, we create "potential" edges for rendering
        // dotted lines (in the future, we may even add
        // some kind of encoding for how interesting the
        // connection is likely to be)
        newEdge.mode = EDGE_MODES.POTENTIAL;

        // Only create a potential edge if there really is
        // potential for a connection (ideally, we would have
        // filtered the list before calling _createEdge, but
        // it's easier to filter based on the node modes
        // that we already set up)
        if (self.selection.side === 'vis') {
          if (nodes[newEdge.source].mode !== NODE_MODES.WILL_CONNECT) {
            return;
          }
        } else if (self.selection.side === 'data') {
          if (nodes[newEdge.target].mode !== NODE_MODES.WILL_CONNECT) {
            return;
          }
        }
        // TODO: get the probable nodes:
        // If the selected node is on the
        // vis side, this node is 'probable'
        // if and only if another node in
        // this group has a link to a node
        // in the same group as the
        // selected node...
      }
      nodeEdgeLookup[sourceId].push(edges.length);
      nodeEdgeLookup[targetId].push(edges.length);
      edges.push(newEdge);
    }

    // Extract all the nodes (from both sides)
    specs.data.forEach(function (dataSpec, dataIndex) {
      for (let attrName of Object.keys(dataSpec.attributes)) {
        _createNode('data', dataIndex, attrName, dataSpec.attributes[attrName]);
      }
    });
    specs.vis.forEach(function (visSpec, visIndex) {
      visSpec.options.forEach(function (option, attrIndex) {
        _createNode('vis', visIndex, option.name, option.domain.fieldTypes);
      });
    });

    // Get the established edges
    meta.mappings.forEach(function (mapping) {
      _createEdge(true, mapping.visIndex, mapping.visAttribute,
        mapping.dataIndex, mapping.dataAttribute);
    });

    // Add the potential and probable edges
    if (self.selection !== null) {
      if (self.selection.side === 'data') {
        specs.vis.forEach(function (visSpec, visIndex) {
          visSpec.options.forEach(function (option) {
            _createEdge(false, visIndex, option.name,
              self.selection.index, self.selection.attrName);
          });
        });
      } else {
        specs.data.forEach(function (dataSpec, dataIndex) {
          for (let attrName of Object.keys(dataSpec.attributes)) {
            _createEdge(false, self.selection.index, self.selection.attrName,
              dataIndex, attrName);
          }
        });
      }
    }

    return {
      nodes: nodes,
      edges: edges,
      nodeEdgeLookup: nodeEdgeLookup,
      realEdgeCount: meta.mappings.length
    };
  },
  handleClick: function (d) {
    let self = this;

    d3.event.stopPropagation();
    let visNode;
    let dataNode;

    // Interactions are different, depending on our state
    if (d.mode === NODE_MODES.WILL_SELECT) {
      // Change the selection
      self.selection = {
        side: d.side,
        index: d.index,
        attrName: d.attrName,
        baseType: d.type
      };
      self.selection.id = self.createNodeId(self.selection);
      self.render();
    } else if (d.mode === NODE_MODES.WILL_CONNECT) {
      // Establish a connection from the
      // selected node to the clicked node
      if (d.side === 'vis') {
        visNode = d;
        dataNode = self.selection;
      } else {
        visNode = self.selection;
        dataNode = d;
      }
      window.mainPage.toolchain.addMapping({
        visIndex: visNode.index,
        visAttribute: visNode.attrName,
        dataIndex: dataNode.index,
        dataAttribute: dataNode.attrName
      });
    } else if (d.mode === NODE_MODES.WILL_DISCONNECT) {
      // Remove the connection between the
      // selected node and the clicked node
      if (d.side === 'vis') {
        visNode = d;
        dataNode = self.selection;
      } else {
        visNode = self.selection;
        dataNode = d;
      }
      window.mainPage.toolchain.removeMapping({
        visIndex: visNode.index,
        visAttribute: visNode.attrName,
        dataIndex: dataNode.index,
        dataAttribute: dataNode.attrName
      });
    } else if (d.mode === NODE_MODES.SELECTED) {
      self.selection = null;
      self.render();
    }
  },
  render: function () {
    let self = this;

    // Construct a graph from each of the specs
    // (and the currently selected node)
    let graph = self.constructLookups();

    // The vis and data nodes will be in contiguous
    // blocks in graph.nodes... rather than split them
    // into their own lists and render them seperately,
    // we can just do a little index trickery:
    let firstData, lastData, firstVis, lastVis;
    graph.nodes.forEach(function (d, i) {
      if (d.side === 'vis') {
        if (firstVis === undefined) {
          firstVis = i;
        }
        lastVis = i;
      } else {
        if (firstData === undefined) {
          firstData = i;
        }
        lastData = i;
      }
    });

    let numData = lastData ? 1 + lastData - firstData : 0;
    let numVis = lastVis ? 1 + lastVis - firstVis : 0;

    // Update our little indicator
    // to describe the mapping
    self.statusText.text = graph.realEdgeCount + ' / ' + numVis;
    self.statusText.title = graph.realEdgeCount + ' of ' + numVis +
      ' visual channels have been mapped';
    if (graph.realEdgeCount === 0) {
      self.ok = false;
    } else {
      self.ok = true;
    }
    self.renderIndicators();

    // Add our template if it's not already there
    if (self.$el.find('svg').length === 0) {
      self.$el.html(myTemplate);
      // Add the function to deselect everything when
      // the canvas is clicked
      d3.select(self.el).select('svg')
        .on('click', function () {
          self.selection = null;
          self.render();
        });
    }

    // Figure out how we're going to lay things
    // out based on how much space we have
    let nodeHeight = 40;

    // Temporarily force the scroll bars so we
    // account for their size
    self.$el.css('overflow', 'scroll');
    let bounds = {
      width: self.el.clientWidth,
      height: self.el.clientHeight
    };
    self.$el.css('overflow', '');

    // If there isn't enough room for all
    // the nodes, extend the height
    bounds.height = Math.max(bounds.height,
      1.5 * nodeHeight * (numData + 2),
      1.5 * nodeHeight * (numVis + 2));

    self.$el.find('svg')
      .attr({
        width: bounds.width,
        height: bounds.height
      });

    let dataX = bounds.width / 4;
    let visX = 3 * bounds.width / 4;
    let nodeWidth = bounds.width / 4;
    let dataY = d3.scale.linear()
      .domain([firstData - 1, lastData + 1])
      .range([0, bounds.height]);
    let visY = d3.scale.linear()
      .domain([firstVis - 1, lastVis + 1])
      .range([0, bounds.height]);

    let nodes = d3.select(self.el).select('svg')
      .select('.nodeLayer')
      .selectAll('.node').data(graph.nodes, d => {
        return d.id + d.type;
      });
    let enteringNodes = nodes.enter().append('g');
    nodes.exit().remove();

    nodes.attr('id', d => d.id).attr('class', d => {
      let classString = '';
      // Node mode
      if (d.mode === NODE_MODES.WILL_SELECT) {
        classString = 'selectable';
      } else if (d.mode === NODE_MODES.INELIGIBLE) {
        classString = 'ineligible';
      } else if (d.mode === NODE_MODES.WILL_DISCONNECT) {
        classString = 'linked';
      } else if (d.mode === NODE_MODES.SELECTED) {
        classString = 'selected';
      } else if (d.mode === NODE_MODES.WILL_CONNECT) {
        classString = 'connectable';
      }
      // Node side
      if (d.side === 'vis') {
        classString += ' encoding';
      } else {
        classString += ' attribute';
      }
      return classString + ' node';
    }).attr('transform', function (d, i) {
      if (d.side === 'vis') {
        return 'translate(' + visX + ',' + visY(i) + ')';
      } else {
        return 'translate(' + dataX + ',' + dataY(i) + ')';
      }
    }).on('mouseover', function (d) {
      // Highlight this node
      jQuery(this).addClass('hovered');
      // Highlight the edge between this node and the selection
      if (self.selection !== null && self.selection.id !== d.id) {
        graph.nodeEdgeLookup[d.id].forEach(function (edgeIndex) {
          let edge = graph.edges[edgeIndex];
          if (graph.nodes[edge.source].id === self.selection.id ||
            graph.nodes[edge.target].id === self.selection.id) {
            jQuery('#' + graph.edges[edgeIndex].id).addClass('hovered');
          }
        });
      }
    }).on('mouseout', function (d) {
      // Clear any highlights
      self.$el.find('.hovered').removeClass('hovered');
    }).on('click', function (d) {
      self.handleClick(d);
    });

    enteringNodes.append('rect');
    nodes.selectAll('rect').attr({
      width: nodeWidth,
      height: nodeHeight,
      x: -nodeWidth / 2,
      y: -nodeHeight / 2
    });

    enteringNodes.append('text')
      .attr('class', 'label')
      .attr('y', 0);
    nodes.selectAll('text.label').text(function (d) {
      return d.attrName;
    });

    enteringNodes.append('text')
      .attr('class', 'types');
    nodes.selectAll('text.types')
      .attr('y', nodeHeight / 3)
      .text(function (d) {
        if (d.side === 'data') {
          return d.type;
        } else {
          // TODO: boldface the connected type
          return d.type.join(',');
        }
      });

    // Draw the connections
    let edges = d3.select(self.el).select('svg')
      .select('.linkLayer')
      .selectAll('.edge').data(graph.edges, d => d.id);
    edges.enter().append('path');
    edges.exit().remove();

    edges.attr('id', d => d.id).attr('class', d => {
      let classString = '';
      // Edge type
      if (d.mode === EDGE_MODES.POTENTIAL) {
        classString = 'potential';
      } else if (d.mode === EDGE_MODES.ESTABLISHED) {
        classString = 'established';
      } else if (d.mode === EDGE_MODES.ESTABLISHED_SELECTED) {
        classString = 'established selected';
      } else if (d.mode === EDGE_MODES.PROBABLE) {
        classString = 'probable';
      }
      return classString + ' edge';
    }).attr('d', function (d) {
      let pathString = 'M' + (dataX + nodeWidth / 2) + ',' +
        dataY(d.source) +
        'L' + (visX - nodeWidth / 2) + ',' +
        visY(d.target);
      return pathString;
    }).on('mouseover', function (d) {
      jQuery(this).addClass('hovered');
      // If one end is selected, highlight the other end
      let nodeToHighlight;
      if (self.selection === null) {
        return;
      } else if (self.selection.side === 'vis') {
        nodeToHighlight = graph.nodes[d.source];
      } else {
        nodeToHighlight = graph.nodes[d.target];
      }
      self.$el.find('#' + nodeToHighlight.id).addClass('hovered');
    }).on('mouseout', function (d) {
      // Clear any highlights
      self.$el.find('.hovered').removeClass('hovered');
    }).on('click', function (d) {
      if (self.selection === null) {
        return;
      } else if (self.selection.side === 'vis') {
        self.handleClick(graph.nodes[d.source]);
      } else {
        self.handleClick(graph.nodes[d.target]);
      }
    });
  }
});

export default MappingView;
