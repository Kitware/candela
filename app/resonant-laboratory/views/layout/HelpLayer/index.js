import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import rewrap from '../../../shims/svgTextWrap.js';
import dictCompare from '../../../shims/dictCompare.js';
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

function getSelectionBounds (selector) {
  let selection = jQuery(selector);
  if (selection.size() === 0) {
    // The selection isn't visible...
    return null;
  } else {
    // Add the tip
    let result = {
      left: Infinity,
      right: -Infinity,
      top: Infinity,
      bottom: -Infinity
    };

    // Figure out the bounding box that contains
    // all of the matched elements
    selection.each((index, element) => {
      let bounds = element.getBoundingClientRect();
      result.left = Math.min(bounds.left, result.left);
      result.right = Math.max(bounds.right, result.right);
      result.top = Math.min(bounds.top, result.top);
      result.bottom = Math.max(bounds.bottom, result.bottom);
    });
    result.width = result.right - result.left;
    result.height = result.bottom - result.top;
    return result;
  }
}

function createMaskWithHole (holeBounds) {
  // First, surround the window
  let path = 'M0,0L' + window.innerWidth + ',0' +
    'L' + window.innerWidth + ',' + window.innerHeight +
    'L0,' + window.innerHeight + 'Z';

  let aspectRatio = holeBounds.height / holeBounds.width;

  if (Math.abs(aspectRatio - 1) < 0.1) {
    // We're dealing with roughly a square area; a circle
    // will work fine. Punch a semicircle for the first
    // half of the hole...
    path += 'M' + holeBounds.left + ',' + holeBounds.top +
      'A' + (holeBounds.width / 2) + ',' +
      (holeBounds.height / 2) + ',0,1,0,' +
      holeBounds.right + ',' + holeBounds.bottom;
    // ...and the second half:
    path += 'M' + holeBounds.right + ',' + holeBounds.bottom +
      'A' + (holeBounds.width / 2) + ',' +
      (holeBounds.height / 2) + ',0,1,0,' +
      holeBounds.left + ',' + holeBounds.top;
  } else if (aspectRatio > 1) {
    // This is a vertical rectangular area; draw a
    // vertical "pill" shape.
    let radius = holeBounds.width / 2;
    let topPillEnd = holeBounds.top + radius;
    let bottomPillEnd = holeBounds.bottom - radius;
    // Start by punching a semicircle on the top...
    path += 'M' + holeBounds.right + ',' + topPillEnd +
      'A' + radius + ',' + radius + ',0,1,0,' +
      holeBounds.left + ',' + topPillEnd;
    // Line down...
    path += 'L' + holeBounds.left + ',' + bottomPillEnd;
    // Semicircle on the bottom...
    path += 'A' + radius + ',' + radius + ',0,1,0,' +
      holeBounds.right + ',' + bottomPillEnd + 'Z';
  } else {
    // This is a horizontal rectangular area; draw a
    // horizontal "pill" shape
    let radius = holeBounds.height / 2;
    let leftPillEnd = holeBounds.left + radius;
    let rightPillEnd = holeBounds.right - radius;
    // Start by punching a semicircle on the left...
    path += 'M' + leftPillEnd + ',' + holeBounds.top +
      'A' + radius + ',' + radius + ',0,1,0,' +
      leftPillEnd + ',' + holeBounds.bottom;
    // Line to the right...
    path += 'L' + rightPillEnd + ',' + holeBounds.bottom;
    // Semicircle on the right...
    path += 'A' + radius + ',' + radius + ',0,1,0,' +
      rightPillEnd + ',' + holeBounds.top + 'Z';
  }
  return path;
}

let HelpLayer = Backbone.View.extend({
  initialize: function () {
    this.relevantTips = [];
    this.currentIndex = null;
    this.addedTemplate = false;

    this.showHideSpeed = 100;
    this.animationSpeed = 100;

    this.padding = 9;
    this.margin = 15;

    // Respond to certain changes in the app in special ways...
    this.listenTo(window.mainPage.widgetPanels, 'rl:navigateWidgets', () => {
      // In order for this to have happened, the hole
      // was probably pointing at one of the headers
      // that has just changed location / size... we'll
      // want to re-render
      this.render();
    });
    this.listenTo(window.mainPage.overlay, 'rl:changeOverlay', () => {
      // TODO: By opening a dialog, we should either jump right into
      // its ordered series of tips, or if those tips don't
      // exist (e.g. an error/simple info dialog), we should
      // just hide the help layer
      this.hide();
    });
  },
  showTips: function (tips) {
    let changedHelp = true;
    if (!changedHelp) {
      if (this.relevantTips.length === tips.length) {
        changedHelp = false;
        for (let i = 0; i < this.relevantTips.length; i += 1) {
          if (!dictCompare(this.relevantTips[i], tips[i])) {
            changedHelp = true;
            break;
          }
        }
      }
    }
    this.relevantTips = tips;
    if (this.relevantTips.length === 0) {
      this.currentIndex = null;
      this.render();
    } else if (changedHelp) {
      this.currentIndex = 0;
      this.render();
    }
  },
  hide: function () {
    this.showTips([]);
  },
  nextTip: function () {
    this.currentIndex += 1;
    if (this.currentIndex >= this.relevantTips.length) {
      this.hide();
    } else {
      this.render();
    }
  },
  render: function () {
    if (this.currentIndex === null) {
      // Fade the whole layer out
      d3.select(this.el)
        .style('opacity', 1.0)
        .transition().duration(this.showHideSpeed)
        .style('opacity', 0.0)
        .style('display', 'none');
    } else {
      if (!this.addedTemplate) {
        this.$el.html(template);
        this.$el.find('#helpLayerMask')
          .on('click', () => { this.nextTip(); });
        this.$el.find('#nextTipButton')
          .on('click', () => { this.nextTip(); });
        this.$el.find('#gotItButton')
          .on('click', () => { this.hide(); });
        this.addedTemplate = true;
      }
      let tip = this.relevantTips[this.currentIndex];

      // Figure out where to point to
      let targetRect = getSelectionBounds(tip.selector);
      if (targetRect === null) {
        // The tip we're supposed to see
        // isn't visible, so skip it
        this.nextTip();
        return;
      } else {
        // Make a hole in the mask to allow the
        // user to click through to the target
        d3.select(this.el).select('#helpLayerMask')
          .transition().duration(this.animationSpeed)
          .attr('d', createMaskWithHole(targetRect));
      }

      // If it's not already showing, fade the layer in
      if (this.$el.css('display') === 'none') {
        d3.select(this.el)
          .style('display', null)
          .style('opacity', 0.0)
          .transition().duration(this.showHideSpeed)
          .style('opacity', 1.0);
      }

      let targetCoords = {};

      // Where should we put the bubble
      // (and which corner should it point to)?
      let bubbleCoords = {};
      if (window.innerWidth - targetRect.right > targetRect.left) {
        // More space to the right
        bubbleCoords.x = window.innerWidth - targetRect.right;
        targetCoords.x = targetRect.right;
      } else {
        // More space to the left
        bubbleCoords.x = -targetRect.left;
        targetCoords.x = targetRect.left;
      }
      if (window.innerHeight - targetRect.bottom > targetRect.top) {
        // More space below
        bubbleCoords.y = window.innerHeight - targetRect.bottom;
        targetCoords.y = targetRect.bottom;
      } else {
        // More space above
        bubbleCoords.y = -targetRect.top;
        targetCoords.y = targetRect.top;
      }
      bubbleCoords.length = Math.sqrt(Math.pow(bubbleCoords.x, 2) +
        Math.pow(bubbleCoords.y, 2));

      // Put the bubble 200px in the direction of the corner
      bubbleCoords.x = targetCoords.x + 200 * bubbleCoords.x /
        bubbleCoords.length;
      bubbleCoords.y = targetCoords.y + 200 * bubbleCoords.y /
        bubbleCoords.length;

      // Now let's see how big the bubble actually will be
      let bubbleEl = d3.select('#bubble');
      let textEl = bubbleEl.select('#tipText');
      textEl.attr('transform', null);

      textEl.text(tip.message)
        .attr('text-anchor', 'middle');

      // Reflow the text
      rewrap(textEl.node(), 150, 1.1);

      // Temporarily move the bubble to 0,0
      let oldBubbleTransform = bubbleEl.attr('transform');
      bubbleEl.attr('transform', null);

      // Okay, now how big is the text?
      let bounds = textEl.node().getBoundingClientRect();

      if (oldBubbleTransform) {
        bubbleEl.attr('transform', oldBubbleTransform);
      }

      // boundaries relative to the text anchor point
      bubbleCoords.relative_left = bounds.left;
      bubbleCoords.relative_right = bounds.right;
      bubbleCoords.relative_top = bounds.top;
      bubbleCoords.relative_bottom = bounds.bottom;

      // Move the text block to the center of the bubble
      textEl.attr('transform', 'translate(' +
          (-(bubbleCoords.relative_left +
             bubbleCoords.relative_right) / 2) + ',' +
          (-(bubbleCoords.relative_top +
             bubbleCoords.relative_bottom) / 2) + ')');

      // How big should the bubble be? (add in the padding)
      bubbleCoords.width = bubbleCoords.relative_right -
        bubbleCoords.relative_left + 2 * this.padding;
      bubbleCoords.height = bubbleCoords.relative_bottom -
        bubbleCoords.relative_top + 2 * this.padding;

      // Okay, calculate the radius and update the circle
      bubbleCoords.radius = Math.sqrt(Math.pow(bubbleCoords.width, 2) +
        Math.pow(bubbleCoords.height, 2)) / 2;
      bubbleEl.select('circle')
        .transition().duration(this.animationSpeed)
        .attr('r', bubbleCoords.radius);

      // Add in extra padding *outside* the circle
      bubbleCoords.radius += this.margin;
      bubbleCoords.width = 2 * bubbleCoords.radius;
      bubbleCoords.height = 2 * bubbleCoords.radius;

      // Move the navigation links to the bottom of the circle
      bubbleEl.select('g#gotIt')
        .attr('transform', 'translate(0,' + bubbleCoords.radius + ')');

      // Make sure that the bubble isn't going off screen.
      // If it is, it's probably pointing to something really wide/tall,
      // so we should point to its center, not its corner
      if (bubbleCoords.x - bubbleCoords.width / 2 < 0) {
        bubbleCoords.x = bubbleCoords.width / 2;
        targetCoords.x = (targetRect.left + targetRect.right) / 2;
      }
      if (bubbleCoords.x + bubbleCoords.width / 2 > window.innerWidth) {
        bubbleCoords.x = window.innerWidth - bubbleCoords.width / 2;
        targetCoords.x = (targetRect.left + targetRect.right) / 2;
      }
      if (bubbleCoords.y - bubbleCoords.height / 2 < 0) {
        bubbleCoords.y = bubbleCoords.height / 2;
        targetCoords.y = (targetRect.top + targetRect.bottom) / 2;
      }
      if (bubbleCoords.y + bubbleCoords.height / 2 > window.innerHeight) {
        bubbleCoords.y = window.innerHeight - bubbleCoords.height / 2;
        targetCoords.y = (targetRect.top + targetRect.bottom) / 2;
      }

      // Move the bubble where it belongs
      bubbleEl.transition().duration(this.animationSpeed)
        .attr('transform', 'translate(' + bubbleCoords.x + ',' +
          bubbleCoords.y + ')');

      // Draw the arrow
      d3.select('#arrow')
        .transition().duration(this.animationSpeed)
        .attr('d', arrowGenerator({
          source: bubbleCoords,
          target: targetCoords
        }));

      // Have we already seen this tip?
      if (window.mainPage.currentUser.preferences.hasSeenTip(tip)) {
        this.$el.attr('class', 'old');
      } else {
        this.$el.attr('class', 'new');
      }

      // Now that we've successfully drawn it, make a note that
      // the user has already seen this tip
      window.mainPage.currentUser.preferences.observeTip(tip);
    }
  }
});

export default HelpLayer;
