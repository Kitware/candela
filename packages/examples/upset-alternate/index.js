import { UpSet } from '@candela/upset';
import { simpsons_alternate } from '../datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(UpSet, {
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
};
