import test from 'tape';
import Nightmare from 'nightmare';
import fs from 'fs';
import Promise from 'bluebird';
import resemble from 'node-resemble';

function dataUrl(raw, type='image/jpeg') {
  return `data:${type};base64,${raw.toString('base64')}`;
}

function extractData(durl) {
  const s = durl.indexOf(',');
  if (s > -1) {
    return durl.slice(s+1);
  }
}

Promise.onPossiblyUnhandledRejection(err => {
  throw err;
});

test('Scatter plot image test', t => {
  let n = Nightmare({
    show: false
  });

  Promise.resolve()
  .then(() => {
    return n.goto('http://localhost:38000/examples/#scatter')
      .wait('body')
      .evaluate(() => {
        const box = document.getElementById('vis-element').getBoundingClientRect();
        return {
          x: box.left,
          y: box.top,
          width: box.width,
          height: box.height
        };
      });
  })
  .then(rect => {
    return n.screenshot(undefined, rect);
  })
  .then(imageBuf => {
    console.log('hello');
    const refImage = dataUrl(fs.readFileSync('test/scatter.png'));
    const image = dataUrl(imageBuf);
    console.log('ok');
    resemble(image)
      .compareTo(refImage)
      .onComplete(analysis => {
        console.log(analysis);

        t.end();
        return n.end().then();
      });
  });
});
