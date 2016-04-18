import Underscore from 'underscore';
import Backbone from 'backbone';
import jQuery from 'jquery';

import collapseIcon from '../../../images/collapse.svg';
import expandIcon from '../../../images/expand.svg';
import okayIcon from '../../../images/okay.svg';
import spinnerIcon from '../../../images/spinner.gif';
import warningIcon from '../../../images/warning.svg';
import infoIcon from '../../../images/info.svg';
import newInfoIcon from '../../../images/newInfo.svg';

import loadingTemplate from './loadingTemplate.html';
import errorTemplate from './errorTemplate.html';
import successTemplate from './successTemplate.html';

let Widget = Backbone.View.extend({
  initialize: function (spec) {
    let self = this;
    self.friendlyName = 'ERROR! Abstract Widget!';
    self.spec = spec;
    self.statusText = {
      text: '',
      onclick: function () {
        self.panel.toggle();
      }
    };

    self.icons = [{
      src: function () {
        return self.isTargeted() ? collapseIcon : expandIcon;
      },
      title: function () {
        return self.isTargeted() ? 'Collapse Panel' : 'Expand Panel';
      },
      onclick: function () {
        self.toggle();
      }
    }];
    
    self.panel = null;
  },
  toggle: function () {
    let self = this;
    window.mainPage.widgetPanels.toggleWidget(self.spec);
  },
  isTargeted: function () {
    let self = this;
    return window.mainPage.widgetPanels.expandedWidgets
      .has(self.spec.hashName);
  },
  setPanel: function (panel) {
    let self = this;
    self.panel = panel;
    self.setElement(jQuery('#' + self.spec.hashName + 'Container')[0]);
  },
  renderIndicators: function () {
    let self = this;
    self.panel.renderIndicators();
  },
  getLoadingScreen: function (message) {
    return Underscore.template(loadingTemplate)({
      message: message
    });
  },
  getErrorScreen: function (message) {
    return Underscore.template(errorTemplate)({
      message: message
    });
  },
  getSuccessScreen: function (message) {
    return Underscore.template(successTemplate)({
      message: message
    });
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
