/**
 * Copyright 2013 Kitware Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (grunt) {
    var fs = require('fs');
    var path = require('path');
    require('colors');

    var defaultTasks = ['stylus', 'build-js'];

    // Project configuration.
    grunt.config.init({
        pkg: grunt.file.readJSON('package.json'),

        jade: {
            index: {
                options: {
                    client: false,
                    compileDebug: false,
                    pretty: true,
                    processName: function (filename) {
                        return path.basename(filename, '.jade');
                    }
                },
                files: {
                    'dist/index.html': [
                        'templates/index.jade'
                    ]
                }
            },
            templates: {
                options: {
                    client: true,
                    compileDebug: false,
                    namespace: 'jade.templates',
                    processName: function (filename) {
                        return path.basename(filename, '.jade');
                    }
                },
                files: {
                    'build/templates.js': [
                        'templates/*.jade',
                        '!templates/index.jade'
                    ]
                }
            }
        },

        stylus: {
            core: {
                files: {
                    'dist/app.min.css': [
                        'styles/*.styl',
                    ],
                }
            }
        },

        copy: {
            main: {
                files: [{expand: true, flatten: true, src: ['libs/*.css'], dest: 'dist/', filter: 'isFile'}]
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                sourceMapIncludeSources: true,
                report: 'min'
            },
            app: {
                files: {
                    'dist/app.min.js': [
                        'build/templates.js',
                        'src/init.js',
                        'src/**/*.js'
                    ]
                }
            },
            libs: {
                files: {
                    'dist/libs.min.js': [
                        'node_modules/jquery-browser/lib/jquery.js',
                        'node_modules/jade/runtime.js',
                        'node_modules/underscore/underscore.js',
                        'node_modules/backbone/backbone.js',
                        'libs/bootstrap.js',
                        'libs/d3.js',
                        'libs/nv.d3.js'
                    ]
                }
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js']
        },

        watch: {
            stylus_core: {
                files: ['styles/*.styl'],
                tasks: ['stylus:core'],
                options: {failOnError: false}
            },
            js_core: {
                files: ['src/*.js'],
                tasks: ['uglify:app'],
                options: {failOnError: false}
            },
            jade: {
                files: ['templates/*.jade'],
                tasks: ['jade:templates', 'jade:index', 'uglify:app'],
                options: {failOnError: false}
            }
        }

    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', [
        'jshint',
        'copy',
        'jade',
        'stylus',
        'uglify:libs',
        'uglify:app'
    ]);
};
