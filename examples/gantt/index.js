import candela from 'candela';
import 'candela/plugins/vega/load';

import showComponent from '../util/showComponent';

window.onload = () => {
  showComponent(candela.components.GanttChart, {
    data: [
      {name: '1. Algorithms', level: 1, enter: 0, leave: 6},
      {name: 'Algorithm Specification', level: 2, enter: 0, leave: 2},
      {name: 'Algorithm Implementation', level: 2, enter: 1, leave: 6},
      {name: '2. Software Prototype', level: 1, enter: 1, leave: 8},
      {name: 'Support Data Formats', level: 2, enter: 1, leave: 3},
      {name: 'Modular Analyses/Workflows', level: 2, enter: 3, leave: 5},
      {name: 'Web Interface and Mockups', level: 2, enter: 5, leave: 8},
      {name: '3. Evaluation and Team-Building', level: 1, enter: 0, leave: 9},
      {name: 'Data Collection', level: 2, enter: 0, leave: 2},
      {name: 'Algorithmic Evaluation', level: 2, enter: 6, leave: 8},
      {name: 'Usability Evaluation', level: 2, enter: 7, leave: 9},
      {name: 'Final Report', level: 2, enter: 8, leave: 9}
    ],
    start: 'enter',
    end: 'leave',
    label: 'name',
    level: 'level',
    tickCount: 10,
    axisTitle: 'Month',
    width: 500,
    height: 300,
    renderer: 'svg'
  });
};
