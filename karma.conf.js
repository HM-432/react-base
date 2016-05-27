var path = require('path');

module.exports = function karmaConfig(config) {
  config.set({
    frameworks: ['mocha'],
    reporters: ['spec', 'coverage'],
    files: ['node_modules/phantomjs-polyfill/bind-polyfill.js', 'tests/*_test.js'],
    preprocssors: {
      'tests/*_test.js': ['babel', 'webpack', 'sourcemap']
    },
    browsers: ['PhantomJS'],
    singleRun: true,
    coverageReporter: {
      dir: 'build/coverage/',
      type: 'html'
    },
    webpack: require('./webpack.config.js'),
    webpackMiddleware: {
      noInfo: true
    }
  });
};