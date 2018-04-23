import { UpSet } from '@candela/upset';
import { simpsons } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(UpSet, {
    data: simpsons,
    id: 'Name',
    sets: [
      'Male',
      'Power Plant',
      'Evil',
      'Blue Hair',
      'Duff Fan',
      'School'
    ],
    fields: ['School'],
    metadata: ['Age']
  });
  vis.render();
};
