module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['../build/scripts/**/*.js', '../build/scripts/*.js']
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      buildminify: {
        src: [
          '../build/scripts/**/*.js',
          '../build/scripts/*.js'
        ],
        dest: '../dist/app.min.js'
      },
      buildnominify: {
        options: {
          beautify: true,
          compress: false
        },
        src: [
          '../build/scripts/**/*.js',
          '../build/scripts/*.js'
        ],
        dest: '../dist/app.nomin.js'
      }
    },
    //Concatination of all bower_components
    concat: {
      js: {
        src: [
          './bower_components/angular/angular.js',
          './bower_components/angular-resource/angular-resource.js',
          './bower_components/angular-route/angular-route.js',
          './bower_components/jquery/dist/jquery.js',
          './bower_components/angular-animate/angular-animate.js',
          './bower_components/sass-bootstrap/dist/js/bootstrap.js',
          './bower_components/angular-base64-upload/dist/angular-base64-upload.js'
        ],
        dest: '../dist/dependencies.min.js'
      },
      css: {
        src: [
          './bower_components/sass-bootstrap/dist/css/bootstrap-theme.min.css',
          './bower_components/sass-bootstrap/dist/css/bootstrap.min.css',
        ],
        dest: '../dist/dependencies.min.css'
      }
    },
    sass: {
      dist: {
        options: {
          style: 'compressed',
          trace: true,
          sourcemap: 'none',
          lineNumbers: true
        },
        files: {
          '../dist/app.min.css': '../build/sass/screen.scss'
        }
      }
    },
    watch: {
      css: {
        files: ['../build/sass/*.scss', '../build/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: ['../build/scripts/**/*.js', '../build/scripts/*.js'],
        tasks: ['jshint', 'uglify'],
        options: {
          livereload: true
        }
      }
    }
  });

  // Load the plugin that provides the tasks regarding grunt.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['watch', 'concat']);

};