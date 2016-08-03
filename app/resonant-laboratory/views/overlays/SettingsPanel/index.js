import d3 from 'd3';
import Underscore from 'underscore';
import Backbone from 'backbone';
import template from './template.html';
import './style.scss';

let SettingsPanel = Backbone.View.extend({
  initialize: function (title, blurb, actionItems) {
    this.title = title;
    this.blurb = blurb;
    this.actionItems = actionItems;
  },
  render: function () {
    if (!this.addedTemplate) {
      let options = {
        title: this.title
      };
      this.$el.html(Underscore.template(template)(options));
      if (this.blurb) {
        d3.select(this.el).select('#rightChunk')
          .insert('p', ':first-child')
          .text(this.blurb);
      }
      this.addedTemplate = true;
    }

    this.$el.find('a#loginLink').on('click', () => {
      window.mainPage.overlay.render('LoginView');
    });

    this.$el.find('a#registerLink').on('click', () => {
      window.mainPage.overlay.render('RegisterView');
    });

    if (window.mainPage.currentUser.isLoggedIn()) {
      this.$el.find('#loginLinks').hide();
    } else {
      this.$el.find('#loginLinks').show();
    }

    let actionItems = d3.select('#actionItems')
      .selectAll('div.actionItem').data(this.actionItems);
    actionItems.enter().append('div')
      .attr('class', 'clickable actionItem');
    actionItems.exit().remove();
    actionItems.text(d => d.text)
      .on('click', d => d.onclick);
  }
});

export default SettingsPanel;
