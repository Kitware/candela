import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import cola from 'webcola';
import rewrap from '../../../shims/svgTextWrap.js';
import forceControls from './forceControls.json';
import template from './template.html';
import './style.css';

function arrowGenerator(edge) {
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

    // Layout options
    this.padding = 15;
    
    this.avoidOverlaps = true;
    this.linkDistance = 50;
    this.alpha = 0.7;
    this.convergenceThreshold = 0.01;
    this.defaultNodeSize = 30;
    this.handleDisconnected = true;
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
      let tipId = tipSelector + tips[tipSelector];
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
    window.mainPage.currentUser
      .preferences.setMeta('showHelp', false);
    window.mainPage.currentUser.preferences.save();
    this.render();
  },
  show: function () {
    window.mainPage.currentUser
      .preferences.setMeta('showHelp', true);
    window.mainPage.currentUser.preferences.save();
    this.render();
  },
  render: Underscore.debounce(function () {
    let meta = window.mainPage.currentUser.preferences.getMeta();
    let showHelp = meta.showHelp;
    let seenTips = meta.seenTips;

    this.$el.on('click', () => {
      this.hide();
    });

    if (showHelp === false) {
      d3.select(this.el)
        .style('opacity', 1.0)
        .transition().duration(500)
        .style('opacity', 0.0)
        .attr('display', 'none');
    } else {
      this.$el.html(template);

      // Figure out how much space we have
      let bounds = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Default labels that are always there
      // (not connected to any target)
      let nodes = [{
        tipId: 'clearLabel',
        nodeType: 'label',
        message: 'Click anywhere to hide these tips',
        x: bounds.width / 2,
        y: bounds.height / 2
      }];
      let edges = [];

      // Connect labels to targets
      for (let tipId of Object.keys(this.relevantTips)) {
        let tip = this.relevantTips[tipId];
        nodes.push({
          tipId: tipId,
          nodeType: 'label',
          message: tip.message,
          x: tip.x,
          y: tip.y,
          width: tip.right - tip.left + 2 * this.padding,
          height: tip.bottom - tip.top + 2 * this.padding
        });
        nodes.push({
          tipId: tip.tipId,
          nodeType: 'arrowhead',
          x: tip.x,
          y: tip.y,
          width: this.padding,
          height: this.padding,
          fixed: true
        });
        edges.push({
          source: nodes.length - 2,
          target: nodes.length - 1
        });
      }

      // Subset of just the label nodes
      let labelNodes = nodes.filter(d => d.nodeType === 'label');
      
      let force = cola.d3adaptor()
        .linkDistance(this.linkDistance)
        .avoidOverlaps(this.avoidOverlaps)
        .alpha(this.alpha)
        .convergenceThreshold(this.convergenceThreshold)
        .defaultNodeSize(this.defaultNodeSize)
        .handleDisconnected(this.handleDisconnected)
        .size([bounds.width, bounds.height])
        .nodes(nodes)
        .links(edges);

      // Draw the label nodes
      let tips = d3.select(this.el).select('#nodeLayer').selectAll('.tip')
        .data(labelNodes, d => d.tipId);
      let tipsEnter = tips.enter().append('g');
      tips.exit().remove();

      tips.attr('class', d => {
        if (d.tipId === 'clearLabel') {
          return 'clear tip';
        } else if (seenTips[d.tipId] === true) {
          return 'old tip';
        } else {
          return 'new tip';
        }
      });

      // Draw the text
      tipsEnter.append('text');
      tips.selectAll('text')
        .text(d => d.message)
        .attr('text-anchor', d => {
          // Align the text based on where the label
          // starts on the screen
          if (d.x < bounds.width / 3) {
            return 'start';
          } else if (d.x < 2 * bounds.width / 3) {
            return 'middle';
          } else {
            return 'end';
          }
        });

      // Draw the arrows
      let arrows = d3.select(this.el).select('#linkLayer')
        .selectAll('.arrow').data(edges);
      arrows.enter().append('path')
        .attr('class', d => {
          if (!seenTips[nodes[d.source].tipId]) {
            return 'new arrow';
          } else {
            return 'old arrow';
          }
        });
      arrows.exit().remove();

      // Show the help layer and wrap the text appropriately
      // (wrapping has to be done while the text is visible)
      d3.select(this.el)
        .style('opacity', 0.0)
        .attr('display', null)
        .transition().duration(500)
        .style('opacity', 1.0);
      tips.selectAll('text')
        .each(function () {
          // this refers to the DOM element
          rewrap(this, 150, 1.1);
        });

      // Now precompute the sizes of
      // each of the label text blocks
      tips.each(function (d) {
        // this refers to the DOM element
        let bounds = this.getBoundingClientRect();
        // Store boundaries relative to the anchor point
        d.relative_left = bounds.left;
        d.relative_right = bounds.right;
        d.relative_top = bounds.top;
        d.relative_bottom = bounds.bottom;
      });

      // Start the simulation to lay out the tips
      // in a fun/non-overlapping way
      force.on('tick', () => {
        /* var q = d3.geom.quadtree(labelNodes);
        labelNodes.forEach(d => {
          // Keep the labels from overlapping with each other
          q.visit(this.collide(d));
          // Keep the labels on the screen
          let space = d.x - d.relative_left;
          if (space < 0) {
            d.x += this.overlapResistance * (-space);
          }
          space = d.y - d.relative_top;
          if (space < 0) {
            d.y += this.overlapResistance * (-space);
          }
          space = bounds.width - (d.x + d.relative_right);
          if (space < 0) {
            d.x -= this.overlapResistance * (-space);
          }
          space = bounds.height - (d.y + d.relative_bottom);
          if (space < 0) {
            d.y -= this.overlapResistance * (-space);
          }
        }); */

        // If we're tuning the layout, animate it
        if (this.addedTuner) {
          tips.attr('transform', (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
          arrows.attr('d', arrowGenerator);
        }
      });

      if (this.addedTuner) {
        // If we're tweaking the layout, let us watch it settle
        force.start();
      } else {
        // Precompute the layout
        force.start();
        for (let i = 0; i < nodes.length * nodes.length; i += 1) {
          force.tick();
        }
        force.stop();

        // Only render things once
        tips.attr('transform', (d) => {
          return 'translate(' + d.x + ',' + d.y + ')';
        });
        arrows.attr('d', arrowGenerator);
      }

      // Finally, store the set of tips that the user has now seen
      // in the user preferences
      window.mainPage.currentUser.preferences
        .observeTips(this.relevantTips);
    }
  }, 300),
  collide: function (node) {
    let padding = this.padding;

    let nleft = node.x - node.relative_left - padding;
    let nright = node.x + node.relative_right + padding;
    let ntop = node.y - node.relative_top - padding;
    let nbottom = node.y + node.relative_bottom + padding;

    return (quad, x1, y1, x2, y2) => {
      let other = quad.point;

      if (other && (other !== node)) {
        // Okay, we're comparing two different nodes. How
        // much space do they have between them (might be negative)?
        let xdistance, ydistance;

        if (node.x > other.x) {
          let nodeBound = node.x - node.relative_left;
          let otherBound = other.x + other.relative_right;
          xdistance = nodeBound - otherBound - padding;
        } else {
          let nodeBound = node.x + node.relative_right;
          let otherBound = other.x - other.relative_left;
          xdistance = otherBound - nodeBound - padding;
        }

        if (node.y > other.y) {
          let nodeBound = node.y - node.relative_top;
          let otherBound = other.y + other.relative_bottom;
          ydistance = nodeBound - otherBound - padding;
        } else {
          let nodeBound = node.y + node.relative_bottom;
          let otherBound = other.y - other.relative_top;
          ydistance = otherBound - nodeBound - padding;
        }

        // Do these two overlap? If so, fix it
        if (xdistance < 0 && ydistance < 0) {
          if (node.x > other.x) {
            node.x -= xdistance * this.overlapResistance / 2; // pushes right
            other.x += xdistance * this.overlapResistance / 2; // pushes left
          } else {
            node.x += xdistance * this.overlapResistance / 2; // pushes left
            other.x -= xdistance * this.overlapResistance / 2; // pushes right
          }

          if (node.y > other.y) {
            node.y -= ydistance * this.overlapResistance / 2; // pushes down
            other.y += ydistance * this.overlapResistance / 2; // pushes up
          } else {
            node.y += ydistance * this.overlapResistance / 2; // pushes up
            other.y -= ydistance * this.overlapResistance / 2; // pushes down
          }
        }
      }
      // Do we need to keep looking?
      return x1 > nright || x2 < nleft || y1 > nbottom || y2 < ntop;
    };
  },
  renderTuner: function () {
    // Easter egg: I added some tuners to tweak the label layout
    // as needed. To see this view, type
    // mainPage.helpLayer.renderTuner() on the console
    if (!this.addedTuner) {
      d3.select('body').append('div').attr('id', 'tuner');
      this.addedTuner = true;
    }

    let controls = d3.select('#tuner').selectAll('div').data(forceControls);
    let controlsEnter = controls.enter().append('div');

    controlsEnter.append('label')
      .attr('for', d => d.option + 'control');

    controls.selectAll('label')
      .text(d => d.option + ': ' + this[d.option]);

    let self = this;
    controlsEnter.append('input')
      .attr('type', 'range')
      .attr('min', d => d.range[0])
      .attr('max', d => d.range[1])
      .attr('step', d => d.step)
      .property('value', d => this[d.option])
      .on('mousemove', function (d) {
        if (d3.event.button) {
          self[d.option] = this.value;
          self.renderTuner();
        }
      }).on('change', function (d) {
        // this refers to the DOM element
        self[d.option] = this.value;
        self.addedTemplate = false;
        self.render();
        self.renderTuner();
      });
  }
});

export default HelpLayer;
