/* eslint-env node */
const webpack = require('webpack');
const HappyPack = require('happypack');
const nodeExternals = require('webpack-node-externals');

module.exports = () => {
  const entry = './server/main.dev.js';

  return {
    entry,
    output: {
      path: __dirname,
      filename: 'bundle.electron.js'
    },
    mode: 'development',
    stats: {
      warningsFilter: 'express'
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /.jsx?$/,
          use: 'happypack/loader?id=jsx',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new webpack.NamedModulesPlugin(),
      new HappyPack({
        id: 'jsx',
        loaders: ['babel-loader']
      })
    ],
    node: {
      fs: 'empty',
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  };
};
