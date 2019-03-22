/* eslint-env node */
const HappyPack = require('happypack');

module.exports = env => {
  let entry = env && env.LINUX ? './server/main.prod.linux.js' : './server/main.prod.js';

  return {
    externals: {
      bindings: 'require("bindings")',
      'abstract-socket': 'require("abstract-socket")'
    },
    entry: entry,
    output: {
      path: __dirname,
      filename: './dist/bundle.electron.js'
    },
    mode: 'production',
    optimization: {
      namedModules: true
    },
    stats: {
      warningsFilter: 'express'
    },
    module: {
      rules: [
        {
          test: /.jsx?$/,
          use: 'happypack/loader?id=jsx'
        }
      ]
    },
    plugins: [
      new HappyPack({
        id: 'jsx',
        loaders: ['babel-loader']
      })
    ],
    externals: {
      dbus: 'dbus'
    },
    node: {
      fs: 'empty',
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  };
};
