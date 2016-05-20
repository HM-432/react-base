//base
var path = require('path');
var webpack = require('webpack');

//plugins
var merge = require('webpack-merge');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserWebPackPlugin = require('open-browser-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//variables
var pkg = require('./package.json')
var ROOT_PATH = path.resolve(__dirname);
var TARGET = process.env.npm_lifecycle_event;
var APP_PATH = path.resolve(ROOT_PATH, 'app');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');

//Setting babel environment
process.env.BABEL_ENV = TARGET;

//Basic parameter config
var config = {
  appPath: APP_PATH,
  buildPath: BUILD_PATH,
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
        test: /\.jsx?$/,
        loader: 'babel',
        include: config.appPath,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          env:{
            build: {
            },
            start: {
            }
          }
        }
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
    module: {
      loaders: [
        {
          test: /\.less$/,
          loader: 'style!css!less',
          include: config.appPath
        }
      ]
    },
    plugins: [
      new HtmlwebpackPlugin({ title: 'Kanban app' }),
      new webpack.HotModuleReplacementPlugin(),
      new OpenBrowserWebPackPlugin({url: 'http://localhost:' + config.port})
    ]
  }),
  production: merge(webpackCommonConfig, {
    devtool: "source-map",
    "entry": {
      "app": config.appPath,
      "vendor": Object.keys(pkg.dependencies)
    },
    "output": {
      "path": config.buildPath,
      "filename": '[name].[chunkhash].js?'
    },
    module: {
      loaders: [
        {
          "test": /\.less$/,
          "loader": ExtractTextPlugin.extract(['css','less']),
           include: config.appPath
        }
      ]
    },
    "plugins": [
      new Clean(['build']),
      new ExtractTextPlugin('style.[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin(
        "vendor",
        '[name].[chunkhash].js'
      ),
      new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new HtmlwebpackPlugin({ title: 'Kanban app' })
    ]
  })
};

if (TARGET === 'start' || !TARGET) {
  module.exports = webpackConfig.development;
} else {
  module.exports = webpackConfig.production;
}