import Backbone from 'backbone';

import collapseIcon from '../../../images/collapse.svg';
import expandIcon from '../../../images/expand.svg';
import okayIcon from '../../../images/okay.svg';
import spinnerIcon from '../../../images/spinner.gif';
import warningIcon from '../../../images/warning.svg';
import infoIcon from '../../../images/info.svg';
import newInfoIcon from '../../../images/newInfo.svg';

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
    
    this.listenTo(window.mainPage.widgetPanels, 'rra:navigateWidgets',
      this.render);
    this.listenTo(window.mainPage, 'rra:resizeWindow', this.render);
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
  canRender: function () {
    // Don't render if there's no toolchain, or if our WidgetPanel
    // hasn't given us a legitimate element in the
    // document yet
    return window.mainPage.toolchain &&
      document.getElementById(this.$el.attr('id')) === this.el;
  }
});

Widget.collapseIcon = okayIcon;
Widget.expandIcon = okayIcon;
Widget.okayIcon = okayIcon;
Widget.spinnerIcon = spinnerIcon;
Widget.warningIcon = warningIcon;
Widget.infoIcon = infoIcon;
Widget.newInfoIcon = newInfoIcon;

module.exports = Widget;
