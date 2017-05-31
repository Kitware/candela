import candela from 'candela';
import 'candela-onset';

import { simpsons } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  const vis = showComponent(candela.components.OnSet, {
    data: simpsons,
    id: 'Name',
    sets: [
      'Male',
      'Power Plant',
      'Evil',
      'Blue Hair',
      'Duff Fan',
      'School'
    ]
  });
  vis.render();
};
