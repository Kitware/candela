import Nightmare from 'nightmare';
import test from 'tape';

let count = 0;

test('Google site', t => {
  let nightmare = Nightmare({
    show: false
  });

  Promise.resolve()
  .then(() => {
    return nightmare.goto('http://google.com').title();
  })
  .then(title => {
    t.equal(title, 'Google', 'Google page\'s title should be "Google"');
  })
  .then(() => {
    nightmare.end();
    t.end();
    count++;
  });
});

test('Google logo', t => {
  let nightmare = Nightmare({
    show: false
  });

  Promise.resolve()
  .then(() => {
    return nightmare
      .goto('http://google.com')
      .wait('#hplogo')
      .evaluate(() => {
        return document.getElementById('hplogo').height;
      });
  })
  .then(height => {
    t.equal(height, 92, 'Google logo height should be 92');
  })
  .then(() => {
    nightmare.end();
    t.end();
    count++;
  });
});

test('Google image comparison', t => {
  let nightmare = Nightmare({
    show: false
  });

  Promise.resolve()
  .then(() => {
    return nightmare
      .goto('http://google.com')
      .wait('#hplogo')
      .evaluate(() => {
        const x = document.getElementById('hplogo').getBoundingClientRect();
        return {
          y: x.top,
          x: x.left,
          width: x.width,
          height: x.height
        };
      });
  })
  .then(rect => {
    console.log(rect);
    return nightmare.screenshot(undefined, rect);
  })
  .then((image) => {
    console.log(image);
    t.ok(true);

    nightmare.end();
    t.end();
    count++;
  });
});

setInterval(() => {
  if (count === 3) {
    process.exit();
  }
}, 200);
