import _ from 'underscore';
import Backbone from 'backbone';

import linkInfo from './linkInfo.jade';

const LinkInfo = Backbone.View.extend({
  initialize: function (options) {
    var debRender;

    options = options || {};
    this.graph = options.graph;

    debRender = _.debounce(this.render, 100);

    this.listenTo(this.model, 'focused', debRender);
    this.listenTo(this.model, 'focused', debRender);
  },

  render: function () {
    const doRender = _.bind(function (link) {
      this.$el.html(linkInfo({
        link: link
      }));

      this.$('a.prev').on('click', _.bind(function () {
        this.model.focusLeft();
      }, this));

      this.$('a.next').on('click', _.bind(function () {
        this.model.focusRight();
      }, this));
    }, this);

    let key = this.model.focused();
    if (!key) {
      doRender(undefined);
    } else {
      this.graph.adapter.findLink({
        key: key
      }).then(doRender);
    }
  }
});

export default LinkInfo;
