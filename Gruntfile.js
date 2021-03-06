module.exports = function(grunt) {
  grunt.initConfig({
    modulename: 'hljs',
    pkg: grunt.file.readJSON('package.json'),
    dir: {
      src: 'src',
      build: 'build'
    },
    meta: {
      banner: 
        '/*! <%= pkg.name %>\n' + 
        'version: <%= pkg.version %>\n' +
        'build date: <%= grunt.template.today("yyyy-mm-dd") %>\n' + 
        'author: <%= pkg.author.name %>\n' + 
        '<%= pkg.repository.url %> */'
    },
    jshint: {
      beforeuglify: ['<%= dir.src %>/<%= pkg.name %>.js'],
      gruntfile: ['Gruntfile.js']
    },
    concat: {
      options: {
        banner: '<%= meta.banner %>\n\n'+
                '/* commonjs package manager support (eg componentjs) */\n'+
                'if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){\n'+
                '  module.exports = \'<%= modulename %>\';\n'+
                '}\n\n'+
                '(function (window, angular, undefined) {\n',
        footer: '})(window, window.angular);'
      },
      build: {
        src: '<%= dir.src %>/<%= pkg.name %>.js',
        dest: '<%= dir.build %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: true,
        banner: '<%= meta.banner %>\n'
      },
      build: {
        src: '<%= dir.build %>/<%= pkg.name %>.js',
        dest: '<%= dir.build %>/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      build: {
        expand: true,
        flatten: true,
        src: '<%= dir.build %>/*',
        dest: '.'
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
      },
      src: {
        files: '<%= dir.src %>/<%= pkg.name %>.js',
        tasks: ['default'],
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          base: '',
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [
    'jshint:beforeuglify',
    'concat:build', 'uglify:build', 'copy:build'
  ]);
};

