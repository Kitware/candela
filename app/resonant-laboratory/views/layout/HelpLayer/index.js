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

    // Layout options. You can tweak these interactively
    // by invoking the mainPage.helpLayer.renderTuner()
    // easter egg (change these values when you find
    // a good balance)
    this.padding = 5;

    this.avoidOverlaps = true;
    // this.linkDistance = 250;
    this.alpha = 0.7;
    this.convergenceThreshold = 0.01;
    // this.defaultNodeSize = 20;
    this.handleDisconnected = false;

    this.noConstraintIterations = 50;
    this.structuralIterations = 50;
    this.allConstraintIterations = 50;
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

      let center = {
        x: bounds.width / 2,
        y: bounds.height / 2
      }

      // Default labels that are always there
      // (not connected to any target)
      let nodes = [
        {
          tipId: 'clearLabel',
          nodeType: 'label',
          message: 'Click anywhere to hide these tips',
          x: center.x,
          y: center.y,
          fixed: true
        },
        {
          tipId: 'topLeft',
          nodeType: 'border',
          x: 0,
          y: 0,
          width: this.padding,
          height: this.padding,
          fixed: true
        },
        {
          tipId: 'bottomRight',
          nodeType: 'border',
          x: bounds.width,
          y: bounds.height,
          width: this.padding,
          height: this.padding,
          fixed: true
        }
      ];
      let edges = [];

      // Connect labels to targets
      for (let tipId of Object.keys(this.relevantTips)) {
        let tip = this.relevantTips[tipId];
        // Node containing the label
        nodes.push({
          tipId: tipId,
          nodeType: 'label',
          message: tip.message,
          // Start each label slightly toward the center
          // of the screen relative to its target
          x: Math.random() * bounds.width, // (3 * tip.x + center.x) / 4,
          y: Math.random() * bounds.height // (3 * tip.y + center.y) / 4
        });
        // Target (not drawn) for the link
        nodes.push({
          tipId: tip.tipId,
          nodeType: 'arrowhead',
          x: tip.x,
          y: tip.y,
          fixed: true
        });
        // The link itself
        edges.push({
          source: nodes.length - 2,
          target: nodes.length - 1
        });
      }

      // Subset of just the label nodes
      let labelNodes = nodes.filter(d => d.nodeType === 'label');

      // Draw the label nodes
      let tips = d3.select(this.el).select('#nodeLayer').selectAll('.tip')
        .data(labelNodes, d => d.tipId);
      let tipsEnter = tips.enter().append('g');
      tips.exit().remove();

      // opacity: in the case where we pre-compute the layout,
      // prevent the initial flash where the labels are in their
      // original positions
      tips.style('opacity', '0.0')
        .attr('class', d => {
          if (d.tipId === 'clearLabel') {
            return 'clear tip';
          } else if (seenTips[d.tipId] === true) {
            return 'old tip';
          } else {
            return 'new tip';
          }
        });

      // Background rectangle
      // (we figure out its dimensions later)
      tipsEnter.append('rect');

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

      // Now precompute the sizes of each of the label
      // text blocks, and adjust accordingly
      let self = this;
      let constraints = [];
      tips.each(function (d) {
        // this refers to the DOM element
        let bounds = this.getBoundingClientRect();

        // boundaries relative to the text anchor point
        d.relative_left = bounds.left;
        d.relative_right = bounds.right;
        d.relative_top = bounds.top;
        d.relative_bottom = bounds.bottom;

        // cola expects the x and y coordinates to
        // be in the center of the node to handle
        // overlaps - so we need to move the text block
        d3.select(this).select('text')
          .attr('transform', 'translate(' +
            (-(d.relative_left + d.relative_right) / 2) + ',' +
            (-(d.relative_top + d.relative_bottom) / 2) + ')');

        // let cola know our dimensions (add in the padding)
        d.width = d.relative_right - d.relative_left + 2 * self.padding;
        d.height = d.relative_bottom - d.relative_top + 2 * self.padding;

        // Set the background rectangle's dimensions
        d3.select(this).select('rect')
          .attr('x', -d.width / 2)
          .attr('y', -d.height / 2)
          .attr('width', d.width)
          .attr('height', d.height);
        
        // Add in extra padding *outside* the rectangle
        d.width += 2 * self.padding;
        d.height += 2 * self.padding;

        // Now that we know the dimensions, we can add
        // appropriate constraints to keep the nodes on
        // the screen
        constraints.push({
          axis: 'x',
          type: 'separation',
          left: 1, // topLeft
          right: nodes.length - 2,
          gap: d.width
        });
        constraints.push({
          axis: 'y',
          type: 'separation',
          left: 1, // topLeft
          right: nodes.length - 2,
          gap: d.height
        });
        constraints.push({
          axis: 'x',
          type: 'separation',
          left: nodes.length - 2,
          right: 2, // bottomRight
          gap: d.width
        });
        constraints.push({
          axis: 'y',
          type: 'separation',
          left: nodes.length - 2,
          right: 2, // bottomRight
          gap: d.height
        });
      });
      
      // Compute the layout
      let force = cola.d3adaptor()
        .size([bounds.width, bounds.height])
        .nodes(nodes)
        .links(edges)
        .constraints(constraints);

      // Apply any cola parameters that we've specified
      for (let control of forceControls) {
        if (control.colaParameter &&
          this[control.option] !== undefined) {
          force[control.option](this[control.option]);
        }
      }

      let _renderGraph = () => {
        tips.style('opacity', '1.0')
          .attr('transform', (d) => {
            return 'translate(' + d.x + ',' + d.y + ')';
          });
        arrows.attr('d', arrowGenerator)
          .style('opacity', '1.0');
      };
      
      if (this.addedTuner) {
        // If we're tweaking the layout, watch it settle
        force.on('tick', _renderGraph);
      } else {
        // Otherwise, just render when it's done
        force.on('end', _renderGraph);
      }

      force.start(this.noConstraintIterations,
        this.structuralIterations,
        this.allConstraintIterations);

      // Finally, store the set of tips that the user has now seen
      // in the user preferences
      window.mainPage.currentUser.preferences
        .observeTips(this.relevantTips);
    }
  }, 300),
  renderTuner: function () {
    let self = this;

    // Easter egg: I added some tuners to tweak the label layout
    // as needed. To see this view, type
    // mainPage.helpLayer.renderTuner() on the console
    if (!this.addedTuner) {
      d3.select('body')
        .append('div')
        .attr('id', 'tuner')
        .append('button')
          .text('Run again')
          .on('click', () => {
            self.addedTemplate = false;
            self.render();
            self.renderTuner();
          });
      this.addedTuner = true;
    }

    let controls = d3.select('#tuner').selectAll('div').data(forceControls);
    let controlsEnter = controls.enter().append('div');
    
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
      }).each(function (d) {
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
        self.renderTuner();
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
});

export default HelpLayer;
