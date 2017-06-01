import VisComponent from 'candela/VisComponent';

import ErrorBulletWidget from './ErrorBulletWidget';
import BoxAndWhiskerWidget from './BoxAndWhiskerWidget';

class ValueWidget extends VisComponent {
  constructor (el, settings) {
    super(el);

    this.settings = settings;
    if (Array.isArray(settings.result.current)) {
      if (settings.result.current.length > 1) {
        this.Type = BoxAndWhiskerWidget;
      } else {
        settings.result.current = settings.result.current[0];
        this.Type = ErrorBulletWidget;
      }
    } else {
      this.Type = ErrorBulletWidget;
    }
  }

  render () {
    let widget = new this.Type(this.el, this.settings);
    widget.render();
  }
}

export default ValueWidget;
