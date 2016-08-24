import { simpsons } from '../util/datasets';
import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent('OnSet', 'div', {
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
};
