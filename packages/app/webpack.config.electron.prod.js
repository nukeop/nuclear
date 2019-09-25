/* eslint-env node */

module.exports = env => {
  let entry = env && env.LINUX ? './server/main.prod.linux.js' : './server/main.prod.js';

  return {
    entry,
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
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      ]
    },
    plugins: [],
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
