import { bigram } from '../util/datasets';
import showComponent from '../util/showComponent';
import SimilarityGraph from '../../../components/SimilarityGraph';

const sonorantClass = letter => 'aeiou'.indexOf(letter) !== -1 ? 'vowel' : 'consonant';

const generateTable = (freq) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let table = [];
  alphabet.forEach(x => {
    let entry = {
      id: x,
      color: sonorantClass(x)
    };

    alphabet.forEach(y => {
      entry[y] = Math.max(bigram[`${x}${y}`], bigram[`${y}${x}`]);
    });

    table.push(entry);
  });

  return table;
};

window.onload = () => {
  showComponent(SimilarityGraph, 'svg', {
    data: generateTable(bigram),
    threshold: 0.01,
    nodeRadius: 7,
    linkDistance: 60
  });
};
