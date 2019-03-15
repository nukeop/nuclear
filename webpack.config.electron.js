/* eslint-env node */
const webpack = require('webpack');
const HappyPack = require('happypack');

module.exports = env => {
  const entry = env && env.LINUX ? './server/main.dev.linux.js' : './server/main.dev.js';

  return {
    entry: entry,
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
