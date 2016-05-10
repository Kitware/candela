import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import d3Force from 'd3-force';
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

    this.alphaMin = 0.001;
    this.alphaDecay = 0.02;
    // this.drag = 0.4;

    // this.forceCenter = {};
    this.forceCollide = {
      strength: 1,
      iterations: 2
    };
    this.forceLink = {
      // distance: 160,
      strength: 0.3,
      iterations: 2
    };
    /* this.forceManyBody = {
      strength: -10,
      theta: 0.9,
      distanceMin: 1,
      distanceMax: 500
    };*/

    this.forces = {};

    this.visible = false;
    this.addedTemplate = false;
    this.showEasterEgg = true;
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
    let nodes = [];

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
        fixed_x: tip.x,
        fixed_y: tip.y
      };

      tipNodes.label = {
        tipId: tipId,
        nodeType: 'label',
        message: tip.message,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
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
      nodes: nodes,
      edges: edges,
      unseenTips: unseenTips
    };
  },
  render: Underscore.debounce(function () {
    if (this.visible === false) {
      // Stop the force layout if it's running
      if (this.forceSimulation) {
        this.forceSimulation.stop();
      }
      // Fade the whole layer out
      d3.select(this.el)
        .style('opacity', 1.0)
        .transition().duration(500)
        .style('opacity', 0.0)
        .attr('display', 'none')
        .style('opacity', null);
    } else {
      // Get the set of nodes and edges
      let graph = this.constructGraph();

      if (!this.addedTemplate) {
        this.$el.html(template);
        this.createForceSimulation(graph);
        this.addedTemplate = true;
      }
      d3.select(this.el)
        .attr('display', null);

      // Render the tuner
      this.renderTuner();

      // Draw / update the full graph
      this.drawGraph(graph);

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

    tipsEnter.append('circle');
    tipsEnter.append('text')
      .text(d => d.message);

    // Reshape the text and set the circle size
    let self = this;
    tipsEnter.each(function (d) {
      // this refers to the DOM element
      self.deriveSize(graph, d, this);
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
  deriveSize: function (graph, tip, domElement) {
    let el = d3.select(domElement);

    // Reset the background circle
    el.select('circle')
      .attr('r', 1);

    let textEl = el.select('text');
    // Align the text based on where the label
    // is on the screen
    if (tip.x < window.innerWidth / 3) {
      textEl.attr('text-anchor', 'start');
    } else if (tip.x < 2 * window.innerWidth / 3) {
      textEl.attr('text-anchor', 'middle');
    } else {
      textEl.attr('text-anchor', 'end');
    }

    // Reflow the text
    rewrap(textEl.node(), 150, 1.1);

    // Okay, now how big are we?
    let bounds = domElement.getBoundingClientRect();

    // boundaries relative to the text anchor point
    tip.relative_left = bounds.left;
    tip.relative_right = bounds.right;
    tip.relative_top = bounds.top;
    tip.relative_bottom = bounds.bottom;

    // Move the text block to the center of the node
    d3.select(domElement).select('text')
      .attr('transform', 'translate(' +
        (-(tip.relative_left + tip.relative_right) / 2) + ',' +
        (-(tip.relative_top + tip.relative_bottom) / 2) + ')');

    // Store our dimensions (add in the padding)
    tip.width = tip.relative_right - tip.relative_left + 2 * this.padding;
    tip.height = tip.relative_bottom - tip.relative_top + 2 * this.padding;

    // Okay, calculate the radius and update the circle
    tip.radius = Math.sqrt(Math.pow(tip.width, 2) + Math.pow(tip.height, 2)) / 2;
    d3.select(domElement).select('circle')
      .attr('r', tip.radius);

    // Add in extra padding *outside* the circle
    tip.width += 2 * this.margin;
    tip.height += 2 * this.margin;
    tip.radius += this.margin;
  },
  updateForceSimulation: function (graph) {
    this.forceSimulation
      .nodes(graph.nodes);
    if (this.forces.forceLink) {
      this.forces.forceLink.links(graph.edges);
    }
    this.forceSimulation.restart();
  },
  createForceSimulation: function (graph) {
    if (this.forceSimulation) {
      this.forceSimulation.stop();
    }

    this.forceSimulation = d3Force.forceSimulation()
      .nodes(graph.nodes)
      .on('tick', () => {
        // Round coordinates to the nearest pixel
        d3.select(this.el).select('#nodeLayer').selectAll('.tip')
          .attr('transform', (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
        d3.select(this.el).select('#linkLayer').selectAll('.arrow')
          .attr('d', arrowGenerator);
      });

    // Apply any parameters and forces that we've specified
    this.forces = {};
    for (let control of forceControls) {
      if (control.paramType === 'simulation' &&
        this[control.option] !== undefined) {
        this.forceSimulation[control.option](this[control.option]);
      } else if (control.paramType === 'forceEnable') {
        if (this[control.option]) {
          this.forces[control.option] = d3Force[control.option]();
          this.forceSimulation.force(control.option, this.forces[control.option]);
        } else {
          delete this.forces[control.option];
        }
      }
    }

    // Apply any force-specific parameters (now that the forces
    // have been created)
    for (let control of forceControls) {
      if (control.paramType === 'forceParam' &&
        this[control.forceName] &&
        this[control.forceName][control.option] !== undefined) {
        this.forces[control.forceName][control.option](
          this[control.forceName][control.option]);
      }
    }

    // Special force options that aren't configured in the easter egg
    if (this.forces.forceLink) {
      this.forces.forceLink.links(graph.edges);
    }
    if (this.forces.forceCenter) {
      this.forces.forceCenter.x(window.innerWidth / 2);
      this.forces.forceCenter.y(window.innerHeight / 2);
    }
    if (this.forces.forceCollide) {
      this.forces.forceCollide.radius(d => d.radius);
    }

    // Manually create forces for fixed nodes and for keeping
    // nodes on screen
    this.forceSimulation.force('constrainNodes', () => {
      graph.nodes.forEach((d) => {
        // Keep fixed nodes where they belong
        if (d.fixed_x) {
          d.x = d.fixed_x;
          d.vx = 0;
        }
        if (d.fixed_y) {
          d.y = d.fixed_y;
          d.vy = 0;
        }
        // Bounce moveable nodes off the walls
        if (d.radius) {
          if (d.x + d.vx - d.radius <= 0) {
            d.x = d.radius;
            d.vx = Math.max(1, -d.vx);
          } else if (d.x + d.vx + d.radius > window.innerWidth) {
            d.x = window.innerWidth - d.radius;
            d.vx = Math.min(-1, -d.vx);
          }
          if (d.y + d.vy - d.radius <= 0) {
            d.y = d.radius;
            d.vy = Math.max(1, -d.vy);
          } else if (d.y + d.vy + d.radius > window.innerHeight) {
            d.y = window.innerHeight - d.radius;
            d.vy = Math.min(-1, -d.vy);
          }
        }
        // Finally, round all positions to their nearest pixel
        d.x = Math.floor(d.x);
        d.y = Math.floor(d.y);
      });
    });
  },
  drawNextNode: function (graph) {
    if (graph.unseenTips.length === 0 || !this.visible) {
      return;
    }
    // Add the next node to the graph
    let nextTip = graph.unseenTips.splice(0, 1)[0];
    graph.nodes.push(nextTip.target);
    nextTip.label.nodeIndex = graph.nodes.length;
    nextTip.label.x = Math.random() * window.innerWidth;
    nextTip.label.y = Math.random() * window.innerHeight;
    graph.nodes.push(nextTip.label);
    graph.edges.push({
      source: graph.nodes.length - 1,
      target: graph.nodes.length - 2
    });

    // Update the nodes
    this.updateForceSimulation(graph);
    this.drawGraph(graph, nextTip.label);

    // Store that we've seen the tip
    // in the user's preferences
    window.mainPage.currentUser.preferences.observeTip(nextTip.label);

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
            self.addedTemplate = false;
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
        .attr('id', d => {
          if (d.paramType === 'forceParam') {
            return d.forceName + d.option + 'control';
          } else {
            return d.option + 'control';
          }
        })
        .attr('class', 'control')
        .on('change', function (d) {
          // this refers to the DOM element
          if (d.step) {
            if (d.paramType === 'forceParam') {
              self[d.forceName][d.option] = this.value;
            } else {
              self[d.option] = this.value;
            }
          } else {
            if (d.paramType === 'forceParam') {
              self[d.forceName][d.option] = this.checked;
            } else if (d.paramType === 'forceEnable') {
              if (this.checked) {
                self[d.option] = {};
                forceControls.forEach((c) => {
                  if (c.paramType === 'forceParam' &&
                      c.forceName === d.option) {
                    let el = jQuery('#' + c.forceName + c.option + 'control');
                    if (c.step) {
                      self[d.option][c.option] = el.val();
                    } else {
                      self[d.option][c.option] = el.prop('checked');
                    }
                  }
                });
              } else {
                delete self[d.option];
              }
            } else {
              self[d.option] = this.checked;
            }
          }

          self.addedTemplate = false;
          self.render();
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
          let value;
          if (d.paramType === 'forceParam') {
            value = self[d.forceName];
            if (value) {
              value = value[d.option];
            }
          } else if (d.paramType === 'forceEnable') {
            value = !!self[d.option];
          } else {
            value = self[d.option];
          }

          if (d.step) {
            element.attr('min', d.range[0])
              .attr('max', d.range[1])
              .attr('step', d.step);
            if (value !== undefined) {
              element.property('value', value);
            }
          } else {
            if (value) {
              element.property('checked', true);
            }
          }
          element.property('disabled', value === undefined);
        });

      // Label for the control (with its current value)
      controlsEnter.append('label')
        .attr('class', 'control')
        .attr('for', d => d.option + 'control');
      controls.selectAll('label.control')
        .text(d => {
          let value;
          if (d.paramType === 'forceParam') {
            value = self[d.forceName];
            if (value) {
              value = value[d.option];
            }
          } else {
            value = self[d.option];
          }
          if (value === undefined) {
            value = '--';
          }
          if (d.paramType === 'forceEnable') {
            return 'Enable ' + d.option;
          } else if (d.paramType === 'forceParam') {
            return d.forceName + ' ' + d.option + ': ' + value;
          } else {
            return d.option + ': ' + value;
          }
        });

      // Control to enable / disable this parameter
      // (don't add these for forceEnable options,
      // as that's redundant, or for layout options,
      // as they always apply)
      controlsEnter.filter(d => {
        return d.paramType !== 'forceEnable' &&
          d.paramType !== 'layout';
      }).append('input')
        .attr('id', d => {
          if (d.paramType === 'forceParam') {
            return d.forceName + d.option + 'enable';
          } else {
            return d.option + 'enable';
          }
        })
        .attr('class', 'enable')
        .attr('type', 'checkbox')
        .on('change', function (d) {
          // this refers to the DOM element
          if (this.checked) {
            if (d.paramType === 'forceParam') {
              let el = jQuery('#' + d.forceName + d.option + 'control');
              if (d.step) {
                self[d.forceName][d.option] = el.val();
              } else {
                self[d.forceName][d.option] = el.prop('checked');
              }
            } else {
              let el = jQuery('#' + d.option + 'control');
              if (d.step) {
                self[d.option] = el.val();
              } else {
                self[d.option] = el.prop('checked');
              }
            }
          } else {
            if (d.paramType === 'forceParam') {
              delete self[d.forceName][d.option];
            } else {
              delete self[d.option];
            }
          }

          self.addedTemplate = false;
          self.render();
        });

      // Label for the enable switch
      controls.selectAll('input.enable')
        .property('checked', d => {
          if (d.paramType === 'forceParam') {
            return this[d.forceName] &&
              this[d.forceName][d.option] !== undefined;
          } else {
            this[d.option] !== undefined;
          }
        })
        .property('disabled', d => {
          if (d.paramType === 'forceParam' && this[d.forceName] === undefined) {
            return true;
          } else {
            return false;
          }
        });
      controlsEnter.filter(d => {
        return d.paramType !== 'forceEnable' &&
          d.paramType !== 'layout';
      }).append('label')
        .attr('class', 'enable')
        .attr('for', d => d.option + 'enable')
        .text('Enable');
    }
  }
});

export default HelpLayer;
