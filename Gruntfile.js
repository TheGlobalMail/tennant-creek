'use strict';

var fs = require('fs');
var path = require('path');

try { // API key to automate deploys to the CDN
  var config = require('./config.json');
  process.env['RACKSPACE_API_KEY'] = config['RACKSPACE_API_KEY'];
} catch (e) {}

// Project folders (relative to this Gruntfile)
var project = {
  app: 'app',
  dist: 'dist'
};

var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// This is a custom middleware for connect to serve our index.html for pushState requests
// This should be added after mounting any folders so we can still serve real static files
var serveIndex = function(req, res) {
  var index = path.resolve(project.app + '/index.html');
  var rs = fs.createReadStream(index);

  rs.on('open', function() {
    rs.pipe(res);
  });
};

// Grunt!!!
module.exports = function(grunt) {
  var _ = grunt.util._;

  // Look in package.json for grunt devDependencies and load them into grunt
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    // Add the project dirs into the config so we can reference
    // them below using the underscore template syntax
    project: project,

    // Read our package.json file for extra info
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      options: {
          nospawn: true,
          livereload: true
      },
      // Recompile LESS which will then trigger the livereload watcher below
      less: {
        files: ['app/styles/{,*/}*.less', 'app/components/tgm-bootstrap/less/*.less'],
        tasks: ['less:server']
      },

      /* When any main assets in `project.app` change we should reload the browser
       * Globbing now has OR statements, i.e. app/{js,scripts} will search app/js and app/scripts
       * If you omit the first value it works like an optional match so app/{,js}/*.js
       * Will match app/myscript.js and app/js/otherscript.js
       *
       * Any precompiled resources (i.e. compiled CSS, compiled Handlebars templates) live in the .tmp folder
       */
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= project.app %>/index.html',
          '{.tmp,<%= project.app %>}/styles/{,/*}*.css',
          '{.tmp,<%= project.app %>}/js/{,/*,**/,*/,**/**/}*.js',
          '<%= project.app %>/images/{,*/}*.{png,jpg,jpeg,webp,svg}'
        ]
      }
    },

    // develpment server
    connect: {
      options: {
        port: 9000,
        // Use 0.0.0.0 to listen from anywhere
        // Can be changed to localhost to lock it down
        hostname: '0.0.0.0'
      },

      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, project.app)
            ];
          }
        }
      },

      // dev server that ONLY runs the /dist folder, good for checking a build before deployment
      dist: {
        options: {
          middleware: function(connect) {
            return [
              mountFolder(connect, 'dist'),
              serveIndex
            ];
          }
        }
      }
    },

    clean: {
      dist: ['.tmp', '<%= project.dist %>/*'],
      server: ['.tmp']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      // have to use with_overrides because the jshint task doesn't automatically merge options with .jshintrc
      with_overrides: {
        options: {
          globals: {
            jQuery: true,
            $: true,
            _: true,
            Backbone: true,
            Modernizr: true
          }
        }
      },

      all: [
        // Yo dawg, I heard you like linting when building
        // So I put a lint task in your build file so you can lint your build file while you build
        'Gruntfile.js',
        '<%= project.app %>/js/{,/*}*.js',

        // ! = Ignore the libs folder which contains dodgy 3rd-party code
        '!<%= project.app %>/js/libs/'
      ]
    },

    // LESS task has two targets so we can run unminified CSS in dev mode
    less: {
      server: {
        files: {
          // compile to our .tmp, this folder is mounted in the dev server
          '.tmp/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      },

      dist: {
        // compress for production :)
        yuicompress: true,
        files: {
          '<%= project.dist %>/styles/main.css': '<%= project.app %>/styles/main.less'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "app/js",
          mainConfigFile: "app/js/main.js",
          include: ["main"],
          out: "dist/js/main.js",
          optimize: "none",
          preserveLicenseComments: false,
          useStrict: true,
          wrap: true
        }
      }
    },


    // useminPrepare scans files for <!-- build:(js|css) --> blocks
    // and injects config into the grunt-contrib-concat task
    useminPrepare: {
      html: '<%= project.app %>/index.html',
      options: {
        dest: '<%= project.dist %>'
      }
    },

    usemin: {
      html: ['<%= project.dist %>/{,*/}*.html'],
      css: ['<%= project.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= project.dist %>']
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= project.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= project.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          collapseBolleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true
        },
        files: {
          '<%= project.dist %>/index.html': '<%= project.dist %>/index.html'
        }
      }
    },

    rev: {
      options: {
        algorithm: 'sha512',
        length: 16
      },
      files: {
        src: ['<%= project.dist %>/js/*.js', '<%= project.dist %>/styles/*.css'],
      }
    },

    // A whitelist of extra files to copy
    // Processed assets like JS, CSS, Images, etc are all copied over
    // by their respective tasks.
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= project.app %>',
          dest: '<%= project.dist %>',
          src: [
            'index.html',
            'audio/*.mp3',
            'video/*',
            'components/soundmanager/swf/*',
            'components/font-awesome/font/*',
            '*.{ico,txt}',
            '.htaccess',
            'images/*'
          ]
        }]
      }
    },

    bower: {
        options: {
            exclude: ['modernizr']
        },
        all: {
            rjsConfig: '<%= yeoman.app %>/js/main.js'
        }
    },

    cdn: {
      dist: {
        src: ['<%= project.dist %>/index.html'],
        cdn: 'http://bulga.theglobalmail.org'
      },

      staging: {
        src: ['<%= cdn.dist.src %>'],
        cdn: 'http://tennant-creek-staging-assets.theglobalmail.org'
      }
    },

    cloudfiles: {
      staging: {
        user: 'theglobalmail',
        key: process.env.RACKSPACE_API_KEY,
        upload: [{
          container: 'tennant-creek-staging',
          src: '<%= project.dist %>/**/*',
          dist: '',
          stripcomponents: 1
        }]
      },

      dist: {
        user: 'theglobalmail',
        key: process.env.RACKSPACE_API_KEY,
        upload: [{
          container: 'tennant-creek',
          src: '<%= project.dist %>/**/*',
          dist: '',
          stripcomponents: 1
        }]
      }
    }
  });

  grunt.registerTask('server', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'jshint:with_overrides',
      'less:server',
      'connect:livereload',
      'watch'
    ]);
  });

  // builds the project in /dist
  // target can be dev, staging, production
  // these targets change which CDN URL to use, or none for dev
  grunt.registerTask('build', function(target) {
    var targets = [
      'jshint:with_overrides',
      'clean:dist',
      'less:dist',
      'requirejs',
      'useminPrepare',
      'imagemin',
      'concat', // concat configuration is generated by the useminPrepare task
      'copy:dist',
      'uglify',
      'rev',
      'usemin'
    ];

    // allow building with different CDN URLs
    if (target === 'staging') {
      targets.push('cdn:staging');
    } else if (target !== 'dev') {
      targets.push('cdn:dist');
    }

    targets.concat([
      'htmlmin'
    ]);

    grunt.task.run(targets);
  });

  // TODO: Testing
  grunt.registerTask('test');

  grunt.registerTask('deploy', function(target) {
    // Build and deploy

    if (process.env['RACKSPACE_API_KEY'] === undefined) {
      throw new TypeError('Specify the `RACKSPACE_API_KEY` property in local_config.json');
    }

    // Deploy targets
    var targetToTask = {
      'production': [
        'build',
        'cloudfiles:dist'
      ],
      'staging': [
        'build:staging',
        'cloudfiles:staging'
      ]
    };

    if (targetToTask[target] === undefined) {
      throw new TypeError('Select a target destination from: ' + _(targetToTask).keys().join(', '));
    }

    var tasks = targetToTask[target].concat('clean:dist');

    grunt.task.run(tasks);
  });

  // default is run if you invoke grunt without a target
  grunt.registerTask('default', 'build');
};
