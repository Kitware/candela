import ErrorBulletWidget from './ErrorBulletWidget';
import BoxAndWhiskerWidget from './BoxAndWhiskerWidget';
import VisComponent from '../../VisComponent';

class ValueWidget extends VisComponent {
  constructor (el, settings) {
    super(el);

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
  }

  render () {
    let widget = new this.type(this.el, this.settings);
    widget.render();
  }
}

export default ValueWidget;
