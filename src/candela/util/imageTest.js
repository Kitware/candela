import fs from 'fs';
import path from 'path';
import callsite from 'callsite';
import test from 'tape';
import Nightmare from 'nightmare';
import Promise from 'bluebird';
import resemble from 'node-resemble';

function dataUrl (raw) {
  return `data:image/png;base64,${raw.toString('base64')}`;
}

function rawData (dataUrl) {
  return dataUrl.split(',')[1];
}

function callerDirname () {
  const stack = callsite();
  const frame = stack[2].getFileName();
  return path.dirname(frame);
}

function doSaveImage (name) {
  return process.env.CANDELA_SAVE_IMAGE && process.env.CANDELA_SAVE_IMAGE.split(',').indexOf(name) > -1;
}

Promise.onPossiblyUnhandledRejection(err => {
  console.log(err);
  throw err;
});

export default function imageTest ({name, url, selector, threshold}) {
  const dirname = callerDirname();

  test(`${name} image test`, t => {
    // TODO: allow options to appear in args.
    let n = Nightmare({
      show: false
    });

    Promise.resolve()
    .then(() => {
      return n.goto(url)
        .wait('body')
        // TODO: allow for a custom evaluate function?
        .evaluate((_selector) => {
          const box = document.querySelector(_selector).getBoundingClientRect();
          return {
            x: box.left,
            y: box.top,
            width: box.width,
            height: box.height
          };
        }, selector);
    })
    .then(rect => n.screenshot(doSaveImage(name) ? path.join(dirname, `${name}.png`) : undefined, rect))
    .then(imageBuf => {
      const refImage = dataUrl(fs.readFileSync(path.join(dirname, `${name}.png`)));
      const image = imageBuf ? dataUrl(imageBuf) : refImage;

      resemble(image)
        .compareTo(refImage)
        .onComplete(analysis => {
          const passed = Number(analysis.misMatchPercentage) < threshold;
          if (!passed) {
            fs.writeFileSync(path.join(dirname, `${name}-test.png`), imageBuf.toString('base64'), 'base64');
            fs.writeFileSync(path.join(dirname, `${name}-diff.png`), rawData(analysis.getImageDataUrl()), 'base64');
          }

          t.ok(passed, `${name} image matches reference image to within ${threshold * 100}%`);

          t.end();
          return n.end().then();
        });
    });
  });
}
