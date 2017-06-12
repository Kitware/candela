import candela from 'candela';
import 'candela/dist/similaritygraph.min.js';

import { bigram } from '../datasets';
import showComponent from '../util/showComponent';

const sonorantClass = letter => 'aeiou'.indexOf(letter) !== -1 ? 'vowel' : 'consonant';

const generateTable = (freq) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let table = [];

  let min = Infinity;
  let max = -Infinity;

  alphabet.forEach(x => {
    let entry = {
      letter: x,
      vowel: sonorantClass(x),
      radius: -Infinity
    };

    alphabet.forEach(y => {
      const value = Math.max(bigram[`${x}${y}`], bigram[`${y}${x}`]);

      if (value < min) {
        min = value;
      }

      if (value > max) {
        max = value;
      }

      if (value > entry.radius) {
        entry.radius = value;
      }
      entry[y] = value;
    });

    table.push(entry);
  });

  // Rescale the "size" values to a reasonable range of circle radii.
  const minSize = 5;
  const maxSize = 20;
  const rescale = val => (val - min) / (max - min) * (maxSize - minSize) + minSize;

  table.forEach(entry => entry.radius = rescale(entry.radius));

  return table;
};

window.onload = () => {
  showComponent(candela.components.SimilarityGraph, {
    data: generateTable(bigram),
    id: 'letter',
    color: 'vowel',
    threshold: 0.01,
    size: 'radius',
    linkDistance: 120,
    width: '100vw',
    height: '100vh'
  });
};
