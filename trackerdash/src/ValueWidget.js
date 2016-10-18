import Backbone from 'backbone';

import { ErrorBulletWidget } from './ErrorBulletWidget';
import { BoxAndWhiskerWidget } from './BoxAndWhiskerWidget';

export let ValueWidget = Backbone.View.extend({

  initialize: function (settings) {
    this.settings = settings;
    if (Array.isArray(settings.result.current)) {
        if (settings.result.current.length > 1) {
            this.type = BoxAndWhiskerWidget;
        } else {
            settings.result.current = settings.result.current[0];
            this.type = ErrorBulletWidget;
        }
    } else {
      this.type = ErrorBulletWidget;
    }
  },

  render: function () {
    let widget = new this.type(this.settings);
    widget.render();
  }

});
