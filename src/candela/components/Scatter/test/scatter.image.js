import test from 'tape';
import Nightmare from 'nightmare';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import resemble from 'node-resemble';

function dataUrl(raw, type='image/jpeg') {
  return `data:${type};base64,${raw.toString('base64')}`;
}

function rawData(dataUrl) {
  return dataUrl.split(',')[1];
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
    const refImage = dataUrl(fs.readFileSync(path.join(__dirname, 'scatter.png')));
    const image = dataUrl(imageBuf);

    resemble(image)
      .compareTo(refImage)
      .onComplete(analysis => {
        const passed = Number(analysis.misMatchPercentage) < 0.01;
        if (!passed) {
          fs.writeFileSync(path.join(__dirname, 'scatter-test.png'), imageBuf.toString('base64'), 'base64');
          fs.writeFileSync(path.join(__dirname, 'scatter-diff.png'), rawData(analysis.getImageDataUrl()), 'base64');
        }

        t.ok(passed, 'scatter image matches reference image');

        t.end();
        return n.end().then();
      });
  });
});
