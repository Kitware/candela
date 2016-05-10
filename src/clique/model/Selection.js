import _ from 'underscore';
import Backbone from 'backbone';

const Selection = Backbone.Model.extend({
  initialize: function () {
    this.focalPoint = 0;
  },

  add: function (key) {
    this.set(key, key);
    if (this.size()) {
      this.trigger('focused', this.focused());
    }

    this.trigger('added', key);
  },

  remove: function (key) {
    var focused = this.focused() === key;

    this.unset(key);

    if (this.focalPoint >= this.size()) {
      this.focalPoint = Math.max(0, this.size() - 1);
      this.trigger('focused', this.focused());
    } else if (focused) {
      this.focusLeft();
    }

    this.trigger('removed', key);
  },

  items: function () {
    return _.keys(this.attributes);
  },

  focusKey: function (target) {
    var index = _.indexOf(this.items(), target);
    if (index === -1) {
      return false;
    }

    this.focus(index);
    return true;
  },

  focus: function (target) {
    this.focalPoint = target;
    if (this.focalPoint < 0) {
      while (this.focalPoint < 0) {
        this.focalPoint += this.size();
      }
    } else if (this.focalPoint >= this.size()) {
      this.focalPoint = this.focalPoint % this.size();
    }

    this.trigger('focused', this.focused());
  },

  focusLeft: function () {
    this.focus(this.focalPoint - 1);
  },

  focusRight: function () {
    this.focus(this.focalPoint + 1);
  },

  focused: function () {
    return this.items()[this.focalPoint];
  },

  size: function () {
    return _.size(this.attributes);
  }
});

export default Selection;
