import candela from 'candela';
import 'candela/plugins/upset/load';

import { simpsons_alternate } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  const vis = showComponent(candela.components.UpSet, {
    data: simpsons_alternate,
    id: 'Name',
    sets: [
      'Male',
      'Power Plant',
      'Evil',
      'Blue Hair',
      'Duff Fan',
      'School'
    ],
    fields: ['School']
  });
  vis.render();
};
