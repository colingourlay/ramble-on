var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'index.js',
    path: path.resolve('./dist'),
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      { test: /vendor/, loader: 'file?name=[path][name].[ext]&context=src'},
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1&localIdentName=[hash:base64:5]&modules!postcss') },
      { test: /\.svg$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },

  postcss: [
    require('autoprefixer-core')
  ],

  resolve: {
    modulesDirectories: ['node_modules', 'components']
  },

  plugins: [
    new ExtractTextPlugin('style.css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      title: 'Ramble On',
      template: 'src/index.html',
      inject: 'body'
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
};
