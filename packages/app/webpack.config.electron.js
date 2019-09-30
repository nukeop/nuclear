/* eslint-env node */
const webpack = require('webpack');
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
          loader: 'babel-loader', 
          options: {cacheDirectory: true},
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new webpack.NamedModulesPlugin()
    ],
    node: {
      fs: 'empty',
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  };
};
