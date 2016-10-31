import Underscore from 'node/underscore';
import d3 from 'node/d3';
import jQuery from 'node/jquery';
import myTemplate from './template.html';
import Widget from '../Widget';
import candela from '../../../../../src/candela';
import './style.scss';

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

    this.status = STATUS.NOTHING_TO_MAP;
    this.icons.push({
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
      className: () => {
        if (this.status === STATUS.OK) {
          return 'okay';
        } else if (this.status === STATUS.DATASETS_NOT_LOADED ||
          this.status === STATUS.STALE_MAPPINGS) {
          return 'loading';
        } else {
          return 'warning';
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

    if (window.mainPage.project) {
      this.stopListening(window.mainPage.project, 'rl:changeDatasets');
      this.listenTo(window.mainPage.project, 'rl:changeDatasets',
        this.render);

      this.stopListening(window.mainPage.project, 'rl:changeMatchings');
      this.listenTo(window.mainPage.project, 'rl:changeMatchings', () => {
        this.selection = null;
        this.render();
      });
    }
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
    } else if (this.status === STATUS.LOADING) {
      window.mainPage.overlay.renderLoadingScreen('Still loading needed information.');
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
  isSatisfied: function () {
    if (!this.graph) {
      return false;
    } else {
      return this.graph.satisfiedConnections === this.graph.requiredConnections;
    }
  },
  updateGraph: function (loadedDatasets) {
    if (!loadedDatasets) {
      this.graph = null;
      return;
    }

    let meta = window.mainPage.project.getMeta();

    let specs = {
      data: [],
      vis: []
    };

    if (meta.datasets) {
      meta.datasets.forEach(d => {
        let datasetObj = loadedDatasets[d.dataset];
        if (datasetObj) {
          specs.data.push(datasetObj.getTypeSpec());
        }
      });
    }
    if (meta.visualizations) {
      meta.visualizations.forEach(d => {
        specs.vis.push(d);
      });
    }

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
        groupIndex: groupIndex,
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
      nodeLookup[newNode.id] = side === 'vis' ? visNodes.length : dataNodes.length;

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
      return newNode;
    };

    let _createEdge = (established, visGroupIndex, visAttrName,
                                    dataGroupIndex, dataAttrName) => {
      // We need to convert visIndex + visAttrName
      // into an index into the visNodes array
      // (and likewise for dataIndex + dataAttrName)
      let visNodeId = this.createNodeId({
        side: 'vis',
        groupIndex: visGroupIndex,
        attrName: visAttrName
      });
      let dataNodeId = this.createNodeId({
        side: 'data',
        groupIndex: dataGroupIndex,
        attrName: dataAttrName
      });
      let newEdge = {
        visIndex: nodeLookup[visNodeId],
        dataIndex: nodeLookup[dataNodeId]
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
          if (this.selection.id === dataNodeId) {
            visNodes[newEdge.visIndex].mode = NODE_MODES.WILL_DISCONNECT;
            newEdge.mode = EDGE_MODES.ESTABLISHED_SELECTED;
          } else if (this.selection.id === visNodeId) {
            dataNodes[newEdge.dataIndex].mode = NODE_MODES.WILL_DISCONNECT;
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
          if (dataNodes[newEdge.dataIndex].mode !== NODE_MODES.WILL_CONNECT) {
            return;
          }
        } else if (this.selection.side === 'data') {
          if (visNodes[newEdge.visIndex].mode !== NODE_MODES.WILL_CONNECT) {
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
      nodeEdgeLookup[dataNodeId].push(edges.length);
      nodeEdgeLookup[visNodeId].push(edges.length);
      edges.push(newEdge);
      return newEdge;
    };

    try {
      // Extract all the nodes (from both sides)
      specs.data.forEach((dataSpec, dataIndex) => {
        for (let attrName of Object.keys(dataSpec.attributes)) {
          _createNode('data', dataIndex, attrName, dataSpec.attributes[attrName], true, 1);
        }
      });
      specs.vis.forEach((visSpec, visIndex) => {
        let candelaSpec = candela.components[visSpec.name];
        candelaSpec.options.forEach((option, attrIndex) => {
          if (option.domain && option.domain.mode === 'field') {
            _createNode('vis', visIndex, option.name, option.domain.fieldTypes, option.optional,
              option.type === 'string_list' ? Infinity : 1);
          }
        });
      });

      // Get the established edges
      if (meta.matchings) {
        for (let matching of meta.matchings) {
          let newEdge = _createEdge(true, matching.visIndex, matching.visAttribute,
            matching.dataIndex, matching.dataAttribute);
          // Count this connection in each node
          visNodes[newEdge.visIndex].establishedConnections += 1;
          dataNodes[newEdge.dataIndex].establishedConnections += 1;
          if (!visNodes[newEdge.visIndex].optional &&
               visNodes[newEdge.visIndex].establishedConnections === 1) {
            // this edge just satisfied a requirement (for now, we're
            // assuming that a non-optional vis encoding only requires
            // one connection to satisfy the requirement)
            satisfiedConnections += 1;
          }
        }
      }

      // Add the potential and probable edges
      if (this.selection !== null) {
        if (this.selection.side === 'data') {
          specs.vis.forEach((visSpec, visGroupIndex) => {
            let candelaSpec = candela.components[visSpec.name];
            candelaSpec.options.forEach(option => {
              if (option.domain && option.domain.mode === 'field') {
                _createEdge(false, visGroupIndex, option.name,
                  this.selection.groupIndex, this.selection.attrName);
              }
            });
          });
        } else {
          specs.data.forEach((dataSpec, dataGroupIndex) => {
            for (let attrName of Object.keys(dataSpec.attributes)) {
              _createEdge(false, this.selection.groupIndex, this.selection.attrName,
                dataGroupIndex, attrName);
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
      // (will trigger a render call on its own)
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
      // (will trigger a render call on its own)
    } else if (d.mode === NODE_MODES.SELECTED) {
      this.selection = null;
      this.render();
    }
  },
  clickEdge: function (d) {
    if (this.selection === null) {
      // Neither side is selected; snip this edge
      let visNode = this.graph.visNodes[d.visIndex];
      let dataNode = this.graph.dataNodes[d.dataIndex];
      window.mainPage.project.removeMatching({
        visIndex: visNode.groupIndex,
        visAttribute: visNode.attrName,
        dataIndex: dataNode.groupIndex,
        dataAttribute: dataNode.attrName
      });
    } else if (this.selection.side === 'vis') {
      this.clickNode(this.graph.dataNodes[d.dataIndex]);
    } else {
      this.clickNode(this.graph.visNodes[d.visIndex]);
    }
  },
  hoverNode: function (node, domElement) {
    // Highlight the node
    jQuery(domElement).addClass('hovered');

    // Highlight the edge between this node and the selection
    if (this.selection !== null && this.selection.id !== node.id) {
      this.graph.nodeEdgeLookup[node.id].forEach(edgeIndex => {
        let edge = this.graph.edges[edgeIndex];
        if (this.graph.dataNodes[edge.dataIndex].id === this.selection.id ||
            this.graph.visNodes[edge.visIndex].id === this.selection.id) {
          jQuery('#' + this.graph.edges[edgeIndex].id).addClass('hovered');
        }
      });
    }
  },
  hoverEdge: function (edge, domElement) {
    // Highlight the edge
    jQuery(domElement).addClass('hovered');

    // Highlight connected nodes appropriately
    let selector;
    if (this.selection === null) {
      selector = '#' + this.graph.dataNodes[edge.dataIndex].id + ', ' +
                 '#' + this.graph.visNodes[edge.visIndex].id;
    } else if (this.selection.id === this.graph.visNodes[edge.visIndex].id) {
      selector = '#' + this.graph.dataNodes[edge.dataIndex].id;
    } else if (this.selection.id === this.graph.dataNodes[edge.dataIndex].id) {
      selector = '#' + this.graph.visNodes[edge.visIndex].id;
    } else {
      // Something is selected, but the user is mousing an irrelevant
      // edge; instead of highlighting connected nodes, we want to
      // remove the hover effect on the edge
      jQuery(domElement).removeClass('hovered');
    }
    if (selector) {
      if (edge.mode === EDGE_MODES.POTENTIAL || edge.mode === EDGE_MODES.PROBABLE) {
        this.$el.find(selector).addClass('hovered');
      } else {
        this.$el.find(selector).addClass('disconnectable');
      }
    }
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
      .selectAll('.data').data(this.graph.dataNodes, d => d.id + d.type);

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
    nodes.select('title.nodeTitle')
      .text(d => d.attrName + ' (' + d.type + ')');

    // background rect
    enteringNodes.append('rect')
      .attr('class', 'nodeBackground');
    nodes.select('rect.nodeBackground')
      .attr('height', this.layout.dataNodeHeight)
      .attr('y', -this.layout.dataNodeHeight / 2);

    // icon representing the data type (and its tooltip)
    enteringNodes.append('image').append('title');
    nodes.select('image')
      .attr('xlink:href', d => ICONS[d.type]);
    nodes.select('image').selectAll('title')
      .text(d => d.attrName + ' is being interpreted as a ' + d.type + '.' +
        '\nYou can change this in the Dataset widget');

    // data attribute name
    enteringNodes.append('text')
      .attr('class', 'label')
      .attr({
        y: '0.35em',
        x: '1.25em'
      });
    nodes.select('text.label').each(function (d) {
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
        return d.id + d.type + d.establishedConnections;
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
    nodes.select('title.nodeTitle')
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
    nodes.select('rect.nodeBackground')
      .attr('height', d => this.layout.visNodeHeight)
      .attr('y', d => -this.layout.visNodeHeight / 2);

    // fraction indicating how many connections exist:
    let enteringStats = enteringNodes.append('g')
      .attr('class', 'connectionStats');
    // its background
    enteringStats.append('path')
      .attr('class', 'statsBackground');
    // its tooltip
    enteringStats.append('title');
    // its text
    enteringStats.append('text');
    let stats = nodes.select('g.connectionStats')
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
    stats.select('text')
      .each(function (d) {
        // this refers to the DOM element
        let stats = d.establishedConnections + '/';
        if (isFinite(d.possibleConnections)) {
          stats += d.possibleConnections;
        } else {
          stats += '\u221E';
        }
        this.textContent = stats;
        // now that we know the size of the fraction text,
        // we can draw its background appropriately, as well
        // as calculate how wide and where the whole node should be
        let bounds = this.getBoundingClientRect();
        let radius = Math.sqrt(Math.pow(bounds.width, 2), Math.pow(bounds.height, 2)) / 2;
        radius = Math.max(radius, 0.8 * self.layout.emSize);
        let cy = bounds.height / 2 - 0.65 * self.layout.emSize;
        let r = radius + 0.5 * self.layout.emSize;
        let backgroundPath = 'M0,' + (cy - r);
        // Draw a circle
        backgroundPath += 'A' + r + ',' + r + ',0,0,0,0,' + (cy + r);
        backgroundPath += 'A' + r + ',' + r + ',0,0,0,0,' + (cy - r);
        jQuery(this.parentNode).find('path.statsBackground')
          .attr('d', backgroundPath);

        widthSuggestions.minWidth = Math.max(widthSuggestions.minWidth,
          bounds.width / 2 + 0.5 * self.layout.emSize +
          (1.25 * d.type.length * self.layout.emSize));
        widthSuggestions.xPosition = Math.min(widthSuggestions.xPosition,
          self.layout.width - self.layout.emSize - radius -
          widthSuggestions.minWidth);
      });
    stats.select('title')
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
    let typeIcons = nodes.select('g.typeIcons').selectAll('image')
      .data(d => d.type); // For vis nodes, d.type is an array, not a string
    typeIcons.enter().append('image').append('title');
    typeIcons.attr('xlink:href', d => ICONS[d])
      .attr('x', (d, i) => (1.25 * i) + 'em');
    typeIcons.select('title')
      .text(d => 'Compatible with ' + d + ' data attributes');

    // vis encoding name
    enteringNodes.append('text')
      .attr('class', 'label')
      .attr('y', '-0.25em');
    nodes.select('text.label').each(function (d) {
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
          this.layout.yVisScale(this.graph.nodeLookup[d.id]) + ')';
      } else {
        return 'translate(' + this.layout.dataX + ',' +
          this.layout.yDataScale(this.graph.nodeLookup[d.id]) + ')';
      }
    });

    // Set the size of each rectangle appropriately
    nodes.select('rect.nodeBackground')
      .attr('width', d => {
        if (d.side === 'vis') {
          return this.layout.visWidth + 0.5 * this.layout.emSize;
        } else {
          return this.layout.dataWidth + 0.5 * this.layout.emSize;
        }
      }).attr('x', '-0.25em');

    // Anchor the stats bubble to the right
    nodes.select('g.connectionStats')
      .attr('transform', 'translate(' + (this.layout.visWidth + 0.25 * this.layout.emSize) +
                         ',' + 1.125 * this.layout.emSize + ')');

    // Shrink the text labels so that they fit
    nodes.select('text.label').each(function (d) {
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
    let edgesEnter = edges.enter().append('g')
      .attr('class', d => 'enter edge ' + d.mode);

    edgesEnter.append('path')
      .attr('class', 'ghostPath');

    edgesEnter.append('path')
      .attr('class', 'visiblePath');

    edgesEnter.append('title');

    // Animate any existing edges before we add new ones
    edges.selectAll('path').transition().duration(function (d) {
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
        this.$el.find('.disconnectable').removeClass('disconnectable');
      }).on('click', d => {
        this.clickEdge(d);
      });
    edges.select('title')
      .text(d => {
        if (d.mode === EDGE_MODES.ESTABLISHED || d.mode === EDGE_MODES.ESTABLISHED_SELECTED) {
          return 'Click to disconnect';
        } else {
          return 'Click to connect';
        }
      });
  },
  render: Underscore.debounce(function () {
    let widgetIsShowing = Widget.prototype.render.apply(this, arguments);

    // Construct a graph from each of the specs
    // (and the currently selected node)
    let datasetsPromise;
    if (!window.mainPage.project) {
      datasetsPromise = Promise.resolve(null);
    } else {
      datasetsPromise = window.mainPage.project.cache.loadedDatasets;
    }
    datasetsPromise.then(loadedDatasets => {
      this.updateGraph(loadedDatasets);

      // Add our template if it's not already there
      // (or if we simply want to clear the widget)
      if (this.$el.find('svg').length === 0 || this.graph === null) {
        this.$el.html(myTemplate);
        // Add listener to empty state images
        this.$el.find('#matchingNoDatasetState').on('click', () => {
          window.mainPage.overlay.render('DatasetLibrary');
        });
        this.$el.find('#matchingNoVisualizationState').on('click', () => {
          window.mainPage.overlay.render('VisualizationLibrary');
        });
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
      this.$el.css('overflow', '');

      // Update whether to show our empty state / helper images
      if (widgetIsShowing) {
        if (this.graph === null || this.graph.dataNodes.length === 0) {
          this.$el.find('#matchingNoDatasetState').show();
          this.$el.find('#matchingNoVisualizationState').css('max-width', '');
        } else {
          this.$el.find('#matchingNoDatasetState').hide();
          this.$el.find('#matchingNoVisualizationState').css('max-width',
            Math.min(20 * this.layout.emSize, this.layout.width / 2));
        }
        if (this.graph === null || this.graph.visNodes.length === 0) {
          this.$el.find('#matchingNoVisualizationState').show();
          this.$el.find('#matchingNoDatasetState').css('max-width', '');
        } else {
          this.$el.find('#matchingNoVisualizationState').hide();
          this.$el.find('#matchingNoDatasetState').css('max-width',
            Math.min(20 * this.layout.emSize, this.layout.width / 2));
        }
      }

      if (this.graph === null || !widgetIsShowing) {
        // We don't need to actually draw the rest of
        // the interface; only the indicators are important
        this.layout = null;
        return;
      }

      // Finish figuring out how much space we have to play with
      this.layout.visHeight = 1.5 * this.layout.visNodeHeight * (this.graph.visNodes.length + 2);
      this.layout.dataHeight = 1.5 * this.layout.dataNodeHeight * (this.graph.dataNodes.length + 2);

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
      if (this.layout.visHeight >= this.layout.height) {
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
      } else {
        // Okay, there's actually more space than we need.
        // Center the vis nodes in the visible space
        scrollTop += (this.layout.height - this.layout.visHeight) / 2;
      }

      this.layout.yVisScale = d3.scale.linear()
        .domain([-1, this.graph.visNodes.length])
        .range([scrollTop, scrollTop + this.layout.visHeight]);

      // Horizontal layout actually depends largely on the contents
      // of each cell, so we need to render the nodes first
      suggestions = this.renderVisNodes();
      this.layout.visX = suggestions.xPosition;
      this.layout.visWidth = suggestions.idealWidth;
      this.layout.visWidth = Math.max(suggestions.minWidth, this.layout.visWidth);
      this.layout.visWidth = Math.min(suggestions.maxWidth, this.layout.visWidth);

      let suggestions = this.renderDataNodes();
      this.layout.dataX = suggestions.xPosition;
      this.layout.dataWidth = suggestions.idealWidth;
      this.layout.dataWidth = Math.min(suggestions.maxWidth, this.layout.dataWidth);

      let spaceBetween = this.layout.visX - (this.layout.dataWidth + this.layout.dataX);
      if (spaceBetween < 7 * this.layout.emSize) {
        // There's very little space; shrink the data nodes
        this.layout.dataWidth = Math.min(this.layout.dataWidth, this.layout.visX -
          this.layout.dataX - 7 * this.layout.emSize);
        // ... but make sure that at least the icon shows up
        this.layout.dataWidth = Math.max(suggestions.minWidth, this.layout.dataWidth);
      } else if (spaceBetween > 20 * this.layout.emSize) {
        // There's a ton of space between; move everything closer together
        let delta = (spaceBetween - 20 * this.layout.emSize) / 2;
        this.layout.dataX += delta;
        this.layout.visX -= delta;
      }

      // Now we can update all the nodes with their new positions
      this.positionNodes();

      // Finally, with all the nodes in position, we can draw the
      // edges between them
      this.renderEdges();
    });
  }, 200)
});

export default MatchingView;
