/* eslint-env node */
const webpack = require('webpack');

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
    module: {
      rules: [
        {
          test: /.jsx?$/,
          loader: 'babel-loader',
          options: {cacheDirectory: true},
          exclude: /node_modules\/(?!@nuclear).*/
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
