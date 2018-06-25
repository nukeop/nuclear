const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');

module.exports = env => {
  let entry = env && env.LINUX ? './server/main.dev.linux.js' : './server/main.dev.js';

  return {
    entry: entry,
    output: {
      path: __dirname,
      filename: 'bundle.electron.js'
    },
    mode: 'development',
    module: {
      rules: [
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
    ],
    node: {
      fs: "empty",
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  }
};
