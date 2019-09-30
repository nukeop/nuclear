const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');
const RESOURCES_DIR = path.resolve(__dirname, 'resources');

const UI_DIR = path.resolve(__dirname, '..', 'ui');

const config = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.resolve(APP_DIR, 'index.js')
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    hot: true,
    contentBase: '/',
    publicPath: '/'
  },
  mode: 'development',
  devtool: 'source-map',
  optimization: {
    namedModules: true
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        include: [
          APP_DIR,
          UI_DIR
        ]
      },
      {
        test: /.scss$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=1&modules&localIdentName=[local]!sass-loader'
        ]
      },
      {
        test: /\.css/,
        loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
      }, {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        include: RESOURCES_DIR
      }, {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        loader: 'url-loader',
        include: /..\/ui/
      }, {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      minify: {
        html5: true,
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true
      },
      inject: true
    })
  ],
  target: 'electron-renderer'
};

module.exports = config;
