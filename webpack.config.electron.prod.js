const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
  let entry = env && env.LINUX ? './server/main.prod.linux.js' : './server/main.prod.js';

  return {
    entry: entry,
    output: {
      path: __dirname,
      filename: './dist/bundle.electron.js'
    },
    module: {
      loaders: [
        {
          test: /.jsx?$/,
          use: 'happypack/loader?id=jsx',
          exclude: /node_modules/
        },
        {
          test: /.node$/,
          use: 'node-loader'
        }
      ]
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HappyPack({
        id: 'jsx',
        loaders: [ 'babel-loader' ]
      }),
      new UglifyJsPlugin()
    ],
    node: {
      fs: "empty",
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  }
};
