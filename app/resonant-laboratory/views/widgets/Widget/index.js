import Backbone from 'backbone';

import collapseIcon from '../../../images/collapse.svg';
import expandIcon from '../../../images/expand.svg';
import okayIcon from '../../../images/okay.svg';
import spinnerIcon from '../../../images/spinner.gif';
import warningIcon from '../../../images/warning.svg';
import infoIcon from '../../../images/info.svg';

let Widget = Backbone.View.extend({
  initialize: function (spec) {
    this.friendlyName = 'ERROR! Abstract Widget!';
    this.spec = spec;
    this.panel = null;
    this.statusText = {
      text: '',
      onclick: () => {
        this.toggle();
      }
    };

    this.icons = [{
      src: Widget.infoIcon,
      className: () => {
        return window.mainPage.currentUser.preferences
          .hasSeenAllTips(this.getDefaultTips()) ? 'old' : 'new';
      },
      title: () => {
        return 'About this panel';
      },
      onclick: () => {
        this.renderInfoScreen();
      }
    }, {
      src: () => {
        return this.isTargeted() ? collapseIcon : expandIcon;
      },
      title: () => {
        return this.isTargeted() ? 'Collapse Panel' : 'Expand Panel';
      },
      onclick: () => {
        this.toggle();
      }
    }];

    this.listenTo(window.mainPage.widgetPanels, 'rl:navigateWidgets',
      this.render);
    this.listenTo(window.mainPage, 'rl:resizeWindow', this.render);
    this.listenTo(window.mainPage.currentUser.preferences,
      'rl:observeTips', this.renderIndicators);
  },
  toggle: function () {
    window.mainPage.widgetPanels.toggleWidget(this.spec);
  },
  isTargeted: function () {
    return window.mainPage.widgetPanels.expandedWidgets
      .has(this.spec.hashName);
  },
  setPanel: function (panel, node) {
    this.panel = panel;
    this.setElement(node);
  },
  renderIndicators: function () {
    this.panel.renderIndicators();
  },
  render: function () {
    // Don't render if there's no project or if our WidgetPanel
    // hasn't given us a legitimate element in the
    // document yet
    if (!window.mainPage.project ||
      document.getElementById(this.$el.attr('id')) !== this.el) {
      this.$el.html('');
      return false;
    } else {
      return true;
    }
  },
  getDefaultTips: function () {
    let tips = [];
    let prefix = '#' + this.el.parentNode.getAttribute('id') + ' ';

    // Get the tip for the indicator text
    if (this.statusText.title) {
      tips.push({
        selector: prefix + '.indicatorText',
        message: this.statusText.title
      });
    }
    // Get the tips for each indicator icon
    this.icons.forEach((icon, index) => {
      tips.push({
        selector: prefix + '.indicatorIcons img:nth-child(' + (index + 1) + ')',
        message: typeof icon.title === 'function' ? icon.title() : icon.title
      });
    });
    // Get a tip for the bar
    tips.push({
      selector: prefix + '.sectionHeader',
      message: 'Collapse / expand this panel'
    });
    return tips;
  }
});

Widget.collapseIcon = okayIcon;
Widget.expandIcon = okayIcon;
Widget.okayIcon = okayIcon;
Widget.spinnerIcon = spinnerIcon;
Widget.warningIcon = warningIcon;
Widget.infoIcon = infoIcon;

module.exports = Widget;
