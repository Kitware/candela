import d3 from 'd3';
import myTemplate from './template.html';
import Widget from '../Widget';
import Dataset from '../../../models/Dataset';
import './style.css';

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

/*
let testData = {
  'data': [{
    'name': 'cars.csv',
    'attributes': {
      'name': 'string',
      'economy (mpg)': 'number',
      'cylinders': 'integer',
      'displacement (cc)': 'number',
      'power (hp)': 'integer',
      'weight (lb)': 'integer',
      '0-60 mph (s)': 'number',
      'year': 'integer'
    }
  }],
  'vis': [{
    'name': 'Scatter',
    'options': [{
      'name': 'x',
      'type': 'number',
      'selector': ['field']
    }, {
      'name': 'y',
      'type': 'number',
      'selector': ['field']
    }, {
      'name': 'color',
      'type': 'string',
      'selector': ['field', 'text']
    }]
  }]
};
*/

let MappingView = Widget.extend({
  initialize: function (args) {
    let self = this;

    self.friendlyName = 'Mapping';
    self.hashName = 'mappingView';

    self.selection = null;
    
    self.listenTo(window.toolchain, 'rra:changeMappings', self.render);
  },
  constructLookups: function () {
    let self = this;

    let meta = window.toolchain.get('meta');

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
    
    // Temporary test data
    // specs = testData;

    let selectedKey;
    if (self.selection !== null) {
      selectedKey = 'specs.' + self.selection.side + '[' +
        self.selection.index + ']["' +
        self.selection.attrName + '"]';
    }

    // Reshape the tree into a node/edge tables
    // for easy drawing and interaction
    let nodeLookup = {};
    let nodes = [];
    let edges = [];
    
    // Helper functions
    function _createNode (side, groupIndex, attrName, attrType) {
      let key = 'specs.' + side + '[' + groupIndex +
          ']["' + attrName + '"]';
      nodeLookup[key] = nodes.length;
      let newNode = {
        key: key,
        side: side,
        index: groupIndex,
        attrName: attrName,
        type: attrType
      };
      
      if (self.selection === null) {
        newNode.mode = NODE_MODES.WILL_SELECT;
      } else if (selectedKey === key) {
        newNode.mode = NODE_MODES.SELECTED;
      } else if (self.selection.side === newNode.side) {
        // You can always switch to selecting
        // a different node on the same side
        newNode.mode = NODE_MODES.WILL_SELECT;
      } else if (newNode.side === 'vis') {
        // Does the selected data node's type match
        // an of our compatible types?
        if (Dataset.COMPATIBLE_TYPES[newNode.type]
            .indexOf(self.selection.baseType) === -1) {
          newNode.mode = NODE_MODES.INELIGIBLE;
        } else {
          newNode.mode = NODE_MODES.WILL_CONNECT;
        }
      } else {
        // Is our type compatible with any of the
        // vis node's types?
        if (Dataset.COMPATIBLE_TYPES[self.selection.baseType]
            .indexOf(newNode.type) === -1) {
          newNode.mode = NODE_MODES.INELIGIBLE;
        } else {
          newNode.mode = NODE_MODES.WILL_CONNECT;
        }
      }
      nodes.push(newNode);
    }
    
    function _createEdge (established, visIndex, visAttrName, dataIndex, dataAttrName) {
      // Edges always go from data to vis
      let sourceKey = 'specs.data[' + dataIndex +
          ']["' + dataAttrName + '"]';
      let targetKey = 'specs.vis[' + visIndex +
          ']["' + visAttrName + '"]';
      let newEdge = {
        source: nodeLookup[sourceKey],
        target: nodeLookup[targetKey]
      };
      
      if (established) {
        // These edges already exist
        newEdge.mode = EDGE_MODES.ESTABLISHED;
        if (self.selection !== null) {
          // Special settings for edges attached
          // to the selected node, as well as
          // the nodes on the other end
          if (sourceKey === selectedKey) {
            nodes[nodeLookup[targetKey]].mode = NODE_MODES.WILL_DISCONNECT;
            newEdge.mode = EDGE_MODES.ESTABLISHED_SELECTED;
          } else if (targetKey === selectedKey) {
            nodes[nodeLookup[sourceKey]].mode = NODE_MODES.WILL_DISCONNECT;
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
        _createNode('vis', visIndex, option.name, option.type);
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
      edges: edges
    };
  },
  render: function () {
    let self = this;
    
    // TODO: I need a rra:mappingsInvalidated signal
    // in addition to rra:changeMappings (so we
    // can set self.selection to null)
    
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
    let bounds = self.el.getBoundingClientRect();
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
    let nodeHeight = 40;

    // Draw the nodes
    let nodes = d3.select(self.el).select('svg')
      .select('.nodeLayer')
      .selectAll('.node').data(graph.nodes);
    let enteringNodes = nodes.enter().append('g');
    nodes.exit().remove();

    nodes.attr('class', function (d) {
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
    }).on('click', function (d) {
      d3.event.stopPropagation();
      var visNode;
      var dataNode;
      
      // Interactions are different, depending on our state
      if (d.mode === NODE_MODES.WILL_SELECT) {
        // Change the selection
        self.selection = {
          side: d.side,
          index: d.index,
          attrName: d.attrName,
          baseType: d.type
        };
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
        let meta = window.toolchain.get('meta');
        meta.mappings.push({
          visIndex: visNode.index,
          visAttribute: visNode.attrName,
          dataIndex: dataNode.index,
          dataAttribute: dataNode.attrName
        });
        window.toolchain.set('meta', meta);
        window.toolchain.trigger('rra:changeMappings');
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
        let meta = window.toolchain.get('meta');
        
        meta.mappings.forEach(function (mapping, index) {
          if (mapping.visIndex === visNode.index &&
              mapping.visAttribute === visNode.attrName &&
              mapping.dataIndex === dataNode.index &&
              mapping.dataAttribute === dataNode.attrName) {
            meta.mappings.splice(index, 1);
          }
        });
        window.toolchain.set('meta', meta);
        window.toolchain.trigger('rra:changeMappings');
      } else if (d.mode === NODE_MODES.SELECTED) {
        self.selection = null;
        self.render();
      }
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
          // TODO: highlight the connected type
          return Dataset.COMPATIBLE_TYPES[d.type].join(',');
        }
      });
    
    // Draw the connections
    let edges = d3.select(self.el).select('svg')
      .select('.linkLayer')
      .selectAll('.edge').data(graph.edges);
    edges.enter().append('path');
    edges.exit().remove();

    edges.attr('class', function (d) {
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
    });
  }
});

export default MappingView;
