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
  // This function returns true if (1) there is an environment variable set
  // called "CANDELA_SAVE_IMAGE", and either (2a) the name of the test appears
  // in the value of the variable when treated as a comma separated list of
  // strings, or (2b) the variable reads "all".
  const go = process.env.CANDELA_SAVE_IMAGE;
  const mentionsName = go && process.env.CANDELA_SAVE_IMAGE.split(',').indexOf(name) > -1;
  const doAll = go && process.env.CANDELA_SAVE_IMAGE === 'all';

  return go && mentionsName || doAll;
}

function doDumpImage (name) {
  const go = process.env.CANDELA_DUMP_IMAGE;
  const mentionsName = go && process.env.CANDELA_DUMP_IMAGE.split(',').indexOf(name) > -1;
  const doAll = go && process.env.CANDELA_DUMP_IMAGE === 'all';

  return go && mentionsName || doAll;
}

Promise.onPossiblyUnhandledRejection(err => {
  console.log(err);
  throw err;
});

export default function imageTest ({name, extraBaselines = [], url, selector, delay = 0, threshold, verbose = false}) {
  const dirname = callerDirname();

  test(`${name} image test`, t => {
    // TODO: allow options to appear in args.
    let n = Nightmare({
      width: 800,
      height: 600,
      show: false,
      useContentSize: true,
      frame: false,
      webPreferences: {
        // This disables session sharing, allowing each test to begin with an
        // emtpy cache, etc.
        partition: 'nopersist'
      }
    });

    Promise.resolve()
    .then(() => {
      return n.goto(url)
        .wait('body')
        .wait(delay)
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
      let image = imageBuf ? dataUrl(imageBuf) : null;

      let analyses = [];
      let count = 0;

      const tally = () => {
        let best = analyses[0];
        analyses.forEach((entry) => {
          if (entry.analysis.misMatchPercentage < best.analysis.misMatchPercentage) {
            best = entry;
          }
        });

        const {filename, analysis} = best;
        const passed = Number(analysis.misMatchPercentage) < threshold * 100;
        if (!passed || doDumpImage(name)) {
          fs.writeFileSync(path.join(dirname, `${filename}-test.png`), imageBuf.toString('base64'), 'base64');
          fs.writeFileSync(path.join(dirname, `${filename}-diff.png`), rawData(analysis.getImageDataUrl()), 'base64');
        }

        t.ok(passed, `${name} image matches baseline image ${filename}.png to within ${threshold * 100}% (actual diff: ${analysis.misMatchPercentage}%)`);

        t.end();
        return n.end().then();
      };

      const baselines = [name, ...extraBaselines];
      baselines.forEach((filename, i) => {
        const refImage = dataUrl(fs.readFileSync(path.join(dirname, `${filename}.png`)));

        if (image === null) {
          image = refImage;
        }

        resemble(image)
          .compareTo(refImage)
          .ignoreAntialiasing()
          .onComplete(analysis => {
            analyses[i] = {
              analysis,
              filename
            };
            count++;

            if (count === baselines.length) {
              return tally();
            }
          });
      });
    });
  });
}
