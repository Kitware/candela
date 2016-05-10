import _ from 'underscore';
import Backbone from 'backbone';

import selectionInfo from './selectionInfo.jade';

const colors = {
  white: 'default',
  blue: 'primary',
  green: 'success',
  purple: 'info',
  orange: 'warning',
  red: 'danger',
  clear: 'link'
};

const processButtons = function (specs) {
  return _.map(specs || [], function (button) {
    return {
      label: _.isFunction(button.label) ? button.label : _.constant(button.label),
      cssClass: _.uniqueId('ident-'),
      color: colors[button.color] || 'default',
      icon: button.icon,
      repeat: _.isUndefined(button.repeat) ? false : button.repeat,
      callback: button.callback || _.noop,
      show: _.isFunction(button.show) ? button.show : _.constant(_.isUndefined(button.show) ? true : button.show)
    };
  });
};

const SelectionInfo = Backbone.View.extend({
  initialize: function (options) {
    var debRender;

    options = options || {};
    this.graph = options.graph;
    this.nav = _.isUndefined(options.nav) ? true : options.nav;
    this.metadata = _.isUndefined(options.metadata) ? true : options.metadata;

    this.nodeButtons = processButtons(options.nodeButtons);
    this.selectionButtons = processButtons(options.selectionButtons);

    debRender = _.debounce(this.render, 100);

    this.listenTo(this.model, 'change', debRender);
    this.listenTo(this.model, 'focused', debRender);
    this.listenTo(this.graph, 'change', debRender);
  },

  render: function () {
    let focused;
    let renderTemplate;

    renderTemplate = _.bind(function (node) {
      this.$el.html(selectionInfo({
        node: node,
        degree: node ? this.graph.degree(node.key()) : -1,
        selectionSize: this.model.size(),
        nav: this.nav,
        metadata: this.metadata,
        nodeButtons: this.nodeButtons,
        selectionButtons: this.selectionButtons
      }));

      _.each(this.nodeButtons, _.bind(function (spec) {
        this.$(`button.${spec.cssClass}`).on('click', _.bind(function () {
          var render = _.bind(spec.callback, this)(this.graph.adapter.getAccessor(this.model.focused()));
          if (render) {
            this.render();
          }
        }, this));
      }, this));

      _.each(this.selectionButtons, _.bind(function (spec) {
        this.$(`button.${spec.cssClass}`).on('click', _.bind(function () {
          let render;
          let selectionAccessors;

          selectionAccessors = _.map(this.model.items(), this.graph.adapter.getAccessor, this.graph.adapter);

          if (spec.repeat) {
            render = _.any(_.map(selectionAccessors, _.bind(spec.callback, this)));
          } else {
            render = _.bind(spec.callback, this)(selectionAccessors, this.graph.adapter.getAccessor(this.model.focused()));
          }

          if (render) {
            this.render();
          }
        }, this));
      }, this));

      this.$('a.prev')
      .on('click', _.bind(function () {
        this.model.focusLeft();
      }, this));

      this.$('a.next')
      .on('click', _.bind(function () {
        this.model.focusRight();
      }, this));
    }, this);

    focused = this.model.focused();

    if (!focused) {
      renderTemplate(focused);
    } else {
      this.graph.adapter.findNodeByKey(focused)
      .then(renderTemplate);
    }
  }
});

SelectionInfo.hideNode = function (node) {
  node.setAttribute('selected', false);
  node.clearAttribute('root');
  this.graph.removeNode(node.key());
};

SelectionInfo.deleteNode = function (node) {
  var doDelete = !node.getData('deleted');
  if (doDelete) {
    node.setData('deleted', true);
    _.bind(SelectionInfo.hideNode, this)(node);
  } else {
    node.clearData('deleted');
  }

  return !doDelete;
};

SelectionInfo.expandNode = function (node) {
  this.graph.addNeighborhood(node);
};

SelectionInfo.collapseNode = function (node) {
  let loners;
  let accessors;

  // Find all neighbors of the node that have exactly one
  // neighbor.
  loners = _.filter(this.graph.neighbors(node.key()), function (nbr) {
    return _.size(this.graph.neighbors(nbr)) === 1;
  }, this);

  // Extract the accessor objects for these nodes.
  accessors = _.map(loners, this.graph.adapter.getAccessor, this.graph.adapter);

  // Hide them.
  _.each(accessors, SelectionInfo.hideNode, this);
};

export default SelectionInfo;
