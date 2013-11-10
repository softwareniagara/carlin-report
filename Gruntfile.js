'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'server.js'
      }
    },
    cssmin: {
      combine: {
        files: {
          'assets/css/build/app.css': [
            'assets/css/src/normalize.css',
            'assets/css/src/font-awesome.css',
            'assets/css/src/meteocons.css',
            'assets/css/src/map-icons.css',
            'assets/css/src/leaflet.awesome-markers.css',
            'assets/css/src/leaflet.css',
            'assets/css/src/magnific-popup.css',
            'assets/css/src/app.css'
          ]
        }
      },
      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          'assets/css/build/app.css': ['assets/css/build/app.css']
        }
      },
      minify: {
        expand: true,
        cwd: 'assets/css/build/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/css/',
        ext: '.min.css'
      }
    },
    stylus: {
      compile: {
        options: {
          paths: ['assets/stylus'],
          urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
          use: [
            require('nib') // use stylus plugin at compile time
          ],
          import: ['nib']
        },
        files: {
          'assets/css/src/app.css': 'assets/stylus/app.styl', // 1:1 compile
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'assets/js/src/leaflet.js',
          'assets/js/src/leaflet.awesome-markers.js',
          'assets/js/src/heatmap.js',
          'assets/js/src/heatmap-leaflet.js',
          'assets/js/src/QuadTree.js',
          'assets/js/src/jquery.js',
          'assets/js/src/jquery.magnific-popup.js',
          'assets/js/src/app.js'
        ],
        dest: 'assets/js/build/app.js'
      }
    },
    uglify: {
      options: {
         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
         files: {
            'public/js/app.min.js': ['<%= concat.dist.dest %>']
         }
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'server.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      concat: {
        files: ['assets/js/src/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
           debounceDelay: 250
         }
      },
      js: {
        files: ['public/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      cssmin: {
        files: ['assets/css/src/*.css'],
        tasks: ['cssmin'],
        options: {
          debounceDelay: 250
        }
      },
      stylus: {
        files: ['assets/stylus/*.styl'],
        tasks: ['stylus', 'cssmin'],
        options: {
          debounceDelay: 250
        }
      },
      css: {
        files: ['public/css/*.css'],
        options: {
          livereload: reloadPort
        }
      },
      jade: {
        files: ['views/*.jade'],
        options: {
          livereload: reloadPort
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', ['develop', 'watch']);
};
