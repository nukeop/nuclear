const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const LIB_DIR = path.resolve(__dirname, 'lib');


module.exports = {
  entry: path.resolve(LIB_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: BUILD_DIR,
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  mode: 'production',
  optimization: {
    namedModules: true
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  target: 'electron-renderer'
};
