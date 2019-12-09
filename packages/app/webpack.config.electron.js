module.exports = (env) => {
  const IS_PROD = env.NODE_ENV === 'production';

  const jsxRule = {
    test: /.jsx?$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        ['@babel/preset-env', {
          targets: {
            electron: '4.2'
          }
        }]
      ],
      plugins: [
        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread'
      ],
      ignore: [/node_modules/]
    },
    exclude: /node_modules\/(?!@nuclear).*/
  };

  if (IS_PROD) {
    delete jsxRule.exclude;
  }

  return {
    entry: IS_PROD ? './server/main.prod.js' : './server/main.dev.js',
    resolve: {
      alias: {
        jsbi: __dirname + '/node_modules/jsbi/dist/jsbi-cjs.js'
      }
    },
    output: {
      path: __dirname,
      filename: IS_PROD ? './dist/bundle.electron.js' : './bundle.electron.js'
    },
    mode: IS_PROD ? 'production' : 'development',
    // stats: 'errors-only',
    stats: 'minimal',
    optimization: { namedModules: true },
    module: {
      rules: [jsxRule]
    },
    node: {
      fs: 'empty',
      __dirname: false,
      __filename: false
    },
    target: 'electron-main'
  };
};
