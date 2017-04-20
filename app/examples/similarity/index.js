import { bigram } from '../util/datasets';
import showComponent from '../util/showComponent';
import SimilarityGraph from '../../../components/SimilarityGraph';

const sonorantClass = letter => 'aeiou'.indexOf(letter) !== -1 ? 'vowel' : 'consonant';

const generateTable = (freq) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let table = [];

  let min = Infinity;
  let max = -Infinity;

  alphabet.forEach(x => {
    let entry = {
      id: x,
      color: sonorantClass(x),
      size: -Infinity
    };

    alphabet.forEach(y => {
      const value = Math.max(bigram[`${x}${y}`], bigram[`${y}${x}`]);

      if (value < min) {
        min = value;
      }

      if (value > max) {
        max = value;
      }

      if (value > entry.size) {
        entry.size = value;
      }
      entry[y] = value;
    });

    table.push(entry);
  });

  // Rescale the "size" values to a reasonable range of circle radii.
  const minSize = 5;
  const maxSize = 20;
  const rescale = val => (val - min) / (max - min) * (maxSize - minSize) + minSize;

  table.forEach(entry => entry.size = rescale(entry.size));
  console.log(table);

  return table;
};

window.onload = () => {
  showComponent(SimilarityGraph, 'svg', {
    data: generateTable(bigram),
    threshold: 0.01,
    size: 'size',
    linkDistance: 120
  });
};
