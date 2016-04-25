import Underscore from 'underscore';
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
let STATUS = {
  OK: 0,
  NOT_ENOUGH_MAPPINGS: 1,
  DATASETS_NOT_LOADED: 2,
  STALE_MAPPINGS: 3,
  NOTHING_TO_MAP: 4
};

function OutOfDateMappingError () {};
OutOfDateMappingError.prototype = new Error();

let MappingView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);
    
    this.friendlyName = 'Mapping';

    this.newInfo = true;
    this.icons.splice(0, 0, {
      src: () => {
        return this.newInfo ? Widget.newInfoIcon : Widget.infoIcon;
      },
      title: () => {
        return 'About this panel';
      },
      onclick: () => {
        this.renderInfoScreen();
      }
    });

    this.status = STATUS.NOTHING_TO_MAP;
    this.icons.splice(0, 0, {
      src: () => {
        if (this.status === STATUS.OK) {
          return Widget.okayIcon;
        } else if (this.status === STATUS.DATASETS_NOT_LOADED ||
                   this.status === STATUS.STALE_MAPPINGS) {
          return Widget.spinnerIcon;
        } else {
          return Widget.warningIcon;
        }
      },
      title: () => {
        if (this.status === STATUS.OK) {
          return 'All the needed mappings have been specified';
        } else if (this.status === STATUS.DATASETS_NOT_LOADED ||
                   this.status === STATUS.STALE_MAPPINGS) {
          return 'Loading...';
        } else {
          return 'Something isn\'t quite right; click for details';
        }
      },
      onclick: () => {
        this.renderHelpScreen();
      }
    });

    this.selection = null;

    this.listenTo(window.mainPage, 'rra:changeToolchain',
      this.handleNewToolchain);
    this.handleNewToolchain();
  },
  handleNewToolchain: function () {
    this.$el.html('');
    this.status = STATUS.NOTHING_TO_MAP;
    
    this.listenTo(window.mainPage.toolchain, 'rra:changeMappings', () => {
      this.selection = null;
      this.render();
    });
  },
  renderInfoScreen: function () {
    this.newInfo = false;
    this.renderIndicators();

    window.mainPage.overlay.render(infoTemplate);
  },
  renderHelpScreen: function () {
    if (this.status === STATUS.OK) {
      window.mainPage.overlay.renderSuccessScreen(`
You've wired up all the connections that the visualization needs.
Well done!`);
    } else if (this.status === STATUS.NOT_ENOUGH_MAPPINGS) {
      window.mainPage.overlay.renderUserErrorScreen(`
The visualization needs more connections to data in
order to display anything.`);
    } else if (this.status === STATUS.DATASETS_NOT_LOADED) {
      window.mainPage.overlay.renderLoadingScreen(`
Still accessing this toolchain's datasets...`);
    } else if (this.status === STATUS.STALE_MAPPINGS) {
      window.mainPage.overlay.renderLoadingScreen(`
Still accessing this toolchain's mapping settings...`);
    } else if (this.status === STATUS.NOTHING_TO_MAP) {
      window.mainPage.overlay.renderUserErrorScreen(`
You need to choose both a Dataset and a Visualization
in order to connect them together.`);
    }
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
    let meta = window.mainPage.toolchain.getMeta();

    let specs = {
      data: [],
      vis: []
    };

    for (let d of meta.datasets) {
      if (window.mainPage.loadedDatasets[d]) {
        specs.data.push(window.mainPage.loadedDatasets[d].getSpec());
      } else {
        // A dataset hasn't been added yet...
        // so don't bother finishing the render
        this.status = STATUS.DATASETS_NOT_LOADED;
        return {
          nodes: [],
          edges: [],
          nodeEdgeLookup: {},
          realEdgeCount: 0
        };
      }
    }
    meta.visualizations.forEach(d => {
      specs.vis.push(d);
    });

    // Reshape the tree into a node/edge tables
    // for easy drawing and interaction
    let nodeLookup = {};
    let nodes = [];
    let edges = [];
    let nodeEdgeLookup = {};

    // Helper functions
    let _createNode = (side, groupIndex, attrName, attrType) => {
      let newNode = {
        side: side,
        index: groupIndex,
        attrName: attrName,
        type: attrType
      };
      newNode.id = this.createNodeId(newNode);
      nodeLookup[newNode.id] = nodes.length;

      if (this.selection === null) {
        newNode.mode = NODE_MODES.WILL_SELECT;
      } else if (this.selection.id === newNode.id) {
        newNode.mode = NODE_MODES.SELECTED;
      } else if (this.selection.side === newNode.side) {
        // You can always switch to selecting
        // a different node on the same side
        newNode.mode = NODE_MODES.WILL_SELECT;
      } else if (newNode.side === 'vis') {
        // Does the selected data node's type match
        // an of our compatible types?
        if (newNode.type.indexOf(this.selection.baseType) === -1) {
          newNode.mode = NODE_MODES.INELIGIBLE;
        } else {
          newNode.mode = NODE_MODES.WILL_CONNECT;
        }
      } else {
        // Is our type compatible with any of the
        // vis node's types?
        if (this.selection.baseType.indexOf(newNode.type) === -1) {
          newNode.mode = NODE_MODES.INELIGIBLE;
        } else {
          newNode.mode = NODE_MODES.WILL_CONNECT;
        }
      }
      nodes.push(newNode);
      nodeEdgeLookup[newNode.id] = [];
    }

    let _createEdge = (established, visIndex,
                       visAttrName, dataIndex,
                       dataAttrName) => {
      // Edges always go from data to vis
      let sourceId = this.createNodeId({
        index: dataIndex,
        attrName: dataAttrName
      });
      let targetId = this.createNodeId({
        index: visIndex,
        attrName: visAttrName
      });
      let newEdge = {
        source: nodeLookup[sourceId],
        target: nodeLookup[targetId]
      };
      if (newEdge.source === undefined ||
          newEdge.target === undefined) {
        // We're constructing a mapping that's out of date!
        // Render nothing...
        throw new OutOfDateMappingError();
      }
      
      newEdge.id = this.createEdgeId(newEdge);
      if (established) {
        // These edges already exist
        newEdge.mode = EDGE_MODES.ESTABLISHED;
        if (this.selection !== null) {
          // Special settings for edges attached
          // to the selected node, as well as
          // the nodes on the other end
          if (sourceId === this.selection.id) {
            nodes[nodeLookup[targetId]].mode = NODE_MODES.WILL_DISCONNECT;
            newEdge.mode = EDGE_MODES.ESTABLISHED_SELECTED;
          } else if (targetId === this.selection.id) {
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
        if (this.selection.side === 'vis') {
          if (nodes[newEdge.source].mode !== NODE_MODES.WILL_CONNECT) {
            return;
          }
        } else if (this.selection.side === 'data') {
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

    try {
      // Extract all the nodes (from both sides)
      specs.data.forEach((dataSpec, dataIndex) => {
        for (let attrName of Object.keys(dataSpec.attributes)) {
          _createNode('data', dataIndex, attrName, dataSpec.attributes[attrName]);
        }
      });
      specs.vis.forEach((visSpec, visIndex) => {
        visSpec.options.forEach((option, attrIndex) => {
          _createNode('vis', visIndex, option.name, option.domain.fieldTypes);
        });
      });

      // Get the established edges
      for (let mapping of meta.mappings) {
        _createEdge(true, mapping.visIndex, mapping.visAttribute,
          mapping.dataIndex, mapping.dataAttribute);
      };

      // Add the potential and probable edges
      if (this.selection !== null) {
        if (this.selection.side === 'data') {
          specs.vis.forEach((visSpec, visIndex) => {
            visSpec.options.forEach(option => {
              _createEdge(false, visIndex, option.name,
                this.selection.index, this.selection.attrName);
            });
          });
        } else {
          specs.data.forEach((dataSpec, dataIndex) => {
            for (let attrName of Object.keys(dataSpec.attributes)) {
              _createEdge(false, this.selection.index, this.selection.attrName,
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
    } catch (err) {
      if (err instanceof OutOfDateMappingError) {
        this.status = STATUS.STALE_MAPPINGS;
        return {
          nodes: [],
          edges: [],
          nodeEdgeLookup: {},
          realEdgeCount: 0
        };
      } else {
        throw err;
      }
    }
  },
  handleClick: function (d) {
    d3.event.stopPropagation();
    let visNode;
    let dataNode;

    // Interactions are different, depending on our state
    if (d.mode === NODE_MODES.WILL_SELECT) {
      // Change the selection
      this.selection = {
        side: d.side,
        index: d.index,
        attrName: d.attrName,
        baseType: d.type
      };
      this.selection.id = this.createNodeId(this.selection);
      this.render();
    } else if (d.mode === NODE_MODES.WILL_CONNECT) {
      // Establish a connection from the
      // selected node to the clicked node
      if (d.side === 'vis') {
        visNode = d;
        dataNode = this.selection;
      } else {
        visNode = this.selection;
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
        dataNode = this.selection;
      } else {
        visNode = this.selection;
        dataNode = d;
      }
      window.mainPage.toolchain.removeMapping({
        visIndex: visNode.index,
        visAttribute: visNode.attrName,
        dataIndex: dataNode.index,
        dataAttribute: dataNode.attrName
      });
    } else if (d.mode === NODE_MODES.SELECTED) {
      this.selection = null;
      this.render();
    }
  },
  render: Underscore.debounce(function () {
    if (!this.canRender()) {
      return;
    }
    
    // Construct a graph from each of the specs
    // (and the currently selected node)
    let graph = this.constructLookups();

    // The vis and data nodes will be in contiguous
    // blocks in graph.nodes... rather than split them
    // into their own lists and render them seperately,
    // we can just do a little index trickery:
    let firstData, lastData, firstVis, lastVis;
    graph.nodes.forEach((d, i) => {
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
    this.statusText.text = graph.realEdgeCount + ' / ' + numVis;
    this.statusText.title = graph.realEdgeCount + ' of ' + numVis +
      ' visual channels have been mapped';
    if (graph.realEdgeCount > 0) {
      this.status = STATUS.OK;
    } else if (this.status !== STATUS.STALE_MAPPINGS &&
               this.status !== STATUS.DATASETS_NOT_LOADED) {
      if (numData === 0 || numVis === 0) {
        this.status = STATUS.NOTHING_TO_MAP;
      } else {
        this.status = STATUS.NOT_ENOUGH_MAPPINGS;
      }
    }
    this.renderIndicators();

    // Add our template if it's not already there
    if (this.$el.find('svg').length === 0) {
      this.$el.html(myTemplate);
      // Add the function to deselect everything when
      // the canvas is clicked
      d3.select(this.el).select('svg')
        .on('click', () => {
          this.selection = null;
          this.render();
        });
    }

    // Figure out how we're going to lay things
    // out based on how much space we have
    let nodeHeight = 40;

    // Temporarily force the scroll bars so we
    // account for their size
    this.$el.css('overflow', 'scroll');
    let bounds = {
      width: this.el.clientWidth,
      height: this.el.clientHeight
    };
    this.$el.css('overflow', '');

    // If there isn't enough room for all
    // the nodes, extend the height
    bounds.height = Math.max(bounds.height,
      1.5 * nodeHeight * (numData + 2),
      1.5 * nodeHeight * (numVis + 2));

    this.$el.find('svg')
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

    let nodes = d3.select(this.el).select('svg')
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
    }).attr('transform', (d, i) => {
      if (d.side === 'vis') {
        return 'translate(' + visX + ',' + visY(i) + ')';
      } else {
        return 'translate(' + dataX + ',' + dataY(i) + ')';
      }
    }).on('mouseover', d => {
      // Highlight this node
      jQuery(this).addClass('hovered');
      // Highlight the edge between this node and the selection
      if (this.selection !== null && this.selection.id !== d.id) {
        graph.nodeEdgeLookup[d.id].forEach(edgeIndex => {
          let edge = graph.edges[edgeIndex];
          if (graph.nodes[edge.source].id === this.selection.id ||
            graph.nodes[edge.target].id === this.selection.id) {
            jQuery('#' + graph.edges[edgeIndex].id).addClass('hovered');
          }
        });
      }
    }).on('mouseout', d => {
      // Clear any highlights
      this.$el.find('.hovered').removeClass('hovered');
    }).on('click', d => {
      this.handleClick(d);
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
    nodes.selectAll('text.label').text(d => {
      return d.attrName;
    });

    enteringNodes.append('text')
      .attr('class', 'types');
    nodes.selectAll('text.types')
      .attr('y', nodeHeight / 3)
      .text(d => {
        if (d.side === 'data') {
          return d.type;
        } else {
          // TODO: boldface the connected type
          return d.type.join(',');
        }
      });

    // Draw the connections
    let edges = d3.select(this.el).select('svg')
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
    }).attr('d', d => {
      let pathString = 'M' + (dataX + nodeWidth / 2) + ',' +
        dataY(d.source) +
        'L' + (visX - nodeWidth / 2) + ',' +
        visY(d.target);
      return pathString;
    }).on('mouseover', d => {
      jQuery(this).addClass('hovered');
      // If one end is selected, highlight the other end
      let nodeToHighlight;
      if (this.selection === null) {
        return;
      } else if (this.selection.side === 'vis') {
        nodeToHighlight = graph.nodes[d.source];
      } else {
        nodeToHighlight = graph.nodes[d.target];
      }
      this.$el.find('#' + nodeToHighlight.id).addClass('hovered');
    }).on('mouseout', d => {
      // Clear any highlights
      this.$el.find('.hovered').removeClass('hovered');
    }).on('click', d => {
      if (this.selection === null) {
        return;
      } else if (this.selection.side === 'vis') {
        this.handleClick(graph.nodes[d.source]);
      } else {
        this.handleClick(graph.nodes[d.target]);
      }
    });
  }, 300)
});

export default MappingView;
