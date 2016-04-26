var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserWebPackPlugin = require('open-browser-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname);
var TARGET = process.env.npm_lifecycle_event;

//Setting babel environment
process.env.BABEL_ENV = TARGET;

//Basic parameter config
var config = {
  appPath: path.resolve(ROOT_PATH, 'app'),
  buildPath: path.resolve(ROOT_PATH, 'build'),
  port: 9191
};

//Webpack common config for different environments
var webpackCommonConfig = {
  entry: config.appPath,
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: config.buildPath,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      loaders:['eslint'],
      include: config.appPath
    }],
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less',
        include: config.appPath
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: config.appPath
      }
    ]
  }
};

var webpackConfig = {
  development: merge(webpackCommonConfig, {
    devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      port: config.port
    },
    plugins: [
      new HtmlwebpackPlugin({ title: 'Kanban app' }),
      new webpack.HotModuleReplacementPlugin(),
      new OpenBrowserWebPackPlugin({url: 'http://localhost:' + config.port})
    ]
  }),
  production: merge(webpackCommonConfig, {

  })
};

if (TARGET === 'start' || !TARGET) {
  module.exports = webpackConfig.development;
} else {
  process.exit(1);
}