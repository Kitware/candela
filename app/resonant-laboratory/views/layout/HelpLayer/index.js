import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import cola from 'webcola';
import rewrap from '../../../shims/svgTextWrap.js';
import forceControls from './forceControls.json';
import template from './template.html';
import './style.css';

function arrowGenerator (edge) {
  let arrowAngle = Math.PI / 4;
  let arrowLength = 10;

  let shaftAngle = Math.atan2(edge.target.y - edge.source.y,
    edge.target.x - edge.source.x);

  let leftAngle = Math.PI + shaftAngle - arrowAngle;
  let rightAngle = Math.PI + shaftAngle + arrowAngle;

  let leftCoords = {
    x: edge.target.x + arrowLength * Math.cos(leftAngle),
    y: edge.target.y + arrowLength * Math.sin(leftAngle)
  };
  let rightCoords = {
    x: edge.target.x + arrowLength * Math.cos(rightAngle),
    y: edge.target.y + arrowLength * Math.sin(rightAngle)
  };
  return 'M' + edge.source.x + ',' + edge.source.y +
  'L' + edge.target.x + ',' + edge.target.y +
  'L' + leftCoords.x + ',' + leftCoords.y +
  'L' + edge.target.x + ',' + edge.target.y +
  'L' + rightCoords.x + ',' + rightCoords.y +
  'L' + edge.target.x + ',' + edge.target.y +
  'Z';
}
window.cola = cola;
let HelpLayer = Backbone.View.extend({
  initialize: function () {
    this.relevantTips = {};

    // Layout options. You can tweak these interactively
    // by holding alt+shift, and clicking on the dialog
    // containing the 'Restart' and 'Ok, got it' buttons
    // (don't click the buttons, just the dialog background)
    // When you arrive at numbers you like, paste them here
    this.padding = 9;
    this.margin = 18;

    this.avoidOverlaps = true;
    this.linkDistance = 250;
    this.alpha = 0.7;
    this.convergenceThreshold = 0.01;
    // this.defaultNodeSize = 20;
    this.handleDisconnected = false;

    this.noConstraintIterations = 50;
    this.structuralIterations = 50;
    this.allConstraintIterations = 50;

    this.force = cola.d3adaptor()
      .on('tick', () => {
        d3.select(this.el).select('#nodeLayer').selectAll('.tip')
          .attr('transform', (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
        d3.select(this.el).select('#linkLayer').selectAll('.arrow')
          .attr('d', arrowGenerator);
      });

    this.visible = false;
    this.addedTemplate = false;
    this.showEasterEgg = false;
  },
  setTips: function (tips) {
    this.relevantTips = {};
    this.updateTips(tips, true);
  },
  updateTips: function (tips, forceChange) {
    let changedHelp = !!forceChange;
    Object.keys(tips).forEach(tipSelector => {
      // We use the selector and the message
      // to uniquely identify each tip.
      let tipId = tipSelector; // + tips[tipSelector];
      // Make the id a valid / nice mongo id
      tipId = tipId.replace(/[^a-zA-Z\d]/g, '').toLowerCase();

      let selection = jQuery(tipSelector);
      if (selection.size() === 0) {
        // In removing a tip, we've changed something
        if (this.relevantTips[tipId]) {
          changedHelp = true;
        }

        // The dom elements no longer exist on the page,
        // so remove tips pointing to them
        delete this.relevantTips[tipId];
      } else {
        // Add the tip
        let newTip = {
          tipId: tipId,
          message: tips[tipSelector],
          left: Infinity,
          right: -Infinity,
          top: Infinity,
          bottom: -Infinity
        };

        // Figure out the bounding box that contains
        // all of the matched elements
        selection.each((index, element) => {
          let bounds = element.getBoundingClientRect();
          newTip.left = Math.min(bounds.left, newTip.left);
          newTip.right = Math.max(bounds.right, newTip.right);
          newTip.top = Math.min(bounds.top, newTip.top);
          newTip.bottom = Math.max(bounds.bottom, newTip.bottom);
        });

        // Figure out the center of the bounding box
        newTip.x = (newTip.left + newTip.right) / 2;
        newTip.y = (newTip.top + newTip.bottom) / 2;

        // Did anything actually change from what we had before?
        if (!this.relevantTips[tipId] ||
          this.relevantTips[tipId].message !== newTip.message ||
          newTip.left !== this.relevantTips[tipId].left ||
          newTip.right !== this.relevantTips[tipId].right ||
          newTip.top !== this.relevantTips[tipId].top ||
          newTip.bottom !== this.relevantTips[tipId].bottom) {
          changedHelp = true;
        }

        this.relevantTips[tipId] = newTip;
      }
    });
    if (changedHelp === true) {
      this.render();
    }
  },
  hide: function () {
    this.addedTuner = false;
    jQuery('#tuner').remove();
    this.visible = false;
    this.addedTemplate = false;
    this.render();
  },
  show: function () {
    this.visible = true;
    this.render();
  },
  constructGraph: function () {
    // Figure out how much space we have
    let bounds = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let center = {
      x: bounds.width / 2,
      y: bounds.height / 2
    };

    // Default labels that are always there
    // (not connected to any target)
    let nodes = [
      // Create four bumper nodes to force stuff to stay on the screen
      {
        tipId: 'left',
        nodeType: 'border',
        x: -center.x,
        y: center.y,
        width: bounds.width,
        height: bounds.height,
        fixed: true
      },
      {
        tipId: 'right',
        nodeType: 'border',
        x: 1.5 * bounds.width,
        y: center.y,
        width: bounds.width,
        height: bounds.height,
        fixed: true
      },
      {
        tipId: 'top',
        nodeType: 'border',
        x: center.x,
        y: -center.y,
        width: 2 * bounds.width,
        height: bounds.height,
        fixed: true
      },
      {
        tipId: 'bottom',
        nodeType: 'border',
        x: center.x,
        y: 1.5 * bounds.height,
        width: 2 * bounds.width,
        height: bounds.height,
        fixed: true
      }
    ];
    // Attach nodeIndex to the static nodes
    nodes.forEach((d, i) => {
      d.nodeIndex = i;
    });

    // Create hidden targets, labels, and connect them to each other
    let tipIds = Object.keys(this.relevantTips);
    let unseenTips = [];
    let edges = [];
    for (let tipId of tipIds) {
      let tip = this.relevantTips[tipId];
      let tipNodes = {};

      tipNodes.target = {
        tipId: tipId,
        nodeType: 'arrowhead',
        x: tip.x,
        y: tip.y,
        fixed: true
      };

      tipNodes.label = {
        tipId: tipId,
        nodeType: 'label',
        message: tip.message,
        // Start each label at a random location
        x: Math.random() * bounds.width,
        y: Math.random() * bounds.height
      };

      // Do we add this to the existing graph,
      // or the set of nodes that still need to
      // be added?
      if (window.mainPage.currentUser.preferences.hasSeenTip(tip)) {
        nodes.push(tipNodes.target);
        tipNodes.label.nodeIndex = nodes.length;
        nodes.push(tipNodes.label);
        edges.push({
          source: nodes.length - 1,
          target: nodes.length - 2
        });
      } else {
        unseenTips.push(tipNodes);
      }
    }

    return {
      bounds: bounds,
      center: center,
      nodes: nodes,
      edges: edges,
      unseenTips: unseenTips,
      constraints: []
    };
  },
  render: Underscore.debounce(function () {
    // Stop the force layout if it's running
    this.force.stop();
    if (this.visible === false) {
      // Fade the whole layer out
      d3.select(this.el)
        .style('opacity', 1.0)
        .transition().duration(500)
        .style('opacity', 0.0)
        .attr('display', 'none')
        .style('opacity', null);
    } else {
      if (!this.addedTemplate) {
        this.$el.html(template);
        this.addedTemplate = true;
      }
      d3.select(this.el)
        .attr('display', null);

      // Render the tuner
      this.renderTuner();

      // Get the set of nodes and edges
      let graph = this.constructGraph();

      // Draw / update the full graph
      this.drawGraph(graph);
      this.deriveAllConstraints(graph);
      this.updateForceLayout(graph);

      // Start drawing the unseenTips one at a time
      this.drawNextNode(graph);
    }
  }, 300),
  drawGraph: function (graph, newLabel) {
    let visibleNodes = graph.nodes.filter(node => {
      return node.nodeType === 'label';
    });

    // Update the DOM
    let tips = d3.select(this.el).select('#nodeLayer').selectAll('.tip')
      .data(visibleNodes, d => d.tipId);

    let tipsEnter = tips.enter().append('g');
    tipsEnter
      .style('opacity', 0.0)
      .transition().duration(500)
      .style('opacity', 1.0);

    tips.exit()
      .style('opacity', 1.0)
      .transition().duration(500)
      .style('opacity', 0.0)
      .remove();

    tips.attr('class', d => {
      if (d === newLabel) {
        return 'new tip';
      } else {
        return 'old tip';
      }
    });

    // Background rectangle
    // (we figure out its dimensions later)
    tipsEnter.append('rect');

    // Draw the text
    tipsEnter.append('text')
      .text(d => d.message)
      .attr('text-anchor', d => {
        // Align the text based on where the label
        // starts on the screen
        if (d.x < graph.bounds.width / 3) {
          return 'start';
        } else if (d.x < 2 * graph.bounds.width / 3) {
          return 'middle';
        } else {
          return 'end';
        }
      });

    // Draw the arrows
    let arrows = d3.select(this.el).select('#linkLayer')
      .selectAll('.arrow').data(graph.edges);

    arrows.enter().append('path')
      .attr('class', 'old arrow')
      .style('opacity', 0.0)
      .transition().duration(500)
      .style('opacity', 1.0);

    arrows.exit()
      .style('opacity', 1.0)
      .transition().duration(500)
      .style('opacity', 0.0)
      .remove();
  },
  deriveConstraint: function (graph, tip, domElement) {
    let bounds = domElement.getBoundingClientRect();

    // boundaries relative to the text anchor point
    tip.relative_left = bounds.left;
    tip.relative_right = bounds.right;
    tip.relative_top = bounds.top;
    tip.relative_bottom = bounds.bottom;

    // cola expects the x and y coordinates to
    // be in the center of the node to handle
    // overlaps - so we need to move the text block
    d3.select(domElement).select('text')
      .attr('transform', 'translate(' +
        (-(tip.relative_left + tip.relative_right) / 2) + ',' +
        (-(tip.relative_top + tip.relative_bottom) / 2) + ')');

    // let cola know our dimensions (add in the padding)
    tip.width = tip.relative_right - tip.relative_left + 2 * this.padding;
    tip.height = tip.relative_bottom - tip.relative_top + 2 * this.padding;

    // Set the background rectangle's dimensions
    d3.select(domElement).select('rect')
      .attr('x', -tip.width / 2)
      .attr('y', -tip.height / 2)
      .attr('width', tip.width)
      .attr('height', tip.height);

    // Add in extra padding *outside* the rectangle
    tip.width += 2 * this.margin;
    tip.height += 2 * this.margin;

    // Now that we know the dimensions, we can add
    // appropriate constraints to keep the nodes on
    // the screen
    graph.constraints.push({
      axis: 'x',
      type: 'separation',
      left: 0, // left bumper
      right: tip.nodeIndex,
      gap: tip.width / 2
    });
    graph.constraints.push({
      axis: 'x',
      type: 'separation',
      left: tip.nodeIndex,
      right: 1, // right bumper
      gap: tip.width / 2
    });
    graph.constraints.push({
      axis: 'y',
      type: 'separation',
      left: 2, // top bumper
      right: tip.nodeIndex,
      gap: tip.height / 2
    });
    graph.constraints.push({
      axis: 'y',
      type: 'separation',
      left: tip.nodeIndex,
      right: 3, // bottom bumper
      gap: tip.height / 2
    });
  },
  deriveAllConstraints: function (graph) {
    let tips = d3.select(this.el).select('#nodeLayer').selectAll('.tip');
    // Wrap all the text appropriately
    tips.selectAll('text')
      .each(function () {
        // this refers to the DOM element
        rewrap(this, 150, 1.1);
      });

    // Start with a fresh set of constraints
    graph.constraints = [];
    let self = this;
    tips.each(function (d) {
      // this refers to the DOM element
      self.deriveConstraint(graph, d, this);
    });
  },
  updateForceLayout: function (graph) {
    this.force.stop();

    this.force
      .size([graph.bounds.width, graph.bounds.height])
      .nodes(graph.nodes)
      .links(graph.edges)
      .constraints(graph.constraints);

    // Apply any cola parameters that we've specified
    for (let control of forceControls) {
      if (control.colaParameter &&
        this[control.option] !== undefined) {
        this.force[control.option](this[control.option]);
      }
    }

    // Start it up
    this.force.start(this.noConstraintIterations,
      this.structuralIterations,
      this.allConstraintIterations);
  },
  drawNextNode: function (graph) {
    if (graph.unseenTips.length === 0 || !this.visible) {
      return;
    }
    // Add the next node to the graph
    let nextTip = graph.unseenTips.splice(0, 1)[0];
    graph.nodes.push(nextTip.target);
    nextTip.label.nodeIndex = graph.nodes.length;
    graph.nodes.push(nextTip.label);
    graph.edges.push({
      source: graph.nodes.length - 1,
      target: graph.nodes.length - 2
    });

    // Update the nodes (class attributes
    // on nodes other than this one will have changed)
    this.drawGraph(graph, nextTip.label);

    // Add constraints for the new node
    let domElement = d3.select(this.el).select('#nodeLayer').selectAll('.tip')
      .filter(d => {
        return d === nextTip.label;
      });
    let domTextElement = domElement.select('text');
    rewrap(domTextElement.node(), 150, 1.1);
    this.deriveConstraint(graph, nextTip.label, domElement.node());

    // Store that we've seen the tip
    // in the user's preferences
    window.mainPage.currentUser.preferences.observeTip(nextTip.label);

    // Start up the force layout again
    this.updateForceLayout(graph);

    // Draw the next tip in a couple seconds
    // TODO: I'm going to transition more elegantly in a bit...
    window.setTimeout(() => {
      this.drawNextNode(graph);
    }, 2000);
  },
  renderTuner: function () {
    let self = this;

    // Easter egg: I added some tuners to tweak the label layout
    // as needed. To see this view, type
    // mainPage.helpLayer.renderTuner() on the console
    if (!this.addedTuner) {
      let pane = d3.select('body')
        .append('div')
        .attr('id', 'tuner')
        .on('click', () => {
          if (d3.event.getModifierState('Shift') &&
              d3.event.getModifierState('Alt')) {
            self.showEasterEgg = true;
            self.render();
          }
        });
      let defaultButtons = pane.append('div');
      defaultButtons.append('button')
        .text('Restart')
        .on('click', () => {
          window.mainPage.currentUser.preferences
            .forgetTips(self.relevantTips);
          self.addedTemplate = false;
          self.render();
        });
      defaultButtons.append('button')
        .text('Ok, got it')
        .on('click', () => {
          self.hide();
        });
      defaultButtons.append('input')
        .attr('type', 'checkbox')
        .attr('id', 'dontShowHelp');
      defaultButtons.append('label')
        .attr('for', 'dontShowHelp')
        .text('Don\'t show tutorials in the future');
      this.addedTuner = true;
    }

    if (this.showEasterEgg) {
      let controls = d3.select('#tuner')
        .selectAll('div.easterEggControl')
        .data(forceControls);
      let controlsEnter = controls.enter()
        .append('div')
        .attr('class', 'easterEggControl');

      // Control to change this parameter's setting (if enabled)
      controlsEnter.append('input')
        .attr('id', d => d.option + 'control')
        .attr('class', 'control')
        .on('change', function (d) {
          // this refers to the DOM element
          if (d.step) {
            self[d.option] = this.value;
          } else {
            self[d.option] = this.checked;
          }

          self.addedTemplate = false;
          self.render();
          self.renderTuner();
        });
      controls.selectAll('input.control')
        .attr('type', (d) => {
          if (d.step) {
            return 'range';
          } else {
            return 'checkbox';
          }
        })
        .each(function (d) {
          // this refers to the DOM element
          let element = d3.select(this);
          if (d.step) {
            element.attr('min', d.range[0])
              .attr('max', d.range[1])
              .attr('step', d.step);
            if (self[d.option] !== undefined) {
              element.property('value', self[d.option]);
            }
          } else {
            if (self[d.option]) {
              element.property('checked', true);
            }
          }
          element.property('disabled', self[d.option] === undefined);
        });

      // Label for the control (with its current value)
      controlsEnter.append('label')
        .attr('class', 'control')
        .attr('for', d => d.option + 'control');
      controls.selectAll('label.control')
        .text(d => {
          let value;
          if (this[d.option] === undefined) {
            value = '--';
          } else if (this[d.option] === true) {
            value = 'true';
          } else if (this[d.option] === false) {
            value = 'false';
          } else {
            value = this[d.option];
          }
          return d.option + ': ' + value;
        });

      // Control to enable / disable this parameter
      controlsEnter.append('input')
        .attr('id', d => d.option + 'enable')
        .attr('class', 'enable')
        .attr('type', 'checkbox')
        .on('change', function (d) {
          // this refers to the DOM element
          if (this.checked) {
            self[d.option] = d.range[0];
          } else {
            self[d.option] = undefined;
          }

          self.addedTemplate = false;
          self.render();
        });

      // Label for the enable switch
      controls.selectAll('input.enable')
        .property('checked', d => this[d.option] !== undefined)
        .property('disabled', d => !d.colaParameter);
      controlsEnter.append('label')
        .attr('class', 'enable')
        .attr('for', d => d.option + 'enable')
        .text('Enable');
    }
  }
});

export default HelpLayer;
