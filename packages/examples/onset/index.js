import { OnSet } from '@candela/onset';
import { simpsons } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  let vis = showComponent(OnSet, {
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
