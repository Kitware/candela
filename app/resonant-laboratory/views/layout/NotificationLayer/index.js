import Underscore from 'underscore';
import Backbone from 'backbone';
import d3 from 'd3';
import closeIcon from '../../../images/close.svg';
import './style.scss';

let ID = 0;

let NotificationLayer = Backbone.View.extend({
  initialize: function () {
    this.notifications = {};
    this.speed = 200;
  },
  displayNotification: function (template, extraClass, duration) {
    duration = duration || 4000;
    let notification = {
      id: ID,
      template: template,
      duration: duration
    };
    ID += 1;
    if (extraClass) {
      notification.extraClass = extraClass;
    }
    notification.timeout = window.setTimeout(() => {
      this.hideNotification(notification.id);
    }, duration);

    this.notifications[notification.id] = notification;
    this.render();
  },
  restartNotificationTimer: Underscore.debounce(function (id) {
    if (!this.notifications[id]) {
      // already too late...
      return;
    }
    window.clearTimeout(this.notifications[id].timeout);
    this.notifications[id].timeout = window.setTimeout(() => {
      this.hideNotification(id);
    }, this.notifications[id].duration);
  }, 200),
  hideNotification: function (id) {
    delete this.notifications[id];
    this.render();
  },
  render: function () {
    let sections = d3.select('#NotificationLayer')
      .selectAll('.notification')
      .data(d3.entries(this.notifications), d => d.key);
    let sectionsEnter = sections.enter().append('div')
      .attr('class', d => {
        let result = 'notification';
        if (d.value.extraClass) {
          result += ' ' + d.value.extraClass;
        }
        return result;
      });
    sectionsEnter.append('div')
      .attr('class', 'content');
    sectionsEnter.append('img')
      .attr('class', 'closeIcon')
      .attr('src', closeIcon)
      .on('click', d => {
        this.hideNotification(d.key);
      });
    sectionsEnter.style('opacity', '0.0')
      .transition().duration(this.speed)
      .style('opacity', '1.0');

    sections.exit()
      .style('opacity', '1.0')
      .transition().duration(this.speed)
      .style('opacity', '0.0')
      .remove();

    sections.select('div.content')
      .html(d => d.value.template)
      .on('mousemove', d => {
        this.restartNotificationTimer(d.key);
      })
      .on('click', d => {
        this.restartNotificationTimer(d.key);
      });
  }
});

export default NotificationLayer;
