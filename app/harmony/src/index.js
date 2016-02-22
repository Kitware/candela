import layout from './jade/layout.jade';
import './styl/layout.styl';
import resplendent from './../../../src';

let girder = window.girder;

function resolveOptions (component, opts, done) {
  let copts = {};
  let optsArr = [];
  for (let copt of component.options) {
    copts[copt.name] = copt;
  }
  for (let name of Object.keys(opts)) {
    optsArr.push({name: name, value: opts[name]});
  }
  let resolveOptionsRec = (optsList, ropts, done) => {
    if (optsList.length === 0) {
      done(ropts);
    } else {
      let opt = optsList[0];
      let rest = optsList.slice(1);
      let copt = copts[opt.name];
      if (copt) {
        if (copt.type === 'table') {
          girder.restRequest({
            path: 'item/' + opt.value + '/files',
            type: 'GET',
            error: null
          }).done(files => {
            girder.restRequest({
              path: 'file/' + files[0]._id + '/download',
              type: 'GET',
              error: null
            }).done(content => {
              ropts[opt.name] = content;
              resolveOptionsRec(rest, ropts, done);
            });
          });
        } else {
          ropts[opt.name] = opt.value;
          resolveOptionsRec(rest, ropts, done);
        }
      } else {
        resolveOptionsRec(rest, ropts, done);
      }
    }
  };
  resolveOptionsRec(optsArr, {}, done);
}

window.onload = () => {
  let datasets = new girder.collections.ItemCollection();
  datasets.pageLimit = 100;

  girder.restRequest({
    path: 'resource/lookup?path=/collection/Harmony/Data',
    type: 'GET',
    error: null
  }).done((dataFolder) => {
    datasets.fetch({folderId: dataFolder._id});
  });

  let visualizations = new girder.collections.ItemCollection();
  visualizations.pageLimit = 100;
  visualizations.append = true;

  girder.restRequest({
    path: 'resource/lookup?path=/collection/Harmony/Visualizations',
    type: 'GET',
    error: null
  }).done((visFolder) => {
    visualizations.fetch({folderId: visFolder._id});
  });

  visualizations.on('add', item => {
    let visMeta = item.get('meta').visualization;
    let VisComponent = resplendent.components[visMeta.type];
    resolveOptions(VisComponent, visMeta.options, (opts) => {
      new VisComponent('.hmy-vis', opts);
    });
  });

  document.querySelector('.hmy-content').innerHTML = layout();
};
