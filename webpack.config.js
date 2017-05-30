const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');

module.exports = {
  entry: {
    app: path.resolve(APP_DIR, 'index.js')
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/'
  },
  devServer: {
    hot: true,
    contentBase: BUILD_DIR,
    publicPath: 'http://localhost:8080/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        include: APP_DIR
      },
      {
        test: /\.css/,
        loader: "style-loader!css-loader?sourceMap"
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
};
