import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';
import d3 from 'd3';
import rewrap from '../../../shims/svgTextWrap.js';

let HelpLayer = Backbone.View.extend({
  initialize: function () {
    this.relevantTips = [];
    this.listenTo(this, 'rra:updateHelp', this.render);
  },
  addTip: function (newTip) {
    this.relevantTips.push(newTip);
    this.trigger('rra:updateHelp');
  },
  setTips: function (tips) {
    this.relevantTips = tips;
    this.trigger('rra:updateHelp');
  },
  hasNewTips: function () {
    let seenTips = window.mainPage.currentUser
      .preferences.getMeta('seenTips');
    for (let tip of this.relevantTips) {
      if (seenTips[tip.tipId] !== true) {
        return true;
      }
    }
    return false;
  },
  observeTips: function () {
    let seenTips = window.mainPage.currentUser
      .preferences.getMeta('seenTips');
    for (let tip of this.relevantTips) {
      seenTips[tip.tipId] = true;
    }
    window.mainPage.currentUser
      .preferences.setMeta('seenTips', seenTips);
  },
  toggle: function () {
    let showHelp = window.mainPage.currentUser
      .preferences.getMeta('showHelp');
    window.mainPage.currentUser
      .preferences.setMeta('showHelp', !showHelp);
    this.render();
  },
  render: Underscore.debounce(function () {
    let meta = window.mainPage.currentUser.preferences.getMeta();
    let showHelp = meta.showHelp;
    let seenTips = meta.seenTips;
    
    if (showHelp === false) {
      this.$el.hide();
    } else {
      // Figure out how much space we have
      let body = jQuery('body');
      body.css('overflow', 'scroll');
      let width = body.width();
      let height = body.height();
      body.css('overflow', '');
      
      // Draw the tips
      let tips = d3.select(this.el).selectAll('.tip')
        .data(this.relevantTips, d => d.tipId);
      let tipsEnter = tips.enter().append('g');
      tips.exit().remove();
      
      tips.attr('class', d => {
        if (seenTips[d.tipId] === true) {
          return 'old tip';
        } else {
          return 'new tip';
        }
      });
      
      // Draw the text
      tipsEnter.append('text');
      tips.selectAll('text')
        .text(d => d.message)
        .each(function () {
          // this refers to the DOM element
          rewrap(this, 200, 1.1);
        });
      
      // TODO: draw an arrow
      
      // Store the set of tips in the user preferences
      window.mainPage.currentUser.preferences.observeTips(this.relevantTips);
      
      // Finally, resize our SVG element and show it
      this.$el.attr({
        width: width,
        height: height
      }).show();
    }
  }, 300)
});

export default HelpLayer;
