import myTemplate from './template.svg';
import Widget from '../Widget';

let DATA_TYPES = {
  BOOLEAN: 'Boolean',
  NUMBER: 'Number',
  STRING: 'String',
  DATE: 'Date',
  LIST: 'List',
  DICT: 'Dict'
};
let NODE_MODES = {
  INELIGIBLE: 0,
  WILL_SELECT: 1,
  WILL_CONNECT: 2,
  WILL_DISCONNECT: 3,
  SELECTED: 4
};
let EDGE_TYPES = {
  ESTABLISHED: 0,
  ESTABLISHED_SELECTED: 1,
  POTENTIAL: 2,
  PROBABLE: 3
};

/* let Matcher = Backbone.Model.extend({
  defaults: {
    dataSpec: {
      file1: {
        attr1: DATA_TYPES.LAT_LON,
        attr2: DATA_TYPES.BOOLEAN
      },
      file2: {
        attr3: DATA_TYPES.NUMBER,
        attr4: DATA_TYPES.STRING
      }
    },
    visSpec: {
      bars: {
        'bar height, y scale': [
                    DATA_TYPES.NUMBER
                ],
        'bar position, x scale': [
                    DATA_TYPES.BOOLEAN,
                    DATA_TYPES.NUMBER,
                    DATA_TYPES.STRING,
                    DATA_TYPES.DATE
                ]
      }
    },
    mappings: {
      bars: {
        'bar height, y scale': {
          file: 'file2',
          attr: 'attr3'
        },
        'bar position, x scale': {
          file: 'file2',
          attr: 'attr4'
        }
      }
    },
    selection: null
  }
}); */

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
    
    console.log(specs);
    
    /*
    let selectedKey;

    if (self.selection !== null) {
      selectedKey = 'meta.' + selection.side + '["' +
        selection.group + '"]["' +
        selection.attr + '"]';
    }

    // Reshape the tree into a node/edge tables
    // for easy drawing and interaction
    let nodeLookup = {};
    let nodes = [];
    let edges = [];

    // Extract all the nodes (from both sides)
    let spec, groupName, attrName, attrType, attrTypes;

    for (spec in specs) {
      if (specs.hasOwnProperty(spec)) {
        for (groupName in specs[spec]) {
          if (specs[spec].hasOwnProperty(groupName)) {
            for (attrName in specs[spec][groupName]) {
              if (specs[spec][groupName].hasOwnProperty(attrName)) {
                // Add a node
                let key = spec + 'Spec["' +
                  groupName + '"]["' +
                  attrName + '"]';
                nodeLookup[key] = nodes.length;
                let newNode = {
                  side: spec,
                  group: groupName,
                  attr: attrName,
                  type: specs[spec][groupName][attrName],
                  probable: false
                    // "probable" might be overridden later
                };
                if (selection === null) {
                  newNode.mode = NODE_MODES.WILL_SELECT;
                } else if (selectedKey === key) {
                  newNode.mode = NODE_MODES.SELECTED;
                } else if (selection.side === newNode.side) {
                  // You can always switch to selecting
                  // a different node on the same side
                  newNode.mode = NODE_MODES.WILL_SELECT;
                } else {
                  // Do any of the attribute types match?
                  attrType = specs[spec][groupName][attrName];
                  if (attrType instanceof Array) {
                    attrTypes = attrType;
                    attrType = specs[selection.side][selection.group][selection.attr];
                  } else {
                    attrTypes = specs[selection.side][selection.group][selection.attr];
                  }
                  if (attrTypes.indexOf(attrType) === -1) {
                    newNode.mode = NODE_MODES.INELIGIBLE;
                  } else {
                    newNode.mode = NODE_MODES.WILL_CONNECT;
                  }
                }
                nodes.push(newNode);
              }
            }
          }
        }
      }
    }

    // Get the established edges
    let sourceKey, targetKey, newEdge, temp;

    for (groupName in mappings) {
      if (mappings.hasOwnProperty(groupName)) {
        for (attrName in mappings[groupName]) {
          if (mappings[groupName].hasOwnProperty(attrName)) {
            // Add an edge
            targetKey = 'visSpec["' +
              groupName + '"]["' +
              attrName + '"]';
            sourceKey = 'dataSpec["' +
              mappings[groupName][attrName].file + '"]["' +
              mappings[groupName][attrName].attr + '"]';
            newEdge = {
              source: nodeLookup[sourceKey],
              target: nodeLookup[targetKey]
            };
            if (selection !== null) {
              // Special settings for edges attached
              // to the selected node, as well as
              // the nodes on the other end
              if (sourceKey === selectedKey) {
                nodes[nodeLookup[targetKey]].mode = NODE_MODES.WILL_DISCONNECT;
                newEdge.type = EDGE_TYPES.ESTABLISHED_SELECTED;
              } else if (targetKey === selectedKey) {
                nodes[nodeLookup[sourceKey]].mode = NODE_MODES.WILL_DISCONNECT;
                newEdge.type = EDGE_TYPES.ESTABLISHED_SELECTED;
              } else {
                newEdge.type = EDGE_TYPES.ESTABLISHED;
              }
            } else {
              newEdge.type = EDGE_TYPES.ESTABLISHED;
            }
            edges.push(newEdge);
          }
        }
      }
    }

    // Add the potential and probable edges
    if (selection !== null) {
      let otherSide = selection.side === 'vis' ? 'data' : 'vis';
      let otherKey;

      for (groupName in specs[otherSide]) {
        if (specs[otherSide].hasOwnProperty(groupName)) {
          for (attrName in specs[otherSide][groupName]) {
            if (specs[otherSide][groupName].hasOwnProperty(attrName)) {
              // Figure out what sort of relationship
              // the selected node has with each node
              // on the other side
              otherKey = otherSide + 'Spec["' +
                groupName + '"]["' +
                attrName + '"]';
              temp = nodes[nodeLookup[otherKey]];
              if (temp.mode !== NODE_MODES.WILL_CONNECT) {
                continue;
              }

              // Always point edges toward the vis side
              if (selection.side === 'vis') {
                targetKey = selectedKey;
                sourceKey = otherKey;
              } else {
                sourceKey = selectedKey;
                targetKey = otherKey;
              }
              newEdge = {
                source: nodeLookup[sourceKey],
                target: nodeLookup[targetKey]
              };

              // TODO: get the probable nodes:
              // If the selected node is on the
              // vis side, this node is "probable"
              // if and only if another node in
              // this group has a link to a node
              // in the same group as the
              // selected node...
              newEdge.type = EDGE_TYPES.POTENTIAL;

              edges.push(newEdge);
            }
          }
        }
      }
    }

    return {
      nodes: nodes,
      edges: edges
    };
    
    */
  },
  render: function () {
    let self = this;

    // Construct a graph from each of the specs
    // (and the currently selected node)
    let graph = self.constructLookups();

    /*
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

    // Figure out how we're going to lay things
    // out based on how much space we have
    // TODO: do some fancy vertical scrolling
    // if there's not enough space
    let bounds = self.$el.find('.wrapper')[0].getBoundingClientRect();
    self.$el.find('svg')
      .attr({
        width: bounds.width,
        height: bounds.height
      });
    self.$el.find('#ineligibleHint')
      .attr('transform', 'translate(' + (bounds.width / 2) + ',' + (bounds.height - 100) + ')');

    let dataX = bounds.width / 4,
      visX = 3 * bounds.width / 4,
      nodeWidth = bounds.width / 4,
      dataY = d3.scale.linear()
      .domain([firstData - 1, lastData + 1])
      .range([0, bounds.height]),
      visY = d3.scale.linear()
      .domain([firstVis - 1, lastVis + 1])
      .range([0, bounds.height]),
      nodeHeight = 40;

    // Draw the nodes
    let nodes = self.d3el.select('svg')
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
    }).on('mouseover', function (d) {
      if (d.mode === NODE_MODES.INELIGIBLE) {
        self.$el.find('#ineligibleHint').show(200);
      }
      window.clearTimeout(self.timer);
      self.timer = window.setTimeout(function () {
        self.$el.find('#ineligibleHint').hide(1000);
      }, 10000);
    }).on('click', function (d) {
      d3.event.stopPropagation();
      let mappings, selection, visNode, dataNode;
      // Interactions are different, depending on our state
      if (d.mode === NODE_MODES.WILL_SELECT) {
        // Change the selection
        self.model.set('selection', {
          side: d.side,
          group: d.group,
          attr: d.attr
        });
        self.model.trigger('change');
      } else if (d.mode === NODE_MODES.WILL_CONNECT) {
        // Establish a connection from the
        // selected node to the clicked node
        mappings = self.model.get('mappings');
        selection = self.model.get('selection');
        if (d.side === 'vis') {
          visNode = d;
          dataNode = selection;
        } else {
          visNode = selection;
          dataNode = d;
        }
        if (!mappings.hasOwnProperty(visNode.group)) {
          mappings[visNode.group] = {};
        }
        mappings[visNode.group][visNode.attr] = {
          file: dataNode.group,
          attr: dataNode.attr
        };

        self.model.set('mappings', mappings);
        self.model.trigger('change');
      } else if (d.mode === NODE_MODES.WILL_DISCONNECT) {
        // Remove the connection between the
        // selected node and the clicked node
        mappings = self.model.get('mappings');
        selection = self.model.get('selection');
        if (d.side === 'vis') {
          visNode = d;
          dataNode = selection;
        } else {
          visNode = selection;
          dataNode = d;
        }
        delete mappings[visNode.group][visNode.attr];
        if (Object.keys(mappings[visNode.group]).length === 0) {
          delete mappings[visNode.group];
        }

        self.model.set('mappings', mappings);
        self.model.trigger('change');
      } else if (d.mode === NODE_MODES.SELECTED) {
        // Select nothing
        self.model.set('selection', null);
        self.model.trigger('change');
      }
    });

    enteringNodes.append('rect')
      .attr({
        width: nodeWidth,
        height: nodeHeight,
        x: -nodeWidth / 2,
        y: -nodeHeight / 2
      });

    enteringNodes.append('text')
      .attr('class', 'label')
      .attr('y', 0);
    nodes.selectAll('text.label').text(function (d) {
      return d.attr;
    });

    enteringNodes.append('text')
      .attr('class', 'types')
      .attr('y', nodeHeight / 3);
    nodes.selectAll('text.types').text(function (d) {
      if (d.type instanceof Array) {
        return d.type.join(', ');
      } else {
        return d.type;
      }
    });

    // Draw the connections
    let edges = self.d3el.select('svg')
      .select('.linkLayer')
      .selectAll('.edge').data(graph.edges);
    let enteringEdges = edges.enter().append('path');
    edges.exit().remove();

    edges.attr('class', function (d) {
      let classString = '';
      // Edge type
      if (d.type === EDGE_TYPES.POTENTIAL) {
        classString = 'potential';
      } else if (d.type === EDGE_TYPES.ESTABLISHED) {
        classString = 'established';
      } else if (d.type === EDGE_TYPES.ESTABLISHED_SELECTED) {
        classString = 'established selected';
      } else if (d.type === EDGE_TYPES.PROBABLE) {
        classString = 'probable';
      }
      return classString + ' edge';
    }).attr('d', function (d) {
      let sourceNode = graph.nodes[d.source],
        targetNode = graph.nodes[d.target];

      let pathString = 'M' + (dataX + nodeWidth / 2) + ',' +
        dataY(d.source) +
        'L' + (visX - nodeWidth / 2) + ',' +
        visY(d.target);
      return pathString;
    });
    
    */
  }
});

export default MappingView;
