const webpack = require('webpack');
const path = require('path');
const GoogleFontsPlugin = require("google-fonts-webpack-plugin");

const BUILD_DIR = path.resolve(__dirname, 'dist');
const APP_DIR = path.resolve(__dirname, 'app');

const config = {
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: BUILD_DIR
  },
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }, {
        test: /\.css/,
        loader: 'style-loader!css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]'
      }, {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?importLoaders=1&modules&localIdentName=[local]!sass-loader'
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new GoogleFontsPlugin({
      fonts: [
        {
          family: 'lato',
          variants: ['regular', '300', '700']
        }
      ]
    })
  ],
  target: 'electron-main'
};

module.exports = config;
