
/* jshint node: true */

module.exports = function (grunt) {
  var path = require('path');

  // This gruntfile is only designed to be used with girder's build system.
  // Fail if grunt is executed here.
  if (path.resolve(__dirname) === path.resolve(process.cwd())) {
    grunt.fail.fatal(
      "To build Resonant Reference App, run grunt from Girder's root directory");
  }

  var pluginPath = path.resolve(grunt.config.get('pluginDir'), 'resonant-reference-app');
  var packageJson = path.resolve(pluginPath, 'package.json');

  grunt.config.merge({
    shell: {
      'resonant-reference-app-npm': {
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
      'plugin-resonant-reference-app-npm': {
        files: [packageJson],
        tasks: ['shell:resonant-reference-app-npm']
      }
    },

    init: {
      'shell:resonant-reference-app-npm': { dependencies: [] }
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
      'resonant-reference-app-webpack': {
        command: ['../../node_modules/webpack/bin/webpack.js',
        '--bail',
        '--display-error-details'].join(' '),
        options: {
          execOptions: { cwd: pluginPath }
        }
      }
    },

    watch: {
      'plugin-resonant-reference-app-webpack': {
        files: [path.join(pluginPath, 'web-external', 'src', '**', '*'),
        path.join(pluginPath, 'Gruntfile.js'),
        path.join(pluginPath, 'webpack.config.js')],
        tasks: ['shell:resonant-reference-app-webpack'],
        options: { spawn: false }
      }
    },

    default: {
      'shell:resonant-reference-app-webpack': { dependencies: [] }
    }
  });
};
