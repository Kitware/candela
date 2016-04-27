
/* jshint node: true */

module.exports = function (grunt) {
  var path = require('path');

  // This gruntfile is only designed to be used with girder's build system.
  // Fail if grunt is executed here.
  if (path.resolve(__dirname) === path.resolve(process.cwd())) {
    grunt.fail.fatal(
      "To build Resonant Laboratory App, run grunt from Girder's root directory");
  }

  var pluginPath = path.resolve(grunt.config.get('pluginDir'), 'resonant-laboratory');
  var packageJson = path.resolve(pluginPath, 'package.json');

  grunt.config.merge({
    shell: {
      'resonant-laboratory-npm': {
        /*
        * TODO(opadron): remove the true part once webpack 2 finally
        *                comes out of beta
        */
        command: 'npm install || true',
        options: {
          execOptions: { cwd: pluginPath }
        },
        src: [packageJson]
      }
    },

    watch: {
      'plugin-resonant-laboratory-npm': {
        files: [packageJson],
        tasks: ['shell:resonant-laboratory-npm']
      }
    },

    init: {
      'shell:resonant-laboratory-npm': { dependencies: [] }
    }
  });

  var webpack = null;
  try { webpack = require('webpack'); } catch (e) { }

  if (webpack === null) {
    grunt.log.writeln('webpack unavailable.'.yellow);
    grunt.log.writeln([
      'grunt configuration'.yellow.underline,
      'will not be set this run.'.yellow].join(' '));
    return;
  }

  grunt.config.merge({
    shell: {
      'resonant-laboratory-webpack': {
        command: ['../../node_modules/webpack/bin/webpack.js',
        '--bail',
        '--display-error-details'].join(' '),
        options: {
          execOptions: { cwd: pluginPath }
        }
      }
    },

    watch: {
      'plugin-resonant-laboratory-webpack': {
        files: [path.join(pluginPath, 'web-external', 'src', '**', '*'),
        path.join(pluginPath, 'Gruntfile.js'),
        path.join(pluginPath, 'webpack.config.js')],
        tasks: ['shell:resonant-laboratory-webpack'],
        options: { spawn: false }
      }
    },

    default: {
      'shell:resonant-laboratory-webpack': { dependencies: [] }
    }
  });
};
