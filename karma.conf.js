/* global module */
"use strict";

module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      {pattern: 'bower_components/angular/angular.js', included: true},
      {pattern: 'bower_components/angular-route/angular-route.js', included: true},
      {pattern: 'bower_components/angular-animate/angular-animate.js', included: true},
      {pattern: 'bower_components/angular-mocks/angular-mocks.js', included: true},
      {pattern: 'app/scripts/app.js', included: true},
      {pattern: 'app/scripts/config.js', included: true},
      {pattern: 'app/scripts/components/**/*.js', included: true},
      {pattern: 'app/scripts/view*/**/*.js', included: false},
      
      
      // needs to be last http://karma-runner.github.io/0.12/plus/requirejs.html
      'specs/specs-config.js',
      {pattern: 'specs/scripts/**/*.js', included: false}
    ],

    autoWatch : true,

    frameworks: ['jasmine', 'requirejs'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-requirejs',
            'karma-junit-reporter'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
