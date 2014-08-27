/* custom grunt file made by Rogliano Antoine
great compatibility with RequireJS */
module.exports = function(grunt)
{
  'use strict';
  
  var compileSettings = grunt.file.readJSON('compileSettings.json');
  grunt.initConfig(
  {
    pkg: grunt.file.readJSON('package.json') // TODO - not used yet, improve header making with grunt
    
    , clean: {
      assets: [ 'release/img/*', 'release/audio/*' ]
    }
    
    , requirejs: { // requirejs compil
      app: {
        options: {
          findNestedDependencies: true
          , mainConfigFile: '_dev/js/files.js'
          , baseUrl : '_dev/js/'
          , name : 'main'
          , out : 'release/temp/game.js'
          , optimize : 'uglify' // uglify or none
          , uglify: {
            toplevel: true
            , ascii_only: true
            , beautify: false
            , max_line_length: 1000
          }
          , closure: {
            CompilerOptions: {}
            ,CompilationLevel: 'SIMPLE_OPTIMIZATIONS'
            ,loggingLevel: 'WARNING'
          }
          , inlineText: true
          , useStrict: false
        }
      }
    }
    
    // create concat foreach platform
    , concat: {
      web: {
        src: [
          'HEADER.txt',
          'release/temp/game.js'
        ],
        dest: 'release/web/game.js'
      }
      , W8: {
        src: [
          'HEADER.txt',
          'release/temp/game.js'
        ],
        dest: 'release/W8/game.js'
      }
      , WP8: {
        src: [
          'HEADER.txt',
          'release/temp/game.js'
        ],
        dest: 'release/WP8/game.js'
      }
      , WP8_1: {
        src: [
          'HEADER.txt',
          'release/temp/game.js'
        ],
        dest: 'release/WP8_1/game.js'
      }
      , tizen: {
        src: [
          'HEADER.txt',
          'release/temp/game.js'
        ],
        dest: 'release/tizen/game.js'
      }
      , css: {
        src: [
          '_dev/css/**/*.css'
        ],
        dest: 'release/_common/style.css'
      }
    }
    
    // move prod files to prod dir
    , copy: { // copy something in given dest
      assets: {
        expand: true,
        flatten: false,
        cwd: '_dev',
        src: [ 'audio/**/*', 'img/**/*' ],
        dest: 'release/_common/'
      }
      , require: {
        expand: true,
        flatten: true,
        src: [ '_dev/js/ext_libs/require.js' ],
        dest: 'release/_common/'
      }
    }
    
    // replacement for platforms custom
    , "string-replace": {
      setupW8: compileSettings.platforms.W8.setup
      ,cleanW8: compileSettings.platforms.W8.clean
      ,setupWP8_1: compileSettings.platforms.WP8_1.setup
      ,cleanWP8_1: compileSettings.platforms.WP8_1.clean
      ,setupWP8: compileSettings.platforms.WP8.setup
      ,cleanWP8: compileSettings.platforms.WP8.clean
      ,setupTizen: compileSettings.platforms.tizen.setup
      ,cleanTizen: compileSettings.platforms.tizen.clean
    }
  } );
  
  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-string-replace');
  
  // Default task.
  grunt.registerTask( 'default', [ 'assets', 'web', 'W8', 'WP8', 'WP8_1', 'tizen' ] );
  grunt.registerTask( 'assets', [ 'clean:assets', 'copy', 'concat:css' ] );
  grunt.registerTask( 'web', [ 'requirejs', 'concat:web' ] );
  grunt.registerTask( 'W8', [  'string-replace:setupW8', 'requirejs', 'concat:W8', 'string-replace:cleanW8' ] );
  grunt.registerTask( 'WP8', [  'string-replace:setupWP8', 'requirejs', 'concat:WP8', 'string-replace:cleanWP8' ] );
  grunt.registerTask( 'WP8_1', [  'string-replace:setupWP8_1', 'requirejs', 'concat:WP8_1', 'string-replace:cleanWP8_1' ] );
  grunt.registerTask( 'tizen', [  'string-replace:setupTizen', 'requirejs', 'concat:tizen', 'string-replace:cleanTizen' ] );
};