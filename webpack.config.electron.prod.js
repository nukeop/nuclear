const webpack = require('webpack');
const path = require('path');
const HappyPack = require('happypack');

module.exports = env => {
  let entry = env && env.LINUX ? './server/main.prod.linux.js' : './server/main.prod.js';

  return {
    entry: entry,
    output: {
      path: __dirname,
      filename: './dist/bundle.electron.js'
    },
    mode: 'production',
    optimization: {
      namedModules: true,
      minimize: true
    },
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
      new HappyPack({
        id: 'jsx',
        loaders: [ 'babel-loader' ]
      })
    ],
    node: {
      fs: "empty",
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  };
};
