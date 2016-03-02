/*
Auto-runs grunt in $GIRDER_PATH after the webpack build finishes
(only happens with webpack --watch)

make sure to export GIRDER_PATH=path/to/your/girder/installation
before webpack --watch
*/

var exec = require('child_process').exec;

module.exports = {
  apply: function (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      if (compilation.options.watch === true) {
        exec('cd $GIRDER_PATH && grunt', function (error, stdout, stderr) {
          if (error) {
            process.exit(1);
          }
          console.log(stdout);
        });
      }
      callback();
    });
  }
};
