import Backbone from 'backbone';

import { ErrorBulletWidget } from './ErrorBulletWidget';
import { BoxAndWhiskerWidget } from './BoxAndWhiskerWidget';

export let ValueWidget = Backbone.View.extend({

  initialize: function (settings) {
    this.settings = settings;
    if (Array.isArray(settings.result.current)) {
      this.type = BoxAndWhiskerWidget;
    } else {
      this.type = ErrorBulletWidget;
    }
  },

  render: function () {
    let widget = new this.type(this.settings);
    widget.render();
  }

});
