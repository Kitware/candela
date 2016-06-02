import Underscore from 'underscore';
import d3 from 'd3';
import jQuery from 'jquery';
import myTemplate from './template.html';
import Widget from '../Widget';
import './style.css';

import booleanIcon from '../../../images/boolean.svg';
import integerIcon from '../../../images/integer.svg';
import numberIcon from '../../../images/number.svg';
import dateIcon from '../../../images/date.svg';
import stringIcon from '../../../images/string.svg';
import stringListIcon from '../../../images/string_list.svg';

let ICONS = {
  boolean: booleanIcon,
  integer: integerIcon,
  number: numberIcon,
  date: dateIcon,
  string: stringIcon,
  string_list: stringListIcon
};

let NODE_MODES = {
  INELIGIBLE: 'ineligible',
  WILL_SELECT: 'selectable',
  WILL_CONNECT: 'connectable',
  WILL_DISCONNECT: 'linked',
  SELECTED: 'selected'
};
let EDGE_MODES = {
  ESTABLISHED: 'established',
  ESTABLISHED_SELECTED: 'established selected',
  POTENTIAL: 'potential',
  PROBABLE: 'probable'
};
let STATUS = {
  OK: 0,
  NOT_ENOUGH_MAPPINGS: 1,
  DATASETS_NOT_LOADED: 2,
  STALE_MAPPINGS: 3,
  NOTHING_TO_MAP: 4
};

function OutOfDateMatchingError () {}
OutOfDateMatchingError.prototype = new Error();

let MatchingView = Widget.extend({
  initialize: function () {
    Widget.prototype.initialize.apply(this, arguments);

    this.friendlyName = 'Matching';

    this.icons.splice(0, 0, {
      src: () => {
        return window.mainPage.currentUser.preferences
          .hasSeenAllTips(this.getTips()) ? Widget.infoIcon : Widget.newInfoIcon;
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
          return 'All the needed matchings have been specified';
        } else if (this.status === STATUS.DATASETS_NOT_LOADED ||
          this.status === STATUS.STALE_MAPPINGS) {
          return 'Loading...';
        } else {
          return "Something isn't quite right; click for details";
        }
      },
      onclick: () => {
        this.renderHelpScreen();
      }
    });

    this.selection = null;
    this.graph = null;
    this.layout = null;

    this.listenTo(window.mainPage, 'rl:changeProject',
      this.handleNewProject);
    this.handleNewProject();
  },
  handleNewProject: function () {
    this.$el.html('');
    this.status = STATUS.NOTHING_TO_MAP;

    this.listenTo(window.mainPage.project, 'rl:changeMatchings', () => {
      this.selection = null;
      this.render();
    });
  },
  renderInfoScreen: function () {
    window.mainPage.helpLayer.showTips(this.getTips());
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
Still accessing this project's datasets...`);
    } else if (this.status === STATUS.STALE_MAPPINGS) {
      window.mainPage.overlay.renderLoadingScreen(`
Still accessing this project's matching settings...`);
    } else if (this.status === STATUS.NOTHING_TO_MAP) {
      window.mainPage.overlay.renderUserErrorScreen(`
You need to choose both a Dataset and a Visualization
in order to connect them together.`);
    }
  },
  getTips: function () {
    let tips = [
      {
        selector: 'g.attribute.node',
        message: 'To connect the data to the visualization: 1. Click a data attribute'
      },
      {
        selector: 'g.encoding.node',
        message: 'To connect the data to the visualization: 2. Click a visual encoding'
      }
    ].concat(this.getDefaultTips());
    return tips;
  },
  createNodeId: function (d) {
    // Generate a valid ID for the node
    return ('node_' + d.side + d.groupIndex + d.attrName)
      .replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '');
  },
  createEdgeId: function (d) {
    // Generate a valid ID for the edges
    return ('edge_' + d.dataIndex + '_' + d.visIndex)
      .replace(/([^A-Za-z0-9[\]{}_.:-])\s?/g, '');
  },
  updateGraph: function () {
    let meta = window.mainPage.project.getMeta();

    let specs = {
      data: [],
      vis: []
    };

    for (let d of meta.datasets) {
      if (window.mainPage.loadedDatasets[d]) {
        specs.data.push(window.mainPage.loadedDatasets[d].getSpec());
      }
    }
    meta.visualizations.forEach(d => {
      specs.vis.push(d);
    });

    // Reshape the specs into node/edge tables
    // for easy drawing and interaction
    let nodeLookup = {};
    let dataNodes = [];
    let visNodes = [];
    let edges = [];
    let nodeEdgeLookup = {};
    let requiredConnections = 0;
    let satisfiedConnections = 0;

    // Helper functions
    let _createNode = (side, groupIndex, attrName, attrType, optional, possibleConnections) => {
      let newNode = {
        side: side,
        index: groupIndex,
        attrName: attrName,
        type: attrType,
        optional: optional,
        establishedConnections: 0,
        possibleConnections: possibleConnections || 1
      };

      if (!newNode.optional) {
        requiredConnections += 1;
      }

      newNode.id = this.createNodeId(newNode);
      nodeLookup[newNode.id] = {
        side: side,
        index: side === 'vis' ? visNodes.length : dataNodes.length
      };

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
      if (side === 'vis') {
        visNodes.push(newNode);
      } else {
        dataNodes.push(newNode);
      }
      nodeEdgeLookup[newNode.id] = [];
    };

    let _createEdge = (established, visIndex, visAttrName,
                                    dataIndex, dataAttrName) => {
      let newEdge = {
        dataIndex: dataIndex,
        visIndex: visIndex
      };
      if (newEdge.dataIndex === undefined ||
        newEdge.visIndex === undefined) {
        // We're constructing a matching that's out of date!
        // Render nothing...
        throw new OutOfDateMatchingError();
      }

      newEdge.id = this.createEdgeId(newEdge);
      if (established) {
        // These edges already exist
        newEdge.mode = EDGE_MODES.ESTABLISHED;
        if (this.selection !== null) {
          // Special settings for edges attached
          // to the selected node, as well as
          // the nodes on the other end
          if (this.selection.side === 'data' && this.selection.groupIndex === dataIndex) {
            visNodes[visIndex].mode = NODE_MODES.WILL_DISCONNECT;
            newEdge.mode = EDGE_MODES.ESTABLISHED_SELECTED;
          } else if (this.selection.side === 'vis' && this.selection.groupIndex === visIndex) {
            dataNodes[dataIndex].mode = NODE_MODES.WILL_DISCONNECT;
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
          if (dataNodes[dataIndex].mode !== NODE_MODES.WILL_CONNECT) {
            return;
          }
        } else if (this.selection.side === 'data') {
          if (visNodes[visIndex].mode !== NODE_MODES.WILL_CONNECT) {
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
      nodeEdgeLookup[dataNodes[dataIndex].id].push(edges.length);
      nodeEdgeLookup[visNodes[visIndex].id].push(edges.length);
      edges.push(newEdge);
    };

    try {
      // Extract all the nodes (from both sides)
      specs.data.forEach((dataSpec, dataIndex) => {
        for (let attrName of Object.keys(dataSpec.attributes)) {
          _createNode('data', dataIndex, attrName, dataSpec.attributes[attrName], true, 1);
        }
      });
      specs.vis.forEach((visSpec, visIndex) => {
        visSpec.options.forEach((option, attrIndex) => {
          _createNode('vis', visIndex, option.name, option.domain.fieldTypes, option.optional,
            option.type === 'string_list' ? Infinity : 1);
        });
      });

      // Get the established edges
      for (let matching of meta.matchings) {
        _createEdge(true, matching.visIndex, matching.visAttribute,
          matching.dataIndex, matching.dataAttribute);
        // Count this connection in each node
        visNodes[matching.visIndex].establishedConnections += 1;
        dataNodes[matching.dataIndex].establishedConnections += 1;
        if (!visNodes[matching.visIndex].optional &&
             visNodes[matching.visIndex].establishedConnections === 1) {
          // this edge just satisfied a requirement (for now, we're
          // assuming that a non-optional vis encoding only requires
          // one connection to satisfy the requirement)
          satisfiedConnections += 1;
        }
      }

      // Add the potential and probable edges
      if (this.selection !== null) {
        if (this.selection.side === 'data') {
          specs.vis.forEach((visSpec, visIndex) => {
            visSpec.options.forEach(option => {
              _createEdge(false, visIndex, option.name,
                this.selection.groupIndex, this.selection.attrName);
            });
          });
        } else {
          specs.data.forEach((dataSpec, dataIndex) => {
            for (let attrName of Object.keys(dataSpec.attributes)) {
              _createEdge(false, this.selection.groupIndex, this.selection.attrName,
                dataIndex, attrName);
            }
          });
        }
      }

      this.graph = {
        nodeLookup: nodeLookup,
        dataNodes: dataNodes,
        visNodes: visNodes,
        edges: edges,
        nodeEdgeLookup: nodeEdgeLookup,
        requiredConnections: requiredConnections,
        satisfiedConnections: satisfiedConnections
      };
    } catch (err) {
      if (err instanceof OutOfDateMatchingError) {
        this.status = STATUS.STALE_MAPPINGS;
        this.graph = null;
      } else {
        throw err;
      }
    }
  },
  clickNode: function (d) {
    d3.event.stopPropagation();
    let visNode;
    let dataNode;

    // Interactions are different, depending on our state
    if (d.mode === NODE_MODES.WILL_SELECT) {
      // Change the selection
      this.selection = {
        side: d.side,
        groupIndex: d.groupIndex,
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
      window.mainPage.project.addMatching({
        visIndex: visNode.groupIndex,
        visAttribute: visNode.attrName,
        dataIndex: dataNode.groupIndex,
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
      window.mainPage.project.removeMatching({
        visIndex: visNode.groupIndex,
        visAttribute: visNode.attrName,
        dataIndex: dataNode.groupIndex,
        dataAttribute: dataNode.attrName
      });
    } else if (d.mode === NODE_MODES.SELECTED) {
      this.selection = null;
      this.render();
    }
  },
  clickEdge: function (d) {
    if (this.selection === null) {
      // TODO: snip established edges
      // even if neither side is selected
      return;
    } else if (this.selection.side === 'vis') {
      this.handleClick(this.graph.nodes[d.dataIndex]);
    } else {
      this.handleClick(this.graph.nodes[d.visIndex]);
    }
  },
  hoverNode: function (node, domElement) {
    // Highlight the node
    jQuery(domElement).addClass('hovered');

    // Highlight the edge between this node and the selection
    if (this.selection !== null && this.selection.id !== node.id) {
      this.graph.nodeEdgeLookup[node.id].forEach(edgeIndex => {
        let edge = this.graph.edges[edgeIndex];
        if (this.graph.nodes[edge.dataIndex].id === this.selection.id ||
          this.graph.nodes[edge.visIndex].id === this.selection.id) {
          jQuery('#' + this.graph.edges[edgeIndex].id).addClass('hovered');
        }
      });
    }
  },
  hoverEdge: function (edge, domElement) {
    // Highlight the edge
    jQuery(domElement).addClass('hovered');

    // If one end is selected, highlight the other end
    let nodeToHighlight;
    if (this.selection === null) {
      return;
    } else if (this.selection.side === 'vis') {
      nodeToHighlight = this.graph.dataNodes[edge.dataIndex];
    } else {
      nodeToHighlight = this.graph.visNodes[edge.visIndex];
    }
    this.$el.find('#' + nodeToHighlight.id).addClass('hovered');
  },
  renderDataNodes: function () {
    let self = this;
    let widthSuggestions = {
      xPosition: this.layout.emSize,
      minWidth: this.layout.emSize,
      maxWidth: this.layout.width / 3,
      idealWidth: 0
    };

    let nodes = d3.select(this.el).select('svg')
      .select('.nodeLayer')
      .selectAll('.data').data(this.graph.dataNodes, d => {
        return d.id + d.type;
      });
    // add class labels to distinguish the new nodes from the old ones
    nodes.attr('class', d => 'update data node ' + d.mode);
    let enteringNodes = nodes.enter().append('g')
      .attr('class', d => 'enter data node ' + d.mode);
    nodes.attr('id', d => d.id)
      .on('mouseover', function (d) {
        // this refers to the DOM element
        self.hoverNode(d, this);
      }).on('mouseout', d => {
        // Clear any highlights
        this.$el.find('.hovered').removeClass('hovered');
      }).on('click', d => {
        this.clickNode(d);
      });
    nodes.exit().remove();

    // main tooltip (for the whole node)
    enteringNodes.append('title').attr('class', 'nodeTitle');
    nodes.selectAll('title.nodeTitle')
      .text(d => d.attrName + ' (' + d.type + ')');

    // background rect
    enteringNodes.append('rect')
      .attr('class', 'nodeBackground');
    nodes.selectAll('rect.nodeBackground')
      .attr('height', this.layout.dataNodeHeight)
      .attr('y', -this.layout.dataNodeHeight / 2);

    // icon representing the data type (and its tooltip)
    enteringNodes.append('image').append('title');
    nodes.selectAll('image')
      .attr('xlink:href', d => ICONS[d.type]);
    nodes.selectAll('image').selectAll('title')
      .text(d => 'Interpreted as ' + d + '. You can change this in the Dataset widget');

    // data attribute name
    enteringNodes.append('text')
      .attr('class', 'label')
      .attr({
        y: '0.35em',
        x: '1.25em'
      });
    nodes.selectAll('text.label').each(function (d) {
      // this refers to the DOM element
      let label = d.attrName;
      this.textContent = label;

      // Figure out how much space this label would take,
      // plus the space taken up by the type icon
      widthSuggestions.idealWidth = Math.max(widthSuggestions.idealWidth,
        this.getComputedTextLength() + 1.25 * self.layout.emSize);
    });
    return widthSuggestions;
  },
  renderVisNodes: function () {
    let self = this;
    let widthSuggestions = {
      xPosition: this.layout.width,
      minWidth: this.layout.emSize,
      maxWidth: this.layout.width / 2,
      idealWidth: 0
    };

    let nodes = d3.select(this.el).select('svg')
      .select('.nodeLayer')
      .selectAll('.vis').data(this.graph.visNodes, d => {
        return d.id + d.type;
      });
    // add class labels to distinguish the new nodes from the old ones
    nodes.attr('class', d => 'update vis node ' + d.mode);
    let enteringNodes = nodes.enter().append('g')
      .attr('class', d => 'enter vis node ' + d.mode);
    nodes.attr('id', d => d.id)
      .on('mouseover', function (d) {
        // this refers to the DOM element
        self.hoverNode(d, this);
      }).on('mouseout', d => {
        // Clear any highlights
        this.$el.find('.hovered').removeClass('hovered');
      }).on('click', d => {
        this.clickNode(d);
      });
    nodes.exit().remove();

    // main tooltip (for the whole node)
    enteringNodes.append('title').attr('class', 'nodeTitle');
    nodes.selectAll('title.nodeTitle')
      .text(d => {
        let tooltip = d.attrName + ': ' +
          d.establishedConnections + ' / ';
        if (isFinite(d.possibleConnections)) {
          tooltip += d.possibleConnections;
        } else {
          tooltip += '\u221E';
        }
        if (!d.optional) {
          tooltip += ' (required)';
        }
        return tooltip;
      });

    // background rect
    enteringNodes.append('rect')
      .attr('class', 'nodeBackground');
    nodes.selectAll('rect.nodeBackground')
      .attr('height', d => this.layout.visNodeHeight)
      .attr('y', d => -this.layout.visNodeHeight / 2);

    // fraction indicating how many connections exist:
    let enteringStats = enteringNodes.append('g')
      .attr('class', 'connectionStats');
    // its background
    enteringStats.append('circle')
      .attr('class', 'statsBackground');
    // its tooltip
    enteringStats.append('title');
    // its text
    enteringStats.append('text');
    let stats = nodes.selectAll('g.connectionStats')
      .attr('text-anchor', 'middle')
      .attr('class', d => {
        let classString = 'connectionStats ';
        if (d.optional) {
          classString += 'optional';
        } else if (d.establishedConnections >= 1) {
          classString += 'satisfied';
        } else {
          classString += 'notSatisfied';
        }
        return classString;
      });
    stats.selectAll('text')
      .each(function (d) {
        // this refers to the DOM element
        let stats = d.establishedConnections + ' / ';
        if (isFinite(d.possibleConnections)) {
          stats += d.possibleConnections;
        } else {
          stats += '\u221E';
        }
        this.textContent = stats;
        // now that we know the size of the fraction text,
        // we can scale its background appropriately, as well
        // as calculate how wide and where the whole node should be
        let bounds = this.getBoundingClientRect();
        let radius = Math.sqrt(Math.pow(bounds.width, 2), Math.pow(bounds.height, 2)) / 2;
        jQuery(this.parentNode).find('circle.statsBackground')
          .attr('cy', bounds.height / 2 - 0.8 * self.layout.emSize)
          .attr('r', radius + 0.5 * self.layout.emSize);

        widthSuggestions.minWidth = Math.max(widthSuggestions.minWidth,
          bounds.width / 2 + 0.25 * self.layout.emSize +
          (1.25 * d.type.length * self.layout.emSize));
        widthSuggestions.xPosition = Math.min(widthSuggestions.xPosition,
          self.layout.width - self.layout.emSize - bounds.width / 2 -
          widthSuggestions.minWidth);
      });
    stats.selectAll('title')
      .text(d => {
        let tooltip = d.establishedConnections + ' out of ';
        if (isFinite(d.possibleConnections)) {
          tooltip += d.possibleConnections;
        } else {
          tooltip += '\u221E';
        }
        tooltip += ' possible connections have been established.';
        if (!d.optional) {
          tooltip += '\nAt least one connection is required';
        }
        return tooltip;
      });

    // group containing icons representing compatible data types
    // (also create their tooltips)
    enteringNodes.append('g')
      .attr('class', 'typeIcons');
    let typeIcons = nodes.selectAll('g.typeIcons').selectAll('image')
      .data(d => d.type); // For vis nodes, d.type is an array, not a string
    typeIcons.enter().append('image').append('title');
    typeIcons.attr('xlink:href', d => ICONS[d])
      .attr('x', (d, i) => (1.25 * i) + 'em');
    typeIcons.selectAll('title')
      .text(d => 'Compatible with ' + d + ' data attributes');

    // vis encoding name
    enteringNodes.append('text')
      .attr('class', 'label')
      .attr('y', '-0.25em');
    nodes.selectAll('text.label').each(function (d) {
      // this refers to the DOM element
      let label = d.attrName;
      this.textContent = label;

      widthSuggestions.idealWidth = Math.max(widthSuggestions.idealWidth,
        this.getComputedTextLength());
    });
    return widthSuggestions;
  },
  positionNodes: function () {
    let self = this;
    let nodes = d3.select(this.el).select('svg')
      .select('.nodeLayer')
      .selectAll('.node');

    // Move nodes to their new positions
    nodes.transition().duration(function (d) {
      // Animate any already-existing nodes
      // (this refers to the DOM element)
      if (jQuery(this).hasClass('update')) {
        return 300;
      } else {
        return 0;
      }
    }).attr('transform', d => {
      if (d.side === 'vis') {
        return 'translate(' + this.layout.visX + ',' +
          this.layout.yVisScale(this.graph.nodeLookup[d.id].index) + ')';
      } else {
        return 'translate(' + this.layout.dataX + ',' +
          this.layout.yDataScale(this.graph.nodeLookup[d.id].index) + ')';
      }
    });

    // Set the size of each rectangle appropriately
    nodes.selectAll('rect.nodeBackground')
      .attr('width', d => {
        if (d.side === 'vis') {
          return this.layout.visWidth + 0.5 * this.layout.emSize;
        } else {
          return this.layout.dataWidth + 0.5 * this.layout.emSize;
        }
      }).attr('x', '-0.25em');

    // Anchor the stats bubble to the right
    nodes.selectAll('g.connectionStats')
      .attr('transform', 'translate(' + (this.layout.visWidth + 0.25 * this.layout.emSize) +
                         ',' + 1.125 * this.layout.emSize + ')');

    // Shrink the text labels so that they fit
    nodes.selectAll('text.label').each(function (d) {
      // this refers to the DOM element
      let label = d.attrName;
      this.textContent = label;

      // Shrink the label so that it fits. Calculate available space:
      let maxTextLength;
      if (d.side === 'vis') {
        maxTextLength = self.layout.visWidth;
      } else {
        maxTextLength = self.layout.dataWidth - 1.25 * self.layout.emSize;
      }

      while (this.getComputedTextLength() >= maxTextLength) {
        if (label.length <= 4) {
          // Too small to even show a label
          this.textContent = '';
          break;
        }
        // Swap out the middle four characters
        // and replace them with three periods
        let mid = Math.floor(label.length / 2);
        label = label.slice(0, mid - 2) + '...' + label.slice(mid + 2);
        this.textContent = label;
      }
    });
  },
  renderEdges: function () {
    let self = this;
    // Draw the connections
    let edges = d3.select(this.el).select('svg')
      .select('.linkLayer')
      .selectAll('.edge').data(this.graph.edges, d => d.id);

    // add class labels to distinguish the new edges from the old ones
    edges.attr('class', d => 'update edge ' + d.mode);
    edges.enter().append('path')
      .attr('class', d => 'enter edge ' + d.mode)
      .attr('opacity', 0)
        .transition().duration(300)
        .attr('opacity', 1);

    // Animate any existing edges before we add new ones
    edges.transition().duration(function (d) {
      // Animate any already-existing edges
      // (this refers to the DOM element)
      if (jQuery(this).hasClass('update')) {
        return 300;
      } else {
        return 0;
      }
    }).attr('d', d => {
      let pathString = 'M' + (this.layout.dataX + this.layout.dataWidth) + ',' +
        this.layout.yDataScale(d.dataIndex) +
        'L' + this.layout.visX + ',' + this.layout.yVisScale(d.visIndex);
      return pathString;
    });
    edges.exit().remove();
    edges.attr('id', d => d.id)
      .on('mouseover', function (d) {
        // this refers to the DOM element
        self.hoverEdge(d, this);
      }).on('mouseout', d => {
        // Clear any highlights
        this.$el.find('.hovered').removeClass('hovered');
      }).on('click', d => {
        this.clickEdge(d);
      });
  },
  render: Underscore.debounce(function () {
    let widgetIsShowing = Widget.prototype.render.apply(this, arguments);

    // Construct a graph from each of the specs
    // (and the currently selected node)
    this.updateGraph();

    // Add our template if it's not already there
    // (or if we simply want to clear the widget)
    if (this.$el.find('svg').length === 0 || this.graph === null) {
      this.$el.html(myTemplate);
      // Add the function to deselect everything when
      // the canvas is clicked
      d3.select(this.el).select('svg')
        .on('click', () => {
          this.selection = null;
          this.render();
        });
    }

    // Update our little indicator to describe the matching
    if (this.graph === null || this.graph.requiredConnections === 0) {
      this.status = STATUS.NOTHING_TO_MAP;
      this.statusText.text = '--';
      this.statusText.title = 'There are no required visual encodings';
    } else {
      this.statusText.text = this.graph.satisfiedConnections + ' / ' + this.graph.requiredConnections;
      this.statusText.title = this.graph.satisfiedConnections + ' of the minimum required ' +
        this.graph.requiredConnections + ' connections have been established';
      if (this.graph.satisfiedConnections < this.graph.requiredConnections) {
        this.status = STATUS.NOT_ENOUGH_MAPPINGS;
      } else {
        this.status = STATUS.OK;
      }
    }
    this.renderIndicators();

    if (this.graph === null || !widgetIsShowing) {
      // We don't need to actually draw the interface;
      // only the indicators are important
      this.layout = null;
      return;
    }

    // Okay, let's figure out the layout
    this.layout = {
      emSize: parseFloat(this.$el.css('font-size'))
    };

    this.layout.dataNodeHeight = 1.5 * this.layout.emSize;
    this.layout.visNodeHeight = 3.0 * this.layout.emSize;

    // Temporarily force the scroll bars so we
    // account for their size
    this.$el.css('overflow', 'scroll');
    this.layout.width = this.el.clientWidth;
    this.layout.height = this.el.clientHeight;
    this.layout.visHeight = 1.5 * this.layout.visNodeHeight * (this.graph.visNodes.length + 2);
    this.layout.dataHeight = 1.5 * this.layout.dataNodeHeight * (this.graph.dataNodes.length + 2);
    this.$el.css('overflow', '');

    this.layout.fullHeight = Math.max(this.layout.height,
                                      this.layout.visHeight,
                                      this.layout.dataHeight);

    this.$el.find('svg')
      .attr({
        width: this.layout.width,
        height: this.layout.fullHeight
      });

    // Okay, we've figured out the size of our canvas.
    // Next up: how to lay things out vertically?

    // Just spread the data nodes out to fill the whole space
    this.layout.yDataScale = d3.scale.linear()
      .domain([-1, this.graph.dataNodes.length])
      .range([0, this.layout.fullHeight]);

    // We want the vis nodes to move to wherever
    // the user has scrolled
    let scrollTop = this.$el.scrollTop();
    if (this.layout.visHeight > this.layout.height) {
      // We may want to adjust the top if the vis nodes
      // actually take up more space than can be seen;
      // first try to center the nodes on the screen
      scrollTop -= (this.layout.visHeight - this.layout.height) / 2;
      // ... and make sure we're not out of scrollable range
      if (scrollTop + this.layout.visHeight >= this.layout.fullHeight) {
        scrollTop = this.layout.fullHeight - this.layout.visHeight;
      }
      if (scrollTop < 0) {
        scrollTop = 0;
      }
    }

    this.layout.yVisScale = d3.scale.linear()
      .domain([-1, this.graph.visNodes.length])
      .range([scrollTop, scrollTop + this.layout.visHeight]);

    // Horizontal layout actually depends largely on the contents
    // of each cell, so we need to render the nodes first

    let suggestions = this.renderDataNodes();
    this.layout.dataX = suggestions.xPosition;
    this.layout.dataWidth = suggestions.idealWidth;
    this.layout.dataWidth = Math.max(suggestions.minWidth, this.layout.dataWidth);
    this.layout.dataWidth = Math.min(suggestions.maxWidth, this.layout.dataWidth);

    suggestions = this.renderVisNodes();
    this.layout.visX = suggestions.xPosition;
    this.layout.visWidth = suggestions.idealWidth;
    this.layout.visWidth = Math.max(suggestions.minWidth, this.layout.visWidth);
    this.layout.visWidth = Math.min(suggestions.maxWidth, this.layout.visWidth);

    // Now we can update all the nodes with their new positions
    this.positionNodes();

    // Finally, with all the nodes in position, we can draw the
    // edges between them
    this.renderEdges();
  }, 200)
});

export default MatchingView;
