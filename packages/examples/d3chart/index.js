import { Swatches } from '@candela/d3chart';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(Swatches, {
    width: 300,
    height: 300,
    margin: {
      top: 20,
      right: 30,
      bottom: 40,
      left: 50
    }
  });
};
